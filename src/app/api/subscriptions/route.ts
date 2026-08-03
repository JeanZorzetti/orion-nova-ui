import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/subscriptions - Assinaturas da conta logada.
//
// POST, PUT e DELETE foram removidos em 03/08/2026. Nenhuma tela os chamava e
// os três mexiam em dinheiro sem falar com a Stripe:
//
//   POST   criava Subscription ACTIVE e marcava o usuário como ACTIVE — ou seja,
//          qualquer usuário logado se dava um plano pago de graça, sem cobrança.
//   PUT    trocava o planId no banco: upgrade sem pagar a diferença.
//   DELETE marcava CANCELED só no banco; a Stripe seguia cobrando o cliente que
//          achava ter cancelado. É o mesmo bug que matou /api/subscriptions/cancel
//          na sessão do G1.
//
// O caminho real é /api/checkout (assinar) e /api/billing/portal (trocar cartão,
// mudar plano, cancelar). Quem cria e altera Subscription é o webhook da Stripe.
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
    // A assinatura é da conta, não de quem está logado: um membro de equipe
    // precisa ver o plano vigente, que é o que libera o acesso dele.
    const targetUserId = userId && isAdmin ? userId : session.user.accountId;

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
