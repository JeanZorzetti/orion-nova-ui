# 🎯 Especificação da Demo Interativa - Orion ERP

**Objetivo:** Tour interativo de 10-15 segundos mostrando principais funcionalidades do dashboard.

**Impacto Esperado:** +32% conversão, engajamento 3-5x maior.

---

## 1. User Journey da Demo

### Flow Principal (4 etapas)

```
Início
  ↓
[1] Dashboard Overview (3s)
  → Hotspot: "Visão Geral"
  → Mostra: KPIs principais, gráficos, menu lateral
  ↓
[2] Módulo Clientes (3s)
  → Hotspot: "Clientes"
  → Mostra: Lista de clientes, filtros, ações rápidas
  ↓
[3] Módulo Vendas (3s)
  → Hotspot: "Vendas"
  → Mostra: Funil de vendas, pedidos recentes
  ↓
[4] Módulo Financeiro (3s)
  → Hotspot: "Financeiro"
  → Mostra: Fluxo de caixa, DRE simplificado
  ↓
Loop ou CTA
```

**Duração Total:** 12 segundos (4 etapas × 3s)

---

## 2. Hotspots Detalhados

### Hotspot 1: Dashboard Overview
- **Posição:** Centro superior (menu lateral)
- **Label:** "📊 Visão Geral"
- **Tooltip:**
  ```
  Título: Dashboard Centralizado
  Descrição: Todos os KPIs do seu negócio em uma única tela.
  Destaque: Atualizações em tempo real.
  ```
- **Elementos Visíveis:**
  - 4 cards de KPI (Vendas, Clientes, Estoque, Financeiro)
  - Gráfico de vendas (linha)
  - Menu lateral com módulos
  - Header com notificações

### Hotspot 2: Módulo Clientes
- **Posição:** Menu lateral esquerdo ou área central
- **Label:** "👥 Clientes"
- **Tooltip:**
  ```
  Título: Gestão de Clientes 360°
  Descrição: Cadastro completo, histórico de compras e interações.
  Destaque: Segmentação inteligente e importação em massa.
  ```
- **Elementos Visíveis:**
  - Tabela de clientes (5 linhas)
  - Filtros (Status, Segmento)
  - Botões de ação (Novo, Importar, Exportar)
  - Preview de detalhes ao hover

### Hotspot 3: Módulo Vendas
- **Posição:** Menu lateral ou área de funil
- **Label:** "🛒 Vendas"
- **Tooltip:**
  ```
  Título: Funil de Vendas Visual
  Descrição: Acompanhe cada oportunidade desde o primeiro contato até o fechamento.
  Destaque: Orçamentos, pedidos e comissões automáticas.
  ```
- **Elementos Visíveis:**
  - Funil Kanban (Lead → Proposta → Negociação → Fechado)
  - Cards de oportunidades (com valor)
  - Total do funil visível
  - Filtro por vendedor

### Hotspot 4: Módulo Financeiro
- **Posição:** Menu lateral ou dashboard financeiro
- **Label:** "💰 Financeiro"
- **Tooltip:**
  ```
  Título: Controle Financeiro Total
  Descrição: Contas a pagar/receber, fluxo de caixa e DRE automático.
  Destaque: Conciliação bancária e dashboards financeiros.
  ```
- **Elementos Visíveis:**
  - Fluxo de caixa (gráfico de barras)
  - Contas a pagar/receber (resumo)
  - Saldo atual destacado
  - Próximos vencimentos

---

## 3. Screenshots Necessários

### Prioridade ALTA (mínimo viável)

1. **dashboard-overview.png** (1920×1080)
   - 4 KPIs no topo
   - Gráfico de vendas central
   - Menu lateral visível
   - Header com logo e notificações

2. **modulo-clientes.png** (1920×1080)
   - Tabela com 5-7 clientes
   - Filtros ativos
   - Botões de ação
   - Dados mascarados/fictícios

3. **modulo-vendas.png** (1920×1080)
   - Funil Kanban com cards
   - 3-4 oportunidades por coluna
   - Valores visíveis
   - Total do funil

4. **modulo-financeiro.png** (1920×1080)
   - Fluxo de caixa (últimos 6 meses)
   - Cards de resumo (a pagar, a receber, saldo)
   - Gráfico de receitas/despesas

### Prioridade BAIXA (melhorias futuras)

5. **estoque-overview.png** - Para expandir demo no futuro
6. **relatorios.png** - Para mostrar BI/Analytics

---

## 4. Estrutura de Dados (TypeScript)

```typescript
// types/demo.ts
export interface DemoStep {
  id: string;
  title: string;
  description: string;
  highlight: string;
  screenshot: string;
  hotspots: Hotspot[];
  duration: number; // milliseconds
}

export interface Hotspot {
  id: string;
  x: number; // % position (0-100)
  y: number; // % position (0-100)
  label: string;
  icon?: string;
  pulseColor: string;
  onClick: () => void;
}

export interface DemoConfig {
  steps: DemoStep[];
  autoPlay: boolean;
  loop: boolean;
  accentColor: string;
  onComplete?: () => void;
  onSkip?: () => void;
}
```

---

## 5. Copy e Microcopy

### Badges e Labels
- **Badge inicial:** "🎯 Experimente o Orion ERP"
- **Instrução:** "Clique nos pontos destacados para explorar"
- **Botão Skip:** "Pular demonstração"
- **Botão Restart:** "Assistir novamente ↻"
- **Botão CTA final:** "Começar teste grátis →"

### Tooltips (formatação)
```
[Ícone] Título
Descrição de 1-2 linhas explicando o módulo.
✨ Destaque: Funcionalidade principal ou diferencial.
```

### Progress Indicator
```
Etapa 1 de 4  [====    ]
```

---

## 6. Animações e Transições

