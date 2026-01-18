"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showRating?: boolean;
  className?: string;
  variant?: "default" | "card" | "minimal";
}

export function TestimonialsCarousel({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  showRating = true,
  className,
  variant = "default",
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const previous = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(next, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, next]);

  if (testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  if (variant === "minimal") {
    return (
      <div
        className={cn("relative", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-center max-w-3xl mx-auto">
          <Quote className="w-10 h-10 text-primary/20 mx-auto mb-4" />
          <blockquote className="text-xl md:text-2xl font-medium mb-6 italic">
            "{current.quote}"
          </blockquote>
          <div>
            <div className="font-semibold">{current.author}</div>
            <div className="text-sm text-muted-foreground">
              {current.role}
              {current.company && ` • ${current.company}`}
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn("relative", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
          {showRating && current.rating && (
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-5 h-5",
                    i < current.rating!
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          )}

          <Quote className="w-12 h-12 text-primary/10 mb-4" />

          <blockquote className="text-lg md:text-xl mb-6">
            "{current.quote}"
          </blockquote>

          <div className="flex items-center gap-4">
            {current.avatar ? (
              <img
                src={current.avatar}
                alt={current.author}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {current.author.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <div className="font-semibold">{current.author}</div>
              <div className="text-sm text-muted-foreground">
                {current.role}
                {current.company && ` • ${current.company}`}
              </div>
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <>
            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={previous}
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 px-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      index === currentIndex
                        ? "bg-primary w-6"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Ir para depoimento ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={next}
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Counter */}
            <div className="text-center mt-2 text-sm text-muted-foreground">
              {currentIndex + 1} de {testimonials.length}
            </div>
          </>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 rounded-2xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {current.avatar ? (
              <img
                src={current.avatar}
                alt={current.author}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {current.author.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            {showRating && current.rating && (
              <div className="flex gap-1 mb-3 justify-center md:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < current.rating!
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            )}

            <blockquote className="text-lg md:text-xl mb-4">
              "{current.quote}"
            </blockquote>

            <div>
              <div className="font-semibold text-lg">{current.author}</div>
              <div className="text-muted-foreground">
                {current.role}
                {current.company && (
                  <>
                    {" • "}
                    <Badge variant="secondary">{current.company}</Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={previous}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={next}
              className="gap-2"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Skeleton loader for testimonials carousel
export function TestimonialsCarouselSkeleton({
  variant = "default",
  className,
}: {
  variant?: "default" | "card" | "minimal";
  className?: string;
}) {
  if (variant === "minimal") {
    return (
      <div className={cn("text-center max-w-3xl mx-auto", className)}>
        <div className="w-10 h-10 bg-muted rounded mx-auto mb-4 animate-pulse" />
        <div className="space-y-3 mb-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-8 bg-muted rounded animate-pulse w-3/4 mx-auto" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-32 mx-auto animate-pulse" />
          <div className="h-4 bg-muted rounded w-48 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("bg-card border border-border rounded-2xl p-8 md:p-12", className)}>
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-5 h-5 bg-muted rounded animate-pulse" />
          ))}
        </div>
        <div className="w-12 h-12 bg-muted rounded mb-4 animate-pulse" />
        <div className="space-y-3 mb-6">
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-6 bg-muted rounded animate-pulse w-5/6" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            <div className="h-4 bg-muted rounded w-48 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 rounded-2xl p-8 md:p-12", className)}>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-24 h-24 bg-muted rounded-full animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-muted rounded animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded animate-pulse w-4/5" />
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            <div className="h-4 bg-muted rounded w-48 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
