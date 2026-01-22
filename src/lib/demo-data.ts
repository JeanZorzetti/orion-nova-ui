import { DemoConfig } from "@/types/demo";

// Interactive Demo configuration with real screenshots
export const orionDemoConfig: DemoConfig = {
  steps: [
    {
      id: "dashboard",
      title: "Dashboard Centralizado",
      description:
        "Todos os KPIs do seu negócio em uma única tela. Vendas, clientes, estoque e financeiro.",
      highlight: "Atualizações em tempo real",
      screenshot: "/images/dash.webp",
      hotspots: [
        {
          id: "dashboard-kpis",
          x: 50,
          y: 20,
          label: "📊 Visão Geral",
          pulseColor: "bg-green-400",
        },
      ],
      duration: 3000, // 3 seconds
    },
    {
      id: "clientes",
      title: "Gestão de Clientes 360°",
      description:
        "Cadastro completo, histórico de compras e interações. Segmentação inteligente para campanhas direcionadas.",
      highlight: "Importação em massa de dados",
      screenshot: "/images/clientes.webp",
      hotspots: [
        {
          id: "clientes-list",
          x: 50,
          y: 50,
          label: "👥 Clientes",
          pulseColor: "bg-blue-400",
        },
      ],
      duration: 3000,
    },
    {
      id: "vendas",
      title: "Funil de Vendas Visual",
      description:
        "Acompanhe cada oportunidade desde o primeiro contato até o fechamento. Gestão completa do ciclo de vendas.",
      highlight: "Orçamentos e comissões automáticas",
      screenshot: "/images/vendas.webp",
      hotspots: [
        {
          id: "vendas-funil",
          x: 50,
          y: 50,
          label: "🛒 Vendas",
          pulseColor: "bg-purple-400",
        },
      ],
      duration: 3000,
    },
    {
      id: "financeiro",
      title: "Controle Financeiro Total",
      description:
        "Contas a pagar e receber, fluxo de caixa projetado e DRE automático. Conciliação bancária integrada.",
      highlight: "Dashboards financeiros em tempo real",
      screenshot: "/images/financeiro.webp",
      hotspots: [
        {
          id: "financeiro-dashboard",
          x: 50,
          y: 50,
          label: "💰 Financeiro",
          pulseColor: "bg-yellow-400",
        },
      ],
      duration: 3000,
    },
  ],
  autoPlay: true,
  loop: false,
  accentColor: "text-green-400",
  // Analytics are handled directly in InteractiveDemo component
};
