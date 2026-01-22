import { Testimonial } from "@/components/social-proof";

// Mock logos - usando placeholders SVG
// Em produção, substituir por logos reais dos clientes
export const clientLogos = [
  {
    name: "Tech Corp",
    src: "https://placehold.co/120x40/1a1a1a/white?text=TechCorp",
    width: 120,
    height: 40,
  },
  {
    name: "Retail Plus",
    src: "https://placehold.co/120x40/1a1a1a/white?text=RetailPlus",
    width: 120,
    height: 40,
  },
  {
    name: "Industry Co",
    src: "https://placehold.co/120x40/1a1a1a/white?text=IndustryCo",
    width: 120,
    height: 40,
  },
  {
    name: "Service Pro",
    src: "https://placehold.co/120x40/1a1a1a/white?text=ServicePro",
    width: 120,
    height: 40,
  },
  {
    name: "Commerce Inc",
    src: "https://placehold.co/120x40/1a1a1a/white?text=CommerceInc",
    width: 120,
    height: 40,
  },
  {
    name: "Logistics Ltd",
    src: "https://placehold.co/120x40/1a1a1a/white?text=LogisticsLtd",
    width: 120,
    height: 40,
  },
];

// Depoimentos de clientes
export const testimonials: Testimonial[] = [
  {
    quote:
      "O Orion ERP transformou completamente nossa gestão. Reduzimos 87% do tempo em relatórios e conseguimos focar no que realmente importa: crescer nosso negócio.",
    author: "Carlos Silva",
    role: "CEO",
    company: "Tech Solutions Brasil",
    metric: "+45% vendas",
  },
  {
    quote:
      "Antes do Orion, perdíamos horas em planilhas desconexas. Agora temos visibilidade total em tempo real e tomamos decisões baseadas em dados sólidos.",
    author: "Maria Oliveira",
    role: "Diretora Financeira",
    company: "Retail Commerce LTDA",
    metric: "-96% erros",
  },
  {
    quote:
      "A integração de todos os módulos é excepcional. O suporte é rápido e a plataforma é intuitiva. Nossa equipe adaptou-se em menos de uma semana.",
    author: "João Santos",
    role: "Gerente de Operações",
    company: "Indústria Nacional S/A",
    metric: "+200% eficiência",
  },
];
