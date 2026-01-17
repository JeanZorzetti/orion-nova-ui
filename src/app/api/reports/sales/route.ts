import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/reports/sales - Relatório de vendas
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Filtros
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");
    const groupBy = searchParams.get("groupBy") || "day"; // day, week, month

    // Construir filtros
    const where: any = { userId };

    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) where.orderDate.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.orderDate.lte = end;
      }
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (status) {
      where.status = status;
    }

    // Buscar pedidos
    const orders = await prisma.salesOrder.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
      orderBy: {
        orderDate: "desc",
      },
    });

    // Calcular estatísticas gerais
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Agrupar por status
    const byStatus = orders.reduce((acc: any, order) => {
      if (!acc[order.status]) {
        acc[order.status] = { count: 0, total: 0 };
      }
      acc[order.status].count++;
      acc[order.status].total += Number(order.total);
      return acc;
    }, {});

    // Agrupar por período
    const byPeriod: any = {};
    orders.forEach((order) => {
      let key: string;
      const date = new Date(order.orderDate);

      if (groupBy === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      } else if (groupBy === "week") {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor(
          (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
        );
        const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
        key = `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
      } else {
        // day
        key = date.toISOString().split("T")[0];
      }

      if (!byPeriod[key]) {
        byPeriod[key] = { count: 0, total: 0, orders: [] };
      }
      byPeriod[key].count++;
      byPeriod[key].total += Number(order.total);
      byPeriod[key].orders.push({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customer.name,
        total: Number(order.total),
        status: order.status,
      });
    });

    // Top produtos vendidos
    const productSales: any = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.product.id;
        if (!productSales[productId]) {
          productSales[productId] = {
            productId: item.product.id,
            productName: item.product.name,
            category: item.product.category,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += Number(item.total);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);

    // Top clientes
    const customerSales: any = {};
    orders.forEach((order) => {
      const customerId = order.customer.id;
      if (!customerSales[customerId]) {
        customerSales[customerId] = {
          customerId: order.customer.id,
          customerName: order.customer.name,
          orderCount: 0,
          totalSpent: 0,
        };
      }
      customerSales[customerId].orderCount++;
      customerSales[customerId].totalSpent += Number(order.total);
    });

    const topCustomers = Object.values(customerSales)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return NextResponse.json({
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
      },
      byStatus,
      byPeriod,
      topProducts,
      topCustomers,
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customer.name,
        customerId: order.customer.id,
        orderDate: order.orderDate,
        total: Number(order.total),
        status: order.status,
        paymentStatus: order.paymentStatus,
        itemCount: order.items.length,
      })),
    });
  } catch (error) {
    console.error("Erro ao gerar relatório de vendas:", error);
    return NextResponse.json(
      { error: "Erro ao gerar relatório de vendas" },
      { status: 500 }
    );
  }
}
