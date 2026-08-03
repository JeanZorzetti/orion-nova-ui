# Meta 90 dias — Primeiro Cliente Pagante

**Definido em:** 03/08/2026
**Prazo final:** 01/11/2026
**Definição de "minimamente aceitável":** alguém que não é o Jean se cadastra, paga
pelo Mercado Pago e usa o ERP sem intervenção manual.

---

## North Star

> **1 assinatura `ACTIVE` paga por cliente externo, com pagamento aprovado no Mercado
> Pago e permanência ≥ 30 dias, até 01/11/2026.**

Tudo abaixo existe só para tornar essa frase possível. Meta que não move essa agulha
não entra nesta lista.

---

> **Decisão 03/08/2026 — provedor de pagamento: Stripe.** O Mercado Pago saiu do
> projeto (dependência, rotas e libs removidas). Custo: assinatura com renovação
> automática na Stripe funciona bem só no cartão — Pix e boleto não têm mandato
> recorrente. Se a perda de pagantes por falta de Pix se provar real, reabrir a
> decisão em G7.

## G1 — Um único caminho de pagamento ✅ (código pronto em 03/08/2026)

| | |
|---|---|
| **S** | Um único caminho de cobrança: 1 rota de checkout, 1 webhook, 1 portal. |
| **M** | ✅ `src/app/api/checkout/route.ts`, `src/app/api/webhooks/stripe/route.ts`, `src/app/api/billing/portal/route.ts`. Teste assere `Subscription.status === "ACTIVE"` para o `userId` do metadata. |
| **Baseline** | 2 rotas de checkout, 2 webhooks incompatíveis, 0 testes. |
| **A** | Removidos: `src/lib/mercadopago.ts`, `api/mercadopago/**`, `api/webhooks/mercadopago`, `api/checkout/create-preference`, `api/subscriptions/cancel`. |
| **R** | Fechou dois bugs de dinheiro: o webhook que ativava assinatura de usuário aleatório, e o cancelamento que marcava o banco sem cancelar na operadora (cliente seguia sendo cobrado). |
| **T** | ~~17/08/2026~~ — **fechado 03/08/2026** |

---

## G2 — Webhook autenticado e idempotente ✅ (código pronto em 03/08/2026)

| | |
|---|---|
| **S** | O webhook valida a assinatura da Stripe e processa o mesmo evento N vezes sem duplicar efeito. |
| **M** | ✅ 4 testes em `src/app/api/webhooks/stripe/__tests__/route.test.ts`: sem header → 400; assinatura inválida → 400 sem tocar no banco; ativação no usuário certo; 3 entregas do mesmo evento → 1 `Subscription` + 1 `Order`. |
| **Baseline** | 0 validação de assinatura, 0 idempotência, 0 teste. |
| **A** | `constructEventAsync` + upsert nas colunas `@unique` (`stripeSubscriptionId`, `stripeInvoiceId`). |
| **R** | A Stripe reenvia eventos por design. Sem idempotência, retry = ativação/cobrança duplicada. |
| **T** | ~~24/08/2026~~ — **fechado 03/08/2026** |

---

## G2.5 — Configuração da Stripe em produção 🔴 bloqueia G3

| | |
|---|---|
| **S** | Conta Stripe da ROI Labs ativa em BRL, 1 Product por plano (Starter, Professional, Enterprise), e o `stripePriceId` de cada um gravado na tabela `plans`. |
| **M** | `SELECT slug, "stripePriceId" FROM plans WHERE "isActive"` retorna 3 linhas, nenhuma nula. `POST /api/checkout` devolve URL da Stripe para os 3 planos. Endpoint de webhook criado no painel com os 3 eventos assinados. |
| **Baseline** | 0 products na Stripe, `stripePriceId` nulo nos 3 planos (o seed nunca preencheu), `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` não configuradas. |
| **A** | Painel da Stripe: 3 products + 3 prices recorrentes mensais em BRL. Usar **restricted key** (`rk_`), não secret key. Na Vercel, marcar as duas variáveis como Sensitive. |
| **R** | Sem isso o checkout responde `409 Plano sem preço configurado na Stripe` — falha explícita, mas ninguém compra. |
| **T** | **17/08/2026** |

---

## G3 — Uma compra real em produção

