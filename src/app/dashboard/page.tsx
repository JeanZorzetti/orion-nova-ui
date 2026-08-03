"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import OnboardingChecklist from "@/components/onboarding/OnboardingChecklist";
import {
  Clock,
  Sparkles,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  AlertCircle,
  Crown,
} from "lucide-react";
import Link from "next/link";

interface TrialStatus {
  status: "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  daysRemaining: number;
  trialEndsAt: string;
}

interface OnboardingData {
  currentStep: string;
  completedSteps: string[];
  isCompleted: boolean;
}

interface DashboardStats {
  customers: number;
  products: number;
  sales: number;
  revenue: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      // Fetch trial status
      const trialRes = await fetch("/api/user/trial-status");
      if (trialRes.ok) {
        const trialData = await trialRes.json();
        setTrialStatus(trialData);
      }

      // Fetch onboarding progress
      const onboardingRes = await fetch("/api/user/onboarding");
      if (onboardingRes.ok) {
        const onboardingData = await onboardingRes.json();
        setOnboarding(onboardingData);
      }

      // Fetch dashboard stats
      const statsRes = await fetch("/api/dashboard/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {session?.user?.name || "Usuário"}!
          </h1>
          <p className="text-muted-foreground">
            Aqui está um resumo da sua conta e atividades
          </p>
        </div>

        {/* Trial Alert */}
        {trialStatus && trialStatus.status === "TRIAL" && (
          <Alert className="mb-6 border-primary/50 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Trial Ativo - {trialStatus.daysRemaining} dias restantes
            </AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                Seu trial expira em{" "}
                {new Date(trialStatus.trialEndsAt).toLocaleDateString("pt-BR")}.
                Aproveite todos os recursos gratuitamente até lá!
              </span>
              <Link href="/precos">
                <Button size="sm" variant="default" className="ml-4">
                  <Crown className="mr-2 h-4 w-4" />
                  Ver Planos
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Expired Alert */}
        {trialStatus && trialStatus.status === "EXPIRED" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Trial Expirado</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                Seu trial expirou. Assine um plano para continuar usando o Orion ERP.
              </span>
              <Link href="/precos">
                <Button size="sm" variant="default" className="ml-4">
                  Assinar Agora
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Stats and Onboarding */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Clientes</p>
                      <p className="text-2xl font-bold">{stats?.customers || 0}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Produtos</p>
                      <p className="text-2xl font-bold">{stats?.products || 0}</p>
                    </div>
                    <Package className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Vendas</p>
                      <p className="text-2xl font-bold">{stats?.sales || 0}</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Faturamento</p>
                      <p className="text-2xl font-bold">
                        {formatPrice(stats?.revenue || 0)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesse as funcionalidades principais</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/dashboard/vendas/nova">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <ShoppingCart className="h-6 w-6" />
                    <span className="text-xs">Nova Venda</span>
                  </Button>
                </Link>
                <Link href="/dashboard/produtos/novo">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Package className="h-6 w-6" />
                    <span className="text-xs">Novo Produto</span>
                  </Button>
                </Link>
                <Link href="/dashboard/clientes/novo">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span className="text-xs">Novo Cliente</span>
                  </Button>
                </Link>
                <Link href="/dashboard/relatorios">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-xs">Relatórios</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Onboarding */}
          <div className="space-y-6">
            {onboarding && !onboarding.isCompleted && (
              <OnboardingChecklist
                currentStep={onboarding.currentStep}
                completedSteps={onboarding.completedSteps}
              />
            )}

            {/* Migration CTA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Migrar Dados
                </CardTitle>
                <CardDescription>
                  Já usa outro ERP? Migre seus dados facilmente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/migracao">
                  <Button className="w-full">Iniciar Migração</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle>Precisa de Ajuda?</CardTitle>
                <CardDescription>
                  Nossa equipe está pronta para ajudar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/ajuda">
                  <Button variant="outline" className="w-full">
                    Central de Ajuda
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button variant="outline" className="w-full">
                    Falar com Suporte
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
