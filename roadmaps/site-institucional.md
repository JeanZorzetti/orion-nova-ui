# Roadmap: Orion Nova UI - Landing Page → Site Institucional

**Versão:** 1.0
**Data de Criação:** 16/01/2026
**Status:** 🔄 Em Andamento

---

## 📋 Visão Geral

Transformar a atual landing page da Orion em um **site institucional completo** com:
- Múltiplas páginas de conteúdo
- Sistema de autenticação
- Checkout e pagamentos
- Integração com banco de dados PostgreSQL
- CMS para gerenciamento de conteúdo
- Dashboard administrativo

---

## 🎯 Objetivos

- ✅ Criar estrutura de páginas institucionais
- ✅ Implementar sistema de autenticação completo
- ✅ Desenvolver fluxo de checkout e pagamentos
- ✅ Integrar banco de dados PostgreSQL
- ✅ Criar painel administrativo
- ✅ Implementar SEO e analytics
- ✅ Deploy em produção

---

## 📊 Fases do Projeto

### **FASE 1: Estrutura Base e Páginas Institucionais** 🏗️
**Duração estimada:** Sprint 1-2
**Prioridade:** 🔴 Crítica
**Status:** ✅ Concluído (100%)

#### 1.1 Páginas do Header/Navegação
- [x] **Página: Produto** (`/produto`) ✅ _Criado em 18/01/2026_
  - Showcase completo do produto
  - Vídeo demo (placeholder)
  - Grid de 6 módulos principais
  - 6 benefícios do sistema
  - CTAs estratégicos

- [x] **Página: Soluções** (`/solucoes`) ✅ _Criado em 18/01/2026_
  - 8 segmentos (Varejo, Serviços, Indústria, Alimentação, Saúde, Educação, Logística, Construção)
  - Cards com benefícios e estatísticas
  - Depoimentos por setor
  - Links para páginas individuais de segmento

- [x] **Página: Features/Funcionalidades** (`/features`) ✅ _Criado em 18/01/2026_
  - Grid de funcionalidades detalhadas (6 módulos)
  - 12 recursos adicionais
  - +50 integrações disponíveis
  - 6 características tecnológicas

- [x] **Página: Preços** (`/precos`) ✅ _Já existia com integração Mercado Pago_
  - Tabela de planos (Starter, Professional, Enterprise)
  - Comparativo de features por plano
  - Checkout integrado com Mercado Pago

#### 1.2 Páginas do Footer
- [x] **Sobre Nós** (`/sobre`) ✅ _Criado em 18/01/2026_
  - Missão, visão e valores
  - Timeline de crescimento
  - Seção de equipe
  - Estatísticas da empresa
  - Reconhecimentos

- [x] **Contato** (`/contato`) ✅ _Criado em 18/01/2026_
  - Formulário de contato completo
  - Informações de contato (email, telefone, WhatsApp)
  - Horário de atendimento
  - Contato por departamento

- [x] **Blog** (`/blog`) ✅ _Criado em 18/01/2026_
  - Listagem de artigos com grid
  - Categorias e sidebar
  - Campo de busca
  - Newsletter signup
  - Artigo individual (`/blog/[slug]`)

- [x] **Central de Ajuda/Suporte** (`/ajuda`) ✅ _Criado em 18/01/2026_
  - 8 categorias de ajuda
  - FAQs com respostas
  - Campo de busca
  - Tutoriais em vídeo (placeholders)
  - Links para contato de suporte

- [x] **Política de Privacidade** (`/privacidade`) ✅ _Criado em 18/01/2026_
  - LGPD compliant (12 seções)
  - Direitos do titular
  - Política de cookies
  - Contato DPO

- [x] **Termos de Uso** (`/termos`) ✅ _Criado em 18/01/2026_
  - 14 seções jurídicas completas
  - Termos de serviço
  - Condições de uso
  - Trial e cancelamento

- [x] **Carreiras** (`/carreiras`) ✅ _Criado em 18/01/2026_
  - 4 vagas de exemplo
  - Cultura e valores da empresa
  - Processo seletivo em 7 etapas
  - 8 benefícios listados

#### 1.3 Componentes Reutilizáveis
- [x] Breadcrumb navigation ✅ _Já existia (shadcn/ui)_
- [x] Share buttons (social) ✅ _Criado em 18/01/2026_
- [x] Related content ✅ _Criado em 18/01/2026_
- [x] Newsletter form ✅ _Criado em 18/01/2026_
- [x] CTA sections ✅ _Incluídos em todas as páginas_
- [x] Testimonials carousel ✅ _Criado em 18/01/2026_

