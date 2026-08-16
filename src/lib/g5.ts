/**
 * G5: o ciclo que leva um trial de zero a "vi valor" — cadastrar 1 cliente,
 * 1 produto, emitir 1 pedido e abrir 1 relatório. A meta é fechar isso em
 * menos de 10 minutos.
 *
 * Os 3 primeiros marcos são derivados do banco (existe registro ou não), então
 * não há flag para dessincronizar. O 4º é o único que precisa ser gravado: ver
 * um relatório não deixa rastro em tabela nenhuma.
 */

/**
 * Único marco do G5 que não dá para derivar do banco. Gravado em
 * `UserOnboarding.completedSteps` como step extra — fora de `requiredSteps`,
 * para não mudar quando o onboarding conta como concluído.
 */
export const G5_REPORT_STEP = "first_report";

export interface G5Flags {
  customer: boolean;
  product: boolean;
  sale: boolean;
  report: boolean;
}

export interface G5Passo {
  id: keyof G5Flags;
  titulo: string;
  link: string;
  concluido: boolean;
}

const PASSOS: Array<Omit<G5Passo, "concluido">> = [
  { id: "customer", titulo: "Cadastrar 1 cliente", link: "/dashboard/clientes/novo" },
  { id: "product", titulo: "Cadastrar 1 produto", link: "/dashboard/produtos/novo" },
  { id: "sale", titulo: "Emitir 1 pedido", link: "/dashboard/vendas/novo" },
  { id: "report", titulo: "Ver 1 relatório", link: "/dashboard/relatorios/vendas" },
];

export interface G5Progresso {
  passos: G5Passo[];
  concluidos: number;
  total: number;
  percentual: number;
  /** Primeiro passo em aberto — é para ele que o CTA aponta. */
  proximo: G5Passo | null;
  completo: boolean;
}

export function progressoG5(flags: G5Flags): G5Progresso {
  const passos = PASSOS.map((p) => ({ ...p, concluido: flags[p.id] }));
  const concluidos = passos.filter((p) => p.concluido).length;

  return {
    passos,
    concluidos,
    total: passos.length,
    percentual: Math.round((concluidos / passos.length) * 100),
    proximo: passos.find((p) => !p.concluido) ?? null,
    completo: concluidos === passos.length,
  };
}

/** "Passo 2 de 4: 50% concluído" — o efeito Zeigarnik precisa do número à vista. */
export function rotuloG5(p: G5Progresso): string {
  if (p.completo) return "Ciclo completo: 100% concluído";
  return `Passo ${p.concluidos + 1} de ${p.total}: ${p.percentual}% concluído`;
}
