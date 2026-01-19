import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/coupons/validate - Validar cupom
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, planPrice } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Código do cupom é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar cupom
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Cupom não encontrado", valid: false },
        { status: 404 }
      );
    }

    // Verificar se está ativo
    if (!coupon.isActive) {
      return NextResponse.json(
        { error: "Cupom inativo", valid: false },
        { status: 400 }
      );
    }

    // Verificar data de validade
    const now = new Date();
    if (coupon.validFrom > now) {
      return NextResponse.json(
        { error: "Cupom ainda não está válido", valid: false },
        { status: 400 }
      );
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json(
        { error: "Cupom expirado", valid: false },
        { status: 400 }
      );
    }

    // Verificar limite de usos
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: "Cupom atingiu o limite de usos", valid: false },
        { status: 400 }
      );
    }

    // Calcular desconto
    let discountAmount = 0;
    let finalPrice = planPrice || 0;

    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (finalPrice * Number(coupon.discountValue)) / 100;
      finalPrice = finalPrice - discountAmount;
    } else if (coupon.discountType === "FIXED_AMOUNT") {
      discountAmount = Number(coupon.discountValue);
      finalPrice = Math.max(0, finalPrice - discountAmount);
    } else if (coupon.discountType === "FREE_TRIAL") {
      // Para trial gratuito, o desconto é aplicado como dias gratuitos
      // Neste caso, não altera o preço, mas adiciona dias
      discountAmount = Number(coupon.discountValue); // dias
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discount: {
        type: coupon.discountType,
        amount: discountAmount,
        originalPrice: planPrice,
        finalPrice: coupon.discountType === "FREE_TRIAL" ? planPrice : finalPrice,
        freeDays: coupon.discountType === "FREE_TRIAL" ? discountAmount : undefined,
      },
    });
  } catch (error) {
    console.error("Erro ao validar cupom:", error);
    return NextResponse.json(
      { error: "Erro ao validar cupom", valid: false },
      { status: 500 }
    );
  }
}

// POST /api/coupons/validate/apply - Aplicar cupom (incrementar uso)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { couponId } = body;

    if (!couponId) {
      return NextResponse.json(
        { error: "ID do cupom é obrigatório" },
        { status: 400 }
      );
    }

    // Incrementar contador de uso
    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error("Erro ao aplicar cupom:", error);
    return NextResponse.json(
      { error: "Erro ao aplicar cupom" },
      { status: 500 }
    );
  }
}
