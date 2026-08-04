import { describe, it, expect } from "vitest";
import { PLANS, isInSync, type PlanSeed } from "./plans";

const starter = PLANS.find((p) => p.slug === "starter")!;

/** Espelha o que o banco devolveria para um plano já sincronizado. */
function rowFor(plan: PlanSeed) {
  return {
    stripePriceId: plan.stripePriceId,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    features: plan.features,
    maxUsers: plan.maxUsers,
    maxStorage: plan.maxStorage,
    isActive: plan.isActive,
  };
}

describe("isInSync", () => {
  it("reconhece o plano já sincronizado (idempotência do script)", () => {
    expect(isInSync(rowFor(starter), starter)).toBe(true);
  });

  it("aceita price vindo como Decimal/string do Prisma", () => {
    expect(isInSync({ ...rowFor(starter), price: "89" }, starter)).toBe(true);
  });

  it("ignora a ordem das chaves do jsonb", () => {
    // O Postgres devolve as chaves na ordem dele, não na do catálogo. Sem isso
    // o script se achava fora de sincronia e reescrevia os 3 planos toda vez.
    const reordered = Object.fromEntries(
      Object.entries(starter.features).reverse()
    );
    expect(isInSync({ ...rowFor(starter), features: reordered }, starter)).toBe(true);
  });

  it("mas não ignora a ordem dos bullets — é a ordem do card", () => {
    const swapped = {
      ...starter.features,
      modules: [...(starter.features.modules as string[])].reverse(),
    };
    expect(isInSync({ ...rowFor(starter), features: swapped }, starter)).toBe(false);
  });

  it("detecta bullet a mais no banco — o caso que a auditoria pegou", () => {
    const stale = {
      ...rowFor(starter),
      features: {
        ...starter.features,
        modules: [
          ...(starter.features.modules as string[]),
          "Emissão de NF-e (até 100/mês)",
        ],
      },
    };
    expect(isInSync(stale, starter)).toBe(false);
  });

  it("detecta plano ativo que deveria estar desativado", () => {
    expect(isInSync({ ...rowFor(starter), isActive: false }, starter)).toBe(false);
  });
});

describe("catálogo", () => {
  it("não promete armazenamento — não existe upload no produto", () => {
    for (const plan of PLANS) {
      expect(plan.maxStorage, plan.slug).toBeNull();
      expect(plan.features.storage, plan.slug).toBeUndefined();
    }
  });

  it("o número de assentos anunciado é o mesmo que a rota de equipe aplica", () => {
    // features.users é o que o card promete; maxUsers é o que seatLimit lê para
    // barrar o convite. Divergir aqui é vender assento que a rota recusa.
    for (const plan of PLANS) {
      expect(plan.features.users, plan.slug).toBe(plan.maxUsers ?? -1);
    }
  });

  it("os três planos estão à venda", () => {
    expect(PLANS.filter((p) => p.isActive).map((p) => p.slug)).toEqual([
      "starter",
      "professional",
      "enterprise",
    ]);
  });

  it("cada plano aponta para um price distinto da Stripe", () => {
    // Dois planos com o mesmo price cobram o mesmo valor com nomes diferentes.
    const ids = PLANS.map((p) => p.stripePriceId);
    expect(new Set(ids).size).toBe(PLANS.length);
    for (const id of ids) expect(id).toMatch(/^price_/);
  });

  it("os três planos vendem WhatsApp — não é diferencial do Enterprise", () => {
    // Decisão do dono: o canal é igual em todo plano, a gradação é o SLA.
    // Este teste existe para ninguém "consertar" devolvendo a exclusividade.
    for (const plan of PLANS) {
      expect(plan.features.support, plan.slug).toMatch(/WhatsApp/);
    }
  });

  it("preço maior entrega mais: assentos e limites nunca regridem", () => {
    const porPreco = [...PLANS].sort((a, b) => a.price - b.price);
    const naoMenor = (a: number, b: number) => a === -1 || (b !== -1 && a >= b);

    for (let i = 1; i < porPreco.length; i++) {
      const caro = porPreco[i].features;
      const barato = porPreco[i - 1].features;
      for (const chave of ["users", "maxCustomers", "maxProducts", "maxAiMessages"]) {
        expect(
          naoMenor(caro[chave] as number, barato[chave] as number),
          `${porPreco[i].slug}.${chave}`
        ).toBe(true);
      }
    }
  });
});
