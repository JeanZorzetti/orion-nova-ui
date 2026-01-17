import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
        userId: session.user.id,
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
