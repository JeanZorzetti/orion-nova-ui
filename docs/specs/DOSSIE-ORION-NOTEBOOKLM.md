# Dossiê Executivo — Orion ERP (`orion-nova-ui`)

> **Documento-fonte para geração de Spec de Produto e Master Prompt de execução.**
> Contém o escopo real, a arquitetura, o design system vigente, o inventário de
> componentes, os fluxos existentes e as dívidas conhecidas de UX. Tudo aqui foi
> apurado no código em 16/08/2026, não em documentação de intenção.
>
> Regra de leitura: quando este documento contradisser o `README.md` do projeto,
> **este vence**. O README está desatualizado (declara "60%", cita Mercado Pago,
> marca auth e banco como pendentes — todos já entregues).

---

## 1. Identificação

| Campo | Valor |
|---|---|
| Produto | **Orion ERP** — ERP web para PMEs brasileiras |
| Repositório | `orion-nova-ui` (main única, deploy contínuo) |
| Produção | `orion.roilabs.com.br` (Vercel) |
| Estágio | Produto no ar, funcional, **0 clientes pagantes** |
| Idioma primário | pt-BR (i18n com en-US pronto via `next-intl`) |
| Time | 1 desenvolvedor (solo) |
| Data do levantamento | 16/08/2026 |

---

## 2. Objetivo de negócio (contexto para HEART)

### North Star declarada

> **1 assinatura `ACTIVE` paga por cliente externo, com pagamento aprovado e
> permanência ≥ 30 dias, até 01/11/2026.**

"Cliente externo" = alguém que não é o dono do produto se cadastra, paga e usa o
ERP sem intervenção manual.

### Critério de kill

Em 01/11/2026, com 0 pagante e < 3 trials externos, o Orion deixa de ser produto
e vira peça de portfólio: landing honesta, sem checkout, sem custo de manutenção.
A decisão é tomada nessa data, não adiada.

### Estado das metas (G1–G8)

| Meta | Estado |
|---|---|
| G1 — Um único caminho de pagamento (Stripe) | ✅ fechado |
| G2 — Webhook autenticado e idempotente | ✅ fechado (4 testes) |
| G2.5 — Stripe configurada em produção | ✅ fechado (3 products, 3 prices BRL, webhook) |
| G3 — Uma compra real em produção | ⏸️ **dispensado por decisão do dono** — não reabrir |
| G4 — Site diz a verdade sobre o produto | ✅ fechado |
| G4.5 — Planos diferenciam de verdade | ✅ fechado (limites aplicados por código) |
| **G5 — Primeiro uso entrega valor em ≤ 10 minutos** | 🔴 **aberto — é a meta de UX** |
| G6 — Acesso confiável nas duas direções | ✅ raiz corrigida (gate saiu do proxy) |
| G7 — Alguém chega (prospecção outbound) | 🔴 aberto, 0 trials externos |
| G8 — Emissão de NF-e (modelo BYO, Focus NFe) | 🟡 parcial: config existe, **emissão não** |

**G5 é o alvo direto de qualquer trabalho de UX.** Sua medição definida:
3 pessoas reais, com cronômetro, criando conta e completando o ciclo
**1 cliente → 1 produto → 1 venda → 1 relatório**. Critério: **≥ 2 concluem em
≤ 10 min com 0 erro 500**. O onboarding existe e **nunca foi medido com ninguém
de fora**.

### Gargalo declarado

Não é preço (0 trial externo, 0 conversa de venda registrada — não há evidência
de resistência a preço). É **aquisição** (G7) e **ativação** (G5). Toda decisão
de interface deve otimizar ativação e tempo-até-primeiro-valor, não conversão de
pricing.

---

## 3. Público-alvo

- **Primário:** MEIs e microempresas brasileiras, 1–10 usuários, hoje operando
  em planilhas Excel. Usuário não-técnico, sem tempo de treinamento, sem TI.
- **Secundário:** empresas com equipe pequena (até 10 pessoas) que já usam algum
  ERP e querem algo mais simples e barato.
