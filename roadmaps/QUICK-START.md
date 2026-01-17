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

### ✅ Dia 1: Database (CONCLUÍDO)
**Objetivo:** Setup completo do PostgreSQL + Prisma

**Status:** ✅ COMPLETO

**O que foi feito:**
- ✅ Instalado Prisma 5.22.0 + @prisma/client + tsx + bcryptjs
- ✅ Criado schema.prisma com 15+ modelos (User, Plan, Subscription, Post, etc.)
- ✅ Configurado conexão com PostgreSQL (Dados.dev)
- ✅ Executado migrations: `npx prisma migrate dev --name init`
- ✅ Executado seed com dados de teste
- ✅ Verificado dados no Prisma Studio

**Credenciais de teste criadas:**
- Admin: admin@orion.com / admin123
- User: joao@example.com / user123

**Planos criados:**
- Starter: R$ 99,90/mês
- Professional: R$ 299,90/mês
- Enterprise: R$ 999,90/mês

---

### ✅ Dia 2: Autenticação - Parte 1 (CONCLUÍDO)
**Objetivo:** Login básico funcionando

**Status:** ✅ COMPLETO

**O que foi feito:**
- ✅ Instalado next-auth@beta e @auth/prisma-adapter
- ✅ Criado `src/lib/auth.ts` com:
  - Provedor Google OAuth
  - Provedor Credentials (email/senha)
  - JWT session strategy
  - Callbacks para role no token/session
- ✅ Criado `src/lib/prisma.ts` (singleton)
- ✅ Criado `src/app/api/auth/[...nextauth]/route.ts`
- ✅ Criado `src/app/(auth)/login/page.tsx` com:
  - Login com Google
  - Login com email/senha
  - Design responsivo com tema Orion
  - Suspense boundary para SSR
- ✅ Criado types em `src/types/next-auth.d.ts`
- ✅ Adicionado SessionProvider no providers.tsx

**Credenciais de teste:**
- Admin: admin@orion.com / admin123
- User: joao@example.com / user123

**Testar:** Acesse http://localhost:3000/login

---

### ✅ Dia 3: Autenticação - Parte 2 (CONCLUÍDO)
**Objetivo:** Cadastro e proteção de rotas

**Status:** ✅ COMPLETO

**O que foi feito:**
- ✅ Criado `src/app/(auth)/cadastro/page.tsx` com formulário completo
- ✅ Criado `src/app/api/register/route.ts` com validação e hash
- ✅ Criado `src/middleware.ts` com proteção de rotas
- ✅ Criado `src/app/perfil/page.tsx` com dados do usuário

**Testar:**
1. Cadastro: http://localhost:3000/cadastro
2. Login: http://localhost:3000/login
3. Perfil: http://localhost:3000/perfil

---

### ✅ Dia 4-6: Mercado Pago Setup e Checkout (CONCLUÍDO)
**Objetivo:** Configurar Mercado Pago e checkout completo

**Status:** ✅ COMPLETO

**O que foi feito:**
- ✅ Instalado SDK `mercadopago`
- ✅ Criado `src/lib/mercadopago.ts` com:
  - Configuração do cliente Mercado Pago
  - Função para criar preferência de pagamento
  - Função para buscar informações de pagamento
  - Definição dos 3 planos (Starter, Professional, Enterprise)
- ✅ Atualizado `prisma/schema.prisma` com campos Mercado Pago:
  - `mercadoPagoId` no Plan
  - `mercadoPagoPaymentId` e `mercadoPagoPayerId` no Subscription
  - `mercadoPagoPaymentId` e `mercadoPagoPreferenceId` no Order
- ✅ Criado `src/app/api/mercadopago/checkout/route.ts`
- ✅ Criado `src/app/api/mercadopago/webhooks/route.ts`
- ✅ Criado `src/app/precos/page.tsx` com cards de preços
- ✅ Criado páginas de resultado:
  - `src/app/checkout/sucesso/page.tsx`
  - `src/app/checkout/erro/page.tsx`
  - `src/app/checkout/pendente/page.tsx`

**Configurar credenciais no .env.local:**
```env
MERCADOPAGO_ACCESS_TOKEN="TEST-seu-token-aqui"
MERCADOPAGO_PUBLIC_KEY="TEST-sua-public-key-aqui"
```

**Testar:** Acesse http://localhost:3000/precos

**Validação:** Checkout do Mercado Pago abre corretamente

---

### ✅ Dia 7: Gerenciamento (CONCLUÍDO)
**Objetivo:** Usuário pode ver e gerenciar assinatura

**Status:** ✅ COMPLETO

**O que foi feito:**
- ✅ Criado `src/app/assinaturas/page.tsx` com:
  - Visualização da assinatura ativa
  - Detalhes do plano e preço
  - Período atual e próxima cobrança
  - Lista de recursos do plano
  - Estado vazio quando sem assinatura
- ✅ Criado `src/app/assinaturas/cancel-button.tsx`:
  - Dialog de confirmação
  - Feedback de loading
- ✅ Criado `src/app/api/subscriptions/cancel/route.ts`:
  - Validação de autenticação
  - Verificação de propriedade
  - Cancelamento ao fim do período

**Testar:** Acesse http://localhost:3000/assinaturas

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
