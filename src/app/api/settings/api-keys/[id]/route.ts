import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { revokeApiKey, updateApiKeyName } from "@/lib/api-keys";

// Schema de validação para atualizar nome
const updateApiKeySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
});

// PATCH /api/settings/api-keys/[id] - Atualizar nome da API Key
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateApiKeySchema.parse(body);

    const updated = await updateApiKeyName(
      id,
      session.user.id,
      validatedData.name
    );

    if (!updated) {
      return NextResponse.json(
        { error: "API key não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ apiKey: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar API key:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar API key" },
      { status: 500 }
    );
  }
}

// DELETE /api/settings/api-keys/[id] - Revogar (deletar) API Key
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await revokeApiKey(id, session.user.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "API key não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "API key revogada com sucesso" });
  } catch (error) {
    console.error("Erro ao revogar API key:", error);
    return NextResponse.json(
      { error: "Erro ao revogar API key" },
      { status: 500 }
    );
  }
}
