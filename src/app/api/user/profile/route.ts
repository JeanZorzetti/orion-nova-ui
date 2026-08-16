import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação. Todos opcionais: a tela de perfil manda só `name`, a de
// notificações manda só o toggle que mudou — um PATCH parcial de verdade.
const updateProfileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  notifyNewOrders: z.boolean().optional(),
  notifyLowStock: z.boolean().optional(),
  notifyDueBills: z.boolean().optional(),
});

const PERFIL_SELECT = {
  id: true,
  name: true,
  email: true,
  role: true,
  notifyNewOrders: true,
  notifyLowStock: true,
  notifyDueBills: true,
} as const;

// PATCH /api/user/profile - Atualizar perfil do usuário
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Atualizar usuário. `data` só leva as chaves enviadas — Zod já removeu as
    // ausentes, então um toggle não apaga o nome.
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: PERFIL_SELECT,
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}

// GET /api/user/profile - Obter perfil do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { ...PERFIL_SELECT, createdAt: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil" },
      { status: 500 }
    );
  }
}
