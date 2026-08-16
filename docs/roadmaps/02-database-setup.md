# Roadmap: Setup do Database PostgreSQL + Prisma

**Fase:** 3 - Banco de Dados PostgreSQL
**Prioridade:** 🔴 Crítica
**Dependências:** Nenhuma

---

## 🎯 Objetivo

Configurar banco de dados PostgreSQL com Prisma ORM, definir schemas completos e criar seed data para desenvolvimento e testes.

---

## 📦 Pacotes Necessários

```bash
npm install prisma @prisma/client
npm install -D @types/node
```

---

## 🗂️ Estrutura de Arquivos

```
prisma/
├── schema.prisma          # Schema principal do Prisma
├── seed.ts                # Seed data para desenvolvimento
└── migrations/            # Histórico de migrations (auto-gerado)
    └── ...

src/
└── lib/
    └── prisma.ts          # Cliente Prisma singleton
```

---

## 🔧 Implementação Passo a Passo

### PASSO 1: Escolher Provider de PostgreSQL

#### Opção 1: Supabase (Recomendado)
✅ **Prós:**
- Free tier generoso (500MB database)
- Interface visual para gerenciar dados
- Auth integrado (opcional)
- Backups automáticos
- Edge Functions
- Storage para arquivos

**Setup:**
1. Criar conta em [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Copiar `DATABASE_URL` da conexão

#### Opção 2: Neon (Alternativa)
✅ **Prós:**
- Serverless PostgreSQL
- Auto-scaling
- Branching de database (como Git)
- Free tier

**Setup:**
1. Criar conta em [neon.tech](https://neon.tech)
2. Criar projeto
3. Copiar connection string

#### Opção 3: Railway/Render (Deploy simples)
Para deploy completo da aplicação + database.

---

### PASSO 2: Inicializar Prisma

```bash
# Inicializar Prisma
npx prisma init

# Isso cria:
# - prisma/schema.prisma
# - .env (com DATABASE_URL)
```

---

### PASSO 3: Configurar Schema Completo

#### 3.1 Criar `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ===== AUTENTICAÇÃO (NextAuth.js) =====

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Apenas para credenciais locais
  role          UserRole  @default(USER)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relações
  accounts      Account[]
  sessions      Session[]
  subscriptions Subscription[]
  orders        Order[]
  tickets       SupportTicket[]
  posts         Post[]        @relation("PostAuthor")

  @@map("users")
}

enum UserRole {
  USER
  ADMIN
  SUPER_ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ===== PLANOS E ASSINATURAS =====

model Plan {
  id              String   @id @default(cuid())
  name            String   // Starter, Professional, Enterprise
  slug            String   @unique
  description     String?
  price           Decimal  @db.Decimal(10, 2)
  billingPeriod   BillingPeriod @default(MONTHLY)
  features        Json     // Array de features
  maxUsers        Int?
  maxStorage      Int?     // Em GB

  isActive        Boolean  @default(true)
  stripePriceId   String?  @unique

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relações
  subscriptions Subscription[]
  orders        Order[]

  @@map("plans")
}

enum BillingPeriod {
  MONTHLY
  YEARLY
}

model Subscription {
  id                    String            @id @default(cuid())
  userId                String
  planId                String
  status                SubscriptionStatus @default(ACTIVE)

  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean           @default(false)
  canceledAt            DateTime?

  stripeSubscriptionId  String?           @unique
  stripeCustomerId      String?

  createdAt             DateTime          @default(now())
  updatedAt             DateTime          @updatedAt

  // Relações
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan Plan @relation(fields: [planId], references: [id])

  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  UNPAID
  TRIALING
}

model Order {
  id              String       @id @default(cuid())
  userId          String
  planId          String
  amount          Decimal      @db.Decimal(10, 2)
  status          OrderStatus  @default(PENDING)
  paymentMethod   String?

  stripePaymentIntentId String? @unique
  stripeInvoiceId       String? @unique

  paidAt          DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relações
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan Plan @relation(fields: [planId], references: [id])

  @@map("orders")
}

enum OrderStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  REFUNDED
}

// ===== BLOG =====

model Post {
  id          String      @id @default(cuid())
  title       String
  slug        String      @unique
  excerpt     String?
  content     String      @db.Text
  coverImage  String?

  authorId    String
  categoryId  String?

  status      PostStatus  @default(DRAFT)
  publishedAt DateTime?

  views       Int         @default(0)

  // SEO
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  // Relações
  author   User      @relation("PostAuthor", fields: [authorId], references: [id])
  category Category? @relation(fields: [categoryId], references: [id])
  tags     TagOnPost[]

  @@index([slug])
  @@index([status, publishedAt])
  @@map("posts")
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relações
  posts Post[]

  @@map("categories")
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relações
  posts TagOnPost[]

  @@map("tags")
}

model TagOnPost {
  postId String
  tagId  String

  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag  Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@map("tags_on_posts")
}

// ===== SUPORTE =====

model SupportTicket {
  id       String         @id @default(cuid())
  userId   String
  subject  String
  message  String         @db.Text
  status   TicketStatus   @default(OPEN)
  priority TicketPriority @default(MEDIUM)

  assignedTo String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  closedAt  DateTime?

  // Relações
  user    User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  replies TicketReply[]

  @@map("support_tickets")
}

enum TicketStatus {
  OPEN
  IN_PROGRESS
  WAITING_CUSTOMER
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model TicketReply {
  id       String   @id @default(cuid())
  ticketId String
  userId   String   // Pode ser cliente ou agente
  message  String   @db.Text
  isStaff  Boolean  @default(false)

  createdAt DateTime @default(now())

  // Relações
  ticket SupportTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@map("ticket_replies")
}

// ===== CUPONS/DESCONTOS =====

model Coupon {
  id              String      @id @default(cuid())
  code            String      @unique
  description     String?
  discountType    DiscountType
  discountValue   Decimal     @db.Decimal(10, 2)

  maxUses         Int?
  usedCount       Int         @default(0)

  validFrom       DateTime
  validUntil      DateTime?

  isActive        Boolean     @default(true)

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@map("coupons")
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_TRIAL
}
```

---

### PASSO 4: Criar Cliente Prisma Singleton

#### 4.1 Criar `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Por quê singleton?**
- Evita múltiplas conexões no desenvolvimento (hot reload)
- Reutiliza conexão existente
- Previne "too many connections" error

---

### PASSO 5: Criar Seed Data

#### 5.1 Criar `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpar database (cuidado em produção!)
  if (process.env.NODE_ENV === 'development') {
    await prisma.tagOnPost.deleteMany();
    await prisma.ticketReply.deleteMany();
    await prisma.supportTicket.deleteMany();
    await prisma.post.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.order.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.coupon.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
  }

  // 1. Criar usuários
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Orion',
      email: 'admin@orion.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@example.com',
      password: userPassword,
      role: 'USER',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Usuários criados:', { admin: admin.email, user: user.email });

  // 2. Criar planos
  const starterPlan = await prisma.plan.create({
    data: {
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

  const proPlan = await prisma.plan.create({
    data: {
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

  const enterprisePlan = await prisma.plan.create({
    data: {
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
  const techCategory = await prisma.category.create({
    data: {
      name: 'Tecnologia',
      slug: 'tecnologia',
      description: 'Artigos sobre tecnologia e inovação',
    },
  });

  const businessCategory = await prisma.category.create({
    data: {
      name: 'Negócios',
      slug: 'negocios',
      description: 'Dicas e estratégias de negócios',
    },
  });

  console.log('✅ Categorias criadas');

  // 4. Criar tags
  const erpTag = await prisma.tag.create({
    data: { name: 'ERP', slug: 'erp' },
  });

  const productivityTag = await prisma.tag.create({
    data: { name: 'Produtividade', slug: 'produtividade' },
  });

  console.log('✅ Tags criadas');

  // 5. Criar posts do blog
  const post1 = await prisma.post.create({
    data: {
      title: '10 Dicas para Aumentar a Produtividade da sua Empresa',
      slug: '10-dicas-produtividade-empresa',
      excerpt: 'Descubra estratégias comprovadas para otimizar processos e aumentar resultados.',
      content: `# 10 Dicas para Aumentar a Produtividade

Lorem ipsum dolor sit amet, consectetur adipiscing elit...`,
      coverImage: '/blog/produtividade.jpg',
      authorId: admin.id,
      categoryId: businessCategory.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      metaTitle: '10 Dicas de Produtividade Empresarial',
      metaDescription: 'Guia completo com estratégias para aumentar a produtividade.',
    },
  });

  await prisma.tagOnPost.create({
    data: {
      postId: post1.id,
      tagId: productivityTag.id,
    },
  });

  console.log('✅ Posts criados');

  // 6. Criar assinatura de exemplo
  await prisma.subscription.create({
    data: {
      userId: user.id,
      planId: proPlan.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
    },
  });

  console.log('✅ Assinatura criada');

  // 7. Criar cupons
  await prisma.coupon.create({
    data: {
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

  console.log('✅ Cupons criados');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### 5.2 Adicionar script ao `package.json`

```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

### PASSO 6: Executar Migrations

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar primeira migration
npx prisma migrate dev --name init

# Popular database com seed data
npm run prisma:seed

# Abrir Prisma Studio (visualizar dados)
npx prisma studio
```

---

## 📊 Queries Úteis

### Exemplos de uso do Prisma Client

```typescript
// ===== USUÁRIOS =====

// Criar usuário
const user = await prisma.user.create({
  data: {
    name: 'João Silva',
    email: 'joao@example.com',
    password: hashedPassword,
  },
});

// Buscar usuário com assinaturas
const userWithSubs = await prisma.user.findUnique({
  where: { email: 'joao@example.com' },
  include: {
    subscriptions: {
      include: { plan: true },
    },
  },
});

// ===== PLANOS =====

// Listar planos ativos
const activePlans = await prisma.plan.findMany({
  where: { isActive: true },
  orderBy: { price: 'asc' },
});

// ===== ASSINATURAS =====

// Criar assinatura
const subscription = await prisma.subscription.create({
  data: {
    userId: user.id,
    planId: plan.id,
    status: 'ACTIVE',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
});

// Buscar assinaturas ativas
const activeSubscriptions = await prisma.subscription.findMany({
  where: {
    status: 'ACTIVE',
    currentPeriodEnd: { gte: new Date() },
  },
  include: {
    user: true,
    plan: true,
  },
});

// ===== BLOG =====

// Criar post
const post = await prisma.post.create({
  data: {
    title: 'Meu Artigo',
    slug: 'meu-artigo',
    content: 'Conteúdo do artigo...',
    authorId: user.id,
    categoryId: category.id,
    status: 'PUBLISHED',
    publishedAt: new Date(),
  },
});

// Listar posts publicados
const publishedPosts = await prisma.post.findMany({
  where: {
    status: 'PUBLISHED',
    publishedAt: { lte: new Date() },
  },
  include: {
    author: { select: { name: true, image: true } },
    category: true,
    tags: { include: { tag: true } },
  },
  orderBy: { publishedAt: 'desc' },
  take: 10,
});
```

---

## ✅ Checklist de Implementação

### Setup Inicial
- [ ] Escolher provider PostgreSQL (Supabase/Neon)
- [ ] Criar database
- [ ] Adicionar DATABASE_URL ao .env
- [ ] Instalar dependências

### Schema e Migrations
- [ ] Criar schema.prisma completo
- [ ] Executar primeira migration
- [ ] Validar schema no Prisma Studio
- [ ] Criar seed.ts
- [ ] Popular database com seed data

### Cliente Prisma
- [ ] Criar singleton em lib/prisma.ts
- [ ] Testar conexão
- [ ] Criar queries de exemplo

### Testes
- [ ] Testar CRUD de usuários
- [ ] Testar relações entre tabelas
- [ ] Validar constraints e índices
- [ ] Testar performance de queries

### Backups
- [ ] Configurar backups automáticos
- [ ] Testar restore de backup

---

## 🔒 Segurança

1. **Connection Pooling**: Prisma gerencia automaticamente
2. **SQL Injection**: Prisma previne automaticamente
3. **Secrets**: Nunca commitar .env com DATABASE_URL
4. **Backups**: Configurar backups diários em produção
5. **Índices**: Adicionar índices para queries frequentes

---

## 📚 Recursos

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Supabase Docs](https://supabase.com/docs)
- [Neon Docs](https://neon.tech/docs)

---

**Status:** 📝 Pronto para implementação
**Última atualização:** 16/01/2026
