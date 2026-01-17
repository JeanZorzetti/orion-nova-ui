# 🚀 Roadmap MVP - Módulos do ERP Orion

Plano de implementação dos módulos funcionais do ERP em 14 dias.

---

## 📊 Visão Geral

**Objetivo:** Transformar o dashboard vazio em um ERP funcional com módulos essenciais.

**Prazo:** 14 dias (2 semanas)

**Stack Atual:**
- ✅ Next.js 16 + React 18
- ✅ Prisma 5 + PostgreSQL
- ✅ NextAuth.js (autenticação)
- ✅ shadcn/ui (componentes)
- ✅ Mercado Pago (pagamentos)

---

## 🎯 Módulos Prioritários (MVP)

### Semana 1: Fundação e Módulos Core

#### ✅ Dia 1-2: Layout e Navegação do Dashboard (CONCLUÍDO)
**Objetivo:** Estrutura base do ERP

**Status:** ✅ COMPLETO

**Tarefas:**
- [x] Criar layout com sidebar navegável
- [x] Criar header com perfil do usuário
- [x] Implementar navegação entre módulos
- [x] Criar página inicial (overview/dashboard)
- [ ] Adicionar breadcrumbs
- [ ] Implementar tema claro/escuro

**Arquivos:**
```
src/app/dashboard/
├── layout.tsx              # Layout principal com sidebar
├── page.tsx                # Dashboard home (overview)
├── components/
│   ├── sidebar.tsx         # Menu lateral
│   ├── header.tsx          # Header do dashboard
│   └── stats-card.tsx      # Card de estatísticas
```

**Validação:** Navegação fluida entre páginas

---

#### ✅ Dia 3-4: Módulo de Clientes (CONCLUÍDO)
**Objetivo:** CRUD completo de clientes

**Status:** ✅ COMPLETO

**Schema Prisma:**
```prisma
model Customer {
  id            String   @id @default(cuid())
  name          String
  email         String?  @unique
  phone         String?
  cpfCnpj       String?  @unique
  type          CustomerType @default(PESSOA_FISICA)

  // Endereço
  address       String?
  city          String?
  state         String?
  zipCode       String?

  // Metadata
  notes         String?  @db.Text
  isActive      Boolean  @default(true)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relações
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  orders        Order[]

  @@map("customers")
}

enum CustomerType {
  PESSOA_FISICA
  PESSOA_JURIDICA
}
```

**Tarefas:**
- [x] Criar schema Customer
- [x] Criar API routes (CRUD)
- [x] Criar página de listagem com tabela
- [x] Criar formulário de cadastro/edição
- [x] Implementar busca e filtros
- [x] Adicionar paginação

**Arquivos:**
```
src/app/dashboard/clientes/
├── page.tsx                # Lista de clientes
├── novo/page.tsx           # Novo cliente
├── [id]/editar/page.tsx    # Editar cliente
src/app/api/customers/
├── route.ts                # GET (list), POST (create)
├── [id]/route.ts           # GET, PUT, DELETE
```

**Validação:** Criar, editar, listar e excluir clientes

---

#### ✅ Dia 5-6: Módulo de Produtos/Serviços (CONCLUÍDO)
**Objetivo:** Catálogo de produtos

**Status:** ✅ COMPLETO

**Schema Prisma:**
```prisma
model Product {
  id            String   @id @default(cuid())
  name          String
  sku           String?  @unique
  description   String?  @db.Text

  type          ProductType @default(PRODUCT)
  category      String?

  // Preços
  price         Decimal  @db.Decimal(10, 2)
  cost          Decimal? @db.Decimal(10, 2)

  // Estoque
  stockQuantity Int      @default(0)
  minStock      Int      @default(0)
  unit          String   @default("UN")

  // Metadata
  isActive      Boolean  @default(true)
  image         String?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relações
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  orderItems    OrderItem[]

  @@map("products")
}

enum ProductType {
  PRODUCT
  SERVICE
}
```

**Tarefas:**
- [x] Criar schema Product
- [x] Criar API routes (CRUD)
- [x] Criar página de listagem com grid/tabela
- [x] Criar formulário de cadastro/edição
- [x] Implementar controle de estoque
- [x] Adicionar alertas de estoque baixo

