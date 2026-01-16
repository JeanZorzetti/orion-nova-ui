"use client";

import { motion } from "framer-motion";
import { X, Check, AlertTriangle, Sparkles, Clock, Zap } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section id="solucoes" className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Por que empresas estão{" "}
            <span className="gradient-text">migrando</span> para o Orion?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ERPs tradicionais foram construídos para o passado. 
            Orion foi projetado para o futuro.
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* The Old Way */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative p-8 rounded-2xl bg-muted/20 border border-muted-foreground/10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-muted-foreground">O Jeito Antigo</h3>
                  <p className="text-sm text-muted-foreground/60">ERPs Tradicionais</p>
                </div>
              </div>

              {/* Problems List */}
              <div className="space-y-4">
                {[
                  { icon: AlertTriangle, text: "Interfaces complexas e ultrapassadas" },
                  { icon: Clock, text: "Semanas de treinamento para a equipe" },
                  { icon: X, text: "Relatórios manuais e demorados" },
                  { icon: X, text: "Zero inteligência preditiva" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Visual - Messy Spreadsheet */}
              <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-muted-foreground/10">
                <div className="grid grid-cols-4 gap-1 opacity-50">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 rounded bg-muted-foreground/20"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/40 text-center mt-3">
                  Planilhas infinitas...
                </p>
              </div>
            </div>
          </motion.div>

          {/* The Orion Way */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative p-8 rounded-2xl glass-card glow-mixed">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl gradient-primary glow-cyan flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">O Jeito Orion</h3>
                  <p className="text-sm text-primary">ERP + IA Generativa</p>
                </div>
              </div>

              {/* Solutions List */}
              <div className="space-y-4">
                {[
                  { icon: Check, text: "Interface intuitiva e moderna", highlight: true },
                  { icon: Zap, text: "Curva de aprendizado de minutos", highlight: false },
                  { icon: Sparkles, text: "Relatórios gerados por IA instantaneamente", highlight: true },
                  { icon: Check, text: "Previsões e recomendações inteligentes", highlight: true },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      item.highlight ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      item.highlight ? "text-primary" : "text-foreground"
                    }`} />
                    <span className={`text-sm ${item.highlight ? "text-foreground" : "text-muted-foreground"}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Visual - AI Suggestion */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Orion AI detectou:
                    </p>
                    <p className="text-xs text-muted-foreground">
                      "Seu estoque de Produto X ficará zerado em 5 dias. 
                      Deseja que eu crie um pedido de reposição?"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
