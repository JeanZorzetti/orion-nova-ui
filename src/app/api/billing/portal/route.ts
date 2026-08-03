import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

// POST /api/billing/portal - abre o Customer Portal da Stripe.
// Substitui o cancelamento próprio, que marcava o banco e nunca cancelava na
// operadora — o cliente continuava sendo cobrado.
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id, stripeCustomerId: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { stripeCustomerId: true },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Nenhuma assinatura encontrada" },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const portal = await getStripe().billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${baseUrl}/assinaturas`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("Erro ao abrir portal de cobrança:", error);
    return NextResponse.json(
      { error: "Erro ao abrir o portal de cobrança" },
      { status: 500 }
    );
  }
}
