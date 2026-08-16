# Documentação — Orion Nova UI

Índice de toda a documentação do projeto. O [README.md](../README.md) da raiz
cobre o produto e o setup rápido; aqui está o resto.

**Comece por:** [handoffs/HANDOFF.md](handoffs/HANDOFF.md) (estado atual do
projeto) e [roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md)
(a meta em vigor).

---

## 🤝 Handoffs — estado do projeto entre sessões

| Documento | O que cobre |
|---|---|
| [HANDOFF.md](handoffs/HANDOFF.md) | **Estado geral.** Stack, o que está pronto, o que quebrou, próximos passos. Ponto de entrada de qualquer sessão nova. |
| [HANDOFF-NFE-BYO.md](handoffs/HANDOFF-NFE-BYO.md) | Emissão de NF-e no modelo BYO (cliente traz o próprio certificado/conta). Meta G8. |
| [HANDOFF-SUPORTE-WHATSAPP.md](handoffs/HANDOFF-SUPORTE-WHATSAPP.md) | Suporte por WhatsApp em todos os planos. Ainda não codado. |
| [HANDOFF-TICKET-E-CRM.md](handoffs/HANDOFF-TICKET-E-CRM.md) | Suporte por ticket (Orion) + CRM multipipeline (ROI Hub). Duas frentes, dois repos. |
| [HANDOFF-NFE.md](handoffs/HANDOFF-NFE.md) | ⛔ **Superado** em 04/08/2026 pelo BYO. Mantido como histórico da decisão. |

## 🗺️ Roadmaps — o que construir

| Documento | O que cobre |
|---|---|
| [GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md) | **Meta em vigor:** 1º cliente pagante até 01/11/2026. Critérios G1..G8. |
| [QUICK-START.md](roadmaps/QUICK-START.md) | Plano de 7 dias para sair do zero. |
| [MVP-ERP-MODULES.md](roadmaps/MVP-ERP-MODULES.md) | Módulos funcionais do ERP em 14 dias. |
| [site-institucional.md](roadmaps/site-institucional.md) | Landing page → site institucional completo (9 fases). |
| [01-autenticacao.md](roadmaps/01-autenticacao.md) | Fase 2 — NextAuth + OAuth. |
| [02-database-setup.md](roadmaps/02-database-setup.md) | Fase 3 — PostgreSQL + Prisma. |
| [03-checkout-pagamentos.md](roadmaps/03-checkout-pagamentos.md) | Fase 4 — Stripe + webhooks. |
| [SUBSCRIPTION_SYSTEM.md](roadmaps/SUBSCRIPTION_SYSTEM.md) | Trial de 30 dias + assinatura paga. |
| [SEO_ROADMAP.md](roadmaps/SEO_ROADMAP.md) | Visibilidade em buscadores e em IA. |
| [ROADMAP_PRODUTO_UX_UPGRADE.md](roadmaps/ROADMAP_PRODUTO_UX_UPGRADE.md) | ✅ Concluído — upgrade UX/UI da página /produto. |
| [README.md](roadmaps/README.md) | Índice antigo, só dos roadmaps do site institucional. |

## ⚙️ Setup — como rodar e configurar

| Documento | O que cobre |
|---|---|
| [SETUP.md](setup/SETUP.md) | Setup inicial do projeto. Comece aqui. |
| [SETUP-DATABASE.md](setup/SETUP-DATABASE.md) | Banco: Supabase/PostgreSQL + Prisma. |
| [GROQ_AI_SETUP.md](setup/GROQ_AI_SETUP.md) | Chaves e config do assistente de IA (Groq). |
| [NOTIFICATIONS_SETUP.md](setup/NOTIFICATIONS_SETUP.md) | Emails automáticos (Resend) e notificações. |

## 📐 Specs e análises

| Documento | O que cobre |
|---|---|
| [spec-tecnica-orion.md](specs/spec-tecnica-orion.md) | Especificação técnica + prompt de execução (16/08/2026). |
| [DOSSIE-ORION-NOTEBOOKLM.md](specs/DOSSIE-ORION-NOTEBOOKLM.md) | Dossiê executivo: escopo real, arquitetura, design system, dívidas de UX. |
| [AI_DATABASE_INTEGRATION.md](specs/AI_DATABASE_INTEGRATION.md) | Como a Orion AI lê o banco para responder com dados do cliente. |
| [ONBOARDING_SAMPLE_DATA.md](specs/ONBOARDING_SAMPLE_DATA.md) | Onboarding interativo e dados de exemplo. |
| [DEMO_INTERATIVA_SPEC.md](specs/DEMO_INTERATIVA_SPEC.md) | Tour interativo de 10-15s do dashboard. |
| [BENCHMARK_PRECIFICACAO_ERP.md](specs/BENCHMARK_PRECIFICACAO_ERP.md) | Preço do Orion vs ERPs concorrentes no Brasil. |

## 🔗 Referência

| Documento | O que cobre |
|---|---|
| [urls.md](urls.md) | Inventário de todas as rotas/URLs do sistema. |
