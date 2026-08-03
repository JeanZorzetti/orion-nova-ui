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
  DollarSign,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  LucideIcon,
} from "lucide-react";

// As oito páginas de segmento vendiam 48 funcionalidades específicas — PDV com
// NFC-e, prontuário eletrônico, faturamento TISS, roteirização com GPS, KDS,
// diário de classe, cronograma físico-financeiro — e nenhuma delas existe.
// Cada página trazia ainda um depoimento com nome, cargo e empresa inventados,
// e três estatísticas de resultado ("+35% em vendas") sem cliente que as
// tivesse produzido: o Orion não tem cliente pagante.
//
// O produto é um só. O que muda por segmento é o enquadramento, o público e —
// principalmente — o que falta para aquele segmento, agora dito na própria
// página em vez de descoberto depois da assinatura.

const CORE_FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Clientes",
    description:
      "Cadastro de pessoa física e jurídica, com CPF/CNPJ, contato, endereço e o histórico de pedidos de cada um.",
    icon: Users,
  },
  {
    title: "Produtos e serviços",
    description:
      "Um cadastro para o que você vende, com preço, custo, SKU, unidade, quantidade em estoque e alerta de estoque mínimo.",
    icon: Package,
  },
  {
    title: "Vendas e pedidos",
    description:
      "Pedido com vários itens, desconto, numeração automática, status próprio e status de pagamento separado.",
    icon: ShoppingCart,
  },
  {
    title: "Financeiro",
    description:
      "Contas a pagar e a receber com categoria, vencimento, baixa de pagamento e vínculo ao cliente e ao pedido.",
    icon: DollarSign,
  },
  {
    title: "Relatórios e dashboard",
    description:
      "Três relatórios — vendas, clientes e financeiro — exportáveis em CSV e PDF, mais um painel com receitas, despesas e saldo.",
    icon: BarChart3,
  },
  {
    title: "Orion AI",
    description:
      "Assistente que responde olhando os seus dados: o seu mês, os seus clientes, o seu caixa. E que avisa quando o sistema não faz algo.",
    icon: Sparkles,
  },
];

