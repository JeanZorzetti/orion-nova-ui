# Handoff — Orion Nova (03/08/2026, sessão 6)

Next.js 16 App Router, Prisma + PostgreSQL, NextAuth v5. O `vite` em
`node_modules` vem do vitest — não é build tool aqui.

Meta em vigor: **1º cliente pagante até 01/11/2026**, critérios em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

---

## 🎯 Comece por aqui: os planos prometem o que a Orion não entrega

A infraestrutura de cobrança está pronta e validada (Stripe, login, gate de
trial — tudo mais abaixo). **O bloqueio deixou de ser técnico.** A auditoria
abaixo foi feita na sessão 6 e mudou qual é o próximo passo: hoje, cobrar
qualquer plano que não seja o Starter é vender o que não existe.

A pergunta que abriu a sessão era "o que a Orion entrega está de acordo com o
que ela promete?". A resposta é **não**, e a distância cresce com o preço:

| Plano | Preço | Bullets que existem | Veredito |
|---|---|---|---|
| Starter | R$ 89 | **5 de 5** | Vendável hoje (com 2 ressalvas) |
| Professional | R$ 249 | **2 de 7** | Não vender |
| Enterprise | R$ 599 | **1 de 8** | Não vender |

O que a próxima sessão precisa decidir não é código, é **escopo e preço** —
detalhado em "A decisão", mais abaixo. Nenhuma dessas lacunas se fecha com
implementação até 01/11, e o arquivo de metas já proíbe módulo novo de ERP.

### O que a Orion realmente entrega hoje

Levantado das rotas, não da landing page. Isto é o produto:

- **Clientes** — CRUD completo (`/dashboard/clientes`, `/api/customers`)
- **Produtos** — CRUD, com `stockQuantity` e `minStock` no model
- **Vendas/Pedidos** — CRUD, status, pagamento (`/api/orders/*`)
- **Financeiro** — lançamentos a pagar/receber (`/api/financial`)
- **Relatórios** — exatamente **3**: vendas, clientes, financeiro
- **Dashboard** — métricas agregadas (`/api/dashboard/stats`)
- **Orion AI** — chat (`/api/ai/chat`)
- **Suporte, notificações, migração de ERP, API keys, dados de exemplo**

É um ERP enxuto e coerente. O problema não é o produto — é o que está escrito
nos cards de preço em cima dele.

### Starter (R$ 89) — os 5 bullets existem

`Financeiro básico` · `Clientes (até 500)` · `Produtos (até 200)` ·
`Relatórios básicos` · `IA: Insights básicos` — todos entregues.

Duas ressalvas, ambas em campos que o card renderiza fora dos bullets:

1. **`users: 2`** — não existe conceito de equipe (ver "O buraco estrutural").
2. **`storage: 5` GB** — **não existe upload de arquivo em lugar nenhum do
   sistema.** Nenhuma rota aceita `multipart`, não há S3/blob. Não há o que
   armazenar, então não há como entregar nem 5 GB nem 50.

Os limites de 500 clientes e 200 produtos **não são aplicados** — nenhuma rota
consulta o plano antes de criar. Isso não é propaganda enganosa (o cliente
recebe mais do que comprou), mas significa que **os 3 planos são funcionalmente
idênticos**: nada no código diferencia quem paga R$ 89 de quem paga R$ 599.

### Professional (R$ 249) — 2 de 7

| Bullet | Existe? |
|---|---|
| Estoque completo (ilimitado) | 🟡 campo `stockQuantity` no Product, **sem módulo de estoque** — não há entrada/saída, movimentação nem tela |
| Vendas e PDV integrado | 🟡 vendas sim, **PDV não existe** |
| CRM com funil de vendas | 🟡 cadastro de cliente sim, **funil não existe** |
| Dashboards interativos | ✅ |
| BI com 20+ relatórios | ❌ **existem 3** |
| Conciliação bancária automática | ❌ nada no código |
| Comissões de vendedores | ❌ nada no código |

Mais `integrations: 5`, sendo que `/dashboard/configuracoes/integracoes:120`
diz literalmente "em desenvolvimento", e `customReports: true`, que não existe.

