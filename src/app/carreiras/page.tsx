import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Heart,
  Zap,
  Target,
  Trophy,
  Coffee,
  Laptop,
  Plane,
  GraduationCap,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Carreiras - Orion ERP | Trabalhe Conosco",
  description:
    "Faça parte do time que está transformando a gestão empresarial no Brasil. Conheça nossas vagas e cultura.",
  openGraph: {
    title: "Carreiras - Orion ERP",
    description: "Trabalhe conosco e ajude a transformar a gestão empresarial.",
    type: "website",
  },
};

const openPositions = [
  {
    title: "Desenvolvedor Full Stack Sênior",
    department: "Engenharia",
    location: "Remoto",
    type: "Full-time",
    salary: "R$ 10.000 - R$ 15.000",
    slug: "desenvolvedor-fullstack-senior",
  },
  {
    title: "Product Designer",
    department: "Produto",
    location: "Remoto",
    type: "Full-time",
    salary: "R$ 8.000 - R$ 12.000",
    slug: "product-designer",
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "São Paulo, SP",
    type: "Full-time",
    salary: "R$ 6.000 - R$ 9.000",
    slug: "customer-success-manager",
  },
  {
    title: "Especialista em Marketing de Conteúdo",
    department: "Marketing",
    location: "Remoto",
    type: "Full-time",
    salary: "R$ 5.000 - R$ 8.000",
    slug: "marketing-conteudo",
  },
];

const benefits = [
  {
    icon: Laptop,
    title: "Trabalho Remoto",
    description: "100% remoto. Trabalhe de onde quiser.",
  },
  {
    icon: Clock,
    title: "Horário Flexível",
    description: "Ajuste seu horário conforme sua rotina.",
  },
  {
    icon: DollarSign,
    title: "Salário Competitivo",
    description: "Remuneração acima da média do mercado.",
  },
  {
    icon: GraduationCap,
    title: "Desenvolvimento",
    description: "Budget para cursos, livros e eventos.",
  },
  {
    icon: Heart,
    title: "Plano de Saúde",
    description: "Cobertura nacional para você e sua família.",
  },
  {
    icon: Plane,
    title: "Férias Estendidas",
    description: "30 dias de férias por ano.",
  },
  {
    icon: Coffee,
    title: "Day Off Aniversário",
    description: "Folga remunerada no seu aniversário.",
  },
  {
    icon: Trophy,
    title: "Bônus por Performance",
    description: "Reconhecimento financeiro por resultados.",
  },
];

const values = [
  {
    icon: Zap,
    title: "Autonomia",
    description: "Confiamos em você para tomar decisões e executar.",
  },
  {
    icon: Users,
    title: "Colaboração",
    description: "Trabalhamos juntos para alcançar grandes resultados.",
  },
  {
    icon: Target,
    title: "Foco em Resultado",
    description: "Valorizamos entregas de qualidade e impacto.",
  },
  {
    icon: Sparkles,
    title: "Inovação",
    description: "Incentivamos experimentação e novas ideias.",
  },
];

const hiringProcess = [
  {
    step: "1",
    title: "Candidatura",
    description: "Envie seu currículo e portfólio pela vaga de interesse.",
  },
  {
    step: "2",
    title: "Triagem",
    description: "Nossa equipe de RH avalia seu perfil.",
  },
  {
    step: "3",
    title: "Entrevista com RH",
    description: "Bate-papo sobre sua experiência e expectativas (30min).",
  },
  {
    step: "4",
    title: "Desafio Técnico",
    description: "Para vagas técnicas: resolução de case prático.",
  },
  {
    step: "5",
    title: "Entrevista Técnica",
    description: "Conversa com liderança técnica sobre o desafio (1h).",
  },
  {
    step: "6",
    title: "Cultural Fit",
    description: "Última conversa com founders sobre valores e cultura.",
  },
  {
    step: "7",
    title: "Proposta",
    description: "Envio da proposta formal e onboarding.",
  },
];

export default function CarreirasPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="w-3 h-3 mr-1" />
              Trabalhe Conosco
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ajude a Transformar a{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                Gestão Empresarial
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Junte-se ao time que está revolucionando a forma como pequenas e
              médias empresas gerenciam seus negócios no Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="#vagas">
                  Ver Vagas Abertas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#cultura">Conheça Nossa Cultura</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  50+
                </div>
                <div className="text-sm text-muted-foreground">Colaboradores</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  100%
                </div>
                <div className="text-sm text-muted-foreground">Remoto</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  4.8/5
                </div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  12
                </div>
                <div className="text-sm text-muted-foreground">Estados</div>
              </div>
            </div>
          </div>
        </section>

        {/* Culture & Values */}
        <section id="cultura" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nossa Cultura
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Valorizamos pessoas que são apaixonadas por tecnologia e querem
                fazer a diferença.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Benefícios
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cuidamos do nosso time com benefícios que realmente fazem diferença.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="vagas" className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Vagas Abertas
              </h2>
              <p className="text-lg text-muted-foreground">
                Encontre a oportunidade perfeita para você.
              </p>
            </div>

            <div className="space-y-4">
              {openPositions.map((position, index) => (
                <Link key={index} href={`/carreiras/${position.slug}`}>
                  <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {position.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {position.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {position.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">
                            Salário
                          </div>
                          <div className="font-semibold">{position.salary}</div>
                        </div>
                        <Button size="sm">
                          Ver Vaga
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {openPositions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No momento não temos vagas abertas.
                </p>
                <p className="text-sm text-muted-foreground">
                  Mas você pode enviar seu currículo para{" "}
                  <a
                    href="mailto:rh@orion.roilabs.com.br"
                    className="text-primary hover:underline"
                  >
                    rh@orion.roilabs.com.br
                  </a>{" "}
                  que entraremos em contato quando surgir uma oportunidade.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Hiring Process */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Processo Seletivo
              </h2>
              <p className="text-lg text-muted-foreground">
                Transparência em cada etapa do processo.
              </p>
            </div>

            <div className="relative">
              {/* Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2 hidden sm:block" />

              <div className="space-y-8">
                {hiringProcess.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start gap-6 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Step Number */}
                    <div className="absolute left-8 md:left-1/2 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl md:-translate-x-1/2 z-10 hidden sm:flex">
                      {item.step}
                    </div>

                    {/* Content */}
                    <div
                      className={`md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                      }`}
                    >
                      <div className="bg-card border border-border rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-2 sm:hidden">
                          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {item.step}
                          </div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                        </div>
                        <h3 className="font-semibold text-lg mb-2 hidden sm:block">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                Tempo médio do processo: <strong>2-3 semanas</strong>
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Não Encontrou sua Vaga?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Envie seu currículo mesmo assim! Estamos sempre em busca de talentos
              e podemos entrar em contato quando surgir uma oportunidade alinhada
              com seu perfil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="mailto:rh@orion.roilabs.com.br">
                  Enviar Currículo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sobre">Conhecer a Empresa</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
