import { Metadata } from "next";

// Base URL do site
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://orionnova.com.br";

// Metadata padrão do site
export const defaultMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Orion Nova - Sistema Completo de Gestão Empresarial",
    template: "%s | Orion Nova",
  },
  description:
    "Transforme sua empresa com a plataforma completa de gestão empresarial. ERP, CRM, Gestão Financeira e muito mais em uma única solução.",
  keywords: [
    "ERP",
    "CRM",
    "gestão empresarial",
    "software de gestão",
    "sistema empresarial",
    "automação",
    "gestão financeira",
    "controle de estoque",
    "gestão de projetos",
  ],
  authors: [{ name: "Orion Nova" }],
  creator: "Orion Nova",
  publisher: "Orion Nova",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Orion Nova",
    title: "Orion Nova - Sistema Completo de Gestão Empresarial",
    description:
      "Transforme sua empresa com a plataforma completa de gestão empresarial. ERP, CRM, Gestão Financeira e muito mais em uma única solução.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Orion Nova - Sistema de Gestão Empresarial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orion Nova - Sistema Completo de Gestão Empresarial",
    description:
      "Transforme sua empresa com a plataforma completa de gestão empresarial. ERP, CRM, Gestão Financeira e muito mais.",
    images: [`${BASE_URL}/twitter-image.png`],
    creator: "@orionnova",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

// Metadata para páginas específicas
export const pageMetadata = {
  home: {
    title: "Orion Nova - Sistema Completo de Gestão Empresarial",
    description:
      "Transforme sua empresa com a plataforma completa de gestão empresarial. ERP, CRM, Gestão Financeira e muito mais em uma única solução.",
    openGraph: {
      title: "Orion Nova - Sistema Completo de Gestão Empresarial",
      description:
        "Transforme sua empresa com a plataforma completa de gestão empresarial.",
      url: BASE_URL,
    },
  },

  produto: {
    title: "Produto - Conheça a Plataforma Orion Nova",
    description:
      "Descubra todos os módulos e funcionalidades da plataforma Orion Nova. ERP, CRM, Financeiro, Projetos, RH e muito mais integrados em uma única solução.",
    openGraph: {
      title: "Produto - Conheça a Plataforma Orion Nova",
      description:
        "Descubra todos os módulos e funcionalidades da plataforma Orion Nova.",
      url: `${BASE_URL}/produto`,
    },
  },

  solucoes: {
    title: "Soluções por Segmento - Orion Nova",
    description:
      "Soluções especializadas para diversos segmentos: Varejo, Indústria, Serviços, E-commerce, Saúde, Educação e mais. Otimize sua gestão com Orion Nova.",
    openGraph: {
      title: "Soluções por Segmento - Orion Nova",
      description:
        "Soluções especializadas para diversos segmentos empresariais.",
      url: `${BASE_URL}/solucoes`,
    },
  },

  features: {
    title: "Funcionalidades - Orion Nova",
    description:
      "Explore todas as funcionalidades da plataforma Orion Nova. Gestão completa, automação inteligente, integrações nativas e muito mais.",
    openGraph: {
      title: "Funcionalidades - Orion Nova",
      description:
        "Explore todas as funcionalidades da plataforma Orion Nova.",
      url: `${BASE_URL}/features`,
    },
  },

  pricing: {
    title: "Planos e Preços - Orion Nova",
    description:
      "Escolha o plano ideal para sua empresa. Planos flexíveis com recursos escaláveis. Teste grátis por 14 dias sem necessidade de cartão de crédito.",
    openGraph: {
      title: "Planos e Preços - Orion Nova",
      description: "Escolha o plano ideal para sua empresa.",
      url: `${BASE_URL}/pricing`,
    },
  },

  sobre: {
    title: "Sobre Nós - Orion Nova",
    description:
      "Conheça a história, missão e valores da Orion Nova. Transformando a gestão empresarial desde 2020 com inovação e excelência.",
    openGraph: {
      title: "Sobre Nós - Orion Nova",
      description: "Conheça a história, missão e valores da Orion Nova.",
      url: `${BASE_URL}/sobre`,
    },
  },

  contato: {
    title: "Contato - Orion Nova",
    description:
      "Entre em contato com nossa equipe. Suporte técnico, vendas, parcerias e dúvidas. Estamos prontos para ajudar sua empresa.",
    openGraph: {
      title: "Contato - Orion Nova",
      description: "Entre em contato com nossa equipe.",
      url: `${BASE_URL}/contato`,
    },
  },

  blog: {
    title: "Blog - Orion Nova",
    description:
      "Artigos, dicas e novidades sobre gestão empresarial, tecnologia, produtividade e transformação digital. Aprenda com os especialistas da Orion Nova.",
    openGraph: {
      title: "Blog - Orion Nova",
      description: "Artigos e dicas sobre gestão empresarial e tecnologia.",
      url: `${BASE_URL}/blog`,
    },
  },

  ajuda: {
    title: "Central de Ajuda - Orion Nova",
    description:
      "Encontre respostas para suas dúvidas na nossa central de ajuda. Tutoriais, FAQs e documentação completa da plataforma Orion Nova.",
    openGraph: {
      title: "Central de Ajuda - Orion Nova",
      description: "Encontre respostas para suas dúvidas.",
      url: `${BASE_URL}/ajuda`,
    },
  },

  carreiras: {
    title: "Carreiras - Trabalhe na Orion Nova",
    description:
      "Junte-se ao nosso time! Vagas abertas, cultura organizacional e benefícios. Faça parte da transformação digital das empresas brasileiras.",
    openGraph: {
      title: "Carreiras - Trabalhe na Orion Nova",
      description: "Junte-se ao nosso time! Vagas abertas e benefícios.",
      url: `${BASE_URL}/carreiras`,
    },
  },

  privacidade: {
    title: "Política de Privacidade - Orion Nova",
    description:
      "Leia nossa política de privacidade e saiba como protegemos seus dados pessoais de acordo com a LGPD.",
    openGraph: {
      title: "Política de Privacidade - Orion Nova",
      description: "Saiba como protegemos seus dados pessoais.",
      url: `${BASE_URL}/privacidade`,
    },
  },

  termos: {
    title: "Termos de Uso - Orion Nova",
    description:
      "Leia nossos termos de uso e condições de utilização da plataforma Orion Nova.",
    openGraph: {
      title: "Termos de Uso - Orion Nova",
      description: "Termos de uso e condições de utilização da plataforma.",
      url: `${BASE_URL}/termos`,
    },
  },
};

