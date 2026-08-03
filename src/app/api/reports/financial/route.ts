import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/reports/financial - Relatório financeiro
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.accountId;
    const { searchParams } = new URL(request.url);

    // Filtros
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");

    // Construir filtros
    const where: any = { userId };

    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) where.dueDate.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.dueDate.lte = end;
      }
    }

    if (type) {
      where.type = type;
    }

    // Buscar transações
    const transactions = await prisma.financialTransaction.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    // Separar recebíveis e pagáveis
    const receivables = transactions.filter((t) => t.type === "RECEIVABLE");
    const payables = transactions.filter((t) => t.type === "PAYABLE");

    // Calcular totais de recebíveis
    const receivablesTotals = {
      total: receivables.reduce((sum, t) => sum + Number(t.amount), 0),
      paid: receivables
        .filter((t) => t.status === "PAID")
        .reduce((sum, t) => sum + Number(t.amount), 0),
      pending: receivables
        .filter((t) => t.status === "PENDING")
        .reduce((sum, t) => sum + Number(t.amount), 0),
      overdue: receivables
        .filter((t) => {
          const today = new Date();
          const due = new Date(t.dueDate);
          return t.status !== "PAID" && due < today;
        })
        .reduce((sum, t) => sum + Number(t.amount), 0),
    };

    // Calcular totais de pagáveis
    const payablesTotals = {
      total: payables.reduce((sum, t) => sum + Number(t.amount), 0),
      paid: payables
        .filter((t) => t.status === "PAID")
        .reduce((sum, t) => sum + Number(t.amount), 0),
      pending: payables
        .filter((t) => t.status === "PENDING")
        .reduce((sum, t) => sum + Number(t.amount), 0),
      overdue: payables
        .filter((t) => {
          const today = new Date();
          const due = new Date(t.dueDate);
          return t.status !== "PAID" && due < today;
        })
        .reduce((sum, t) => sum + Number(t.amount), 0),
    };

    // Calcular saldo (recebíveis - pagáveis)
    const balance = {
      total: receivablesTotals.total - payablesTotals.total,
      paid: receivablesTotals.paid - payablesTotals.paid,
      pending: receivablesTotals.pending - payablesTotals.pending,
    };

    // Agrupar por categoria
    const byCategory: any = {};
    transactions.forEach((t) => {
      const key = `${t.type}_${t.category}`;
      if (!byCategory[key]) {
        byCategory[key] = {
          type: t.type,
          category: t.category,
          count: 0,
          total: 0,
          paid: 0,
          pending: 0,
        };
      }
      byCategory[key].count++;
      byCategory[key].total += Number(t.amount);
      if (t.status === "PAID") {
        byCategory[key].paid += Number(t.amount);
      } else {
        byCategory[key].pending += Number(t.amount);
      }
    });

    // Agrupar por mês
    const byMonth: any = {};
    transactions.forEach((t) => {
      const date = new Date(t.dueDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!byMonth[key]) {
        byMonth[key] = {
          receivables: { total: 0, paid: 0, pending: 0 },
          payables: { total: 0, paid: 0, pending: 0 },
        };
      }

      const category = t.type === "RECEIVABLE" ? "receivables" : "payables";
      byMonth[key][category].total += Number(t.amount);
      if (t.status === "PAID") {
        byMonth[key][category].paid += Number(t.amount);
      } else {
        byMonth[key][category].pending += Number(t.amount);
      }
    });

    // Próximos vencimentos (próximos 30 dias)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const upcomingDue = transactions
      .filter((t) => {
        const due = new Date(t.dueDate);
        return t.status !== "PAID" && due >= today && due <= thirtyDaysFromNow;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 10)
      .map((t) => ({
        id: t.id,
        type: t.type,
        category: t.category,
        description: t.description,
        amount: Number(t.amount),
        dueDate: t.dueDate,
        customer: t.customer?.name,
      }));

    return NextResponse.json({
      receivables: receivablesTotals,
      payables: payablesTotals,
      balance,
      byCategory: Object.values(byCategory),
      byMonth,
      upcomingDue,
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        category: t.category,
        description: t.description,
        amount: Number(t.amount),
        dueDate: t.dueDate,
        paidAt: t.paidAt,
        status: t.status,
        customer: t.customer?.name,
        customerId: t.customer?.id,
      })),
    });
  } catch (error) {
    console.error("Erro ao gerar relatório financeiro:", error);
    return NextResponse.json(
      { error: "Erro ao gerar relatório financeiro" },
      { status: 500 }
    );
  }
}
