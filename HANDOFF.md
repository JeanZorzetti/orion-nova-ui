# Handoff — Orion Nova (03/08/2026)

## Onde estamos

O Orion é um ERP em **Next.js 16 App Router** (não é Vite — o `vite` em
`node_modules` vem do vitest, só teste). Prisma + PostgreSQL, NextAuth v5, 24 models.

Meta em vigor: **1º cliente pagante até 01/11/2026** — critérios SMART completos em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md). Leia esse
arquivo antes de decidir qualquer coisa; ele define o que entra e o que não entra.

Decisão de 03/08/2026: **provedor de pagamento é a Stripe.** O Mercado Pago foi
removido do projeto por inteiro.

---

## ⚠️ Duas coisas antes de qualquer código

**1. O disco está cheio.** `C:` em 457G/457G, 0 bytes livres. Foi isso que abortou a
última edição desta sessão. Qualquer write vai falhar com `ENOSPC` até liberar
espaço. Resolver primeiro. (Um `du` para achar os ocupantes estourou 5 min — o disco
cheio deixou o I/O lento; talvez valha rodar por fora do agente.)

**2. Nada foi commitado.** Toda a migração para Stripe está no working tree, sem
commit. `git status` deve mostrar ~21 arquivos. Se algo parecer estranho, compare com
a lista da seção seguinte antes de assumir que está quebrado.

---

## O que esta sessão fez

Migração completa Mercado Pago → Stripe.

**Criados**
- `src/lib/stripe.ts` — client lazy (o build da Vercel roda sem a chave), + helpers
  `toSubscriptionStatus` / `grantsAccess`
- `src/app/api/checkout/route.ts` — Checkout Session `mode: "subscription"`
- `src/app/api/webhooks/stripe/route.ts` — único webhook de pagamento
- `src/app/api/billing/portal/route.ts` — Customer Portal
- `src/app/assinaturas/manage-button.tsx` — substitui o botão de cancelar
- `src/app/api/webhooks/stripe/__tests__/route.test.ts` — 4 testes

**Deletados**
- `src/lib/mercadopago.ts`
- `src/app/api/mercadopago/**`, `src/app/api/webhooks/mercadopago/`
- `src/app/api/checkout/create-preference/`
- `src/app/api/subscriptions/cancel/`
- `src/app/assinaturas/cancel-button.tsx`
- dependência `mercadopago` (entrou `stripe@22.4.0`)

**Editados**
- `.env.example` — vars da Stripe com as permissões exatas da restricted key
- `src/app/checkout/page.tsx`, `src/app/precos/page.tsx`, `src/app/assinaturas/page.tsx`
- `src/app/api/plans/route.ts` (saiu `mercadoPagoId`), `src/lib/schema.ts` (comentário)
- `vitest.config.ts` — ver "suíte de testes" abaixo

**Dois bugs de dinheiro fecharam junto:** o webhook antigo podia ativar a assinatura
do usuário errado (`findFirst` em qualquer order `PENDING` quando o
`external_reference` vinha em formato incompatível), e o cancelamento só marcava o
banco sem cancelar na operadora — o cliente seguia sendo cobrado depois de cancelar.

**Suíte de testes estava quebrada antes desta sessão** e ninguém tinha percebido:
`vitest.config.ts` importava `@vitejs/plugin-react` ausente do `package.json`,
faltava `@testing-library/dom`, e o vitest tentava rodar os specs do Playwright.
Nenhum teste rodava. Corrigido.

**Verificação registrada:** `npx tsc --noEmit` limpo. Webhook 4/4. Suíte completa 60
passaram / 3 falharam — as 3 são de `NotificationBell` (tempo relativo),
pré-existentes e sem relação com pagamento.

---

## Próximo passo

### 1. Liberar espaço em disco
Bloqueia tudo.

### 2. G2.5 — configurar a Stripe (é o que destrava a venda)
1. Conta Stripe da ROI Labs ativa em BRL
2. 3 Products (Starter, Professional, Enterprise), 1 Price recorrente mensal cada —
   **um Product por plano**, não um Product com 3 preços: a Checkout Session mostra o
   nome do Product em cada line item
3. Gravar o `stripePriceId` de cada um na tabela `plans` — o seed nunca preencheu, e
   sem isso `POST /api/checkout` responde `409 Plano sem preço configurado na Stripe`
4. `STRIPE_SECRET_KEY` — usar **restricted key** (`rk_`), não `sk_`. Permissões no
   `.env.example`. Na Vercel, marcar como Sensitive Environment Variable
5. Webhook em `https://orion.roilabs.com.br/api/webhooks/stripe`, eventos:
   `checkout.session.completed`, `customer.subscription.updated`,
   `customer.subscription.deleted`. O `whsec_` vai em `STRIPE_WEBHOOK_SECRET`
6. Local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### 3. G3 — uma compra real
Cartão pessoal, dinheiro real, produção. Registrar `payment_intent` e as evidências
no arquivo de metas. Reembolsar depois.

---

## Armadilhas conhecidas (não descubra de novo)

- **`src/middleware.ts` é fail-open.** Se a consulta ao banco falhar, o `catch` libera
  o acesso. É o G6, ainda aberto.
- **Colunas `mercadoPago*` continuam no schema** (`Plan`, `Subscription`, `Order`).
  Nulas e inofensivas; dropar exige migration. Deixadas de propósito.
- **"Mercado Pago" ainda aparece** em `dashboard/integracoes` e `features/page.tsx` —
  ali é integração que o *cliente* conecta no ERP, não o provedor de cobrança. Entra
  no G4, não é resíduo da migração.
- **README está desatualizado**: diz "60%", marca auth e database como "em
  desenvolvimento" (ambos entregues). É item do G4.
- **O MCP da Stripe não está autorizado.** Autorizar via `claude mcp` numa sessão
  interativa, ou trabalhar sem ele.
- **Não persiga SEO.** O Orion compete no cluster "ERP" contra TOTVS, Omie, Bling e
  Conta Azul — em 90 dias não sai do zero. O canal do primeiro pagante é outbound
  (G7). Está explicitamente fora de escopo no arquivo de metas.
