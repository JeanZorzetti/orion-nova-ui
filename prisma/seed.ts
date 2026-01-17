import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados ERP...");

  // Limpar dados existentes do ERP
  console.log("🗑️  Limpando dados existentes do ERP...");
  await prisma.orderItem.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.financialTransaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  // Limpar apenas o usuário de teste
  await prisma.user.deleteMany({
    where: {
      email: "admin@teste.com"
    }
  });

  // Criar usuário de teste
  console.log("👤 Criando usuário de teste...");
  const hashedPassword = await bcrypt.hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      name: "Admin Teste",
      email: "admin@teste.com",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Usuário criado: ${user.email} (senha: 123456)`);

  // Criar clientes
  console.log("👥 Criando clientes...");
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: "João Silva Comércio LTDA",
        email: "joao@silva.com.br",
        phone: "(11) 98765-4321",
        cpfCnpj: "12.345.678/0001-90",
        type: "PESSOA_JURIDICA",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        notes: "Cliente VIP - Prioridade máxima",
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Maria Santos",
        email: "maria@email.com",
        phone: "(21) 99876-5432",
        cpfCnpj: "123.456.789-00",
        type: "PESSOA_FISICA",
        address: "Av. Paulista, 1000",
        city: "Rio de Janeiro",
        state: "RJ",
        zipCode: "20000-000",
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Tech Solutions Brasil",
        email: "contato@techsolutions.com.br",
        phone: "(31) 3333-4444",
        cpfCnpj: "98.765.432/0001-11",
        type: "PESSOA_JURIDICA",
        address: "Rua da Tecnologia, 500",
        city: "Belo Horizonte",
        state: "MG",
        zipCode: "30000-000",
        notes: "Parceiro comercial",
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Carlos Oliveira",
        email: "carlos@oliveira.com",
        phone: "(48) 98888-7777",
        cpfCnpj: "987.654.321-00",
        type: "PESSOA_FISICA",
        address: "Rua das Palmeiras, 789",
        city: "Florianópolis",
        state: "SC",
        zipCode: "88000-000",
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: "Distribuidora Norte LTDA",
        email: "vendas@norte.com.br",
        phone: "(85) 3200-1000",
        cpfCnpj: "11.222.333/0001-44",
        type: "PESSOA_JURIDICA",
        address: "Av. Central, 2000",
        city: "Fortaleza",
        state: "CE",
        zipCode: "60000-000",
        isActive: true,
        userId: user.id,
      },
    }),
  ]);
  console.log(`✅ ${customers.length} clientes criados`);

  // Criar produtos
  console.log("📦 Criando produtos...");
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Notebook Dell Inspiron 15",
        sku: "NB-DELL-001",
        description: "Notebook Dell Inspiron 15, Intel Core i7, 16GB RAM, 512GB SSD",
        category: "Informática",
        type: "PRODUCT",
        unit: "UN",
        price: 3500.00,
        cost: 2800.00,
        stockQuantity: 25,
        minStock: 5,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mouse Logitech MX Master 3",
        sku: "MS-LOG-001",
        description: "Mouse sem fio Logitech MX Master 3, sensor de alta precisão",
        category: "Periféricos",
        type: "PRODUCT",
        unit: "UN",
        price: 450.00,
        cost: 320.00,
        stockQuantity: 50,
        minStock: 10,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Teclado Mecânico RGB",
        sku: "KB-RGB-001",
        description: "Teclado mecânico gamer com iluminação RGB, switches blue",
        category: "Periféricos",
        type: "PRODUCT",
        unit: "UN",
        price: 650.00,
        cost: 480.00,
        stockQuantity: 30,
        minStock: 8,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Monitor LG UltraWide 29\"",
        sku: "MON-LG-001",
        description: "Monitor LG UltraWide 29 polegadas, Full HD, IPS",
        category: "Monitores",
        type: "PRODUCT",
        unit: "UN",
        price: 1200.00,
        cost: 950.00,
        stockQuantity: 15,
        minStock: 3,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Webcam Logitech C920",
        sku: "WC-LOG-001",
        description: "Webcam Full HD 1080p com microfone integrado",
        category: "Periféricos",
        type: "PRODUCT",
        unit: "UN",
        price: 380.00,
        cost: 280.00,
        stockQuantity: 40,
        minStock: 10,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Headset Gamer HyperX Cloud II",
        sku: "HS-HYP-001",
        description: "Headset gamer com som surround 7.1, microfone removível",
        category: "Áudio",
        type: "PRODUCT",
        unit: "UN",
        price: 550.00,
        cost: 420.00,
        stockQuantity: 20,
        minStock: 5,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "SSD Samsung 1TB NVMe",
        sku: "SSD-SAM-001",
        description: "SSD Samsung 1TB, interface NVMe M.2, 3500MB/s leitura",
        category: "Armazenamento",
        type: "PRODUCT",
        unit: "UN",
        price: 580.00,
        cost: 450.00,
        stockQuantity: 35,
        minStock: 10,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Memória RAM 16GB DDR4",
        sku: "RAM-16GB-001",
        description: "Memória RAM 16GB DDR4 3200MHz",
        category: "Componentes",
        type: "PRODUCT",
        unit: "UN",
        price: 320.00,
        cost: 240.00,
        stockQuantity: 60,
        minStock: 15,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Suporte Técnico - 1 Hora",
        sku: "SRV-SUP-001",
        description: "Suporte técnico especializado por hora",
        category: "Serviços",
        type: "SERVICE",
        unit: "HR",
        price: 150.00,
        cost: 80.00,
        stockQuantity: 0,
        minStock: 0,
        isActive: true,
        userId: user.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Instalação de Sistema Operacional",
        sku: "SRV-INST-001",
        description: "Instalação completa de sistema operacional e drivers",
        category: "Serviços",
        type: "SERVICE",
        unit: "UN",
        price: 200.00,
        cost: 100.00,
        stockQuantity: 0,
        minStock: 0,
        isActive: true,
        userId: user.id,
      },
    }),
  ]);
  console.log(`✅ ${products.length} produtos criados`);

  // Criar pedidos
  console.log("🛒 Criando pedidos de venda...");

  // Pedido 1 - COMPLETED
  const order1 = await prisma.salesOrder.create({
    data: {
      orderNumber: "PED-2024-001",
      orderDate: new Date("2024-01-15"),
      dueDate: new Date("2024-01-30"),
      status: "COMPLETED",
      paymentStatus: "PAID",
      paidAt: new Date("2024-01-28"),
      subtotal: 7250.00,
      discount: 250.00,
      total: 7000.00,
      notes: "Primeiro pedido do cliente - Desconto especial",
      customerId: customers[0].id,
      userId: user.id,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: 3500.00,
            total: 7000.00,
          },
          {
            productId: products[1].id,
            quantity: 1,
            unitPrice: 450.00,
            total: 450.00,
          },
        ],
      },
    },
  });

  // Pedido 2 - PROCESSING
  const order2 = await prisma.salesOrder.create({
    data: {
      orderNumber: "PED-2024-002",
      orderDate: new Date("2024-01-18"),
      dueDate: new Date("2024-02-05"),
      status: "PROCESSING",
      paymentStatus: "PENDING",
      subtotal: 2130.00,
      discount: 0,
      total: 2130.00,
      notes: "Pedido urgente - Entregar em 3 dias",
      customerId: customers[1].id,
      userId: user.id,
      items: {
        create: [
          {
            productId: products[3].id,
            quantity: 1,
            unitPrice: 1200.00,
            total: 1200.00,
          },
          {
            productId: products[4].id,
            quantity: 1,
            unitPrice: 380.00,
            total: 380.00,
          },
          {
            productId: products[5].id,
            quantity: 1,
            unitPrice: 550.00,
            total: 550.00,
          },
        ],
      },
    },
  });

  // Pedido 3 - CONFIRMED
  const order3 = await prisma.salesOrder.create({
    data: {
      orderNumber: "PED-2024-003",
      orderDate: new Date("2024-01-20"),
      dueDate: new Date("2024-02-10"),
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      subtotal: 5760.00,
      discount: 260.00,
      total: 5500.00,
      notes: "Cliente solicitou nota fiscal eletrônica",
      customerId: customers[2].id,
      userId: user.id,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            unitPrice: 3500.00,
            total: 3500.00,
          },
          {
            productId: products[2].id,
            quantity: 1,
            unitPrice: 650.00,
            total: 650.00,
          },
          {
            productId: products[6].id,
            quantity: 2,
            unitPrice: 580.00,
            total: 1160.00,
          },
          {
            productId: products[8].id,
            quantity: 3,
            unitPrice: 150.00,
            total: 450.00,
          },
        ],
      },
    },
  });

  // Pedido 4 - DRAFT
  const order4 = await prisma.salesOrder.create({
    data: {
      orderNumber: "PED-2024-004",
      orderDate: new Date("2024-01-22"),
      status: "DRAFT",
      paymentStatus: "PENDING",
      subtotal: 1280.00,
      discount: 0,
      total: 1280.00,
      customerId: customers[3].id,
      userId: user.id,
      items: {
        create: [
          {
            productId: products[7].id,
            quantity: 4,
            unitPrice: 320.00,
            total: 1280.00,
          },
        ],
      },
    },
  });

  // Pedido 5 - COMPLETED com pagamento
  const order5 = await prisma.salesOrder.create({
    data: {
      orderNumber: "PED-2024-005",
      orderDate: new Date("2024-01-10"),
      dueDate: new Date("2024-01-25"),
      status: "COMPLETED",
      paymentStatus: "PAID",
      paidAt: new Date("2024-01-24"),
      subtotal: 3100.00,
      discount: 100.00,
      total: 3000.00,
      notes: "Pagamento à vista - Desconto aplicado",
      customerId: customers[4].id,
      userId: user.id,
      items: {
        create: [
          {
            productId: products[1].id,
            quantity: 4,
            unitPrice: 450.00,
            total: 1800.00,
          },
          {
            productId: products[2].id,
            quantity: 2,
            unitPrice: 650.00,
            total: 1300.00,
          },
        ],
      },
    },
  });

  console.log(`✅ 5 pedidos de venda criados`);

  // Criar transações financeiras
  console.log("💰 Criando transações financeiras...");

  const transactions = await Promise.all([
    // Recebíveis
    prisma.financialTransaction.create({
      data: {
        type: "RECEIVABLE",
        category: "Venda de Produtos",
        description: "Recebimento ref. Pedido PED-2024-001",
        amount: 7000.00,
        dueDate: new Date("2024-01-30"),
        paidAt: new Date("2024-01-28"),
        status: "PAID",
        customerId: customers[0].id,
        orderId: order1.id,
        userId: user.id,
      },
    }),
    prisma.financialTransaction.create({
      data: {
        type: "RECEIVABLE",
        category: "Venda de Produtos",
        description: "Recebimento ref. Pedido PED-2024-002",
        amount: 2130.00,
        dueDate: new Date("2024-02-05"),
        status: "PENDING",
        customerId: customers[1].id,
        orderId: order2.id,
        userId: user.id,
      },
    }),
    prisma.financialTransaction.create({
      data: {
        type: "RECEIVABLE",
        category: "Venda de Produtos",
        description: "Recebimento ref. Pedido PED-2024-003",
        amount: 5500.00,
        dueDate: new Date("2024-02-10"),
        status: "PENDING",
        customerId: customers[2].id,
        orderId: order3.id,
        userId: user.id,
      },
    }),
    prisma.financialTransaction.create({
      data: {
        type: "RECEIVABLE",
        category: "Venda de Produtos",
        description: "Recebimento ref. Pedido PED-2024-005",
        amount: 3000.00,
        dueDate: new Date("2024-01-25"),
        paidAt: new Date("2024-01-24"),
        status: "PAID",
        customerId: customers[4].id,
        orderId: order5.id,
        userId: user.id,
      },
    }),

    // Pagáveis
    prisma.financialTransaction.create({
      data: {
        type: "PAYABLE",
        category: "Fornecedores",
        description: "Pagamento fornecedor - Reposição estoque notebooks",
        amount: 28000.00,
        dueDate: new Date("2024-02-15"),
        status: "PENDING",
        userId: user.id,
      },
    }),
    prisma.financialTransaction.create({
      data: {
        type: "PAYABLE",
        category: "Aluguel",
        description: "Aluguel do escritório - Janeiro/2024",
        amount: 3500.00,
        dueDate: new Date("2024-01-10"),
        paidAt: new Date("2024-01-08"),
        status: "PAID",
        userId: user.id,
      },
    }),
    prisma.financialTransaction.create({
      data: {
        type: "PAYABLE",
        category: "Salários",
        description: "Folha de pagamento - Janeiro/2024",
        amount: 15000.00,
        dueDate: new Date("2024-02-05"),
        status: "PENDING",
        userId: user.id,
      },
    }),
    prisma.financialTransaction.create({
      data: {
        type: "PAYABLE",
        category: "Fornecedores",
        description: "Fornecedor periféricos - Lote dezembro",
        amount: 5600.00,
        dueDate: new Date("2024-01-20"),
        paidAt: new Date("2024-01-19"),
        status: "PAID",
        userId: user.id,
      },
    }),
    prisma.financialTransaction.create({
      data: {
        type: "PAYABLE",
        category: "Utilidades",
        description: "Conta de energia - Janeiro/2024",
        amount: 850.00,
        dueDate: new Date("2024-02-10"),
        status: "PENDING",
        userId: user.id,
      },
    }),
    prisma.financialTransaction.create({
      data: {
        type: "RECEIVABLE",
        category: "Serviços",
        description: "Consultoria técnica - Cliente Externo",
        amount: 2500.00,
        dueDate: new Date("2024-01-05"),
        status: "OVERDUE",
        userId: user.id,
      },
    }),
  ]);

  console.log(`✅ ${transactions.length} transações financeiras criadas`);

  console.log("\n🎉 Seed do ERP concluído com sucesso!");
  console.log("\n📊 Resumo dos dados criados:");
  console.log(`   👤 1 usuário (admin@teste.com / 123456)`);
  console.log(`   👥 ${customers.length} clientes`);
  console.log(`   📦 ${products.length} produtos`);
  console.log(`   🛒 5 pedidos de venda`);
  console.log(`   💰 ${transactions.length} transações financeiras`);
  console.log("\n✅ Você já pode fazer login e testar o sistema!");
  console.log("\n🔑 Credenciais:");
  console.log("   Email: admin@teste.com");
  console.log("   Senha: 123456");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
