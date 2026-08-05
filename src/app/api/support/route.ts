import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notifyNewTicket, notifyTicketReply } from "@/lib/notifications";

// GET /api/support - Listar tickets de suporte
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    // Se não for admin, mostrar apenas seus próprios tickets
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
    if (!isAdmin) {
      where.userId = session.user.id;
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    // Buscar tickets
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          replies: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return NextResponse.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar tickets:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tickets" },
      { status: 500 }
    );
  }
}

// POST /api/support - Criar novo ticket
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subject, message, priority } = body;

    // Validações básicas
    if (!subject || !message) {
      return NextResponse.json(
        { error: "Assunto e mensagem são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        subject,
        message,
        priority: priority || "MEDIUM",
        status: "OPEN",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        replies: true,
      },
    });

    await notifyNewTicket(subject, message, ticket.user.name || ticket.user.email);

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    return NextResponse.json(
      { error: "Erro ao criar ticket" },
      { status: 500 }
    );
  }
}

// PUT /api/support - Atualizar ticket
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, priority, assignedTo, reply } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do ticket é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket não encontrado" },
        { status: 404 }
      );
    }

    // Verificar permissões
    const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
    const isOwner = ticket.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      );
    }

    // Preparar dados de atualização
    const updateData: any = {};

    // Apenas admins podem alterar status, prioridade e atribuir
    if (isAdmin) {
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      if (typeof assignedTo !== "undefined") updateData.assignedTo = assignedTo;

      if (status === "CLOSED" || status === "RESOLVED") {
        updateData.closedAt = new Date();
      }
    }

    // Atualizar ticket
    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // Se houver resposta, criar reply
    if (reply && reply.message) {
      await prisma.ticketReply.create({
        data: {
          ticketId: id,
          userId: session.user.id,
          message: reply.message,
          isStaff: isAdmin,
        },
      });

      await notifyTicketReply(id, ticket.userId, ticket.subject, isAdmin);

      // Se não for admin, mudar status para WAITING_CUSTOMER
      if (!isAdmin) {
        await prisma.supportTicket.update({
          where: { id },
          data: { status: "WAITING_CUSTOMER" },
        });
      } else {
        // Se for admin, mudar para IN_PROGRESS
        await prisma.supportTicket.update({
          where: { id },
          data: { status: "IN_PROGRESS" },
        });
      }
    }

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Erro ao atualizar ticket:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar ticket" },
      { status: 500 }
    );
  }
}

// DELETE /api/support - Deletar ticket (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do ticket é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.supportTicket.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Ticket deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar ticket:", error);
    return NextResponse.json(
      { error: "Erro ao deletar ticket" },
      { status: 500 }
    );
  }
}
