"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Zap, Clock, Users } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface EarlyAdopterBannerProps {
  maxCustomers?: number;
  currentCustomers?: number;
}

export default function EarlyAdopterBanner({
  maxCustomers = 500,
  currentCustomers = 127,
}: EarlyAdopterBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem("earlyAdopterDismissed");
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("earlyAdopterDismissed", "true");
  };

  const spotsLeft = maxCustomers - currentCustomers;
  const percentageFilled = (currentCustomers / maxCustomers) * 100;

  if (!mounted || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-green-600 to-primary shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
            {/* Content */}
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-full flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white text-primary hover:bg-white/90">
                    Early Adopter
                  </Badge>
                  <span className="text-white/90 text-xs hidden sm:inline">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Oferta limitada
                  </span>
                </div>
                <p className="text-white font-semibold text-sm md:text-base">
                  Seja um dos primeiros {maxCustomers} clientes e garanta{" "}
                  <span className="underline">preço vitalício</span> com 25% de desconto permanente
                </p>
              </div>
            </div>

            {/* Stats & CTA */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 text-white">
                <Users className="w-4 h-4" />
                <div className="text-right">
                  <p className="text-xs opacity-90">Restam apenas</p>
                  <p className="font-bold text-lg leading-none">{spotsLeft}</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 font-semibold whitespace-nowrap"
                asChild
              >
                <Link href="/precos">
                  Garantir Desconto
                </Link>
              </Button>

              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 bg-white/20 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-white h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentageFilled}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
