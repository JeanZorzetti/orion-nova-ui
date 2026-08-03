import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Sparkles,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  FileText,
  Bell,
  Shield,
  Zap,
  Globe,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Database,
  Cloud,
  Bot,
  Receipt,
  CreditCard,
  TrendingUp,
  PieChart,
  Calendar,
  Mail,
  Plug,
  Settings,
  Lock,
  RefreshCw,
} from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.features;

const mainModules = [
  {
    icon: Users,
    title: "Gestão de Clientes (CRM)",
    description: "Cadastro completo e relacionamento centralizado com seus clientes.",
    features: [
      "Cadastro completo PF e PJ",
      "Histórico de compras e interações",
      "Segmentação por perfil e comportamento",
      "Importação em massa via CSV/Excel",
      "Campos personalizados",
      "Tags e categorização",
      "Geolocalização de clientes",
      "Análise de CLV (Customer Lifetime Value)",
    ],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Package,
    title: "Controle de Estoque",
    description: "Gerencie produtos, categorias e movimentações com precisão.",
    features: [
      "Cadastro ilimitado de produtos",
      "Múltiplos almoxarifados",
      "Código de barras e SKU",
      "Alertas de estoque baixo",
      "Inventário automático",
      "Controle de lotes e validade",
      "Curva ABC de produtos",
      "Histórico de movimentações",
    ],
    color: "from-green-500 to-green-600",
  },
  {
    icon: ShoppingCart,
    title: "Vendas e Pedidos",
    description: "Funil de vendas completo com orçamentos e pedidos.",
    features: [
      "Orçamentos rápidos",
      "Conversão orçamento → pedido",
      "Funil de vendas visual",
      "Comissões automáticas",
      "Múltiplas formas de pagamento",
      "Descontos e promoções",
      "Integração com estoque",
      "Histórico por vendedor",
    ],
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: DollarSign,
    title: "Financeiro Completo",
    description: "Controle total das finanças do seu negócio.",
    features: [
      "Contas a pagar e receber",
      "Fluxo de caixa projetado",
      "Conciliação bancária",
      "DRE automático",
      "Centro de custos",
      "Rateio de despesas",
      "Boletos e cobranças",
      "Integração bancária (Open Banking)",
    ],
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Relatórios e BI",
    description: "Dashboards interativos e métricas em tempo real.",
    features: [
      "Dashboards personalizados",
      "KPIs em tempo real",
      "Relatórios de vendas",
      "Análise de rentabilidade",
      "Exportação PDF/Excel",
      "Agendamento de relatórios",
      "Comparativos de período",
      "Gráficos interativos",
    ],
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Sparkles,
    title: "IA Integrada (Orion AI)",
    description: "Assistente inteligente que entende seu negócio.",
    features: [
      "Análise de dados em linguagem natural",
      "Previsões de vendas",
      "Alertas proativos",
      "Recomendações personalizadas",
      "Detecção de anomalias",
      "Insights de mercado",
      "Automação de tarefas",
      "Chatbot para clientes",
    ],
    color: "from-violet-500 to-violet-600",
  },
];

const additionalFeatures = [
  {
    icon: Receipt,
    title: "Emissão de NF-e/NFS-e",
    description: "Emita notas fiscais eletrônicas diretamente do sistema.",
  },
  {
    icon: CreditCard,
    title: "PDV (Ponto de Venda)",
    description: "Sistema de caixa completo para vendas presenciais.",
  },
  {
    icon: Calendar,
    title: "Agendamentos",
    description: "Gestão de agenda para serviços e compromissos.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Envie campanhas segmentadas para seus clientes.",
  },
  {
    icon: FileText,
    title: "Contratos",
    description: "Gestão de contratos com assinatura digital.",
  },
  {
    icon: Bell,
    title: "Notificações",
    description: "Alertas por email e push.",
  },
  {
    icon: TrendingUp,
    title: "Metas de Vendas",
    description: "Defina e acompanhe metas por vendedor ou equipe.",
  },
  {
    icon: PieChart,
    title: "Análise de Custos",
    description: "Custeio de produtos e análise de margem.",
  },
  {
    icon: Database,
    title: "Backup Automático",
    description: "Seus dados sempre seguros com backups diários.",
  },
  {
    icon: Lock,
    title: "Controle de Acesso",
    description: "Permissões por usuário, função e módulo.",
  },
  {
    icon: RefreshCw,
    title: "Atualizações Automáticas",
    description: "Sempre na versão mais recente sem custo extra.",
  },
];

