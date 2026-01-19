import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH /api/coupons/[id] - Atualizar cupom
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      description,
      discountValue,
      maxUses,
      validUntil,
      isActive,
    } = body;

    // Verificar se cupom existe
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      );
    }

    // Validar valor do desconto se fornecido
    if (discountValue !== undefined) {
      if (existingCoupon.discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
        return NextResponse.json(
          { error: "Desconto percentual deve estar entre 0 e 100" },
          { status: 400 }
        );
      }

      if ((existingCoupon.discountType === "FIXED_AMOUNT" || existingCoupon.discountType === "FREE_TRIAL") && discountValue < 0) {
        return NextResponse.json(
          { error: "Valor do desconto deve ser positivo" },
          { status: 400 }
        );
      }
    }

    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(discountValue !== undefined && { discountValue }),
        ...(maxUses !== undefined && { maxUses }),
        ...(validUntil !== undefined && { validUntil: validUntil ? new Date(validUntil) : null }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(updatedCoupon);
  } catch (error) {
    console.error("Erro ao atualizar cupom:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cupom" },
      { status: 500 }
    );
  }
}

// DELETE /api/coupons/[id] - Deletar cupom
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Verificar se cupom existe
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { error: "Cupom não encontrado" },
        { status: 404 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cupom deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cupom:", error);
    return NextResponse.json(
      { error: "Erro ao deletar cupom" },
      { status: 500 }
    );
  }
}
