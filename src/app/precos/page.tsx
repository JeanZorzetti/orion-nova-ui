"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Loader2, ArrowLeft, Star, Sparkles, AlertTriangle, Clock } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import { PricingComparison } from "@/components/pricing";
import { ROICalculator } from "@/components/roi";
import { EarlyAdopterBanner } from "@/components/campaigns";
import { trackPlanView, trackPlanSelected, trackCheckoutStarted } from "@/lib/analytics";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  features: any;
  popular?: boolean;
}

function PrecosPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrialExpiredAlert, setShowTrialExpiredAlert] = useState(false);
  // Middleware manda para cá quando a checagem de trial falha (banco fora).
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(false);

  // Verificar se foi redirecionado por trial expirado
  useEffect(() => {
    const trialParam = searchParams.get("trial");
    if (trialParam === "expired") {
      setShowTrialExpiredAlert(true);
    }
    setShowUnavailableAlert(searchParams.get("erro") === "indisponivel");
  }, [searchParams]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/plans");
        const data = await response.json();

        if (response.ok) {
          // Marcar o plano Professional como popular
          const plansWithPopular = data.plans.map((p: Plan) => ({
            ...p,
            popular: p.slug === "professional",
          }));
          setPlans(plansWithPopular);

          // Track plan views
          plansWithPopular.forEach((p: Plan) => trackPlanView(p.slug));
        }
      } catch (error) {
        console.error("Erro ao carregar planos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId: string) => {
    setLoadingPlan(planId);

    try {
      // Find plan for tracking
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        trackPlanSelected(plan.slug, Number(plan.price));
        trackCheckoutStarted(plan.slug, Number(plan.price));
      }

      // Redirecionar para a página de checkout
      router.push(`/checkout?planId=${planId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Early Adopter Banner */}
      <EarlyAdopterBanner currentCustomers={127} maxCustomers={500} />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* ponytail: destino pela sessão, não router.back() — quem chega por link
              de notificação/e-mail não tem histórico */}
          <Link href={status === "authenticated" ? "/dashboard" : "/"}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        {/* Trial Expired Alert */}
        {showTrialExpiredAlert && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Seu Trial Expirou
            </AlertTitle>
            <AlertDescription>
              Seu período de teste de 30 dias chegou ao fim. Escolha um plano abaixo para continuar usando o Orion ERP sem interrupções.
            </AlertDescription>
          </Alert>
        )}

        {showUnavailableAlert && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Não conseguimos verificar sua conta</AlertTitle>
            <AlertDescription>
              O sistema está temporariamente indisponível. Tente novamente em
              alguns minutos — se persistir, fale com o suporte.
            </AlertDescription>
          </Alert>
        )}

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
          {isLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            plans.map((plan) => {
              const features = plan.features;
              const featuresList = Array.isArray(features)
                ? features
                : features?.modules || [];

              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${
                    plan.popular
                      ? "border-primary shadow-lg shadow-primary/20 scale-105"
                      : "border-border/50"
                  }`}
                >
                  {plan.popular && (
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
                      {features.users && (
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">
                            {features.users === -1
                              ? "Usuários ilimitados"
                              : `${features.users} usuário${
                                  features.users > 1 ? "s" : ""
                                }`}
                          </span>
                        </li>
                      )}
                      {features.storage && (
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">
                            {features.storage} GB de armazenamento
                          </span>
                        </li>
                      )}
                      {features.modules &&
                        features.modules.map((module: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{module}</span>
                          </li>
                        ))}
                      {features.support && (
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">Suporte: {features.support}</span>
                        </li>
                      )}
                      {features.integrations && (
                        <li className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">
                            {features.integrations === -1
                              ? "Integrações ilimitadas"
                              : `${features.integrations} integrações`}
                          </span>
                        </li>
                      )}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      size="lg"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={loadingPlan !== null}
                    >
                      {loadingPlan === plan.id ? (
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
              );
            })
          )}
        </div>

        {/* ROI Calculator */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Calculadora de ROI
            </Badge>
            <h2 className="text-3xl font-bold mb-2">
              Quanto Você Pode Economizar?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra o retorno do investimento do Orion ERP para sua empresa
            </p>
          </div>
          <ROICalculator />
        </div>

        {/* Comparison Table */}
        <div className="mt-16">
          <PricingComparison />
        </div>

        {/* Value Proposition */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">IA Nativa</h3>
            <p className="text-sm text-muted-foreground">
              Único ERP brasileiro com inteligência artificial real em todos os planos
            </p>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Preço Justo</h3>
            <p className="text-sm text-muted-foreground">
              25% mais barato que Omie, 60% mais barato que SAP/TOTVS
            </p>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">30 Dias Grátis</h3>
            <p className="text-sm text-muted-foreground">
              Teste sem compromisso. Sem cartão de crédito no Starter
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            Pagamento seguro via Stripe. Cancele quando quiser.
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
    </div>
  );
}

export default function PrecosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando planos...</p>
        </div>
      </div>
    }>
      <PrecosPageContent />
    </Suspense>
  );
}
