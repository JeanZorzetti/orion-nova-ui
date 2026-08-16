# 🌟 Orion Nova UI

**Sistema ERP completo com design moderno e tecnologias de ponta**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)

---

## 📖 Sobre o Projeto

Orion Nova UI é um sistema ERP moderno e completo, desenvolvido com as mais recentes tecnologias web. Começou como uma landing page e está sendo transformado em um **site institucional completo** com:

- 🔐 Sistema de autenticação robusto
- 💳 Checkout e pagamentos recorrentes
- 📊 Dashboard administrativo
- 📝 Blog e CMS
- 🎨 Design system customizado (Deep Space Theme)
- ⚡ Performance otimizada
- 📱 100% responsivo

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Git

### Instalação

```bash
# Clonar repositório
git clone https://github.com/JeanZorzetti/orion-nova-ui.git

# Entrar na pasta
cd orion-nova-ui

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse http://localhost:3000

---

## 🗺️ Roadmaps de Desenvolvimento

Documentação completa para transformar o Orion em um site institucional:

### 📚 [Toda a documentação →](docs/README.md) · [Roadmaps →](docs/roadmaps/)

| Roadmap | Descrição | Status |
|---------|-----------|--------|
| 🚀 [**Quick Start**](docs/roadmaps/QUICK-START.md) | Comece HOJE com plano de 7 dias | ⭐ **Recomendado** |
| 🏗️ [**Site Institucional**](docs/roadmaps/site-institucional.md) | Visão geral completa (9 fases) | 📋 Planejamento |
| 🔐 [**01 - Autenticação**](docs/roadmaps/01-autenticacao.md) | NextAuth.js + OAuth | 🚧 Em progresso |
| 🗄️ [**02 - Database Setup**](docs/roadmaps/02-database-setup.md) | PostgreSQL + Prisma | 🚧 Em progresso |
| 💳 [**03 - Checkout**](docs/roadmaps/03-checkout-pagamentos.md) | Stripe + Webhooks | 📝 Planejado |

**👉 Comece pelo [Quick Start Guide](docs/roadmaps/QUICK-START.md) para implementar o MVP em 7 dias!**

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 16.1+ (App Router)
- **UI Library:** shadcn/ui + Radix UI (65+ componentes)
- **Styling:** Tailwind CSS + CSS Variables
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend & Database
- **API:** Next.js API Routes
- **Database:** PostgreSQL (Supabase/Neon)
- **ORM:** Prisma
- **Auth:** NextAuth.js v5
- **Payments:** Stripe
- **Email:** Resend

### DevOps & Tools
- **Deploy:** Vercel
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **TypeScript:** Full type safety
- **Linting:** ESLint + Prettier

---

## 📂 Estrutura do Projeto

```
orion-nova-ui/
├── src/
│   ├── app/                    # App Router (Next.js)
│   │   ├── (auth)/            # Rotas de autenticação
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── api/               # API Routes
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Estilos globais
│   ├── components/
│   │   ├── ui/                # Componentes shadcn/ui
│   │   ├── landing/           # Componentes da landing
│   │   ├── DashboardSidebar.tsx
│   │   └── ...
│   ├── hooks/                 # Custom React Hooks
│   ├── lib/                   # Utilitários e configs
│   └── test/                  # Testes
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/                    # Assets estáticos
├── roadmaps/                  # 📚 Documentação de desenvolvimento
├── next.config.ts             # Config do Next.js
├── tailwind.config.ts         # Config do Tailwind
└── tsconfig.json              # Config do TypeScript
```

---

## 🎨 Design System

### Orion Deep Space Theme

Tema escuro futurista com paleta ciano/roxo:

```css
--orion-deep: hsl(222, 47%, 4%)
--orion-cyan: hsl(187, 100%, 50%)
--orion-purple: hsl(271, 91%, 65%)
```

**Features:**
- ✨ Glassmorphism
- 🌟 Gradientes neon
- 💫 Floating orbs animados
- ⭐ Star field effect
- 🔮 Glow effects

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor dev (localhost:3000)

# Build & Deploy
npm run build            # Build de produção
npm run start            # Inicia servidor de produção
npm run lint             # Executar ESLint

# Database (Prisma)
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Executar migrations
npm run prisma:seed      # Popular database
npm run prisma:studio    # Abrir Prisma Studio
```

---

## 🚢 Deploy

### Vercel (Recomendado)

1. Push para GitHub
2. Conecte repositório na [Vercel](https://vercel.com)
3. Configure variáveis de ambiente
4. Deploy automático!

**Variáveis de Ambiente Necessárias:**
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Deploy Manual

```bash
npm run build
npm run start
```

---

## 📊 Status do Projeto

### ✅ Concluído
- [x] Migração Vite → Next.js 16
- [x] Setup Tailwind CSS + shadcn/ui
- [x] Landing page completa
- [x] Dashboard layout
- [x] Design system (Deep Space Theme)
- [x] Componentes UI (65+)
- [x] Roadmaps completos

### 🚧 Em Desenvolvimento
- [ ] Sistema de autenticação (Fase 2)
- [ ] Database PostgreSQL + Prisma (Fase 3)
- [ ] Checkout e pagamentos (Fase 4)

### 📝 Planejado
- [ ] Páginas institucionais
- [ ] Blog e CMS
- [ ] Dashboard admin
- [ ] SEO completo
- [ ] Testes E2E

**Progresso geral:** ██████░░░░ 60%

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adicionar login social
fix: corrigir validação de email
docs: atualizar README
refactor: melhorar estrutura de pastas
test: adicionar testes E2E
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🆘 Suporte

### Documentação
- 📚 [Roadmaps Completos](/roadmaps)
- 🚀 [Quick Start Guide](docs/roadmaps/QUICK-START.md)
- 📖 [Next.js Docs](https://nextjs.org/docs)
- 📖 [Prisma Docs](https://www.prisma.io/docs)

### Comunidade
- [Next.js Discord](https://discord.gg/nextjs)
- [Prisma Discord](https://discord.gg/prisma)
- [GitHub Issues](https://github.com/JeanZorzetti/orion-nova-ui/issues)

### Contato
- **Email:** contato@orion.com
- **Website:** [orion-nova-ui.vercel.app](https://orion-nova-ui.vercel.app)
- **GitHub:** [@JeanZorzetti](https://github.com/JeanZorzetti)

---

## ⭐ Star History

Se este projeto te ajudou, considere dar uma ⭐!

---

## 🎉 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) - Componentes incríveis
- [Vercel](https://vercel.com/) - Hosting e deployment
- [Supabase](https://supabase.com/) - Database PostgreSQL
- [Stripe](https://stripe.com/) - Pagamentos
- Comunidade Next.js e React

---

<div align="center">

**Desenvolvido com 💙 por [Jean Zorzetti](https://github.com/JeanZorzetti)**

[Website](https://orion-nova-ui.vercel.app) • [Roadmaps](/roadmaps) • [Report Bug](https://github.com/JeanZorzetti/orion-nova-ui/issues)

</div>
