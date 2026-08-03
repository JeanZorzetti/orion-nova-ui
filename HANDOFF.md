# Handoff — Orion Nova (03/08/2026, sessão 3)

Next.js 16 App Router, Prisma + PostgreSQL, NextAuth v5. O `vite` em
`node_modules` vem do vitest — não é build tool aqui.

Meta em vigor: **1º cliente pagante até 01/11/2026**, critérios em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

Sessão 3 (`cfce212`, `39d135c`, este commit): configurações reorganizadas —
`migracao` e `integracoes` desceram para `configuracoes/`, as 4 âncoras viraram
páginas, a sidebar ganhou submenu e o ícone de agenda saiu. Detalhe no final.

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
   normaliza `""` para `null` por causa do `@unique`.
3. Na Vercel: `STRIPE_SECRET_KEY` (**restricted key `rk_`**, não `sk_`) e
   `STRIPE_WEBHOOK_SECRET`, ambas Sensitive. As permissões exatas da restricted
   key estão em [.env.example:13](.env.example#L13).
4. Endpoint de webhook no painel apontando para
   `https://orion.roilabs.com.br/api/webhooks/stripe` com os 3 eventos:
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`.

**Armadilha que vai estragar a primeira compra se passar batido:**
`NEXT_PUBLIC_APP_URL` **não está configurada na Vercel** (só existem
`DATABASE_URL`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `NEXTAUTH_URL`). Tanto o
checkout ([route.ts:59](src/app/api/checkout/route.ts#L59)) quanto o portal
([billing/portal/route.ts:30](src/app/api/billing/portal/route.ts#L30)) caem no
fallback `http://localhost:3000`. O pagamento é aprovado e o cliente é jogado
numa URL morta. Configure junto com as chaves.

Verificação: `SELECT slug, "stripePriceId" FROM plans WHERE "isActive"` retorna
3 linhas sem nulo, e `POST /api/checkout` devolve URL da Stripe.

### 2. Uma compra real (G3)

Cartão pessoal, dinheiro real, em produção — não test mode, não localhost. O
test mode esconde exatamente as três coisas que quebram aqui: chave de produção
errada, webhook secret errado e `success_url` apontando para localhost.

Registrar no arquivo de metas: `payment_intent`, timestamp e os 5 efeitos
(e-mail, `Subscription.status = ACTIVE`, dashboard destravado, portal abrindo em
`/assinaturas`, reembolso). Reembolsar em seguida pelo painel.

### 3. Antes de qualquer cliente ver isso: `/precos` promete NF-e

Achado desta sessão, e é o mais barato de todos de consertar. O plano Starter
vende **"Emissão de NF-e (até 100/mês)"** e o Professional **"Emissão ilimitada
NF-e/NFS-e"** ([seed.ts:28](prisma/seed.ts#L28) e
[seed.ts:59](prisma/seed.ts#L59)) — a página de preços renderiza essa lista
direto do banco ([precos/page.tsx:158](src/app/precos/page.tsx#L158)).

Emissão de NF-e **não existe**. A própria tela de Fiscal diz "Em
desenvolvimento" ([fiscal/page.tsx:71](src/app/dashboard/configuracoes/fiscal/page.tsx#L71)).

Ou seja: hoje a Orion cobra R$ 89/mês prometendo por escrito a feature que ela
não tem. O primeiro pagante descobre isso na primeira semana e pede reembolso —
e o G7 inteiro (30 dias de permanência) vai junto. É um `UPDATE` na coluna
`features` dos 3 planos + o seed. Faça **antes** da compra real, não depois.

O resto do G4 (README dizendo "60%", auth e database marcados como "em
desenvolvimento") pode esperar; isso aqui não.

### Ordem sugerida

1. NF-e fora dos planos (30 min, e destrava o G4 parcialmente)
2. Stripe configurada + `NEXT_PUBLIC_APP_URL` na Vercel (~1h, sem código)
3. Compra real em produção, com evidência registrada no arquivo de metas
4. Só então G5 (3 pessoas reais cronometradas) e G7 (outbound)

**Não comece módulo novo de ERP.** Está explicitamente fora de escopo até
01/11 — o que existe basta para provar a tese, e o gargalo não é feature.

---

## ⚠️ Segurança — em ordem de urgência, tudo ainda aberto

1. **`admin@orion.com` / `admin123` é `SUPER_ADMIN` em produção.** Troque a
   senha. É a primeira coisa a fazer na próxima sessão, leva 2 minutos.
2. **A senha do Postgres vazou** num chat e é a mesma do usuário
   `jeanzorzetti@gmail.com` no seed. Rotacione.
3. **O Postgres aceita conexão da internet aberta com `sslmode=disable`.**
   Foi possível conectar de fora sem obstáculo, tráfego em claro.
4. **Fail-open no middleware** ([src/middleware.ts](src/middleware.ts), o `catch`
   no fim da checagem de trial): quando a consulta ao banco falha, o acesso é
   liberado. É o G6 e foi o que manteve invisível a queda de produção descrita
   abaixo. Vira redirect para `/precos` + alerta.

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
