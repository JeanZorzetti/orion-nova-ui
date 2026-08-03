import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createSalePaidNotification } from "@/lib/notifications";

// Schema de validação para registro de pagamento
const registerPaymentSchema = z.object({
  paymentStatus: z.enum(["PENDING", "PARTIAL", "PAID", "OVERDUE"]),
  paidAt: z.string().optional().nullable(),
});

// PATCH /api/orders/[id]/payment - Registrar pagamento
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
    const validatedData = registerPaymentSchema.parse(body);

    // Verificar se o pedido existe e pertence ao usuário
    const existingOrder = await prisma.salesOrder.findFirst({
      where: {
        id,
        userId: session.user.accountId,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar status de pagamento
    const order = await prisma.salesOrder.update({
      where: { id },
      data: {
        paymentStatus: validatedData.paymentStatus,
        paidAt: validatedData.paidAt ? new Date(validatedData.paidAt) : null,
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

    // Criar notificação se pagamento foi marcado como PAID
    if (
      validatedData.paymentStatus === "PAID" &&
      existingOrder.paymentStatus !== "PAID"
    ) {
      try {
        await createSalePaidNotification(
          session.user.accountId,
          order.id,
          order.orderNumber,
          Number(order.total),
          order.customer.name
        );
      } catch (notifError) {
        console.error("Erro ao criar notificação de venda paga:", notifError);
        // Não bloqueia o fluxo - pagamento já foi registrado
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao registrar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao registrar pagamento" },
      { status: 500 }
    );
  }
}
