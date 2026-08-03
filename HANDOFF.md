# Handoff — Orion Nova (03/08/2026, sessão 4)

Next.js 16 App Router, Prisma + PostgreSQL, NextAuth v5. O `vite` em
`node_modules` vem do vitest — não é build tool aqui.

Meta em vigor: **1º cliente pagante até 01/11/2026**, critérios em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

Sessão 4 (este commit): tudo que travava a primeira venda **do lado do código**
saiu do caminho — NF-e fora dos planos, `features: {}` que apagaria os bullets,
fallback de URL do checkout e fail-open do middleware. O que resta para receber
dinheiro é painel: Stripe e Vercel. Detalhe no final.

---

## O próximo passo: a Orion não consegue receber dinheiro

Você está certo — o básico está redondo. Cadastro, ERP, onboarding, trial,
configurações: tudo de pé. E é exatamente por isso que o próximo passo não é
tela nenhuma.

### O diagnóstico

O caminho do dinheiro **já está escrito e testado**. G1 e G2 do arquivo de metas
fecharam em 03/08: existe uma rota de checkout
([api/checkout/route.ts](src/app/api/checkout/route.ts)), um webhook autenticado
e idempotente com 4 testes
([webhooks/stripe](src/app/api/webhooks/stripe/__tests__/route.test.ts)) e um
portal de billing. O código está pronto.

