import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // ========== PLANOS ==========
  console.log("📦 Criando planos...");

  const starterPlan = await prisma.plan.upsert({
    where: { slug: "starter" },
    update: {},
    create: {
      name: "Starter",
      slug: "starter",
      description: "Ideal para MEIs e Microempresas que estão começando",
      price: 89.0,
      billingPeriod: "MONTHLY",
      features: {
        users: 2,
        storage: 5,
        modules: [
          "Financeiro básico",
          "Cadastro de clientes (até 500)",
          "Cadastro de produtos (até 200)",
          "Relatórios básicos",
          "IA: Insights básicos",
        ],
        support: "Email (24-48h)",
        integrations: 0,
        aiFeatures: "Insights básicos, alertas de vencimento",
      },
      maxUsers: 2,
      maxStorage: 5,
      isActive: true,
    },
  });

  const professionalPlan = await prisma.plan.upsert({
    where: { slug: "professional" },
    update: {},
    create: {
      name: "Professional",
      slug: "professional",
      description: "Para Pequenas Empresas em crescimento (R$ 360k - R$ 4,8M/ano)",
      price: 249.0,
      billingPeriod: "MONTHLY",
      features: {
        users: 10,
        storage: 50,
        modules: [
          "Estoque completo (ilimitado)",
          "Vendas e PDV integrado",
          "CRM com funil de vendas",
          "Dashboards interativos",
          "BI com 20+ relatórios",
          "Conciliação bancária automática",
          "Comissões de vendedores",
        ],
        support: "Chat + Email prioritário (4-8h)",
        integrations: 5,
        customReports: true,
        aiFeatures: "IA preditiva: previsões de vendas, alertas proativos",
      },
      maxUsers: 10,
      maxStorage: 50,
      isActive: true,
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { slug: "enterprise" },
    update: {},
    create: {
      name: "Enterprise",
      slug: "enterprise",
      description: "Solução completa para Médias Empresas (R$ 4,8M+ ano, múltiplas filiais)",
      price: 599.0,
      billingPeriod: "MONTHLY",
      features: {
        users: -1, // Ilimitado
        storage: -1, // Ilimitado
        modules: [
          "Multi-empresa/Multi-filial (até 5 CNPJs)",
          "Produção e MRP básico",
          "CRM avançado (automações, workflows)",
          "RH e ponto eletrônico",
          "Projetos e orçamentos",
          "Assistente IA completo",
          "API aberta (webhooks, integração custom)",
          "White-label (marca customizada)",
        ],
        support: "24/7 (telefone, WhatsApp, gerente dedicado)",
        integrations: -1, // Ilimitado
        customReports: true,
        apiAccess: true,
        whiteLabel: true,
        multiCompany: 5,
        dedicatedManager: true,
        sla: "99.9%",
        aiFeatures: "IA completa: chat GPT-4.5, análises personalizadas",
      },
      maxUsers: null,
      maxStorage: null,
      isActive: true,
    },
  });

  console.log("✅ Planos criados:", {
    starter: starterPlan.id,
    professional: professionalPlan.id,
    enterprise: enterprisePlan.id,
  });

  // ========== CATEGORIAS DE BLOG ==========
  console.log("📚 Criando categorias de blog...");

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "tecnologia" },
      update: {},
      create: {
        name: "Tecnologia",
        slug: "tecnologia",
        description: "Novidades e tendências em tecnologia empresarial",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gestao" },
      update: {},
      create: {
        name: "Gestão",
        slug: "gestao",
        description: "Dicas e estratégias de gestão empresarial",
      },
    }),
    prisma.category.upsert({
      where: { slug: "vendas" },
      update: {},
      create: {
        name: "Vendas",
        slug: "vendas",
        description: "Técnicas e ferramentas para aumentar suas vendas",
      },
    }),
    prisma.category.upsert({
      where: { slug: "financeiro" },
      update: {},
      create: {
        name: "Financeiro",
        slug: "financeiro",
        description: "Controle financeiro e fluxo de caixa",
      },
    }),
    prisma.category.upsert({
      where: { slug: "produtos" },
      update: {},
      create: {
        name: "Produtos",
        slug: "produtos",
        description: "Novidades e atualizações do produto",
      },
    }),
  ]);

  console.log(`✅ ${categories.length} categorias criadas`);

  // ========== TAGS ==========
  console.log("🏷️ Criando tags...");

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "ia" },
      update: {},
      create: { name: "IA", slug: "ia" },
    }),
    prisma.tag.upsert({
      where: { slug: "automacao" },
      update: {},
      create: { name: "Automação", slug: "automacao" },
    }),
    prisma.tag.upsert({
      where: { slug: "crm" },
      update: {},
      create: { name: "CRM", slug: "crm" },
    }),
    prisma.tag.upsert({
      where: { slug: "erp" },
      update: {},
      create: { name: "ERP", slug: "erp" },
    }),
    prisma.tag.upsert({
      where: { slug: "produtividade" },
      update: {},
      create: { name: "Produtividade", slug: "produtividade" },
    }),
    prisma.tag.upsert({
      where: { slug: "dicas" },
      update: {},
      create: { name: "Dicas", slug: "dicas" },
    }),
  ]);

  console.log(`✅ ${tags.length} tags criadas`);

  // ========== USUÁRIOS ADMIN ==========
  console.log("👤 Criando usuários administradores...");

  // Senha de SUPER_ADMIN não mora no repositório. Sem env, gera uma aleatória e
  // imprime — assim o seed nunca recria "admin123" em produção.
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD || randomBytes(12).toString("base64url");
  const ownerPassword =
    process.env.SEED_OWNER_PASSWORD || randomBytes(12).toString("base64url");

  const hashedPassword1 = await bcrypt.hash(adminPassword, 10);
  const hashedPassword2 = await bcrypt.hash(ownerPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@orion.com" },
    update: {},
    create: {
      name: "Administrador Orion",
      email: "admin@orion.com",
      password: hashedPassword1,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
      subscriptionStatus: "ACTIVE",
      trialEndsAt: null,
    },
  });

  const superAdminUser = await prisma.user.upsert({
    where: { email: "jeanzorzetti@gmail.com" },
    update: {},
    create: {
      name: "Jean Zorzetti",
      email: "jeanzorzetti@gmail.com",
      password: hashedPassword2,
      role: "SUPER_ADMIN",
      emailVerified: new Date(),
      subscriptionStatus: "ACTIVE",
      trialEndsAt: null,
    },
  });

  console.log("✅ Usuários admin criados:");
  console.log("  -", adminUser.email);
  console.log("  -", superAdminUser.email);
  if (!process.env.SEED_ADMIN_PASSWORD)
    console.log("  ⚠️ senha gerada para", adminUser.email, "->", adminPassword);
  if (!process.env.SEED_OWNER_PASSWORD)
    console.log("  ⚠️ senha gerada para", superAdminUser.email, "->", ownerPassword);

  // ========== POSTS DE EXEMPLO ==========
  console.log("✍️ Criando posts de exemplo...");

  const post1 = await prisma.post.upsert({
    where: { slug: "ia-na-gestao-empresarial" },
    update: {},
    create: {
      title: "Como a IA está Revolucionando a Gestão Empresarial",
      slug: "ia-na-gestao-empresarial",
      excerpt:
        "Descubra como a inteligência artificial está transformando a forma de gerir negócios e tome decisões mais inteligentes.",
      content: `# Como a IA está Revolucionando a Gestão Empresarial

A inteligência artificial (IA) não é mais ficção científica. Hoje, ela está presente em diversos aspectos da gestão empresarial, desde a análise de dados até a automação de processos.

## Principais Aplicações

### 1. Análise Preditiva
A IA pode analisar grandes volumes de dados históricos e identificar padrões que humanos não conseguiriam detectar facilmente.

### 2. Automação de Processos
Tarefas repetitivas podem ser automatizadas, liberando sua equipe para focar em atividades estratégicas.

### 3. Atendimento ao Cliente
Chatbots inteligentes podem atender clientes 24/7, resolvendo dúvidas comuns instantaneamente.

## Benefícios Comprovados

- **Redução de custos** em até 40%
- **Aumento de produtividade** em até 60%
- **Melhoria na satisfação do cliente** em até 50%

## Conclusão

A IA não veio para substituir humanos, mas para potencializar suas capacidades. Empresas que adotam IA hoje estarão à frente da concorrência amanhã.`,
      authorId: adminUser.id,
      categoryId: categories[0].id, // Tecnologia
      status: "PUBLISHED",
      publishedAt: new Date(),
      views: 1247,
      metaTitle: "IA na Gestão Empresarial: O Futuro é Agora | Orion ERP",
      metaDescription:
        "Descubra como a inteligência artificial está transformando a gestão empresarial. Análise preditiva, automação e muito mais.",
      metaKeywords: "ia, inteligência artificial, gestão empresarial, automação",
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: "10-dicas-fluxo-de-caixa" },
    update: {},
    create: {
      title: "10 Dicas Práticas para Controlar o Fluxo de Caixa",
      slug: "10-dicas-fluxo-de-caixa",
      excerpt:
        "Controlar o fluxo de caixa é fundamental para a saúde financeira da sua empresa. Confira 10 dicas práticas.",
      content: `# 10 Dicas Práticas para Controlar o Fluxo de Caixa

O fluxo de caixa é o coração financeiro de qualquer empresa. Veja como mantê-lo saudável:

## 1. Registre Todas as Movimentações
Não deixe nenhuma entrada ou saída sem registro.

## 2. Separe Finanças Pessoais e Empresariais
Esta é uma regra de ouro que muitos empreendedores quebram.

## 3. Negocie Prazos com Fornecedores
Busque prazos que facilitem seu fluxo de caixa.

## 4. Ofereça Descontos para Pagamento à Vista
Isso melhora sua liquidez imediata.

## 5. Tenha uma Reserva de Emergência
Recomenda-se ter pelo menos 3 meses de despesas fixas reservadas.

## 6. Use Tecnologia a Seu Favor
Sistemas ERP automatizam o controle financeiro e reduzem erros.

## 7. Faça Projeções Mensais
Antecipe-se aos problemas antes que eles aconteçam.

## 8. Analise Seus Indicadores
DRE, margem de lucro, ponto de equilíbrio - conheça seus números.

## 9. Cobre Inadimplentes
Não tenha medo de cobrar o que é seu.

## 10. Revise Suas Despesas Regularmente
Corte gastos desnecessários sem piedade.

## Conclusão
Com disciplina e as ferramentas certas, você terá total controle sobre suas finanças.`,
      authorId: adminUser.id,
      categoryId: categories[3].id, // Financeiro
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
      views: 892,
      metaTitle: "10 Dicas para Controlar o Fluxo de Caixa | Orion ERP",
      metaDescription:
        "Aprenda 10 dicas práticas para ter total controle sobre o fluxo de caixa da sua empresa. Gestão financeira eficiente.",
      metaKeywords: "fluxo de caixa, gestão financeira, controle financeiro",
    },
  });

  const post3 = await prisma.post.upsert({
    where: { slug: "crm-aumentar-vendas" },
    update: {},
    create: {
      title: "Como um CRM Pode Aumentar suas Vendas em 40%",
      slug: "crm-aumentar-vendas",
      excerpt:
        "Empresas que usam CRM vendem 40% mais. Descubra por que e como implementar na sua empresa.",
      content: `# Como um CRM Pode Aumentar suas Vendas em 40%

Estudos comprovam: empresas que usam CRM adequadamente aumentam suas vendas em até 40%. Vamos entender por quê.

## O que é um CRM?

CRM (Customer Relationship Management) é um sistema que centraliza todas as informações dos seus clientes em um só lugar.

## Por que CRM aumenta vendas?

### 1. Não Perde Oportunidades
Todo lead é registrado e acompanhado até o fechamento.

### 2. Histórico Completo
Você sabe exatamente o que já foi conversado com cada cliente.

### 3. Follow-up Automático
O sistema lembra você de fazer follow-up nos momentos certos.

### 4. Análise de Funil
Identifique gargalos no seu processo de vendas.

### 5. Segmentação Precisa
Envie mensagens personalizadas para cada perfil de cliente.

## Casos de Sucesso

**Empresa A**: Aumentou conversão de 15% para 27% em 6 meses
**Empresa B**: Reduziu ciclo de vendas de 45 para 30 dias
**Empresa C**: Aumentou ticket médio em 35%

## Como Começar?

1. Escolha um CRM adequado ao seu negócio
2. Importe seus contatos existentes
3. Treine sua equipe
4. Defina processos claros
5. Acompanhe métricas semanalmente

## Conclusão

Um CRM não é apenas um software, é uma mudança de mindset. Coloque o cliente no centro da sua estratégia.`,
      authorId: adminUser.id,
      categoryId: categories[2].id, // Vendas
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 dias atrás
      views: 1534,
      metaTitle: "CRM: Como Aumentar Vendas em 40% | Orion ERP",
      metaDescription:
        "Descubra como um CRM pode revolucionar suas vendas. Cases reais, benefícios comprovados e guia prático de implementação.",
      metaKeywords: "crm, vendas, gestão de clientes, aumento de vendas",
    },
  });

  // Associar tags aos posts
  await prisma.tagOnPost.createMany({
    data: [
      { postId: post1.id, tagId: tags[0].id }, // IA
      { postId: post1.id, tagId: tags[1].id }, // Automação
      { postId: post2.id, tagId: tags[5].id }, // Dicas
      { postId: post2.id, tagId: tags[4].id }, // Produtividade
      { postId: post3.id, tagId: tags[2].id }, // CRM
      { postId: post3.id, tagId: tags[5].id }, // Dicas
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${3} posts criados com tags associadas`);

  // ========== CUPOM DE EXEMPLO ==========
  console.log("🎟️ Criando cupom de desconto...");

  const coupon = await prisma.coupon.upsert({
    where: { code: "BEMVINDO2026" },
    update: {},
    create: {
      code: "BEMVINDO2026",
      description: "Cupom de boas-vindas - 20% de desconto no primeiro mês",
      discountType: "PERCENTAGE",
      discountValue: 20,
      maxUses: 100,
      usedCount: 0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
      isActive: true,
    },
  });

  console.log("✅ Cupom criado:", coupon.code);

  console.log("\n✨ Seed concluído com sucesso!");
  console.log("\n📊 Resumo:");
  console.log("  - 3 Planos");
  console.log("  - 5 Categorias");
  console.log("  - 6 Tags");
  console.log("  - 2 Usuários Admin:");
  console.log("    • admin@orion.com / admin123");
  console.log("    • jeanzorzetti@gmail.com / PAzo18**");
  console.log("  - 3 Posts de Blog");
  console.log("  - 1 Cupom de Desconto (BEMVINDO2026)");
  console.log("\n⚠️  IMPORTANTE: Altere as senhas após o primeiro login!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
