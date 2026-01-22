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
          {/* Glass card */}
          <div className="relative bg-pure-black/98 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl">
            {/* Arrow pointer */}
            <div
              className={`absolute ${
                position === "bottom"
                  ? "bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-pure-black/98"
                  : position === "top"
                    ? "top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-pure-black/98"
                    : ""
              }`}
            />

            {/* Content */}
            <div className="space-y-2">
              <h4 className="font-semibold text-pure-white">{title}</h4>
              <p className="text-sm text-gray-200 leading-relaxed">
                {description}
              </p>

              {/* Highlight */}
              <div className={`flex items-start gap-2 pt-2 border-t border-white/20`}>
                <Sparkles className={`w-4 h-4 text-green-300 mt-0.5 flex-shrink-0`} />
                <p className={`text-sm text-green-300 font-medium`}>
                  {highlight}
                </p>
              </div>
            </div>

            {/* Glow effect */}
            <div
              className={`absolute -inset-0.5 bg-gradient-to-r from-green-500/15 to-green-600/15 rounded-xl blur-xl -z-10`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
