/**
 * Script para limpar dados de exemplo antigos do banco de dados
 * Execução: npx tsx scripts/cleanup-sample-data.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupOldSampleData() {
  console.log("🧹 Iniciando limpeza de dados de exemplo antigos...\n");

  try {
    // 1. Buscar e deletar transações financeiras de exemplo
    const transactions = await prisma.financialTransaction.findMany({
      where: {
        OR: [
          { description: { contains: "[EXEMPLO]" } },
          { description: { contains: "PV-2026-" } },
        ],
      },
      select: { id: true },
    });

    if (transactions.length > 0) {
      await prisma.financialTransaction.deleteMany({
        where: { id: { in: transactions.map((t) => t.id) } },
      });
      console.log(`✅ ${transactions.length} transações financeiras removidas`);
    } else {
      console.log("ℹ️  Nenhuma transação financeira de exemplo encontrada");
    }

    // 2. Buscar pedidos de exemplo
    const orders = await prisma.salesOrder.findMany({
      where: {
        OR: [
          { orderNumber: { startsWith: "PV-2026-" } },
          { orderNumber: { contains: "-001" } },
          { orderNumber: { contains: "-002" } },
        ],
      },
      select: { id: true },
    });

    // 2.1 Deletar itens de pedido
    if (orders.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: orders.map((o) => o.id) } },
      });
      console.log(`✅ Itens de ${orders.length} pedidos removidos`);

      // 2.2 Deletar pedidos
      await prisma.salesOrder.deleteMany({
        where: { id: { in: orders.map((o) => o.id) } },
      });
      console.log(`✅ ${orders.length} pedidos removidos`);
    } else {
      console.log("ℹ️  Nenhum pedido de exemplo encontrado");
    }

    // 3. Deletar produtos de exemplo
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: "[EXEMPLO]" } },
          { sku: { in: ["NB-DELL-001", "MSE-LOG-001", "SRV-CONS-001", "TEC-KEY-001"] } },
          { sku: { startsWith: "NB-DELL-" } },
          { sku: { startsWith: "MSE-LOG-" } },
          { sku: { startsWith: "SRV-CONS-" } },
          { sku: { startsWith: "TEC-KEY-" } },
        ],
      },
      select: { id: true },
    });

    if (products.length > 0) {
      // 3.1 Primeiro deletar itens de pedido que referenciam esses produtos
      await prisma.orderItem.deleteMany({
        where: { productId: { in: products.map((p) => p.id) } },
      });
      console.log(`✅ Itens de pedido referenciando produtos de exemplo removidos`);

      // 3.2 Agora deletar os produtos
      await prisma.product.deleteMany({
        where: { id: { in: products.map((p) => p.id) } },
      });
      console.log(`✅ ${products.length} produtos removidos`);
    } else {
      console.log("ℹ️  Nenhum produto de exemplo encontrado");
    }

    // 4. Deletar clientes de exemplo
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: "[EXEMPLO]" } },
          { email: { endsWith: "@exemplo.com" } },
          { email: { contains: "techsolutions.exemplo.com" } },
        ],
      },
      select: { id: true, name: true, email: true },
    });

    if (customers.length > 0) {
      console.log("\n📋 Clientes que serão removidos:");
      customers.forEach((c) => {
        console.log(`   - ${c.name} (${c.email})`);
      });

      // 4.1 Deletar transações financeiras relacionadas
      await prisma.financialTransaction.deleteMany({
        where: { customerId: { in: customers.map((c) => c.id) } },
      });
      console.log(`✅ Transações financeiras dos clientes removidas`);

      // 4.2 Buscar e deletar pedidos relacionados
      const customerOrders = await prisma.salesOrder.findMany({
        where: { customerId: { in: customers.map((c) => c.id) } },
        select: { id: true },
      });

      if (customerOrders.length > 0) {
        await prisma.orderItem.deleteMany({
          where: { orderId: { in: customerOrders.map((o) => o.id) } },
        });
        await prisma.salesOrder.deleteMany({
          where: { id: { in: customerOrders.map((o) => o.id) } },
        });
        console.log(`✅ ${customerOrders.length} pedidos dos clientes removidos`);
      }

      // 4.3 Agora deletar os clientes
      await prisma.customer.deleteMany({
        where: { id: { in: customers.map((c) => c.id) } },
      });
      console.log(`✅ ${customers.length} clientes removidos`);
    } else {
      console.log("ℹ️  Nenhum cliente de exemplo encontrado");
    }

    console.log("\n🎉 Limpeza concluída com sucesso!");
    console.log("   Agora você pode adicionar novos dados de exemplo no sistema.");

  } catch (error) {
    console.error("\n❌ Erro durante a limpeza:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar
cleanupOldSampleData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