**Validação:** Gerenciar catálogo de produtos

---

#### ✅ Dia 7: Módulo de Vendas/Pedidos - Parte 1 (CONCLUÍDO)
**Objetivo:** Criar pedidos de venda

**Status:** ✅ COMPLETO

**Schema Prisma:**
```prisma
model SalesOrder {
  id              String        @id @default(cuid())
  orderNumber     String        @unique

  // Cliente
  customerId      String
  customer        Customer      @relation(fields: [customerId], references: [id])

  // Valores
  subtotal        Decimal       @db.Decimal(10, 2)
  discount        Decimal       @default(0) @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)

  // Status
  status          OrderStatus   @default(DRAFT)
  paymentStatus   PaymentStatus @default(PENDING)

  // Datas
  orderDate       DateTime      @default(now())
  dueDate         DateTime?
  paidAt          DateTime?

  // Observações
  notes           String?       @db.Text

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  // Relações
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  items           OrderItem[]

  @@map("sales_orders")
}

model OrderItem {
  id          String      @id @default(cuid())

  orderId     String
  order       SalesOrder  @relation(fields: [orderId], references: [id], onDelete: Cascade)

  productId   String
  product     Product     @relation(fields: [productId], references: [id])

  quantity    Int
  unitPrice   Decimal     @db.Decimal(10, 2)
  total       Decimal     @db.Decimal(10, 2)

  @@map("order_items")
}

enum OrderStatus {
  DRAFT
  CONFIRMED
  PROCESSING
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PARTIAL
  PAID
  OVERDUE
}
```

**Tarefas:**
- [x] Criar schemas SalesOrder e OrderItem
- [x] Criar página de novo pedido
- [x] Implementar seletor de cliente
- [x] Implementar adicionar produtos ao pedido
- [x] Calcular totais automaticamente
- [x] Gerar número de pedido automático

**Validação:** Criar pedido de venda com itens

---

### Semana 2: Funcionalidades Avançadas

#### ✅ Dia 8-9: Módulo de Vendas - Parte 2 (CONCLUÍDO)
**Objetivo:** Gerenciar pedidos existentes

**Status:** ✅ COMPLETO

**Tarefas:**
- [x] Criar listagem de pedidos
- [x] Implementar filtros (status, data, cliente)
- [x] Criar página de visualização de pedido
- [x] Permitir edição de pedidos (DRAFT)
- [x] Implementar mudança de status (API)
- [x] Registrar pagamentos (API)
- [ ] Gerar PDF do pedido

**Validação:** Workflow completo de vendas

---

#### Dia 10: Dashboard Overview
**Objetivo:** Visão geral com KPIs

**Tarefas:**
- [ ] Cards de estatísticas (vendas, clientes, produtos)
- [ ] Gráfico de vendas (últimos 30 dias)
- [ ] Lista de pedidos recentes
- [ ] Lista de produtos com estoque baixo
- [ ] Totalizadores mensais
- [ ] Top 5 clientes

**Componentes:**
```tsx
- RevenueChart (vendas por dia/semana)
- StatsCards (total vendas, pedidos, clientes)
- RecentOrders (últimos 10 pedidos)
- LowStockAlert (produtos com estoque < mínimo)
```

**Validação:** Dashboard com dados reais

---

#### Dia 11-12: Módulo Financeiro Básico
**Objetivo:** Contas a receber

**Schema Prisma:**
```prisma
model FinancialTransaction {
  id              String              @id @default(cuid())

  type            TransactionType
  category        String
  description     String

  amount          Decimal             @db.Decimal(10, 2)

  // Relacionamentos
  customerId      String?
  customer        Customer?           @relation(fields: [customerId], references: [id])

  orderId         String?
  order           SalesOrder?         @relation(fields: [orderId], references: [id])

  // Datas
  dueDate         DateTime
  paidAt          DateTime?

  status          FinancialStatus     @default(PENDING)

  createdAt       DateTime            @default(now())
  updatedAt       DateTime            @updatedAt

  userId          String
  user            User                @relation(fields: [userId], references: [id])

  @@map("financial_transactions")
}

enum TransactionType {
  RECEIVABLE
  PAYABLE
}

enum FinancialStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}
```

