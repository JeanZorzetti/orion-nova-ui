import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/notifications/[id] - Marcar notificação individual como lida
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se a notificação pertence ao usuário
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notificação não encontrada" },
        { status: 404 }
      );
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Não autorizado a modificar esta notificação" },
        { status: 403 }
      );
    }

    // Marcar como lida
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error: any) {
    console.error("Erro ao marcar notificação como lida:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao marcar notificação como lida" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - Deletar notificação
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verificar se a notificação pertence ao usuário
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notificação não encontrada" },
        { status: 404 }
      );
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Não autorizado a deletar esta notificação" },
        { status: 403 }
      );
    }

    // Deletar notificação
    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Notificação deletada com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar notificação:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao deletar notificação" },
      { status: 500 }
    );
  }
}