// Função auxiliar para gerar metadata de post do blog
export function generateBlogPostMetadata({
  title,
  excerpt,
  coverImage,
  publishedAt,
  author,
  slug,
  tags,
}: {
  title: string;
  excerpt?: string;
  coverImage?: string;
  publishedAt?: Date;
  author?: { name: string; image?: string };
  slug: string;
  tags?: string[];
}): Metadata {
  const url = `${BASE_URL}/blog/${slug}`;
  const description =
    excerpt || "Leia este artigo no blog da Orion Nova sobre gestão empresarial.";
  const image = coverImage || `${BASE_URL}/og-image.png`;

  return {
    title,
    description,
    keywords: tags,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: publishedAt?.toISOString(),
      authors: author ? [author.name] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: author ? `@${author.name}` : "@orionnova",
    },
  };
}

// Função auxiliar para gerar metadata de categoria do blog
export function generateCategoryMetadata({
  name,
  description,
  slug,
}: {
  name: string;
  description?: string;
  slug: string;
}): Metadata {
  const url = `${BASE_URL}/blog/categoria/${slug}`;
  const desc =
    description || `Artigos sobre ${name} no blog da Orion Nova.`;

  return {
    title: `${name} - Blog Orion Nova`,
    description: desc,
    openGraph: {
      title: `${name} - Blog Orion Nova`,
      description: desc,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} - Blog Orion Nova`,
      description: desc,
    },
  };
}
