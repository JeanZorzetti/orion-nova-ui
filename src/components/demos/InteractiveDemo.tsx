"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DemoConfig, DemoState } from "@/types/demo";
import DemoHotspot from "./DemoHotspot";
import DemoProgressBar from "./DemoProgressBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InteractiveDemoProps {
  config: DemoConfig;
}

export default function InteractiveDemo({ config }: InteractiveDemoProps) {
  const [state, setState] = useState<DemoState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const step = config.steps[currentStep];
  const isLastStep = currentStep === config.steps.length - 1;

  // Auto-play logic
  useEffect(() => {
    if (state !== "playing" || !config.autoPlay) return;

    const duration = step.duration;
    const intervalMs = 50; // Update progress every 50ms
    const incrementPerInterval = (100 / duration) * intervalMs;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + incrementPerInterval;
        if (next >= 100) {
          // Move to next step
          if (isLastStep) {
            setState("completed");
            config.onComplete?.();
          } else {
            setCurrentStep((c) => c + 1);
            config.onStepChange?.(currentStep + 1);
          }
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [state, currentStep, step.duration, isLastStep, config, config.autoPlay]);

  const handlePlay = useCallback(() => {
    setState("playing");
    setProgress(0);

    // Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "demo_started", {
        event_category: "engagement",
        event_label: "interactive_demo",
        page_location: "/produto",
      });
    }
  }, []);

  const handleSkip = useCallback(() => {
    setState("completed");
    config.onSkip?.();

    // Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "demo_skipped", {
        event_category: "engagement",
        step_skipped_at: currentStep + 1,
      });
    }
  }, [currentStep, config]);

  const handleRestart = useCallback(() => {
    setState("idle");
    setCurrentStep(0);
    setProgress(0);
  }, []);

  const handleHotspotClick = useCallback(
    (hotspotId: string) => {
      // Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "demo_hotspot_clicked", {
          event_category: "engagement",
          event_label: step.id,
          step_number: currentStep + 1,
        });
      }
    },
    [step.id, currentStep]
  );

  return (
    <div className="relative w-full aspect-video bg-charcoal rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Screenshot background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={step.screenshot}
            alt={step.title}
            fill
            className="object-cover"
            priority={currentStep === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay for idle state */}
      {state === "idle" && (
        <motion.div
          className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm flex flex-col items-center justify-center z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Badge variant="secondary" className="mb-4">
            Demo interativa • 12 segundos
          </Badge>
          <Button size="lg" onClick={handlePlay} className="gap-2">
            <Play className="w-5 h-5" />
            Iniciar Tour
          </Button>
        </motion.div>
      )}

      {/* Hotspots (only visible when playing) */}
      {state === "playing" &&
        step.hotspots.map((hotspot) => (
          <DemoHotspot
            key={hotspot.id}
            {...hotspot}
            title={step.title}
            description={step.description}
            highlight={step.highlight}
            onClick={() => handleHotspotClick(hotspot.id)}
            accentColor={config.accentColor}
          />
        ))}

      {/* Progress bar (top) */}
      {state === "playing" && (
        <motion.div
          className="absolute top-0 left-0 right-0 p-4 z-50 bg-gradient-to-b from-charcoal/80 to-transparent backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DemoProgressBar
            current={currentStep + 1}
            total={config.steps.length}
            progress={((currentStep + progress / 100) / config.steps.length) * 100}
            accentColor={config.accentColor.replace("text-", "bg-")}
          />
        </motion.div>
      )}

      {/* Skip button (top right) */}
      {state === "playing" && (
        <motion.button
          className="absolute top-4 right-4 z-50 p-2 rounded-lg bg-charcoal/80 backdrop-blur-sm border border-white/20 text-pure-white hover:bg-charcoal transition-colors"
          onClick={handleSkip}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      )}

      {/* Completed state overlay */}
      {state === "completed" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-charcoal/95 to-pure-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-40 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center max-w-md space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl font-bold text-pure-white">
                Pronto para transformar sua gestão?
              </h3>
              <p className="text-secondary">
                Comece agora com 30 dias grátis. Sem cartão de crédito, sem compromisso.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href="/cadastro" className="gap-2">
                  Começar teste grátis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contato">Falar com vendas</Link>
              </Button>
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-pure-white transition-colors mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              Assistir novamente
            </button>
          </div>
        </motion.div>
      )}

      {/* Bottom instruction hint (only on first step) */}
      {state === "playing" && currentStep === 0 && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="px-4 py-2 rounded-full bg-charcoal/90 backdrop-blur-sm border border-white/20 text-sm text-pure-white shadow-lg">
            Clique nos pontos destacados para explorar
          </div>
        </motion.div>
      )}
    </div>
  );
}
