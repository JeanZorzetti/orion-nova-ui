# Handoff — Orion Nova (03/08/2026)

Next.js 16 App Router, Prisma + PostgreSQL, NextAuth v5. O `vite` em
`node_modules` vem do vitest — não é build tool aqui.

Meta em vigor: **1º cliente pagante até 01/11/2026**, critérios em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

---

## Estado: produção voltou a funcionar

A sessão anterior deixou o site quebrado de três formas empilhadas, cada uma
escondendo a próxima. Todas resolvidas e verificadas em produção.

| Sintoma | Causa | Commit |
|---|---|---|
| `ERR_TOO_MANY_REDIRECTS`, login inalcançável | middleware usava `!!req.auth`, truthy sem sessão, enquanto todo server component usa `session?.user` | `755c585` |
| 500 em toda rota que tocava o banco | schema.prisma à frente do banco: faltavam 7 tabelas, 9 enums e 4 colunas em `users` | `37b4864` |
| Login não emitia sessão | Vercel só tinha `DATABASE_URL` | env vars |

Verificado: login real emite sessão com `role`, `/dashboard` responde 200 com
cookie, `/api/plans` 200, cadastro 201. `npm run smoke:auth` checa os guardas
de rota sem cookie — rode depois de qualquer mexida em auth.

**Banco de produção é a porta 5449.** Existe um outro banco no mesmo host na
porta **5453** com as 5 migrations iniciais aplicadas e tabelas vazias — foi
migrado por engano nesta sessão. Não é usado por ninguém; limpe se quiser.

---

## ⚠️ Leia antes de mexer no schema

Foi isto que derrubou a produção, e é fácil repetir.

Alguém evoluiu `prisma/schema.prisma` com `prisma db push` e nunca gerou as
migrations. O banco ficou sem metade do ERP enquanto o schema dizia que estava
tudo lá. O Prisma Client gerava `SELECT` de colunas inexistentes e todo
endpoint respondia 500.

**`prisma migrate status` não detecta isso.** Ele compara migrations aplicadas
com os arquivos em `prisma/migrations/` — nunca compara o schema com o banco.
Ele disse "Database schema is up to date!" o tempo inteiro.