### Transições entre screenshots
- **Tipo:** Crossfade (fade-out + fade-in)
- **Duração:** 500ms
- **Easing:** cubic-bezier(0.25, 0.1, 0.25, 1) (The ROI Flow)

### Hotspot pulse
```tsx
// Framer Motion variant
const pulseVariant = {
  idle: { scale: 1, opacity: 0.8 },
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}
```

### Tooltip appear
- **Entrada:** Fade + slide up (20px)
- **Duração:** 300ms
- **Delay:** 100ms após click

### Progress bar
- **Tipo:** Width transition
- **Duração:** Sincronizada com duration da etapa
- **Easing:** linear

---

## 7. Estados da Demo

### Estado 1: Idle (não iniciado)
- Screenshot do dashboard com overlay escuro (opacity: 0.3)
- Botão grande: "▶ Iniciar Tour" (centro)
- Badge no topo: "Demo interativa - 12 segundos"

### Estado 2: Playing (em andamento)
- Screenshot atual visível
- Hotspot pulsando
- Tooltip visível após 500ms
- Progress bar no topo
- Botão "Pular" no canto superior direito

### Estado 3: Completed (finalizado)
- Screenshot final (Financeiro)
- Overlay com mensagem de sucesso
- CTAs principais:
  - "Começar teste grátis" (primary)
  - "Falar com vendas" (secondary)
  - "Assistir novamente ↻" (ghost)

### Estado 4: Paused (usuário pausou)
- Screenshot congelado
- Botão "▶ Continuar" no centro
- Progress bar pausada
- Tooltip permanece visível

---

## 8. Responsividade

### Desktop (>1024px)
- Layout full: 1920×1080 scaled to fit
- Hotspots visíveis e clicáveis
- Tooltips aparecem ao lado do hotspot

### Tablet (768-1023px)
- Screenshot scaled down (aspect ratio mantido)
- Hotspots maiores (touch-friendly: min 44px)
- Tooltips aparecem acima/abaixo (não lateral)

### Mobile (<768px)
- Demo simplificada: 2 etapas (Dashboard + Clientes)
- Hotspots centralizados
- Tooltips fullwidth (bottom sheet)
- Auto-play desabilitado (apenas manual)

---

## 9. Analytics Events

### Eventos a rastrear (GA4)

```javascript
// Início da demo
gtag('event', 'demo_started', {
  event_category: 'engagement',
  event_label: 'interactive_demo',
  page_location: '/produto'
});

// Hotspot clicado
gtag('event', 'demo_hotspot_clicked', {
  event_category: 'engagement',
  event_label: step.id, // 'dashboard', 'clientes', etc.
  step_number: currentStep
});

// Demo completada
gtag('event', 'demo_completed', {
  event_category: 'engagement',
  time_spent: elapsedTime,
  completed_steps: completedSteps.length
});

// Demo pulada
gtag('event', 'demo_skipped', {
  event_category: 'engagement',
  step_skipped_at: currentStep,
  time_before_skip: elapsedTime
});

// CTA clicado após demo
gtag('event', 'cta_clicked_after_demo', {
  event_category: 'conversion',
  event_label: ctaType, // 'trial' ou 'sales'
  completed_demo: true
});
```

---

## 10. Fallbacks e Edge Cases

### Sem JavaScript
- Mostra screenshot estático do dashboard
- Mantém CTAs principais visíveis
- Link para vídeo demo alternativo

### Navegadores antigos
- Detectar suporte a Framer Motion
- Fallback para CSS transitions simples
- Tooltip sem animações complexas

### Performance ruim
- Desabilitar animações complexas
- Crossfade simples (opacity apenas)
- Pulse mais lento (3s ao invés de 2s)

### Erro ao carregar screenshots
- Placeholder com ícone e mensagem
- "Visualização temporariamente indisponível"
- CTA alternativo: "Ver vídeo demo"

---

## 11. Checklist de Implementação

### Fase 1: Setup (Dia 1)
- [ ] Criar pasta `components/demos/`
- [ ] Criar types em `types/demo.ts`
- [ ] Setup de screenshot placeholder (antes de ter imagens reais)

### Fase 2: Componentes Base (Dias 2-3)
- [ ] `InteractiveDemo.tsx` (container principal)
- [ ] `DemoHotspot.tsx` (pontos clicáveis)
- [ ] `DemoTooltip.tsx` (dicas contextuais)
- [ ] `DemoProgressBar.tsx` (indicador)

### Fase 3: Integração (Dia 4)
- [ ] Substituir screenshot em `/produto`
- [ ] Testar states (idle, playing, completed, paused)
- [ ] Ajustar responsividade

### Fase 4: Polish (Dia 5)
- [ ] Refinar animações
- [ ] Adicionar analytics
- [ ] Testes cross-browser

### Fase 5: Screenshots Reais (Dia 6)
- [ ] Capturar 4 screenshots do sistema
- [ ] Otimizar para Web (WebP, < 200KB cada)
- [ ] Substituir placeholders

### Fase 6: QA e Deploy (Dia 7)
- [ ] Testes finais (desktop, tablet, mobile)
- [ ] Verificar performance (60fps)
- [ ] Deploy e monitoramento

---

## 12. Métricas de Sucesso

### Após 7 dias
- [ ] Taxa de interação > 40%
- [ ] Tempo médio de engajamento > 30s
- [ ] Taxa de completude > 60%

### Após 30 dias
- [ ] Conversão demo → cadastro: +32%
- [ ] Tempo na página: de 45s para 2min+
- [ ] Taxa de rejeição: de 65% para <50%

---

**Status:** ✅ Especificação completa
**Próximo passo:** Implementar componentes base
**Responsável:** Equipe de desenvolvimento Orion ERP
**Data:** 2026-01-22
