import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/trial-status - Buscar status do trial
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.accountId },
      select: {
        subscriptionStatus: true,
        trialEndsAt: true,
        createdAt: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const now = new Date();
    const status = user.subscriptionStatus;

    // Se tem assinatura ativa
    if (user.subscriptions.length > 0) {
      const subscription = user.subscriptions[0];
      return NextResponse.json({
        status: "ACTIVE",
        planName: subscription.plan.name,
        planSlug: subscription.plan.slug,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        isTrial: false,
      });
    }

    // Se está em trial
    if (status === "TRIAL" && user.trialEndsAt) {
      const trialEndsAt = new Date(user.trialEndsAt);
      const diffTime = trialEndsAt.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Se o trial expirou
      if (daysRemaining <= 0) {
        // Atualizar status para EXPIRED
        await prisma.user.update({
          where: { id: session.user.accountId },
          data: { subscriptionStatus: "EXPIRED" },
        });

        return NextResponse.json({
          status: "EXPIRED",
          daysRemaining: 0,
          trialEndsAt: user.trialEndsAt,
          isTrial: false,
        });
      }

      return NextResponse.json({
        status: "TRIAL",
        daysRemaining,
        trialEndsAt: user.trialEndsAt,
        isTrial: true,
        isExpiringSoon: daysRemaining <= 7, // Flag para mostrar avisos
      });
    }

    // Se está expirado ou cancelado
    if (status === "EXPIRED" || status === "CANCELLED") {
      return NextResponse.json({
        status,
        daysRemaining: 0,
        isTrial: false,
      });
    }

    // Fallback: usuário sem trial definido - criar trial de 30 dias
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    await prisma.user.update({
      where: { id: session.user.accountId },
      data: {
        subscriptionStatus: "TRIAL",
        trialEndsAt,
      },
    });

    return NextResponse.json({
      status: "TRIAL",
      daysRemaining: 30,
      trialEndsAt,
      isTrial: true,
      isExpiringSoon: false,
    });
  } catch (error: any) {
    console.error("Erro ao buscar trial status:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar trial status" },
      { status: 500 }
    );
  }
}
