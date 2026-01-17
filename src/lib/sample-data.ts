import { prisma } from "@/lib/prisma";

/**
 * Popula o banco de dados com dados de exemplo para demonstração
 */
export async function populateSampleData(userId: string) {
  try {
    // Verificar se já existem dados de exemplo
    const existingData = await prisma.customer.findFirst({
      where: { userId, name: { contains: "[EXEMPLO]" } },
    });

    if (existingData) {
      throw new Error("Dados de exemplo já existem. Remova-os primeiro.");
    }

    // 1. Criar clientes de exemplo
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          userId,
          name: "[EXEMPLO] João Silva",
          email: "joao.silva@exemplo.com",
          phone: "(11) 98765-4321",
          cpfCnpj: "123.456.789-00",
          type: "PESSOA_FISICA",
          address: "Rua Exemplo, 123",
          city: "São Paulo",
          state: "SP",
          zipCode: "01234-567",
          notes: "Cliente de exemplo para demonstração",
        },
      }),
      prisma.customer.create({
        data: {
          userId,
          name: "[EXEMPLO] Tech Solutions LTDA",
          email: "contato@techsolutions.exemplo.com",
          phone: "(11) 3456-7890",
          cpfCnpj: "12.345.678/0001-90",
          type: "PESSOA_JURIDICA",
          address: "Av. Tecnologia, 456",
          city: "São Paulo",
          state: "SP",
          zipCode: "04567-890",
          notes: "Empresa de exemplo para demonstração",
        },
      }),
      prisma.customer.create({
        data: {
          userId,
          name: "[EXEMPLO] Maria Santos",
          email: "maria.santos@exemplo.com",
          phone: "(21) 99876-5432",
          cpfCnpj: "987.654.321-00",
          type: "PESSOA_FISICA",
          address: "Rua das Flores, 789",
          city: "Rio de Janeiro",
          state: "RJ",
          zipCode: "20000-123",
        },
      }),
    ]);

    // 2. Criar produtos de exemplo
    const products = await Promise.all([
      prisma.product.create({
        data: {
          userId,
          name: "[EXEMPLO] Notebook Dell Inspiron 15",
          sku: "NB-DELL-001",
          description: "Notebook Dell Inspiron 15, Intel i5, 8GB RAM, 256GB SSD",
          type: "PRODUCT",
          category: "Informática",
          price: 3500.00,
          cost: 2800.00,
          stockQuantity: 15,
          minStock: 5,
          unit: "UN",
        },
      }),
      prisma.product.create({
        data: {
          userId,
          name: "[EXEMPLO] Mouse Logitech MX Master 3",
          sku: "MSE-LOG-001",
          description: "Mouse sem fio ergonômico Logitech MX Master 3",
          type: "PRODUCT",
          category: "Periféricos",
          price: 450.00,
          cost: 300.00,
          stockQuantity: 3,
          minStock: 10,
          unit: "UN",
        },
      }),
      prisma.product.create({
        data: {
          userId,
          name: "[EXEMPLO] Consultoria em TI",
          sku: "SRV-CONS-001",
          description: "Consultoria especializada em infraestrutura de TI",
          type: "SERVICE",
          category: "Serviços",
          price: 200.00,
          cost: 100.00,
          stockQuantity: 0,
          minStock: 0,
          unit: "HH",
        },
      }),
      prisma.product.create({
        data: {
          userId,
          name: "[EXEMPLO] Teclado Mecânico Keychron K2",
          sku: "TEC-KEY-001",
          description: "Teclado mecânico sem fio Keychron K2",
          type: "PRODUCT",
          category: "Periféricos",
          price: 650.00,
          cost: 450.00,
          stockQuantity: 0,
          minStock: 5,
          unit: "UN",
        },
      }),
    ]);

    // 3. Criar pedidos de venda de exemplo
    const salesOrders = await Promise.all([
      prisma.salesOrder.create({
        data: {
          userId,
          customerId: customers[0].id,
          orderNumber: "PV-2026-001",
          subtotal: 3500.00,
          discount: 0,
          total: 3500.00,
          status: "COMPLETED",
          paymentStatus: "PAID",
          orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
          paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          items: {
            create: [
              {
                productId: products[0].id,
                quantity: 1,
                unitPrice: 3500.00,
                total: 3500.00,
              },
            ],
          },
        },
      }),
      prisma.salesOrder.create({
        data: {
          userId,
          customerId: customers[1].id,
          orderNumber: "PV-2026-002",
          subtotal: 1100.00,
          discount: 100.00,
          total: 1000.00,
          status: "CONFIRMED",
          paymentStatus: "PENDING",
          orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
        },
      }),
    ]);

    // 4. Criar transações financeiras de exemplo
    await Promise.all([
      // Contas a receber
      prisma.financialTransaction.create({
        data: {
          userId,
          type: "RECEIVABLE",
          category: "Vendas",
          description: "[EXEMPLO] Pagamento Pedido PV-2026-001",
          amount: 3500.00,
          customerId: customers[0].id,
          orderId: salesOrders[0].id,
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          status: "PAID",
        },
      }),
      prisma.financialTransaction.create({
        data: {
          userId,
          type: "RECEIVABLE",
          category: "Vendas",
          description: "[EXEMPLO] Pagamento Pedido PV-2026-002",
          amount: 1000.00,
          customerId: customers[1].id,
          orderId: salesOrders[1].id,
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Vence em 10 dias
          status: "PENDING",
        },
      }),
      prisma.financialTransaction.create({
        data: {
          userId,
          type: "RECEIVABLE",
          category: "Serviços",
          description: "[EXEMPLO] Consultoria em TI - Projeto XYZ",
          amount: 2400.00,
          customerId: customers[1].id,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Vence em 15 dias
          status: "PENDING",
        },
      }),
      // Contas a pagar
      prisma.financialTransaction.create({
        data: {
          userId,
          type: "PAYABLE",
          category: "Fornecedores",
          description: "[EXEMPLO] Fornecedor TechSupply - Reposição Estoque",
          amount: 5000.00,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Vence em 7 dias
          status: "PENDING",
        },
      }),
      prisma.financialTransaction.create({
        data: {
          userId,
          type: "PAYABLE",
          category: "Despesas Operacionais",
          description: "[EXEMPLO] Aluguel - Janeiro 2026",
          amount: 3000.00,
          dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Vence em 20 dias
          status: "PENDING",
        },
      }),
      prisma.financialTransaction.create({
        data: {
          userId,
          type: "PAYABLE",
          category: "Impostos",
          description: "[EXEMPLO] DAS - Simples Nacional",
          amount: 850.00,
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Venceu há 2 dias (atrasado!)
          status: "OVERDUE",
        },
      }),
    ]);

    return {
      success: true,
      message: "Dados de exemplo criados com sucesso!",
      data: {
        customers: customers.length,
        products: products.length,
        salesOrders: salesOrders.length,
        financialTransactions: 6,
      },
    };
  } catch (error) {
    console.error("Erro ao popular dados de exemplo:", error);
    throw error;
  }
}

