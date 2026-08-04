# Handoff — Suporte por WhatsApp em todos os planos (próxima sessão)

Leia o [HANDOFF.md](HANDOFF.md) para o estado geral e
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md) para as
metas. Este documento trata só de **suporte por WhatsApp**.

**O pedido, na íntegra:** suporte por WhatsApp para **todos os planos**, com um
**botão verde na sidebar** do dashboard.

Nada disto está feito. Não há código escrito para esta tarefa — é handoff de
levantamento, diferente do de NF-e.

---

## 🔴 Comece por aqui: não existe número de WhatsApp

`src/app/contato/page.tsx` publica **hoje, no site público**, um número
inventado:

```ts
// src/app/contato/page.tsx:58-61
title: "WhatsApp",
value: "(11) 9999-9999",
link: "https://wa.me/5511999999999",
```

E logo acima, `tel:+5511999999999`. São placeholders que passaram pela auditoria
da sessão 6 sem serem pegos — `9999-9999` não é número de ninguém.

**A primeira pergunta ao dono é qual é o número real.** Sem ele nada nesta
tarefa pode ser entregue: o botão da sidebar levaria ao mesmo lugar nenhum, e aí
o problema deixa de ser cosmético — passa a ser um plano pago prometendo um
canal de atendimento que não atende.

Enquanto o número não existir, **não publique o botão**. Um botão verde que abre
uma conversa com um número inválido é pior que a ausência dele.

---

## O que mudar, em ordem

| # | Passo | Onde |
|---|---|---|
| 1 | Número real em **um** lugar, importado pelo resto | novo `src/lib/suporte.ts` |
| 2 | Trocar o bullet de suporte nos **3** planos | [prisma/plans.ts](prisma/plans.ts) + `sync-plans.ts` |
| 3 | Botão verde na sidebar | [DashboardSidebar.tsx](src/components/DashboardSidebar.tsx) |
| 4 | Corrigir o número falso do site público | [contato/page.tsx](src/app/contato/page.tsx) |
| 5 | Alinhar os textos que afirmam o contrário | ver "andam no mesmo commit" |

### 1. Um lugar só para o número

Ele vai aparecer na sidebar, em `/contato`, em `/precos` (via `plans.ts`) e
provavelmente no prompt da IA. Quatro cópias de um número de telefone é como se
perde um.

```ts
// src/lib/suporte.ts
export const WHATSAPP_SUPORTE = "55DDNNNNNNNNN";       // só dígitos
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_SUPORTE}`;
```

Não vale env var: o número é público, aparece impresso na landing, e pôr em
`.env` só garante que uma das pontas vai ficar sem ele.

### 2. Os planos — e o detalhe que morde

Hoje o WhatsApp **já é vendido, só no Enterprise**:

| Plano | `support` hoje | Linha |
|---|---|---|
| Starter | `"E-mail (24-48h)"` | [plans.ts:66](prisma/plans.ts) |
| Professional | `"E-mail prioritário (8h úteis)"` | [plans.ts:98](prisma/plans.ts) |
| Enterprise | `"WhatsApp (horário comercial)"` | [plans.ts:125](prisma/plans.ts) |

O Professional também carrega `"Suporte prioritário em até 8h úteis"` dentro de
`modules` ([plans.ts:96](prisma/plans.ts)), e o Enterprise
`"Suporte por WhatsApp em horário comercial"` ([plans.ts:123](prisma/plans.ts)).
São **dois campos diferentes** dizendo a mesma coisa — mexa nos dois ou o card
vai se contradizer sozinho.

> ⚠️ **Dar WhatsApp a todos apaga um diferencial do Enterprise.** Ele já era o
> plano mais fraco em diferenciação (o [HANDOFF.md](HANDOFF.md) registra que a
> diferença entre planos é volume, não módulo), e o WhatsApp era um dos poucos
> itens exclusivos dele. Isso é decisão do dono e **já foi tomada** — está aqui
> só para você não "consertar" devolvendo a exclusividade. Se quiser preservar
> alguma gradação, o caminho é o SLA (ex.: todos têm WhatsApp, Enterprise tem
> prioridade), não tirar o canal.

**Depois de editar `plans.ts`, rode o script — o seed não resolve:**

```bash
npx tsx --env-file=.env scripts/sync-plans.ts --dry   # confira o diff
npx tsx --env-file=.env scripts/sync-plans.ts
```

O seed usa `update: {}`, então corrigir o seed **não** corrige produção. Isso
está no HANDOFF.md e já mordeu antes.

`prisma/plans.test.ts` trava regressões de plano (assento anunciado = aplicado,
plano mais caro não entrega menos). Rode `npx vitest run prisma/` depois.

### 3. O botão verde na sidebar

[DashboardSidebar.tsx](src/components/DashboardSidebar.tsx), 192 linhas. Os itens
de navegação são um array em [DashboardSidebar.tsx:25-31](src/components/DashboardSidebar.tsx#L25).

**Não adicione o WhatsApp nesse array.** Todo item dali é rota interna e recebe
estado ativo por `pathname` ([linha 80](src/components/DashboardSidebar.tsx#L80));
um link externo herdaria esse comportamento sem fazer sentido. O botão é outra
coisa — ponha **fora do `<ul>`**, no rodapé da sidebar.

Dois detalhes que o componente já impõe:

- **A sidebar colapsa** (`collapsed`). No estado colapsado só cabe o ícone —
  siga o que os itens de navegação já fazem, não invente um segundo padrão.
- Verde do WhatsApp é `#25D366`. Use o token do Tailwind do projeto se houver;
  não crie uma cor nova no `tailwind.config.ts` para um botão só.

