"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 stars opacity-30" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Floating Orbs */}
      <div className="orb orb-cyan w-[600px] h-[600px] -top-40 -right-40" />
      <div className="orb orb-purple w-[500px] h-[500px] -bottom-40 -left-40" style={{ animationDelay: "-4s" }} />
      <div className="orb orb-cyan w-[300px] h-[300px] top-1/3 left-1/4 opacity-20" style={{ animationDelay: "-2s" }} />

      {/* Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Powered by AI • Lançamento 2025
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
              <span className="text-foreground">O Futuro da</span>
              <br />
              <span className="text-foreground">Gestão é </span>
              <span className="gradient-text">Preditivo.</span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            >
              Orion é o primeiro ERP que usa IA generativa para não apenas organizar, 
              mas <span className="text-foreground font-medium">antecipar as necessidades</span> do seu negócio.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a href="#demo" className="btn-primary inline-flex items-center justify-center gap-2 text-base">
                Agendar Demonstração IA
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#produto" className="btn-ghost inline-flex items-center justify-center gap-2 text-base">
                <Play className="w-4 h-4" />
                Ver o Produto
              </a>
            </motion.div>
          </motion.div>

          {/* Right Visual - Abstract Data Brain */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-accent/20 animate-[spin_15s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full border border-primary/30 animate-[spin_25s_linear_infinite]" />
              
              {/* Neural Network Nodes */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                {/* Connection Lines */}
                <g className="opacity-30">
                  <line x1="200" y1="80" x2="120" y2="160" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="200" y1="80" x2="280" y2="160" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="120" y1="160" x2="80" y2="260" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="120" y1="160" x2="200" y2="200" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="280" y1="160" x2="320" y2="260" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="280" y1="160" x2="200" y2="200" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="200" y1="200" x2="140" y2="300" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="200" y1="200" x2="260" y2="300" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="80" y1="260" x2="140" y2="300" stroke="url(#lineGradient)" strokeWidth="1" />
                  <line x1="320" y1="260" x2="260" y2="300" stroke="url(#lineGradient)" strokeWidth="1" />
                </g>
                
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(187, 100%, 50%)" />
                    <stop offset="100%" stopColor="hsl(271, 91%, 65%)" />
                  </linearGradient>
                  <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity="1" />
                    <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Nodes */}
                <circle cx="200" cy="80" r="8" fill="url(#lineGradient)" className="animate-pulse" />
                <circle cx="120" cy="160" r="6" fill="hsl(187, 100%, 50%)" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
                <circle cx="280" cy="160" r="6" fill="hsl(271, 91%, 65%)" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
                <circle cx="80" cy="260" r="5" fill="hsl(187, 100%, 50%)" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
                <circle cx="320" cy="260" r="5" fill="hsl(271, 91%, 65%)" className="animate-pulse" style={{ animationDelay: "0.8s" }} />
                <circle cx="200" cy="200" r="12" fill="url(#lineGradient)" className="animate-pulse" />
                <circle cx="140" cy="300" r="6" fill="hsl(187, 100%, 50%)" className="animate-pulse" style={{ animationDelay: "1s" }} />
                <circle cx="260" cy="300" r="6" fill="hsl(271, 91%, 65%)" className="animate-pulse" style={{ animationDelay: "1.2s" }} />
              </svg>

              {/* Center Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-24 h-24 rounded-full gradient-primary glow-mixed flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="gradient-text text-2xl font-bold">AI</span>
                  </div>
                </div>
              </div>

              {/* Floating Data Points */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-16 right-16 glass-card px-3 py-2 text-xs"
              >
                <span className="text-primary">+127%</span> produtividade
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-24 left-8 glass-card px-3 py-2 text-xs"
              >
                <span className="text-accent">IA</span> análise preditiva
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
