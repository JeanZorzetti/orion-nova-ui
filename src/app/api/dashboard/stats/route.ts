import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/stats - Estatísticas do dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Data de 30 dias atrás
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Data de hoje no início do dia
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Data de início do mês
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Buscar estatísticas em paralelo
    const [
      totalCustomers,
      totalProducts,
      totalOrders,
      totalOrdersThisMonth,
      revenueThisMonth,
      recentOrders,
      lowStockProducts,
      salesLast30Days,
      topCustomers,
    ] = await Promise.all([
      // Total de clientes
      prisma.customer.count({
        where: { userId, isActive: true },
      }),

      // Total de produtos
      prisma.product.count({
        where: { userId, isActive: true },
      }),

      // Total de pedidos
      prisma.salesOrder.count({
        where: { userId },
      }),

      // Total de pedidos este mês
      prisma.salesOrder.count({
        where: {
          userId,
          orderDate: {
            gte: startOfMonth,
          },
        },
      }),

      // Receita este mês
      prisma.salesOrder.aggregate({
        where: {
          userId,
          orderDate: {
            gte: startOfMonth,
          },
          status: {
            in: ["CONFIRMED", "PROCESSING", "COMPLETED"],
          },
        },
        _sum: {
          total: true,
        },
      }),

      // Pedidos recentes (últimos 5)
      prisma.salesOrder.findMany({
        where: { userId },
        include: {
          customer: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Produtos com estoque baixo
      prisma.$queryRaw`
        SELECT * FROM products
        WHERE "userId" = ${userId}
        AND type = 'PRODUCT'
        AND "stockQuantity" <= "minStock"
        AND "isActive" = true
        ORDER BY "stockQuantity" ASC
        LIMIT 5
      `,

      // Vendas dos últimos 30 dias (agrupadas por dia)
      prisma.salesOrder.groupBy({
        by: ["orderDate"],
        where: {
          userId,
          orderDate: {
            gte: thirtyDaysAgo,
          },
          status: {
            in: ["CONFIRMED", "PROCESSING", "COMPLETED"],
          },
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          orderDate: "asc",
        },
      }),

      // Top 5 clientes (por valor de pedidos)
      prisma.salesOrder.groupBy({
        by: ["customerId"],
        where: {
          userId,
          status: {
            in: ["CONFIRMED", "PROCESSING", "COMPLETED"],
          },
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          _sum: {
            total: "desc",
          },
        },
        take: 5,
      }),
    ]);

    // Buscar nomes dos top clientes
    const topCustomerIds = topCustomers.map((tc) => tc.customerId);
    const customersData = await prisma.customer.findMany({
      where: {
        id: {
          in: topCustomerIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Mapear top clientes com nomes
    const topCustomersWithNames = topCustomers.map((tc) => ({
      customer: customersData.find((c) => c.id === tc.customerId),
      totalSpent: tc._sum.total || 0,
      orderCount: tc._count.id,
    }));

    // Formatar dados de vendas dos últimos 30 dias
    const salesChartData = salesLast30Days.map((sale) => ({
      date: sale.orderDate.toISOString().split("T")[0],
      total: Number(sale._sum.total || 0),
      count: sale._count.id,
    }));

    return NextResponse.json({
      summary: {
        totalCustomers,
        totalProducts,
        totalOrders,
        totalOrdersThisMonth,
        revenueThisMonth: Number(revenueThisMonth._sum.total || 0),
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customer.name,
        total: Number(order.total),
        status: order.status,
        paymentStatus: order.paymentStatus,
        orderDate: order.orderDate,
      })),
      lowStockProducts,
      salesChart: salesChartData,
      topCustomers: topCustomersWithNames,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