- **Contexto de uso:** desktop predominante (trabalho administrativo), mas o
  cadastro e a consulta acontecem em mobile. Conexão brasileira média.
- **Nicho de prospecção:** ainda não escolhido (pendência do G7, prazo 07/09).

---

## 4. Escopo real do produto — o que existe e o que não existe

Esta seção é a mais importante do dossiê. Auditoria interna (sessão 6) descobriu
15 bullets de features inexistentes sendo vendidos por até R$ 599/mês, 48
funcionalidades inventadas em páginas de segmento e 8 depoimentos com nome, cargo
e empresa fabricados. Tudo foi removido. **Nenhuma proposta pode reintroduzir
promessa sem rota que entregue.**

### 4.1 O que o Orion FAZ (6 módulos reais)

**Dashboard**
- KPIs: clientes, produtos, vendas, receita
- Gráfico de receita (Recharts)
- Alertas de vencimento e de estoque abaixo do mínimo
- Checklist de onboarding

**Clientes**
- Cadastro completo PF e PJ (dados cadastrais, contato, endereço)
- Histórico de pedidos do cliente

**Produtos e Serviços**
- Catálogo: descrição, preço, quantidade em estoque, estoque mínimo
- Produtos e serviços no mesmo cadastro

**Vendas e Pedidos**
- Criação e edição de pedidos com itens
- Status do pedido e status de pagamento

**Financeiro**
- Lançamentos a pagar e a receber, com vencimento e status

**Relatórios — exatamente três**
- Vendas (por período), Clientes, Financeiro
- Exportação em CSV e PDF (`jspdf`, `xlsx`)

**Ferramentas transversais**
- **Orion AI** — chat com contexto real dos dados da conta (Groq, provado em produção)
- Busca global (`cmdk`)
- Notificações no sistema (SSE) + web push
- Importação de dados de outro ERP (migração)
- Dados de exemplo para conhecer o sistema
- Suporte por ticket (cliente + admin, telas prontas)
- Suporte por WhatsApp em todos os planos (SLA varia por plano)
- Equipe multi-usuário (convite por e-mail, todos veem tudo)
- Cadastro da empresa e configuração fiscal (enquadramento + conexão Focus NFe)

### 4.2 O que o Orion NÃO FAZ (lista canônica, replicada no prompt da IA)

Nunca inventar tela, menu ou passo a passo para nada desta lista:

- Emissão de NF-e / NFS-e e qualquer documento fiscal; SPED; apuração de imposto
  - *Exceção parcial:* Configurações → Fiscal **existe** e guarda enquadramento
    (regime tributário, inscrições, código IBGE, série) e conecta a conta do
    cliente na Focus NFe. **Emitir a nota a partir do pedido não existe.**
- Conciliação bancária e integração bancária
- Movimentação de estoque (entrada/saída), inventário, custeio, curva ABC
- PDV / frente de caixa
- Funil de vendas, automações de CRM, segmentação, tags de cliente
- Compras e cadastro de fornecedores
- Comissões de vendedores, metas de vendas
- Precificação dinâmica ou automática
- **Permissões por usuário ou por módulo** (a equipe existe, mas todos veem tudo,
  inclusive o financeiro)
- Múltiplas empresas ou filiais
- Upload ou anexo de arquivos
- Produção/MRP, RH/ponto, projetos, contratos, agendamentos, e-mail marketing
- API pública, webhooks de saída, integrações com outros sistemas
- Relatórios além dos três listados

---

## 5. Modelo comercial

Fonte única do catálogo: `prisma/plans.ts`. Cada bullet é uma promessa contratual
com limite aplicado em código (`src/lib/account.ts`) nas rotas de criação.

