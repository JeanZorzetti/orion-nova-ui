import { motion } from "framer-motion";

const companies = [
  { name: "TechCorp", width: "w-28" },
  { name: "Innovate.io", width: "w-32" },
  { name: "DataFlow", width: "w-24" },
  { name: "NexusAI", width: "w-28" },
  { name: "CloudFirst", width: "w-26" },
  { name: "Synapse", width: "w-24" },
];

const SocialProof = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-muted-foreground uppercase tracking-widest">
            Empresas que já operam no futuro
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-12 lg:gap-16"
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${company.width} h-8 flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity duration-300`}
            >
              {/* Placeholder Logo */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-muted to-muted-foreground/20" />
                <span className="text-lg font-semibold text-muted-foreground tracking-tight">
                  {company.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
