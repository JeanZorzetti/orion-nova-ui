"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function AnimatedCard({
  children,
  className = "",
  glowColor = "16, 185, 129", // green-500 RGB
}: AnimatedCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: 1.05,
        y: -5,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      {children}

      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-xl -z-10"
        style={{
          background: `rgba(${glowColor}, 0.3)`,
        }}
        whileHover={{
          opacity: 1,
          transition: { duration: 0.3 },
        }}
      />
    </motion.div>
  );
}