| Plano | Preço/mês | Usuários | Clientes | Produtos | Msgs IA/mês | SLA suporte |
|---|---|---|---|---|---|---|
| Starter | R$ 89 | 2 | 500 | 200 | 100 | WhatsApp/e-mail 24–48h |
| Professional | R$ 189 | 10 | 5.000 | 2.000 | 1.000 | prioritário 8h úteis |
| Enterprise | R$ 349 | ∞ | ∞ | ∞ | ∞ | prioridade máxima 2h úteis |

**A diferenciação entre planos é volume, não módulo.** Nenhum plano anuncia
funcionalidade que o Starter não tenha, porque não existe nenhuma. É pouco para
R$ 349 e é honesto. NF-e (G8) é o primeiro módulo exclusivo previsto para o
Professional.

- **Trial:** 30 dias, gate aplicado em `src/app/dashboard/layout.tsx`
- **Pagamento:** Stripe, cartão apenas (Pix/boleto não têm mandato recorrente)
- **Cupom de fundador:** `allow_promotion_codes` já ligado no checkout
- **Preço não muda** — a tração vem de cupom com `max_redemptions`, não de corte
  de tabela

---

## 6. Arquitetura técnica

### 6.1 Stack

| Camada | Tecnologia |
|---|---|
| Framework | **Next.js 16.1** (App Router, RSC) |
| UI | React 18.3, **shadcn/ui + Radix UI** (~65 primitivos) |
| Estilo | Tailwind CSS 3.4 + CSS Variables (HSL) |
| Animação | **Framer Motion 11** |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Dados | PostgreSQL + **Prisma 5** |
| Auth | **NextAuth v5** (beta) + `@auth/prisma-adapter` + bcryptjs |
| Pagamentos | **Stripe** (Checkout + Customer Portal + webhooks) |
| E-mail | Resend (provado em produção) |
| IA | Groq (chat com contexto de dados reais) |
| i18n | next-intl (pt-BR, en-US) |
| Observabilidade | Sentry, Pino |
| Analytics | GA4 + Google Tag Manager + Microsoft Clarity |
| Testes | Vitest + Testing Library (unit), Playwright (E2E), Lighthouse CI |
| Deploy | Vercel |

### 6.2 Regra arquitetural inviolável — identidade de conta

Existem **duas identidades** na sessão e trocá-las é o bug mais fácil do projeto:

- `session.user.id` → **quem está logado**. Perfil, notificações, push.
- `session.user.accountId` → **de quem são os dados**. Clientes, produtos,
  vendas, financeiro, relatórios, dashboard.

Multi-usuário foi resolvido com `User.ownerId`: um membro aponta para o dono e os
dados do ERP continuam gravados no id do dono. Nenhuma das seis tabelas do ERP
precisou migrar dados.

Consequência para UI: **toda tela do ERP mostra os dados da conta, não do
usuário.** Telas de perfil, preferências e notificações são pessoais.

### 6.3 Regras técnicas que restringem o design

1. **Prisma não funciona no proxy/middleware.** O gate de trial mora em
   `dashboard/layout.tsx` (server component), sem try/catch — se o banco cair, o
   erro aparece em vez de liberar acesso calado. Não devolver banco ao proxy.
2. **Nunca `prisma db push`** — sempre migration versionada.
3. **Nunca mexer em `price` sem trocar `stripePriceId`** — price da Stripe é
   imutável; o script de sync aborta de propósito.
4. **O seed usa `update: {}`** — corrigir o seed não corrige produção. Mudança de
   plano passa por `scripts/sync-plans.ts`.
5. `npx tsc` resolve o pacote errado neste repositório. Use
   `node node_modules/typescript/bin/tsc --noEmit`.

---

## 7. Mapa completo de rotas

### 7.1 Site público (marketing)

```
/                      Landing: Header · Hero · SocialProof · ProblemSolution ·
                       FeaturesGrid · ProductShowcase · AIPreview · CTA · Footer
/produto               Página de produto — demo interativa, scrollytelling,
                       comparador antes/depois, stats animados
/features              6 módulos reais + lista explícita do que falta
/solucoes              Índice de segmentos
/solucoes/[slug]       Página por segmento + seção "Onde o Orion não vai te atender"
/precos                Planos lidos de /api/plans, comparador, FAQ
/blog · /blog/[slug]   Blog (CMS próprio: Post, Category, Tag)
/ajuda/[categoria]/[slug]  Central de ajuda
/sobre · /carreiras · /contato · /termos · /privacidade
```

