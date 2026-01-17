"use client";

import { AlertCircle, Crown, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionBannerProps {
  status: "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  daysRemaining: number | null;
  message: string;
}

export function SubscriptionBanner({ status, daysRemaining, message }: SubscriptionBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Não mostrar banner se estiver ativo (não é trial)
  if (status === "ACTIVE") {
    return null;
  }

  // Não mostrar se foi fechado
  if (!isVisible) {
    return null;
  }

  // Só mostrar se trial está próximo do fim ou expirado
  const shouldShow =
    status === "EXPIRED" ||
    status === "CANCELLED" ||
    (status === "TRIAL" && daysRemaining !== null && daysRemaining <= 7);

  if (!shouldShow) {
    return null;
  }

  const isExpired = status === "EXPIRED" || status === "CANCELLED" || (daysRemaining !== null && daysRemaining <= 0);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert
        variant={isExpired ? "destructive" : "default"}
        className="rounded-none border-x-0 border-t-0"
      >
        <div className="container flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isExpired ? (
              <AlertCircle className="h-5 w-5" />
            ) : (
              <Crown className="h-5 w-5" />
            )}
            <AlertDescription className="text-sm font-medium">
              {message}
            </AlertDescription>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" asChild variant={isExpired ? "secondary" : "default"}>
              <Link href="/precos">
                {isExpired ? "Fazer Upgrade Agora" : "Ver Planos"}
              </Link>
            </Button>
            {!isExpired && (
              <button
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fechar banner"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}
