"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Settings } from "lucide-react";

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  // O Customer Portal da Stripe cobre cancelamento, troca de cartão e faturas.
  // Não replicamos nada disso aqui — cancelar só no nosso banco deixava a
  // cobrança viva na operadora.
  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = await response.json();

      if (!response.ok || !data.url) {
        alert(data.error || "Erro ao abrir o portal de cobrança");
        setIsLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao abrir o portal de cobrança. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="flex-1" onClick={handleClick} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Abrindo...
        </>
      ) : (
        <>
          <Settings className="mr-2 h-4 w-4" />
          Gerenciar assinatura
        </>
      )}
    </Button>
  );
}
