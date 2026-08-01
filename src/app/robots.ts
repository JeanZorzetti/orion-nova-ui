import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://orion.roilabs.com.br";

// Crawlers de IA são PERMITIDOS aqui, com as mesmas exclusões do bloco `*`. Estavam com
// `Disallow: /`, o que barrava a citação em ChatGPT, Claude e Perplexity — o oposto do que a
// norma GEO/AEO da casa quer de um site de produto. Blocos de robots são avaliados por agente
// em isolamento: os Disallow do `*` NÃO cascateiam, por isso a lista se repete aqui.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "CCBot",
];

const DISALLOW = [
  "/api/",
  "/admin/",
  "/dashboard/",
  "/perfil/",
  "/assinaturas/",
  "/checkout/",
  "/_next/",
  "/private/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
