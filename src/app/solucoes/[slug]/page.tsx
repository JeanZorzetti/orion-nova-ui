import { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Store,
  Briefcase,
  Factory,
  Utensils,
  Stethoscope,
  GraduationCap,
  Truck,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Shield,
  Zap,
  Target,
  Award,
  LucideIcon,
} from "lucide-react";

// Dados detalhados de cada segmento
const segmentsData: Record<string, SegmentData> = {
  varejo: {
    icon: Store,
    title: "Varejo",
    subtitle: "ERP completo para lojas físicas e e-commerce",
    description:
      "Gerencie sua operação de varejo com controle total de estoque, PDV integrado, vendas multicanal e análises em tempo real. O Orion ERP foi desenvolvido para atender desde pequenas lojas até grandes redes de varejo.",
    heroStats: [
      { value: "40%", label: "Redução no tempo de fechamento", icon: Clock },
      { value: "+35%", label: "Aumento em vendas", icon: TrendingUp },
      { value: "-25%", label: "Redução de perdas", icon: DollarSign },
    ],
    features: [
      {
        title: "PDV Integrado",
        description: "Ponto de venda completo com emissão de NFC-e, controle de caixa, sangrias e suprimentos.",
        icon: ShoppingCart,
      },
      {
        title: "Controle de Estoque",
        description: "Gestão em tempo real com alertas de estoque baixo, inventário e múltiplos almoxarifados.",
        icon: Package,
      },
      {
        title: "Gestão Multicanal",
        description: "Integração com marketplaces (Mercado Livre, Amazon, Shopee) e e-commerce próprio.",
        icon: Store,
      },
      {
        title: "Programa de Fidelidade",
        description: "Crie campanhas de pontos, cashback e descontos exclusivos para clientes recorrentes.",
        icon: Award,
      },
      {
        title: "Relatórios de Vendas",
        description: "Dashboards com ABC de produtos, análise de margem, ticket médio e performance por vendedor.",
        icon: BarChart3,
      },
      {
        title: "Gestão de Compras",
        description: "Pedidos de compra automáticos baseados em ponto de reposição e histórico de vendas.",
        icon: FileText,
      },
    ],
    benefits: [
      "Redução de 40% no tempo de fechamento de caixa",
      "Controle de estoque em tempo real em todas as lojas",
      "Integração automática com marketplaces",
      "Programa de fidelidade para aumentar recorrência",
      "Relatórios gerenciais para tomada de decisão",
      "Emissão de NFC-e e NF-e integrada",
      "Gestão de múltiplas lojas centralizada",
      "Controle de comissões por vendedor",
    ],
    useCases: [
      "Lojas de roupas e calçados",
      "Supermercados e mercearias",
      "Lojas de eletrônicos",
      "Pet shops",
      "Farmácias e drogarias",
      "Lojas de materiais de construção",
    ],
    testimonial: {
      quote: "O Orion ERP transformou completamente a gestão da nossa loja. O controle de estoque em tempo real nos ajudou a reduzir perdas em 40% e aumentar nossas vendas em 35%.",
      author: "Maria Silva",
      role: "Proprietária",
      company: "Fashion Center",
    },
  },
  servicos: {
    icon: Briefcase,
    title: "Prestadores de Serviço",
    subtitle: "Gestão eficiente para consultorias e profissionais",
    description:
      "Ideal para consultorias, escritórios de advocacia, contabilidade, agências e profissionais autônomos. Controle projetos, horas trabalhadas, faturamento e relacionamento com clientes em um só lugar.",
    heroStats: [
      { value: "+60%", label: "Aumento em produtividade", icon: TrendingUp },
      { value: "-50%", label: "Tempo em tarefas manuais", icon: Clock },
      { value: "+40%", label: "Melhoria no faturamento", icon: DollarSign },
    ],
    features: [
      {
        title: "Controle de Horas",
        description: "Timesheet integrado para registro de horas trabalhadas por projeto e cliente.",
        icon: Clock,
      },
      {
        title: "Gestão de Projetos",
        description: "Acompanhe projetos, tarefas, prazos e entregas com visão clara do progresso.",
        icon: Target,
      },
      {
        title: "Faturamento Automático",
        description: "Gere faturas automaticamente baseadas em horas trabalhadas ou contratos recorrentes.",
        icon: FileText,
      },
      {
        title: "CRM Integrado",
        description: "Gerencie leads, propostas comerciais e relacionamento com clientes.",
        icon: Users,
      },
      {
        title: "Contratos Recorrentes",
        description: "Gestão de contratos mensais com faturamento automático e reajustes programados.",
        icon: Settings,
      },
      {
        title: "Relatórios de Produtividade",
        description: "Análise de rentabilidade por projeto, cliente e colaborador.",
        icon: BarChart3,
      },
    ],
    benefits: [
      "Aumento de 60% na produtividade da equipe",
      "Faturamento automático sem erros",
      "Visão clara de rentabilidade por projeto",
      "Controle preciso de horas trabalhadas",
      "Gestão de contratos recorrentes",
      "CRM para não perder oportunidades",
      "Relatórios para precificação correta",
      "Integração com agenda e calendário",
    ],
    useCases: [
      "Escritórios de advocacia",
      "Consultorias empresariais",
      "Agências de marketing",
      "Escritórios de contabilidade",
      "Arquitetos e engenheiros",
      "Profissionais de TI autônomos",
    ],
    testimonial: {
      quote: "Antes do Orion, gastávamos horas fazendo relatórios e perdíamos o controle das horas trabalhadas. Agora temos tudo automatizado e aumentamos nossa receita em 40%.",
      author: "João Santos",
      role: "Sócio Diretor",
      company: "JNS Consultoria",
    },
  },
  industria: {
    icon: Factory,
    title: "Indústria",
    subtitle: "Controle de produção e gestão industrial",
    description:
      "Sistema completo para indústrias de todos os portes. Gerencie ordens de produção, matéria-prima, custeio de produtos, controle de qualidade e rastreabilidade de ponta a ponta.",
    heroStats: [
      { value: "-35%", label: "Redução de desperdícios", icon: TrendingUp },
      { value: "+25%", label: "Aumento de produtividade", icon: Clock },
      { value: "-20%", label: "Redução de custos", icon: DollarSign },
    ],
    features: [
      {
        title: "Ordens de Produção",
        description: "Crie e acompanhe OPs com status em tempo real, materiais necessários e prazos.",
        icon: FileText,
      },
      {
        title: "Controle de Matéria-Prima",
        description: "Gestão de insumos com rastreabilidade de lotes e controle de validade.",
        icon: Package,
      },
      {
        title: "Custeio de Produtos",
        description: "Cálculo automático de custo de produção considerando materiais, mão de obra e overhead.",
        icon: DollarSign,
      },
      {
        title: "Ficha Técnica",
        description: "Cadastro completo de estrutura de produtos com lista de materiais (BOM).",
        icon: Settings,
      },
      {
        title: "Controle de Qualidade",
        description: "Inspeção de entrada, processo e saída com laudos e não conformidades.",
        icon: Shield,
      },
      {
        title: "Rastreabilidade",
        description: "Rastreie produtos do início ao fim da cadeia produtiva.",
        icon: Target,
      },
    ],
    benefits: [
      "Redução de 35% em desperdícios de produção",
      "Controle preciso de custos industriais",
      "Rastreabilidade completa de lotes",
      "Planejamento de produção otimizado",
      "Controle de qualidade integrado",
      "Gestão de manutenção preventiva",
      "Integração com chão de fábrica",
      "Relatórios de eficiência (OEE)",
    ],
    useCases: [
      "Indústrias de alimentos",
      "Confecções e têxtil",
      "Metalúrgicas",
      "Indústrias químicas",
      "Fábricas de móveis",
      "Indústrias de plástico",
    ],
    testimonial: {
      quote: "Com o Orion ERP conseguimos reduzir nosso desperdício de matéria-prima em 35% e ter uma visão clara dos custos de cada produto.",
      author: "Carlos Mendes",
      role: "Diretor Industrial",
      company: "Indústria MetalTech",
    },
  },
  alimentacao: {
    icon: Utensils,
    title: "Alimentação",
    subtitle: "Gestão completa para food service",
    description:
      "Para restaurantes, bares, lanchonetes, pizzarias e delivery. Controle de comandas, fichas técnicas, gestão de insumos, integração com apps de delivery e muito mais.",
    heroStats: [
      { value: "+50%", label: "Aumento no ticket médio", icon: TrendingUp },
      { value: "-30%", label: "Redução de desperdício", icon: Clock },
      { value: "+40%", label: "Melhoria na margem", icon: DollarSign },
    ],
    features: [
      {
        title: "Controle de Comandas",
        description: "Gestão de mesas, comandas individuais e divisão de contas simplificada.",
        icon: FileText,
      },
      {
        title: "Fichas Técnicas",
        description: "Cadastre receitas com ingredientes, rendimento e custo automático de cada prato.",
        icon: Settings,
      },
      {
        title: "Gestão de Delivery",
        description: "Integração nativa com iFood, Rappi, Uber Eats e aplicativo próprio.",
        icon: Truck,
      },
      {
        title: "Controle de Insumos",
        description: "Baixa automática de estoque baseada nas fichas técnicas de cada venda.",
        icon: Package,
      },
      {
        title: "KDS (Kitchen Display)",
        description: "Tela para cozinha com pedidos em tempo real e controle de preparo.",
        icon: Zap,
      },
      {
        title: "Cardápio Digital",
        description: "QR Code para cardápio online com pedidos direto na mesa.",
        icon: ShoppingCart,
      },
    ],
    benefits: [
      "Aumento de 50% no ticket médio",
      "Integração com iFood, Rappi e Uber Eats",
      "Controle preciso de CMV (Custo de Mercadoria Vendida)",
      "Fichas técnicas com custo automático",
      "Redução de 30% no desperdício de alimentos",
      "Cardápio digital com QR Code",
      "Gestão de múltiplas unidades",
      "Relatórios de vendas por período",
    ],
    useCases: [
      "Restaurantes",
      "Bares e pubs",
      "Lanchonetes e fast food",
      "Pizzarias",
      "Cafeterias",
      "Dark kitchens",
    ],
    testimonial: {
      quote: "A integração com o iFood e o controle de fichas técnicas nos deu uma visão clara dos custos. Aumentamos nossa margem em 15% no primeiro mês.",
      author: "Ana Costa",
      role: "Gerente",
      company: "Sabor da Casa Restaurante",
    },
  },
  saude: {
    icon: Stethoscope,
    title: "Saúde",
    subtitle: "Sistema para clínicas e consultórios",
    description:
      "Solução completa para clínicas médicas, odontológicas, laboratórios e consultórios. Agendamento online, prontuário eletrônico, gestão de convênios e faturamento TISS/TUSS.",
    heroStats: [
      { value: "-70%", label: "Redução de faltas", icon: TrendingUp },
      { value: "+45%", label: "Aumento de consultas", icon: Clock },
      { value: "-60%", label: "Tempo de faturamento", icon: DollarSign },
    ],
    features: [
      {
        title: "Agendamento Online",
        description: "Agenda com confirmação automática por e-mail e lembretes de consulta.",
        icon: Clock,
      },
      {
        title: "Prontuário Eletrônico",
        description: "PEP completo com histórico, anexos, prescrições e atestados digitais.",
        icon: FileText,
      },
      {
        title: "Gestão de Convênios",
        description: "Cadastro de convênios, tabelas de preços e regras de autorização.",
        icon: Shield,
      },
      {
        title: "Faturamento TISS",
        description: "Geração automática de guias TISS/TUSS para faturamento de convênios.",
        icon: DollarSign,
      },
      {
        title: "Controle de Estoque",
        description: "Gestão de medicamentos, materiais e insumos médicos com rastreabilidade.",
        icon: Package,
      },
      {
        title: "Telemedicina",
        description: "Consultas por vídeo integradas ao sistema com prontuário online.",
        icon: Users,
      },
    ],
    benefits: [
      "Redução de 70% nas faltas em consultas",
      "Prontuário eletrônico completo (PEP)",
      "Faturamento TISS automático",
      "Confirmação de consultas por e-mail",
      "Telemedicina integrada",
      "Controle de estoque médico",
      "Gestão de múltiplas unidades",
      "Relatórios de produtividade médica",
    ],
    useCases: [
      "Clínicas médicas",
      "Consultórios odontológicos",
      "Laboratórios de análises",
      "Clínicas de fisioterapia",
      "Clínicas de estética",
      "Hospitais e UPAs",
    ],
    testimonial: {
      quote: "Com o agendamento online e a confirmação automática, reduzimos as faltas em 70%. O faturamento TISS automático nos economiza dias de trabalho.",
      author: "Dr. Roberto Lima",
      role: "Diretor Clínico",
      company: "Clínica VidaSaúde",
    },
  },
  educacao: {
    icon: GraduationCap,
    title: "Educação",
    subtitle: "Gestão acadêmica e financeira",
    description:
      "Para escolas, cursos livres, faculdades e instituições de ensino. Matrículas online, gestão de turmas, controle de mensalidades, portal do aluno e comunicação com responsáveis.",
    heroStats: [
      { value: "-80%", label: "Redução de inadimplência", icon: TrendingUp },
      { value: "+50%", label: "Matrículas online", icon: Clock },
      { value: "-40%", label: "Tempo administrativo", icon: DollarSign },
    ],
    features: [
      {
        title: "Gestão de Matrículas",
        description: "Processo de matrícula online com documentos digitais e assinatura eletrônica.",
        icon: FileText,
      },
      {
        title: "Controle de Mensalidades",
        description: "Cobrança automática, boletos, cartão recorrente e gestão de inadimplência.",
        icon: DollarSign,
      },
      {
        title: "Portal do Aluno",
        description: "Acesso a notas, frequência, materiais, boletos e comunicados.",
        icon: Users,
      },
      {
        title: "Gestão de Turmas",
        description: "Criação de turmas, grade horária, alocação de professores e salas.",
        icon: Settings,
      },
      {
        title: "Diário de Classe",
        description: "Lançamento de frequência e notas online com acesso mobile para professores.",
        icon: Package,
      },
      {
        title: "Comunicação",
        description: "Envio de comunicados por app e e-mail para pais e alunos.",
        icon: Zap,
      },
    ],
    benefits: [
      "Redução de 80% na inadimplência",
      "Matrícula 100% online",
      "Portal do aluno e responsável",
      "Diário de classe digital",
      "Comunicação automática com pais",
      "Gestão de bolsas e descontos",
      "Controle de frequência em tempo real",
      "Relatórios acadêmicos e financeiros",
    ],
    useCases: [
      "Escolas de educação básica",
      "Cursos de idiomas",
      "Cursos técnicos e profissionalizantes",
      "Faculdades e universidades",
      "Escolas de música e arte",
      "Academias e escolas de esporte",
    ],
    testimonial: {
      quote: "Implementamos o Orion e nossa inadimplência caiu de 15% para menos de 3%. A matrícula online aumentou as conversões em 50%.",
      author: "Profa. Márcia Oliveira",
      role: "Diretora",
      company: "Colégio Nova Era",
    },
  },
  logistica: {
    icon: Truck,
    title: "Logística",
    subtitle: "Gestão de transportes e entregas",
    description:
      "Para transportadoras, distribuidoras e operadores logísticos. Roteirização inteligente, gestão de frota, controle de entregas, rastreamento em tempo real e comprovante digital.",
    heroStats: [
      { value: "-30%", label: "Redução custos combustível", icon: TrendingUp },
      { value: "+40%", label: "Entregas no prazo", icon: Clock },
      { value: "-25%", label: "Tempo de roteirização", icon: DollarSign },
    ],
    features: [
      {
        title: "Roteirização Inteligente",
        description: "Algoritmo de otimização de rotas considerando trânsito, janelas de entrega e capacidade.",
        icon: Target,
      },
      {
        title: "Gestão de Frota",
        description: "Controle de veículos, manutenções, documentos, multas e custos operacionais.",
        icon: Truck,
      },
      {
        title: "Controle de Entregas",
        description: "Acompanhamento em tempo real de cada entrega com status e ocorrências.",
        icon: Package,
      },
      {
        title: "Rastreamento GPS",
        description: "Localização em tempo real de veículos e motoristas com histórico de rotas.",
        icon: Settings,
      },
      {
        title: "Comprovante Digital",
        description: "Assinatura digital, foto da entrega e geolocalização como prova de entrega.",
        icon: FileText,
      },
      {
        title: "App do Motorista",
        description: "Aplicativo mobile para motoristas com roteiro, navegação e registro de entregas.",
        icon: Zap,
      },
    ],
    benefits: [
      "Redução de 30% nos custos com combustível",
      "Roteirização otimizada automaticamente",
      "Rastreamento GPS em tempo real",
      "Comprovante de entrega digital",
      "Gestão completa de frota",
      "App para motoristas",
      "Controle de ocorrências",
      "Integração com ERPs de clientes",
    ],
    useCases: [
      "Transportadoras",
      "Distribuidoras",
      "Operadores logísticos (3PL)",
      "E-commerce com frota própria",
      "Empresas de courier",
      "Delivery de última milha",
    ],
    testimonial: {
      quote: "A roteirização inteligente reduziu nossos custos com combustível em 30% e aumentamos as entregas no prazo em 40%.",
      author: "Pedro Almeida",
      role: "Diretor de Operações",
      company: "TransLog Express",
    },
  },
  construcao: {
    icon: Building2,
    title: "Construção Civil",
    subtitle: "Gestão de obras e empreendimentos",
    description:
      "Para construtoras, incorporadoras e empreiteiras. Gestão de obras, orçamentos detalhados, controle de materiais, cronograma físico-financeiro e diário de obra digital.",
    heroStats: [
      { value: "-25%", label: "Redução custos materiais", icon: TrendingUp },
      { value: "+35%", label: "Precisão em orçamentos", icon: Clock },
      { value: "-40%", label: "Tempo de relatórios", icon: DollarSign },
    ],
    features: [
      {
        title: "Gestão de Obras",
        description: "Controle centralizado de múltiplas obras com visão geral de progresso e custos.",
        icon: Building2,
      },
      {
        title: "Orçamentos Detalhados",
        description: "Composições de custos, BDI, encargos sociais e curva ABC de insumos.",
        icon: FileText,
      },
      {
        title: "Controle de Materiais",
        description: "Requisições, pedidos de compra, recebimento e controle de estoque por obra.",
        icon: Package,
      },
      {
        title: "Cronograma Físico-Financeiro",
        description: "Planejamento de etapas com acompanhamento de avanço físico e financeiro.",
        icon: Settings,
      },
      {
        title: "Diário de Obra",
        description: "Registro diário de atividades, mão de obra, equipamentos e ocorrências.",
        icon: Clock,
      },
      {
        title: "Medições",
        description: "Controle de medições de serviços executados para faturamento e pagamento.",
        icon: DollarSign,
      },
    ],
    benefits: [
      "Redução de 25% nos custos com materiais",
      "Orçamentos precisos com composições",
      "Cronograma físico-financeiro integrado",
      "Diário de obra digital",
      "Controle de medições",
      "Gestão de múltiplas obras",
      "Controle de mão de obra",
      "Relatórios gerenciais por obra",
    ],
    useCases: [
      "Construtoras",
      "Incorporadoras",
      "Empreiteiras",
      "Empresas de reforma",
      "Instaladoras",
      "Empresas de infraestrutura",
    ],
    testimonial: {
      quote: "O controle de materiais e o cronograma integrado nos ajudaram a reduzir custos em 25% e entregar obras dentro do prazo.",
      author: "Eng. Fernando Costa",
      role: "Diretor Técnico",
      company: "Construtora Horizonte",
    },
  },
};