### 7.2 Autenticação

```
/login                 Credenciais
/cadastro              Registro  ⚠️ a rota é /cadastro, NÃO /register
/esqueci-senha         Envia e-mail real via Resend
/redefinir-senha       Define senha (também usado no fluxo de convite de equipe)
```

### 7.3 Checkout e assinatura

```
/checkout              Início
/checkout/sucesso · /checkout/pendente · /checkout/erro
/assinaturas           Estado da assinatura + acesso ao Customer Portal da Stripe
```

### 7.4 Dashboard (produto)

```
/dashboard                              Home: KPIs, gráfico, alertas, checklist
/dashboard/onboarding · /welcome        Fluxo de primeiro uso
/dashboard/clientes · /novo · /[id]
/dashboard/produtos · /novo · /[id]
/dashboard/vendas · /novo · /[id]
/dashboard/financeiro · /novo
/dashboard/relatorios · /vendas · /clientes · /financeiro
/dashboard/suporte · /[id]              Tickets do cliente (lista + thread)
/dashboard/configuracoes                Hub de configurações
  /perfil  /equipe  /notificacoes  /seguranca  /sistema
  /empresa  /fiscal  /migracao  /integracoes  /api-keys
/perfil · /perfil/configuracoes
```

Navegação lateral (`DashboardSidebar`): Dashboard · Clientes · Produtos · Vendas ·
Financeiro · Relatórios · Configurações (grupo colapsável com as 10 sub-rotas) +
rodapé com Suporte e botão de WhatsApp. Sidebar colapsável (w-64 ↔ w-20).

### 7.5 Admin

```
/admin/usuarios  /admin/planos  /admin/cupons  /admin/blog · /novo
/admin/categorias  /admin/suporte  /admin/notifications
```

### 7.6 API (Route Handlers)

```
auth/[...nextauth] · auth/forgot-password · auth/reset-password · register
account/entitlements · user/profile · user/onboarding · user/trial-status
customers[/id] · products[/id] · orders[/id] · financial[/id]
dashboard/stats · reports/{sales,customers,financial} · search
checkout · webhooks/stripe · billing/portal · subscriptions (só GET)
plans[/id] · coupons[/id] · coupons/validate
ai/chat · notifications[/id] · notifications/stream (SSE) · push/{subscribe,unsubscribe}
support[/id] · support/[id]/reply · contact
team · users[/id] · company · settings/api-keys
fiscal/conexao · migration · sample-data · blog · blog/categories
cron/trial-notifications · docs (Scalar/OpenAPI)
```

---

## 8. Design System vigente — "Orion Deep Space"

### 8.1 Tokens (CSS variables em `src/app/globals.css`)

Tema duplo com `next-themes` (`darkMode: ["class"]`). Todos os valores em HSL.

**Light**
```css
--background: 0 0% 100%;        --foreground: 222 47% 11%;
--primary:    187 85% 45%;      /* ciano  */
--accent:     271 70% 60%;      /* roxo   */
--muted-foreground: 215 16% 40%;  /* contraste elevado p/ WCAG */
--border:     217 20% 88%;      --radius: 0.75rem;
```

**Dark (tema-assinatura)**
```css
--background: 222 59% 2%;       --foreground: 210 40% 98%;
--card:       222 47% 6%;
--primary:    187 100% 50%;     /* ciano neon */
--accent:     271 91% 65%;      /* roxo neon  */
--orion-deep: 222 47% 4%;   --orion-surface: 222 47% 8%;
--orion-surface-elevated: 222 47% 12%;
```

