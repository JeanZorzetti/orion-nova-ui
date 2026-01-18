import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Tag,
  TrendingUp,
  Lightbulb,
  Shield,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - Orion ERP | Dicas de Gestão e Novidades",
  description:
    "Artigos, tutoriais e novidades sobre gestão empresarial, ERP, tecnologia e dicas para fazer seu negócio crescer.",
  openGraph: {
    title: "Blog - Orion ERP",
    description: "Artigos e dicas sobre gestão empresarial e tecnologia.",
    type: "website",
  },
};

// Placeholder blog posts - will be replaced with database content
const featuredPost = {
  slug: "como-escolher-erp-ideal",
  title: "Como Escolher o ERP Ideal para sua Empresa em 2026",
  excerpt:
    "Descubra os critérios essenciais para escolher o sistema de gestão perfeito para o seu negócio e evite erros comuns na implementação.",
  coverImage: null,
  category: "Gestão",
  author: "Equipe Orion",
  date: "15 Jan 2026",
  readTime: "8 min",
};

const posts = [
  {
    slug: "ia-na-gestao-empresarial",
    title: "Como a IA está Revolucionando a Gestão Empresarial",
    excerpt:
      "Entenda como a inteligência artificial pode automatizar tarefas e fornecer insights valiosos para sua empresa.",
    category: "Tecnologia",
    author: "Equipe Orion",
    date: "12 Jan 2026",
    readTime: "6 min",
    icon: Lightbulb,
  },
  {
    slug: "controle-estoque-eficiente",
    title: "5 Dicas para um Controle de Estoque Mais Eficiente",
    excerpt:
      "Aprenda técnicas comprovadas para otimizar seu estoque, reduzir perdas e melhorar o giro de produtos.",
    category: "Estoque",
    author: "Equipe Orion",
    date: "10 Jan 2026",
    readTime: "5 min",
    icon: TrendingUp,
  },
  {
    slug: "lgpd-para-pequenas-empresas",
    title: "LGPD: O Que Sua Empresa Precisa Saber",
    excerpt:
      "Guia completo sobre a Lei Geral de Proteção de Dados e como adequar seu negócio às exigências legais.",
    category: "Compliance",
    author: "Equipe Orion",
    date: "08 Jan 2026",
    readTime: "10 min",
    icon: Shield,
  },
  {
    slug: "fluxo-caixa-saudavel",
    title: "Como Manter um Fluxo de Caixa Saudável",
    excerpt:
      "Estratégias práticas para gerenciar entradas e saídas, prever cenários e evitar surpresas financeiras.",
    category: "Financeiro",
    author: "Equipe Orion",
    date: "05 Jan 2026",
    readTime: "7 min",
    icon: Zap,
  },
  {
    slug: "vendas-multicanal",
    title: "Vendas Multicanal: Como Integrar seus Canais de Venda",
    excerpt:
      "Aprenda a gerenciar vendas em loja física, e-commerce e marketplaces de forma integrada.",
    category: "Vendas",
    author: "Equipe Orion",
    date: "02 Jan 2026",
    readTime: "6 min",
    icon: TrendingUp,
  },
  {
    slug: "relatorios-gerenciais",
    title: "Relatórios Gerenciais: Quais Métricas Acompanhar",
    excerpt:
      "Descubra os KPIs essenciais para monitorar a saúde do seu negócio e tomar decisões baseadas em dados.",
    category: "Gestão",
    author: "Equipe Orion",
    date: "28 Dez 2025",
    readTime: "8 min",
    icon: Lightbulb,
  },
];

const categories = [
  { name: "Gestão", count: 12 },
  { name: "Tecnologia", count: 8 },
  { name: "Financeiro", count: 10 },
  { name: "Vendas", count: 7 },
  { name: "Estoque", count: 5 },
  { name: "Compliance", count: 4 },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <BookOpen className="w-3 h-3 mr-1" />
                Blog Orion
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Dicas e Novidades para{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                  seu Negócio
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Artigos, tutoriais e insights sobre gestão empresarial, tecnologia
                e estratégias para fazer sua empresa crescer.
              </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar artigos..."
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6 md:p-10 hover:border-primary/40 transition-colors">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="md:w-1/2 flex flex-col justify-center">
                    <Badge className="w-fit mb-3">{featuredPost.category}</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Posts Grid */}
              <div className="lg:w-2/3">
                <h2 className="text-2xl font-bold mb-6">Últimos Artigos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post, index) => (
                    <Link key={index} href={`/blog/${post.slug}`}>
                      <article className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors h-full">
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <post.icon className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                        <div className="p-5">
                          <Badge variant="secondary" className="mb-2">
                            {post.category}
                          </Badge>
                          <h3 className="font-semibold mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                  <Button variant="outline">
                    Carregar Mais Artigos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:w-1/3 space-y-8">
                {/* Categories */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Categorias
                  </h3>
                  <ul className="space-y-2">
                    {categories.map((category, index) => (
                      <li key={index}>
                        <Link
                          href={`/blog/categoria/${category.name.toLowerCase()}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span>{category.name}</span>
                          <Badge variant="secondary">{category.count}</Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Newsletter</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Receba dicas de gestão e novidades direto no seu email.
                  </p>
                  <div className="space-y-3">
                    <Input placeholder="Seu melhor email" />
                    <Button className="w-full">
                      Inscrever-se
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Sem spam. Cancele quando quiser.
                  </p>
                </div>

                {/* CTA */}
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <h3 className="font-semibold mb-2">Experimente o Orion ERP</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    30 dias grátis para testar todas as funcionalidades.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/register">
                      Começar Grátis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
