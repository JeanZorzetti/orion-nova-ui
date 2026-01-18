"use client";

import { useEffect, useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Shield, CheckCircle2, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const planId = searchParams.get("planId");

  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar informações do plano
  useEffect(() => {
    if (!planId) {
      setError("Plano não especificado");
      setIsLoading(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        const response = await fetch("/api/plans");
        const data = await response.json();

        const selectedPlan = data.plans.find((p: any) => p.id === planId);

        if (!selectedPlan) {
          setError("Plano não encontrado");
          setIsLoading(false);
          return;
        }

        setPlan(selectedPlan);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao buscar plano:", err);
        setError("Erro ao carregar informações do plano");
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/checkout?planId=${planId}`);
    }
  }, [status, planId, router]);

  const handleCheckout = async () => {
    if (!plan) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Criar preferência de pagamento
      const response = await fetch("/api/checkout/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao processar checkout");
        setIsProcessing(false);
        return;
      }

      // Redirecionar para o Mercado Pago
      // Em produção, usar init_point
      // Em desenvolvimento, usar sandbox_init_point
      const checkoutUrl =
        process.env.NODE_ENV === "production"
          ? data.initPoint
          : data.sandboxInitPoint;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError("URL de checkout não disponível");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Erro no checkout:", err);
      setError("Erro ao processar pagamento. Tente novamente.");
      setIsProcessing(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!planId || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-xl">
            <CardContent className="pt-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error || "Plano não especificado"}
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/precos">Ver Planos</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const features = plan.features || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Orion
            </h1>
          </Link>
          <h2 className="text-2xl font-bold mb-2">Finalizar Assinatura</h2>
          <p className="text-muted-foreground">
            Confirme os detalhes e prossiga para o pagamento seguro
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Resumo do Pedido */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
                <CardDescription>
                  Revise as informações antes de continuar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plano Selecionado */}
                <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                    <div className="mt-3 space-y-1">
                      {features.users && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>
                            {features.users === -1
                              ? "Usuários ilimitados"
                              : `${features.users} usuário${
                                  features.users > 1 ? "s" : ""
                                }`}
                          </span>
                        </div>
                      )}
                      {features.storage && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{features.storage} GB de armazenamento</span>
                        </div>
                      )}
                      {features.support && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Suporte: {features.support}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      R$ {Number(plan.price).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">por mês</p>
                  </div>
                </div>

                {/* Informações do Usuário */}
                <div>
                  <h4 className="font-semibold mb-2">Informações da Conta</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nome:</span>
                      <span className="font-medium">{session?.user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{session?.user?.email}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Método de Pagamento */}
            <Card className="border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
                <CardDescription>
                  Pagamento processado pelo Mercado Pago
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Mercado Pago</p>
                    <p className="text-sm text-muted-foreground">
                      Cartão de crédito, débito, boleto ou PIX
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Totais e Ação */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-xl">
              <CardHeader>
                <CardTitle>Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>R$ {Number(plan.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto:</span>
                  <span className="text-green-600">R$ 0,00</span>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">
                    R$ {Number(plan.price).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Renovação automática mensal
                </p>
              </CardContent>
              <CardFooter className="flex-col space-y-3">
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Ir para Pagamento
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/precos">Cancelar</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Garantias */}
            <Card className="border-border/50">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Pagamento Seguro</p>
                    <p className="text-xs text-muted-foreground">
                      Processado pelo Mercado Pago
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">
                      Cancele Quando Quiser
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sem multas ou taxas de cancelamento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
