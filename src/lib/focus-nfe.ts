import type { AmbienteFiscal } from "@prisma/client";

/**
 * Cliente da Focus NFe no modelo BYO: a conta é do cliente, o token é dele e o
 * certificado A1 fica no painel dele. A Orion só faz as chamadas.
 *
 * ponytail: um provedor, sem interface de provedor. Quando existir o segundo,
 * aí se extrai a abstração — antes disso ela é adivinhação.
 */

const BASE_URL: Record<AmbienteFiscal, string> = {
  HOMOLOGACAO: "https://homologacao.focusnfe.com.br",
  PRODUCAO: "https://api.focusnfe.com.br",
};

/** A Focus usa HTTP Basic com o token no usuário e senha vazia. */
function authHeader(token: string): string {
  return `Basic ${Buffer.from(`${token}:`).toString("base64")}`;
}

export function focusFetch(
  token: string,
  ambiente: AmbienteFiscal,
  caminho: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(`${BASE_URL[ambiente]}${caminho}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: authHeader(token),
      "Content-Type": "application/json",
    },
  });
}

// ponytail: campos opcionais em vez de união discriminada — o tsconfig do repo
// tem strictNullChecks:false e não estreita `ok: true | false`. Ligar strict no
// projeto inteiro é outro trabalho, não este.
export type ResultadoConexao = {
  ok: boolean;
  motivo?: "invalido" | "master" | "indisponivel";
  mensagem?: string;
};

/**
 * Confere se o token serve antes de guardar, para o cliente descobrir o erro
 * de digitação agora e não na primeira venda.
 *
 * Também recusa o token master (o de revenda): ele emite para qualquer CNPJ da
 * conta, e a Orion não tem por que guardar uma chave dessas. A Focus separa os
 * dois — /v2/empresas responde ao master e nega ao token de empresa.
 *
 * ponytail: os dois códigos abaixo saíram da doc, não de token real — não temos
 * conta. Confirmar na primeira conexão de verdade; se a Focus responder outra
 * coisa, o pior caso é aceitar um master, que é o comportamento de quem só avisa.
 */
export async function validarToken(
  token: string,
  ambiente: AmbienteFiscal
): Promise<ResultadoConexao> {
  try {
    // Referência que não existe: 404 prova que o token autenticou.
    const probe = await focusFetch(token, ambiente, "/v2/nfe/orion-teste-conexao");

    if (probe.status === 401 || probe.status === 403) {
      return {
        ok: false,
        motivo: "invalido",
        mensagem: "A Focus NFe recusou este token. Confira se copiou o token da empresa.",
      };
    }

    const empresas = await focusFetch(token, ambiente, "/v2/empresas");
    if (empresas.ok) {
      return {
        ok: false,
        motivo: "master",
        mensagem:
          "Este é o token master da sua conta — ele emite para qualquer CNPJ. " +
          "Use o token da empresa, no painel da Focus em Minhas Empresas.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      motivo: "indisponivel",
      mensagem: "Não foi possível falar com a Focus NFe agora. Tente de novo em instantes.",
    };
  }
}
