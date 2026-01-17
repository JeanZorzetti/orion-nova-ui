import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/reports/customers - Relatório de clientes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Filtros
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");
    const city = searchParams.get("city");
    const state = searchParams.get("state");

    // Construir filtros
    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true";
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (state) {
      where.state = state;
    }

    // Buscar clientes com pedidos
    const customers = await prisma.customer.findMany({
      where,
      include: {
        salesOrders: {
          select: {
            id: true,
            total: true,
            status: true,
            orderDate: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular estatísticas por cliente
    const customerStats = customers.map((customer) => {
      const orderCount = customer.salesOrders.length;
      const totalSpent = customer.salesOrders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      );
      const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
      const lastOrderDate =
        customer.salesOrders.length > 0
          ? customer.salesOrders.sort(
              (a, b) =>
                new Date(b.orderDate).getTime() -
                new Date(a.orderDate).getTime()
            )[0].orderDate
          : null;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        cpfCnpj: customer.cpfCnpj,
        type: customer.type,
        city: customer.city,
        state: customer.state,
        isActive: customer.isActive,
        createdAt: customer.createdAt,
        orderCount,
        totalSpent,
        averageOrderValue,
        lastOrderDate,
      };
    });

    // Estatísticas gerais
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.isActive).length;
    const inactiveCustomers = totalCustomers - activeCustomers;
    const customersWithOrders = customerStats.filter(
      (c) => c.orderCount > 0
    ).length;
    const customersWithoutOrders = totalCustomers - customersWithOrders;

    // Agrupar por tipo
    const byType = customers.reduce((acc: any, customer) => {
      if (!acc[customer.type]) {
        acc[customer.type] = 0;
      }
      acc[customer.type]++;
      return acc;
    }, {});

    // Agrupar por estado
    const byState = customers.reduce((acc: any, customer) => {
      const state = customer.state || "Não informado";
      if (!acc[state]) {
        acc[state] = 0;
      }
      acc[state]++;
      return acc;
    }, {});

    // Top clientes por valor gasto
    const topCustomers = [...customerStats]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return NextResponse.json({
      summary: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        customersWithOrders,
        customersWithoutOrders,
      },
      byType,
      byState,
      topCustomers,
      customers: customerStats,
    });
  } catch (error) {
    console.error("Erro ao gerar relatório de clientes:", error);
    return NextResponse.json(
      { error: "Erro ao gerar relatório de clientes" },
      { status: 500 }
    );
  }
}
