import { prisma } from "./prisma";
import type { Session } from "next-auth";

/**
 * Conta = o dono. `session.user.accountId` é o id em que todo dado do ERP está
 * gravado; `session.user.id` é quem está logado. Para o dono os dois são iguais.
 *
 * Aqui também moram os limites de plano. Antes disto nenhuma rota consultava o
 * plano antes de criar nada — os três planos eram o mesmo sistema, e quem
 * pagasse mais recebia exatamente o que recebia quem pagasse menos.
 */

/** Quem está logado é membro de equipe, não o dono da conta. */
export function isMember(session: Session): boolean {
  return session.user.id !== session.user.accountId;
}

/** -1 significa ilimitado em todo limite deste arquivo. */
export const ILIMITADO = -1;

interface PlanoDaConta {
  maxUsers: number | null;
  features: unknown;
}

/**
 * Plano vigente da conta. Durante o trial não existe assinatura, então vale o
 * plano mais barato à venda — o trial libera os módulos, não assentos e volumes
 * que ninguém comprou. Lido do banco para acompanhar o catálogo sem deploy.
 */
async function planoDaConta(accountId: string): Promise<PlanoDaConta | null> {
  const assinatura = await prisma.subscription.findFirst({
    where: { userId: accountId, status: { in: ["ACTIVE", "TRIALING"] } },
    orderBy: { createdAt: "desc" },
    select: { plan: { select: { maxUsers: true, features: true } } },
  });

  if (assinatura) return assinatura.plan;

  return prisma.plan.findFirst({
    where: { isActive: true },
    orderBy: { price: "asc" },
    select: { maxUsers: true, features: true },
  });
}

/** Lê um limite numérico de `features`. Ausente = ilimitado. */
function limiteEm(features: unknown, chave: string): number {
  const valor = (features as Record<string, unknown> | null)?.[chave];
  return typeof valor === "number" ? valor : ILIMITADO;
}

/** Quantos usuários o plano da conta permite. */
export async function seatLimit(accountId: string): Promise<number> {
  const plano = await planoDaConta(accountId);

  // Sem plano nenhum no banco fica em 1: nunca abrir assento de graça por falha
  // de configuração.
  if (!plano) return 1;

  return plano.maxUsers ?? ILIMITADO;
}

/** Usuários que já ocupam assento na conta: o dono mais os membros. */
export async function seatsUsed(accountId: string): Promise<number> {
  return 1 + (await prisma.user.count({ where: { ownerId: accountId } }));
}

export interface Entitlements {
  canExport: boolean;
  seats: { used: number; limit: number };
  ai: { used: number; limit: number };
}

/** O que o plano da conta libera. Consumido pelas telas do dashboard. */
export async function entitlements(accountId: string): Promise<Entitlements> {
  const [plano, conta, membros] = await Promise.all([
    planoDaConta(accountId),
    prisma.user.findUnique({
      where: { id: accountId },
      select: { aiMessagesUsed: true, aiMessagesPeriod: true },
    }),
    prisma.user.count({ where: { ownerId: accountId } }),
  ]);

  const features = plano?.features as Record<string, unknown> | undefined;

  return {
    // Ausente = liberado: um plano antigo no banco não deve perder o botão.
    canExport: features?.canExport !== false,
    seats: { used: 1 + membros, limit: plano?.maxUsers ?? ILIMITADO },
    ai: {
      used: conta?.aiMessagesPeriod === periodoAtual() ? conta.aiMessagesUsed : 0,
      limit: limiteEm(features, "maxAiMessages"),
    },
  };
}

/** Mês corrente no formato que aiMessagesPeriod guarda. */
export function periodoAtual(agora = new Date()): string {
  return `${agora.getUTCFullYear()}-${String(agora.getUTCMonth() + 1).padStart(2, "0")}`;
}

/**
 * Consome uma mensagem da cota mensal de IA da conta. Devolve a mensagem de erro
 * se a cota acabou, ou null se pode seguir.
 *
 * O contador zera na virada do mês pela comparação com `aiMessagesPeriod` — sem
 * cron e sem tabela de log. A cota é da conta: o membro gasta do mesmo saldo.
 *
 * ponytail: incremento não-atômico (read-modify-write). Duas mensagens
 * simultâneas do mesmo usuário podem contar como uma. Se isso virar problema,
 * troque por um UPDATE ... SET used = used + 1 RETURNING condicional.
 */
export async function consumirMensagemIA(accountId: string): Promise<string | null> {
  const [plano, conta] = await Promise.all([
    planoDaConta(accountId),
    prisma.user.findUnique({
      where: { id: accountId },
      select: { aiMessagesUsed: true, aiMessagesPeriod: true },
    }),
  ]);

  if (!conta) return "Conta não encontrada.";

  const limite = limiteEm(plano?.features, "maxAiMessages");
  const periodo = periodoAtual();
  const usadas = conta.aiMessagesPeriod === periodo ? conta.aiMessagesUsed : 0;

  if (limite !== ILIMITADO && usadas >= limite) {
    return `Você usou as ${limite} mensagens de IA do seu plano neste mês. A cota volta no dia 1º.`;
  }

  await prisma.user.update({
    where: { id: accountId },
    data: { aiMessagesUsed: usadas + 1, aiMessagesPeriod: periodo },
  });

  return null;
}

export type RecursoLimitado = "customers" | "products";

const CHAVE_DO_LIMITE: Record<RecursoLimitado, string> = {
  customers: "maxCustomers",
  products: "maxProducts",
};

const NOME_DO_RECURSO: Record<RecursoLimitado, string> = {
  customers: "clientes",
  products: "produtos",
};

/**
 * Mensagem de erro se a conta já estourou o limite do plano para o recurso, ou
 * null se ainda cabe. Chamada antes de criar, nas rotas de POST.
 */
export async function limiteEstourado(
  accountId: string,
  recurso: RecursoLimitado
): Promise<string | null> {
  const plano = await planoDaConta(accountId);
  const limite = limiteEm(plano?.features, CHAVE_DO_LIMITE[recurso]);

  if (limite === ILIMITADO) return null;

  const usados =
    recurso === "customers"
      ? await prisma.customer.count({ where: { userId: accountId } })
      : await prisma.product.count({ where: { userId: accountId } });

  if (usados < limite) return null;

  return `Seu plano permite ${limite} ${NOME_DO_RECURSO[recurso]} e você já tem ${usados}. Mude de plano para cadastrar mais.`;
}
