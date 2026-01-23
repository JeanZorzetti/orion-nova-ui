import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/push/unsubscribe - Cancelar inscrição em notificações push
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get("endpoint");

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se subscrição existe e pertence ao usuário
    const subscription = await prisma.pushSubscription.findUnique({
      where: { endpoint },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscrição não encontrada" },
        { status: 404 }
      );
    }

    if (subscription.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Não autorizado a remover esta subscrição" },
        { status: 403 }
      );
    }

    // Deletar subscrição
    await prisma.pushSubscription.delete({
      where: { endpoint },
    });

    console.log(
      `[Push Unsubscribe] Usuário ${session.user.id} cancelou subscrição push`
    );

    return NextResponse.json({
      success: true,
      message: "Subscrição removida com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao remover subscrição push:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao remover subscrição" },
      { status: 500 }
    );
  }
}