| | |
|---|---|
| **S** | Executar uma compra de verdade, com cartão pessoal e dinheiro real, em `orion.roilabs.com.br` — não test mode, não localhost. |
| **M** | Registrar neste arquivo: `payment_intent`, timestamp, e evidência dos 5 efeitos — e-mail de confirmação recebido, `Subscription.status = ACTIVE`, `/dashboard` destravado, Customer Portal abrindo em `/assinaturas`, reembolso concluído. Se qualquer um falhar, a meta não fechou. |
| **Baseline** | 0 transações reais. Nunca foi provado que produção cobra. |
| **A** | Plano Starter, uma tarde. Reembolsar em seguida pelo painel da Stripe. |
| **R** | Test mode esconde chave de produção errada, webhook secret errado e `NEXT_PUBLIC_APP_URL` errado nas `success_url`/`return_url`. Só a compra real prova. |
| **T** | **31/08/2026** |

---

## G4 — Site diz a verdade sobre o produto

| | |
|---|---|
| **S** | Toda afirmação pública (landing, `/precos`, `/features`, `/solucoes`) corresponde a algo que existe e funciona hoje. O resto é removido ou marcado explicitamente como roadmap. |
| **M** | Planilha com uma linha por afirmação → rota que a entrega → verificado/removido. 100% das linhas resolvidas, 0 promessa sem entrega. `README.md` atualizado (hoje cita Stripe em vez de Mercado Pago, marca auth e database como "em desenvolvimento" — ambos entregues — e declara "60%"). |
| **Baseline** | Prova social fabricada já removida em `94a6bdb`. Promessas de feature e README continuam desatualizados. |
| **A** | Leitura de 4 páginas + `grep` nas rotas. Meia tarde. |
| **R** | Primeiro pagante que descobre feature inexistente pede reembolso e não volta. Custa menos ser honesto antes. |
| **T** | **07/09/2026** |

---

## G5 — Primeiro uso entrega valor em ≤ 10 minutos

| | |
|---|---|
| **S** | Um usuário não-técnico, sozinho e sem instrução, cria conta e completa o ciclo básico: 1 cliente → 1 produto → 1 venda → 1 relatório. |
| **M** | 3 pessoas reais testando com cronômetro. Critério: **≥ 2 concluem em ≤ 10 min com 0 erro 500**. Anotar onde cada uma travou. |
| **Baseline** | Onboarding existe (`/dashboard/onboarding/welcome`, `api/sample-data`) e nunca foi medido com ninguém de fora. |
| **A** | Não requer código novo até rodar o teste. O teste é que diz o que consertar. |
| **R** | Trial que não entrega valor na primeira sessão não vira assinatura. |
| **T** | **14/09/2026** |

---

## G6 — Acesso confiável nas duas direções

| | |
|---|---|
| **S** | Ninguém que pagou perde acesso; ninguém que não pagou ganha. O erro que ocorrer é visível. |
| **M** | (a) `src/middleware.ts` deixa de liberar acesso quando a consulta ao banco falha (hoje é fail-open explícito no `catch`). (b) Taxa de 5xx < 0,5% das requisições em 7 dias. (c) 0 issue não triada no Sentry por 7 dias corridos. |
| **Baseline** | Middleware fail-open, Sentry instalado e sem rotina de triagem, taxa de erro nunca medida. |
| **A** | Trocar o `catch` por redirect para `/precos` + alerta; 15 min semanais de triagem no Sentry. |
| **R** | Nesta fase o produto tem 1 cliente. Uma hora de acesso quebrado é 100% da base afetada. |
| **T** | **21/09/2026** |

---

## G7 — Alguém chega

| | |
|---|---|
| **S** | Prospecção ativa em um nicho único de PME — escolhido e escrito aqui antes de 07/09. |
| **M** | 20 conversas registradas → ≥ 5 contas trial criadas por gente de fora → **≥ 1 assinatura paga ativa por ≥ 30 dias**. |
| **Baseline** | 0 cliques orgânicos, 0 trials externos, 0 pagantes. |
| **A** | Outbound direto. SEO no cluster "ERP" não produz resultado em 90 dias — não é o canal desta meta. |
| **R** | É a meta. As seis anteriores só garantem que a pessoa que chegar consiga pagar e ficar. |
| **T** | **01/11/2026** |

---

## Critério de kill

Em **01/11/2026**, com 0 pagante e < 3 trials externos: o Orion deixa de ser produto
e vira peça de portfólio — landing honesta, sem checkout, sem custo de manutenção. A
decisão é tomada nessa data, não adiada.

---

## Fora de escopo (até 01/11)

Nada disso aproxima o primeiro pagante e por isso não entra:

- Módulo novo de ERP (o que existe basta para provar a tese)
- Refatoração de arquitetura ou troca de stack
- SEO/GEO — cluster errado, horizonte errado
- i18n além do que já está pronto
- App mobile, integrações fiscais, IA além do que já existe