---

### **FASE 2: Sistema de Autenticação** 🔐
**Duração estimada:** Sprint 3
**Prioridade:** 🔴 Crítica
**Status:** ✅ Concluído (100%)

#### 2.1 Autenticação Base

- [x] Setup **NextAuth.js** (Auth.js v5) ✅ _Já configurado_
  - Google provider
  - Credentials provider (email + senha)
  - JWT strategy
  - PrismaAdapter

- [x] **Página: Login** (`/login`) ✅ _Já existia_
  - Email + Password
  - Login social (Google)
  - Link para recuperação de senha
  - Redirect com callbackUrl

- [x] **Página: Cadastro** (`/cadastro`) ✅ _Já existia_
  - Formulário de registro
  - Validação de campos
  - Termos e condições

- [x] **Página: Recuperar Senha** (`/esqueci-senha`) ✅ _Criado em 18/01/2026_
  - Formulário de solicitação
  - API de forgot-password
  - Validação de email

- [x] **Página: Redefinir Senha** (`/redefinir-senha`) ✅ _Criado em 18/01/2026_
  - Validação de token
  - Formulário de nova senha
  - Toggle de visualização de senha
  - API de reset-password

- [x] **Página: Perfil do Usuário** (`/perfil`) ✅ _Já existia_
  - Exibição de dados pessoais
  - Avatar do usuário
  - Role badge
  - Logout

#### 2.2 Proteção de Rotas

- [x] Redirect após login ✅ _Já implementado_
- [x] Middleware de autenticação ✅ _Já implementado_
- [x] Protected routes (dashboard, perfil, assinaturas) ✅ _Já implementado_
- [x] Role-based access control (RBAC) ✅ _Já implementado com 3 níveis (USER, ADMIN, SUPER_ADMIN)_

#### 2.3 Integração com Database

- [x] Schema de usuários (Prisma) ✅ _Já configurado_
- [x] Tabela de sessions ✅ _Já configurada_
- [x] Campos de reset tokens ✅ _Criado em 18/01/2026_
- [ ] Email verification tokens 🔜 _Opcional - futura melhoria_

---

### **FASE 3: Banco de Dados PostgreSQL** 🗄️
**Duração estimada:** Sprint 3-4
**Prioridade:** 🔴 Crítica

#### 3.1 Setup do Database
- [ ] Configurar **Supabase** ou **Neon** (Postgres serverless)
- [ ] Setup **Prisma ORM**
  - Schema definition
  - Migrations
  - Seed data

#### 3.2 Schemas Principais
- [ ] **Users** (usuários)
  - id, email, password_hash, name, avatar_url
  - email_verified, created_at, updated_at
  - role (user, admin, super_admin)

- [ ] **Accounts** (OAuth accounts)
  - provider, provider_account_id, user_id

- [ ] **Sessions** (sessões)
  - session_token, user_id, expires

- [ ] **Plans** (planos de assinatura)
  - id, name, slug, price, features (JSON)
  - billing_period (monthly, yearly)

- [ ] **Subscriptions** (assinaturas)
  - user_id, plan_id, status, current_period_start/end
  - stripe_subscription_id

- [ ] **Orders** (pedidos)
  - user_id, plan_id, amount, status
  - payment_method, stripe_payment_intent_id

- [ ] **Posts** (blog posts)
  - title, slug, content, excerpt, cover_image
  - author_id, published_at, status (draft, published)

- [ ] **Categories** (categorias do blog)
  - name, slug, description

- [ ] **Support Tickets** (suporte)
  - user_id, subject, message, status, priority

#### 3.3 API Routes
- [ ] `/api/users` - CRUD de usuários
- [ ] `/api/plans` - Listagem de planos
- [ ] `/api/subscriptions` - Gerenciamento de assinaturas
- [ ] `/api/orders` - Histórico de pedidos
- [ ] `/api/blog` - Posts do blog
- [ ] `/api/support` - Tickets de suporte

---

### **FASE 4: Sistema de Checkout e Pagamentos** 💳
**Duração estimada:** Sprint 5-6
**Prioridade:** 🟡 Alta

#### 4.1 Integração Stripe
- [ ] Setup **Stripe** account
- [ ] Configurar produtos e preços
- [ ] Webhooks configuration

#### 4.2 Fluxo de Checkout
- [ ] **Página: Seleção de Plano** (`/precos`)
  - Botão "Assinar" por plano
  - Redirect para checkout

