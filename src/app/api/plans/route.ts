import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/plans - Listar todos os planos ativos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const plans = await prisma.plan.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: {
        price: "asc",
      },
    });

    return NextResponse.json({
      plans,
      count: plans.length,
    });
  } catch (error) {
    console.error("Erro ao listar planos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar planos" },
      { status: 500 }
    );
  }
}

// POST /api/plans - Criar novo plano (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      description,
      price,
      billingPeriod,
      features,
      maxUsers,
      maxStorage,
      stripePriceId,
      mercadoPagoId,
    } = body;

    // Validações básicas
    if (!name || !slug || !price) {
      return NextResponse.json(
        { error: "Nome, slug e preço são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se já existe plano com esse slug
    const existingPlan = await prisma.plan.findUnique({
      where: { slug },
    });

    if (existingPlan) {
      return NextResponse.json(
        { error: "Já existe um plano com este slug" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        slug,
        description,
        price,
        billingPeriod: billingPeriod || "MONTHLY",
        features: features || {},
        maxUsers,
        maxStorage,
        stripePriceId,
        mercadoPagoId,
        isActive: true,
      },
    });

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar plano:", error);
    return NextResponse.json(
      { error: "Erro ao criar plano" },
      { status: 500 }
    );
  }
}

// PUT /api/plans - Atualizar plano (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do plano é obrigatório" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.update({
      where: { id },
      data,
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Erro ao atualizar plano:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar plano" },
      { status: 500 }
    );
  }
}

// DELETE /api/plans - Desativar plano (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do plano é obrigatório" },
        { status: 400 }
      );
    }

    // Não deletar, apenas desativar
    const plan = await prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Plano desativado com sucesso",
      plan,
    });
  } catch (error) {
    console.error("Erro ao desativar plano:", error);
    return NextResponse.json(
      { error: "Erro ao desativar plano" },
      { status: 500 }
    );
  }
}
