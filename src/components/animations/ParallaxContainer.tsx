"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

interface ParallaxContainerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxContainer({
  children,
  speed = 0.5,
  className = "",
}: ParallaxContainerProps) {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50 * speed]);

  // Disable parallax on mobile for performance
  if (isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
