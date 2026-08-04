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

> 🔴 **Bloqueado por env var.** `RESEND_API_KEY` nunca foi configurada na Vercel,
> então nenhum e-mail sai — e "e-mail de confirmação recebido" é um dos 5
> efeitos que o G3 exige. `GROQ_API_KEY` também falta, e sem ela a Orion AI
> responde 500 em produção, quebrando um bullet dos 3 planos. Ver o topo do
> [HANDOFF.md](../HANDOFF.md).

---

## G4 — Site diz a verdade sobre o produto ✅ (03/08/2026, sessão 7)

| | |
|---|---|
| **S** | Toda afirmação pública (landing, `/precos`, `/features`, `/solucoes`) corresponde a algo que existe e funciona hoje. O resto é removido ou marcado explicitamente como roadmap. |
| **M** | ✅ `/precos` lê de [prisma/plans.ts](../prisma/plans.ts), onde cada bullet tem um limite aplicado por [lib/account.ts](../src/lib/account.ts). `/features` são os 6 módulos reais + a lista do que falta. `/solucoes/[slug]` tem "Onde o Orion não vai te atender" por segmento. O prompt da Orion AI tem a seção "O QUE O ORION NÃO FAZ". `prisma/plans.test.ts` trava a regressão: assento anunciado = assento aplicado, e plano mais caro não entrega menos. |
| **Baseline** | 15 bullets inexistentes vendidos por até R$ 599/mês; 17 features anunciadas em `/features`; 48 por segmento em `/solucoes`; 8 depoimentos com nome e empresa fabricados; banner de "127 clientes" com 0 clientes. |
| **A** | Cortar a promessa, não construir a feature. Mais [scripts/sync-plans.ts](../scripts/sync-plans.ts), porque o seed usa `update: {}` e produção não muda sozinha. |
| **R** | Primeiro pagante que descobre feature inexistente pede reembolso e leva os 30 dias de permanência do G7 junto. |
| **T** | ~~07/09/2026~~ — **fechado 03/08/2026** |

**Falta ainda:** `README.md` (cita Mercado Pago, marca auth e database como "em
desenvolvimento" — ambos entregues — e declara "60%").

---

## G4.5 — Os planos diferenciam de verdade ✅ (03/08/2026, sessão 7)

| | |
|---|---|
| **S** | Quem paga mais recebe mais. Assentos, volume de cadastros e cota de IA aplicados por código, não escritos no card. |
| **M** | ✅ 89 / 189 / 349 com 2/10/∞ usuários, 500/5.000/∞ clientes, 200/2.000/∞ produtos, 100/1.000/∞ mensagens de IA. Barrado em `POST /api/team`, `/api/customers`, `/api/products` e `/api/ai/chat`, com 13 testes em `src/lib/__tests__/account.test.ts`. |
| **Baseline** | Nenhuma rota consultava o plano antes de criar nada: os 3 planos eram funcionalmente idênticos, e quem pagasse R$ 599 recebia o mesmo que quem pagasse R$ 89. |
| **A** | Exigiu fechar o buraco de multi-usuário antes (`User.ownerId` + `session.user.accountId`), porque todo plano vendia N usuários num produto single-user. |
| **R** | Sem isso não existe motivo para ninguém sair do plano mais barato — nem para acreditar na tabela. |
| **T** | **fechado 03/08/2026** |

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

## G8 — Emissão de NF-e por integração 🟡 em andamento (aberto 03/08/2026)

| | |
|---|---|
| **S** | O cliente clica "Emitir NF-e" num pedido da Orion e recebe DANFE + XML autorizados pela SEFAZ, sem sair do produto e sem criar conta em provedor nenhum. |
| **M** | 1 NF-e autorizada em homologação com CNPJ de teste, `NotaFiscal.status = AUTORIZADA` gravado por webhook (não por polling), `chaveAcesso` de 44 dígitos, DANFE e XML baixáveis pelo pedido. |
| **Baseline** | 0 campos fiscais em `Product` (nem NCM), `Company` sem regime tributário nem IE, `Customer` sem `indIEDest` nem código IBGE, nenhum model de nota fiscal. |
| **A** | Provedor: **PlugNotas (Tecnospeed)** — único dos avaliados com `POST /certificado` documentado, então a Orion repassa o `.pfx` e **não persiste certificado nenhum**. Nuvem Fiscal foi eliminada: serviço desativado em 31/07/2026. Focus NFe fica como plano B (preço por CNPJ não escala em SaaS). |
| **R** | Hoje o Professional (R$ 189) entrega o mesmo produto do Starter com mais volume. NF-e é o primeiro módulo exclusivo — e o primeiro custo marginal por uso, então entra **com cota por plano**, no mesmo mecanismo do `maxAiMessages`. |
| **T** | **28/09/2026** |

**Ordem:** ✅ schema fiscal + config da empresa → certificado A1 → campos em Product/Customer → rota de emissão + webhook → botão no pedido → homologação SEFAZ → cota + textos públicos (`/precos`, `/features`, prompt da IA).

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
- App mobile, IA além do que já existe

> **Decisão 03/08/2026 — "integrações fiscais" saiu de Fora de escopo.** Vira o
> G8 abaixo. Motivo: é o único módulo exclusivo que o Professional pode ganhar
> sem construir ERP do zero, porque o trabalho pesado é do provedor. Custo:
> 6-9 dias e o primeiro custo marginal por uso do produto. **Não desloca o G3** —
> a compra real continua sendo a prioridade, e o G8 não depende dela.
> Levantamento completo em [../HANDOFF-NFE.md](../HANDOFF-NFE.md).
