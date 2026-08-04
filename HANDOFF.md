# Handoff — Orion Nova (03/08/2026, sessão 7)

Next.js 16 App Router, Prisma + PostgreSQL, NextAuth v5. O `vite` em
`node_modules` vem do vitest — não é build tool aqui.

Meta em vigor: **1º cliente pagante até 01/11/2026**, critérios em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

Assunto aberto, em documento separado: **emissão de NF-e no modelo BYO** —
decisões, estado do código e próximos passos em
[HANDOFF-NFE-BYO.md](HANDOFF-NFE-BYO.md). Virou o **G8** no arquivo de metas em
03/08 e já tem código em produção: schema fiscal, tela de enquadramento e conexão
com a conta Focus NFe do cliente. **Emitir a nota a partir do pedido ainda não
existe.** O [HANDOFF-NFE.md](HANDOFF-NFE.md) anterior está superado.

---

## ✅ As duas env vars que faltavam — resolvidas na sessão 8

`RESEND_API_KEY` e `GROQ_API_KEY` estão em produção com valor real, e houve
redeploy. **O G3 não está mais bloqueado por e-mail.**

| Var | Estado | Prova |
|---|---|---|
| `RESEND_API_KEY` | ✅ ponta a ponta | `POST /api/auth/forgot-password` em produção enviou pela app e o Resend devolveu `last_event: delivered` (`ffe9afd1…`) |
| `GROQ_API_KEY` | ⚠️ configurada, **não exercitada logada** | A chave responde 200 em `api.groq.com/v1/models` e está no env de produção. O chat checa `auth()` **antes** da chave ([chat:264](src/app/api/ai/chat/route.ts) 401, [chat:273](src/app/api/ai/chat/route.ts) 500), então sem sessão não dá para distinguir. **Abra o chat logado para fechar isto.** |

O domínio `orion.roilabs.com.br` está **verificado** no Resend (região
`sa-east-1`, envio habilitado) — não é preciso reconfigurar DNS.

### 🪤 A armadilha que isto revelou: `vercel env ls` mostra a variável, nunca o valor

`GROQ_API_KEY` **aparecia na listagem** e mesmo assim a IA respondia 500: ela
tinha sido gravada como **string vazia**. `""` é falsy, então
`if (!GROQ_API_KEY)` disparava do mesmo jeito — com a var "presente". É pior que
faltar, porque a listagem diz que está tudo certo.

**Nunca conclua que uma env var está boa por ela aparecer no `env ls`.** Puxe o
valor:

```bash
vercel env pull /tmp/prod.env --environment=production --yes
grep -E "GROQ|RESEND" /tmp/prod.env      # valor vazio = quebrado
```

O `.env` local guardava o mesmo estrago por outro caminho: a linha do
`GROQ_API_KEY` **estava sem quebra de linha no fim** e o `ENCRYPTION_KEY` da
linha seguinte grudou nela, virando um valor único e inválido. Corrigido. Se um
segredo local parecer inexplicavelmente errado, rode `grep -n CHAVE .env | cat -A`
e olhe onde a linha realmente termina.

---

## ✅ O que a sessão 7 fez

A sessão 6 auditou e não mexeu em código. Esta executou as duas pontas: cortou
a promessa falsa e construiu o que restou de verdade.

### Os planos agora dizem a verdade — e diferenciam de verdade

| Plano | Preço | Usuários | Clientes | Produtos | IA/mês |
|---|---|---|---|---|---|
| Starter | R$ 89 | 2 | 500 | 200 | 100 |
| Professional | R$ 189 | 10 | 5.000 | 2.000 | 1.000 |
| Enterprise | R$ 349 | ∞ | ∞ | ∞ | ∞ |

**Cada número acima é aplicado por código** ([lib/account.ts](src/lib/account.ts))
nas rotas de criação. Antes nenhuma rota consultava o plano — os três eram o
mesmo sistema com preços diferentes.

Os planos não anunciam nenhum módulo que o Starter não tenha, **porque não
existe nenhum**. A diferenciação é volume. É pouco para R$ 349, e é honesto;
quando existir feature exclusiva, ela entra no card.

Preços antigos (249/599) foram trocados por **prices novos na Stripe** —
price da Stripe é imutável. Os ids estão no catálogo, junto do preço.

### Fonte única de planos

[prisma/plans.ts](prisma/plans.ts) é o catálogo, consumido pelo seed **e** por
[scripts/sync-plans.ts](scripts/sync-plans.ts). Mudou plano? Edite lá e rode:

```bash
npx tsx --env-file=.env scripts/sync-plans.ts --dry   # mostra o que mudaria
npx tsx --env-file=.env scripts/sync-plans.ts
```

Duas armadilhas já resolvidas dentro dele, não as reintroduza:

- O seed usa `update: {}` — corrigir o seed **não** corrige produção. Por isso
  o script existe. (Sucede o `strip-nfe-from-plans.ts`, que resolvia só a NF-e.)
- O Postgres reordena as chaves do `jsonb`, então comparar `JSON.stringify` cru
  acusa diferença sempre e o script reescreve tudo a cada execução. A
  comparação é canônica (chaves ordenadas, ordem de array preservada).
- Mudar `price` sem trocar `stripePriceId` **aborta o script**: seria o card
  anunciando um valor e a Stripe cobrando outro.

### Equipe — o buraco estrutural foi fechado

O produto era single-user enquanto todo plano vendia N usuários. A escolha de
design foi a barata: **`User.ownerId`**. Um membro aponta para o dono, e os
dados do ERP continuam gravados no id do dono — nenhuma das seis tabelas do ERP
precisou de migração de dados.

A peça central é `session.user.accountId`:

- `session.user.id` = **quem está logado**. Use para perfil, notificações, push.
- `session.user.accountId` = **de quem são os dados**. Use para clientes,
  produtos, vendas, financeiro, relatórios, dashboard.

Trocar um pelo outro é o bug mais fácil de cometer aqui: com `id` no lugar de
`accountId`, o membro abre o sistema vazio; com `accountId` no lugar de `id`,
ele edita o perfil do dono.

**A query que resolve o `accountId` fica dentro do `if (user)` do callback
`jwt`** ([lib/auth.ts](src/lib/auth.ts)) — esse ramo só roda no sign-in, que
acontece em route handler. O resto do callback roda também no proxy, onde o
Prisma não funciona. Não mova essa query para fora do `if`.

Quem tira o acesso de um membro removido é o
[dashboard/layout.tsx](src/app/dashboard/layout.tsx): o JWT dele continua
válido até expirar, e é lá que ele deixa de existir. O gate de trial no mesmo
arquivo passou a olhar o status **do dono** — membro não tem trial próprio.

Convite reaproveita o fluxo de redefinição de senha em vez de ter token
próprio. Tela em Configurações → Equipe.

### O que saiu do site

- **Prompt da Orion AI**: agora tem a lista exaustiva dos módulos reais e uma
  seção "O QUE O ORION NÃO FAZ". Ele afirmava, dentro do produto pago, que o
  sistema emite NF-e e faz conciliação bancária.
- **/features**: 17 features viraram os 6 módulos reais + a lista do que falta.
  A seção "+50 Integrações Disponíveis" saiu inteira — nenhuma existe.
- **/solucoes/[slug]**: 48 funcionalidades inventadas (PDV com NFC-e, prontuário
  eletrônico, TISS, roteirização por GPS, KDS, diário de classe) e **8
  depoimentos com nome, cargo e empresa fabricados**. Cada segmento agora tem
  uma seção "Onde o Orion não vai te atender", específica dele.
- **/precos**: banner anunciando 127 clientes (existem 0) e "preço vitalício com
  25% off" sem cupom que sustentasse; Pix e boleto anunciados num checkout que
  só aceita cartão.

---

## 🐛 Bugs achados no caminho (todos corrigidos)

1. **`POST /api/subscriptions` dava plano pago de graça.** Qualquer usuário
   logado podia criar `Subscription` com status `ACTIVE` e virar `ACTIVE` sem
   pagar nada. `PUT` trocava de plano sem pagar a diferença e `DELETE` marcava
   `CANCELED` só no banco — a Stripe seguia cobrando quem achou ter cancelado
   (o mesmo bug que matou `/api/subscriptions/cancel` no G1). **Nenhuma tela
   chamava os três.** Removidos; sobrou o `GET`.
2. **8 CTAs "Começar Grátis" apontavam para `/register`**, que não existe — a
   rota é `/cadastro`. Era o topo do funil inteiro caindo em 404.
3. **`/api/auth/forgot-password` nunca enviou e-mail.** Gravava o token,
   imprimia no console e respondia "link enviado". `sendPasswordResetEmail` já
   existia em `lib/email.ts`, sem nenhum chamador. (Continua sem sair enquanto
   faltar `RESEND_API_KEY` — ver o topo.)

---

## ⚠️ O que precisa ser validado à mão

Esta sessão mexeu em **auth** (`lib/auth.ts`, `dashboard/layout.tsx`) e o
histórico deste projeto diz o que acontece quando isso vai para produção sem um
request autenticado de verdade: foi assim que a sessão 4 derrubou o login.

`npx tsc`, `npx next build` e `npx vitest run` passam (87/90 — os 3 que falham
são os de `NotificationBell`, pré-existentes). `npm run smoke:auth` cobre só o
anônimo. **Nada disso alcança o caminho logado.**

Faça, nesta ordem, em produção:

1. **Login real.** Se cair em `/precos` ou em loop de redirect, o `accountId` do
   token é o suspeito — o fallback em `lib/auth.ts` cobre tokens antigos, mas
   deslogar e logar de novo é o teste limpo.