### Enterprise (R$ 599) — 1 de 8

| Bullet | Existe? |
|---|---|
| Multi-empresa/Multi-filial (até 5 CNPJs) | ❌ `Company.userId` é `@unique` — **1 empresa por usuário, por schema** |
| Produção e MRP básico | ❌ |
| CRM avançado (automações, workflows) | ❌ |
| RH e ponto eletrônico | ❌ |
| Projetos e orçamentos | ❌ |
| Assistente IA completo | 🟡 o chat existe |
| API aberta (webhooks, integração custom) | ❌ **as API keys são geradas e nunca verificadas** — nenhuma rota aceita `x-api-key`; nenhum webhook de saída existe |
| White-label (marca customizada) | ❌ |

Mais `sla: "99.9%"` sem nenhuma instrumentação de uptime que o comprove.

**R$ 599/mês por 7 bullets inexistentes é o item mais perigoso do sistema** —
mais que qualquer bug. Um cliente Enterprise pede reembolso na primeira semana
e leva o G7 (30 dias de permanência) junto.

### O buraco estrutural: a Orion é single-user

Todo plano vende usuários (2 / 10 / ilimitado) e **o produto não tem equipe.**
Não é bullet faltando, é arquitetura: `Customer`, `Product`, `SalesOrder`,
`FinancialTransaction` — todos escopados por `userId`, e as rotas filtram por
`session.user.id`. Um segundo usuário não veria os dados do primeiro; teria um
sistema vazio. Não existe convite, membership nem workspace.

Entregar isso é migração de schema em ~6 models + tela de convite. **Grande, e
fora de escopo até 01/11.** Então "2 usuários" precisa sair do card, não entrar
no backlog.

### O vazamento por outra porta: a IA vende NF-e de novo

A sessão 4 tirou NF-e dos planos e do banco. Mas o system prompt em
[api/ai/chat/route.ts](src/app/api/ai/chat/route.ts) descreve os "módulos do
Orion ERP" e inclui **"Geração de NF-e"**, além de "Conciliação bancária",
"Gestão de Fornecedores e Compras", "Precificação dinâmica" e "Segmentação e
tags personalizadas" (o model `Tag` é do blog, não de clientes).

Ou seja: o assistente dentro do produto pago afirma para o cliente que features
inexistentes existem, e explica como usá-las. O próprio prompt manda "NUNCA
especule ou invente informações sobre funcionalidades não confirmadas" — e
depois lista as inexistentes como confirmadas. **Corrigir o prompt é barato e
deve andar junto com os cards.**

### E o site institucional promete mais ainda

[features/page.tsx](src/app/features/page.tsx) anuncia 17 features, incluindo
**NF-e, PDV, Agendamentos, Email Marketing, Contratos, Metas de Vendas, Análise
de Custos, Backup Automático, Controle de Acesso**. A maioria não existe.
[solucoes/[slug]](src/app/solucoes/[slug]/page.tsx) vende Ordens de Produção,
Controle de Matéria-Prima, Gestão de Projetos, Controle de Horas e Programa de
Fidelidade.

Prioridade menor que os cards de preço (o cliente compra em `/precos`, e é lá
que o texto vira obrigação contratual), mas é a mesma promessa.

---

## A decisão que a próxima sessão precisa tomar

Não dá para fechar o gap com código até 01/11, e o arquivo de metas proíbe
módulo novo. Sobram duas saídas honestas — **escolha uma antes de escrever
qualquer linha**:

**Opção A — um plano só, o que existe.** Mata Professional e Enterprise do
`/precos` até que existam. Um plano ~R$ 89–149 com os 6 módulos reais. É a mais
rápida e a mais alinhada com a meta: o objetivo é *um* pagante, não uma tabela
de preços. Perde ancoragem de preço e o teto de receita por cliente.

**Opção B — 3 planos, bullets reescritos para o que existe.** Mantém a
ancoragem, mas exige **aplicar os limites de verdade** (usuários, clientes,
produtos, relatórios) — senão os planos continuam idênticos e o cliente de
R$ 599 descobre que o de R$ 89 tem o mesmo sistema. Isso é código novo: um
helper de checagem de plano chamado nas rotas de criação.

