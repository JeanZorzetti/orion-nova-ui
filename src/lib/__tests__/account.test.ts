import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Session } from "next-auth";

// Estado em memória no lugar do banco: o que importa aqui é a regra de
// assentos, não o SQL.
interface Plano {
  maxUsers: number | null;
  features: unknown;
}

const state = {
  assinatura: null as { plan: Plano } | null,
  planoDeEntrada: null as Plano | null,
  membros: 0,
  clientes: 0,
  produtos: 0,
};

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: { findFirst: vi.fn(async () => state.assinatura) },
    plan: { findFirst: vi.fn(async () => state.planoDeEntrada) },
    user: { count: vi.fn(async () => state.membros) },
    customer: { count: vi.fn(async () => state.clientes) },
    product: { count: vi.fn(async () => state.produtos) },
  },
}));

const { isMember, seatLimit, seatsUsed, limiteEstourado } = await import("../account");

function sessionOf(id: string, accountId: string): Session {
  return { user: { id, accountId, role: "USER" } } as Session;
}

beforeEach(() => {
  state.assinatura = null;
  state.planoDeEntrada = { maxUsers: 2, features: { maxCustomers: 500, maxProducts: 200 } };
  state.membros = 0;
  state.clientes = 0;
  state.produtos = 0;
});

describe("isMember", () => {
  it("dono: id e accountId são o mesmo", () => {
    expect(isMember(sessionOf("u1", "u1"))).toBe(false);
  });

  it("membro: accountId aponta para outra pessoa", () => {
    expect(isMember(sessionOf("u2", "u1"))).toBe(true);
  });
});

describe("seatLimit", () => {
  it("usa o maxUsers do plano assinado", async () => {
    state.assinatura = { plan: { maxUsers: 10, features: {} } };
    expect(await seatLimit("u1")).toBe(10);
  });

  it("maxUsers nulo no plano significa ilimitado", async () => {
    state.assinatura = { plan: { maxUsers: null, features: {} } };
    expect(await seatLimit("u1")).toBe(-1);
  });

  it("sem assinatura (trial), cai no plano mais barato à venda", async () => {
    expect(await seatLimit("u1")).toBe(2);
  });

  it("sem plano nenhum no banco, fica em 1 — nunca abre assento de graça", async () => {
    state.planoDeEntrada = null;
    expect(await seatLimit("u1")).toBe(1);
  });
});

describe("seatsUsed", () => {
  it("conta o dono junto com os membros", async () => {
    state.membros = 3;
    expect(await seatsUsed("u1")).toBe(4);
  });

  it("conta sozinho quem não tem equipe", async () => {
    expect(await seatsUsed("u1")).toBe(1);
  });
});

describe("limiteEstourado", () => {
  it("deixa passar quem ainda tem folga", async () => {
    state.clientes = 499;
    expect(await limiteEstourado("u1", "customers")).toBeNull();
  });

  it("barra exatamente no limite, não depois", async () => {
    state.clientes = 500;
    expect(await limiteEstourado("u1", "customers")).toMatch(/500 clientes/);
  });

  it("conta produtos pelo limite de produtos, não pelo de clientes", async () => {
    state.clientes = 500;
    state.produtos = 10;
    expect(await limiteEstourado("u1", "products")).toBeNull();
  });

  it("plano sem o limite declarado é ilimitado", async () => {
    state.planoDeEntrada = { maxUsers: -1, features: {} };
    state.clientes = 100_000;
    expect(await limiteEstourado("u1", "customers")).toBeNull();
  });

  it("-1 no catálogo é ilimitado", async () => {
    state.planoDeEntrada = { maxUsers: -1, features: { maxCustomers: -1 } };
    state.clientes = 100_000;
    expect(await limiteEstourado("u1", "customers")).toBeNull();
  });
});