2. **Dashboard carrega com os dados de sempre.** Se aparecer vazio, alguma rota
   ficou com `session.user.id` onde devia ter `accountId`.
3. **Configurações → Equipe**: convide um e-mail seu. O usuário aparece como
   "aguardando definir a senha"; o link só chega depois da `RESEND_API_KEY`.
4. **Convidado loga e vê os mesmos dados.** É o teste que prova a feature.
5. **Remova o membro** e confirme que ele cai no login.
6. Só então **G3, a compra real** (abaixo).

Rollback é `git revert c75c6a2` + `npx tsx --env-file=.env scripts/sync-plans.ts`
com o catálogo anterior. As migrations são aditivas (duas colunas e uma FK) e
não precisam voltar.

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

O efeito "e-mail chegou" **deixou de ser bloqueio na sessão 8** — a
`RESEND_API_KEY` está em produção e um e-mail disparado pela própria app foi
entregue.

**⏸️ O G3 foi dispensado pelo dono em 04/08**: a mesma configuração de Stripe já
foi feita em outros projetos dele e faturava. **Não reabra como pendência.** O
que continua sem prova é o trecho do Orion depois do pagamento — webhook
gravando `ACTIVE`, gate de trial, portal —, que passa por código mexido na
sessão 7 e nunca exercitado logado. Ver a nota no
[roadmap](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

Se falhar no meio, o MCP da Stripe está autorizado: dá para ler o evento, a
Checkout Session e a subscription e comparar com o que o webhook gravou no
banco. Comece por `stripe_api_read` em `GetEvents`.

---

## ✅ Infraestrutura de cobrança — pronta e validada

Nada aqui precisa de trabalho. Está listado para você não reabrir.

| Item | Estado |
|---|---|
| 3 Products + prices BRL mensais | ✅ `prod_V0Rh7Z…` / `V0RhZE…` / `V0RhTI…` |
| Price IDs no catálogo e no banco | ✅ starter `price_1U0Qnx…` (89), professional `price_1U0Tib…` (189), enterprise `price_1U0Tig…` (349) |
| Webhook endpoint + 3 eventos | ✅ `we_1U0QoG…` → `/api/webhooks/stripe` |
| `STRIPE_WEBHOOK_SECRET` / `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_APP_URL` | ✅ Production, Sensitive |
| Rota de checkout, webhook idempotente (4 testes), portal | ✅ |
| Login em produção | ✅ sessão 5 — **revalidar, esta sessão mexeu em auth** |
| Gate de trial, nos dois caminhos | ✅ sessão 5 — idem |

Os prices de 249 e 599 continuam ativos na Stripe, sem plano apontando para
eles. Arquive quando quiser; nada os alcança pelo checkout.

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
**Não devolva banco para o proxy** — e é a mesma razão pela qual a query do
`accountId` fica no ramo de sign-in do callback `jwt`.

---

## ⚠️ Segurança — em ordem de urgência

1. **A senha do Postgres vazou** num chat e era a mesma do usuário
   `jeanzorzetti@gmail.com`. Saiu do repositório, mas **rotacionar no Postgres
   continua pendente** — é a credencial que dá acesso direto a tudo.
2. **O Postgres aceita conexão da internet aberta com `sslmode=disable`.**
   Foi possível conectar de fora sem obstáculo, tráfego em claro. Ainda aberto,
   e some junto com o item 1 se o banco parar de aceitar a internet inteira.
3. ~~Assinatura ACTIVE de graça por `POST /api/subscriptions`~~ — **fechado na
   sessão 7**, rota removida.
4. ~~`admin@orion.com` / `admin123`~~ — **fechado na sessão 5**.
5. ~~Fail-open no middleware~~ — **fechado (G6)**, pela raiz.
6. ~~O gate de trial nunca foi exercitado~~ — **fechado na sessão 5**.

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

Rodado em 03/08 depois das duas migrations desta sessão: zero drift. Repita
antes de cada deploy que mexa em schema; **qualquer saída não vazia é drift**,
pare e resolva antes de deployar.

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

- **Permissão por usuário não existe.** Todo membro de equipe vê tudo, inclusive
  o financeiro. Está dito no card, no prompt da IA e em `/features` — mas é a
  primeira coisa que um cliente com 10 usuários vai pedir.
- **O gate de export é de UI, não de segurança.** Os relatórios montam o CSV no
  cliente, com dados que ele já recebeu; esconder o botão não impede ninguém
  decidido. Vira gate de verdade quando a exportação for gerada no servidor.
  Hoje `canExport: true` nos 3 planos — a chave existe em
  [prisma/plans.ts](prisma/plans.ts) para o dia em que virar diferencial.
- **A cota de IA incrementa sem atomicidade** (read-modify-write). Duas
  mensagens simultâneas do mesmo usuário podem contar como uma. Marcado com
  `ponytail:` em [lib/account.ts](src/lib/account.ts).
- **API keys continuam sendo geradas e nunca verificadas** — nenhuma rota lê
  `x-api-key`. Nenhum plano vende API, então não é mais propaganda enganosa,
  mas a tela promete algo que não funciona.
- O select **"Tipo de Dados"** da migração é coletado e **ignorado** pela rota.
- `/api/migration` só tem `POST`. Sem `GET` nem tela de histórico.
- Os 3 toggles de `/dashboard/configuracoes/notificacoes` são decorativos.
- O botão **"Alterar Senha"** em `/dashboard/configuracoes/seguranca` não faz
  nada. `/esqueci-senha` agora envia e-mail de verdade — ligar os dois é uma
  linha.
- **VAPID na Vercel** para web push de verdade. O resto do push já está feito.
- 3 testes falham em `NotificationBell.test.tsx` (formatação de tempo relativo),
  pré-existentes. Os outros 87 passam.
- O ESLint do projeto **não roda**: falta `eslint-plugin-react-refresh` no
  `node_modules` e `npx eslint` aborta. Pré-existente.
- Aviso de build: `middleware` está deprecado no Next 16, quer virar `proxy`.
- **Agenda está fora de escopo** pelo arquivo de metas.
- "Mercado Pago" em integrações é integração que o *cliente* conecta no ERP,
  não provedor de cobrança. Não é resíduo.
- **MCP da Stripe autorizado**; **CLI da Vercel logada e projeto linkado**.
  Cuidado: `vercel env add` fora do diretório do projeto **falha em silêncio**.
- **Não persiga SEO.** Fora de escopo no arquivo de metas.
- **Não comece módulo novo de ERP.** Fora de escopo até 01/11.

---

## Histórico das sessões

**Sessão 7** — executou a auditoria da 6. Planos republicados em 89/189/349 com
limites aplicados por código pela primeira vez; equipe/multi-usuário construída
via `User.ownerId` + `session.user.accountId`; prompt da IA, `/features`,
`/solucoes` e `/precos` alinhados ao que existe; removidos 8 depoimentos
fabricados e o banner de 127 clientes. Três bugs de dinheiro/funil no caminho:
assinatura ACTIVE de graça, CTAs para rota inexistente, reset de senha que nunca
enviou e-mail. Descoberto que `GROQ_API_KEY` e `RESEND_API_KEY` nunca foram
configuradas em produção.

**Sessão 6** — auditoria de planos × entregáveis. Nenhuma mudança de código. O
achado é que Professional e Enterprise vendiam majoritariamente features
inexistentes, que o produto era single-user enquanto todo plano vendia N
usuários, que não existia upload apesar dos GB anunciados, e que o system prompt
da IA voltou a prometer NF-e.

**Sessão 5** — validação em produção: login com sessão real → `/dashboard`; gate
de trial exercitado nos dois caminhos pela primeira vez; senha de
`admin@orion.com` rotacionada.

**Sessão 4** — G2.5 inteiro (produtos, prices, price IDs no banco, webhook e as
3 variáveis na Vercel, via MCP da Stripe + CLI da Vercel); NF-e fora dos planos
e do banco de produção; [appUrl()](src/lib/app-url.ts) em checkout, portal e
e-mails; gate de trial fail-closed e fora do proxy; senhas de admin fora do
seed; dois bugs de renderização em `/precos` (`{0 && …}` renderiza o próprio
zero em JSX — o Enterprise anunciava "-1 GB").

**Sessão 3** — `migracao` e `integracoes` desceram para `configuracoes/` com
redirects permanentes; submenu colapsável na sidebar lendo de
[src/lib/settings-nav.ts](src/lib/settings-nav.ts).

### O que já se errou aqui, para não repetir

- **Deployar mudança de auth sem um request autenticado de verdade.** Foi assim
  que a sessão 4 deixou produção sem login: build e `tsc` não alcançam esse
  caminho. **A sessão 7 mexeu em auth de novo** — ver "O que precisa ser
  validado à mão".
- **`vercel env add` fora do diretório do projeto falha em silêncio.**
- **O seed usa `update: {}`.** Corrigir o seed **não** corrige produção. Toda
  mudança em planos passa por `scripts/sync-plans.ts`.
- **Publicar bullet sem rota que entregue.** Foi o que produziu a auditoria da
  sessão 6. Hoje `prisma/plans.test.ts` trava parte disso: assentos anunciados
  têm que bater com os aplicados, e plano mais caro não pode entregar menos.

Verificação usada: `npx tsc --noEmit`, `npx next build`, `npx vitest run`.
`npm run smoke:auth` só se encostar em auth — e ele **não** cobre o caminho
logado.