**Recomendação: A.** O gargalo é o primeiro pagante, e R$ 89 com 5 bullets
verdadeiros converte melhor que R$ 599 com 7 falsos. B é o passo seguinte,
quando houver o que diferenciar.

Decidido isso, a ordem barata:

1. Reescrever `features.modules` dos planos — no [seed](prisma/seed.ts) **e**
   num script para as linhas de produção, igual ao
   [strip-nfe-from-plans.ts](scripts/strip-nfe-from-plans.ts). Lembre que o
   seed usa `update: {}`: **produção não muda sozinha.**
2. Tirar `storage` e `users` dos cards, ou zerar os campos — são as duas
   promessas que o produto não tem como cumprir nem no Starter.
3. Limpar o system prompt da IA (NF-e, conciliação, compras, precificação).
4. Só então `features/page.tsx` e `solucoes/[slug]`.
5. **Aí sim, a compra real (G3)** — continua sendo o único passo entre o estado
   atual e a meta, e continua exigindo cartão de verdade.

Reproduzir a auditoria: `GET https://orion.roilabs.com.br/api/plans` devolve os
bullets que estão em produção; `find src/app/dashboard -name page.tsx` e
`find src/app/api -name route.ts` mostram o que existe. A comparação é essa.

---

## O passo que continua pendente — a compra real (G3)

Cartão pessoal, dinheiro real, em produção — não test mode, não localhost. O
test mode esconde exatamente as três coisas que quebram aqui: chave de produção
errada, webhook secret errado e `success_url` apontando para localhost.

1. Logado, em `/precos`, assine o **Starter** (R$ 89) com cartão de verdade
2. Confirme os 5 efeitos: e-mail chegou · `Subscription.status = ACTIVE` ·
   dashboard destravado · portal abrindo em `/assinaturas` · reembolso
3. Registre `payment_intent` + timestamp em
   [roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md) e
   reembolse pelo painel

Se falhar no meio, o MCP da Stripe está autorizado: dá para ler o evento, a
Checkout Session e a subscription e comparar com o que o webhook gravou no
banco. Comece por `stripe_api_read` em `GetEvents`.

**Faça isso depois de arrumar os cards** — comprar o Starter hoje já
funcionaria, mas o `/precos` que o cliente vê ao lado ainda oferece dois planos
que não existem.

---

## ✅ Infraestrutura de cobrança — pronta e validada

Nada aqui precisa de trabalho. Está listado para você não reabrir.

| Item | Estado |
|---|---|
| 3 Products + prices BRL mensais | ✅ `prod_V0Rh7Z…` / `V0RhZE…` / `V0RhTI…` |
| Price IDs nos planos do banco | ✅ starter `price_1U0Qnx…`, professional `price_1U0Qo1…`, enterprise `price_1U0Qo3…` |
| Webhook endpoint + 3 eventos | ✅ `we_1U0QoG…` → `/api/webhooks/stripe` |
| `STRIPE_WEBHOOK_SECRET` / `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_APP_URL` | ✅ Production, Sensitive |
| Rota de checkout, webhook idempotente (4 testes), portal | ✅ |
| Login em produção | ✅ validado sessão 5, sessão real |
| Gate de trial, nos dois caminhos | ✅ validado sessão 5 |
| NF-e fora dos planos em produção | ✅ sessão 4 |

**A conta usada é a `acct_1SjN4c` ("Sirius")**, não uma conta ROI Labs separada
— decisão de 03/08 para não travar o G2.5 na verificação de uma conta nova. Ela
liquida em BRL e já hospeda 5 outros produtos. Os produtos do Orion têm
`metadata.app = "orion"` e `statement_descriptor = "ORION ERP"`, então a fatura
do cliente não vai dizer "SIRIUS".

