import { describe, it, expect, beforeEach, vi } from "vitest";

// Armazenamento em memória que imita as chaves @unique do Prisma:
// é exatamente isso que torna o webhook idempotente.
const subscriptions = new Map<string, any>();
const orders = new Map<string, any>();
const users = new Map<string, any>();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: {
      upsert: vi.fn(async ({ where, create, update }: any) => {
        const key = where.stripeSubscriptionId;
        const row = subscriptions.has(key)
          ? { ...subscriptions.get(key), ...update }
          : create;
        subscriptions.set(key, row);
        return row;
      }),
    },
    order: {
      upsert: vi.fn(async ({ where, create, update }: any) => {
        const key = where.stripeInvoiceId;
        const row = orders.has(key) ? { ...orders.get(key), ...update } : create;
        orders.set(key, row);
        return row;
      }),
    },
    user: {
      update: vi.fn(async ({ where, data }: any) => {
        users.set(where.id, data);
        return data;
      }),
    },
  },
}));

const constructEventAsync = vi.fn();
const retrieve = vi.fn();

vi.mock("@/lib/stripe", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/stripe")>()),
  getStripe: () => ({
    webhooks: { constructEventAsync },
    subscriptions: { retrieve },
  }),
}));

const { POST } = await import("../route");

const STRIPE_SUB = {
  id: "sub_123",
  status: "active",
  cancel_at_period_end: false,
  canceled_at: null,
  customer: "cus_123",
  metadata: { userId: "user_1", planId: "plan_1" },
  items: {
    data: [{ current_period_start: 1_754_000_000, current_period_end: 1_756_678_400 }],
  },
};

const CHECKOUT_EVENT = {
  id: "evt_1",
  type: "checkout.session.completed",
  data: {
    object: {
      id: "cs_123",
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_123",
      invoice: "in_123",
      amount_total: 29990,
    },
  },
};

function request(signature: string | null = "t=1,v1=assinatura_valida") {
  return {
    headers: { get: (name: string) => (name === "stripe-signature" ? signature : null) },
    text: async () => JSON.stringify(CHECKOUT_EVENT),
  } as any;
}

beforeEach(() => {
  subscriptions.clear();
  orders.clear();
  users.clear();
  vi.clearAllMocks();
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  retrieve.mockResolvedValue(STRIPE_SUB);
  constructEventAsync.mockResolvedValue(CHECKOUT_EVENT);
});

describe("POST /api/webhooks/stripe", () => {
  it("rejeita evento com assinatura inválida sem tocar no banco", async () => {
    constructEventAsync.mockRejectedValue(new Error("No signatures found"));

    const response = await POST(request());

    expect(response.status).toBe(400);
    expect(subscriptions.size).toBe(0);
    expect(orders.size).toBe(0);
    expect(users.size).toBe(0);
  });

  it("rejeita requisição sem header de assinatura", async () => {
    const response = await POST(request(null));

    expect(response.status).toBe(400);
    expect(constructEventAsync).not.toHaveBeenCalled();
    expect(subscriptions.size).toBe(0);
  });

  it("ativa a assinatura do usuário do metadata", async () => {
    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(subscriptions.get("sub_123")).toMatchObject({
      userId: "user_1",
      planId: "plan_1",
      status: "ACTIVE",
      stripeCustomerId: "cus_123",
    });
    expect(orders.get("in_123")).toMatchObject({ status: "SUCCEEDED", amount: 299.9 });
    expect(users.get("user_1")).toEqual({ subscriptionStatus: "ACTIVE" });
  });

  it("é idempotente: a Stripe reenvia o mesmo evento sem duplicar nada", async () => {
    await POST(request());
    await POST(request());
    await POST(request());

    expect(subscriptions.size).toBe(1);
    expect(orders.size).toBe(1);
  });
});
