import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/subscriptions - Listar assinaturas do usuário logado
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Se userId for fornecido e o usuário for admin, buscar para esse usuário
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
    const targetUserId = userId && isAdmin ? userId : session.user.id;

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: targetUserId,
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Buscar usuário para incluir informações de trial
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        subscriptionStatus: true,
        trialEndsAt: true,
      },
    });

    return NextResponse.json({
      subscriptions,
      user,
    });
  } catch (error) {
    console.error("Erro ao listar assinaturas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar assinaturas" },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Criar nova assinatura
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "ID do plano é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se o plano existe e está ativo
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: "Plano não encontrado ou inativo" },
        { status: 404 }
      );
    }

    // Verificar se já tem assinatura ativa
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (activeSubscription) {
      return NextResponse.json(
        { error: "Você já possui uma assinatura ativa" },
        { status: 400 }
      );
    }

    // Criar assinatura
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planId,
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      },
      include: {
        plan: true,
      },
    });

    // Atualizar status do usuário
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: "ACTIVE",
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    return NextResponse.json(
      { error: "Erro ao criar assinatura" },
      { status: 500 }
    );
  }
}

// PUT /api/subscriptions - Atualizar assinatura (upgrade/downgrade)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, planId, cancelAtPeriodEnd } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID da assinatura é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se a assinatura pertence ao usuário
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription || subscription.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {};

    if (planId) updateData.planId = planId;
    if (typeof cancelAtPeriodEnd !== "undefined") {
      updateData.cancelAtPeriodEnd = cancelAtPeriodEnd;
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
      include: {
        plan: true,
      },
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Erro ao atualizar assinatura:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar assinatura" },
      { status: 500 }
    );
  }
}

// DELETE /api/subscriptions - Cancelar assinatura
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da assinatura é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se a assinatura pertence ao usuário
    const subscription = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription || subscription.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 }
      );
    }

    // Cancelar assinatura
    const canceledSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
        cancelAtPeriodEnd: true,
      },
      include: {
        plan: true,
      },
    });

    return NextResponse.json({
      message: "Assinatura cancelada com sucesso",
      subscription: canceledSubscription,
    });
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar assinatura" },
      { status: 500 }
    );
  }
}