**Gradientes, vidro e sombras**
```css
--gradient-primary: linear-gradient(135deg, ciano, roxo);
--gradient-hero:    linear-gradient(180deg, deep → roxo escuro);
--gradient-glow:    radial-gradient(ellipse at center, ciano 10%, transparent 70%);
--glass-bg / --glass-border / --glass-blur: 20px;
--shadow-sm/md/lg + --shadow-glow-{cyan,purple,mixed}
```

**Sidebar** tem paleta própria (8 tokens) em ambos os temas.

### 8.2 Tipografia

- Família única: **Inter** (`font-sans`), fallback `system-ui`
- Não há escala tipográfica documentada — usa-se a escala padrão do Tailwind
- **Lacuna conhecida:** não existe token de tipografia; hierarquia é decidida
  caso a caso nas páginas

### 8.3 Linguagem visual

Glassmorphism, gradientes ciano→roxo, glow neon, orbs flutuantes, star field.
Container centralizado com padding 2rem, máximo 1400px em 2xl.

**Animações do tema:** `pulse-glow` (2s), `float` (3s), accordion up/down.
Easing padrão do projeto ("The ROI Flow"): `cubic-bezier(0.25, 0.1, 0.25, 1)`.
Durações convencionadas: 150ms (hover) · 300ms (padrão) · 500ms (complexa) ·
700ms (carrossel).

### 8.4 Acessibilidade já implementada

- `prefers-reduced-motion` respeitado via hook `useReducedMotion`
- Parallax desabilitado em < 768px
- `--muted-foreground` do light mode elevado explicitamente por contraste
- Animações restritas a `transform`/`opacity` (CLS = 0)

---

## 9. Inventário de componentes

### 9.1 Primitivos shadcn/ui (`src/components/ui/`) — 47 arquivos

accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button,
calendar, card, carousel, chart, checkbox, collapsible, command, context-menu,
dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label,
menubar, navigation-menu, pagination, popover, progress, radio-group, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch,
table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip.

### 9.2 Componentes de domínio

| Grupo | Componentes |
|---|---|
| **Landing** | `Header`, `HeroSection`, `SocialProof`, `ProblemSolution`, `FeaturesGrid`, `ProductShowcase`, `AIPreview`, `CTASection`, `Footer` |
| **Demo interativa** | `InteractiveDemo`, `DemoHotspot`, `DemoTooltip`, `DemoProgressBar` |
| **Animação** | `ScrollReveal` (5 direções), `CounterAnimation` (easeOutExpo), `ParallaxContainer` |
| **Micro-interação** | `AnimatedCard`, `AnimatedIcon`, `AnimatedCheckmark`, `GlowButton` |
| **Prova social** | `LogoSlider`, `TestimonialCarousel`, `TrustBadges`, `testimonials-carousel` |
| **Comparação** | `BeforeAfterComparison` (slider drag + touch) |
| **Dashboard** | `DashboardSidebar`, `DashboardStats`, `RevenueChart`, `AIInsightsCard`, `RecentTasksCard`, `SystemStatusCard` |
| **Onboarding** | `OnboardingChecklist`, `onboarding`, `onboarding-control`, `sample-data-manager` |
| **Assinatura** | `subscription-banner`, `subscription-gate`, `dashboard-subscription-wrapper`, `PricingComparison` |
| **Notificações** | `NotificationBell`, `NotificationDropdown`, `PushNotificationButton` |
| **Busca** | `GlobalSearch`, `SearchCommand` |
| **Marca** | `Logo`, `OrionLogo` (ampulheta de Órion montada com "slabs" dos módulos) |
| **Outros** | `ai-assistant`, `ROICalculator`, `ConexaoFiscal`, `breadcrumbs`, `theme-toggle`, `theme-provider`, `LocaleSwitcher`, `newsletter-form`, `share-buttons`, `related-content`, `pwa-install-prompt`, `JsonLd`, `GoogleAnalytics`, `GoogleTagManager`, `ProductPageTracking` |

### 9.3 Hooks

