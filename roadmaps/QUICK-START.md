# 🚀 Quick Start Guide - Orion Nova UI

Guia rápido para começar a implementação do site institucional **HOJE**.

---

## ⚡ Setup Inicial (30 minutos)

### 1. Preparar Ambiente

```bash
cd "C:\Users\jeanz\OneDrive\Desktop\ROI Labs\orion-nova-ui-main"

# Verificar se está tudo OK
npm run build

# Rodar em desenvolvimento
npm run dev
```

✅ Site deve estar rodando em http://localhost:3000

---

### 2. Criar Conta nos Serviços Necessários

#### 🗄️ Supabase (Database)
1. Acesse [supabase.com](https://supabase.com)
2. Crie conta (pode usar GitHub)
3. Crie novo projeto: "orion-nova-production"
4. Aguarde ~2 minutos para provisionar
5. Vá em **Settings → Database**
6. Copie a **Connection String** (URI format)
7. Cole no arquivo `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@[SEU-HOST].supabase.co:5432/postgres"
```

#### 🔐 NextAuth Secret
```bash
# Gerar secret aleatório
openssl rand -base64 32

# Adicionar ao .env.local
NEXTAUTH_SECRET="cole-aqui-o-resultado"
NEXTAUTH_URL="http://localhost:3000"
```

---

## 📅 Plano de 7 Dias

### 🟢 Dia 1: Database (3-4 horas)
**Objetivo:** Setup completo do PostgreSQL + Prisma

```bash
# Instalar Prisma
npm install prisma @prisma/client
npm install -D tsx

# Inicializar Prisma
npx prisma init

# Copiar schema do roadmap 02
# (arquivo: roadmaps/02-database-setup.md)
# Colar em: prisma/schema.prisma

# Executar migration
npx prisma migrate dev --name init

# Criar seed.ts (copiar do roadmap)
# Executar seed
npm run prisma:seed

# Verificar dados
npx prisma studio
```

✅ **Validação:** Prisma Studio mostra tabelas criadas com dados

---

### 🔵 Dia 2: Autenticação - Parte 1 (3-4 horas)
**Objetivo:** Login básico funcionando

```bash
# Instalar dependências
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install @types/bcryptjs -D
```

**Tarefas:**
1. ✅ Criar `src/lib/auth.ts` (copiar do roadmap 01)
2. ✅ Criar `src/lib/prisma.ts` (copiar do roadmap 02)
3. ✅ Criar `src/app/api/auth/[...nextauth]/route.ts`
4. ✅ Criar `src/app/(auth)/login/page.tsx`
5. ✅ Testar login com usuário do seed (admin@orion.com / admin123)

✅ **Validação:** Consegue fazer login e ver sessão

---

### 🔵 Dia 3: Autenticação - Parte 2 (3-4 horas)
**Objetivo:** Cadastro e proteção de rotas

**Tarefas:**
1. ✅ Criar `src/app/(auth)/cadastro/page.tsx`
2. ✅ Criar `src/app/api/register/route.ts`
3. ✅ Criar `src/middleware.ts` (proteção de rotas)
4. ✅ Criar `src/app/perfil/page.tsx`
5. ✅ Testar fluxo completo: cadastro → login → perfil

✅ **Validação:** Usuário consegue se cadastrar, logar e ver perfil

---

### 🟡 Dia 4: Stripe Setup (2-3 horas)
**Objetivo:** Configurar Stripe e criar produtos

```bash
# Instalar Stripe
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

**Tarefas:**
1. ✅ Criar conta em [stripe.com](https://stripe.com)
2. ✅ Ativar modo teste
3. ✅ Criar 3 produtos no Dashboard:
   - Starter: R$ 99,90/mês
   - Professional: R$ 299,90/mês
   - Enterprise: R$ 999,90/mês
4. ✅ Copiar API Keys para `.env.local`:

```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

5. ✅ Atualizar `prisma/schema.prisma` com `stripePriceId`
6. ✅ Migrar database: `npx prisma migrate dev --name add_stripe_price_id`
7. ✅ Atualizar seed com Price IDs

✅ **Validação:** Planos no database têm stripePriceId

---

### 🟡 Dia 5: Checkout - Parte 1 (3-4 horas)
**Objetivo:** Checkout básico funcionando

**Tarefas:**
1. ✅ Criar `src/lib/stripe.ts` (server)
2. ✅ Criar `src/lib/stripe-client.ts` (client)
3. ✅ Criar `src/components/checkout/PricingCard.tsx`
4. ✅ Atualizar `src/app/precos/page.tsx`
5. ✅ Criar `src/app/api/stripe/checkout/route.ts`
6. ✅ Testar: clicar em "Assinar" → redireciona para Stripe

✅ **Validação:** Checkout do Stripe abre corretamente

---

### 🟡 Dia 6: Checkout - Parte 2 (3-4 horas)
**Objetivo:** Webhooks e confirmação

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Redirecionar webhooks
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

**Tarefas:**
1. ✅ Criar `src/app/api/stripe/webhooks/route.ts`
2. ✅ Criar `src/webhooks/stripe-handlers.ts`
3. ✅ Adicionar `STRIPE_WEBHOOK_SECRET` ao `.env.local`
4. ✅ Criar `src/app/checkout/sucesso/page.tsx`
5. ✅ Testar checkout completo com cartão teste:
   - Número: `4242 4242 4242 4242`
   - Data: qualquer futura
   - CVV: qualquer 3 dígitos

✅ **Validação:** Assinatura criada no database após pagamento

---

### 🟢 Dia 7: Gerenciamento (2-3 horas)
**Objetivo:** Usuário pode ver e gerenciar assinatura

**Tarefas:**
1. ✅ Criar `src/app/assinaturas/page.tsx`
2. ✅ Criar `src/app/api/stripe/portal/route.ts`
3. ✅ Testar: visualizar assinatura → abrir portal → cancelar

✅ **Validação:** Usuário consegue gerenciar assinatura pelo portal

---

## 🎯 MVP Pronto! (Após 7 dias)

Você terá:
- ✅ Database PostgreSQL configurado
- ✅ Sistema de autenticação completo
- ✅ Checkout e pagamentos recorrentes
- ✅ Gerenciamento de assinaturas
- ✅ 3 planos disponíveis

---

## 📋 Próximos Passos (Semana 2)

### Dias 8-10: Páginas Institucionais
- [ ] Página Sobre Nós
- [ ] Página Contato
- [ ] Página de Suporte
- [ ] Termos de Uso
- [ ] Política de Privacidade

### Dias 11-14: Blog
- [ ] Sistema de posts
- [ ] Categorias e tags
- [ ] Editor de conteúdo
- [ ] Página de artigo

---

## 🆘 Troubleshooting

### ❌ Erro: "Cannot find module 'prisma'"
```bash
npx prisma generate
```

### ❌ Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está correto no `.env.local`
- Teste conexão: `npx prisma db pull`

### ❌ Erro: "NextAuth configuration invalid"
- Verifique se `NEXTAUTH_SECRET` está definido
- Verifique se `NEXTAUTH_URL` aponta para localhost:3000

### ❌ Erro: "Stripe webhook verification failed"
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Use Stripe CLI para testar localmente

---

## 💡 Dicas de Produtividade

### Use Prisma Studio
```bash
npx prisma studio
```
Interface visual para ver/editar dados

### Use Stripe CLI para testes
```bash
# Testar webhooks
stripe trigger checkout.session.completed

# Ver logs
stripe logs tail
```

### Hot Reload
Next.js recarrega automaticamente ao salvar arquivos

### TypeScript IntelliSense
VS Code mostrará autocomplete para Prisma e Stripe

---

## 📊 Checklist Diária

Ao final de cada dia, marque:

**Dia 1:**
- [ ] Database rodando no Supabase
- [ ] Prisma instalado e configurado
- [ ] Migrations executadas
- [ ] Seed data carregado
- [ ] Prisma Studio mostra dados

**Dia 2:**
- [ ] NextAuth.js configurado
- [ ] Página de login criada
- [ ] Consegue fazer login
- [ ] Sessão persiste após reload

**Dia 3:**
- [ ] Página de cadastro criada
- [ ] API de registro funciona
- [ ] Middleware protegendo rotas
- [ ] Página de perfil criada

**Dia 4:**
- [ ] Conta Stripe criada
- [ ] 3 produtos criados
- [ ] API Keys copiadas
- [ ] Database atualizado com Price IDs

**Dia 5:**
- [ ] Página de preços criada
- [ ] Botão "Assinar" redireciona para Stripe
- [ ] Checkout do Stripe abre

**Dia 6:**
- [ ] Webhooks configurados
- [ ] Pagamento teste processado
- [ ] Assinatura criada no database
- [ ] Página de sucesso mostra confirmação

**Dia 7:**
- [ ] Página de assinaturas criada
- [ ] Portal de billing funciona
- [ ] Usuário consegue cancelar assinatura

---

## 🎉 Parabéns!

Se chegou até aqui, você tem um MVP funcional de um **SaaS completo** com:
- Autenticação
- Pagamentos recorrentes
- Gerenciamento de assinaturas
- Database escalável

**Próximo desafio:** Semana 2 - Páginas institucionais e Blog! 🚀

---

## 📞 Precisa de Ajuda?

**Recursos:**
- 📚 Roadmaps detalhados em `/roadmaps`
- 📖 Documentação oficial das ferramentas
- 💬 Communities: Next.js Discord, Prisma Discord, Stripe Discord

**Erros comuns:**
- Sempre execute `npm install` após adicionar dependências
- Sempre execute `npx prisma generate` após alterar schema
- Sempre reinicie o servidor após mudar `.env.local`

---

**Boa sorte! Você consegue! 💪**

---

**Última atualização:** 16/01/2026
