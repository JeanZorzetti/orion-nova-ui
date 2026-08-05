# Handoff — Suporte por ticket (Orion) + CRM multipipeline (ROI Hub)

Leia o [HANDOFF.md](HANDOFF.md) para o estado geral. Este documento cobre **duas
frentes em dois repositórios**:

| # | Frente | Repositório |
|---|---|---|
| 1 | Tela de ticket do cliente | `c:\dev\orion-nova-ui` |
| 2 | CRM multipipeline que recebe os leads da Orion | `C:\Users\jeanz\OneDrive\Desktop\ROI Labs\roihub` |

**Faça na ordem.** A frente 1 é pequena e fecha uma mentira que está no ar hoje;
a frente 2 é um módulo novo e depende de uma decisão de contrato que a frente 1
não tem.

O que acabou de entrar (sessão anterior): WhatsApp em todos os planos, com o
número em [src/lib/suporte.ts](src/lib/suporte.ts) — **vazio de propósito**.
Enquanto for `""`, o botão da sidebar e os contatos de `/contato` não
renderizam. Isso não bloqueia nada aqui. Ver
[HANDOFF-SUPORTE-WHATSAPP.md](HANDOFF-SUPORTE-WHATSAPP.md).

---

# Frente 1 — Suporte por ticket

## O estado real: falta uma tela, não um módulo

Isto **não** é construir suporte por ticket. Está quase tudo pronto e ninguém
percebeu:

| Camada | Onde | Estado |
|---|---|---|
| Modelo | [prisma/schema.prisma:368-417](prisma/schema.prisma) — `SupportTicket` + `TicketReply` | ✅ existe |
| Listar / criar / atualizar / apagar | [src/app/api/support/route.ts](src/app/api/support/route.ts) | ✅ existe |
| Detalhe e resposta | [src/app/api/support/[id]/route.ts](src/app/api/support/[id]/route.ts), [.../reply/route.ts](src/app/api/support/[id]/reply/route.ts) | ✅ existe |
| Painel do admin | [src/app/admin/suporte/page.tsx](src/app/admin/suporte/page.tsx) | ✅ existe |
| **Tela do cliente** | — | ❌ **não existe** |

O `GET /api/support` já escopa por usuário: quem não é `ADMIN`/`SUPER_ADMIN`
recebe só os próprios tickets ([route.ts:31-34](src/app/api/support/route.ts)).
A API já está pronta para o cliente — só ninguém a chama de lá.

**Por que isso é urgente e não cosmético:** "Suporte por ticket" é anunciado
como pronto em [features/page.tsx:145](src/app/features/page.tsx) e no prompt da
Orion AI ([chat/route.ts:127](src/app/api/ai/chat/route.ts)). É o padrão "bullet
sem rota que entregue" da auditoria da sessão 6, e é exatamente o defeito do G4:
o assistente dentro do produto pago afirmando algo que o cliente não consegue
fazer.

## O que fazer

1. **`/dashboard/suporte`** — lista dos tickets do usuário + botão "Abrir
   chamado". `GET /api/support` sem parâmetro já devolve os dele.
2. **`/dashboard/suporte/[id]`** — thread com as `replies` e caixa de resposta.
3. **Link na sidebar.** Ponha em [settings-nav.ts](src/lib/settings-nav.ts), ou
   como irmão do botão verde do WhatsApp no rodapé de
   [DashboardSidebar.tsx:191](src/components/DashboardSidebar.tsx). O que **não**
   pode é suporte ficar em dois lugares distantes: o cliente com problema procura
   um lugar só.

### Duas armadilhas na API que já está lá

**a) Há dois caminhos para responder um ticket.** `PUT /api/support` aceita
`reply` no corpo ([route.ts:220-247](src/app/api/support/route.ts)) e
`POST /api/support/[id]/reply` faz o mesmo. Dois caminhos para a mesma escrita é
um que vai divergir. **Use o `[id]/reply` na tela do cliente** e deixe o `PUT`
para o admin — não crie um terceiro.

**b) O `PUT` responde 200 sem fazer nada para não-admin.** `updateData` só é
preenchido dentro de `if (isAdmin)`
([route.ts:196-206](src/app/api/support/route.ts)), então um cliente que mande
`{ id, status: "CLOSED" }` recebe 200 e o ticket não muda. Não é falha de
segurança — é silêncio. Se a tela do cliente precisar de "reabrir" ou "fechar",
implemente explicitamente; não confie que o `PUT` recusa.

### O que falta além da tela: ninguém é avisado

