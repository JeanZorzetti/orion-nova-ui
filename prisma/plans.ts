/**
 * Catálogo de planos — fonte única para o seed e para o banco de produção.
 *
 * Toda linha aqui é uma promessa contratual: o cliente compra em /precos e é
 * este objeto que /api/plans devolve e o card renderiza. **Nada entra aqui sem
 * uma rota que entregue.** A auditoria da sessão 6 encontrou 15 bullets
 * inexistentes vendidos por até R$ 599/mês — foi o que originou este arquivo.
 *
 * O seed usa `update: {}`, então corrigir o seed NÃO corrige produção. Depois
 * de editar este arquivo, rode:
 *
 *   npx tsx --env-file=.env scripts/sync-plans.ts
 *
 * ⚠️ Mudar `price` aqui NÃO muda o que a Stripe cobra. Price da Stripe é
 * imutável: crie um price NOVO no painel/API e atualize `stripePriceId` no
 * mesmo commit. O script aborta se os dois não andarem juntos.
 */

import type { Prisma, PrismaClient } from "@prisma/client";

export interface PlanSeed {
  name: string;
  slug: string;
  description: string;
  price: number;
  features: Record<string, unknown>;
  maxUsers: number | null;
  maxStorage: number | null;
  isActive: boolean;
  /**
   * Price da Stripe que cobra este valor. Fica junto de `price` de propósito:
   * price da Stripe é imutável, então mudar o preço exige um price NOVO, e os
   * dois campos precisam andar no mesmo commit. Separados, o banco anuncia um
   * valor e a Stripe cobra outro.
   */
  stripePriceId: string;
}

export const PLANS: PlanSeed[] = [
  {
    name: "Starter",
    slug: "starter",
    description: "Ideal para MEIs e Microempresas que estão começando",
    price: 89.0,
    features: {
      users: 2,
      // Limites aplicados de verdade nas rotas de criação (lib/account.ts).
      // -1 = ilimitado. Enquanto isto aqui não existia, os três planos eram
      // funcionalmente idênticos: nada no código consultava o plano.
      maxCustomers: 500,
      maxProducts: 200,
      maxAiMessages: 100,
      // Ligado em todos os planos de propósito. O Starter já anuncia exportação
      // hoje; tirá-la seria rebaixar o único plano à venda às vésperas da
      // primeira compra. A chave existe para o dia em que virar diferencial —
      // basta pôr false aqui, o gate já lê deste campo.
      canExport: true,
      modules: [
        "Clientes: cadastro completo (PF e PJ)",
        "Produtos e serviços com estoque mínimo",
        "Vendas e pedidos com status de pagamento",
        "Financeiro: contas a pagar e a receber",
        "3 relatórios com exportação em CSV e PDF",
        "Orion AI: 100 mensagens por mês",
        "Suporte por WhatsApp em horário comercial",
      ],
      // WhatsApp está nos três planos por decisão do dono. A gradação entre
      // planos é o SLA, não o canal — não devolva o WhatsApp como exclusividade
      // do Enterprise.
      support: "WhatsApp e e-mail (24-48h)",
      integrations: 0,
      aiFeatures: "Chat com contexto real dos seus dados",
    },
    maxUsers: 2,
    maxStorage: null,
    isActive: true,
    stripePriceId: "price_1U0QnxD6GTFfNAq4nzsCqpW6",
  },

  // Professional e Enterprise vendem o MESMO produto do Starter, com mais
  // volume. É a única diferenciação que existe hoje, e cada número aqui é
  // aplicado por lib/account.ts nas rotas de criação — nada é decorativo.
  // Não anunciam módulo que o Starter não tenha, porque não há nenhum.
  {
    name: "Professional",
    slug: "professional",
    description: "Para quem já tem equipe e volume",
    price: 189.0,
    features: {
      users: 10,
      maxCustomers: 5000,
      maxProducts: 2000,
      maxAiMessages: 1000,
      canExport: true,
      modules: [
        "Todos os módulos do Starter",
        "Até 10 usuários na mesma conta",
        "5.000 clientes e 2.000 produtos",
        "Orion AI: 1.000 mensagens por mês",
        "Suporte por WhatsApp prioritário em até 8h úteis",
      ],
      support: "WhatsApp e e-mail prioritários (8h úteis)",
      integrations: 0,
      aiFeatures: "Chat com contexto real dos seus dados",
    },
    maxUsers: 10,
    maxStorage: null,
    isActive: true,
    stripePriceId: "price_1U0TibD6GTFfNAq4TwnskG2E",
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "Sem limite de usuários nem de cadastros",
    price: 349.0,
    features: {
      users: -1,
      maxCustomers: -1,
      maxProducts: -1,
      maxAiMessages: -1,
      canExport: true,
      modules: [
        "Todos os módulos do Starter",
        "Usuários ilimitados",
        "Clientes e produtos ilimitados",
        "Orion AI sem limite de mensagens",
        "Suporte por WhatsApp com prioridade máxima (2h úteis)",
      ],
      support: "WhatsApp e e-mail prioritários (2h úteis)",
      integrations: 0,
      aiFeatures: "Chat com contexto real dos seus dados",
    },
    maxUsers: null,
    maxStorage: null,
    isActive: true,
    stripePriceId: "price_1U0TigD6GTFfNAq4FDH77zkC",
  },
];