const integrations = [
  { name: "Mercado Livre", category: "Marketplace" },
  { name: "Shopee", category: "Marketplace" },
  { name: "Amazon", category: "Marketplace" },
  { name: "Magalu", category: "Marketplace" },
  { name: "iFood", category: "Delivery" },
  { name: "Rappi", category: "Delivery" },
  { name: "99Food", category: "Delivery" },
  { name: "Aiqfome", category: "Delivery" },
  { name: "Stripe", category: "Pagamento" },
  { name: "Mercado Pago", category: "Pagamento" },
  { name: "PagSeguro", category: "Pagamento" },
  { name: "Pix", category: "Pagamento" },
  { name: "Correios", category: "Logística" },
  { name: "Jadlog", category: "Logística" },
  { name: "Melhor Envio", category: "Logística" },
  { name: "Loggi", category: "Logística" },
  { name: "Google Analytics", category: "Analytics" },
  { name: "Meta Pixel", category: "Analytics" },
  { name: "RD Station", category: "Marketing" },
  { name: "Mailchimp", category: "Marketing" },
];

const techFeatures = [
  {
    icon: Cloud,
    title: "100% na Nuvem",
    description: "Acesse de qualquer lugar, a qualquer momento, sem instalação.",
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Criptografia de ponta, LGPD compliant, certificações ISO.",
  },
  {
    icon: Zap,
    title: "Alta Performance",
    description: "Infraestrutura global com resposta em milissegundos.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Interface otimizada para tablets e smartphones.",
  },
  {
    icon: Globe,
    title: "Multi-idioma",
    description: "Suporte a português, inglês e espanhol.",
  },
  {
    icon: Bot,
    title: "API Completa",
    description: "Integre com qualquer sistema via REST API.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Funcionalidades Completas
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tudo que Você Precisa em{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                Uma Plataforma
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              O Orion ERP oferece mais de 100 funcionalidades integradas para você
              gerenciar seu negócio de forma completa e eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Começar Grátis (30 dias)
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/produto">Ver Demonstração</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Modules */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Módulos Principais
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cada módulo foi desenvolvido para atender às necessidades específicas
                da gestão empresarial moderna.
              </p>
            </div>

            <div className="space-y-8">
              {mainModules.map((module, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                        <module.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                      <p className="text-muted-foreground">{module.description}</p>
                    </div>
                    <div className="lg:w-2/3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {module.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Recursos Adicionais
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Além dos módulos principais, o Orion ERP oferece dezenas de recursos
                extras para potencializar sua operação.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <Plug className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Integrações</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                +50 Integrações Disponíveis
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Conecte o Orion ERP com as principais plataformas do mercado.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-card border border-border rounded-full hover:border-primary/50 transition-colors"
                >
                  <span className="text-sm font-medium">{integration.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {integration.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Não encontrou a integração que precisa?
              </p>
              <Button variant="outline" asChild>
                <Link href="/contato">
                  <Settings className="w-4 h-4 mr-2" />
                  Solicitar Integração
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tecnologia de Ponta
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Infraestrutura moderna para garantir segurança, performance e
                disponibilidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {techFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Experimente Todas as Funcionalidades
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Comece seu trial gratuito de 30 dias com acesso completo a todos os
                recursos. Sem cartão de crédito, sem compromisso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/register">
                    Criar Conta Grátis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/precos">Ver Planos e Preços</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
