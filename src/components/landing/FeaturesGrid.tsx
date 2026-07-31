"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Package, 
  Brain,
  LineChart,
  Shield,
  Zap,
  Globe
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Finanças Preditivas",
    description: "IA que antecipa fluxo de caixa, detecta anomalias e sugere otimizações fiscais.",
    size: "large",
    gradient: true,
  },
  {
    icon: Users,
    title: "CRM Inteligente",
    description: "Leads qualificados automaticamente. Saiba exatamente quando e como abordar cada cliente.",
    size: "medium",
    gradient: false,
  },
  {
    icon: Package,
    title: "Estoque Autônomo",
    description: "Reposição automática baseada em previsão de demanda e sazonalidade.",
    size: "medium",
    gradient: false,
  },
  {
    icon: Brain,
    title: "IA Conversacional",
    description: "Pergunte em linguagem natural: 'Qual foi meu lucro em janeiro?'",
    size: "small",
    gradient: true,
  },
  {
    icon: LineChart,
    title: "Dashboards Vivos",
    description: "Visualizações que se adaptam ao contexto do seu negócio.",
    size: "small",
    gradient: false,
  },
  {
    icon: Shield,
    title: "Segurança Enterprise",
    description: "Criptografia end-to-end e conformidade com LGPD.",
    size: "small",
    gradient: false,
  },
  {
    icon: Zap,
    title: "Automações No-Code",
    description: "Crie fluxos automatizados sem escrever uma linha de código.",
    size: "small",
    gradient: false,
  },
  {
    icon: Globe,
    title: "Multi-filial",
    description: "Gerencie todas as unidades em tempo real, de qualquer lugar.",
    size: "small",
    gradient: false,
  },
];

const FeaturesGrid = () => {
  return (
    <section id="features" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="orb orb-purple w-[400px] h-[400px] top-20 right-0 opacity-20" />
        <div className="orb orb-cyan w-[300px] h-[300px] bottom-40 left-10 opacity-15" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block text-sm text-primary uppercase tracking-widest mb-4"
          >
            Recursos
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Tudo que você precisa,{" "}
            <span className="gradient-text">potencializado por IA</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Módulos integrados que trabalham juntos para automatizar, 
            prever e otimizar cada aspecto do seu negócio.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => {
            const isLarge = feature.size === "large";
            const isMedium = feature.size === "medium";

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  ${isLarge ? "col-span-2 row-span-2" : ""}
                  ${isMedium ? "col-span-2 md:col-span-2" : ""}
                  ${!isLarge && !isMedium ? "col-span-1" : ""}
                `}
              >
                <div
                  className={`
                    h-full glass-card p-6 lg:p-8 hover-glow cursor-pointer group
                    ${feature.gradient ? "glow-cyan" : ""}
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center mb-4
                      ${feature.gradient 
                        ? "gradient-primary" 
                        : "bg-muted border border-border"
                      }
                      transition-transform duration-300 group-hover:scale-110
                    `}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${
                        feature.gradient ? "text-primary-foreground" : "text-primary"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <h3
                    className={`
                      font-semibold mb-2 text-foreground
                      ${isLarge ? "text-2xl" : "text-lg"}
                    `}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`
                      text-muted-foreground leading-relaxed
                      ${isLarge ? "text-base" : "text-sm"}
                    `}
                  >
                    {feature.description}
                  </p>

                  {/* ponytail: saiu o selo "+2.500 empresas usando" — número inventado. */}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
