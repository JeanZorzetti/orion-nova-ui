import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Criar usuários
  console.log('👤 Criando usuários...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@orion.com' },
    update: {},
    create: {
      name: 'Admin Orion',
      email: 'admin@orion.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'joao@example.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'joao@example.com',
      password: userPassword,
      role: 'USER',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Usuários criados:', { admin: admin.email, user: user.email });

  // 2. Criar planos
  console.log('💼 Criando planos...');

  const starterPlan = await prisma.plan.upsert({
    where: { slug: 'starter' },
    update: {},
    create: {
      name: 'Starter',
      slug: 'starter',
      description: 'Perfeito para começar',
      price: 99.90,
      billingPeriod: 'MONTHLY',
      features: JSON.stringify([
        'Até 5 usuários',
        '10GB de armazenamento',
        'Suporte por email',
        'Dashboard básico',
      ]),
      maxUsers: 5,
      maxStorage: 10,
      isActive: true,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { slug: 'professional' },
    update: {},
    create: {
      name: 'Professional',
      slug: 'professional',
      description: 'Para empresas em crescimento',
      price: 299.90,
      billingPeriod: 'MONTHLY',
      features: JSON.stringify([
        'Até 25 usuários',
        '100GB de armazenamento',
        'Suporte prioritário',
        'Relatórios avançados',
        'API access',
        'Integrações premium',
      ]),
      maxUsers: 25,
      maxStorage: 100,
      isActive: true,
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { slug: 'enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Solução completa para grandes empresas',
      price: 999.90,
      billingPeriod: 'MONTHLY',
      features: JSON.stringify([
        'Usuários ilimitados',
        '1TB de armazenamento',
        'Suporte 24/7',
        'Gerente de conta dedicado',
        'SLA 99.9%',
        'Customizações',
        'Treinamento incluso',
      ]),
      maxUsers: null,
      maxStorage: 1000,
      isActive: true,
    },
  });

  console.log('✅ Planos criados:', [starterPlan.name, proPlan.name, enterprisePlan.name]);

  // 3. Criar categorias do blog
  console.log('📚 Criando categorias...');

  const techCategory = await prisma.category.upsert({
    where: { slug: 'tecnologia' },
    update: {},
    create: {
      name: 'Tecnologia',
      slug: 'tecnologia',
      description: 'Artigos sobre tecnologia e inovação',
    },
  });

  const businessCategory = await prisma.category.upsert({
    where: { slug: 'negocios' },
    update: {},
    create: {
      name: 'Negócios',
      slug: 'negocios',
      description: 'Dicas e estratégias de negócios',
    },
  });

  console.log('✅ Categorias criadas');

  // 4. Criar tags
  console.log('🏷️ Criando tags...');

  const erpTag = await prisma.tag.upsert({
    where: { slug: 'erp' },
    update: {},
    create: { name: 'ERP', slug: 'erp' },
  });

  const productivityTag = await prisma.tag.upsert({
    where: { slug: 'produtividade' },
    update: {},
    create: { name: 'Produtividade', slug: 'produtividade' },
  });

  const automationTag = await prisma.tag.upsert({
    where: { slug: 'automacao' },
    update: {},
    create: { name: 'Automação', slug: 'automacao' },
  });

  console.log('✅ Tags criadas');

  // 5. Criar posts do blog
  console.log('📝 Criando posts...');

  const post1 = await prisma.post.upsert({
    where: { slug: '10-dicas-produtividade-empresa' },
    update: {},
    create: {
      title: '10 Dicas para Aumentar a Produtividade da sua Empresa',
      slug: '10-dicas-produtividade-empresa',
      excerpt: 'Descubra estratégias comprovadas para otimizar processos e aumentar resultados.',
      content: `# 10 Dicas para Aumentar a Produtividade

A produtividade é fundamental para o sucesso de qualquer empresa. Neste artigo, compartilhamos 10 dicas práticas que podem transformar a eficiência da sua equipe.

## 1. Automatize Tarefas Repetitivas

Utilize ferramentas de automação para eliminar tarefas manuais e repetitivas.

## 2. Estabeleça Metas Claras

Defina objetivos mensuráveis e compartilhe com toda a equipe.

## 3. Use um Sistema ERP Integrado

Centralize todas as operações em uma única plataforma.

[Continua...]`,
      coverImage: '/blog/produtividade.jpg',
      authorId: admin.id,
      categoryId: businessCategory.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      metaTitle: '10 Dicas de Produtividade Empresarial - Orion ERP',
      metaDescription: 'Guia completo com estratégias comprovadas para aumentar a produtividade da sua empresa.',
    },
  });

  await prisma.tagOnPost.upsert({
    where: {
      postId_tagId: {
        postId: post1.id,
        tagId: productivityTag.id,
      },
    },
    update: {},
    create: {
      postId: post1.id,
      tagId: productivityTag.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { slug: 'transformacao-digital-guia-completo' },
    update: {},
    create: {
      title: 'Transformação Digital: Guia Completo para Empresas',
      slug: 'transformacao-digital-guia-completo',
      excerpt: 'Entenda como digitalizar processos e se manter competitivo no mercado.',
      content: `# Transformação Digital: O Futuro é Agora

A transformação digital não é mais uma opção, é uma necessidade. Descubra como sua empresa pode se adaptar e prosperar na era digital.

## O que é Transformação Digital?

É o processo de integração de tecnologia digital em todas as áreas de um negócio...

[Continua...]`,
      coverImage: '/blog/transformacao-digital.jpg',
      authorId: admin.id,
      categoryId: techCategory.id,
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
      metaTitle: 'Transformação Digital - Guia Completo',
      metaDescription: 'Tudo o que você precisa saber sobre transformação digital para empresas.',
    },
  });

  await prisma.tagOnPost.createMany({
    data: [
      { postId: post2.id, tagId: erpTag.id },
      { postId: post2.id, tagId: automationTag.id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Posts criados');

  // 6. Criar assinatura de exemplo para o usuário
  console.log('💳 Criando assinatura...');

  const subscription = await prisma.subscription.upsert({
    where: {
      id: 'seed-subscription-1',
    },
    update: {},
    create: {
      id: 'seed-subscription-1',
      userId: user.id,
      planId: proPlan.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
    },
  });

  console.log('✅ Assinatura criada');

  // 7. Criar cupons
  console.log('🎫 Criando cupons...');

  await prisma.coupon.upsert({
    where: { code: 'WELCOME20' },
    update: {},
    create: {
      code: 'WELCOME20',
      description: '20% de desconto para novos clientes',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxUses: 100,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // +90 dias
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'PRIMEIRACOMPRA50' },
    update: {},
    create: {
      code: 'PRIMEIRACOMPRA50',
      description: 'R$ 50 de desconto na primeira compra',
      discountType: 'FIXED_AMOUNT',
      discountValue: 50,
      maxUses: 50,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // +60 dias
      isActive: true,
    },
  });

  console.log('✅ Cupons criados');

  console.log('🎉 Seed concluído com sucesso!');
  console.log('');
  console.log('📋 Credenciais de teste:');
  console.log('  Admin: admin@orion.com / admin123');
  console.log('  User:  joao@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
