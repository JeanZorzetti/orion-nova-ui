# Roadmap de SEO - Orion ERP 2026

**Baseado nas melhores práticas de SEO 2026**
**Data de criação:** 17/01/2026
**Objetivo:** Otimizar o Orion ERP para máxima visibilidade em buscadores e IA

---

## 🎯 Objetivos do Roadmap

- [ ] Implementar SEO técnico completo (Next.js 15 Metadata API)
- [ ] Otimizar para AI Overviews e GEO (Generative Engine Optimization)
- [ ] Alcançar 100/100 no Lighthouse SEO Score
- [ ] Implementar Schema.org (JSON-LD) para SaaS/ERP
- [ ] Criar estratégia de conteúdo (E-E-A-T)
- [ ] Monitorar e iterar continuamente

---

## Fase 1: Fundação Técnica (SEO On-Page) ⚙️

### 1.1 Metadata API - Next.js 15
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 2-3 dias

**Tarefas:**
- [ ] Criar arquivo `src/lib/seo.ts` com configurações centralizadas
- [ ] Implementar metadata estático em todas as páginas públicas
  - [ ] / (homepage)
  - [ ] /login
  - [ ] /register
  - [ ] /sobre
  - [ ] /recursos
  - [ ] /precos
  - [ ] /contato
  - [ ] /blog
- [ ] Implementar `generateMetadata()` dinâmico para:
  - [ ] Posts do blog (`/blog/[slug]`)
  - [ ] Páginas de recursos específicos
- [ ] Configurar Open Graph tags (Facebook, LinkedIn)
- [ ] Configurar Twitter Cards
- [ ] Implementar favicons e app icons

**Checklist de Metadata:**
```typescript
✅ title (max 60 caracteres)
✅ description (max 160 caracteres)
✅ keywords (palavras-chave relevantes)
✅ og:title, og:description, og:image
✅ twitter:card, twitter:title, twitter:description
✅ canonical URL
✅ robots (index, follow)
✅ language (pt-BR)
```

---

### 1.2 Sitemap.xml Dinâmico
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Criar `src/app/sitemap.ts` com geração dinâmica
- [ ] Incluir todas as páginas estáticas
- [ ] Incluir posts do blog dinamicamente (fetch do DB)
- [ ] Configurar prioridades e frequências de atualização
- [ ] Testar em `https://orion.roilabs.com.br/sitemap.xml`

**Exemplo de prioridades:**
- Homepage: 1.0, daily
- Páginas principais: 0.8, weekly
- Blog posts: 0.6, monthly
- Páginas secundárias: 0.4, monthly

---

### 1.3 Robots.txt Otimizado
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** 30 minutos

**Tarefas:**
- [ ] Criar `src/app/robots.ts`
- [ ] Permitir todos os bots (Google, Bing, etc.)
- [ ] Bloquear apenas `/dashboard/*` e `/api/*`
- [ ] Referenciar sitemap.xml
- [ ] Testar em `https://orion.roilabs.com.br/robots.txt`

---

### 1.4 Canonical URLs
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Adicionar canonical URLs em todos os metadados
- [ ] Evitar conteúdo duplicado
- [ ] Configurar redirects 301 para versões antigas de URLs

---

## Fase 2: Schema.org Structured Data (JSON-LD) 📊

### 2.1 Schema para Homepage
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Implementar `Organization` schema
- [ ] Implementar `SoftwareApplication` schema
- [ ] Incluir informações: nome, logo, URL, descrição, contato
- [ ] Validar com Google Rich Results Test