/**
 * Remove todos os dados de exemplo do banco de dados
 */
export async function clearSampleData(userId: string) {
  try {
    // Buscar IDs dos dados de exemplo
    const sampleCustomers = await prisma.customer.findMany({
      where: { userId, name: { contains: "[EXEMPLO]" } },
      select: { id: true },
    });

    const sampleProducts = await prisma.product.findMany({
      where: { userId, name: { contains: "[EXEMPLO]" } },
      select: { id: true },
    });

    const sampleOrders = await prisma.salesOrder.findMany({
      where: { userId, orderNumber: { startsWith: "PV-2026-" } },
      select: { id: true },
    });

    const sampleTransactions = await prisma.financialTransaction.findMany({
      where: { userId, description: { contains: "[EXEMPLO]" } },
      select: { id: true },
    });

    // Deletar em ordem (respeitar foreign keys)
    // 1. Itens de pedido
    await prisma.orderItem.deleteMany({
      where: { orderId: { in: sampleOrders.map((o) => o.id) } },
    });

    // 2. Transações financeiras
    await prisma.financialTransaction.deleteMany({
      where: { id: { in: sampleTransactions.map((t) => t.id) } },
    });

    // 3. Pedidos
    await prisma.salesOrder.deleteMany({
      where: { id: { in: sampleOrders.map((o) => o.id) } },
    });

    // 4. Produtos
    await prisma.product.deleteMany({
      where: { id: { in: sampleProducts.map((p) => p.id) } },
    });

    // 5. Clientes
    await prisma.customer.deleteMany({
      where: { id: { in: sampleCustomers.map((c) => c.id) } },
    });

    return {
      success: true,
      message: "Dados de exemplo removidos com sucesso!",
      data: {
        customers: sampleCustomers.length,
        products: sampleProducts.length,
        salesOrders: sampleOrders.length,
        financialTransactions: sampleTransactions.length,
      },
    };
  } catch (error) {
    console.error("Erro ao remover dados de exemplo:", error);
    throw error;
  }
}

/**
 * Verifica se existem dados de exemplo no banco
 */
export async function hasSampleData(userId: string): Promise<boolean> {
  const count = await prisma.customer.count({
    where: { userId, name: { contains: "[EXEMPLO]" } },
  });
  return count > 0;
}
