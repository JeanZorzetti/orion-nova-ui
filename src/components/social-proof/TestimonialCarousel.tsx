"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  metric?: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlayInterval?: number;
}

export default function TestimonialCarousel({
  testimonials,
  autoPlayInterval = 8000,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, autoPlayInterval, testimonials.length]);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main testimonial card */}
      <div className="relative bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl border border-border p-8 md:p-12 min-h-[320px] flex items-center">
        {/* Quote icon */}
        <div className="absolute top-6 left-6 opacity-10">
          <Quote className="w-16 h-16 text-primary" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 w-full"
          >
            {/* Quote */}
            <blockquote className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
              "{currentTestimonial.quote}"
            </blockquote>

            {/* Author info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                {currentTestimonial.avatar ? (
                  <Image
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.author}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                ) : (
                  currentTestimonial.author.charAt(0)
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  {currentTestimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentTestimonial.role} • {currentTestimonial.company}
                </p>
              </div>

              {/* Metric badge */}
              {currentTestimonial.metric && (
                <div className="hidden md:block bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                  <p className="text-green-600 font-semibold text-sm">
                    {currentTestimonial.metric}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-card border border-border hover:bg-primary hover:text-white transition-colors flex items-center justify-center shadow-lg"
        aria-label="Depoimento anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-card border border-border hover:bg-primary hover:text-white transition-colors flex items-center justify-center shadow-lg"
        aria-label="Próximo depoimento"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots navigation */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "bg-border hover:bg-primary/50"
            }`}
            aria-label={`Ir para depoimento ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
