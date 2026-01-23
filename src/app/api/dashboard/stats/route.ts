import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard/stats - Buscar estatísticas do dashboard
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Buscar estatísticas em paralelo para melhor performance
    const [customersCount, productsCount, salesCount, salesOrdersData] =
      await Promise.all([
        // Total de clientes
        prisma.customer.count({
          where: {
            userId,
            isActive: true,
          },
        }),

        // Total de produtos
        prisma.product.count({
          where: {
            userId,
            isActive: true,
          },
        }),

        // Total de vendas (pedidos completados)
        prisma.salesOrder.count({
          where: {
            userId,
            status: "COMPLETED",
          },
        }),

        // Faturamento total (soma de pedidos completados)
        prisma.salesOrder.findMany({
          where: {
            userId,
            status: "COMPLETED",
          },
          select: {
            total: true,
          },
        }),
      ]);

    // Calcular faturamento total
    const revenue = salesOrdersData.reduce((sum, order) => {
      return sum + Number(order.total);
    }, 0);

    // Buscar estatísticas adicionais
    const [pendingSalesCount, overdueSalesCount, topProducts, recentSales] =
      await Promise.all([
        // Vendas pendentes
        prisma.salesOrder.count({
          where: {
            userId,
            status: { in: ["DRAFT", "CONFIRMED", "PROCESSING"] },
          },
        }),

        // Vendas atrasadas (paymentStatus = OVERDUE)
        prisma.salesOrder.count({
          where: {
            userId,
            paymentStatus: "OVERDUE",
          },
        }),

        // Top 5 produtos mais vendidos
        prisma.orderItem.groupBy({
          by: ["productId"],
          where: {
            order: {
              userId,
              status: "COMPLETED",
            },
          },
          _sum: {
            quantity: true,
          },
          orderBy: {
            _sum: {
              quantity: "desc",
            },
          },
          take: 5,
        }),

        // Últimas 5 vendas
        prisma.salesOrder.findMany({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
            customer: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

    // Buscar detalhes dos top produtos
    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            sku: true,
            price: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum.quantity || 0,
        };
      })
    );

    // Estatísticas mensais (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      monthlySalesCount,
      monthlyRevenue,
      newCustomersCount,
      newProductsCount,
    ] = await Promise.all([
      prisma.salesOrder.count({
        where: {
          userId,
          status: "COMPLETED",
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      prisma.salesOrder.findMany({
        where: {
          userId,
          status: "COMPLETED",
          createdAt: { gte: thirtyDaysAgo },
        },
        select: {
          total: true,
        },
      }),

      prisma.customer.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),

      prisma.product.count({
        where: {
          userId,
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    const monthlyRevenueTotal = monthlyRevenue.reduce((sum, order) => {
      return sum + Number(order.total);
    }, 0);

    return NextResponse.json({
      // Estatísticas principais (para os cards)
      customers: customersCount,
      products: productsCount,
      sales: salesCount,
      revenue: revenue,

      // Estatísticas adicionais
      pendingSales: pendingSalesCount,
      overdueSales: overdueSalesCount,

      // Top produtos
      topProducts: topProductsDetails,

      // Vendas recentes
      recentSales: recentSales.map((sale) => ({
        id: sale.id,
        orderNumber: sale.orderNumber,
        customerName: sale.customer.name,
        total: Number(sale.total),
        status: sale.status,
        date: sale.createdAt,
      })),

      // Estatísticas mensais (últimos 30 dias)
      monthly: {
        sales: monthlySalesCount,
        revenue: monthlyRevenueTotal,
        newCustomers: newCustomersCount,
        newProducts: newProductsCount,
      },

      // Crescimento comparado com período anterior
      growth: {
        // TODO: Implementar cálculo de crescimento comparando com 30-60 dias atrás
        salesGrowth: 0,
        revenueGrowth: 0,
        customersGrowth: 0,
      },
    });
  } catch (error: any) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
