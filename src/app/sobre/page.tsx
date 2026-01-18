import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Target,
  Heart,
  Users,
  Rocket,
  Award,
  Globe,
  Lightbulb,
  Shield,
  TrendingUp,
  MapPin,
  Calendar,
  Building2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nós - Orion ERP | Conheça Nossa História e Missão",
  description:
    "Conheça a ROI Labs, a empresa por trás do Orion ERP. Nossa missão é democratizar a tecnologia de gestão empresarial para PMEs brasileiras.",
  openGraph: {
    title: "Sobre Nós - Orion ERP",
    description: "Conheça a história e missão da ROI Labs.",
    type: "website",
  },
};

const values = [
  {
    icon: Lightbulb,
    title: "Inovação",
    description:
      "Buscamos constantemente novas tecnologias e abordagens para entregar a melhor solução aos nossos clientes.",
  },
  {
    icon: Heart,
    title: "Empatia",
    description:
      "Entendemos as dores do empreendedor brasileiro e desenvolvemos soluções que realmente fazem a diferença.",
  },
  {
    icon: Shield,
    title: "Confiança",
    description:
      "Seus dados são tratados com o máximo cuidado e segurança. Transparência em tudo que fazemos.",
  },
  {
    icon: Users,
    title: "Parceria",
    description:
      "Não somos apenas fornecedores, somos parceiros do seu crescimento. Seu sucesso é o nosso sucesso.",
  },
];

const milestones = [
  {
    year: "2023",
    title: "Fundação da ROI Labs",
    description: "Início da jornada com a missão de transformar a gestão de PMEs.",
  },
  {
    year: "2024",
    title: "Lançamento do Orion ERP",
    description: "Primeira versão do sistema com módulos de clientes, estoque e vendas.",
  },
  {
    year: "2025",
    title: "Integração com IA",
    description: "Lançamento da Orion AI, assistente inteligente integrada ao ERP.",
  },
  {
    year: "2026",
    title: "Expansão Nacional",
    description: "Mais de 1.000 empresas usando o Orion ERP em todo o Brasil.",
  },
];

const stats = [
  { value: "1.000+", label: "Empresas Atendidas" },
  { value: "50.000+", label: "Usuários Ativos" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Avaliação Média" },
];

const team = [
  {
    name: "Jean Silva",
    role: "CEO & Founder",
    bio: "Empreendedor serial com mais de 10 anos de experiência em tecnologia e gestão empresarial.",
  },
  {
    name: "Equipe de Desenvolvimento",
    role: "Engineering",
    bio: "Time multidisciplinar de engenheiros especializados em sistemas escaláveis e IA.",
  },
  {
    name: "Equipe de Suporte",
    role: "Customer Success",
    bio: "Profissionais dedicados a garantir o sucesso dos nossos clientes.",
  },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                Nossa História
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Transformando a Gestão de{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                  PMEs no Brasil
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A ROI Labs nasceu com uma missão clara: democratizar o acesso a
                tecnologia de gestão empresarial de alta qualidade para pequenas e
                médias empresas brasileiras.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
                <p className="text-muted-foreground">
                  Empoderar empreendedores brasileiros com ferramentas de gestão
                  acessíveis, intuitivas e inteligentes, permitindo que foquem no que
                  realmente importa: fazer seus negócios crescerem.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Rocket className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Nossa Visão</h2>
                <p className="text-muted-foreground">
                  Ser a plataforma de gestão empresarial mais amada do Brasil,
                  reconhecida pela inovação, facilidade de uso e pelo impacto positivo
                  na vida de milhares de empreendedores.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Valores</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Os princípios que guiam cada decisão e cada linha de código que
                escrevemos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Nossa Jornada</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Uma História de Inovação
              </h2>
            </div>

            <div className="relative">
              {/* Line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full md:-translate-x-1/2 z-10" />

                    {/* Content */}
                    <div
                      className={`ml-12 md:ml-0 md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <Badge variant="secondary" className="mb-2">
                        {milestone.year}
                      </Badge>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Nosso Time</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pessoas apaixonadas por tecnologia e por ajudar empreendedores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl p-6 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Onde Estamos</h3>
                  <p className="text-muted-foreground mb-4">
                    Somos uma empresa 100% brasileira, com operação remota e presença
                    em todo o território nacional. Nossa sede administrativa está
                    localizada em São Paulo, SP.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary">
                      <Globe className="w-3 h-3 mr-1" />
                      100% Remoto
                    </Badge>
                    <Badge variant="secondary">
                      <Building2 className="w-3 h-3 mr-1" />
                      São Paulo, SP
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Reconhecimentos
              </h2>
              <p className="text-lg text-muted-foreground">
                Nosso trabalho é reconhecido por quem entende do assunto.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Award className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">Top 10 Startups SaaS</h3>
                <p className="text-sm text-muted-foreground">Startup Awards 2025</p>
              </div>
              <div className="text-center p-6">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">Crescimento Exponencial</h3>
                <p className="text-sm text-muted-foreground">500% em 12 meses</p>
              </div>
              <div className="text-center p-6">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-1">Melhor NPS do Segmento</h3>
                <p className="text-sm text-muted-foreground">Score de 78</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Faça Parte dessa História
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de empresas que estão transformando sua gestão com
              o Orion ERP. Comece gratuitamente hoje.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Começar Grátis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contato">Falar Conosco</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