interface SegmentData {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  heroStats: { value: string; label: string; icon: LucideIcon }[];
  features: { title: string; description: string; icon: LucideIcon }[];
  benefits: string[];
  useCases: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

// Generate static params for all segments
export function generateStaticParams() {
  return Object.keys(segmentsData).map((slug) => ({ slug }));
}

// Generate metadata for each segment
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const segment = segmentsData[slug];

  if (!segment) {
    return {
      title: "Solução não encontrada | Orion ERP",
    };
  }

  return {
    title: `ERP para ${segment.title} | Orion ERP`,
    description: segment.description,
    openGraph: {
      title: `ERP para ${segment.title} | Orion ERP`,
      description: segment.description,
      type: "website",
    },
  };
}

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const segment = segmentsData[slug];

  if (!segment) {
    notFound();
  }

  const Icon = segment.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Solução Especializada
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                ERP para{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                  {segment.title}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {segment.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/cadastro">
                    Começar Grátis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contato">Falar com Especialista</Link>
                </Button>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-12">
              {segment.heroStats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-card border border-border rounded-2xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Funcionalidades para {segment.title}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Recursos desenvolvidos especificamente para as necessidades do seu segmento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {segment.features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Benefícios para Seu Negócio
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Veja como o Orion ERP pode transformar a gestão da sua empresa de {segment.title.toLowerCase()}.
                </p>
                <ul className="space-y-4">
                  {segment.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6">Ideal para:</h3>
                <div className="grid grid-cols-2 gap-4">
                  {segment.useCases.map((useCase, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <blockquote className="text-xl md:text-2xl font-medium mb-8 italic">
                &quot;{segment.testimonial.quote}&quot;
              </blockquote>
              <div>
                <p className="font-semibold text-lg">{segment.testimonial.author}</p>
                <p className="text-muted-foreground">
                  {segment.testimonial.role}, {segment.testimonial.company}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para Começar?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Experimente o Orion ERP por 30 dias grátis e veja como ele pode transformar a gestão do seu negócio de {segment.title.toLowerCase()}.
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
                  <Link href="/contato">Solicitar Demonstração</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Other Segments */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Explore Outras Soluções
              </h2>
              <p className="text-muted-foreground">
                Conheça as soluções do Orion ERP para outros segmentos.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(segmentsData)
                .filter(([key]) => key !== slug)
                .slice(0, 4)
                .map(([key, otherSegment]) => {
                  const OtherIcon = otherSegment.icon;
                  return (
                    <Link
                      key={key}
                      href={`/solucoes/${key}`}
                      className="flex flex-col items-center p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                    >
                      <OtherIcon className="w-6 h-6 text-primary mb-2" />
                      <span className="text-sm font-medium text-center">{otherSegment.title}</span>
                    </Link>
                  );
                })}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/solucoes">
                  Ver Todas as Soluções
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
