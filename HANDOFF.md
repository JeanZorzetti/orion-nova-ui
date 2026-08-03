# Handoff — Orion Nova (03/08/2026, sessão 5)

Next.js 16 App Router, Prisma + PostgreSQL, NextAuth v5. O `vite` em
`node_modules` vem do vitest — não é build tool aqui.

Meta em vigor: **1º cliente pagante até 01/11/2026**, critérios em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

---

## 🎯 Comece por aqui: a compra real (G3)

O login **foi validado em produção na sessão 5** — o passo 1 do handoff
anterior está fechado, não repita. Sessão real em `orion.roilabs.com.br`,
credenciais reais, caiu no `/dashboard` com o onboarding abrindo. O conserto
`a1eaf0a` (gate fora do proxy) funciona. Nada de código pendente aqui.

E o gate foi exercitado nos dois caminhos, também pela primeira vez —
`subscriptionStatus='EXPIRED'` no banco redirecionou para
`/precos?trial=expired&from=/dashboard` no request seguinte, e o valor foi
revertido para `TRIAL`. O item 5 de segurança ("o gate nunca rodou") está
fechado: ele roda, e nos dois sentidos.

Ou seja: **a compra é a única coisa entre o estado atual e a meta.** Ela exige
cartão de verdade, então é sua — nenhum agente fecha esse passo.

### O passo que falta — a compra real (G3)

É a única coisa entre o estado atual e a meta. Nada de test mode, nada de
localhost:

1. Logado, em `/precos`, assine o **Starter** (R$ 89) com cartão de verdade
2. Confirme os 5 efeitos: e-mail chegou · `Subscription.status = ACTIVE` ·
   dashboard destravado · portal abrindo em `/assinaturas` · reembolso
3. Registre `payment_intent` + timestamp em
   [roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md) e
   reembolse pelo painel

Se falhar no meio, o MCP da Stripe está autorizado: dá para ler o evento, a
Checkout Session e a subscription e comparar com o que o webhook gravou no
banco. Comece por `stripe_api_read` em `GetEvents`.

---

## ✅ Histórico: o que quebrou o login (resolvido e validado)

Mantido porque explica por que o gate mora onde mora — e por que **não se
devolve banco para o proxy**. O bug em si acabou.

**Sintoma:** todo login terminava em
`/precos?erro=indisponivel&from=%2Fdashboard`.

**Não era o banco.** As três medidas que descartam isso, todas de 03/08:
o banco respondeu a query direto da máquina; `GET /api/plans` em produção
devolveu 200 pela mesma conexão; e o usuário barrado estava `ACTIVE` com
`trialEndsAt: null` — nenhum ramo da checagem de trial redirecionaria ele. Só o
`catch` podia produzir aquele redirect.

**A causa:** a query do Prisma **dentro do proxy** (`src/middleware.ts`) falha,
enquanto a query idêntica funciona nas rotas de API. Não é runtime de Edge — no
Next 16 o proxy já roda em Node.js por padrão; o mais provável é o engine do
Prisma não ir junto no bundle do proxy. **A causa exata nunca foi lida num log**,
porque `vercel logs` só transmite eventos novos e ninguém conseguia reproduzir
enquanto o stream rodava. Se precisar do erro literal: deixe
`npx vercel logs <url-do-deploy>` rodando e faça login noutra janela.

**E o detalhe que importa:** essa query falha **desde sempre**. O `catch`
antigo era fail-open, então engolia o erro em 100% dos requests — o gate de
trial nunca rodou uma vez em produção. Trocar o fail-open por fail-closed (G6)
não criou o bug, só parou de escondê-lo. O HANDOFF anterior dizia que o
fail-open "manteve invisível a queda de produção"; era mais literal do que
parecia, a queda que ele escondia era a dele mesmo.

**O conserto (`a1eaf0a`):** o gate saiu do proxy e foi para o
[dashboard/layout.tsx](src/app/dashboard/layout.tsx), server component que roda
onde o Prisma comprovadamente funciona, **sem try/catch** — se o banco cair, o
erro aparece em vez de liberar acesso calado. O proxy ficou só com as checagens
de JWT e não importa mais o Prisma. **Não devolva banco para o proxy.**

