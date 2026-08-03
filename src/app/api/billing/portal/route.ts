import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { appUrl } from "@/lib/app-url";
import { isMember } from "@/lib/account";

// POST /api/billing/portal - abre o Customer Portal da Stripe.
// Substitui o cancelamento próprio, que marcava o banco e nunca cancelava na
// operadora — o cliente continuava sendo cobrado.
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // O portal expõe cartão, faturas e cancelamento da conta inteira. Só o dono.
    if (isMember(session)) {
      return NextResponse.json(
        { error: "Só o dono da conta gerencia a assinatura." },
        { status: 403 }
      );
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

    const baseUrl = appUrl();

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
