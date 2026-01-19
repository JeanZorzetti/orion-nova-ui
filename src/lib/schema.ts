// Tipos Schema.org para JSON-LD
// Referência: https://schema.org/

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://orionnova.com.br";

// Schema da Organização
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Orion Nova",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "Plataforma completa de gestão empresarial com ERP, CRM, Gestão Financeira e muito mais.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Paulista, 1000",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    postalCode: "01310-100",
    addressCountry: "BR",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+55-11-1234-5678",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: ["Portuguese"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+55-11-1234-5679",
      contactType: "sales",
      areaServed: "BR",
      availableLanguage: ["Portuguese"],
    },
  ],
  sameAs: [
    "https://facebook.com/orionnova",
    "https://twitter.com/orionnova",
    "https://linkedin.com/company/orionnova",
    "https://instagram.com/orionnova",
  ],
};

// Schema do Website
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Orion Nova",
  url: BASE_URL,
  description:
    "Sistema completo de gestão empresarial para transformar sua empresa.",
  publisher: {
    "@type": "Organization",
    name: "Orion Nova",
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// Schema de Software/Produto
export const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Orion Nova",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Windows, macOS, Linux",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "BRL",
    lowPrice: "299",
    highPrice: "1499",
    offerCount: "4",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
  description:
    "Plataforma completa de gestão empresarial com módulos de ERP, CRM, Gestão Financeira, Projetos, RH e muito mais.",
  screenshot: `${BASE_URL}/screenshots/dashboard.png`,
  softwareVersion: "2.0",
  releaseNotes: "Nova versão com melhorias de performance e novos recursos.",
};

// Schema de FAQ Page
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Schema de Artigo de Blog
export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  slug,
}: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    image?: string;
  };
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image || `${BASE_URL}/og-image.png`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author.name,
      image: author.image,
    },
    publisher: {
      "@type": "Organization",
      name: "Orion Nova",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
  };
}

// Schema de BreadcrumbList
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Schema de Produto/Plano
export function generateProductSchema({
  name,
  description,
  price,
  currency = "BRL",
  availability = "InStock",
}: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  availability?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    description: description,
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url: `${BASE_URL}/pricing`,
    },
    brand: {
      "@type": "Brand",
      name: "Orion Nova",
    },
  };
}

// Schema de Lista de Artigos (Blog)
export function generateBlogListingSchema(
  posts: {
    title: string;
    slug: string;
    datePublished: string;
    author: string;
  }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/blog/${post.slug}`,
      name: post.title,
      datePublished: post.datePublished,
      author: {
        "@type": "Person",
        name: post.author,
      },
    })),
  };
}

// Schema de Vaga de Emprego
export function generateJobPostingSchema({
  title,
  description,
  datePosted,
  employmentType,
  location,
  salary,
}: {
  title: string;
  description: string;
  datePosted: string;
  employmentType: string;
  location: string;
  salary?: { min: number; max: number };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: title,
    description: description,
    datePosted: datePosted,
    employmentType: employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: "Orion Nova",
      sameAs: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
        addressCountry: "BR",
      },
    },
    baseSalary: salary
      ? {
          "@type": "MonetaryAmount",
          currency: "BRL",
          value: {
            "@type": "QuantitativeValue",
            minValue: salary.min,
            maxValue: salary.max,
            unitText: "MONTH",
          },
        }
      : undefined,
  };
}
