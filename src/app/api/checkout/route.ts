import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

// POST /api/checkout - Cria a Checkout Session da assinatura e devolve a URL da Stripe
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "ID do plano é obrigatório" },
        { status: 400 }
      );
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: "Plano não encontrado ou inativo" },
        { status: 404 }
      );
    }

    if (!plan.stripePriceId) {
      return NextResponse.json(
        { error: "Plano sem preço configurado na Stripe" },
        { status: 409 }
      );
    }

    const existing = await prisma.subscription.findFirst({
      where: { userId: session.user.id, status: { in: ["ACTIVE", "TRIALING"] } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Você já possui uma assinatura ativa." },
        { status: 409 }
      );
    }

    // Reaproveita o Customer da Stripe se o usuário já assinou alguma vez —
    // evita cadastro duplicado e mantém o histórico de cobrança junto.
    const previous = await prisma.subscription.findFirst({
      where: { userId: session.user.id, stripeCustomerId: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { stripeCustomerId: true },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkout = await getStripe().checkout.sessions.create({
      mode: "subscription",
      // Sem payment_method_types: a Stripe escolhe os métodos elegíveis pelo painel.
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      ...(previous?.stripeCustomerId
        ? { customer: previous.stripeCustomerId }
        : { customer_email: session.user.email ?? undefined }),
      client_reference_id: session.user.id,
      metadata: { userId: session.user.id, planId: plan.id },
      // O webhook de customer.subscription.* só enxerga o metadata da subscription.
      subscription_data: {
        metadata: { userId: session.user.id, planId: plan.id },
      },
      success_url: `${baseUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/precos`,
    });

    if (!checkout.url) {
      return NextResponse.json(
        { error: "Stripe não retornou URL de checkout" },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    return NextResponse.json(
      { error: "Erro ao iniciar o pagamento" },
      { status: 500 }
    );
  }
}
