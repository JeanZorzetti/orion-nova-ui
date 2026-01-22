"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  glowColor?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function GlowButton({
  children,
  variant = "primary",
  glowColor,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: GlowButtonProps) {
  const defaultGlowColor =
    variant === "primary"
      ? "from-green-400 to-green-600"
      : "from-primary to-purple-600";

  return (
    <motion.button
      className={`relative group ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <span className="relative z-10">{children}</span>

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${
          glowColor || defaultGlowColor
        } opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-lg`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
        initial={{ x: "-100%" }}
        whileHover={{
          x: "100%",
          transition: { duration: 0.6, ease: "easeInOut" },
        }}
      />
    </motion.button>
  );
}
