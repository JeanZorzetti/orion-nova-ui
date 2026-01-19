import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  BookOpen,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
} from "lucide-react";
import { generateBlogPostMetadata } from "@/lib/metadata";
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";

// Placeholder posts data - will be replaced with database
const postsData: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}> = {
  "como-escolher-erp-ideal": {
    title: "Como Escolher o ERP Ideal para sua Empresa em 2026",
    excerpt:
      "Descubra os critérios essenciais para escolher o sistema de gestão perfeito para o seu negócio.",
    content: `
## Introdução

Escolher um sistema ERP (Enterprise Resource Planning) é uma das decisões mais importantes que um empresário pode tomar. Um ERP bem escolhido pode transformar a eficiência da sua operação, enquanto uma escolha errada pode gerar dores de cabeça e prejuízos.

Neste artigo, vamos explorar os principais critérios que você deve considerar ao escolher o ERP ideal para sua empresa.

## 1. Entenda as Necessidades do Seu Negócio

Antes de começar a pesquisar sistemas, faça um levantamento detalhado das necessidades da sua empresa:

- **Quais processos precisam ser automatizados?**
- **Quantos usuários vão utilizar o sistema?**
- **Quais integrações são necessárias?**
- **Qual o orçamento disponível?**

## 2. Avalie a Escalabilidade

Seu negócio vai crescer, e o ERP precisa acompanhar esse crescimento. Verifique:

- O sistema permite adicionar novos usuários facilmente?
- É possível ativar novos módulos conforme a necessidade?
- A infraestrutura suporta um volume maior de dados?

## 3. Considere a Usabilidade

Um sistema complexo demais pode gerar resistência da equipe. Busque:

- Interface intuitiva e moderna
- Treinamento e suporte adequados
- Documentação completa

## 4. Verifique as Integrações

O ERP precisa conversar com outros sistemas que você já usa:

- Marketplaces (Mercado Livre, Shopee, etc.)
- Plataformas de e-commerce
- Sistemas de pagamento
- Ferramentas de marketing

## 5. Analise o Custo-Benefício

Não olhe apenas para o preço mensal. Considere:

- Custo de implementação
- Tempo de treinamento da equipe
- ROI esperado
- Economia de tempo e recursos

## Conclusão

Escolher o ERP certo é um investimento no futuro da sua empresa. Dedique tempo para pesquisar, testar e comparar as opções disponíveis.

O Orion ERP oferece 30 dias de trial gratuito para você testar todas as funcionalidades antes de decidir. [Comece seu trial agora](/register).
    `,
    category: "Gestão",
    author: "Equipe Orion",
    date: "15 Jan 2026",
    readTime: "8 min",
  },
  "ia-na-gestao-empresarial": {
    title: "Como a IA está Revolucionando a Gestão Empresarial",
    excerpt:
      "Entenda como a inteligência artificial pode automatizar tarefas e fornecer insights valiosos.",
    content: `
## A Era da Inteligência Artificial nos Negócios

A inteligência artificial deixou de ser ficção científica e se tornou uma ferramenta essencial para empresas de todos os tamanhos. Em 2026, a IA está mais acessível do que nunca.

## Aplicações Práticas da IA em ERPs

### 1. Análise Preditiva de Vendas

A IA pode analisar históricos de vendas e prever tendências futuras, ajudando você a:

- Planejar compras de estoque
- Identificar sazonalidades
- Antecipar demandas

### 2. Automação de Tarefas Repetitivas

Tarefas como categorização de produtos, lançamentos financeiros e geração de relatórios podem ser automatizadas.

### 3. Atendimento ao Cliente

Chatbots inteligentes podem responder dúvidas frequentes 24/7, liberando sua equipe para tarefas mais complexas.

### 4. Detecção de Anomalias

A IA pode identificar padrões suspeitos em transações financeiras, ajudando a prevenir fraudes.

## O Orion AI

O Orion ERP conta com uma assistente de IA integrada que:

- Responde perguntas sobre seus dados em linguagem natural
- Fornece insights personalizados
- Alerta sobre situações que precisam de atenção
- Sugere ações para melhorar resultados

## Conclusão

A IA não é mais um diferencial, é uma necessidade. Empresas que não adotarem essa tecnologia ficarão para trás.
    `,
    category: "Tecnologia",
    author: "Equipe Orion",
    date: "12 Jan 2026",
    readTime: "6 min",
  },
};

// Default content for posts not in the database
const defaultPost = {
  title: "Artigo em Construção",
  excerpt: "Este artigo está sendo preparado pela nossa equipe.",
  content: `
## Em Breve

Este artigo está sendo escrito pela nossa equipe de conteúdo. Volte em breve para conferir!

Enquanto isso, confira nossos outros artigos no [blog](/blog).
  `,
  category: "Geral",
  author: "Equipe Orion",
  date: "Jan 2026",
  readTime: "5 min",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postsData[slug] || defaultPost;

  return generateBlogPostMetadata({
    title: post.title,
    excerpt: post.excerpt,
    slug,
    author: { name: post.author },
    publishedAt: new Date(post.date),
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = postsData[slug] || defaultPost;

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { name: post.author },
    slug,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: process.env.NEXT_PUBLIC_BASE_URL || "https://orionnova.com.br" },
    { name: "Blog", url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://orionnova.com.br"}/blog` },
    { name: post.title, url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://orionnova.com.br"}/blog/${slug}` },
  ]);

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="min-h-screen bg-background">
        <Header />

      <main>
        {/* Breadcrumb */}
        <section className="pt-28 pb-4 px-4">
          <div className="container mx-auto max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-foreground truncate">{post.title}</span>
            </nav>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Blog
            </Link>

            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime} de leitura
              </span>
            </div>

            {/* Cover Image Placeholder */}
            <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center mb-8">
              <BookOpen className="w-20 h-20 text-muted-foreground/30" />
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-4 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Main Content */}
              <article className="lg:w-3/4 prose prose-neutral dark:prose-invert max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.content
                      .split("\n")
                      .map((line) => {
                        if (line.startsWith("## ")) {
                          return `<h2>${line.replace("## ", "")}</h2>`;
                        }
                        if (line.startsWith("### ")) {
                          return `<h3>${line.replace("### ", "")}</h3>`;
                        }
                        if (line.startsWith("- ")) {
                          return `<li>${line.replace("- ", "")}</li>`;
                        }
                        if (line.trim() === "") {
                          return "<br/>";
                        }
                        return `<p>${line}</p>`;
                      })
                      .join(""),
                  }}
                />
              </article>

              {/* Sidebar */}
              <aside className="lg:w-1/4 space-y-6">
                {/* Share */}
                <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="w-10 h-10">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-10 h-10">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-10 h-10">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-10 h-10">
                      <Link2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Pronto para Modernizar sua Gestão?
              </h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Experimente o Orion ERP gratuitamente por 30 dias e descubra como
                podemos ajudar seu negócio a crescer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/register">
                    Começar Trial Grátis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/blog">Ver Mais Artigos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

        <Footer />
      </div>
    </>
  );
}
