"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useRef } from "react";

interface AnimatedIconProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedIcon({
  children,
  delay = 0,
  className = "",
}: AnimatedIconProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0, rotate: -180 }}
      animate={
        isInView
          ? { scale: 1, rotate: 0 }
          : { scale: 0, rotate: -180 }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
