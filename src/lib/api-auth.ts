import { auth } from "./auth";
import { prisma } from "./prisma";
import { extractApiKeyFromHeader, validateApiKey } from "./api-keys";

/**
 * Credencial de quem está chamando uma rota de dados do ERP: sessão do
 * navegador OU API key.
 *
 * `validateApiKey` já existia inteira em lib/api-keys.ts — e não tinha um único
 * chamador. As chaves criadas em /dashboard/configuracoes/api-keys eram geradas,
 * exibidas, contadas na tela e nunca verificadas em lugar nenhum.
 */
export interface ApiCaller {
  user: { id: string; accountId: string };
}

export async function authOrApiKey(request: Request): Promise<ApiCaller | null> {
  const session = await auth();
  if (session?.user?.id) {
    return { user: { id: session.user.id, accountId: session.user.accountId } };
  }

  // `x-api-key` é o header documentado; Authorization: Bearer continua valendo
  // porque a tela de API keys ensina esse formato há mais tempo.
  const key =
    request.headers.get("x-api-key") ??
    extractApiKeyFromHeader(request.headers.get("authorization"));

  if (!key) return null;

  const valida = await validateApiKey(key);
  if (!valida) return null;

  // A chave pertence a uma pessoa; o dado do ERP está gravado no dono da conta.
  const dono = await prisma.user.findUnique({
    where: { id: valida.userId },
    select: { ownerId: true },
  });

  return {
    user: { id: valida.userId, accountId: dono?.ownerId ?? valida.userId },
  };
}