**Schemas a implementar:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Orion ERP",
  "url": "https://orion.roilabs.com.br",
  "logo": "https://orion.roilabs.com.br/logo.png",
  "description": "Sistema completo de gestão empresarial (ERP) com IA integrada",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BR"
  }
}
```

---

### 2.2 Schema para Produto/Software
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Implementar `SoftwareApplication` schema
- [ ] Incluir: nome, categoria, sistema operacional, preço
- [ ] Adicionar `AggregateRating` (quando houver reviews)
- [ ] Adicionar `Offers` com pricing

---

### 2.3 Schema para Blog Posts
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Implementar `BlogPosting` ou `Article` schema
- [ ] Incluir: headline, datePublished, dateModified, author, image
- [ ] Adicionar `Person` schema para autores

---

### 2.4 Schema para FAQ
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** 4 horas

**Tarefas:**
- [ ] Criar página de FAQ
- [ ] Implementar `FAQPage` schema
- [ ] Incluir perguntas/respostas estruturadas

---

### 2.5 Schema para Breadcrumbs
**Status:** 🔴 Não iniciado
**Prioridade:** Baixa
**Tempo estimado:** 2 horas

**Tarefas:**
- [ ] Implementar `BreadcrumbList` schema
- [ ] Integrar com componente Breadcrumbs existente

---

## Fase 3: Performance & Core Web Vitals 🚀

### 3.1 Otimização de Imagens
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Usar `next/image` em todas as imagens
- [ ] Configurar `sizes` e `priority` adequadamente
- [ ] Converter imagens para WebP/AVIF
- [ ] Implementar lazy loading
- [ ] Adicionar `alt` text descritivo em todas as imagens

---

### 3.2 Otimização de Fontes
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** 2 horas

**Tarefas:**
- [ ] Usar `next/font` para Google Fonts
- [ ] Implementar `font-display: swap`
- [ ] Reduzir peso de fontes (apenas pesos necessários)

---

### 3.3 Otimização de JavaScript
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 2 dias

**Tarefas:**
- [ ] Auditar bundle size com `@next/bundle-analyzer`
- [ ] Implementar code splitting estratégico
- [ ] Usar `dynamic()` para componentes pesados
- [ ] Minimizar third-party scripts
- [ ] Implementar Server Components onde possível

---

### 3.4 Lighthouse Score
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** Contínuo

**Metas:**
- [ ] Performance: 90+
- [ ] Accessibility: 100
- [ ] Best Practices: 100
- [ ] SEO: 100

**Core Web Vitals:**
- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1

---

## Fase 4: Conteúdo & E-E-A-T 📝

### 4.1 Criar Blog
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 3 dias

**Tarefas:**
- [ ] Criar estrutura do blog (`/blog`, `/blog/[slug]`)
- [ ] Implementar CMS (Prisma + Admin UI) ou usar MDX
- [ ] Criar categorias: ERP, Gestão Empresarial, Tecnologia, Tutoriais
- [ ] Criar página de autor com bio e foto

**Tipos de conteúdo:**
- Guias completos (ex: "Como escolher um ERP")
- Comparações (ex: "Orion ERP vs Concorrentes")
- Tutoriais (ex: "Como usar a IA do Orion")
- Case studies (ex: "Empresa X aumentou 50% de eficiência")
- News/Updates (ex: "Novos recursos Orion 2.0")

---

### 4.2 Demonstrar E-E-A-T
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** Contínuo

**Experience (Experiência):**
- [ ] Adicionar seção "Sobre a equipe" com credenciais
- [ ] Mostrar anos de experiência em ERP
- [ ] Incluir certificações relevantes

**Expertise (Especialização):**
- [ ] Criar conteúdo técnico de alta qualidade
- [ ] Demonstrar conhecimento profundo em gestão empresarial
- [ ] Publicar whitepapers e estudos de caso

**Authoritativeness (Autoridade):**
- [ ] Conseguir backlinks de sites respeitáveis
- [ ] Ser mencionado em publicações do setor
- [ ] Participar de eventos e conferências

**Trustworthiness (Confiabilidade):**
- [ ] Adicionar página "Política de Privacidade"
- [ ] Adicionar página "Termos de Uso"
- [ ] Mostrar certificações de segurança (SSL, etc.)
- [ ] Incluir depoimentos e avaliações de clientes
- [ ] Transparência em preços e condições

---

### 4.3 Freshness (Atualização)
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** Contínuo

**Tarefas:**
- [ ] Publicar novo conteúdo semanalmente
- [ ] Atualizar páginas existentes mensalmente
- [ ] Adicionar data de "Última atualização" em posts
- [ ] Criar changelog público de atualizações do sistema

---

## Fase 5: GEO - Generative Engine Optimization 🤖

### 5.1 Otimização para AI Overviews
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 2 dias

**Tarefas:**
- [ ] Estruturar conteúdo com perguntas e respostas claras
- [ ] Usar headings (H1, H2, H3) semanticamente corretos
- [ ] Criar listas e tabelas quando aplicável
- [ ] Adicionar sumários executivos no início de artigos longos
- [ ] Usar linguagem clara e direta

**Exemplo de estrutura otimizada:**
```markdown
# O que é um ERP?

Um ERP (Enterprise Resource Planning) é um sistema de gestão empresarial que...