`target="_blank"` + `rel="noopener noreferrer"`, e um `aria-label` explícito —
"Suporte por WhatsApp" —, porque colapsado o botão fica sem texto visível.

### 4 e 5. Os textos que andam no mesmo commit

Foi a lição do G4, que custou uma sessão inteira: **o assistente dentro do
produto pago negando algo que o cliente acabou de comprar.**

| Arquivo | O que tem hoje | O que fazer |
|---|---|---|
| [contato/page.tsx:58](src/app/contato/page.tsx) | número falso `5511999999999` (WhatsApp **e** `tel:`) | trocar pelo real, importando de `suporte.ts` |
| [precos/page.tsx:228](src/app/precos/page.tsx) | renderiza `features.support` | **muda sozinho** ao mexer em `plans.ts` |
| [api/ai/chat/route.ts:126](src/app/api/ai/chat/route.ts) | lista "Suporte por ticket" como ferramenta existente | acrescentar o WhatsApp; ver a ressalva abaixo |
| [features/page.tsx:145](src/app/features/page.tsx) | "Suporte por ticket" em `additionalFeatures` (= existe) | idem |

> 🐛 **Achado de passagem, não é o seu escopo mas é o mesmo assunto:**
> "Suporte por ticket" é anunciado como **pronto** em `/features` e no prompt da
> IA, mas `/api/support` só é consumido por
> [admin/suporte/page.tsx](src/app/admin/suporte/page.tsx). **O cliente não tem
> tela para abrir ticket.** A API existe, o painel do admin existe, a ponta do
> cliente não. É exatamente o padrão "bullet sem rota que entregue" da auditoria
> da sessão 6. O WhatsApp pode ser a resposta barata: se o canal real vira o
> WhatsApp, tire "Suporte por ticket" dos textos em vez de construir a tela.
> Decida isso com o dono — é uma frase de conversa e evita um módulo inteiro.

---

## Verificação antes de dizer que acabou

```bash
node node_modules/typescript/bin/tsc --noEmit    # `npx tsc` NÃO funciona aqui
npx vitest run
npx next build
```

**`npx tsc` resolve o pacote errado e falha com "This is not the tsc command you
are looking for" — saída que passa fácil por sucesso.** Custou uma afirmação
errada na sessão 8. Use o caminho do binário.

Esperado: 3 testes de `NotificationBell` falham (pré-existentes), o resto passa.

Confira o botão nos **dois** estados da sidebar (expandida e colapsada) e clique
nele de verdade — o critério é abrir a conversa no número certo, não renderizar.

---

## O que não fazer

1. **Não publique o botão sem o número real.** É o único bloqueio de verdade.
2. **Não devolva o WhatsApp como exclusividade do Enterprise.** Decisão tomada.
3. **Não mexa em `price` no `plans.ts`.** Mudar preço sem trocar `stripePriceId`
   **aborta** o `sync-plans.ts` de propósito — seria o card anunciando um valor e
   a Stripe cobrando outro.
4. **Não construa a tela de ticket do cliente** sem alinhar antes. Pode ser que
   o WhatsApp torne o ticket desnecessário.
5. **Não comece módulo novo de ERP** — segue fora de escopo até 01/11.

---

## Contexto que você vai querer

- **G8 (NF-e/NFS-e) está parado** por falta de certificado A1, medido contra a
  API da Focus. Ver [HANDOFF-NFE-BYO.md](HANDOFF-NFE-BYO.md). Não é sucessor
  desta tarefa.
- **G3 (compra real) foi dispensado** por decisão do dono — não reabra.
- `RESEND_API_KEY` e `GROQ_API_KEY` estão em produção e **provadas** (e-mail
  entregue, chat respondendo logado).
