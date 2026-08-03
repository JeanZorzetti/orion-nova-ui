# Handoff — Orion Nova (03/08/2026, sessão 2)

Next.js 16 App Router, Prisma + PostgreSQL, NextAuth v5. O `vite` em
`node_modules` vem do vitest — não é build tool aqui.

Meta em vigor: **1º cliente pagante até 01/11/2026**, critérios em
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md).

Sessão anterior (`5cbc72f`): as 4 telas órfãs foram ligadas a backend real —
`Company` + `/api/company`, migração postando em `/api/migration`, fiscal virou
aviso honesto, integrações viraram "Em Breve", e o hub de configurações ganhou
os 4 links. Detalhe no final deste arquivo.

---

## O próximo passo: a IA de configurações não bate com as URLs

Os 3 pontos abaixo são **o mesmo problema**, não três tarefas soltas. Vale a
pena ler os três antes de escrever qualquer linha, porque resolver o 1 do jeito
certo entrega o 2 e o 3 quase de graça.

### O diagnóstico

Na sessão passada, `migracao` e `integracoes` viraram itens de **Configurações**
no menu — mas continuaram morando em `/dashboard/migracao` e
`/dashboard/integracoes`, fora de `/dashboard/configuracoes/`.

O breadcrumb ([src/components/breadcrumbs.tsx](src/components/breadcrumbs.tsx))
é derivado **puramente do pathname** (linha 28: `pathname.split("/")`). Ele não
tem como inventar um nível que não existe na URL. Por isso a tela mostra
`🏠 > Migracao` em vez de `🏠 > Configurações > Migração de Dados`.

Repare que `empresa` e `fiscal` já mostram o caminho certo — porque essas duas
**estão** aninhadas em `/dashboard/configuracoes/`. O breadcrumb não está
quebrado; as URLs é que estão erradas.

### 1 e 2. Mover as duas rotas para baixo de `configuracoes`

```
src/app/dashboard/migracao/     → src/app/dashboard/configuracoes/migracao/
src/app/dashboard/integracoes/  → src/app/dashboard/configuracoes/integracoes/
```

Feito isso, o breadcrumb passa a renderizar o caminho certo **sem tocar no
componente**.

**Não resolva com um mapa de exceção no `breadcrumbs.tsx`.** É tentador (2
linhas), mas produz um breadcrumb cujo link "Configurações" aponta para uma
rota que não é pai da atual — mentira de hierarquia, exatamente a classe de
problema que a sessão passada removeu do produto.

Os 11 lugares que apontam para as URLs velhas (`rg "dashboard/(migracao|integracoes)" src`):