- [ ] **Página: Checkout** (`/checkout`)
  - Resumo do plano selecionado
  - Formulário de dados de cobrança
  - Stripe Payment Element
  - Aplicação de cupons/descontos
  - Cálculo de impostos

- [ ] **Página: Confirmação** (`/checkout/sucesso`)
  - Confirmação de pagamento
  - Detalhes da assinatura
  - Email de confirmação
  - Botão para acessar dashboard

- [ ] **Página: Falha no Pagamento** (`/checkout/erro`)
  - Mensagem de erro
  - Opções de retry
  - Suporte

#### 4.3 Gerenciamento de Assinaturas
- [ ] **Página: Minhas Assinaturas** (`/assinaturas`)
  - Status da assinatura
  - Próximo pagamento
  - Alterar plano (upgrade/downgrade)
  - Cancelar assinatura
  - Histórico de faturas

- [ ] **Página: Faturas** (`/faturas`)
  - Listagem de faturas
  - Download de PDF
  - Status de pagamento

#### 4.4 Webhooks Stripe
- [ ] Webhook: `payment_intent.succeeded`
- [ ] Webhook: `customer.subscription.created`
- [ ] Webhook: `customer.subscription.updated`
- [ ] Webhook: `customer.subscription.deleted`
- [ ] Webhook: `invoice.payment_failed`

---

### **FASE 5: Dashboard Administrativo** 👨‍💼
**Duração estimada:** Sprint 7-8
**Prioridade:** 🟡 Alta

#### 5.1 Painel Admin
- [ ] **Página: Admin Dashboard** (`/admin`)
  - Métricas gerais (usuários, receita, conversão)
  - Gráficos de performance
  - Atividade recente

#### 5.2 Gerenciamento de Conteúdo
- [ ] **CRUD de Blog Posts** (`/admin/blog`)
  - Editor de Markdown/Rich Text (Tiptap)
  - Upload de imagens
  - SEO metadata
  - Preview de post
  - Agendamento de publicação

- [ ] **Gerenciamento de Categorias** (`/admin/categorias`)
  - CRUD de categorias

#### 5.3 Gerenciamento de Usuários
- [ ] **Listagem de Usuários** (`/admin/usuarios`)
  - Busca e filtros
  - Edição de perfis
  - Alteração de roles
  - Suspensão/ativação de contas

#### 5.4 Gerenciamento de Planos
- [ ] **CRUD de Planos** (`/admin/planos`)
  - Criar/editar planos
  - Definir features
  - Ajustar preços
  - Ativar/desativar planos

#### 5.5 Suporte e Tickets
- [ ] **Gestão de Tickets** (`/admin/suporte`)
  - Lista de tickets
  - Responder tickets
  - Alterar status e prioridade
  - Atribuir a agentes

#### 5.6 Relatórios e Analytics
- [ ] **Página: Relatórios** (`/admin/relatorios`)
  - Receita recorrente mensal (MRR)
  - Churn rate
  - Customer lifetime value (CLV)
  - Conversão de trials
  - Exportar relatórios (CSV, PDF)

---

### **FASE 6: SEO e Performance** 🚀
**Duração estimada:** Sprint 9
**Prioridade:** 🟢 Média

#### 6.1 SEO On-Page
- [ ] Metadata dinâmica por página
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Schema.org markup (JSON-LD)
- [ ] Sitemap.xml geração automática
- [ ] robots.txt

#### 6.2 Performance
- [ ] Otimização de imagens (next/image)
- [ ] Lazy loading de componentes
- [ ] Code splitting
- [ ] Análise de bundle size
- [ ] Core Web Vitals optimization

#### 6.3 Analytics
- [ ] Google Analytics 4
- [ ] Google Tag Manager
- [ ] Hotjar ou Clarity (heatmaps)
- [ ] Conversion tracking
- [ ] Event tracking customizado

---

### **FASE 7: Funcionalidades Avançadas** ⚡
**Duração estimada:** Sprint 10-11
**Prioridade:** 🟢 Média/Baixa

#### 7.1 Busca
- [ ] Busca global no site
- [ ] Algolia ou Typesense integration
- [ ] Autocomplete
- [ ] Filtros avançados

#### 7.2 Notificações
- [ ] Sistema de notificações in-app
- [ ] Email notifications (Resend ou SendGrid)
  - Confirmação de cadastro
  - Recuperação de senha
  - Confirmação de pagamento
  - Lembretes de renovação
  - Newsletter

#### 7.3 Internacionalização (i18n)
- [ ] Setup next-intl ou next-i18next
- [ ] Português (pt-BR) - padrão
- [ ] Inglês (en-US)
- [ ] Espanhol (es-ES) - _opcional_