## Principais benefícios de um ERP:
1. Centralização de dados
2. Automação de processos
3. Redução de custos
...
```

---

### 5.2 Otimização para ChatGPT/Claude/Gemini
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Criar FAQ com perguntas comuns sobre ERP
- [ ] Estruturar conteúdo para ser facilmente citável
- [ ] Adicionar estatísticas e dados concretos
- [ ] Incluir definições claras de termos técnicos

---

### 5.3 Otimização para Plataformas Sociais
**Status:** 🔴 Não iniciado
**Prioridade:** Baixa
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Criar conteúdo para YouTube (tutoriais em vídeo)
- [ ] Criar shorts/reels sobre funcionalidades
- [ ] Responder perguntas no Reddit (r/ERP, r/smallbusiness)
- [ ] Publicar dicas rápidas no LinkedIn

---

## Fase 6: Link Building & Autoridade 🔗

### 6.1 Backlinks de Qualidade
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** Contínuo

**Estratégias:**
- [ ] Guest posting em blogs de gestão empresarial
- [ ] Parcerias com influenciadores do setor
- [ ] Listagem em diretórios de SaaS (G2, Capterra, GetApp)
- [ ] Press releases sobre novos recursos
- [ ] Participação em fóruns e comunidades

---

### 6.2 Link Internos
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Criar estrutura de links internos entre páginas relacionadas
- [ ] Usar anchor text descritivo
- [ ] Criar hub pages (páginas pilares)
- [ ] Implementar "Related Posts" no blog

---

## Fase 7: Monitoramento & Analytics 📊

### 7.1 Google Search Console
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 1 hora

**Tarefas:**
- [ ] Configurar Google Search Console
- [ ] Submeter sitemap.xml
- [ ] Verificar propriedade do site
- [ ] Monitorar erros de crawling
- [ ] Analisar queries e impressões semanalmente

---

### 7.2 Google Analytics 4
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 2 horas

**Tarefas:**
- [ ] Configurar Google Analytics 4
- [ ] Implementar eventos personalizados
- [ ] Criar funis de conversão
- [ ] Monitorar tráfego orgânico vs pago
- [ ] Configurar relatórios customizados

---

### 7.3 Ferramentas SEO
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** Variável

**Ferramentas recomendadas:**
- [ ] Ahrefs ou SEMrush (análise de concorrentes)
- [ ] Screaming Frog (auditoria técnica)
- [ ] PageSpeed Insights (performance)
- [ ] Schema Markup Validator
- [ ] Google Rich Results Test

---

## Fase 8: Local SEO (Brasil) 🇧🇷

### 8.1 Google Business Profile
**Status:** 🔴 Não iniciado
**Prioridade:** Média
**Tempo estimado:** 2 horas

**Tarefas:**
- [ ] Criar perfil no Google Business
- [ ] Adicionar endereço, telefone, horário
- [ ] Solicitar avaliações de clientes
- [ ] Postar atualizações regulares

---

### 8.2 Localização
**Status:** 🔴 Não iniciado
**Prioridade:** Baixa
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Criar páginas específicas por região (se aplicável)
- [ ] Adicionar schema `LocalBusiness` se tiver escritório físico
- [ ] Usar português brasileiro em todo o conteúdo
- [ ] Referenciar legislação brasileira (Simples Nacional, SPED, etc.)

---

## Fase 9: Renderização & Indexação ⚡

### 9.1 Estratégia de Renderização
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 2 dias

**Decisões:**
- **SSG (Static Site Generation):** Homepage, Blog, Páginas de Marketing
- **ISR (Incremental Static Regeneration):** Posts do Blog (revalidate: 3600)
- **SSR (Server-Side Rendering):** Páginas dinâmicas (se necessário)
- **CSR (Client-Side Rendering):** Dashboard (não indexado)

**Tarefas:**
- [ ] Auditar todas as páginas públicas
- [ ] Implementar renderização adequada para cada tipo
- [ ] Testar com "Disable JavaScript" para verificar SSR/SSG

---

### 9.2 Prerendering
**Status:** 🔴 Não iniciado
**Prioridade:** Baixa
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Considerar prerendering.io ou similar (se necessário)
- [ ] Verificar se Google consegue renderizar JavaScript
- [ ] Usar `fetch` cache strategy apropriada

---

## Fase 10: Segurança & Confiança 🔒

### 10.1 HTTPS & SSL
**Status:** ✅ Implementado
**Prioridade:** Crítica

**Verificar:**
- ✅ Certificado SSL válido
- ✅ Redirecionamento HTTP → HTTPS
- ✅ HSTS habilitado

---

### 10.2 Políticas & Termos
**Status:** 🔴 Não iniciado
**Prioridade:** Alta
**Tempo estimado:** 1 dia

**Tarefas:**
- [ ] Criar página "Política de Privacidade"
- [ ] Criar página "Termos de Uso"
- [ ] Criar página "Política de Cookies"
- [ ] Adicionar LGPD compliance (Lei Geral de Proteção de Dados)
- [ ] Linkar políticas no footer

---

## Checklist Final de Lançamento 🚀

Antes de considerar o SEO "completo", verificar:

**Técnico:**
- [ ] Sitemap.xml acessível e válido
- [ ] Robots.txt configurado corretamente
- [ ] Metadata em todas as páginas
- [ ] Schema.org JSON-LD implementado
- [ ] Canonical URLs configurados
- [ ] Lighthouse Score 90+ em todas as métricas
- [ ] Core Web Vitals dentro dos limites
- [ ] Mobile-friendly (responsive)
- [ ] SSL/HTTPS ativo

**Conteúdo:**
- [ ] Pelo menos 10 posts de blog publicados
- [ ] FAQ criada e otimizada
- [ ] Páginas "Sobre", "Contato", "Recursos"
- [ ] Depoimentos/reviews de clientes
- [ ] Case studies ou estudos de caso

**Monitoramento:**
- [ ] Google Search Console configurado
- [ ] Google Analytics 4 configurado
- [ ] Sitemap submetido ao GSC
- [ ] Primeiro relatório de performance gerado

**Legal:**
- [ ] Política de Privacidade publicada
- [ ] Termos de Uso publicados
- [ ] LGPD compliance

---

## Cronograma Sugerido 📅

| Fase | Tempo Estimado | Prioridade |
|------|----------------|------------|
| Fase 1: Fundação Técnica | 4-5 dias | ⭐⭐⭐ Alta |
| Fase 2: Schema.org | 3-4 dias | ⭐⭐⭐ Alta |
| Fase 3: Performance | 3-4 dias | ⭐⭐⭐ Alta |
| Fase 4: Conteúdo & E-E-A-T | 2 semanas | ⭐⭐⭐ Alta |
| Fase 5: GEO | 3-4 dias | ⭐⭐ Média |
| Fase 6: Link Building | Contínuo | ⭐⭐ Média |
| Fase 7: Monitoramento | 3 horas | ⭐⭐⭐ Alta |
| Fase 8: Local SEO | 3 horas | ⭐ Baixa |
| Fase 9: Renderização | 2-3 dias | ⭐⭐⭐ Alta |
| Fase 10: Segurança | 1 dia | ⭐⭐⭐ Alta |

**Total (implementação inicial):** 3-4 semanas
**Manutenção contínua:** Semanal/Mensal

---

## KPIs & Métricas de Sucesso 📈

**Curto Prazo (1-3 meses):**
- Lighthouse SEO Score: 100/100
- Páginas indexadas no Google: 50+
- Core Web Vitals: Todos "bons"
- Posts de blog publicados: 20+

**Médio Prazo (3-6 meses):**
- Tráfego orgânico: +100 visitantes/mês
- Posição média no Google: Top 20 para palavras-chave principais
- Backlinks de qualidade: 10+
- Taxa de rejeição: < 60%

**Longo Prazo (6-12 meses):**
- Tráfego orgânico: +500 visitantes/mês
- Posição média: Top 10 para palavras-chave principais
- Conversões orgânicas: 20+ trials/mês
- Domain Authority (DA): 30+

---

## Palavras-Chave Alvo 🎯

**Principais (Head Terms):**
- "ERP"
- "sistema ERP"
- "software de gestão empresarial"
- "ERP para pequenas empresas"
- "ERP online"

**Secundárias (Long Tail):**
- "melhor ERP para MEI"
- "ERP com inteligência artificial"
- "quanto custa um ERP"
- "ERP gratuito"
- "ERP vs planilhas"
- "como escolher um ERP"
- "ERP em nuvem Brasil"

**Localização:**
- "ERP São Paulo"
- "ERP Brasil"
- "sistema de gestão brasileiro"

---

## Recursos & Referências 📚

**Ferramentas:**
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/)

**Guias:**
- [Next.js SEO Guide](https://nextjs.org/learn/seo)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/docs/documents.html)

**Pesquisas realizadas:**
- [Google SEO Updates 2024–2025](https://www.saffronedge.com/blog/google-seo-updates/)
- [8 top SEO trends I'm seeing in 2026](https://www.marketermilk.com/blog/seo-trends-2026)
- [Next.js 15 SEO Complete Guide](https://medium.com/@thomasaugot/the-complete-guide-to-seo-optimization-in-next-js-15-1bdb118cffd7)
- [Schema Markup in 2026](https://almcorp.com/blog/schema-markup-detailed-guide-2026-serp-visibility/)

---

**Última atualização:** 17/01/2026
**Próxima revisão:** 17/02/2026