| Arquivo | Linha |
|---|---|
| [onboarding-control.tsx](src/components/onboarding-control.tsx#L77) | 77, 84 |
| [OnboardingChecklist.tsx](src/components/onboarding/OnboardingChecklist.tsx#L97) | 97, 106 |
| [vendas/novo/page.tsx](src/app/dashboard/vendas/novo/page.tsx#L224) | 224 (push do onboarding) |
| [migracao/page.tsx](src/app/dashboard/migracao/page.tsx#L118) | 118, 183 |
| [integracoes/page.tsx](src/app/dashboard/integracoes/page.tsx#L133) | 133 |
| [dashboard/page.tsx](src/app/dashboard/page.tsx#L275) | 275 |
| [configuracoes/page.tsx](src/app/dashboard/configuracoes/page.tsx#L131) | 131, 138 |

Nenhuma referência em `e2e/`. O middleware é prefixado em `/dashboard`
([middleware.ts:6](src/middleware.ts#L6)), então as rotas continuam protegidas
sem mexer em nada lá.

**Adicione redirects** em [next.config.ts](next.config.ts) (hoje não tem
nenhum) — notificações e links de onboarding já enviados apontam para as URLs
velhas:

```ts
async redirects() {
  return [
    { source: "/dashboard/migracao", destination: "/dashboard/configuracoes/migracao", permanent: true },
    { source: "/dashboard/integracoes", destination: "/dashboard/configuracoes/integracoes", permanent: true },
  ];
}
```

**Complete o `pathNameMap`** ([breadcrumbs.tsx:8](src/components/breadcrumbs.tsx#L8)).
Ele só tem 9 entradas e o fallback é `charAt(0).toUpperCase()`, que produz
`Migracao`, `Integracoes` e — já hoje, na tela de API Keys — `Api-keys`:

```ts
migracao: "Migração de Dados",
integracoes: "Integrações",
empresa: "Empresa",
fiscal: "Fiscal",
"api-keys": "API Keys",
```

**Sobrou linguagem de onboarding na migração.** Confirmado na tela de produção:
o subtítulo ainda diz *"Etapa Opcional - Importe dados do seu ERP anterior"*
([migracao/page.tsx:140](src/app/dashboard/migracao/page.tsx#L140)) e o botão
*"Pular Esta Etapa"* continua lá ([linha 263](src/app/dashboard/migracao/page.tsx#L263)).
A tela de integrações já foi limpa disso; a de migração ficou para trás. Como
agora ela é item de configurações, o subtítulo tem que virar algo neutro
("Importe clientes e produtos de outro ERP") e o "Pular" só faz sentido dentro
do onboarding.

### 3. Sobre o submenu colapsável na sidebar

**Sou a favor, com duas ressalvas — e só depois de mover as rotas.**

O motivo de ser a favor não é estética: depois do item 1/2, Configurações passa
a ter 5 sub-rotas reais e a sidebar vira o espelho exato da árvore de URLs. Se
você fizer o submenu **antes** de mover, o grupo "Configurações" vai listar
`/dashboard/migracao` — um filho que não é filho, o mesmo defeito do breadcrumb
com outra roupa.

**Ressalva 1 — não misture âncoras com rotas.** O hub de configurações tem 9
itens no nav lateral, mas só 5 são páginas
([configuracoes/page.tsx:76-142](src/app/dashboard/configuracoes/page.tsx#L76)):

- rotas reais: Empresa, Fiscal, Migração de Dados, Integrações, API Keys
- âncoras da própria página: `#perfil`, `#notificacoes`, `#seguranca`, `#sistema`

Só as 5 rotas entram no submenu da sidebar. Uma âncora `#perfil` clicada de
dentro de `/dashboard/configuracoes/empresa` não vai a lugar nenhum — o alvo
está em outra página.

**Ressalva 2 — a sidebar colapsa.** [DashboardSidebar.tsx:43](src/components/DashboardSidebar.tsx#L43)
tem `collapsed` (w-20, só ícones). Nesse estado não tente renderizar submenu
inline; o comportamento mais barato que funciona é: colapsada, clicar em
Configurações navega para o hub como hoje.

Consequência que vale aceitar junto: com o submenu na sidebar, **a coluna de
nav do hub vira duplicata** e pode ser deletada, deixando
`/dashboard/configuracoes` como página de conteúdo em coluna única. Menos código
e uma fonte só da navegação.

Se quiser o caminho mais barato de todos: **faça 1 e 2 e pare aí.** O bug
reportado é o breadcrumb; o submenu é conforto, e o hub já está a um clique.

### Ordem sugerida

1. Mover as duas pastas + atualizar as 11 referências + redirects no `next.config.ts`
2. Completar o `pathNameMap`
3. Limpar "Etapa Opcional" / "Pular Esta Etapa" da migração
4. (opcional) Submenu na sidebar + deletar a coluna de nav do hub

Verificação: `npx tsc --noEmit`, `npx next build`, e navegar as 5 sub-rotas
conferindo o breadcrumb. `npm run smoke:auth` só se encostar em auth.

---

## ⚠️ Pendência aberta da sessão passada — leia antes de deployar

**A migration `20260803120000_add_companies` está commitada mas nunca foi
aplicada em produção.** O `vercel-build` roda `prisma migrate deploy`, então ela
vai subir no próximo deploy.

Não havia `.env`/`.env.local` na máquina daquela sessão, então **o check de
drift obrigatório não foi executado**. Rode antes do próximo deploy:

```bash
npx prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script
```

Saída esperada, considerando que `add_companies` ainda não subiu: apenas o
`CREATE TABLE "companies"`. **Qualquer coisa além disso é drift** — pare e
resolva antes de deployar, senão a migration entra sobre um banco desalinhado.

---

## ⚠️ Leia antes de mexer no schema

Isto derrubou a produção uma vez e é fácil repetir.

Alguém evoluiu `prisma/schema.prisma` com `prisma db push` e nunca gerou as
migrations. O banco ficou sem metade do ERP enquanto o schema dizia que estava
tudo lá; o Prisma Client gerava `SELECT` de colunas inexistentes e todo
endpoint respondia 500.

**`prisma migrate status` não detecta isso.** Ele compara migrations aplicadas
com os arquivos em `prisma/migrations/` — nunca compara o schema com o banco.
Dizia "Database schema is up to date!" o tempo inteiro. O comando que revela a
verdade é o `migrate diff` da seção acima; saída vazia
(`-- This is an empty migration.`) = alinhado.

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
**5453** com as 5 migrations iniciais e tabelas vazias — migrado por engano,
não é usado por ninguém, limpe se quiser.

O fail-open em [src/middleware.ts](src/middleware.ts) (o `catch` que libera
acesso quando a consulta falha) foi o que manteve esse erro invisível por tanto
tempo — engolia a exceção do banco em toda request. Continua aberto.

---

## Pendências fora do próximo passo

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

### Agenda

Continua intocada, a pedido. Não existe nada: nenhum model de evento no schema,
nenhuma rota de API.
[src/components/calendar-dropdown.tsx](src/components/calendar-dropdown.tsx) é
mock puro e o "Ver agenda completa" não navega para lugar nenhum.

Antes de começar, decida se a agenda é entidade própria ou uma visão derivada
do que já existe (vencimentos de `FinancialTransaction`, entregas de
`SalesOrder`) — a segunda opção entrega valor sem model novo e cobre os
exemplos que o próprio mock inventou. Sendo feature nova, **use o fluxo Spec
Kit** se o projeto tiver `.specify/`.

### Menores

- O select **"Tipo de Dados"** da migração é coletado e **ignorado** pela rota —
  `/api/migration` decide tudo pelo parser do ERP. Ou o campo some, ou a rota
  passa a respeitá-lo. (Visível na tela: campo obrigatório que não faz nada.)
- `/api/migration` só tem `POST`. O model `DataMigration` guarda status, totais
  e `completedAt`, mas não há `GET` nem tela de histórico.
- **VAPID na Vercel** para web push de verdade. Hoje só existem `DATABASE_URL`,
  `NEXTAUTH_SECRET`, `AUTH_SECRET` e `NEXTAUTH_URL`. O resto do push já está
  implementado.
- Os 3 toggles da seção "Notificações" em `/dashboard/configuracoes` são
  decorativos — persistir exige coluna nova em `users`.
- 3 testes falham em `NotificationBell.test.tsx` (formatação de tempo relativo),
  pré-existentes. Os outros 60 passam.
- Aviso de build: `middleware` está deprecado no Next 16, quer virar `proxy`.
- "Mercado Pago" em integrações e `features/page.tsx` é integração que o
  *cliente* conecta no ERP, não provedor de cobrança. Não é resíduo.
- README desatualizado: diz "60%" e marca auth e database como "em
  desenvolvimento", ambos entregues.
- MCP da Stripe não autorizado. Autorize via `claude mcp` numa sessão
  interativa ou trabalhe sem ele.
- **Não persiga SEO.** O Orion compete no cluster "ERP" contra TOTVS, Omie,
  Bling e Conta Azul; em 90 dias não sai do zero. O canal do primeiro pagante é
  outbound. Está fora de escopo no arquivo de metas.

---

## Histórico: o que foi entregue em `5cbc72f`

1. **`/precos` voltar** — destino pela sessão (`useSession()` → `/dashboard` se
   logado, `/` se não). Sem `router.back()`: quem chega por link de notificação
   não tem histórico.
2. **`empresa`** — model `Company` (1:1 com `User`), migration
   `20260803120000_add_companies`, rota `/api/company` (GET + PUT upsert, zod).
   A tela carrega o que está salvo e ganhou campo CNPJ. Antes descartava razão
   social, CNPJ e endereço exibindo *"Configurações salvas!"*.
3. **`fiscal`** — adiada. O formulário morto saiu; virou aviso honesto de "em
   desenvolvimento" com link para Dados da Empresa. Emissão de NF-e é escopo
   próprio e não tem backend nenhum.
4. **`migracao`** — passou a postar em `/api/migration`, que já estava pronto e
   nunca era chamado (o `<Input type="file">` não tinha `onChange`). Resultado
   renderizado na própria tela.
5. **`integracoes`** — as 6 marcadas `available: false`, seleção e linguagem de
   onboarding removidas. Nenhuma tem implementação em lugar nenhum do código.
   WhatsApp saiu daqui e do marketing (`features/page.tsx`,
   `solucoes/[slug]/page.tsx`); `contato` e `share-buttons` ficaram, são canal
   de contato e botão de compartilhar.
6. **Hub de configurações** — 4 `<Link>` novos.