`use-mobile`, `use-toast`, `use-subscription`, `useEntitlements`,
`useNotifications`, `useReducedMotion`, `useScrollTracking`, `useTimeTracking`.

---

## 10. Modelo de dados (Prisma — 26 models)

**Identidade e conta:** `User` (com `ownerId` para equipe), `Account`, `Session`,
`VerificationToken`, `Company` (dados fiscais: regime tributário, IE, IBGE),
`ApiKey`, `PushSubscription`, `UserOnboarding`.

**Comercial:** `Plan`, `Subscription`, `Order`, `Coupon`.

**ERP:** `Customer`, `Product`, `SalesOrder`, `OrderItem`,
`FinancialTransaction`, `NotaFiscal`, `DataMigration`.

**Conteúdo e suporte:** `Post`, `Category`, `Tag`, `TagOnPost`, `SupportTicket`,
`TicketReply`, `Notification`.

**Enums relevantes para estados de UI:** `SubscriptionStatus`,
`SubscriptionUserStatus`, `OrderStatus`, `SalesOrderStatus`, `PaymentStatus`,
`FinancialStatus`, `TicketStatus`, `TicketPriority`, `NotificationType`,
`MigrationStatus`, `NotaFiscalStatus`, `PostStatus`, `UserRole`,
`RegimeTributario`, `AmbienteFiscal`, `CustomerType`, `ProductType`,
`TransactionType`, `DiscountType`, `SourceErp`, `BillingPeriod`,
`IndicadorIeDestinatario`.

---

## 11. Fluxos-chave existentes

### 11.1 Aquisição → ativação (o fluxo do G5)

```
Landing (/) → CTA "Começar Grátis" → /cadastro → conta criada com trial de 30 dias
   → /dashboard/onboarding/welcome
   → checklist de 8 passos:
        welcome · company_setup · fiscal_setup · first_product ·
        first_customer · first_sale · migration (opcional) · integrations (opcional)
   → /dashboard com KPIs, gráfico e alertas
```

Existe `POST /api/sample-data` que popula a conta com dados de exemplo
(`sample-data-manager`), como alternativa ao cadastro manual.

**Este fluxo nunca foi cronometrado com usuário externo.** É a lacuna do G5.

### 11.2 Ciclo básico de valor

`1 cliente → 1 produto → 1 venda → 1 relatório`. É a definição operacional de
"o produto entregou valor". Toda tela envolvida:
`/dashboard/clientes/novo`, `/dashboard/produtos/novo`, `/dashboard/vendas/novo`,
`/dashboard/relatorios/vendas`.

### 11.3 Conversão

```
/precos (planos de /api/plans) → POST /api/checkout → Stripe Checkout
   → webhook grava Subscription ACTIVE → gate de trial destrava /dashboard
   → /assinaturas abre o Customer Portal da Stripe
```

### 11.4 Equipe

Dono convida por e-mail em Configurações → Equipe. O convite reaproveita o fluxo
de redefinição de senha (não há token próprio). Membro removido perde acesso no
`dashboard/layout.tsx`, não no proxy. Membro **não tem trial próprio** — o gate
olha o status do dono.

### 11.5 Suporte

Dois canais: ticket (`/dashboard/suporte` → thread em `/[id]`, admin em
`/admin/suporte`) e WhatsApp (botão verde no rodapé da sidebar). Criação de
ticket dispara e-mail ao admin; resposta de staff cria notificação ao cliente.

### 11.6 Orion AI

Chat autenticado com contexto real dos dados da conta. O system prompt contém a
lista exaustiva de módulos reais e a seção "O QUE O ORION NÃO FAZ" — a IA é
proibida de inventar tela ou passo a passo. Cota mensal por plano.

---

## 12. Estado de UX: o que já foi feito

Um roadmap de upgrade UX da página `/produto` foi executado (5 fases, concluído
em 22/01/2026):