**Tarefas:**
- [ ] Criar schema FinancialTransaction
- [ ] Listagem de contas a receber
- [ ] Registrar pagamentos
- [ ] Vincular com pedidos
- [ ] Relatório de recebíveis

**Validação:** Controle financeiro básico

---

#### Dia 13: Relatórios
**Objetivo:** Relatórios essenciais

**Tarefas:**
- [ ] Relatório de vendas por período
- [ ] Relatório de clientes
- [ ] Relatório de produtos mais vendidos
- [ ] Relatório financeiro (receitas)
- [ ] Exportar para Excel/CSV
- [ ] Filtros e agrupamentos

**Validação:** Gerar relatórios úteis

---

#### Dia 14: Ajustes Finais e Testes
**Objetivo:** Polish e validação

**Tarefas:**
- [ ] Ajustar permissões de acesso
- [ ] Validar todos os formulários
- [ ] Testar fluxos completos
- [ ] Otimizar queries
- [ ] Adicionar loading states
- [ ] Mensagens de erro/sucesso
- [ ] Documentação básica

**Validação:** Sistema estável e funcional

---

## 🗂️ Estrutura de Pastas Final

```
src/app/dashboard/
├── layout.tsx
├── page.tsx                    # Overview/Home
├── components/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── stats-card.tsx
│   └── charts/
│       └── revenue-chart.tsx
├── clientes/
│   ├── page.tsx                # Lista
│   ├── novo/page.tsx
│   └── [id]/
│       └── editar/page.tsx
├── produtos/
│   ├── page.tsx
│   ├── novo/page.tsx
│   └── [id]/
│       └── editar/page.tsx
├── vendas/
│   ├── page.tsx                # Lista de pedidos
│   ├── novo/page.tsx           # Novo pedido
│   └── [id]/
│       ├── page.tsx            # Visualizar
│       └── editar/page.tsx
├── financeiro/
│   ├── page.tsx                # Contas a receber
│   └── recebimentos/page.tsx
└── relatorios/
    ├── vendas/page.tsx
    ├── clientes/page.tsx
    └── produtos/page.tsx

src/app/api/
├── customers/
│   ├── route.ts
│   └── [id]/route.ts
├── products/
│   ├── route.ts
│   └── [id]/route.ts
├── orders/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── [id]/status/route.ts
└── financial/
    ├── route.ts
    └── [id]/route.ts
```

---

## 📦 Dependências Adicionais

```bash
# Gráficos
npm install recharts

# Tabelas
npm install @tanstack/react-table

# Exportar dados
npm install xlsx

# Geração de PDF
npm install @react-pdf/renderer

# Máscaras de input
npm install react-input-mask
npm install @hookform/resolvers zod
```

---

## 🎨 Componentes shadcn/ui Necessários

```bash
npx shadcn@latest add data-table
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add date-picker
npx shadcn@latest add combobox
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

---

## ✅ Critérios de Sucesso

Ao final dos 14 dias, o ERP deve ter:

1. ✅ Navegação fluida entre módulos
2. ✅ CRUD completo de clientes
3. ✅ CRUD completo de produtos com controle de estoque
4. ✅ Criação e gerenciamento de pedidos de venda
5. ✅ Dashboard com KPIs e gráficos
6. ✅ Controle básico de contas a receber
7. ✅ Relatórios exportáveis
8. ✅ Interface responsiva
9. ✅ Validações e feedback ao usuário
10. ✅ Permissões por usuário (USER vs ADMIN)

---

## 🚀 Próximos Passos (Pós-MVP)

**Semana 3-4:**
- [ ] Módulo de Compras/Fornecedores
- [ ] Controle de Estoque avançado
- [ ] Contas a pagar
- [ ] Fluxo de caixa
- [ ] Notas fiscais (NFe/NFCe)
- [ ] Integrações (e-commerce, contabilidade)

---

**Pronto para começar?** 🎯

Execute: `git checkout -b feature/erp-modules` e vamos começar!
