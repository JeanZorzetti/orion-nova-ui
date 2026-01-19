import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH /api/support/[id] - Atualizar ticket
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Apenas ADMIN e SUPER_ADMIN podem atualizar tickets
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
    ) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, priority, assignedTo } = body;

    // Validar se o ticket existe
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: "Ticket não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedTo !== undefined && { assignedTo }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Erro ao atualizar ticket:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar ticket" },
      { status: 500 }
    );
  }
}

// DELETE /api/support/[id] - Deletar ticket
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    // Apenas SUPER_ADMIN pode deletar tickets
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id } = await params;

    // Validar se o ticket existe
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: "Ticket não encontrado" },
        { status: 404 }
      );
    }

    // Deletar ticket (Prisma vai deletar em cascata as replies)
    await prisma.supportTicket.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ticket deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar ticket:", error);
    return NextResponse.json(
      { error: "Erro ao deletar ticket" },
      { status: 500 }
    );
  }
}
