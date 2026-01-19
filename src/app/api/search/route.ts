import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/search?q=termo - Busca global
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all"; // all, posts, categories

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const results: {
      posts?: unknown[];
      categories?: unknown[];
      staticPages?: unknown[];
    } = {};

    // Buscar posts do blog
    if (type === "all" || type === "posts") {
      const posts = await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          author: {
            select: {
              name: true,
            },
          },
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        take: 10,
        orderBy: {
          publishedAt: "desc",
        },
      });

      results.posts = posts.map((post) => ({
        ...post,
        type: "post",
        url: `/blog/${post.slug}`,
      }));
    }

    // Buscar categorias
    if (type === "all" || type === "categories") {
      const categories = await prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
        take: 5,
      });

      results.categories = categories.map((cat) => ({
        ...cat,
        type: "category",
        url: `/blog/categoria/${cat.slug}`,
      }));
    }

    // Buscar páginas estáticas (hardcoded)
    if (type === "all" || type === "pages") {
      const staticPages = [
        {
          title: "Produto - Conheça a Plataforma",
          description: "Todos os módulos e funcionalidades da plataforma",
          url: "/produto",
          keywords: ["produto", "plataforma", "módulos", "funcionalidades", "erp", "crm"],
        },
        {
          title: "Soluções por Segmento",
          description: "Soluções especializadas para diversos segmentos",
          url: "/solucoes",
          keywords: ["soluções", "segmentos", "varejo", "indústria", "serviços"],
        },
        {
          title: "Funcionalidades",
          description: "Explore todas as funcionalidades da plataforma",
          url: "/features",
          keywords: ["funcionalidades", "recursos", "integrações"],
        },
        {
          title: "Planos e Preços",
          description: "Escolha o plano ideal para sua empresa",
          url: "/precos",
          keywords: ["planos", "preços", "valores", "assinatura", "trial"],
        },
        {
          title: "Sobre Nós",
          description: "Conheça a história e missão da Orion Nova",
          url: "/sobre",
          keywords: ["sobre", "empresa", "missão", "valores", "equipe"],
        },
        {
          title: "Contato",
          description: "Entre em contato com nossa equipe",
          url: "/contato",
          keywords: ["contato", "suporte", "vendas", "falar"],
        },
        {
          title: "Central de Ajuda",
          description: "Tutoriais e documentação da plataforma",
          url: "/ajuda",
          keywords: ["ajuda", "suporte", "tutoriais", "documentação", "faq"],
        },
        {
          title: "Carreiras",
          description: "Trabalhe conosco",
          url: "/carreiras",
          keywords: ["carreiras", "vagas", "trabalhe conosco", "emprego"],
        },
      ];

      const matchingPages = staticPages.filter((page) => {
        const lowerQuery = query.toLowerCase();
        return (
          page.title.toLowerCase().includes(lowerQuery) ||
          page.description.toLowerCase().includes(lowerQuery) ||
          page.keywords.some((kw) => kw.includes(lowerQuery))
        );
      });

      results.staticPages = matchingPages.map((page) => ({
        ...page,
        type: "page",
        id: page.url,
      }));
    }

    return NextResponse.json({ query, results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Error performing search" },
      { status: 500 }
    );
  }
}
