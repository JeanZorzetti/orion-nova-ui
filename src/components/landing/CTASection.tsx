import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";

const CTASection = () => {
  return (
    <section id="demo" className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="orb orb-cyan w-[600px] h-[600px] top-0 left-1/4 opacity-20" />
        <div className="orb orb-purple w-[500px] h-[500px] bottom-0 right-1/4 opacity-15" style={{ animationDelay: "-4s" }} />
        <div className="absolute inset-0 grid-bg opacity-10" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl gradient-primary glow-mixed flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
        >
          Pronto para{" "}
          <span className="gradient-text">transformar</span>
          <br />
          sua gestão empresarial?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Agende uma demonstração personalizada e veja como a IA do Orion 
          pode automatizar e otimizar os processos do seu negócio.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <a
            href="#"
            className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4"
          >
            <Calendar className="w-5 h-5" />
            Agendar Demonstração Gratuita
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Setup em 24h</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Suporte dedicado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Sem compromisso</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