`POST /api/support` cria o ticket e acaba. **Não manda e-mail, não cria
notificação.** Um chamado que ninguém vê é o mesmo defeito do número de WhatsApp
que não atende: um canal anunciado que não responde.

As duas peças existem e estão provadas em produção:

- [`sendEmail`](src/lib/email.ts) — `RESEND_API_KEY` está em produção com
  entrega comprovada.
- [`createGenericNotification`](src/lib/notifications.ts:322) — sino do
  dashboard.

Mínimo aceitável: e-mail ao admin quando o ticket nasce, e notificação ao
cliente quando a resposta é `isStaff`. Duas chamadas, nenhuma peça nova.

## Verificação (frente 1)

```bash
node node_modules/typescript/bin/tsc --noEmit    # `npx tsc` NÃO funciona aqui
npx vitest run
npx next build
```

`npx tsc` resolve o pacote errado e falha com "This is not the tsc command you
are looking for" — saída que passa fácil por sucesso. Use o caminho do binário.

Esperado: 3 testes de `NotificationBell` falham (pré-existentes), o resto passa.

**Critério real:** logue como cliente (não admin), abra um chamado, veja-o
aparecer em `/admin/suporte`, responda como admin e confira que o cliente vê a
resposta. Renderizar a lista não é o critério.

---

# Frente 2 — CRM multipipeline no ROI Hub

## 🔴 Leia antes de escrever qualquer coisa: o roihub não é um projeto vazio

`C:\Users\jeanz\OneDrive\Desktop\ROI Labs\roihub` é o painel SEO em produção em
`hub.roilabs.com.br`. Tem `CLAUDE.md` de 49 KB e `handoff.md` de 111 KB. **Leia
o CLAUDE.md dele antes de tocar em código.** As convenções abaixo são o que eu
apurei lendo o repositório, não o que se costuma fazer em Next:

| Convenção | Como é lá | O que **não** fazer |
|---|---|---|
| Banco | `pg` cru, `Pool` em [lib/db.ts](../roihub/lib/db.ts) | não instale Prisma |
| Schema | `CREATE TABLE IF NOT EXISTS` idempotente dentro de `ensure()`, em `lib/db.ts` | não crie ferramenta de migration |
| Nome de tabela | prefixo por domínio: `hub_*`, `seo_*` | use `crm_*` |
| CSS | `app/globals.css`, 312 linhas, classes à mão (`tab`, `foot`, `ag-check`) | **não há Tailwind** |
| Mutação | Server Actions (`app/agenda/actions.ts`) + `export const dynamic = "force-dynamic"` | não crie rota de API para o que é form |
| Config que muda pouco | JSON versionado em `data/` (`projects.json`) | — |

### ⚠️ A armadilha que vai te custar a sessão: o middleware barra tudo

[middleware.ts](../roihub/middleware.ts) põe **Basic auth em todas as rotas**
exceto `_next` e `favicon.ico`. O endpoint que a Orion vai chamar **vai tomar 401**
se você não o isentar.

O padrão para isso já existe no arquivo — `/api/seo/autopublish` é liberado por
`Authorization: Bearer $CRON_SECRET`. **Copie esse padrão** com um segredo
próprio (`CRM_INGEST_SECRET`); não reuse o `CRON_SECRET`, senão quem publica
artigo também grava lead.

### ⚠️ A segunda: teste novo não roda sozinho

O `test` do [package.json](../roihub/package.json) é uma **lista explícita de
arquivos**, não um glob. Um `test/crm.test.mjs` que você criar e não adicionar
ali nunca executa — e passa a impressão de estar coberto. Testes são
`node --test`, sem framework.

## O desenho

**Multipipeline com o mínimo:** as pipelines são configuração que muda quase
nunca; os leads são dados que chegam sozinhos. Separe assim:

- **`data/pipelines.json`** (versionado, à mão) — igual ao `projects.json` que já
  existe: `{ slug, nome, etapas: ["novo", "contato", "proposta", "ganho", "perdido"] }`.
  Uma pipeline por projeto (orion, atma, sirius…).
- **Postgres, tabelas `crm_*`** — só os leads e o histórico.

