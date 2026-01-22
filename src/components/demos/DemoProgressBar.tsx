"use client";

import { motion } from "framer-motion";

interface DemoProgressBarProps {
  current: number;
  total: number;
  progress: number; // 0-100
  accentColor?: string;
}

export default function DemoProgressBar({
  current,
  total,
  progress,
  accentColor = "bg-green-400",
}: DemoProgressBarProps) {
  return (
    <div className="w-full">
      {/* Progress text */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="text-muted-foreground">
          Etapa {current} de {total}
        </span>
        <span className="text-muted-foreground">{Math.round(progress)}%</span>
      </div>

      {/* Progress bar track */}
      <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
        {/* Progress fill */}
        <motion.div
          className={`absolute top-0 left-0 h-full ${accentColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1], // The ROI Flow
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute top-0 left-0 h-full w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["-100%", "400%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
