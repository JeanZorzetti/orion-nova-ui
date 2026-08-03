import Stripe from "stripe";

let client: Stripe | null = null;

// ponytail: lazy igual ao Resend (08bdee8) — o build da Vercel roda sem STRIPE_SECRET_KEY
// e o construtor da Stripe joga na hora se a chave estiver vazia.
export function getStripe(): Stripe {
  if (!client) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY não configurada");
    }
    client = new Stripe(apiKey);
  }
  return client;
}

/** Mapeia o status da Stripe para o enum SubscriptionStatus do Prisma. */
export function toSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status
): "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING" {
  switch (stripeStatus) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "unpaid":
      return "UNPAID";
    // incomplete, incomplete_expired, canceled, paused
    default:
      return "CANCELED";
  }
}

/** Só ACTIVE e TRIALING liberam o dashboard. O resto cai para a página de preços. */
export function grantsAccess(status: ReturnType<typeof toSubscriptionStatus>): boolean {
  return status === "ACTIVE" || status === "TRIALING";
}
