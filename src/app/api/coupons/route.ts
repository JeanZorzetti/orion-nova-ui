import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/coupons - Listar cupons (Admin only)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Erro ao buscar cupons:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cupons" },
      { status: 500 }
    );
  }
}

// POST /api/coupons - Criar cupom (Super Admin only)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const {
      code,
      description,
      discountType,
      discountValue,
      maxUses,
      validFrom,
      validUntil,
      isActive,
    } = body;

    // Validações
    if (!code || !discountType || !discountValue) {
      return NextResponse.json(
        { error: "Código, tipo de desconto e valor são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se código já existe
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: "Já existe um cupom com este código" },
        { status: 400 }
      );
    }

    // Validar tipo de desconto e valor
    if (discountType === "PERCENTAGE" && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { error: "Desconto percentual deve estar entre 0 e 100" },
        { status: 400 }
      );
    }

    if ((discountType === "FIXED_AMOUNT" || discountType === "FREE_TRIAL") && discountValue < 0) {
      return NextResponse.json(
        { error: "Valor do desconto deve ser positivo" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        maxUses: maxUses || null,
        validFrom: new Date(validFrom),
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cupom:", error);
    return NextResponse.json(
      { error: "Erro ao criar cupom" },
      { status: 500 }
    );
  }
}
