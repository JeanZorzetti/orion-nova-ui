import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Cloud,
  Lock,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.produto;

const modules = [
  {
    icon: Users,
    title: "Gestão de Clientes",
    description:
      "Cadastro completo de clientes PF e PJ, histórico de compras, e relacionamento centralizado.",
    features: [
      "Cadastro completo (PF/PJ)",
      "Histórico de interações",
      "Segmentação inteligente",
      "Importação em massa",
    ],
  },
  {
    icon: Package,
    title: "Controle de Estoque",
    description:
      "Gerencie produtos, categorias, fornecedores e movimentações com alertas automáticos.",
    features: [
      "Alertas de estoque baixo",
      "Múltiplos almoxarifados",
      "Código de barras/SKU",
      "Inventário automático",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Vendas e Pedidos",
    description:
      "Crie orçamentos, pedidos de venda, e acompanhe todo o funil comercial em tempo real.",
    features: [
      "Orçamentos rápidos",
      "Funil de vendas",
      "Comissões automáticas",
      "Integração com estoque",
    ],
  },
  {
    icon: DollarSign,
    title: "Financeiro Completo",
    description:
      "Contas a pagar e receber, fluxo de caixa, conciliação bancária e DRE automatizado.",
    features: [
      "Contas a pagar/receber",
      "Fluxo de caixa",
      "Conciliação bancária",
      "DRE automático",
    ],
  },
  {
    icon: BarChart3,
    title: "Relatórios e BI",
    description:
      "Dashboards interativos, KPIs em tempo real, e relatórios personalizados para sua gestão.",
    features: [
      "Dashboards interativos",
      "KPIs em tempo real",
      "Exportação PDF/Excel",
      "Relatórios customizados",
    ],
  },
  {
    icon: Sparkles,
    title: "IA Integrada",
    description:
      "Assistente inteligente que analisa seus dados e fornece insights personalizados para seu negócio.",
    features: [
      "Análise de dados",
      "Previsões de vendas",
      "Alertas proativos",
      "Recomendações",
    ],
  },
];

const benefits = [
  {
    icon: Cloud,
    title: "100% na Nuvem",
    description: "Acesse de qualquer lugar, a qualquer momento. Sem instalação.",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Dados criptografados, backup automático e LGPD compliant.",
  },
  {
    icon: Zap,
    title: "Ultra Rápido",
    description: "Performance otimizada com infraestrutura de última geração.",
  },
  {
    icon: RefreshCw,
    title: "Atualizações Automáticas",
    description: "Sempre na versão mais recente sem custo adicional.",
  },
  {
    icon: Lock,
    title: "Controle de Acesso",
    description: "Defina permissões por usuário e função na empresa.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Responsivo e otimizado para uso em tablets e smartphones.",
  },
];

export default function ProdutoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                ERP com Inteligência Artificial
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Conheça o{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                  Orion ERP
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                O sistema de gestão empresarial mais completo do mercado, com IA integrada
                que entende seu negócio e ajuda você a tomar decisões mais inteligentes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/cadastro">
                    Começar Grátis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/precos">
                    Ver Planos e Preços
                  </Link>
                </Button>
              </div>
            </div>

            {/* Product Screenshot */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
              <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl border border-border p-4 md:p-8">
                <div className="aspect-video bg-muted rounded-xl overflow-hidden relative">
                  <Image
                    src="/images/image.png"
                    alt="Dashboard do Orion ERP - Interface moderna com gráficos, KPIs e módulos de gestão"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Módulos Completos para Sua Empresa
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tudo que você precisa para gerenciar seu negócio em uma única plataforma integrada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <module.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <ul className="space-y-2">
                    {module.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Por Que Escolher o Orion ERP?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Benefícios que fazem a diferença na sua operação diária.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para Transformar sua Gestão?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Comece agora com 30 dias grátis. Sem cartão de crédito, sem compromisso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/cadastro">
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
                  <Link href="/contato">Falar com Vendas</Link>
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
