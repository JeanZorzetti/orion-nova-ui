# Handoff — Orion Nova (03/08/2026)

Next.js 16 App Router, Prisma + PostgreSQL, NextAuth v5. O `vite` em
`node_modules` vem do vitest — não é build tool aqui.

Meta em vigor: **1º cliente pagante até 01/11/2026**, critérios em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

Sessão anterior: itens 1–7 do handoff velho entregues no commit `d687ffd`
(notificações reais no header, 404 em português, sidebar sticky com o usuário
logado, `/perfil/configuracoes`, e o `<SelectItem value="">` que derrubava o
form financeiro). Produção está de pé.

---

## O que fazer agora

Os 5 itens abaixo foram levantados **lendo o código**, não navegando a
produção. Onde o diagnóstico depende de comportamento em runtime está marcado.

Ordem sugerida por custo/benefício: **1 → 4 → 5 → 2/3**. O item 4 é o de maior
valor e o backend já existe. Os itens 2 e 3 precisam de uma decisão sua antes
de virar código.

### 1. Botão voltar do /precos

[src/app/precos/page.tsx:113](src/app/precos/page.tsx#L113) — `<Link href="/">`,
mesma classe do bug do `/perfil` já corrigido. Aqui é pior, porque `/precos` é
rota de usuário **logado** com frequência:

- o middleware redireciona para lá quando o trial expira
  ([src/middleware.ts:96](src/middleware.ts#L96) e
  [:106](src/middleware.ts#L106));
- notificações de trial linkam para lá
  ([src/lib/notifications.ts:44](src/lib/notifications.ts#L44) e
  [:105](src/lib/notifications.ts#L105));
- `/assinaturas`, `subscription-gate.tsx` e `subscription-banner.tsx` também.

Ou seja: o cliente com trial vencido é jogado na home de marketing quando
clica em "Voltar".

A página já é `"use client"` e já usa `useRouter`. O certo é decidir o destino
pela sessão (`useSession()` → `/dashboard` se logado, `/` se não).
**Não use `router.back()`**: quem chega por link de notificação ou e-mail não
tem histórico e o botão vira no-op.

### 2 e 3. `/dashboard/configuracoes/empresa` e `/dashboard/configuracoes/fiscal`

**Leia antes de linkar: as duas telas não salvam nada.**

[empresa/page.tsx:48](src/app/dashboard/configuracoes/empresa/page.tsx#L48) e
[fiscal/page.tsx:52](src/app/dashboard/configuracoes/fiscal/page.tsx#L52) têm
o mesmo `// TODO: Criar API para salvar...`. O submit só faz
`POST /api/user/onboarding` marcando o step como completo — e mesmo assim
exibe *"Configurações salvas!"*. Razão social, CNPJ, inscrição estadual,
regime tributário: tudo descartado.

Não existe onde guardar: o schema tem 24 models e **nenhum** `Company` /
`Organization`, e não há rota `/api/company`. Linkar essas telas no hub de
configurações hoje é expor dois formulários que mentem para o cliente.

**Decida antes de escrever código:**

- **(a) Criar `Company` + migration + `/api/company`.** É o caminho honesto.
  CNPJ e razão social são pré-requisito para emissão fiscal e para cobrar o
  primeiro pagante. Envolve migration — leia a seção de schema mais abaixo
  antes de encostar no Prisma.
- **(b) Linkar mesmo assim** e trocar o toast por um aviso honesto
  ("em breve"). Barato, mas mantém tela morta no produto.

Recomendo (a) para `empresa` e adiar `fiscal` (emissão de NF-e é escopo bem
maior que guardar os campos).

Detalhe que pega em qualquer um dos caminhos: os cabeçalhos dizem
**"Passo 2 de 5"** e **"Passo 3 de 5"**, e ao salvar a página empurra o usuário
para a etapa seguinte do onboarding
([empresa:69](src/app/dashboard/configuracoes/empresa/page.tsx#L69) → fiscal,
[fiscal:73](src/app/dashboard/configuracoes/fiscal/page.tsx#L73) →
`/dashboard/produtos/novo`). Se elas viram item de configurações, o subtítulo e
esse `router.push` têm que mudar, senão salvar uma configuração joga o cliente
no meio do onboarding.

### 4. `/dashboard/migracao` — o backend inteiro existe e a página não usa

**Maior valor da lista, e o mais barato do que parece.**

[/api/migration](src/app/api/migration/route.ts) está pronto e é sério: parseia
CSV, XLSX e JSON, aplica o parser do ERP de origem
([src/lib/migration/parsers.ts](src/lib/migration/parsers.ts)), cria `Customer`
e `Product` de verdade, e grava `DataMigration` com status, total, sucessos,
erros e `completedAt`.

A página **nunca chama essa rota**. O `<Input type="file">` da
[linha 180](src/app/dashboard/migracao/page.tsx#L180) não tem `onChange` nem
`ref` — o arquivo escolhido é descartado. O submit
([linha 46](src/app/dashboard/migracao/page.tsx#L46)) só marca o step do
onboarding e mostra *"Migração iniciada!"*.

Correção: guardar o `File` em estado, montar um `FormData` com `file` e
`sourceErp` e postar em `/api/migration`, exibindo o resultado que a rota já
devolve (`totalRecords`, `successRecords`, `errorRecords`, `errors`).

Dois ajustes que vêm junto:

- o toast promete *"você receberá uma notificação quando concluir"*, mas a rota
  é síncrona e responde com o resultado na hora. Ajuste o texto (ou crie a
  notificação de fato — o model `Notification` existe).
- `/api/migration` só tem `POST`. Não há histórico de migrações, embora o model
  guarde tudo. Um `GET` + lista é item separado, não bloqueia isto.

Importar Omie / Bling / Tiny / Conta Azul é argumento de venda direto contra os
concorrentes citados no arquivo de metas. Está a um formulário de distância.

### 5. `/dashboard/integracoes` — decorativa por inteiro

[src/app/dashboard/integracoes/page.tsx](src/app/dashboard/integracoes/page.tsx):
array de 6 integrações hardcoded, `selectedIntegrations` é `useState` local,
nada persiste, e o submit só marca o step do onboarding. Nenhuma das 6 tem
implementação em lugar nenhum do código.

**5.1 Tirar o WhatsApp:** remover o bloco `id: "whatsapp"`
([linhas 43-50](src/app/dashboard/integracoes/page.tsx#L43-L50)). Como
`categories` é derivado do próprio array
([linha 159](src/app/dashboard/integracoes/page.tsx#L159)), a categoria
"Comunicação" some sozinha — não há mais nada a mexer nesse arquivo.

Fora do dashboard, o WhatsApp continua sendo **prometido ao cliente**:

| Arquivo | O que diz |
|---|---|
| [features/page.tsx:163](src/app/features/page.tsx#L163) | card "WhatsApp Business — Integração com WhatsApp para atendimento" |
| [features/page.tsx:174](src/app/features/page.tsx#L174) | "Alertas por email, push e WhatsApp" |
| [solucoes/[slug]/page.tsx](src/app/solucoes/[slug]/page.tsx) | linhas 324, 357, 372, 417 — confirmação de consulta, depoimento, comunicados |

Decida o alcance: se a decisão é "não vamos ter integração com WhatsApp", esse
material de marketing está vendendo o que não existe e precisa sair junto. Já
[contato/page.tsx:58](src/app/contato/page.tsx#L58) e
[share-buttons.tsx:76](src/components/share-buttons.tsx#L76) são canal de
contato e botão de compartilhar — não são integração, podem ficar.

**Sobre a tela inteira:** ela promete 6 integrações e não entrega nenhuma. O
caminho barato é não linká-la no hub até existir uma integração real — ou
marcar todas como `available: false` ("Em Breve") e tirar a linguagem de
onboarding ("Etapa Opcional", "Pular Esta Etapa", "Concluir Onboarding").

### Sobre os 4 serem "órfãos"

Órfãos **do hub de configurações**, não do app: as quatro telas são alcançáveis
pelo onboarding
([OnboardingChecklist.tsx:57,65,97,106](src/components/onboarding/OnboardingChecklist.tsx#L57),
[onboarding-control.tsx:47,53,77,84](src/components/onboarding-control.tsx#L47))
e a migração também pelo [dashboard/page.tsx:275](src/app/dashboard/page.tsx#L275).

O que falta é entrada em `/dashboard/configuracoes`, cujo nav lateral
([linhas 76-112](src/app/dashboard/configuracoes/page.tsx#L76-L112)) só tem
Perfil / Notificações / Segurança / Sistema (âncoras `#` da própria página) e
API Keys (`<Link>`). Acrescentar 4 `<Link>` ali é diff de ~20 linhas — mas só
depois de resolver o que cada tela faz quando o usuário clicar em salvar.

---

## ⚠️ Leia antes de mexer no schema

Isto derrubou a produção uma vez e é fácil repetir. Vale para o item 2/3, que
pede model novo.

Alguém evoluiu `prisma/schema.prisma` com `prisma db push` e nunca gerou as
migrations. O banco ficou sem metade do ERP enquanto o schema dizia que estava
tudo lá; o Prisma Client gerava `SELECT` de colunas inexistentes e todo
endpoint respondia 500.

**`prisma migrate status` não detecta isso.** Ele compara migrations aplicadas
com os arquivos em `prisma/migrations/` — nunca compara o schema com o banco.
Dizia "Database schema is up to date!" o tempo inteiro.

O comando que revela a verdade:

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script
```

Saída vazia (`-- This is an empty migration.`) = alinhado. Qualquer outra coisa
= drift.

Regras:

- **Nunca `db push`** neste projeto. Sempre gere migration.
- Ao criar migration à mão, escreva o arquivo **sem BOM**. O
  `Out-File -Encoding utf8` do PowerShell 5.1 injeta BOM e o Postgres falha com
  `syntax error at or near "﻿"`. Use
  `[System.IO.File]::WriteAllText($p, $sql, (New-Object System.Text.UTF8Encoding($false)))`.
- Depois de mudar o schema, rode `npx prisma generate` local antes do seed,
  senão o client velho quebra com `P2022`.
- Mudar o schema exige **redeploy** para a Vercel regenerar o client.

**Banco de produção é a porta 5449.** Existe outro no mesmo host na porta
**5453** com as 5 migrations iniciais e tabelas vazias — migrado por engano,
não é usado por ninguém, limpe se quiser.

O fail-open em [src/middleware.ts](src/middleware.ts) (o `catch` que libera
acesso quando a consulta falha) foi o que manteve esse erro invisível por tanto
tempo — engolia a exceção do banco em toda request. Continua aberto.

`npm run smoke:auth` checa os guardas de rota sem cookie — rode depois de
qualquer mexida em auth.

---

## Pendências fora dos 5 itens

### Agenda (era o item 8 do handoff anterior)

Continua intocada, a pedido. Não existe nada: nenhum model de evento no schema,
nenhuma rota de API.
[src/components/calendar-dropdown.tsx](src/components/calendar-dropdown.tsx) é
mock puro e o "Ver agenda completa" não navega para lugar nenhum.

Antes de começar, decida se a agenda é entidade própria ou uma visão derivada
do que já existe (vencimentos de `FinancialTransaction`, entregas de
`SalesOrder`) — a segunda opção entrega valor sem model novo e cobre os
exemplos que o próprio mock inventou. Sendo feature nova, **use o fluxo Spec
Kit** se o projeto tiver `.specify/`.

### Segurança, em ordem de urgência

1. **`admin@orion.com` / `admin123` é `SUPER_ADMIN` em produção.** Troque a senha.
2. **A senha do Postgres vazou** num chat e é a mesma do usuário
   `jeanzorzetti@gmail.com` no seed. Rotacione.
3. **O Postgres aceita conexão da internet aberta com `sslmode=disable`.**
   Foi possível conectar de fora sem obstáculo, tráfego em claro.
4. O fail-open do middleware (seção acima).

### Pagamento (Stripe)

Os 3 planos existem no banco com `stripePriceId` nulo, então `POST /api/checkout`
responde `409`. Falta criar a conta Stripe em BRL, 1 Product por plano, colar os
price IDs em `/admin/planos` (o campo já existe) e configurar `STRIPE_SECRET_KEY`
(use restricted key `rk_`) e `STRIPE_WEBHOOK_SECRET` na Vercel. Detalhes em
[.env.example](.env.example).

### Menores

- **VAPID na Vercel** para web push de verdade. Hoje só existem `DATABASE_URL`,
  `NEXTAUTH_SECRET`, `AUTH_SECRET` e `NEXTAUTH_URL`. O resto do push já está
  implementado.
- Os 3 toggles da seção "Notificações" em `/dashboard/configuracoes` são
  decorativos — persistir exige coluna nova em `users`.
- 3 testes falham em `NotificationBell.test.tsx` (formatação de tempo relativo),
  pré-existentes. Os outros 60 passam.
- "Mercado Pago" em `dashboard/integracoes` e `features/page.tsx` é integração
  que o *cliente* conecta no ERP, não provedor de cobrança. Não é resíduo.
- README desatualizado: diz "60%" e marca auth e database como "em
  desenvolvimento", ambos entregues.
- MCP da Stripe não autorizado. Autorize via `claude mcp` numa sessão
  interativa ou trabalhe sem ele.
- **Não persiga SEO.** O Orion compete no cluster "ERP" contra TOTVS, Omie,
  Bling e Conta Azul; em 90 dias não sai do zero. O canal do primeiro pagante é
  outbound. Está fora de escopo no arquivo de metas.
