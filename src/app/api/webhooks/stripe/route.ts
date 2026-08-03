import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, grantsAccess, toSubscriptionStatus } from "@/lib/stripe";

// A verificação de assinatura precisa do corpo cru e do crypto do Node.
export const runtime = "nodejs";

// POST /api/webhooks/stripe - único endpoint de pagamento do Orion
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET não configurada");
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const payload = await request.text();
    event = await getStripe().webhooks.constructEventAsync(payload, signature, secret);
  } catch (error) {
    // Corpo adulterado ou assinatura inválida: nunca processar.
    console.error("Assinatura de webhook inválida:", error);
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await onCheckoutCompleted(event.data.object);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object);
        break;
      default:
        // Evento que não movimenta acesso nem cobrança: reconhecer e sair.
        break;
    }
  } catch (error) {
    // 500 faz a Stripe reenviar. Como todo write abaixo é upsert por chave única,
    // o reenvio é seguro.
    console.error(`Erro ao processar ${event.type} (${event.id}):`, error);
    return NextResponse.json({ error: "Falha ao processar evento" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription" || session.payment_status === "unpaid") {
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    throw new Error(`Checkout ${session.id} sem subscription`);
  }

  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  const { userId, planId } = await syncSubscription(subscription);

  const invoiceId =
    typeof session.invoice === "string" ? session.invoice : session.invoice?.id;

  if (!invoiceId) return;

  // stripeInvoiceId é @unique: reprocessar o mesmo evento não cria uma segunda Order.
  await prisma.order.upsert({
    where: { stripeInvoiceId: invoiceId },
    create: {
      userId,
      planId,
      amount: (session.amount_total ?? 0) / 100,
      status: "SUCCEEDED",
      paymentMethod: "stripe",
      stripeInvoiceId: invoiceId,
      paidAt: new Date(),
    },
    update: { status: "SUCCEEDED", paidAt: new Date() },
  });
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId;

  if (!userId || !planId) {
    throw new Error(`Subscription ${subscription.id} sem userId/planId no metadata`);
  }

  // A partir da API 2025-03-31 o período vive no item, não na subscription.
  const item = subscription.items.data[0];
  const status = toSubscriptionStatus(subscription.status);

  const data = {
    userId,
    planId,
    status,
    currentPeriodStart: new Date(item.current_period_start * 1000),
    currentPeriodEnd: new Date(item.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    stripeCustomerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
  };

  // stripeSubscriptionId é @unique: este upsert é o que torna o webhook idempotente.
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: { ...data, stripeSubscriptionId: subscription.id },
    update: data,
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: grantsAccess(status)
        ? "ACTIVE"
        : status === "CANCELED"
          ? "CANCELLED"
          : "EXPIRED",
    },
  });

  return { userId, planId };
}
