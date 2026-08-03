import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/plans - Listar todos os planos ativos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const plans = await prisma.plan.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
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
    const session = await auth();

    // Apenas ADMIN e SUPER_ADMIN podem criar planos
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

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
      isActive,
      stripePriceId,
    } = body;

    // Validações básicas
    if (!name || !slug || price === undefined) {
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
        isActive: isActive !== undefined ? isActive : true,
        stripePriceId,
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

// Atualizar/desativar plano: PATCH e DELETE em /api/plans/[id], que checam a role.
