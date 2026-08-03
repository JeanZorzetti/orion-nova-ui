import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para atualização de transação
const updateTransactionSchema = z.object({
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
  paidAt: z.string().optional().nullable(),
});

// GET /api/financial/[id] - Buscar transação
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const transaction = await prisma.financialTransaction.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
      include: {
        customer: true,
        order: {
          include: {
            customer: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    // Converter Decimal para número
    const formattedTransaction = {
      ...transaction,
      amount: Number(transaction.amount),
    };

    return NextResponse.json(formattedTransaction);
  } catch (error) {
    console.error("Erro ao buscar transação:", error);
    return NextResponse.json(
      { error: "Erro ao buscar transação" },
      { status: 500 }
    );
  }
}

// PATCH /api/financial/[id] - Atualizar transação
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateTransactionSchema.parse(body);

    // Verificar se a transação existe e pertence ao usuário
    const existingTransaction = await prisma.financialTransaction.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    const transaction = await prisma.financialTransaction.update({
      where: { id },
      data: {
        status: validatedData.status,
        paidAt: validatedData.paidAt ? new Date(validatedData.paidAt) : undefined,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar transação:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar transação" },
      { status: 500 }
    );
  }
}

// DELETE /api/financial/[id] - Deletar transação
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se a transação existe e pertence ao usuário
    const existingTransaction = await prisma.financialTransaction.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transação não encontrada" },
        { status: 404 }
      );
    }

    // Não permitir deletar transações já pagas
    if (existingTransaction.status === "PAID") {
      return NextResponse.json(
        { error: "Não é possível excluir uma transação já paga" },
        { status: 400 }
      );
    }

    await prisma.financialTransaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Transação excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar transação:", error);
    return NextResponse.json(
      { error: "Erro ao deletar transação" },
      { status: 500 }
    );
  }
}
