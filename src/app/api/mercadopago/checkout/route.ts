import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckoutPreference, PLANS, PlanId } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Você precisa estar logado para assinar um plano" },
        { status: 401 }
      );
    }

    const { planId } = await request.json();

    // Validar plano
    if (!planId || !PLANS[planId as PlanId]) {
      return NextResponse.json(
        { error: "Plano inválido" },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as PlanId];

    // Verificar se usuário já tem assinatura ativa
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "Você já possui uma assinatura ativa. Cancele a atual antes de assinar um novo plano." },
        { status: 400 }
      );
    }

    // Buscar plano no banco de dados
    let dbPlan = await prisma.plan.findUnique({
      where: { slug: planId },
    });

    // Se o plano não existe, criar
    if (!dbPlan) {
      dbPlan = await prisma.plan.create({
        data: {
          name: plan.name,
          slug: planId,
          description: plan.description,
          price: plan.price,
          features: plan.features,
          isActive: true,
        },
      });
    }

    // Criar preferência no Mercado Pago
    const preference = await createCheckoutPreference({
      planId: dbPlan.id,
      planName: plan.name,
      planPrice: plan.price,
      userId: session.user.id,
      userEmail: session.user.email!,
    });

    // Criar order pendente
    await prisma.order.create({
      data: {
        userId: session.user.id,
        planId: dbPlan.id,
        amount: plan.price,
        status: "PENDING",
        mercadoPagoPreferenceId: preference.id,
      },
    });

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    return NextResponse.json(
      { error: "Erro ao processar o checkout" },
      { status: 500 }
    );
  }
}