/** Campos que o catálogo governa. */
function planData(plan: PlanSeed) {
  return {
    name: plan.name,
    description: plan.description,
    price: plan.price,
    features: plan.features as Prisma.InputJsonValue,
    maxUsers: plan.maxUsers,
    maxStorage: plan.maxStorage,
    isActive: plan.isActive,
    stripePriceId: plan.stripePriceId,
  };
}

/**
 * JSON com as chaves de objeto em ordem estável. O Postgres guarda `jsonb` com
 * a própria ordem (por tamanho da chave, depois alfabética), então comparar o
 * `JSON.stringify` cru acusava diferença em todo plano e o script reescrevia
 * tudo a cada execução. Ordem de array é preservada — a dos módulos é a ordem
 * dos bullets no card.
 */
function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
      : v
  );
}

/** true se o que está no banco já é o que o catálogo pede. */
export function isInSync(
  current: {
    name: string;
    description: string | null;
    price: unknown;
    features: unknown;
    maxUsers: number | null;
    maxStorage: number | null;
    isActive: boolean;
    stripePriceId: string | null;
  },
  plan: PlanSeed
): boolean {
  return (
    current.name === plan.name &&
    current.description === plan.description &&
    Number(current.price) === plan.price &&
    current.maxUsers === plan.maxUsers &&
    current.maxStorage === plan.maxStorage &&
    current.isActive === plan.isActive &&
    current.stripePriceId === plan.stripePriceId &&
    canonical(current.features) === canonical(plan.features)
  );
}

/**
 * Aplica o catálogo no banco. Idempotente. Usado pelo seed e por
 * scripts/sync-plans.ts — o seed sozinho não basta porque as linhas de
 * produção já existem.
 */
export async function syncPlans(
  prisma: PrismaClient,
  { dry = false }: { dry?: boolean } = {}
): Promise<void> {
  for (const plan of PLANS) {
    const current = await prisma.plan.findUnique({
      where: { slug: plan.slug },
      select: {
        name: true,
        description: true,
        price: true,
        features: true,
        maxUsers: true,
        maxStorage: true,
        isActive: true,
        stripePriceId: true,
      },
    });

    if (current && isInSync(current, plan)) {
      console.log(`= ${plan.slug}: já em sincronia`);
      continue;
    }

    // Preço novo apontando para o price antigo = o card anuncia um valor e a
    // Stripe cobra outro. Para o script antes de gravar isso.
    if (
      current &&
      Number(current.price) !== plan.price &&
      current.stripePriceId === plan.stripePriceId
    ) {
      throw new Error(
        `${plan.slug}: preço ${current.price} -> ${plan.price} mantendo o mesmo ` +
          `price da Stripe (${plan.stripePriceId}). Price da Stripe é imutável: ` +
          `crie um price novo e atualize stripePriceId no catálogo.`
      );
    }

    if (dry) {
      console.log(`~ ${plan.slug}: ${current ? "seria atualizado" : "seria criado"}`);
      continue;
    }

    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: planData(plan),
      create: { slug: plan.slug, ...planData(plan) },
    });
    console.log(
      `✔ ${plan.slug}: ${current ? "atualizado" : "criado"} (ativo: ` +
        `${plan.isActive}, ${(plan.features.modules as string[]).length} bullets)`
    );
  }
}
