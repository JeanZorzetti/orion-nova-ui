"use client";

import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";
import DemoTooltip from "./DemoTooltip";
import { useState } from "react";

interface DemoHotspotProps {
  x: number; // % position (0-100)
  y: number; // % position (0-100)
  label: string;
  pulseColor: string;
  title: string;
  description: string;
  highlight: string;
  onClick: () => void;
  accentColor?: string;
}

export default function DemoHotspot({
  x,
  y,
  label,
  pulseColor,
  title,
  description,
  highlight,
  onClick,
  accentColor = "text-green-400",
}: DemoHotspotProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    setShowTooltip(true);
    onClick();

    // Auto-hide tooltip after 3s
    setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <div
      className="absolute z-40"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Hotspot button */}
      <motion.button
        className="relative w-14 h-14 rounded-full border-2 border-white/30 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center cursor-pointer group"
        onClick={handleClick}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Icon */}
        <MousePointer2 className="w-5 h-5 text-pure-white" />

        {/* Pulse rings */}
        <motion.div
          className={`absolute inset-0 rounded-full ${pulseColor} opacity-40`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute inset-0 rounded-full ${pulseColor} opacity-40`}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2,
            delay: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Glow on hover */}
        <div
          className={`absolute inset-0 rounded-full ${pulseColor} opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-300`}
        />
      </motion.button>

      {/* Label badge */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="px-3 py-1 rounded-full bg-charcoal/90 backdrop-blur-sm border border-white/20 text-xs text-pure-white font-medium shadow-lg">
          {label}
        </div>
      </motion.div>

      {/* Tooltip */}
      <DemoTooltip
        title={title}
        description={description}
        highlight={highlight}
        visible={showTooltip}
        position="bottom"
        accentColor={accentColor}
      />
    </div>
  );
}
