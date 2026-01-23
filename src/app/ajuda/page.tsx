import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  FileText,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Sparkles,
  Settings,
  ArrowRight,
  ChevronRight,
  Mail,
  Clock,
  ExternalLink,
} from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.ajuda;

const categories = [
  {
    icon: Users,
    title: "Clientes e CRM",
    description: "Cadastro, segmentação e relacionamento com clientes",
    articles: 15,
    slug: "clientes",
  },
  {
    icon: Package,
    title: "Estoque e Produtos",
    description: "Controle de estoque, cadastro de produtos e inventário",
    articles: 12,
    slug: "estoque",
  },
  {
    icon: ShoppingCart,
    title: "Vendas e Pedidos",
    description: "Orçamentos, pedidos, funil de vendas e comissões",
    articles: 18,
    slug: "vendas",
  },
  {
    icon: DollarSign,
    title: "Financeiro",
    description: "Contas a pagar/receber, fluxo de caixa e conciliação",
    articles: 20,
    slug: "financeiro",
  },
  {
    icon: BarChart3,
    title: "Relatórios e BI",
    description: "Dashboards, KPIs e exportação de relatórios",
    articles: 10,
    slug: "relatorios",
  },
  {
    icon: Sparkles,
    title: "Orion AI",
    description: "Como usar a inteligência artificial integrada",
    articles: 8,
    slug: "ia",
  },
  {
    icon: Settings,
    title: "Configurações",
    description: "Personalização, usuários e integrações",
    articles: 14,
    slug: "configuracoes",
  },
  {
    icon: FileText,
    title: "Fiscal e NF-e",
    description: "Emissão de notas fiscais e obrigações fiscais",
    articles: 11,
    slug: "fiscal",
  },
];

const articlesByCategory = {
  clientes: [
    { title: "Como cadastrar meu primeiro cliente", slug: "cadastrar-cliente" },
    { title: "Importando clientes via planilha", slug: "importar-clientes" },
    { title: "Segmentando clientes por categoria", slug: "segmentar-clientes" },
    { title: "Histórico de interações com clientes", slug: "historico-clientes" },
    { title: "Gerenciando contatos e responsáveis", slug: "contatos-clientes" },
  ],
  estoque: [
    { title: "Cadastrando produtos e serviços", slug: "cadastrar-produtos" },
    { title: "Configurando alertas de estoque baixo", slug: "alertas-estoque" },
    { title: "Controlando entrada e saída de produtos", slug: "movimentacao-estoque" },
    { title: "Realizando inventário", slug: "inventario" },
    { title: "Gerenciando múltiplos depósitos", slug: "multiplos-depositos" },
  ],
  vendas: [
    { title: "Criando seu primeiro orçamento", slug: "criar-orcamento" },
    { title: "Convertendo orçamento em pedido", slug: "converter-orcamento" },
    { title: "Gerenciando funil de vendas", slug: "funil-vendas" },
    { title: "Configurando comissões de vendedores", slug: "comissoes" },
    { title: "Emitindo pedidos de venda", slug: "pedidos-venda" },
    { title: "Acompanhando métricas de vendas", slug: "metricas-vendas" },
  ],
  financeiro: [
    { title: "Entendendo o fluxo de caixa", slug: "fluxo-caixa" },
    { title: "Contas a pagar: cadastro e controle", slug: "contas-pagar" },
    { title: "Contas a receber: gestão de cobranças", slug: "contas-receber" },
    { title: "Conciliação bancária automática", slug: "conciliacao-bancaria" },
    { title: "Gerenciando formas de pagamento", slug: "formas-pagamento" },
    { title: "Relatório DRE (Demonstrativo de Resultados)", slug: "relatorio-dre" },
  ],
  relatorios: [
    { title: "Dashboard: principais indicadores", slug: "dashboard" },
    { title: "Relatório de vendas por período", slug: "relatorio-vendas" },
    { title: "Análise de produtos mais vendidos", slug: "produtos-mais-vendidos" },
    { title: "Exportando relatórios em Excel/PDF", slug: "exportar-relatorios" },
    { title: "Personalizando dashboards", slug: "personalizar-dashboards" },
  ],
  ia: [
    { title: "Conversando com a Orion AI", slug: "usar-orion-ai" },
    { title: "Comandos de voz para cadastros rápidos", slug: "comandos-voz" },
    { title: "Previsão de demanda com IA", slug: "previsao-demanda" },
    { title: "Análise inteligente de dados", slug: "analise-inteligente" },
    { title: "Sugestões automáticas de precificação", slug: "precificacao-ia" },
  ],
  configuracoes: [
    { title: "Configuração inicial do sistema", slug: "configuracao-inicial" },
    { title: "Gerenciando usuários e permissões", slug: "usuarios-permissoes" },
    { title: "Personalizando aparência e tema", slug: "personalizar-tema" },
    { title: "Integrações com e-commerce", slug: "integracoes-ecommerce" },
    { title: "Backup automático de dados", slug: "backup-dados" },
    { title: "Configurando notificações", slug: "configurar-notificacoes" },
  ],
  fiscal: [
    { title: "Como emitir uma NF-e", slug: "emitir-nfe" },
    { title: "Configurando certificado digital", slug: "certificado-digital" },
    { title: "Impostos: ICMS, PIS, COFINS", slug: "impostos" },
    { title: "Carta de Correção Eletrônica (CC-e)", slug: "carta-correcao" },
    { title: "Cancelamento de notas fiscais", slug: "cancelar-nfe" },
    { title: "SPED Fiscal e obrigações acessórias", slug: "sped-fiscal" },
  ],
};

