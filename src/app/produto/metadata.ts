import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orion ERP - Sistema de Gestão Empresarial com IA | ROI Labs",
  description: "O sistema de gestão empresarial mais completo do mercado, com IA integrada que entende seu negócio e ajuda você a tomar decisões mais inteligentes. Gestão de Clientes, Estoque, Vendas, Financeiro e muito mais.",
  keywords: [
    "ERP",
    "sistema de gestão",
    "gestão empresarial",
    "ERP com IA",
    "inteligência artificial",
    "gestão de clientes",
    "controle de estoque",
    "gestão financeira",
    "vendas",
    "BI",
    "relatórios",
    "dashboard",
    "ROI Labs"
  ],
  authors: [{ name: "ROI Labs" }],
  creator: "ROI Labs",
  publisher: "ROI Labs",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://roilabs.com.br/produto",
    title: "Orion ERP - Sistema de Gestão Empresarial com IA",
    description: "O sistema de gestão empresarial mais completo do mercado, com IA integrada que entende seu negócio.",
    siteName: "ROI Labs",
    images: [
      {
        url: "/images/og-produto.jpg",
        width: 1200,
        height: 630,
        alt: "Orion ERP - Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orion ERP - Sistema de Gestão Empresarial com IA",
    description: "O sistema de gestão empresarial mais completo do mercado, com IA integrada.",
    images: ["/images/og-produto.jpg"],
    creator: "@roilabs",
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
  alternates: {
    canonical: "https://roilabs.com.br/produto",
  },
};
