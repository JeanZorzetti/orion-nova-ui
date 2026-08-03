import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para criação de transação
const createTransactionSchema = z.object({
  type: z.enum(["RECEIVABLE", "PAYABLE"]),
  category: z.string().min(1, "Categoria é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  customerId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  dueDate: z.string().min(1, "Data de vencimento é obrigatória"),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]).default("PENDING"),
});

// GET /api/financial - Listar transações
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Construir filtros
    const where: any = {
      userId: session.user.accountId,
    };

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (startDate && endDate) {
      where.dueDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.dueDate = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.dueDate = {
        lte: new Date(endDate),
      };
    }

    // Buscar transações com paginação
    const [transactions, total] = await Promise.all([
      prisma.financialTransaction.findMany({
        where,
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
        orderBy: { dueDate: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.financialTransaction.count({ where }),
    ]);

    // Converter Decimals para números
    const formattedTransactions = transactions.map((t) => ({
      ...t,
      amount: Number(t.amount),
    }));

    return NextResponse.json({
      transactions: formattedTransactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar transações:", error);
    return NextResponse.json(
      { error: "Erro ao listar transações" },
      { status: 500 }
    );
  }
}

// POST /api/financial - Criar transação
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createTransactionSchema.parse(body);

    // Verificar se o cliente existe (se fornecido)
    if (validatedData.customerId) {
      const customer = await prisma.customer.findFirst({
        where: {
          id: validatedData.customerId,
          userId: session.user.accountId,
        },
      });

      if (!customer) {
        return NextResponse.json(
          { error: "Cliente não encontrado" },
          { status: 404 }
        );
      }
    }

    const transaction = await prisma.financialTransaction.create({
      data: {
        type: validatedData.type,
        category: validatedData.category,
        description: validatedData.description,
        amount: validatedData.amount,
        customerId: validatedData.customerId || null,
        orderId: validatedData.orderId || null,
        dueDate: new Date(validatedData.dueDate),
        status: validatedData.status,
        userId: session.user.accountId,
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

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao criar transação:", error);
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    );
  }
}
