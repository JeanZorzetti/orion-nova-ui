import { Metadata } from "next";
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
} from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.solucoes;

const segments = [
  {
    icon: Store,
    title: "Varejo",
    slug: "varejo",
    description:
      "Gestão completa para lojas físicas e e-commerce, com controle de estoque, PDV e vendas multicanal.",
    benefits: [
      "PDV integrado",
      "Controle de estoque em tempo real",
      "Gestão de múltiplas lojas",
      "Integração e-commerce",
      "Programa de fidelidade",
    ],
    stats: { reduction: "40%", metric: "redução no tempo de fechamento de caixa" },
  },
  {
    icon: Briefcase,
    title: "Prestadores de Serviço",
    slug: "servicos",
    description:
      "Para consultorias, escritórios e profissionais autônomos que precisam gerenciar clientes e projetos.",
    benefits: [
      "Controle de horas trabalhadas",
      "Gestão de projetos",
      "Faturamento automático",
      "CRM integrado",
      "Relatórios de produtividade",
    ],
    stats: { reduction: "60%", metric: "aumento na produtividade" },
  },
  {
    icon: Factory,
    title: "Indústria",
    slug: "industria",
    description:
      "Controle de produção, matéria-prima, ordens de fabricação e gestão de custos industriais.",
    benefits: [
      "Ordens de produção",
      "Controle de matéria-prima",
      "Custeio de produtos",
      "Rastreabilidade",
      "Qualidade e inspeção",
    ],
    stats: { reduction: "35%", metric: "redução de desperdícios" },
  },
  {
    icon: Utensils,
    title: "Alimentação",
    slug: "alimentacao",
    description:
      "Para restaurantes, bares, lanchonetes e delivery com controle de comandas e fichas técnicas.",
    benefits: [
      "Controle de comandas",
      "Fichas técnicas",
      "Gestão de delivery",
      "Controle de insumos",
      "Integração iFood/Rappi",
    ],
    stats: { reduction: "50%", metric: "aumento no ticket médio" },
  },
  {
    icon: Stethoscope,
    title: "Saúde",
    slug: "saude",
    description:
      "Para clínicas, consultórios e laboratórios com agenda, prontuários e gestão de convênios.",
    benefits: [
      "Agendamento online",
      "Prontuário eletrônico",
      "Gestão de convênios",
      "Controle de estoque médico",
      "Faturamento TISS/TUSS",
    ],
    stats: { reduction: "70%", metric: "redução de faltas em consultas" },
  },
  {
    icon: GraduationCap,
    title: "Educação",
    slug: "educacao",
    description:
      "Para escolas, cursos e instituições de ensino com matrículas, mensalidades e gestão acadêmica.",
    benefits: [
      "Gestão de matrículas",
      "Controle de mensalidades",
      "Portal do aluno",
      "Gestão de turmas",
      "Comunicação com pais",
    ],
    stats: { reduction: "80%", metric: "redução de inadimplência" },
  },
  {
    icon: Truck,
    title: "Logística",
    slug: "logistica",
    description:
      "Para transportadoras e distribuidoras com roteirização, frota e gestão de entregas.",
    benefits: [
      "Roteirização inteligente",
      "Gestão de frota",
      "Controle de entregas",
      "Rastreamento em tempo real",
      "Comprovante digital",
    ],
    stats: { reduction: "30%", metric: "redução de custos com combustível" },
  },
  {
    icon: Building2,
    title: "Construção Civil",
    slug: "construcao",
    description:
      "Para construtoras e empreiteiras com gestão de obras, orçamentos e controle de materiais.",
    benefits: [
      "Gestão de obras",
      "Orçamentos detalhados",
      "Controle de materiais",
      "Cronograma físico-financeiro",
      "Diário de obra",
    ],
    stats: { reduction: "25%", metric: "redução de custos com materiais" },
  },
];

const testimonials = [
  {
    quote:
      "O Orion ERP transformou completamente a gestão da nossa loja. O controle de estoque em tempo real nos ajudou a reduzir perdas em 40%.",
    author: "Maria Silva",
    role: "Proprietária",
    company: "Loja Fashion Center",
    segment: "Varejo",
  },
  {
    quote:
      "Antes do Orion, gastávamos horas fazendo relatórios. Agora temos tudo automatizado e podemos focar no que realmente importa: atender nossos clientes.",
    author: "João Santos",
    role: "Diretor",
    company: "JNS Consultoria",
    segment: "Serviços",
  },
  {
    quote:
      "A integração com o iFood e o controle de fichas técnicas nos deu uma visão clara dos custos. Aumentamos nossa margem em 15%.",
    author: "Ana Costa",
    role: "Gerente",
    company: "Sabor da Casa Restaurante",
    segment: "Alimentação",
  },
];

export default function SolucoesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Soluções Especializadas
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              ERP para Cada{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                Tipo de Negócio
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              O Orion ERP se adapta às necessidades específicas do seu segmento,
              oferecendo funcionalidades especializadas para maximizar seus resultados.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-12">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-3xl font-bold">+45%</span>
                </div>
                <p className="text-sm text-muted-foreground">Aumento em produtividade</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-3xl font-bold">-60%</span>
                </div>
                <p className="text-sm text-muted-foreground">Tempo em tarefas manuais</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-3xl font-bold">+30%</span>
                </div>
                <p className="text-sm text-muted-foreground">Redução de custos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Segments Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {segments.map((segment, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all hover:border-primary/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <segment.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{segment.title}</h3>
                      <p className="text-muted-foreground mb-4">{segment.description}</p>

                      <ul className="space-y-2 mb-4">
                        {segment.benefits.slice(0, 3).map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="text-sm">
                          <span className="font-bold text-primary">{segment.stats.reduction}</span>{" "}
                          <span className="text-muted-foreground">{segment.stats.metric}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/solucoes/${segment.slug}`}>
                            Saiba mais
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-lg text-muted-foreground">
                Empresas de diversos segmentos confiam no Orion ERP.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <Badge variant="secondary" className="mb-4">
                    {testimonial.segment}
                  </Badge>
                  <p className="text-muted-foreground mb-6 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Não Encontrou Seu Segmento?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              O Orion ERP é flexível e pode ser adaptado para qualquer tipo de negócio.
              Fale com nossa equipe e descubra como podemos ajudar.
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
