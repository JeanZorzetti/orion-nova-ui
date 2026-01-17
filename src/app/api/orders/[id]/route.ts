import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para atualização de pedido
const updateOrderSchema = z.object({
  customerId: z.string().min(1, "Cliente é obrigatório").optional(),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Produto é obrigatório"),
      quantity: z.number().int().min(1, "Quantidade mínima é 1"),
      unitPrice: z.number().min(0, "Preço unitário inválido"),
    })
  ).min(1, "Pelo menos um item é obrigatório").optional(),
  discount: z.number().min(0, "Desconto não pode ser negativo").optional(),
  notes: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
});

// GET /api/orders/[id] - Buscar pedido
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

    const order = await prisma.salesOrder.findFirst({
      where: {
        id,
        userId: session.user.id,
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

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pedido" },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Atualizar pedido
export async function PUT(
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
    const validatedData = updateOrderSchema.parse(body);

    // Verificar se o pedido existe e pertence ao usuário
    const existingOrder = await prisma.salesOrder.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Só permitir editar pedidos em rascunho
    if (existingOrder.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Apenas pedidos em rascunho podem ser editados" },
        { status: 400 }
      );
    }

    // Se estiver atualizando itens, devolver estoque dos itens antigos
    if (validatedData.items) {
      for (const item of existingOrder.items) {
        if (item.product.type === "PRODUCT") {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      // Deletar itens antigos
      await prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      // Calcular novo subtotal
      let subtotal = 0;
      for (const item of validatedData.items) {
        subtotal += item.quantity * item.unitPrice;
      }

      const discount = validatedData.discount ?? existingOrder.discount;
      const total = Math.max(0, subtotal - Number(discount));

      // Atualizar pedido e criar novos itens
      const order = await prisma.salesOrder.update({
        where: { id },
        data: {
          customerId: validatedData.customerId || existingOrder.customerId,
          subtotal,
          discount,
          total,
          notes: validatedData.notes !== undefined ? validatedData.notes : existingOrder.notes,
          dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : existingOrder.dueDate,
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

      // Atualizar estoque dos novos produtos
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

      return NextResponse.json(order);
    } else {
      // Atualizar apenas campos simples
      const order = await prisma.salesOrder.update({
        where: { id },
        data: {
          customerId: validatedData.customerId,
          discount: validatedData.discount,
          notes: validatedData.notes !== undefined ? validatedData.notes : undefined,
          dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
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

      return NextResponse.json(order);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Deletar pedido
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

    // Verificar se o pedido existe e pertence ao usuário
    const existingOrder = await prisma.salesOrder.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Só permitir deletar pedidos em rascunho
    if (existingOrder.status !== "DRAFT") {
      return NextResponse.json(
        {
          error:
            "Apenas pedidos em rascunho podem ser excluídos. Cancele o pedido em vez disso.",
        },
        { status: 400 }
      );
    }

    // Devolver estoque dos produtos
    for (const item of existingOrder.items) {
      if (item.product.type === "PRODUCT") {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    await prisma.salesOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Pedido excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao deletar pedido" },
      { status: 500 }
    );
  }
}
