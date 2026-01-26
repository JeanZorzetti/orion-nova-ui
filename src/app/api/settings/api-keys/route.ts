import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { createApiKey, listApiKeys, maskApiKey } from "@/lib/api-keys";

// Schema de validação para criar API Key
const createApiKeySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  expiresInDays: z.number().int().positive().optional(), // Número de dias até expirar
});

// GET /api/settings/api-keys - Listar API Keys do usuário
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const apiKeys = await listApiKeys(session.user.id);

    // Formata para exibição segura
    const safeKeys = apiKeys.map((key) => ({
      ...key,
      maskedKey: maskApiKey(key.keyPrefix),
    }));

    return NextResponse.json({ apiKeys: safeKeys });
  } catch (error) {
    console.error("Erro ao listar API keys:", error);
    return NextResponse.json(
      { error: "Erro ao listar API keys" },
      { status: 500 }
    );
  }
}

// POST /api/settings/api-keys - Criar nova API Key
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createApiKeySchema.parse(body);

    // Calcula data de expiração se especificada
    let expiresAt: Date | undefined;
    if (validatedData.expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validatedData.expiresInDays);
    }

    // Verifica limite de API keys por usuário (máximo 5)
    const existingKeys = await listApiKeys(session.user.id);
    if (existingKeys.length >= 5) {
      return NextResponse.json(
        { error: "Limite máximo de 5 API keys atingido" },
        { status: 400 }
      );
    }

    const result = await createApiKey(
      session.user.id,
      validatedData.name,
      expiresAt
    );

    // IMPORTANTE: A key completa só é retornada neste momento!
    // O usuário DEVE copiá-la agora, pois não será exibida novamente.
    return NextResponse.json(
      {
        apiKey: {
          id: result.id,
          name: result.name,
          key: result.key, // Key completa - MOSTRAR APENAS UMA VEZ
          prefix: result.prefix,
          expiresAt: result.expiresAt,
          createdAt: result.createdAt,
        },
        warning:
          "Guarde esta chave em um local seguro. Ela não será exibida novamente.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao criar API key:", error);
    return NextResponse.json(
      { error: "Erro ao criar API key" },
      { status: 500 }
    );
  }
}
