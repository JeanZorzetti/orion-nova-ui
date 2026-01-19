import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/support/[id]/reply - Adicionar resposta ao ticket
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Mensagem é obrigatória" },
        { status: 400 }
      );
    }

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

    // Verificar permissões: apenas o dono do ticket ou admin pode responder
    const isAdmin =
      session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
    const isOwner = existingTicket.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Você não tem permissão para responder este ticket" },
        { status: 403 }
      );
    }

    // Criar resposta
    await prisma.supportTicketReply.create({
      data: {
        ticketId: id,
        message: message.trim(),
        isStaff: isAdmin, // Se for admin, marca como resposta da equipe
      },
    });

    // Atualizar status do ticket se for resposta do admin
    if (isAdmin && existingTicket.status === "WAITING_CUSTOMER") {
      await prisma.supportTicket.update({
        where: { id },
        data: { status: "IN_PROGRESS" },
      });
    } else if (!isAdmin && existingTicket.status === "IN_PROGRESS") {
      // Se for resposta do cliente, marcar como aguardando
      await prisma.supportTicket.update({
        where: { id },
        data: { status: "WAITING_CUSTOMER" },
      });
    }

    // Buscar ticket atualizado com todas as informações
    const updatedTicket = await prisma.supportTicket.findUnique({
      where: { id },
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

    return NextResponse.json({ ticket: updatedTicket }, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar resposta:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar resposta" },
      { status: 500 }
    );
  }
}
