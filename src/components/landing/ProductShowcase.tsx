"use client";

import { motion } from "framer-motion";
import { ArrowRight, Monitor, Sparkles } from "lucide-react";

const ProductShowcase = () => {
  return (
    <section id="produto" className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-sm text-primary uppercase tracking-widest mb-4"
          >
            <Monitor className="w-4 h-4" />
            Product Preview
          </motion.span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Uma interface que{" "}
            <span className="gradient-text">você vai amar</span> usar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Design premiado, experiência intuitiva. 
            Veja como é fácil gerenciar tudo em um só lugar.
          </p>
        </motion.div>

        {/* Product Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Glow Behind Screen */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 blur-3xl opacity-50" />
          
          {/* Monitor Frame */}
          <div className="relative">
            {/* Screen Bezel */}
            <div className="relative mx-auto max-w-5xl">
              <div className="relative rounded-xl lg:rounded-2xl overflow-hidden border border-border/50 bg-card shadow-2xl">
                {/* Top Bar */}
                <div className="h-8 lg:h-10 bg-sidebar flex items-center px-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                      app.orion-erp.com
                    </div>
                  </div>
                </div>

                {/* Dashboard Preview */}
                <div className="aspect-video bg-background p-4 lg:p-6 flex">
                  {/* Mini Sidebar */}
                  <div className="w-16 lg:w-20 bg-sidebar rounded-lg mr-4 p-2 hidden sm:block">
                    <div className="w-8 h-8 rounded-lg gradient-primary mb-4 mx-auto" />
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-lg mx-auto mb-2 ${
                          i === 1 ? "bg-primary/20" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 space-y-4">
                    {/* Search Bar */}
                    <div className="h-10 lg:h-12 rounded-lg glass-card flex items-center px-4">
                      <Sparkles className="w-4 h-4 text-primary mr-2" />
                      <div className="h-2 w-48 bg-muted rounded" />
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                      {/* Chart Card */}
                      <div className="col-span-2 glass-card p-4 rounded-lg">
                        <div className="h-2 w-24 bg-foreground/20 rounded mb-4" />
                        <div className="h-24 lg:h-32 flex items-end gap-2">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t gradient-primary opacity-60"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* AI Card */}
                      <div className="glass-card p-4 rounded-lg glow-cyan hidden lg:block">
                        <div className="w-8 h-8 rounded-lg gradient-primary mb-3 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="h-2 w-16 bg-foreground/20 rounded mb-2" />
                        <div className="h-2 w-24 bg-muted rounded" />
                      </div>

                      {/* Mini Cards */}
                      <div className="glass-card p-3 rounded-lg">
                        <div className="h-2 w-12 bg-foreground/20 rounded mb-2" />
                        <div className="h-2 w-20 bg-muted rounded" />
                      </div>
                      <div className="glass-card p-3 rounded-lg">
                        <div className="h-2 w-12 bg-foreground/20 rounded mb-2" />
                        <div className="h-2 w-20 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitor Stand */}
              <div className="hidden lg:block">
                <div className="w-24 h-12 mx-auto bg-gradient-to-b from-muted to-muted/50 rounded-b-lg" />
                <div className="w-48 h-3 mx-auto bg-muted rounded-full" />
              </div>
            </div>

            {/* Floating Labels */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-1/4 glass-card px-4 py-2 rounded-lg hidden xl:flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-foreground">Real-time sync</span>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-1/3 glass-card px-4 py-2 rounded-lg hidden xl:flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">AI Insights</span>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="#demo"
            className="btn-primary inline-flex items-center gap-2 text-base"
          >
            Experimente Agora
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
