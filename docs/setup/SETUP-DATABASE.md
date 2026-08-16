# 🗄️ Setup do Database - Dia 1

**Status:** ✅ Arquivos criados | ⏳ Aguardando configuração do Supabase

---

## 📋 O que foi criado

- ✅ `prisma/schema.prisma` - Schema completo com 15+ modelos
- ✅ `prisma/seed.ts` - Dados de teste (usuários, planos, posts, cupons)
- ✅ `src/lib/prisma.ts` - Cliente Prisma singleton
- ✅ `.env.local` - Variáveis de ambiente (placeholders)
- ✅ Scripts no `package.json`

---

## 🚀 Próximos Passos

### 1️⃣ Criar Database no Supabase (5 minutos)

#### Opção A: Supabase (Recomendado)

1. Acesse [supabase.com](https://supabase.com) e faça login (pode usar GitHub)

2. Clique em **"New project"**

3. Preencha:
   - **Name:** `orion-nova-production` (ou qualquer nome)
   - **Database Password:** Escolha uma senha forte (anote!)
   - **Region:** Escolha o mais próximo (ex: São Paulo)
   - **Pricing Plan:** Selecione **Free** (500MB, suficiente para MVP)

4. Clique em **"Create new project"** e aguarde ~2 minutos

5. Quando concluir, vá em **Settings → Database**

6. Na seção **Connection String**, copie a **URI** (formato: `postgresql://...`)
   - **IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha que você criou

#### Opção B: Neon (Alternativa)

1. Acesse [neon.tech](https://neon.tech) e faça login

2. Clique em **"Create a project"**

3. Escolha nome e região

4. Copie a **Connection String** que aparece (já vem completa)

---

### 2️⃣ Configurar Variáveis de Ambiente (2 minutos)

Abra o arquivo `.env.local` e:

**1. Substitua a DATABASE_URL:**

```env
DATABASE_URL="postgresql://postgres:SUA-SENHA@seu-host.supabase.co:5432/postgres"
```

Cole sua connection string do Supabase ou Neon aqui ↑

**2. Gere um NEXTAUTH_SECRET:**

Abra o terminal e execute:

```bash
openssl rand -base64 32
```

Cole o resultado no `.env.local`:

```env
NEXTAUTH_SECRET="cole-aqui-o-resultado"
```

**Arquivo final deve ficar assim:**

```env
DATABASE_URL="postgresql://postgres:minha-senha@xyz.supabase.co:5432/postgres"
NEXTAUTH_SECRET="AfJ8x7Kp2mN9vB3qR5tY8wE1dC4fH6gJ0lM3nP5sT7uV9xZ2aB4cD6eF8gH0iJ2k"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### 3️⃣ Executar Migrations e Seed (3 minutos)

Abra o terminal na pasta do projeto e execute:

```bash
# Gerar Prisma Client
npx prisma generate

# Criar primeira migration (cria todas as tabelas)
npx prisma migrate dev --name init

# Popular database com dados de teste
npm run prisma:seed

# Abrir Prisma Studio para ver os dados
npx prisma studio
```

**O que cada comando faz:**

- `prisma generate` → Gera TypeScript types baseado no schema
- `prisma migrate dev` → Cria tabelas no database
- `prisma:seed` → Insere dados de teste
- `prisma studio` → Abre interface visual para ver/editar dados

---

## ✅ Validação

Após executar os comandos acima, você deve ver:

### No terminal:
```
✅ Usuários criados: admin@orion.com, joao@example.com
✅ Planos criados: Starter, Professional, Enterprise
✅ Categorias criadas
✅ Tags criadas
✅ Posts criados
✅ Assinatura criada
✅ Cupons criados
🎉 Seed concluído com sucesso!
```

### No Prisma Studio (http://localhost:5555):
- **users** → 2 registros (Admin e João)
- **plans** → 3 registros (Starter, Pro, Enterprise)
- **posts** → 2 registros (artigos do blog)
- **subscriptions** → 1 registro (assinatura do João)
- **coupons** → 2 registros (WELCOME20, PRIMEIRACOMPRA50)

---

## 📊 Dados de Teste Criados

### Usuários

| Email | Senha | Role |
|-------|-------|------|
| admin@orion.com | admin123 | ADMIN |
| joao@example.com | user123 | USER |

### Planos

| Nome | Preço | Usuários | Storage |
|------|-------|----------|---------|
| Starter | R$ 99,90/mês | 5 | 10GB |
| Professional | R$ 299,90/mês | 25 | 100GB |
| Enterprise | R$ 999,90/mês | Ilimitado | 1TB |

### Cupons

| Código | Desconto | Tipo |
|--------|----------|------|
| WELCOME20 | 20% | Percentual |
| PRIMEIRACOMPRA50 | R$ 50 | Valor fixo |

---

## 🔧 Comandos Úteis

```bash
# Ver dados no Prisma Studio
npx prisma studio

# Resetar database (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Criar nova migration após alterar schema
npx prisma migrate dev --name nome-da-migration

# Rodar seed novamente
npm run prisma:seed

# Ver status das migrations
npx prisma migrate status
```

---

## 🆘 Problemas Comuns

### ❌ "Environment variable not found: DATABASE_URL"
**Solução:** Verifique se o arquivo `.env.local` está na raiz do projeto e se a DATABASE_URL está preenchida corretamente.

### ❌ "Can't reach database server"
**Solução:**
1. Verifique se a connection string está correta
2. Confirme que substituiu `[YOUR-PASSWORD]` pela senha real
3. Teste a conexão: `npx prisma db pull`

### ❌ "Port 5555 already in use" (Prisma Studio)
**Solução:** Feche outras instâncias do Prisma Studio ou use: `npx prisma studio -p 5556`

### ❌ Seed falha com "Unique constraint"
**Solução:** Dados já existem. Para reiniciar:
```bash
npx prisma migrate reset
npm run prisma:seed
```

---

## 🎯 Próximo Passo

Após concluir o setup do database:

**✅ Dia 1 COMPLETO!**

➡️ **Dia 2:** Sistema de Autenticação
- Siga o roadmap: [roadmaps/01-autenticacao.md](../roadmaps/01-autenticacao.md)
- Ou continue com o Quick Start Guide

---

## 📚 Recursos

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Neon Docs](https://neon.tech/docs)

---

**Dúvidas?** Consulte o [Quick Start Guide](../roadmaps/QUICK-START.md) ou os roadmaps detalhados.