O que falta não é código: **os 3 planos estão no banco com `stripePriceId` nulo**
e as chaves da Stripe não existem na Vercel. Com isso,
[api/checkout/route.ts:33](src/app/api/checkout/route.ts#L33) responde
`409 Plano sem preço configurado na Stripe` para qualquer plano. Hoje, se um
cliente aparecer e quiser pagar, ele não consegue — a falha é explícita e limpa,
e mesmo assim é uma venda perdida.

Isso é o G2.5, marcado 🔴 no arquivo de metas, e ele bloqueia todo o resto. É
trabalho de painel, não de editor: ~1 hora.

### 1. Configurar a Stripe (G2.5)

1. Conta da ROI Labs em **BRL**, 3 Products (Starter R$ 89, Professional R$ 249,
   Enterprise) com price **recorrente mensal**. Os valores estão em
   [prisma/seed.ts:19](prisma/seed.ts#L19).
2. Colar os 3 price IDs em `/admin/planos` — o campo já existe
   ([admin/planos/page.tsx:470](src/app/admin/planos/page.tsx#L470)) e a rota
   normaliza `""` para `null` por causa do `@unique`. Esse salvamento mandava
   `features: {}` junto e `{}` é truthy no
   [PATCH](src/app/api/plans/[id]/route.ts#L73): colar os price IDs zerava a
   lista de bullets dos 3 planos e `/precos` ficava com cards vazios. Corrigido
   nesta sessão (o form não manda mais o campo, que ele nem edita).
3. Na Vercel: `STRIPE_SECRET_KEY` (**restricted key `rk_`**, não `sk_`) e
   `STRIPE_WEBHOOK_SECRET`, ambas Sensitive. As permissões exatas da restricted
   key estão em [.env.example:13](.env.example#L13).
4. Endpoint de webhook no painel apontando para
   `https://orion.roilabs.com.br/api/webhooks/stripe` com os 3 eventos:
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`.

**Armadilha desarmada, mas configure mesmo assim:** `NEXT_PUBLIC_APP_URL` **não
está na Vercel** (só existem `DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`,
`NEXTAUTH_URL`), e checkout e portal caíam no fallback `http://localhost:3000` —
pagamento aprovado, cliente jogado numa URL morta. Agora os dois passam por
[appUrl()](src/lib/app-url.ts), que tenta `NEXT_PUBLIC_APP_URL` →
`NEXTAUTH_URL` → `VERCEL_PROJECT_PRODUCTION_URL` antes do localhost, então em
produção já resolve. Setar a variável continua sendo o certo: é a única das três
que você controla.

Verificação: `SELECT slug, "stripePriceId" FROM plans WHERE "isActive"` retorna
3 linhas sem nulo, e `POST /api/checkout` devolve URL da Stripe.

### 2. Uma compra real (G3)

Cartão pessoal, dinheiro real, em produção — não test mode, não localhost. O
test mode esconde exatamente as três coisas que quebram aqui: chave de produção
errada, webhook secret errado e `success_url` apontando para localhost.

Registrar no arquivo de metas: `payment_intent`, timestamp e os 5 efeitos
(e-mail, `Subscription.status = ACTIVE`, dashboard destravado, portal abrindo em
`/assinaturas`, reembolso). Reembolsar em seguida pelo painel.

### 3. `/precos` prometia NF-e — código corrigido, **falta rodar no banco**

O plano Starter vendia "Emissão de NF-e (até 100/mês)" e o Professional "Emissão
ilimitada NF-e/NFS-e", enquanto a tela de Fiscal diz "Em desenvolvimento"
([fiscal/page.tsx:71](src/app/dashboard/configuracoes/fiscal/page.tsx#L71)).
Cobrar R$ 89/mês prometendo por escrito uma feature inexistente é reembolso na
primeira semana, e leva o G7 (30 dias de permanência) junto.

O seed já saiu limpo, mas ele usa `update: {}` — **as linhas que estão em
produção não mudam sozinhas** e `/precos` renderiza direto do banco
([precos/page.tsx:158](src/app/precos/page.tsx#L158)). Rode uma vez, antes da
compra real:

```bash
DATABASE_URL="postgresql://...:5449/..." npx tsx scripts/strip-nfe-from-plans.ts
```

Idempotente: tira os bullets que casam com NF-e/NFS-e/nota fiscal e a chave
`nfeLimit`, e não faz nada se já estiver limpo. Depois confira em `/precos` que
os 3 cards continuam com bullets (não vazios).

O resto do G4 (README dizendo "60%", auth e database marcados como "em
desenvolvimento") pode esperar. Uma pendência do mesmo tipo, mais barata:
[features/page.tsx:142](src/app/features/page.tsx#L142) e
[solucoes/[slug]/page.tsx:87](src/app/solucoes/[slug]/page.tsx#L87) ainda
anunciam NF-e no site institucional — não é o que o cliente compra, mas é a
mesma promessa.

### Ordem sugerida

1. `strip-nfe-from-plans.ts` no banco de produção (2 min)
2. Stripe configurada + `NEXT_PUBLIC_APP_URL` na Vercel (~1h, sem código)
3. Compra real em produção, com evidência registrada no arquivo de metas
4. Só então G5 (3 pessoas reais cronometradas) e G7 (outbound)

**Não comece módulo novo de ERP.** Está explicitamente fora de escopo até
01/11 — o que existe basta para provar a tese, e o gargalo não é feature.

---

## ⚠️ Segurança — em ordem de urgência

1. **`admin@orion.com` / `admin123` é `SUPER_ADMIN` em produção.** Ainda aberto:
   o seed não recria mais essa senha (agora vem de `SEED_ADMIN_PASSWORD`, ou é
   sorteada e impressa), mas o usuário que **já existe** no banco continua com
   ela — `upsert` com `update: {}` não toca em quem existe. Troque pelo
   `/esqueci-senha` ou por um `UPDATE` com hash bcrypt. 2 minutos.
2. **A senha do Postgres vazou** num chat e era a mesma do usuário
   `jeanzorzetti@gmail.com`. Saiu do repositório (mesmo mecanismo do item 1),
   mas **rotacionar no Postgres continua pendente**.
3. **O Postgres aceita conexão da internet aberta com `sslmode=disable`.**
   Foi possível conectar de fora sem obstáculo, tráfego em claro. Ainda aberto.
4. ~~Fail-open no middleware~~ — **fechado nesta sessão (G6)**. O `catch` da
   checagem de trial ([src/middleware.ts](src/middleware.ts)) liberava acesso
   quando o banco falhava, e foi isso que manteve invisível a queda de produção
   descrita abaixo. Agora redireciona para `/precos?erro=indisponivel`, que
   mostra um alerta. O efeito colateral aceito: uma instabilidade momentânea do
   banco tira o cliente do dashboard — é o comportamento que se quer, porque o
   dashboard sem banco não funciona mesmo, só fingia.

---

## ⚠️ Pendência de deploy — leia antes de subir

**A migration `20260803120000_add_companies` está commitada e nunca foi aplicada
em produção.** O `vercel-build` roda `prisma migrate deploy`, então ela sobe no
próximo deploy.

Não havia `.env`/`.env.local` na máquina das sessões 2 e 3, então **o check de
drift obrigatório continua sem ser executado**. Rode antes do próximo deploy:

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script
```

Saída esperada: apenas o `CREATE TABLE "companies"`. **Qualquer coisa além disso
é drift** — pare e resolva antes de deployar.

---

## ⚠️ Leia antes de mexer no schema

Isto derrubou a produção uma vez e é fácil repetir.

Alguém evoluiu `prisma/schema.prisma` com `prisma db push` e nunca gerou as
migrations. O banco ficou sem metade do ERP enquanto o schema dizia que estava
tudo lá; o Prisma Client gerava `SELECT` de colunas inexistentes e todo endpoint
respondia 500.

**`prisma migrate status` não detecta isso.** Ele compara migrations aplicadas
com os arquivos em `prisma/migrations/` — nunca compara o schema com o banco.
Dizia "Database schema is up to date!" o tempo inteiro. O comando que revela a
verdade é o `migrate diff` acima; saída vazia (`-- This is an empty migration.`)
= alinhado.

Regras:

- **Nunca `db push`** neste projeto. Sempre gere migration.
- Ao criar migration à mão, escreva o arquivo **sem BOM**. O
  `Out-File -Encoding utf8` do PowerShell 5.1 injeta BOM e o Postgres falha com
  `syntax error at or near "﻿"`. Use
  `[System.IO.File]::WriteAllText($p, $sql, (New-Object System.Text.UTF8Encoding($false)))`
  e confira com `Format-Hex` que o arquivo começa em `2D 2D`.
- Depois de mudar o schema, rode `npx prisma generate` local antes do seed,
  senão o client velho quebra com `P2022`.
- Mudar o schema exige **redeploy** para a Vercel regenerar o client.
- Sem `.env` local, `prisma validate`/`generate` rodam com
  `$env:DATABASE_URL = "postgresql://u:p@localhost:5432/db"` (não conectam).

**Banco de produção é a porta 5449.** Existe outro no mesmo host na porta
**5453** com as 5 migrations iniciais e tabelas vazias — migrado por engano, não
é usado por ninguém, limpe se quiser.

---

## Pendências menores

- **Agenda: decisão tomada nesta sessão.** O ícone de calendário saiu do topo do
  dashboard (era mock puro: 3 eventos hard-coded e um "Ver agenda completa" que
  não navegava). Não existe model de evento nem rota de API. Se voltar depois do
  primeiro pagante, a opção barata continua sendo **visão derivada** do que já
  existe — vencimentos de `FinancialTransaction` e entregas de `SalesOrder`
  cobrem os 3 exemplos que o próprio mock inventava — em vez de entidade nova.
  Enquanto isso, agenda está fora de escopo pelo arquivo de metas.
- O select **"Tipo de Dados"** da migração é coletado e **ignorado** pela rota —
  `/api/migration` decide tudo pelo parser do ERP. Ou o campo some, ou a rota
  passa a respeitá-lo.
- `/api/migration` só tem `POST`. O model `DataMigration` guarda status, totais
  e `completedAt`, mas não há `GET` nem tela de histórico.
- Os 3 toggles de `/dashboard/configuracoes/notificacoes` são decorativos —
  persistir exige coluna nova em `users`. Marcado com comentário `ponytail:` no
  arquivo.
- O botão **"Alterar Senha"** em `/dashboard/configuracoes/seguranca` não faz
  nada. `/esqueci-senha` existe e funciona — ligar os dois é uma linha.
- **VAPID na Vercel** para web push de verdade. O resto do push já está
  implementado.
- 3 testes falham em `NotificationBell.test.tsx` (formatação de tempo relativo),
  pré-existentes. Os outros 60 passam.
- Aviso de build: `middleware` está deprecado no Next 16, quer virar `proxy`.
- "Mercado Pago" em integrações e `features/page.tsx` é integração que o
  *cliente* conecta no ERP, não provedor de cobrança. Não é resíduo.
- MCP da Stripe não autorizado. Autorize via `claude mcp` numa sessão
  interativa ou trabalhe sem ele.
- **Não persiga SEO.** O Orion compete no cluster "ERP" contra TOTVS, Omie,
  Bling e Conta Azul; em 90 dias não sai do zero. O canal do primeiro pagante é
  outbound, e SEO está fora de escopo no arquivo de metas.

---

## Histórico: o que a sessão 4 entregou

1. **NF-e fora dos planos** — bullets e `nfeLimit` removidos do
   [seed](prisma/seed.ts) + [scripts/strip-nfe-from-plans.ts](scripts/strip-nfe-from-plans.ts)
   para as linhas que já estão em produção (com teste).
2. **`features: {}` não é mais enviado por `/admin/planos`** — `{}` passa no
   `features &&` do PATCH e apagaria os bullets dos 3 planos no exato momento em
   que você fosse colar os price IDs da Stripe.
3. **[appUrl()](src/lib/app-url.ts)** em checkout, portal e links de e-mail de
   notificação (esse último montava `undefined/...` hoje).
4. **Middleware fail-closed** + alerta em `/precos`.
5. **Senhas de admin saíram do seed** — `SEED_ADMIN_PASSWORD` /
   `SEED_OWNER_PASSWORD`, documentadas no [.env.example](.env.example).

## Histórico: o que a sessão 3 entregou

1. **`migracao` e `integracoes` desceram para `configuracoes/`** (`cfce212`) —
   eram itens de Configurações morando fora dela, e o breadcrumb, derivado do
   pathname, mostrava `🏠 > Migracao`. 11 referências atualizadas, redirects
   permanentes em [next.config.ts](next.config.ts) (links de notificação já
   enviados apontam para as URLs velhas), `pathNameMap` completo. A tela de
   migração perdeu a linguagem de onboarding que sobrou ("Etapa Opcional",
   "Pular Esta Etapa" — o step é `optional` e não conta no progresso).
2. **As 4 âncoras viraram páginas** (`39d135c`) — `perfil`, `notificacoes`,
   `seguranca`, `sistema`. O hub misturava 5 rotas com 4 âncoras `#`, e âncora
   clicada de dentro de uma sub-rota não ia a lugar nenhum. Tutorial e Dados de
   Exemplo foram para `sistema`.
3. **Submenu na sidebar** — Configurações vira grupo colapsável com as 9
   sub-rotas. Abre sozinho quando o pathname já está sob `/dashboard/configuracoes`
   e o clique sobrepõe. Colapsada (w-20), volta a ser link para o hub. A lista
   mora em [src/lib/settings-nav.ts](src/lib/settings-nav.ts) — sidebar e hub
   leem dela, e a coluna de nav duplicada do hub foi deletada.
4. **Ícone de agenda removido** — `calendar-dropdown.tsx` deletado e as 2 linhas
   do [dashboard/layout.tsx](src/app/dashboard/layout.tsx) que o montavam.

Verificação usada: `npx tsc --noEmit`, `npx next build` e `npx vitest run`.
`npm run smoke:auth` só se encostar em auth.
