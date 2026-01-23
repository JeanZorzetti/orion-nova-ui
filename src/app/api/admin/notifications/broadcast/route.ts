import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBroadcastNotification } from "@/lib/notifications";
import { z } from "zod";

// Schema de validação para broadcast
const broadcastSchema = z.object({
  type: z.enum([
    "INFO",
    "SUCCESS",
    "WARNING",
    "ERROR",
    "PAYMENT",
    "SUBSCRIPTION",
    "SUPPORT",
    "SYSTEM",
  ]),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  link: z.string().optional(),
  sendEmail: z.boolean().default(false),
  targetAudience: z.enum(["all", "trial", "active", "expired"]),
});

// POST /api/admin/notifications/broadcast - Enviar notificação em massa
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Verificar se usuário está autenticado
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar se usuário é admin (você pode adicionar campo isAdmin no modelo User)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true },
    });

    // Por enquanto, vamos permitir apenas para emails específicos
    // Depois você pode adicionar um campo isAdmin no banco
    const adminEmails = [
      "admin@orion-erp.com",
      "contato@orion-erp.com",
      // Adicione emails de admins aqui
    ];

    if (!user || !adminEmails.includes(user.email)) {
      return NextResponse.json(
        { error: "Acesso negado - apenas administradores" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = broadcastSchema.parse(body);

    // Buscar usuários baseado no público-alvo
    let targetUsers: { id: string }[] = [];

    switch (validatedData.targetAudience) {
      case "all":
        targetUsers = await prisma.user.findMany({
          select: { id: true },
        });
        break;
      case "trial":
        targetUsers = await prisma.user.findMany({
          where: { subscriptionStatus: "TRIAL" },
          select: { id: true },
        });
        break;
      case "active":
        targetUsers = await prisma.user.findMany({
          where: { subscriptionStatus: "ACTIVE" },
          select: { id: true },
        });
        break;
      case "expired":
        targetUsers = await prisma.user.findMany({
          where: {
            subscriptionStatus: {
              in: ["EXPIRED", "CANCELLED"],
            },
          },
          select: { id: true },
        });
        break;
    }

    const userIds = targetUsers.map((u) => u.id);

    // Enviar notificações em massa
    const results = await createBroadcastNotification(
      userIds,
      validatedData.type,
      validatedData.title,
      validatedData.message,
      validatedData.link,
      validatedData.sendEmail
    );

    return NextResponse.json({
      success: true,
      message: "Notificações enviadas com sucesso",
      results,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro ao enviar notificações em massa:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao enviar notificações" },
      { status: 500 }
    );
  }
}
