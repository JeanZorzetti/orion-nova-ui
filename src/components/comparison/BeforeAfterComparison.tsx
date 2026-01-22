"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import Image from "next/image";

interface ComparisonStat {
  metric: string;
  before: string;
  after: string;
  improvement: string;
}

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  stats?: ComparisonStat[];
}

export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeLabel = "Antes",
  afterLabel = "Depois",
  stats = [],
}: BeforeAfterComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const hasAutoSlid = useRef(false);

  // Auto-slide animation when component comes into view
  useEffect(() => {
    if (isInView && !hasAutoSlid.current) {
      hasAutoSlid.current = true;

      // Slide from 50 to 25, then to 75, then back to 50
      const timeline = [
        { position: 25, delay: 500 },
        { position: 75, delay: 1000 },
        { position: 50, delay: 1000 },
      ];

      let currentStep = 0;
      const animate = () => {
        if (currentStep < timeline.length) {
          setTimeout(() => {
            setSliderPosition(timeline[currentStep].position);
            currentStep++;
            animate();
          }, timeline[currentStep - 1]?.delay || 0);
        }
      };

      setTimeout(() => animate(), 300);
    }
  }, [isInView]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const bounded = Math.max(0, Math.min(100, percentage));

    setSliderPosition(bounded);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {/* Comparison Container */}
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-border shadow-2xl select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <div className="absolute inset-0">
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-cover"
            priority
          />

          {/* After Label */}
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg z-10">
            {afterLabel}
          </div>
        </div>

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
            priority
          />

          {/* Before Label */}
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg z-10">
            {beforeLabel}
          </div>
        </div>

        {/* Slider Line & Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing">
            <MoveHorizontal className="w-6 h-6 text-primary" />
          </div>

          {/* Top Arrow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />

          {/* Bottom Arrow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </div>

        {/* Instruction overlay (only on first view) */}
        {!isDragging && sliderPosition === 50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/95 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
              <MoveHorizontal className="w-5 h-5 text-primary" />
              <p className="text-sm font-semibold">Arraste para comparar →</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Stats Comparison */}
      {stats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <p className="text-sm text-muted-foreground mb-2">{stat.metric}</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-orange-600 font-medium">Antes: {stat.before}</span>
                <span className="text-xs text-green-600 font-medium">Depois: {stat.after}</span>
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-green-600">{stat.improvement}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
