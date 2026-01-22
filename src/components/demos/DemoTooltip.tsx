"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface DemoTooltipProps {
  title: string;
  description: string;
  highlight: string;
  visible: boolean;
  position?: "top" | "bottom" | "left" | "right";
  accentColor?: string;
}

export default function DemoTooltip({
  title,
  description,
  highlight,
  visible,
  position = "bottom",
  accentColor = "text-green-400",
}: DemoTooltipProps) {
  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`absolute ${positionClasses[position]} left-1/2 -translate-x-1/2 z-50 w-72`}
          initial={{ opacity: 0, y: position === "bottom" ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === "bottom" ? -10 : 10 }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1], // The ROI Flow
          }}
        >
          {/* Solid card - high contrast */}
          <div className="relative bg-slate-900 border-2 border-green-400/30 rounded-xl p-4 shadow-2xl">
            {/* Arrow pointer */}
            <div
              className={`absolute ${
                position === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-slate-900"
                  : position === "top"
                    ? "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-900"
                    : ""
              }`}
            />

            {/* Content */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-base">{title}</h4>
              <p className="text-sm text-gray-100 leading-relaxed">
                {description}
              </p>

              {/* Highlight */}
              <div className={`flex items-start gap-2 pt-3 border-t-2 border-green-400/30`}>
                <Sparkles className={`w-4 h-4 text-green-400 mt-0.5 flex-shrink-0`} />
                <p className={`text-sm text-green-400 font-semibold`}>
                  {highlight}
                </p>
              </div>
            </div>

            {/* Glow effect */}
            <div
              className={`absolute -inset-[1px] bg-gradient-to-r from-green-500/20 to-green-400/20 rounded-xl blur-lg -z-10 opacity-75`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
