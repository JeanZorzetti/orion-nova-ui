import { prisma } from "@/lib/prisma";

/**
 * Busca dados do usuário para fornecer contexto personalizado à IA
 */
export async function getUserContextForAI(userId: string): Promise<string> {
  try {
    // Buscar dados em paralelo para otimizar performance
    const [
      customerStats,
      productStats,
      salesStats,
      financialStats,
      recentCustomers,
      allProducts,
      recentSales,
      upcomingReceivables,
      upcomingPayables,
    ] = await Promise.all([
      // Estatísticas de clientes
      prisma.customer.count({ where: { userId, isActive: true } }),

      // Estatísticas de produtos
      prisma.product.aggregate({
        where: { userId, isActive: true },
        _count: { id: true },
        _sum: { stockQuantity: true },
      }),

      // Estatísticas de vendas
      prisma.salesOrder.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { total: true },
      }),

      // Estatísticas financeiras
      prisma.financialTransaction.aggregate({
        where: { userId },
        _sum: { amount: true },
        _count: { id: true },
      }),

      // Clientes mais recentes (últimos 5)
      prisma.customer.findMany({
        where: { userId, isActive: true },
        select: { name: true, email: true, phone: true, type: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),

      // Produtos com estoque baixo (buscar todos ativos para filtrar depois)
      prisma.product.findMany({
        where: {
          userId,
          isActive: true,
        },
        select: { name: true, stockQuantity: true, minStock: true, sku: true },
        orderBy: { stockQuantity: "asc" },
      }),

      // Vendas recentes (últimas 5)
      prisma.salesOrder.findMany({
        where: { userId },
        select: {
          orderNumber: true,
          total: true,
          status: true,
          orderDate: true,
          customer: { select: { name: true } },
        },
        orderBy: { orderDate: "desc" },
        take: 5,
      }),

      // Contas a receber próximas (próximos 30 dias)
      prisma.financialTransaction.findMany({
        where: {
          userId,
          type: "RECEIVABLE",
          status: "PENDING",
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          description: true,
          amount: true,
          dueDate: true,
          customer: { select: { name: true } },
        },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),

      // Contas a pagar próximas (próximos 30 dias)
      prisma.financialTransaction.findMany({
        where: {
          userId,
          type: "PAYABLE",
          status: "PENDING",
          dueDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: {
          description: true,
          amount: true,
          dueDate: true,
        },
        orderBy: { dueDate: "asc" },
        take: 5,
      }),
    ]);

    // Filtrar produtos com estoque baixo (estoque <= estoque mínimo)
    const lowStockProducts = allProducts
      .filter((p) => p.stockQuantity <= p.minStock)
      .slice(0, 10);

    // Calcular métricas adicionais
    const totalReceivables = await prisma.financialTransaction.aggregate({
      where: { userId, type: "RECEIVABLE", status: "PENDING" },
      _sum: { amount: true },
    });

    const totalPayables = await prisma.financialTransaction.aggregate({
      where: { userId, type: "PAYABLE", status: "PENDING" },
      _sum: { amount: true },
    });

    const overdueReceivables = await prisma.financialTransaction.count({
      where: {
        userId,
        type: "RECEIVABLE",
        status: "OVERDUE",
      },
    });

    // Formatar contexto para a IA
    const context = `
# CONTEXTO DO USUÁRIO - DADOS ATUALIZADOS DO SISTEMA

## Resumo Geral
- **Total de Clientes Ativos**: ${customerStats}
- **Total de Produtos Cadastrados**: ${productStats._count.id || 0}
- **Total de Vendas Realizadas**: ${salesStats._count.id || 0}
- **Volume Total de Vendas**: R$ ${salesStats._sum.total?.toFixed(2) || "0.00"}
- **Total de Transações Financeiras**: ${financialStats._count.id || 0}

## Situação Financeira
- **Contas a Receber (Pendentes)**: R$ ${totalReceivables._sum.amount?.toFixed(2) || "0.00"}
- **Contas a Pagar (Pendentes)**: R$ ${totalPayables._sum.amount?.toFixed(2) || "0.00"}
- **Saldo Projetado**: R$ ${((totalReceivables._sum.amount?.toNumber() || 0) - (totalPayables._sum.amount?.toNumber() || 0)).toFixed(2)}
- **Contas em Atraso**: ${overdueReceivables} ${overdueReceivables === 1 ? "conta" : "contas"}

${
  recentCustomers.length > 0
    ? `## Clientes Recentes
${recentCustomers
  .map(
    (c, i) =>
      `${i + 1}. **${c.name}** (${c.type === "PESSOA_FISICA" ? "PF" : "PJ"})
   - Email: ${c.email || "Não informado"}
   - Telefone: ${c.phone || "Não informado"}
   - Cadastrado em: ${c.createdAt.toLocaleDateString("pt-BR")}`
  )
  .join("\n")}`
    : ""
}

${
  lowStockProducts.length > 0
    ? `## ⚠️ ALERTA: Produtos com Estoque Baixo
${lowStockProducts
  .map(
    (p, i) =>
      `${i + 1}. **${p.name}** ${p.sku ? `(SKU: ${p.sku})` : ""}
   - Estoque Atual: ${p.stockQuantity} ${p.stockQuantity === 1 ? "unidade" : "unidades"}
   - Estoque Mínimo: ${p.minStock}
   - Status: ${p.stockQuantity === 0 ? "🔴 SEM ESTOQUE" : "🟡 ABAIXO DO MÍNIMO"}`
  )
  .join("\n")}`
    : ""
}

${
  recentSales.length > 0
    ? `## Vendas Recentes
${recentSales
  .map(
    (s, i) =>
      `${i + 1}. **Pedido ${s.orderNumber}** - ${s.customer.name}
   - Valor: R$ ${s.total.toFixed(2)}
   - Status: ${translateSalesStatus(s.status)}
   - Data: ${s.orderDate.toLocaleDateString("pt-BR")}`
  )
  .join("\n")}`
    : ""
}

${
  upcomingReceivables.length > 0
    ? `## Contas a Receber (Próximos 30 dias)
${upcomingReceivables
  .map(
    (r, i) =>
      `${i + 1}. **${r.description}** ${r.customer ? `- ${r.customer.name}` : ""}
   - Valor: R$ ${r.amount.toFixed(2)}
   - Vencimento: ${r.dueDate.toLocaleDateString("pt-BR")}
   - Dias até vencimento: ${Math.ceil((r.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias`
  )
  .join("\n")}`
    : ""
}

${
  upcomingPayables.length > 0
    ? `## Contas a Pagar (Próximos 30 dias)
${upcomingPayables
  .map(
    (p, i) =>
      `${i + 1}. **${p.description}**
   - Valor: R$ ${p.amount.toFixed(2)}
   - Vencimento: ${p.dueDate.toLocaleDateString("pt-BR")}
   - Dias até vencimento: ${Math.ceil((p.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias`
  )
  .join("\n")}`
    : ""
}

---

**INSTRUÇÕES IMPORTANTES:**
1. Use SEMPRE esses dados reais ao responder perguntas sobre o negócio do usuário
2. Seja específico e cite números exatos quando disponíveis
3. Se o usuário perguntar sobre métricas, use os dados acima
4. Identifique proativamente problemas (estoque baixo, contas atrasadas, etc.)
5. Ofereça insights baseados nos dados reais apresentados
`.trim();

    return context;
  } catch (error) {
    console.error("Erro ao buscar contexto do usuário para IA:", error);
    return "# CONTEXTO DO USUÁRIO\n\nNão foi possível carregar os dados do usuário no momento.";
  }
}

/**
 * Traduz status de venda para português
 */
function translateSalesStatus(status: string): string {
  const translations: Record<string, string> = {
    DRAFT: "Rascunho",
    CONFIRMED: "Confirmado",
    PROCESSING: "Em Processamento",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };
  return translations[status] || status;
}