O comando que revela a verdade:

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script
```

Saída vazia (`-- This is an empty migration.`) = alinhado. Qualquer outra
coisa = drift.

Regras:

- **Nunca `db push`** neste projeto. Sempre gere migration.
- Ao criar migration à mão, escreva o arquivo **sem BOM**. O
  `Out-File -Encoding utf8` do PowerShell 5.1 injeta BOM e o Postgres falha com
  `syntax error at or near "﻿"`. Use
  `[System.IO.File]::WriteAllText($p, $sql, (New-Object System.Text.UTF8Encoding($false)))`.
- Depois de mudar o schema, rode `npx prisma generate` local antes de rodar o
  seed, senão o client velho quebra com `P2022`.
- Mudar o schema exige **redeploy** para a Vercel regenerar o client.

O fail-open em [src/middleware.ts](src/middleware.ts) (o `catch` que libera
acesso quando a consulta falha) foi o que manteve esse erro invisível por
tanto tempo — engolia a exceção do banco em toda request. Continua aberto.
Não é risco teórico; já custou caro uma vez.

---

## Próximos passos

**Itens 1 a 7 foram executados** (03/08/2026). O que sobrou de cada um está
anotado no fim de cada seção. Só o item 8 (agenda) continua intocado, a pedido.

### 1. Ativar notificações ✅

Quase tudo já existe: model `Notification`, `PushSubscription`,
[/api/notifications](src/app/api/notifications/route.ts), stream SSE em
[/api/notifications/stream](src/app/api/notifications/stream/route.ts),
[/api/push/subscribe](src/app/api/push/subscribe/route.ts), e o componente
real [NotificationBell](src/components/notifications/NotificationBell.tsx)
com testes.

O problema é que o header do dashboard usa o componente **errado**:

- [src/app/dashboard/layout.tsx:59](src/app/dashboard/layout.tsx#L59) monta
  `NotificationsDropdown`, de
  [src/components/notifications-dropdown.tsx](src/components/notifications-dropdown.tsx)
  — array hardcoded ("Novo pedido recebido", "Pagamento confirmado"). Nunca
  chamou API nenhuma.
- O `NotificationBell` real está montado dentro de
  [src/app/dashboard/page.tsx:122](src/app/dashboard/page.tsx#L122), ou seja,
  no corpo da página em vez do header.

Correção: trocar no layout por `NotificationBell` e removê-lo de
`dashboard/page.tsx` para não ficar duplicado. Depois disso,
`src/components/notifications-dropdown.tsx` e
[src/components/notification-center.tsx](src/components/notification-center.tsx)
(órfão, ninguém importa) podem ser deletados.

`/api/notifications` já responde 200 autenticado, com `unreadCount`. Para web
push de verdade faltam as chaves VAPID na Vercel — hoje só existem
`DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET` e `NEXTAUTH_URL`.

Os 3 testes que falham em `NotificationBell.test.tsx` são de formatação de
tempo relativo, pré-existentes e sem relação com isto.

> **Feito:** o layout monta `NotificationBell`, removido de `dashboard/page.tsx`,
> e `notifications-dropdown.tsx` / `notification-center.tsx` foram deletados.
> **Falta:** chaves VAPID na Vercel para web push de verdade (precisa de você).

### 2. Corrigir o botão voltar do /perfil ✅

[src/app/perfil/page.tsx:57](src/app/perfil/page.tsx#L57) — `<Link href="/">`
devolve o usuário para a home pública de marketing. Deve ir para `/dashboard`.
Uma linha.

> **Feito:** aponta para `/dashboard`.

### 3. Criar /perfil/configuracoes ✅

Confirmado 404 em produção. O link já existe e está visível em
[src/app/perfil/page.tsx:157](src/app/perfil/page.tsx#L157), em "Ações
Rápidas" — o usuário clica e cai no 404.

**Decida antes de escrever código:** já existe
[/dashboard/configuracoes](src/app/dashboard/configuracoes/page.tsx) (296
linhas) que faz exatamente isso — edita nome, email e notificações via
`/api/user/profile`. Criar uma segunda tela de configurações gera duas telas
divergentes para manter.

O caminho barato é `/perfil/configuracoes` redirecionar para
`/dashboard/configuracoes`. Só crie página própria se as configurações de
conta forem mesmo diferentes das do ERP.

> **Feito:** `src/app/perfil/configuracoes/page.tsx` é um `redirect()` de 3
> linhas para `/dashboard/configuracoes`. Vira página própria só se as
> configurações divergirem.

### 4. Página 404 ✅

Já existe [src/app/not-found.tsx](src/app/not-found.tsx), mas é o placeholder
do template: **em inglês** ("Oops! Page not found", "Return to Home") num app
todo em português, sem identidade visual.

Além do texto, não há `not-found.tsx` dentro de `dashboard/`, então um 404 lá
dentro perde a sidebar e joga o usuário numa tela deslocada. Um
`src/app/dashboard/not-found.tsx` herda o layout e resolve.

> **Feito:** `not-found.tsx` reescrito em português com `glass-card` e
> `gradient-primary`, e criado `src/app/dashboard/not-found.tsx` (herda a
> sidebar, volta para `/dashboard`).

### 5. Corrigir a sidebar (rolagem) ✅

[src/components/DashboardSidebar.tsx](src/components/DashboardSidebar.tsx):

- **Rolagem:** o `<nav>` na
  [linha 57](src/components/DashboardSidebar.tsx#L57) é `flex-1` sem
  `overflow-y-auto`. Com a viewport baixa ou mais itens de menu, o conteúdo
  corta em vez de rolar. O `<aside>` é `h-screen` sem `sticky top-0`, então
  ao rolar a página a sidebar sai de vista.
- **Bônus, e mais visível para o cliente:** o rodapé mostra **"João da Silva" /
  "JD" / "Administrador" hardcoded**
  ([linhas 96-107](src/components/DashboardSidebar.tsx#L96-L107)), não o
  usuário logado. O layout já tem a `session` — passe o nome por prop, o
  componente é `"use client"`.

> **Feito:** `<aside>` ganhou `sticky top-0`, o `<nav>` ganhou `overflow-y-auto`
> e o rodapé recebe `name`/`initials`/`role` por prop do layout.

### 6. Corrigir /dashboard/financeiro/novo ✅

**Reavalie antes de mexer.** A tabela `financial_transactions` não existia no
banco até esta sessão — é bem provável que o que você viu quebrado fosse o 500
do drift de schema, já corrigido.

Estado atual verificado: a página responde 200, e autenticado
`/api/financial` e `/api/customers` respondem 200 com lista vazia.

Se ainda houver defeito, os pontos fracos visíveis são o feedback de erro por
`alert()`
([linhas 83 e 87](src/app/dashboard/financeiro/novo/page.tsx#L83-L87)) e a
ausência de validação client-side antes do submit. Reproduza primeiro e
descreva o sintoma — não saia trocando coisa.

> **Achado o defeito real:** o select "Cliente (Opcional)" tinha
> `<SelectItem value="">Nenhum</SelectItem>`, e o Radix Select 2.x **lança
> exceção** em item com value vazio. Por isso a página abria (200) e quebrava
> ao clicar no select. Corrigido com sentinela `NO_CUSTOMER = "none"`, mapeada
> de volta para `null` no payload. Era a única ocorrência no `src/`.
> Os `alert()` viraram `toast` do sonner. Validação client-side ficou de fora:
> os campos já têm `required` / `type="number"` / `min`, que o browser cobre.

### 7. Melhorar /dashboard/configuracoes ✅

[296 linhas](src/app/dashboard/configuracoes/page.tsx), e funciona:
`/api/user/profile` existe e o form salva. "Melhorar" está vago demais para
virar tarefa — defina o alvo antes.

O que dá para apontar hoje: feedback por `alert()` nas
[linhas 50-57](src/app/dashboard/configuracoes/page.tsx#L50-L57) (o projeto já
tem `sonner` para toast), e a seção "Notificações" é visual, sem persistir
preferência. O email `disabled` é intencional e está certo.

> **Feito:** `alert()` → `toast` do sonner.
> **Falta, de propósito:** persistir as preferências de notificação exige
> coluna nova em `users` + migration, e "melhorar" continua vago demais para
> justificar isso. Hoje os 3 toggles da seção "Notificações" são decorativos —
> ou você define o alvo, ou eles deveriam sumir da tela.

### 8. Ativar agenda

**Maior item da lista, e o único que é feature nova de verdade.**

Não existe nada: nenhum model de evento no schema (24 models, nenhum de
agenda), nenhuma rota de API.
[src/components/calendar-dropdown.tsx](src/components/calendar-dropdown.tsx) é
mock puro — "Reunião com cliente", "Vencimento de conta" hardcoded, e o "Ver
agenda completa" não navega para lugar nenhum.

Escopo real: model + migration + CRUD + UI de calendário. Antes de começar,
decida se a agenda é entidade própria ou se é uma visão derivada do que já
existe (vencimentos de `FinancialTransaction`, entregas de `SalesOrder`) — a
segunda opção entrega valor sem model novo e cobre os exemplos que o próprio
mock inventou.

Sendo feature nova, **use o fluxo Spec Kit** se o projeto tiver `.specify/`.

---

## Pendências fora dos 8 itens

**Segurança, em ordem de urgência:**

1. **`admin@orion.com` / `admin123` é `SUPER_ADMIN` em produção.** Criado pelo
   seed nesta sessão, a pedido. Troque a senha.
2. **A senha do Postgres vazou** num chat e é a mesma do usuário
   `jeanzorzetti@gmail.com` no seed. Rotacione.
3. **O Postgres aceita conexão da internet aberta com `sslmode=disable`.** Foi
   possível conectar de fora sem obstáculo, e o tráfego vai em claro.
4. O fail-open do middleware (seção acima).

**Pagamento (Stripe), deixado por último a pedido:** os 3 planos existem no
banco mas com `stripePriceId` nulo, então `POST /api/checkout` responde `409`.
Falta criar a conta Stripe em BRL, 1 Product por plano, colar os price IDs em
`/admin/planos` (o campo já existe) e configurar `STRIPE_SECRET_KEY` (use
restricted key `rk_`) e `STRIPE_WEBHOOK_SECRET` na Vercel. Detalhes em
[.env.example](.env.example) e no arquivo de metas.

**Ainda válido do handoff anterior:**

- "Mercado Pago" aparece em `dashboard/integracoes` e `features/page.tsx` —
  ali é integração que o *cliente* conecta no ERP, não provedor de cobrança.
  Não é resíduo.
- README desatualizado: diz "60%" e marca auth e database como "em
  desenvolvimento", ambos entregues.
- MCP da Stripe não autorizado. Autorize via `claude mcp` numa sessão
  interativa ou trabalhe sem ele.
- **Não persiga SEO.** O Orion compete no cluster "ERP" contra TOTVS, Omie,
  Bling e Conta Azul; em 90 dias não sai do zero. O canal do primeiro pagante
  é outbound. Está fora de escopo no arquivo de metas.