#### 7.4 Chat/Intercom
- [ ] Widget de chat ao vivo
- [ ] Chatbot com IA (opcional)
- [ ] Integration com CRM

#### 7.5 Sistema de Cupons/Descontos
- [ ] CRUD de cupons no admin
- [ ] Validação de cupons no checkout
- [ ] Tipos de desconto (%, valor fixo, trial gratuito)
- [ ] Limites de uso

---

### **FASE 8: Testes e QA** 🧪
**Duração estimada:** Sprint 12
**Prioridade:** 🟡 Alta

#### 8.1 Testes Unitários
- [ ] Vitest ou Jest setup
- [ ] Testes de componentes (React Testing Library)
- [ ] Testes de utils e helpers
- [ ] Coverage mínimo de 70%

#### 8.2 Testes E2E
- [ ] Playwright ou Cypress setup
- [ ] Fluxo de cadastro
- [ ] Fluxo de login
- [ ] Fluxo de checkout
- [ ] Navegação entre páginas

#### 8.3 Testes de Performance
- [ ] Lighthouse audits
- [ ] Load testing (k6 ou Artillery)
- [ ] Database query optimization

---

### **FASE 9: Deploy e Infraestrutura** 🌐
**Duração estimada:** Sprint 13
**Prioridade:** 🔴 Crítica

#### 9.1 Ambientes
- [ ] **Development** - localhost
- [ ] **Staging** - Vercel preview
- [ ] **Production** - Vercel production

#### 9.2 CI/CD
- [ ] GitHub Actions workflow
  - Lint e type-check
  - Testes automatizados
  - Build verification
  - Auto-deploy em merge para main

#### 9.3 Monitoramento
- [ ] Sentry (error tracking)
- [ ] Vercel Analytics
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Database monitoring

#### 9.4 Backup e Segurança
- [ ] Database backups automáticos
- [ ] Variáveis de ambiente seguras
- [ ] Rate limiting (API routes)
- [ ] CORS configuration
- [ ] CSP headers

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 16.1+ (App Router)
- **UI Library:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **State Management:** React Query (TanStack Query)
- **Charts:** Recharts

### Backend
- **API Routes:** Next.js API Routes
- **Database:** PostgreSQL (Supabase/Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **Payments:** Stripe

### DevOps
- **Hosting:** Vercel
- **Database Hosting:** Supabase/Neon
- **Email:** Resend ou SendGrid
- **Storage:** Vercel Blob ou AWS S3
- **CDN:** Vercel Edge Network

### Ferramentas
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry
- **Analytics:** Google Analytics 4
- **Testing:** Vitest + Playwright

---

## 📈 Métricas de Sucesso

### Técnicas
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Lighthouse Score: > 90 em todas as categorias
- [ ] Code coverage: > 70%
- [ ] Uptime: > 99.9%

### Negócio
- [ ] Taxa de conversão: > 2%
- [ ] Tempo no site: > 3min
- [ ] Bounce rate: < 40%
- [ ] Net Promoter Score (NPS): > 50

---

## 🚧 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Complexidade do Stripe | Média | Alto | Documentação detalhada, sandbox testing |
| Performance com muitos posts | Baixa | Médio | Paginação, caching, ISR |
| Segurança de dados | Baixa | Crítico | Auditorias regulares, HTTPS, sanitização |
| Escalabilidade do DB | Média | Alto | Connection pooling, índices otimizados |

---

## 📝 Notas Importantes

1. **Priorização**: As fases podem ser ajustadas conforme necessidade do negócio
2. **MVP**: Fases 1, 2, 3 e 4 formam o MVP funcional
3. **Iteração**: Cada fase deve ser revisada e testada antes de prosseguir
4. **Documentação**: Manter README.md atualizado com setup instructions
5. **Feedback**: Coletar feedback de usuários após cada fase

---

## ✅ Checklist de Conclusão

Ao finalizar o projeto, garantir que:

- [ ] Todas as páginas estão responsivas (mobile-first)
- [ ] SEO básico implementado em todas as páginas
- [ ] Formulários validados e com feedback de erro
- [ ] Loading states em todas as ações assíncronas
- [ ] Error boundaries implementados
- [ ] Acessibilidade (A11y) verificada
- [ ] Testes passando em CI/CD
- [ ] Documentação completa
- [ ] Monitoramento ativo em produção

---

**Última atualização:** 18/01/2026
**Mantido por:** Equipe de Desenvolvimento Orion Nova UI
