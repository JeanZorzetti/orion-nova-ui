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
  Globe,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Database,
  Cloud,
  CreditCard,
  Search,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.features;

// Esta página é contrato: o que está escrito aqui, o cliente cobra depois.
// Cada bullet abaixo corresponde a uma tela ou rota que existe hoje — a lista
// anterior anunciava 17 features (NF-e, PDV, agenda, e-mail marketing, +50
// integrações) das quais a maioria nunca foi construída. O que falta está no
// roadmap, não aqui.
const mainModules = [
  {
    icon: Users,
    title: "Clientes",
    description: "Cadastro central de quem compra de você.",
    features: [
      "Pessoa física e jurídica",
      "CPF/CNPJ, telefone e e-mail",
      "Endereço completo",
      "Observações por cliente",
      "Busca e filtro por status",
      "Histórico de pedidos do cliente",
    ],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Package,
    title: "Produtos e Serviços",
    description: "Um cadastro só para o que você vende.",
    features: [
      "Produtos e serviços no mesmo lugar",
      "Preço de venda e custo",
      "SKU e unidade de medida",
      "Categoria",
      "Quantidade em estoque e estoque mínimo",
      "Alerta quando o estoque fica abaixo do mínimo",
    ],
    color: "from-green-500 to-green-600",
  },
  {
    icon: ShoppingCart,
    title: "Vendas e Pedidos",
    description: "Do rascunho ao pedido pago.",
    features: [
      "Pedido com vários itens",
      "Desconto e total calculados",
      "Status do pedido (rascunho, confirmado, concluído)",
      "Status de pagamento separado",
      "Data de vencimento e data de pagamento",
      "Numeração automática de pedido",
    ],
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: DollarSign,
    title: "Financeiro",
    description: "Contas a pagar e a receber, com vencimento.",
    features: [
      "Lançamentos a pagar e a receber",
      "Categoria e descrição",
      "Vencimento e baixa de pagamento",
      "Vínculo com cliente e com pedido",
      "Status (pendente, pago, atrasado)",
      "Alertas de vencimento",
    ],
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Relatórios e Dashboard",
    description: "Três relatórios e um painel com os números do mês.",
    features: [
      "Relatório de vendas por período",
      "Relatório de clientes",
      "Relatório financeiro",
      "Exportação em CSV e PDF",
      "Dashboard com receitas, despesas e saldo",
      "Gráficos por período",
    ],
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Sparkles,
    title: "Orion AI",
    description: "Assistente que responde olhando os seus dados, não a internet.",
    features: [
      "Chat em linguagem natural",
      "Enxerga seus clientes, produtos, vendas e financeiro",
      "Perguntas sobre o seu próprio mês",
      "Orientação de gestão para PMEs brasileiras",
      "Diz o que o sistema não faz em vez de inventar",
    ],
    color: "from-violet-500 to-violet-600",
  },
];

const additionalFeatures = [
  {
    icon: RefreshCw,
    title: "Importação do seu ERP atual",
    description: "Traga clientes, produtos e vendas do sistema que você já usa.",
  },
  {
    icon: Bell,
    title: "Notificações",
    description: "Avisos no sistema e push no navegador.",
  },
  {
    icon: Search,
    title: "Busca global",
    description: "Encontre cliente, produto ou pedido de qualquer tela.",
  },
  {
    icon: Database,
    title: "Dados de exemplo",
    description: "Conheça o sistema preenchido antes de cadastrar o seu.",
  },
  {
    icon: FileText,
    title: "Suporte por ticket",
    description: "Abra chamados e acompanhe a resposta dentro do sistema.",
  },
  {
    icon: MessageCircle,
    title: "Suporte por WhatsApp",
    description: "Em todos os planos, direto do dashboard, em horário comercial.",
  },
  {
    icon: CreditCard,
    title: "Assinatura self-service",
    description: "Assine, troque o cartão e cancele sozinho, sem falar com ninguém.",
  },
  {
    icon: Users,
    title: "Equipe",
    description: "Convide gente da sua empresa; todos trabalham nos mesmos dados.",
  },
];

const notYet = [
  "Emissão de NF-e ou NFS-e",
  "PDV / frente de caixa",
  "Movimentação de estoque (entrada e saída)",
  "Conciliação e integração bancária",
  "Integração com marketplaces e transportadoras",
  "Permissões por usuário (a equipe existe, mas todos veem tudo)",
  "Mais de uma empresa ou filial",
  "Anexo de arquivos",
  "Funil de vendas e automações de CRM",
  "Comissões de vendedores",
  "API pública e webhooks",
  "Agenda, contratos e e-mail marketing",
];

const techFeatures = [
  {
    icon: Cloud,
    title: "100% na Nuvem",
    description: "Acesse de qualquer lugar, a qualquer momento, sem instalação.",
  },
  {
    icon: Shield,
    title: "Dados protegidos",
    description: "Conexão criptografada e senha com hash. Sem certificação ISO — não temos.",
  },
  {
    icon: Smartphone,
    title: "Funciona no celular",
    description: "Interface responsiva para tablets e smartphones.",
  },
  {
    icon: Globe,
    title: "Português e inglês",
    description: "Interface disponível em pt-BR e en-US.",
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
              Seis módulos que cobrem o ciclo básico de uma PME: cliente, produto,
              venda, dinheiro, relatório e um assistente de IA que enxerga tudo
              isso. Sem módulo de enfeite — o que está listado aqui existe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/cadastro">
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
                O que vem junto, sem custo extra e sem plano especial.
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

        {/* O que o Orion ainda não faz.
            Substituiu a seção "+50 Integrações Disponíveis", que listava 20
            marketplaces, gateways e transportadoras — nenhum deles integrado.
            Dizer o que falta antes da assinatura custa menos que o reembolso. */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O que o Orion ainda não faz
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Se algum destes é indispensável para você hoje, o Orion não é a
                escolha certa ainda — e é melhor você saber agora.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {notYet.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 bg-card border border-border rounded-lg p-4"
                >
                  <span aria-hidden className="text-muted-foreground mt-0.5">—</span>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Technology */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Como o Orion roda
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sem promessa de SLA que não medimos e sem selo que não temos.
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
                30 dias grátis, com os seis módulos liberados. Sem cartão de
                crédito e sem compromisso.
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
