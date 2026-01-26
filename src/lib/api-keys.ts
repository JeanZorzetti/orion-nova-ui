import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

/**
 * Configurações das API Keys
 */
const API_KEY_CONFIG = {
  prefix: "sk_live_", // Prefixo para chaves de produção
  testPrefix: "sk_test_", // Prefixo para chaves de teste
  keyLength: 32, // Comprimento da parte aleatória (em bytes = 64 chars hex)
  prefixLength: 12, // Caracteres do prefixo + início da key para identificação
  saltRounds: 12, // Rounds do bcrypt para hash
};

/**
 * Gera uma nova API key única
 * @param isTest - Se true, gera uma chave de teste
 * @returns Objeto com a key completa e o prefixo para armazenamento
 */
export function generateApiKey(isTest: boolean = false): {
  key: string;
  prefix: string;
} {
  const prefix = isTest ? API_KEY_CONFIG.testPrefix : API_KEY_CONFIG.prefix;
  const randomPart = randomBytes(API_KEY_CONFIG.keyLength).toString("hex");
  const fullKey = `${prefix}${randomPart}`;

  return {
    key: fullKey,
    prefix: fullKey.substring(0, API_KEY_CONFIG.prefixLength),
  };
}

/**
 * Cria o hash de uma API key para armazenamento seguro
 * @param key - A API key completa
 * @returns Hash bcrypt da key
 */
export async function hashApiKey(key: string): Promise<string> {
  return bcrypt.hash(key, API_KEY_CONFIG.saltRounds);
}

/**
 * Verifica se uma API key corresponde ao hash armazenado
 * @param key - A API key fornecida
 * @param hash - O hash armazenado no banco
 * @returns true se a key é válida
 */
export async function verifyApiKey(key: string, hash: string): Promise<boolean> {
  return bcrypt.compare(key, hash);
}

/**
 * Valida e autentica uma API key
 * @param key - A API key fornecida no request
 * @returns Objeto com userId se válida, null se inválida
 */
export async function validateApiKey(
  key: string
): Promise<{ userId: string; apiKeyId: string } | null> {
  if (!key || typeof key !== "string") {
    return null;
  }

  // Extrai o prefixo para busca otimizada
  const prefix = key.substring(0, API_KEY_CONFIG.prefixLength);

  // Busca API keys que correspondem ao prefixo
  const apiKeys = await prisma.apiKey.findMany({
    where: {
      keyPrefix: prefix,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: {
      id: true,
      keyHash: true,
      userId: true,
      user: {
        select: {
          subscriptionStatus: true,
        },
      },
    },
  });

  // Verifica cada key candidata (normalmente só terá uma)
  for (const apiKey of apiKeys) {
    const isValid = await verifyApiKey(key, apiKey.keyHash);
    if (isValid) {
      // Verifica se o usuário está ativo
      if (
        apiKey.user.subscriptionStatus === "EXPIRED" ||
        apiKey.user.subscriptionStatus === "CANCELLED"
      ) {
        return null;
      }

      // Atualiza estatísticas de uso (fire-and-forget)
      prisma.apiKey
        .update({
          where: { id: apiKey.id },
          data: {
            lastUsed: new Date(),
            requestCount: { increment: 1 },
          },
        })
        .catch(console.error);

      return { userId: apiKey.userId, apiKeyId: apiKey.id };
    }
  }

  return null;
}

/**
 * Cria uma nova API key para um usuário
 * @param userId - ID do usuário
 * @param name - Nome amigável da key
 * @param expiresAt - Data de expiração opcional
 * @param isTest - Se é uma chave de teste
 * @returns A API key completa (só mostrada uma vez) e os dados salvos
 */
export async function createApiKey(
  userId: string,
  name: string,
  expiresAt?: Date,
  isTest: boolean = false
): Promise<{
  key: string; // Key completa - MOSTRAR APENAS UMA VEZ
  id: string;
  name: string;
  prefix: string;
  expiresAt: Date | null;
  createdAt: Date;
}> {
  const { key, prefix } = generateApiKey(isTest);
  const keyHash = await hashApiKey(key);

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      keyHash,
      keyPrefix: prefix,
      expiresAt,
      userId,
    },
  });

  return {
    key, // IMPORTANTE: Retornar apenas uma vez!
    id: apiKey.id,
    name: apiKey.name,
    prefix: apiKey.keyPrefix,
    expiresAt: apiKey.expiresAt,
    createdAt: apiKey.createdAt,
  };
}

/**
 * Lista as API keys de um usuário (sem expor os hashes)
 * @param userId - ID do usuário
 * @returns Lista de API keys com informações seguras
 */
export async function listApiKeys(userId: string) {
  return prisma.apiKey.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      lastUsed: true,
      expiresAt: true,
      requestCount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Revoga (deleta) uma API key
 * @param keyId - ID da API key
 * @param userId - ID do usuário (para verificação de propriedade)
 * @returns true se deletada com sucesso
 */
export async function revokeApiKey(
  keyId: string,
  userId: string
): Promise<boolean> {
  const result = await prisma.apiKey.deleteMany({
    where: {
      id: keyId,
      userId, // Garante que só o dono pode deletar
    },
  });

  return result.count > 0;
}

/**
 * Atualiza o nome de uma API key
 * @param keyId - ID da API key
 * @param userId - ID do usuário
 * @param name - Novo nome
 * @returns API key atualizada ou null se não encontrada
 */
export async function updateApiKeyName(
  keyId: string,
  userId: string,
  name: string
) {
  try {
    return await prisma.apiKey.update({
      where: {
        id: keyId,
        userId,
      },
      data: { name },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        lastUsed: true,
        expiresAt: true,
        requestCount: true,
        createdAt: true,
      },
    });
  } catch {
    return null;
  }
}

/**
 * Middleware helper para validar API key em rotas de API
 * Extrai a key do header Authorization
 */
export function extractApiKeyFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader) return null;

  // Suporta "Bearer sk_live_xxx" ou apenas "sk_live_xxx"
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Suporta header direto com o prefixo da key
  if (
    authHeader.startsWith(API_KEY_CONFIG.prefix) ||
    authHeader.startsWith(API_KEY_CONFIG.testPrefix)
  ) {
    return authHeader;
  }

  return null;
}

/**
 * Mascara uma API key para exibição segura
 * @param prefix - O prefixo armazenado
 * @returns String mascarada como "sk_live_12...xxxx"
 */
export function maskApiKey(prefix: string): string {
  return `${prefix}...****`;
}