- **Demo interativa** — 4 componentes, tour de 12s com 4 hotspots pulsantes,
  tooltips, progress bar, skip e replay; 5 screenshots WebP (todos < 60KB,
  redução média de 68%); 4 eventos GA4 (`demo_started`, `demo_hotspot_clicked`,
  `demo_completed`, `demo_skipped`).
- **Scrollytelling** — `ScrollReveal` com stagger nos cards de módulos (0,1s) e
  nos benefícios (0,08s); seção de stats com 4 contadores animados; parallax
  0,3x no hero, desligado em mobile.
- **Comparador antes/depois** — slider arrastável (mouse + touch), auto-slide na
  entrada em viewport, 4 stats comparativos.
- **Micro-interações e prova social** — `AnimatedCard`, `AnimatedIcon`,
  `AnimatedCheckmark`, `GlowButton`, `LogoSlider`, `TestimonialCarousel`,
  `TrustBadges`.
- **Budget de performance** — ~15KB de JS de animação, 60fps, CLS 0.

**Referências visuais assumidas pelo projeto:** Linear, Stripe, Notion, Figma,
Vercel, Apple (scrollytelling).

⚠️ **Ressalva obrigatória:** as métricas de prova social daquele roadmap
("1.234+ empresas", "98% satisfação", depoimentos) são **de uma versão anterior
que a auditoria do G4 derrubou**. O produto tem **0 clientes**. Nenhuma proposta
pode reintroduzir número de prova social fabricado — o critério do G4 é que toda
afirmação pública corresponda a algo que existe.

---

## 13. Dívidas e defeitos de UX conhecidos

Lista honesta, apurada no código. São candidatos naturais a tarefas.

### Elementos decorativos (a interface promete e não entrega)

1. Os **3 toggles** de `/dashboard/configuracoes/notificacoes` não fazem nada.
2. O botão **"Alterar Senha"** em `/dashboard/configuracoes/seguranca` não faz
   nada — `/esqueci-senha` já envia e-mail real; ligar os dois é trivial.
3. O select **"Tipo de Dados"** da migração é coletado e **ignorado** pela rota.
4. `/api/migration` só tem `POST` — sem histórico, sem tela de acompanhamento.
5. **API keys** são geradas e nunca verificadas: nenhuma rota lê `x-api-key`.
   Nenhum plano vende API, mas a tela promete algo que não funciona.
6. **Número de WhatsApp vazio de propósito** (`src/lib/suporte.ts`): enquanto
   for `""`, o botão da sidebar e os contatos de `/contato` não renderizam.
   Aguarda o número real.

### Lacunas estruturais

7. **Não existe permissão por usuário.** Todo membro de equipe vê tudo, inclusive
   o financeiro. É a primeira coisa que um cliente com 10 usuários vai pedir.
8. **O gate de exportação é de UI, não de segurança** — o CSV é montado no
   cliente com dados que ele já recebeu.
9. **Cota de IA sem atomicidade** (read-modify-write): duas mensagens simultâneas
   podem contar como uma.
10. **VAPID não configurado em produção** — o resto do web push está pronto.
11. **G8 travado:** a tela Fiscal existe e conecta a conta do cliente na Focus
    NFe, mas **não há botão "Emitir NF-e" no pedido**. É uma configuração sem
    destino visível para o usuário.

### Qualidade

12. 3 testes de `NotificationBell` falham (formatação de tempo relativo),
    pré-existentes; os outros 87 passam.
13. O **ESLint do projeto não roda** (falta `eslint-plugin-react-refresh`).
14. Aviso de build: `middleware` está deprecado no Next 16, quer virar `proxy`.
15. `README.md` desatualizado (declara 60%, cita Mercado Pago).

---

## 14. Instrumentação disponível

| Ferramenta | Estado |
|---|---|
| Google Analytics 4 | ✅ integrado, com eventos customizados |
| Google Tag Manager | ✅ integrado |
| Microsoft Clarity | ✅ integrado (heatmaps, gravações) |
| Sentry | ✅ instalado (client, server, edge) — sem rotina de triagem |
| Lighthouse CI | ✅ configurado (`lighthouserc.json`, `npm run lighthouse`) |
| Playwright E2E | ✅ 4 suítes: auth, i18n, navigation, search |
| Vitest | ✅ 90 testes |
| Hooks próprios | `useScrollTracking`, `useTimeTracking` |

