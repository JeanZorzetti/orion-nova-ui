"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, ArrowLeft, Star } from "lucide-react";
import { PLANS, PlanId } from "@/lib/mercadopago";

export default function PrecosPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: PlanId) => {
    setLoadingPlan(planId);

    try {
      const response = await fetch("/api/mercadopago/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao iniciar checkout");
        setLoadingPlan(null);
        return;
      }

      // Redirecionar para o checkout do Mercado Pago
      // Em produção, use initPoint. Em desenvolvimento/sandbox, use sandboxInitPoint
      const checkoutUrl = data.sandboxInitPoint || data.initPoint;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar. Tente novamente.");
      setLoadingPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comece gratuitamente e escale conforme sua empresa cresce. Todos os
            planos incluem suporte e atualizações.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {(Object.entries(PLANS) as [PlanId, (typeof PLANS)[PlanId]][]).map(
            ([id, plan]) => (
              <Card
                key={id}
                className={`relative flex flex-col ${
                  "popular" in plan && plan.popular
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : "border-border/50"
                }`}
              >
                {"popular" in plan && plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={
                      "popular" in plan && plan.popular ? "default" : "outline"
                    }
                    onClick={() => handleSubscribe(id)}
                    disabled={loadingPlan !== null}
                  >
                    {loadingPlan === id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Assinar agora"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Pagamento seguro via Mercado Pago. Cancele quando quiser.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Cartão de crédito</span>
            <span>•</span>
            <span>PIX</span>
            <span>•</span>
            <span>Boleto</span>
          </div>
        </div>
      </div>
    </div>
  );
}