A restricted key foi criada à mão no painel — é o único passo sem API. Se
precisar refazer:
[Dashboard → API keys](https://dashboard.stripe.com/acct_1SjN4cD6GTFfNAq4/apikeys)
→ Create restricted key, permissões em [.env.example:13](.env.example#L13).

Checkout e portal usam [appUrl()](src/lib/app-url.ts) (`NEXT_PUBLIC_APP_URL` →
`NEXTAUTH_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → localhost). Antes disso o
pagamento era aprovado e o cliente jogado numa URL morta.

---

## ⚠️ Onde o gate de trial mora, e por que

Resolvido, mas explica uma regra que não pode ser desfeita.

O gate vivia em `src/middleware.ts` com uma query do Prisma que **sempre
falhava** naquele contexto (provavelmente o engine não vai no bundle do proxy).
O `catch` era fail-open, então engolia o erro em 100% dos requests — **o gate
nunca rodou uma vez em produção**. Trocar por fail-closed (G6) não criou bug
nenhum, só parou de escondê-lo, e aí todo login caía em `/precos`.

O conserto (`a1eaf0a`): o gate saiu do proxy e foi para o
[dashboard/layout.tsx](src/app/dashboard/layout.tsx), server component onde o
Prisma comprovadamente funciona, **sem try/catch** — se o banco cair, o erro
aparece em vez de liberar acesso calado. O proxy ficou só com checagens de JWT.
**Não devolva banco para o proxy.**

Validado em produção na sessão 5: login real cai no `/dashboard`, e um usuário
`EXPIRED` cai em `/precos?trial=expired&from=/dashboard`. Se voltar a
redirecionar sem motivo, cheque o `subscriptionStatus` do usuário no banco
antes de culpar o código.

---

## ⚠️ Segurança — em ordem de urgência

1. **A senha do Postgres vazou** num chat e era a mesma do usuário
   `jeanzorzetti@gmail.com`. Saiu do repositório, mas **rotacionar no Postgres
   continua pendente** — é a credencial que dá acesso direto a tudo.
2. **O Postgres aceita conexão da internet aberta com `sslmode=disable`.**
   Foi possível conectar de fora sem obstáculo, tráfego em claro. Ainda aberto,
   e some junto com o item 1 se o banco parar de aceitar a internet inteira.
3. ~~`admin@orion.com` / `admin123`~~ — **fechado na sessão 5**, senha
   rotacionada por `UPDATE` com hash bcrypt.
4. ~~Fail-open no middleware~~ — **fechado (G6)**, pela raiz. Ver acima.
5. ~~O gate de trial nunca foi exercitado~~ — **fechado na sessão 5**, nos dois
   caminhos e em produção.

---

## ⚠️ Leia antes de mexer no schema

Isto derrubou a produção uma vez e é fácil repetir.

Alguém evoluiu `prisma/schema.prisma` com `prisma db push` e nunca gerou as
migrations. O banco ficou sem metade do ERP enquanto o schema dizia que estava
tudo lá; o Prisma Client gerava `SELECT` de colunas inexistentes e todo endpoint
respondia 500.

**`prisma migrate status` não detecta isso.** Ele compara migrations aplicadas
com os arquivos em `prisma/migrations/` — nunca compara o schema com o banco.
O comando que revela a verdade:

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script
# -- This is an empty migration.   ← saída vazia = alinhado
```

Rodado em 03/08: zero drift. Repita antes de cada deploy que mexa em schema;
**qualquer saída não vazia é drift**, pare e resolva antes de deployar.

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

**Banco de produção é a porta 5449.** Existe outro no mesmo host na porta
**5453** com as 5 migrations iniciais e tabelas vazias — migrado por engano, não
é usado por ninguém, limpe se quiser.

Scripts que tocam produção rodam com `npx tsx --env-file=.env <script>` — o
`.env` local já aponta para o banco de produção, e o `tsx` não carrega `.env`
sozinho.

---

## Pendências menores

- **Limites de plano não são aplicados em lugar nenhum.** É o item 2 da Opção B
  lá em cima; virou pendência de produto, não bug.
- O select **"Tipo de Dados"** da migração é coletado e **ignorado** pela rota —
  `/api/migration` decide tudo pelo parser do ERP. Ou o campo some, ou a rota
  passa a respeitá-lo.
- `/api/migration` só tem `POST`. O model `DataMigration` guarda status, totais
  e `completedAt`, mas não há `GET` nem tela de histórico.
- Os 3 toggles de `/dashboard/configuracoes/notificacoes` são decorativos —
  persistir exige coluna nova em `users`. Marcado com comentário `ponytail:`.
- O botão **"Alterar Senha"** em `/dashboard/configuracoes/seguranca` não faz
  nada. `/esqueci-senha` existe e funciona — ligar os dois é uma linha.
- **VAPID na Vercel** para web push de verdade. O resto do push já está feito.
- 3 testes falham em `NotificationBell.test.tsx` (formatação de tempo relativo),
  pré-existentes. Os outros 63 passam.
- Aviso de build: `middleware` está deprecado no Next 16, quer virar `proxy`
  (`npx @next/codemod@canary middleware-to-proxy .`). Agora que o arquivo só tem
  checagem de JWT, a migração ficou trivial — mas não é urgente.
- **Agenda está fora de escopo** pelo arquivo de metas. Se voltar depois do
  primeiro pagante, a opção barata é **visão derivada** de vencimentos de
  `FinancialTransaction` e entregas de `SalesOrder`, não entidade nova.
- "Mercado Pago" em integrações é integração que o *cliente* conecta no ERP,
  não provedor de cobrança. Não é resíduo.
- **MCP da Stripe autorizado**; **CLI da Vercel logada e projeto linkado**.
  Cuidado: `vercel env add` fora do diretório do projeto **falha em silêncio** —
  confira com `vercel env ls` depois de cada `add`.
- **Não persiga SEO.** O Orion compete no cluster "ERP" contra TOTVS, Omie,
  Bling e Conta Azul; em 90 dias não sai do zero. O canal do primeiro pagante é
  outbound, e SEO está fora de escopo no arquivo de metas.
- **Não comece módulo novo de ERP.** Explicitamente fora de escopo até 01/11 — e
  a auditoria acima é um convite forte a desobedecer isso. O caminho é cortar a
  promessa, não construir a feature.

---

## Histórico das sessões

**Sessão 6** — auditoria de planos × entregáveis (este documento). Nenhuma
mudança de código; o diff é só o HANDOFF. O achado é que Professional e
Enterprise vendem majoritariamente features inexistentes, que o produto é
single-user enquanto todo plano vende N usuários, que não existe upload apesar
dos GB anunciados, e que o system prompt da IA voltou a prometer NF-e.

**Sessão 5** — validação em produção: login com sessão real → `/dashboard`
(fechou o `a1eaf0a` da sessão 4, que subiu sem validação); gate de trial
exercitado nos dois caminhos pela primeira vez desde que existe; senha de
`admin@orion.com` rotacionada.

**Sessão 4** — G2.5 inteiro (produtos, prices, price IDs no banco, webhook e as
3 variáveis na Vercel, via MCP da Stripe + CLI da Vercel); NF-e fora dos planos
e do banco de produção; [appUrl()](src/lib/app-url.ts) em checkout, portal e
e-mails; gate de trial fail-closed e fora do proxy; senhas de admin fora do
seed; `features: {}` não é mais enviado por `/admin/planos` (apagaria os bullets
dos 3 planos); dois bugs de renderização em `/precos` (`{0 && …}` renderiza o
próprio zero em JSX — o Enterprise anunciava "-1 GB").

**Sessão 3** — `migracao` e `integracoes` desceram para `configuracoes/` com
redirects permanentes; as 4 âncoras do hub viraram páginas; submenu colapsável
na sidebar lendo de [src/lib/settings-nav.ts](src/lib/settings-nav.ts); ícone de
agenda (mock puro) removido.

### O que já se errou aqui, para não repetir

- **Deployar mudança de auth sem um request autenticado de verdade.** Foi assim
  que a sessão 4 deixou produção sem login: build e `tsc` não alcançam esse
  caminho.
- **`vercel env add` fora do diretório do projeto falha em silêncio.**
- **O seed usa `update: {}`.** Corrigir o seed **não** corrige produção. Toda
  mudança em planos precisa de script próprio, idempotente.

Verificação usada: `npx tsc --noEmit`, `npx next build`, `npx vitest run`.
`npm run smoke:auth` só se encostar em auth.