Metas de performance declaradas: Lighthouse > 90 · FCP < 1,5s · LCP < 2,5s ·
TTI < 3s · CLS < 0,1.

---

## 15. Restrições invioláveis para qualquer proposta

1. **Não propor módulo novo de ERP.** Fora de escopo até 01/11/2026 — o que
   existe basta para provar a tese.
2. **Não propor refatoração de arquitetura nem troca de stack.**
3. **Não propor SEO/GEO.** Cluster errado, horizonte errado para esta meta.
4. **Não propor app mobile nativo.** Web responsiva apenas.
5. **Não reintroduzir prova social fabricada** — nem número de clientes, nem
   depoimento, nem logo de cliente. O produto tem 0 clientes.
6. **Não anunciar funcionalidade sem rota que a entregue.** Esta é a regra que
   originou o G4 e o teste de regressão em `prisma/plans.test.ts`.
7. **Não propor mudança de preço.** Decisão fechada: tabela fica, tração vem de
   cupom de fundador.
8. Toda entrega precisa caber em **1 desenvolvedor solo**, em fases
   independentes e deployáveis isoladamente.
9. Todo texto de interface em **pt-BR**, com chave i18n quando a tela já for
   internacionalizada.
10. Componentização obrigatória sobre o que já existe: shadcn/ui + tokens do
    Deep Space Theme. **Não adicionar biblioteca de UI nova.**

---

## 16. O que eu preciso que você gere

Trate as seções 1–15 como o **[Resumo Executivo do Projeto]** e produza o
`PROMPT DE EXECUÇÃO / SPEC TÉCNICO` no formato definido, com estas quatro seções:

### 1. Visão e Estratégia de Produto (HEART)
Foque em **Task Success** e **Retention**, ancorados no G5: usuário não-técnico,
sozinho, completa `1 cliente → 1 produto → 1 venda → 1 relatório` em ≤ 10 minutos,
com 0 erro 500. Defina os sinais e métricas HEART observáveis com a
instrumentação da seção 14 (GA4, Clarity, hooks de scroll e tempo).

### 2. Diretrizes de UX e Arquitetura
Quais Heurísticas de Nielsen e Leis de UX governam cada superfície:
(a) o funil público (`/`, `/produto`, `/precos`),
(b) o cadastro e o onboarding,
(c) o dashboard e os quatro fluxos de cadastro do ciclo básico,
(d) o Orion AI — defina os padrões de **Generative UI** para um assistente que é
proibido de inventar funcionalidade: como a interface comunica limite de
conhecimento, cota consumida, estados de streaming e ações sugeridas ancoradas em
rotas reais.

### 3. Arquitetura de Interface e Componentes Core
Componentes globais e estados de interface, **reutilizando o inventário da seção
9** — diga explicitamente o que reaproveitar, o que estender e o que criar do
zero (e por quê). Inclua os estados que hoje faltam de forma sistemática: empty
state, loading/skeleton, erro, limite de plano atingido, trial expirando e
funcionalidade em construção (o caso da tela Fiscal sem emissão).

### 4. Plano de Ação: Tarefas de Execução
Épicos e tarefas sequenciais, cada uma com **Requisitos Funcionais**,
**Requisitos de UX/UI** (layout, feedback visual, heurística aplicada) e
**Critérios de Aceite** verificáveis. Priorize por impacto na ativação (G5) e
resolva as dívidas da seção 13 que quebram a heurística de "visibilidade do
estado do sistema" e "correspondência entre sistema e mundo real" — sobretudo os
elementos decorativos, que são a violação mais grave presente hoje.

O roteiro precisa ser executável por um desenvolvedor (ou agente de código) sem
perguntas adicionais sobre a interface.
