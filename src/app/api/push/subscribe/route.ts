import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação para subscrição push
const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

// POST /api/push/subscribe - Inscrever-se em notificações push
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = subscribeSchema.parse(body);

    // Verificar se já existe subscrição com este endpoint
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { endpoint: validatedData.endpoint },
    });

    if (existingSubscription) {
      // Se já existe mas pertence a outro usuário, atualizar
      if (existingSubscription.userId !== session.user.id) {
        await prisma.pushSubscription.update({
          where: { endpoint: validatedData.endpoint },
          data: {
            userId: session.user.id,
            p256dh: validatedData.keys.p256dh,
            auth: validatedData.keys.auth,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Subscrição atualizada",
        subscription: existingSubscription,
      });
    }

    // Criar nova subscrição
    const subscription = await prisma.pushSubscription.create({
      data: {
        userId: session.user.id,
        endpoint: validatedData.endpoint,
        p256dh: validatedData.keys.p256dh,
        auth: validatedData.keys.auth,
      },
    });

    console.log(
      `[Push Subscribe] Usuário ${session.user.id} inscrito em notificações push`
    );

    return NextResponse.json({
      success: true,
      message: "Subscrição criada com sucesso",
      subscription,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao criar subscrição push:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar subscrição" },
      { status: 500 }
    );
  }
}
