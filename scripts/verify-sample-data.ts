/**
 * Script para verificar dados de exemplo no banco
 * Execução: npx dotenv -e .env.local -- npx tsx scripts/verify-sample-data.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifySampleData() {
  console.log("🔍 Verificando dados de exemplo no banco...\n");

  try {
    // 1. Buscar todos os clientes de exemplo
    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          { name: { contains: "[EXEMPLO]" } },
          { email: { contains: "@exemplo.com" } },
        ],
      },
      select: {
        id: true,
        userId: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    console.log(`📋 CLIENTES DE EXEMPLO (${customers.length}):`);
    if (customers.length > 0) {
      const byUser: Record<string, typeof customers> = {};
      customers.forEach((c) => {
        if (!byUser[c.userId]) byUser[c.userId] = [];
        byUser[c.userId].push(c);
      });

      Object.entries(byUser).forEach(([userId, userCustomers]) => {
        console.log(`\n   👤 Usuário: ${userId}`);
        userCustomers.forEach((c) => {
          console.log(`      - ${c.name} (${c.email})`);
        });
      });
    } else {
      console.log("   Nenhum cliente de exemplo encontrado");
    }

    // 2. Buscar todos os produtos de exemplo
    const products = await prisma.product.findMany({
      where: { name: { contains: "[EXEMPLO]" } },
      select: {
        id: true,
        userId: true,
        name: true,
        sku: true,
      },
    });

    console.log(`\n📦 PRODUTOS DE EXEMPLO (${products.length}):`);
    if (products.length > 0) {
      const byUser: Record<string, typeof products> = {};
      products.forEach((p) => {
        if (!byUser[p.userId]) byUser[p.userId] = [];
        byUser[p.userId].push(p);
      });

      Object.entries(byUser).forEach(([userId, userProducts]) => {
        console.log(`\n   👤 Usuário: ${userId}`);
        userProducts.forEach((p) => {
          console.log(`      - ${p.name} (SKU: ${p.sku})`);
        });
      });
    } else {
      console.log("   Nenhum produto de exemplo encontrado");
    }

    // 3. Buscar pedidos de exemplo
    const orders = await prisma.salesOrder.findMany({
      where: {
        customer: { name: { contains: "[EXEMPLO]" } },
      },
      select: {
        id: true,
        userId: true,
        orderNumber: true,
        total: true,
        status: true,
      },
    });

    console.log(`\n🛒 PEDIDOS DE EXEMPLO (${orders.length}):`);
    if (orders.length > 0) {
      const byUser: Record<string, typeof orders> = {};
      orders.forEach((o) => {
        if (!byUser[o.userId]) byUser[o.userId] = [];
        byUser[o.userId].push(o);
      });

      Object.entries(byUser).forEach(([userId, userOrders]) => {
        console.log(`\n   👤 Usuário: ${userId}`);
        userOrders.forEach((o) => {
          console.log(`      - ${o.orderNumber} | R$ ${o.total} | ${o.status}`);
        });
      });
    } else {
      console.log("   Nenhum pedido de exemplo encontrado");
    }

    // 4. Buscar transações de exemplo
    const transactions = await prisma.financialTransaction.findMany({
      where: { description: { contains: "[EXEMPLO]" } },
      select: {
        id: true,
        userId: true,
        description: true,
        amount: true,
        type: true,
        status: true,
      },
    });

    console.log(`\n💰 TRANSAÇÕES DE EXEMPLO (${transactions.length}):`);
    if (transactions.length > 0) {
      const byUser: Record<string, typeof transactions> = {};
      transactions.forEach((t) => {
        if (!byUser[t.userId]) byUser[t.userId] = [];
        byUser[t.userId].push(t);
      });

      Object.entries(byUser).forEach(([userId, userTransactions]) => {
        console.log(`\n   👤 Usuário: ${userId}`);
        userTransactions.forEach((t) => {
          console.log(`      - ${t.description.slice(0, 50)}... | R$ ${t.amount} | ${t.type} | ${t.status}`);
        });
      });
    } else {
      console.log("   Nenhuma transação de exemplo encontrada");
    }

    // Resumo
    const uniqueUsers = new Set([
      ...customers.map((c) => c.userId),
      ...products.map((p) => p.userId),
      ...orders.map((o) => o.userId),
      ...transactions.map((t) => t.userId),
    ]);

    console.log("\n" + "=".repeat(50));
    console.log("📊 RESUMO:");
    console.log(`   Usuários com dados de exemplo: ${uniqueUsers.size}`);
    console.log(`   Total de clientes: ${customers.length}`);
    console.log(`   Total de produtos: ${products.length}`);
    console.log(`   Total de pedidos: ${orders.length}`);
    console.log(`   Total de transações: ${transactions.length}`);

    if (uniqueUsers.size === 1) {
      console.log("\n✅ Todos os dados pertencem a um único usuário!");
    } else if (uniqueUsers.size > 1) {
      console.log("\n⚠️  Dados pertencem a múltiplos usuários:");
      uniqueUsers.forEach((u) => console.log(`   - ${u}`));
    }

  } catch (error) {
    console.error("\n❌ Erro:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifySampleData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