```sql
CREATE TABLE IF NOT EXISTS crm_leads (
  id BIGSERIAL PRIMARY KEY,
  external_id TEXT UNIQUE,          -- id gerado na origem; dedupe do reenvio
  pipeline TEXT NOT NULL,           -- slug do pipelines.json
  etapa TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  origem TEXT NOT NULL,             -- 'orion:contato', 'orion:trial', ...
  valor NUMERIC(12,2),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  criado TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS crm_eventos (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  de TEXT, para TEXT NOT NULL, nota TEXT,
  quando TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

`etapa` é validada **na escrita** contra o `pipelines.json` — sem FK, sem tabela
de etapas. Etapa que não existe no JSON é 400.

`crm_eventos` não é enfeite: sem ele "o lead está em proposta há quanto tempo?"
não tem resposta, e essa é a única pergunta que um CRM precisa responder melhor
que uma planilha.

**Aba** "CRM" em [app/tabs.tsx](../roihub/app/tabs.tsx), página `app/crm/`.

### O que deliberadamente não construir

| Não faça | Por quê |
|---|---|
| Kanban com drag-and-drop | um `<select>` de etapa por lead é um Server Action e resolve. Faça o kanban quando houver lead demais para uma lista |
| Contas de usuário / permissões | o hub tem Basic auth e **um** usuário |
| Campos customizáveis por pipeline | `metadata JSONB` já aceita qualquer coisa |
| Ferramenta de migration | contradiz o `ensure()` do repositório |

## O contrato de ingestão

```
POST /api/crm/leads
Authorization: Bearer $CRM_INGEST_SECRET
{ "external_id": "...", "pipeline": "orion", "nome": "...",
  "email": "...", "telefone": "...", "origem": "orion:contato",
  "metadata": { "empresa": "...", "assunto": "..." } }
```

`external_id` com `ON CONFLICT (external_id) DO NOTHING`: reenvio não duplica.
**Gere o `external_id` na Orion, por envio** — não use o e-mail como chave, ou o
mesmo lead voltando em seis meses vira um update silencioso de um registro
morto.

## O lado da Orion: o formulário de leads não envia nada

**Descoberto na sessão anterior, e é a fundação desta frente:** o formulário de
[/contato](src/app/contato/page.tsx#L114) é um `setTimeout` de 1,5 s que mostra
"Mensagem Enviada!" e **descarta os dados**. Não existe `/api/contact` — confira
a lista de `src/app/api/`. Todo lead do site público desde sempre foi perdido.

Então a Orion precisa de `POST /api/contact` que:

1. **Manda o e-mail primeiro**, com [`sendEmail`](src/lib/email.ts). É a cópia
   durável do lead e já está provada em produção.
2. **Depois** chama o roihub. Se o hub estiver fora, **logue e siga** — a
   requisição não pode falhar: o e-mail já garantiu que o lead existe. Um lead
   perdido porque o CRM estava reiniciando é pior que um lead sem card.

Não crie tabela de leads na Orion. O e-mail é o backup e o hub é o destino;
uma terceira cópia é a que vai ficar desatualizada.

## Verificação (frente 2)

```bash
cd "C:\Users\jeanz\OneDrive\Desktop\ROI Labs\roihub"
npm test                    # confira que o SEU arquivo aparece na saída
npx tsc --noEmit
npm run build
```

**Critério real:** com o servidor de pé, um `curl` com o Bearer certo cria o
lead; **o mesmo `curl` repetido não cria o segundo**; e sem o header vem 401 (é
o que prova que a isenção do middleware não abriu o hub inteiro).

---

## O que não fazer (as duas frentes)

1. **Não instale Prisma, ORM ou Tailwind no roihub.** Ele é `pg` cru e CSS à mão.
2. **Não reuse `CRON_SECRET`** para a ingestão de leads.
3. **Não deixe a chamada ao roihub falhar o `POST /api/contact` da Orion.**
4. **Não crie um terceiro caminho de resposta a ticket.** Já são dois.
5. **Não mexa em `price` no [prisma/plans.ts](prisma/plans.ts).** Mudar preço sem
   trocar `stripePriceId` aborta o `sync-plans.ts` de propósito.
6. **Não rode `scripts/sync-plans.ts`** enquanto `WHATSAPP_SUPORTE` estiver
   vazio: produção passaria a anunciar um canal sem número.
7. **Não comece módulo novo de ERP** — segue fora de escopo até 01/11.

## Contexto que você vai querer

- **G8 (NF-e/NFS-e) está parado** por falta de certificado A1. Ver
  [HANDOFF-NFE-BYO.md](HANDOFF-NFE-BYO.md).
- **G3 (compra real) foi dispensado** por decisão do dono — não reabra.
- `RESEND_API_KEY` e `GROQ_API_KEY` estão em produção e **provadas**.
- O roihub tem um `handoff.md` de 111 KB com o histórico dele. Se algo do que
  está aqui contradisser o que está lá, **o de lá vence** — é o repositório dele.