const segmentsData: Record<string, SegmentData> = {
  varejo: {
    icon: Store,
    title: "Varejo",
    subtitle: "O administrativo da loja, sem o caixa",
    description:
      "O Orion cobre o cadastro de produtos, as vendas, o contas a pagar e receber e os relatórios da sua loja. Não é frente de caixa e não emite nota: é a camada de gestão por trás dela.",
    benefits: [
      "Catálogo de produtos com preço, custo e estoque mínimo",
      "Alerta quando um produto passa do estoque mínimo",
      "Pedidos com desconto, status e status de pagamento separados",
      "Contas a receber ligadas ao pedido que as gerou",
      "Relatório de vendas por período, exportável em CSV e PDF",
      "Pergunte à IA o que vendeu mais no mês, em português",
    ],
    useCases: [
      "Lojas de roupas e calçados",
      "Pet shops",
      "Lojas de eletrônicos",
      "Lojas de materiais de construção",
      "Comércio de bairro",
      "Vendas por catálogo e encomenda",
    ],
    notFor: [
      "PDV / frente de caixa, sangria e suprimento",
      "Emissão de NFC-e ou NF-e",
      "Integração com Mercado Livre, Shopee ou Amazon",
      "Movimentação de estoque e inventário",
      "Programa de fidelidade e cashback",
    ],
  },
  servicos: {
    icon: Briefcase,
    title: "Prestadores de Serviço",
    subtitle: "Clientes, cobranças e o que entra no mês",
    description:
      "Para quem vende hora e projeto: cadastro de clientes, serviços com preço, pedidos e um financeiro que mostra o que está a receber e o que já venceu. Sem apontamento de horas e sem contrato recorrente automático.",
    benefits: [
      "Serviços cadastrados como itens, com preço próprio",
      "Pedido por cliente, com status de pagamento",
      "Contas a receber com vencimento e alerta de atraso",
      "Relatório de clientes para ver quem concentra a receita",
      "Exportação em CSV e PDF para mandar ao contador",
      "IA que responde sobre o seu próprio faturamento",
    ],
    useCases: [
      "Consultorias empresariais",
      "Agências de marketing",
      "Escritórios de contabilidade",
      "Arquitetos e engenheiros",
      "Profissionais de TI autônomos",
      "Escritórios de advocacia",
    ],
    notFor: [
      "Apontamento e controle de horas",
      "Gestão de projetos e cronograma",
      "Contratos recorrentes com faturamento automático",
      "Emissão de NFS-e",
      "Assinatura digital de contrato",
    ],
  },
  industria: {
    icon: Factory,
    title: "Indústria",
    subtitle: "A parte comercial e financeira, não o chão de fábrica",
    description:
      "O Orion atende o lado comercial de uma indústria pequena: clientes, catálogo, pedidos e financeiro. Produção, ficha técnica e matéria-prima não existem — se o seu gargalo é o chão de fábrica, o Orion ainda não resolve.",
    benefits: [
      "Catálogo de produtos acabados com preço e custo",
      "Pedidos de venda com itens e desconto",
      "Contas a pagar de fornecedores e a receber de clientes",
      "Relatório financeiro por período",
      "Alerta de estoque mínimo por produto",
      "Dashboard com receitas, despesas e saldo",
    ],
    useCases: [
      "Confecções e têxtil",
      "Fábricas de móveis",
      "Metalúrgicas pequenas",
      "Indústrias de alimentos",
      "Produção sob encomenda",
      "Marcas próprias com produção terceirizada",
    ],
    notFor: [
      "Ordens de produção e MRP",
      "Ficha técnica e lista de materiais",
      "Controle de matéria-prima e apontamento de perdas",
      "Custeio de produção e rastreabilidade de lote",
      "Controle de qualidade",
    ],
  },
  alimentacao: {
    icon: Utensils,
    title: "Alimentação",
    subtitle: "A gestão de trás do balcão",
    description:
      "Cadastro de itens, pedidos, contas a pagar aos fornecedores e relatórios do mês. O Orion não é PDV, não roda comanda e não integra com iFood — atende a operação administrativa, não o salão.",
    benefits: [
      "Cadastro de itens do cardápio com preço e custo",
      "Pedidos registrados com valor e status de pagamento",
      "Contas a pagar de fornecedores com vencimento",
      "Relatório financeiro para fechar o mês",
      "Alerta de insumo abaixo do mínimo cadastrado",
      "IA que responde sobre a margem e o caixa do período",
    ],
    useCases: [
      "Restaurantes",
      "Cafeterias",
      "Lanchonetes",
      "Pizzarias",
      "Dark kitchens",
      "Buffets e eventos",
    ],
    notFor: [
      "Comandas e mesas",
      "KDS (tela de cozinha)",
      "Cardápio digital e delivery próprio",
      "Integração com iFood, Rappi ou 99Food",
      "Ficha técnica com rendimento de receita",
    ],
  },
  saude: {
    icon: Stethoscope,
    title: "Saúde",
    subtitle: "O financeiro da clínica — não o atendimento",
    description:
      "Para clínicas e consultórios, o Orion cobre pacientes como clientes, procedimentos como serviços, e todo o contas a pagar e receber. Não tem agenda, prontuário nem faturamento de convênio. Seja honesto com o seu caso antes de assinar.",
    benefits: [
      "Cadastro de pacientes com contato e documento",
      "Procedimentos cadastrados como serviços, com preço",
      "Recebimentos por paciente, com vencimento e baixa",
      "Contas a pagar da clínica em um lugar só",
      "Relatório financeiro exportável para a contabilidade",
      "Dashboard com o resultado do mês",
    ],
    useCases: [
      "Consultórios odontológicos",
      "Clínicas de fisioterapia",
      "Clínicas de estética",
      "Nutricionistas e psicólogos",
      "Consultórios particulares",
      "Profissionais autônomos da saúde",
    ],
    notFor: [
      "Agenda e marcação de consulta",
      "Prontuário eletrônico",
      "Convênios e faturamento TISS",
      "Telemedicina",
      "Emissão de NFS-e",
    ],
  },
  educacao: {
    icon: GraduationCap,
    title: "Educação",
    subtitle: "Mensalidades e caixa, sem parte acadêmica",
    description:
      "Alunos entram como clientes, cursos como serviços e as mensalidades como contas a receber com vencimento. Matrícula, turma, diário e portal do aluno não existem no Orion.",
    benefits: [
      "Cadastro de alunos e responsáveis",
      "Cursos e turmas cadastrados como serviços com preço",
      "Mensalidades como contas a receber, com vencimento",
      "Alerta de mensalidade vencida",
      "Relatório de inadimplência a partir do financeiro",
      "Exportação em CSV e PDF",
    ],
    useCases: [
      "Cursos de idiomas",
      "Escolas de música e arte",
      "Cursos técnicos e profissionalizantes",
      "Escolas de esporte",
      "Professores particulares",
      "Cursos livres e workshops",
    ],
    notFor: [
      "Matrícula, turmas e grade",
      "Diário de classe e notas",
      "Portal do aluno e do responsável",
      "Comunicação com pais",
      "Boleto e carnê de mensalidade",
    ],
  },
  logistica: {
    icon: Truck,
    title: "Logística",
    subtitle: "O comercial e o financeiro da operação",
    description:
      "O Orion registra clientes, serviços prestados, pedidos e o financeiro da transportadora. Não faz roteirização, não rastreia veículo e não tem app de motorista — a operação em campo fica fora.",
    benefits: [
      "Cadastro de embarcadores e clientes contratantes",
      "Serviços de frete cadastrados com preço",
      "Pedidos com status e status de pagamento",
      "Contas a pagar de combustível, manutenção e terceiros",
      "Relatório financeiro por período",
      "Dashboard com o saldo do mês",
    ],
    useCases: [
      "Transportadoras pequenas",
      "Distribuidoras",
      "Empresas de courier",
      "Frota própria de e-commerce",
      "Fretes dedicados",
      "Operações de última milha",
    ],
    notFor: [
      "Roteirização e otimização de rota",
      "Rastreamento por GPS",
      "Gestão de frota e manutenção",
      "App do motorista e comprovante digital",
      "Emissão de CT-e ou MDF-e",
    ],
  },
  construcao: {
    icon: Building2,
    title: "Construção Civil",
    subtitle: "Orçamento vira pedido, obra ainda não vira projeto",
    description:
      "Clientes, materiais e serviços no catálogo, pedidos e um financeiro com vencimentos. O Orion não tem gestão de obra, cronograma físico-financeiro nem medição — o controle da obra em si continua fora dele.",
    benefits: [
      "Cadastro de clientes e contratantes",
      "Materiais e serviços com preço e custo",
      "Pedido com itens, desconto e total",
      "Contas a pagar de fornecedores e a receber por etapa",
      "Relatório financeiro do período",
      "IA que responde sobre custos e recebimentos",
    ],
    useCases: [
      "Empreiteiras",
      "Empresas de reforma",
      "Instaladoras",
      "Prestadores de serviço de obra",
      "Construtoras pequenas",
      "Autônomos da construção",
    ],
    notFor: [
      "Gestão de obras e diário de obra",
      "Cronograma físico-financeiro",
      "Medições e boletins",
      "Orçamento com composição de custos (SINAPI/TCPO)",
      "Controle de materiais por obra",
    ],
  },
};

interface SegmentData {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  useCases: string[];
  /** O que o Orion não entrega para este segmento. Dito antes da assinatura. */
  notFor: string[];
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
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O que você recebe
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Os seis módulos do Orion. São os mesmos para todo segmento — não
                existe versão especial de {segment.title.toLowerCase()}, e dizer
                que existe seria mentira.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {CORE_FEATURES.map((feature, index) => (
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

        {/* Onde o Orion não serve para este segmento.
            Substituiu o depoimento — que era inventado, com nome, cargo e
            empresa de um cliente que não existe. */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Onde o Orion não vai te atender
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Específico de {segment.title.toLowerCase()}. Se um destes é
                indispensável hoje, procure outro sistema — vai custar menos aos
                dois.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {segment.notFor.map((item) => (
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
