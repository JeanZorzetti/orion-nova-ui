import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getParser } from "@/lib/migration/parsers";
import * as XLSX from "xlsx";
import { z } from "zod";

const migrationInputSchema = z.object({
  sourceErp: z.enum(["OMIE", "BLING", "TINY", "CONTA_AZUL", "SAP", "TOTVS", "OTHER"], {
    errorMap: () => ({ message: "Selecione o ERP de origem" }),
  }),
  dataType: z.enum(["CUSTOMERS", "PRODUCTS", "ALL"], {
    errorMap: () => ({ message: "Selecione o tipo de dados" }),
  }),
});

// GET /api/migration - Histórico de migrações da conta
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const migrations = await prisma.dataMigration.findMany({
      where: { userId: session.user.accountId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        createdAt: true,
        sourceErp: true,
        dataType: true,
        status: true,
        fileName: true,
        totalRecords: true,
        processedRecords: true,
        successRecords: true,
        errorRecords: true,
      },
    });

    return NextResponse.json({ migrations });
  } catch (error: any) {
    console.error("Erro ao listar migrações:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao listar migrações" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Arquivo é obrigatório" },
        { status: 400 }
      );
    }

    // O `dataType` vinha do select e era descartado aqui: a rota importava
    // clientes e produtos independentemente da escolha.
    const entrada = migrationInputSchema.safeParse({
      sourceErp: formData.get("sourceErp"),
      dataType: formData.get("dataType"),
    });

    if (!entrada.success) {
      return NextResponse.json(
        { error: entrada.error.errors[0]?.message || "Dados inválidos" },
        { status: 400 }
      );
    }

    const { sourceErp, dataType } = entrada.data;

    // Validar tamanho do arquivo (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 10MB" },
        { status: 400 }
      );
    }

    // Criar registro de migração
    const migration = await prisma.dataMigration.create({
      data: {
        userId: session.user.accountId,
        sourceErp,
        dataType,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: "VALIDATING",
      },
    });

    try {
      // Processar o arquivo
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let data: any[] = [];

      // Parse baseado no tipo de arquivo
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        // Parse CSV
        const text = buffer.toString("utf-8");
        const lines = text.split("\n");
        const headers = lines[0].split(",").map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(",");
            const row: any = {};
            headers.forEach((header, index) => {
              row[header] = values[index]?.trim();
            });
            data.push(row);
          }
        }
      } else if (
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls")
      ) {
        // Parse Excel
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
      } else if (file.type === "application/json" || file.name.endsWith(".json")) {
        // Parse JSON
        const text = buffer.toString("utf-8");
        data = JSON.parse(text);
        if (!Array.isArray(data)) {
          data = [data];
        }
      } else {
        throw new Error("Formato de arquivo não suportado");
      }

      // Atualizar status para processando
      await prisma.dataMigration.update({
        where: { id: migration.id },
        data: {
          status: "PROCESSING",
          totalRecords: data.length,
        },
      });

      // Usar o parser apropriado
      const parser = getParser(sourceErp);
      const parsedData = parser.parse(data);

      // Estatísticas
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Importar clientes
      if (parsedData.customers && dataType !== "PRODUCTS") {
        for (const customer of parsedData.customers) {
          try {
            await prisma.customer.create({
              data: {
                ...customer,
                userId: session.user.accountId,
              },
            });
            successCount++;
          } catch (error: any) {
            errorCount++;
            errors.push(`Cliente "${customer.name}": ${error.message}`);
          }
        }
      }

      // Importar produtos
      if (parsedData.products && dataType !== "CUSTOMERS") {
        for (const product of parsedData.products) {
          try {
            await prisma.product.create({
              data: {
                ...product,
                type: "PRODUCT",
                userId: session.user.accountId,
              },
            });
            successCount++;
          } catch (error: any) {
            errorCount++;
            errors.push(`Produto "${product.name}": ${error.message}`);
          }
        }
      }

      // Atualizar migração como concluída
      await prisma.dataMigration.update({
        where: { id: migration.id },
        data: {
          status: errorCount === 0 ? "COMPLETED" : "PARTIAL",
          processedRecords: successCount + errorCount,
          successRecords: successCount,
          errorRecords: errorCount,
          errors: errors.length > 0 ? errors : null,
          completedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        migrationId: migration.id,
        totalRecords: data.length,
        successRecords: successCount,
        errorRecords: errorCount,
        errors: errors.slice(0, 10), // Retornar apenas os primeiros 10 erros
      });
    } catch (error: any) {
      // Atualizar migração como falha
      await prisma.dataMigration.update({
        where: { id: migration.id },
        data: {
          status: "FAILED",
          errors: [error.message],
          completedAt: new Date(),
        },
      });

      throw error;
    }
  } catch (error: any) {
    console.error("Erro na migração:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar migração" },
      { status: 500 }
    );
  }
}