**Validado em produção na sessão 5**, com sessão real: login cai no
`/dashboard`, e um usuário `EXPIRED` cai em `/precos?trial=expired`. Se algum
dia voltar a redirecionar sem motivo, cheque no banco o `subscriptionStatus` do
usuário antes de culpar o código — o layout só redireciona quem está
`EXPIRED`/`CANCELLED` ou com trial vencido **e** sem subscription `ACTIVE`.

---

## Histórico: por que a Orion não conseguia receber dinheiro

O caminho do dinheiro **já estava escrito e testado**. G1 e G2 fecharam em
03/08: existe uma rota de checkout
([api/checkout/route.ts](src/app/api/checkout/route.ts)), um webhook autenticado
e idempotente com 4 testes
([webhooks/stripe](src/app/api/webhooks/stripe/__tests__/route.test.ts)) e um
portal de billing. O código estava pronto.

O que faltava não era código: os 3 planos estavam com `stripePriceId` nulo e as
chaves da Stripe não existiam na Vercel, então
[api/checkout/route.ts:33](src/app/api/checkout/route.ts#L33) respondia `409
Plano sem preço configurado na Stripe` para qualquer plano. Era o G2.5, e ele
bloqueava todo o resto.

### 1. Configurar a Stripe (G2.5) — ✅ **fechado em 03/08**

Feito na sessão 4, via MCP da Stripe e CLI da Vercel:

| Item | Estado |
|---|---|
| 3 Products + prices BRL mensais | ✅ `prod_V0Rh7Z…` / `V0RhZE…` / `V0RhTI…` |
| Price IDs nos planos do banco | ✅ starter `price_1U0Qnx…`, professional `price_1U0Qo1…`, enterprise `price_1U0Qo3…` |
| Webhook endpoint + 3 eventos | ✅ `we_1U0QoG…` → `/api/webhooks/stripe` |
| `STRIPE_WEBHOOK_SECRET` na Vercel | ✅ Production, Sensitive |
| `NEXT_PUBLIC_APP_URL` na Vercel | ✅ Production |
| `STRIPE_SECRET_KEY` (`rk_live_…`) na Vercel | ✅ Production, Sensitive |
| Deploy com as 3 variáveis | ✅ |

**A conta usada é a `acct_1SjN4c` ("Sirius")**, não uma conta ROI Labs separada —
decisão de 03/08 para não travar o G2.5 na verificação de uma conta nova. Ela
liquida em BRL e já hospeda 5 outros produtos em produção. Os produtos do Orion
têm `metadata.app = "orion"` e `statement_descriptor = "ORION ERP"`, então a
fatura do cliente não vai dizer "SIRIUS".

A restricted key foi criada à mão no painel — é o único passo sem API (a Stripe
não expõe endpoint para criar chave de API, e o OAuth do MCP autoriza as
chamadas do agente, não a aplicação em runtime). Se precisar refazer:
[Dashboard → API keys](https://dashboard.stripe.com/acct_1SjN4cD6GTFfNAq4/apikeys)
→ Create restricted key, permissões em [.env.example:13](.env.example#L13).

Preflight feito com a chave real: `POST /v1/checkout/sessions` com o price do
Starter devolveu `cs_live_…`, `livemode: true`, `total: 8900 brl` — depois
expirada. Prova que a chave tem Checkout Sessions write e Prices read. O que
**não** foi exercitado é o caminho autenticado do próprio app: isso é a compra
real do G3, abaixo.

A armadilha do `NEXT_PUBLIC_APP_URL` está desarmada duas vezes: a variável foi
configurada na Vercel **e** checkout e portal passaram a usar
[appUrl()](src/lib/app-url.ts), que tenta `NEXT_PUBLIC_APP_URL` → `NEXTAUTH_URL`
→ `VERCEL_PROJECT_PRODUCTION_URL` antes de cair em `http://localhost:3000`.
Antes disso o pagamento era aprovado e o cliente jogado numa URL morta.

Verificação em produção (`GET https://orion.roilabs.com.br/api/plans`, 03/08):
os 3 planos com `stripePriceId` preenchido, 5/7/8 bullets e nenhuma menção a
NF-e. É o comando mais barato para conferir tudo de uma vez se algo parecer
errado depois.

### 2. Uma compra real (G3) — **é o passo 2 lá do topo**

Cartão pessoal, dinheiro real, em produção — não test mode, não localhost. O
test mode esconde exatamente as três coisas que quebram aqui: chave de produção
errada, webhook secret errado e `success_url` apontando para localhost.

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

1. ~~`strip-nfe-from-plans.ts` no banco~~ — ✅ 03/08, idempotente
2. ~~Stripe + variáveis na Vercel~~ — ✅ 03/08, G2.5 inteiro
3. ~~Confirmar o login~~ — ✅ sessão 5, com sessão real em produção
4. **Comprar** — é o bloco no topo deste arquivo, e exige cartão de verdade
5. Só então G5 (3 pessoas reais cronometradas) e G7 (outbound)

**Não comece módulo novo de ERP.** Está explicitamente fora de escopo até
01/11 — o que existe basta para provar a tese, e o gargalo não é feature.

---

## ⚠️ Segurança — em ordem de urgência

1. **A senha do Postgres vazou** num chat e era a mesma do usuário
   `jeanzorzetti@gmail.com`. Saiu do repositório, mas **rotacionar no Postgres
   continua pendente** — e agora é o item mais urgente da lista, porque é a
   credencial que dá acesso direto a tudo.
2. **O Postgres aceita conexão da internet aberta com `sslmode=disable`.**
   Foi possível conectar de fora sem obstáculo, tráfego em claro. Ainda aberto,
   e some junto com o item 1 se o banco parar de aceitar a internet inteira.
3. ~~`admin@orion.com` / `admin123` em produção~~ — **fechado na sessão 5.** A
   senha foi rotacionada por `UPDATE` com hash bcrypt (18 bytes aleatórios,
   entregues fora do repositório); `bcrypt.compare("admin123", …)` agora dá
   `false`. O seed já não recriava a senha antiga — quem sobrava era a linha
   que já existia no banco, e ela foi corrigida.
4. ~~Fail-open no middleware~~ — **fechado (G6)**, e pela raiz: o gate saiu do
   proxy e foi para o [dashboard/layout.tsx](src/app/dashboard/layout.tsx), sem
   `catch`. Se o banco cair, o erro aparece em vez de liberar acesso calado.
5. ~~O gate de trial nunca foi exercitado~~ — **fechado na sessão 5**, nos dois
   caminhos e em produção: usuário válido entra no `/dashboard`, usuário
   `EXPIRED` cai em `/precos?trial=expired&from=/dashboard`. A evidência deixou
   de ser "compilou".

---

## ✅ Pendência de deploy — resolvida em 03/08

A migration `20260803120000_add_companies` **foi aplicada** e o check de drift
finalmente rodou (existe `.env` na máquina agora):

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script
# -- This is an empty migration.
```

Saída vazia = banco e `schema.prisma` alinhados, zero drift. Repita este comando
antes de cada deploy que mexa em schema; **qualquer saída não vazia é drift**,
pare e resolva antes de deployar.

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
  pré-existentes. Os outros 63 passam.
- Aviso de build: `middleware` está deprecado no Next 16, quer virar `proxy`
  (`npx @next/codemod@canary middleware-to-proxy .`). Agora que o arquivo só tem
  checagem de JWT, a migração ficou trivial — mas não é urgente.
- "Mercado Pago" em integrações e `features/page.tsx` é integração que o
  *cliente* conecta no ERP, não provedor de cobrança. Não é resíduo.
- **MCP da Stripe autorizado** (`claude mcp add --transport http stripe
  https://mcp.stripe.com/`, OAuth). `stripe_api_read`/`stripe_api_write` cobrem
  qualquer método REST — foi assim que produtos e webhook nasceram. Mantenha a
  confirmação humana das tools ligada: `stripe_api_write` é escrita irrestrita.
- **CLI da Vercel logada e projeto linkado**, então `vercel env add` e `vercel
  --prod` funcionam daqui. Cuidado: fora do diretório do projeto o comando falha
  dizendo que o codebase não está linkado — e é fácil não perceber. Confira com
  `vercel env ls` depois de cada `env add`.
- **Não persiga SEO.** O Orion compete no cluster "ERP" contra TOTVS, Omie,
  Bling e Conta Azul; em 90 dias não sai do zero. O canal do primeiro pagante é
  outbound, e SEO está fora de escopo no arquivo de metas.

---

## Histórico: o que a sessão 5 entregou

Sessão de validação, não de código — o diff é só este arquivo. As mudanças
reais foram no banco de produção e o que se ganhou foi evidência.

1. **Login validado em produção** com sessão real (`orion.roilabs.com.br`,
   navegador, credenciais reais) → `/dashboard`. Era a única entrega da sessão
   4 sem validação, e o `a1eaf0a` passou.
2. **Gate de trial exercitado nos dois caminhos** — `EXPIRED` no banco →
   `/precos?trial=expired&from=/dashboard`; revertido para `TRIAL` em seguida.
   Primeira execução real do gate desde que ele existe.
3. **Senha de `admin@orion.com` rotacionada** — `admin123` não vale mais em
   produção, verificado com `bcrypt.compare`.
4. **Banco conferido** contra o que o handoff afirmava: 3 planos com
   `stripePriceId` preenchido, 5/7/8 bullets, zero menção a NF-e; nenhum
   usuário com subscription `ACTIVE` (ninguém pagou ainda, como esperado).

O que **não** foi feito, e por quê: a compra do G3 exige cartão de crédito
real. Nenhum agente fecha esse passo — é a única coisa que sobrou.

## Histórico: o que a sessão 4 entregou

1. **NF-e fora dos planos** — bullets e `nfeLimit` removidos do
   [seed](prisma/seed.ts) + [scripts/strip-nfe-from-plans.ts](scripts/strip-nfe-from-plans.ts)
   para as linhas que já estão em produção (com teste).
2. **`features: {}` não é mais enviado por `/admin/planos`** — `{}` passa no
   `features &&` do PATCH e apagaria os bullets dos 3 planos no exato momento em
   que você fosse colar os price IDs da Stripe.
3. **[appUrl()](src/lib/app-url.ts)** em checkout, portal e links de e-mail de
   notificação (esse último montava `undefined/...` hoje).
4. **Gate de trial fail-closed e fora do proxy** (`a1eaf0a`) — o caminho todo
   está em "O que quebrou o login", no topo. **É a única entrega da sessão que
   não foi validada em produção**, porque exige uma sessão logada.
5. **Senhas de admin saíram do seed** — `SEED_ADMIN_PASSWORD` /
   `SEED_OWNER_PASSWORD`, documentadas no [.env.example](.env.example).
6. **G2.5 inteiro, via MCP da Stripe + CLI da Vercel** — produtos, prices, price
   IDs no banco, webhook endpoint e as 3 variáveis de ambiente. Só a criação da
   restricted key foi manual, por não existir API para isso.
7. **NF-e removido do banco de produção** e **check de drift executado** (vazio).
8. **Dois bugs de renderização em `/precos`** — o Enterprise anunciava "-1 GB de
   armazenamento" e o Starter mostrava um "0" solto, porque `{0 && …}` renderiza
   o próprio zero em JSX. Ambos estavam na página que o cliente usa para comprar.

### O que a sessão 4 errou, para não repetir

- **O fail-closed foi deployado sem nunca ter sido exercitado com uma sessão
  logada.** O `catch` estava a um request de distância de ser testado e não foi;
  o resultado foi produção sem login. Mudança em middleware/proxy precisa de um
  request autenticado de verdade antes de subir — build e `tsc` não alcançam
  esse caminho.
- **`vercel env add` rodado fora do diretório do projeto falhou em silêncio.** A
  variável não entrou e o erro só apareceu no `env ls` seguinte. Sempre conferir.

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
