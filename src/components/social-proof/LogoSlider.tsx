"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Logo {
  name: string;
  src: string;
  width?: number;
  height?: number;
}

interface LogoSliderProps {
  logos: Logo[];
  speed?: number;
}

export default function LogoSlider({
  logos,
  speed = 30,
}: LogoSliderProps) {
  // Duplicate logos for infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="overflow-hidden relative w-full">
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Sliding logos */}
      <motion.div
        className="flex gap-12 items-center"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
          >
            <Image
              src={logo.src}
              alt={logo.name}
              width={logo.width || 120}
              height={logo.height || 40}
              className="h-10 w-auto object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