const popularArticles = [
  {
    title: "Como cadastrar meu primeiro cliente",
    category: "Clientes",
    slug: "cadastrar-cliente",
  },
  {
    title: "Configurando alertas de estoque baixo",
    category: "Estoque",
    slug: "alertas-estoque",
  },
  {
    title: "Como emitir uma NF-e",
    category: "Fiscal",
    slug: "emitir-nfe",
  },
  {
    title: "Criando seu primeiro orçamento",
    category: "Vendas",
    slug: "criar-orcamento",
  },
  {
    title: "Entendendo o fluxo de caixa",
    category: "Financeiro",
    slug: "fluxo-caixa",
  },
  {
    title: "Conversando com a Orion AI",
    category: "IA",
    slug: "usar-orion-ai",
  },
];

const faqs = [
  {
    question: "Como faço para alterar minha senha?",
    answer:
      "Acesse Configurações > Minha Conta > Segurança e clique em 'Alterar Senha'. Você receberá um email de confirmação.",
  },
  {
    question: "Posso importar dados de outro sistema?",
    answer:
      "Sim! O Orion ERP permite importação via CSV/Excel. Acesse Configurações > Importação de Dados para começar.",
  },
  {
    question: "Como adiciono mais usuários à minha conta?",
    answer:
      "Vá em Configurações > Usuários > Adicionar Usuário. O número de usuários depende do seu plano.",
  },
  {
    question: "O que acontece quando meu trial expira?",
    answer:
      "Após os 30 dias de trial, você precisará assinar um plano para continuar usando. Seus dados são mantidos por 30 dias adicionais.",
  },
  {
    question: "Como cancelo minha assinatura?",
    answer:
      "Acesse Configurações > Assinatura > Cancelar Assinatura. O acesso continua até o fim do período pago.",
  },
];

export default function AjudaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="w-3 h-3 mr-1" />
              Central de Ajuda
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Como podemos{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                ajudar?
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Encontre respostas, tutoriais e guias para aproveitar o máximo do
              Orion ERP.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar na central de ajuda..."
                  className="pl-12 h-14 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Link href="#faq">
                <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Perguntas Frequentes</h3>
                    <p className="text-sm text-muted-foreground">
                      Respostas rápidas
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/contato">
                <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Falar com Suporte</h3>
                    <p className="text-sm text-muted-foreground">
                      Atendimento humano
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-6">Explorar por Categoria</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <Link key={index} href={`/ajuda/${category.slug}`}>
                  <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors h-full">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {category.description}
                    </p>
                    <span className="text-xs text-primary">
                      {category.articles} artigos
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Artigos Populares</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/ajuda/artigos">
                  Ver todos
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularArticles.map((article, index) => (
                <Link key={index} href={`/ajuda/artigos/${article.slug}`}>
                  <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
                    <BookOpen className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {article.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {article.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Articles by Category */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Guias Completos por Categoria
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {categories.map((category, catIndex) => {
                const categoryArticles = articlesByCategory[category.slug as keyof typeof articlesByCategory] || [];
                return (
                  <div
                    key={catIndex}
                    className="bg-card border border-border rounded-xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {categoryArticles.length} artigos disponíveis
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {categoryArticles.slice(0, 5).map((article, artIndex) => (
                        <Link
                          key={artIndex}
                          href={`/ajuda/${category.slug}/${article.slug}`}
                        >
                          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                            <span className="text-sm group-hover:text-primary transition-colors">
                              {article.title}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-4"
                      asChild
                    >
                      <Link href={`/ajuda/${category.slug}`}>
                        Ver todos os artigos
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/ajuda/faq">
                  Ver Todas as Perguntas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Não encontrou o que procura?
                </h2>
                <p className="text-muted-foreground">
                  Nossa equipe de suporte está pronta para ajudar você.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    suporte@orion.roilabs.com.br
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Disponível no sistema
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">Horário</h3>
                  <p className="text-sm text-muted-foreground">
                    Seg-Sex, 08h-18h
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button size="lg" asChild>
                  <Link href="/contato">
                    Abrir Ticket de Suporte
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
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
