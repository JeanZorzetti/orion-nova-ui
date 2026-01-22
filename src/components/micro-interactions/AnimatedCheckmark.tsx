"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface AnimatedCheckmarkProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedCheckmark({
  children,
  delay = 0,
  className = "",
}: AnimatedCheckmarkProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={
        isInView
          ? { opacity: 1, x: 0 }
          : { opacity: 0, x: -20 }
      }
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // The ROI Flow easing
      }}
    >
      {children}
    </motion.div>
  );
}
