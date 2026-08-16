import { NextRequest, NextResponse } from "next/server";
import { authOrApiKey } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para criação de pedido
const createOrderSchema = z.object({
  customerId: z.string().min(1, "Cliente é obrigatório"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Produto é obrigatório"),
      quantity: z.number().int().min(1, "Quantidade mínima é 1"),
      unitPrice: z.number().min(0, "Preço unitário inválido"),
    })
  ).min(1, "Pelo menos um item é obrigatório"),
  discount: z.number().min(0, "Desconto não pode ser negativo").default(0),
  notes: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"]).default("DRAFT"),
  paymentStatus: z.enum(["PENDING", "PARTIAL", "PAID", "OVERDUE"]).default("PENDING"),
  dueDate: z.string().optional().nullable(),
});

// Gerar número de pedido automático
async function generateOrderNumber(userId: string): Promise<string> {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  // Buscar último pedido do usuário
  const lastOrder = await prisma.salesOrder.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true },
  });

  let sequence = 1;

  if (lastOrder && lastOrder.orderNumber.startsWith(`PV${year}${month}`)) {
    // Extrair sequência do último pedido
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
    sequence = lastSequence + 1;
  }

  return `PV${year}${month}${String(sequence).padStart(4, "0")}`;
}

// GET /api/orders - Listar pedidos
export async function GET(request: NextRequest) {
  try {
    const session = await authOrApiKey(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const customerId = searchParams.get("customerId");

    // Construir filtros
    const where: any = {
      userId: session.user.accountId,
    };

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    // Buscar pedidos com paginação
    const [orders, total] = await Promise.all([
      prisma.salesOrder.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.salesOrder.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    return NextResponse.json(
      { error: "Erro ao listar pedidos" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Criar pedido
export async function POST(request: NextRequest) {
  try {
    const session = await authOrApiKey(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Verificar se o cliente existe e pertence ao usuário
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

    // Calcular subtotal
    let subtotal = 0;
    for (const item of validatedData.items) {
      subtotal += item.quantity * item.unitPrice;
    }

    // Calcular total
    const total = subtotal - validatedData.discount;

    if (total < 0) {
      return NextResponse.json(
        { error: "O desconto não pode ser maior que o subtotal" },
        { status: 400 }
      );
    }

    // Gerar número do pedido
    const orderNumber = await generateOrderNumber(session.user.accountId);

    // Criar pedido com itens
    const order = await prisma.salesOrder.create({
      data: {
        orderNumber,
        customerId: validatedData.customerId,
        userId: session.user.accountId,
        subtotal,
        discount: validatedData.discount,
        total,
        status: validatedData.status,
        paymentStatus: validatedData.paymentStatus,
        notes: validatedData.notes || null,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        items: {
          create: validatedData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Atualizar estoque dos produtos
    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (product && product.type === "PRODUCT") {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
