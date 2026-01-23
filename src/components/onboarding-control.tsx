"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Building2,
  FileText,
  Package,
  Users,
  ShoppingCart,
  Database,
  Plug,
  RefreshCw,
} from "lucide-react";

export function OnboardingControl() {
  const router = useRouter();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  const onboardingSteps = [
    {
      id: "welcome",
      title: "Boas-vindas",
      icon: <Sparkles className="h-4 w-4" />,
      link: "/dashboard/onboarding/welcome",
    },
    {
      id: "company_setup",
      title: "Configurar Empresa",
      icon: <Building2 className="h-4 w-4" />,
      link: "/dashboard/configuracoes/empresa",
    },
    {
      id: "fiscal_setup",
      title: "Dados Fiscais",
      icon: <FileText className="h-4 w-4" />,
      link: "/dashboard/configuracoes/fiscal",
    },
    {
      id: "first_product",
      title: "Primeiro Produto",
      icon: <Package className="h-4 w-4" />,
      link: "/dashboard/produtos/novo",
    },
    {
      id: "first_customer",
      title: "Primeiro Cliente",
      icon: <Users className="h-4 w-4" />,
      link: "/dashboard/clientes/novo",
    },
    {
      id: "first_sale",
      title: "Primeira Venda",
      icon: <ShoppingCart className="h-4 w-4" />,
      link: "/dashboard/vendas/novo",
    },
    {
      id: "migration",
      title: "Migrar Dados",
      icon: <Database className="h-4 w-4" />,
      link: "/dashboard/migracao",
      optional: true,
    },
    {
      id: "integrations",
      title: "Integrações",
      icon: <Plug className="h-4 w-4" />,
      link: "/dashboard/integracoes",
      optional: true,
    },
  ];

  const handleResetOnboarding = async () => {
    setIsResetting(true);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: "reset",
          action: "reset",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao reiniciar onboarding");
      }

      toast({
        title: "Onboarding reiniciado!",
        description: "Você será redirecionado para o início do tutorial.",
      });

      // Redirecionar após breve delay para mostrar o toast
      setTimeout(() => {
        router.push("/dashboard/onboarding/welcome");
        router.refresh();
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível reiniciar o onboarding.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Tutorial e Primeiros Passos</h2>
          <p className="text-sm text-muted-foreground">
            Refaça o onboarding ou acesse etapas específicas
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 mb-2">
            <strong>Refazer Onboarding</strong>
          </p>
          <p className="text-xs text-blue-700 mb-3">
            Inicie o tutorial novamente para relembrar as funcionalidades principais
            do sistema. Seus dados (produtos, clientes, vendas) não serão afetados.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                disabled={isResetting}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refazer Onboarding
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Refazer Tutorial?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    Você será redirecionado para o início do tutorial de primeiros
                    passos.
                  </p>
                  <p className="font-medium text-foreground">
                    ⚠️ Importante: Seus dados não serão excluídos. Apenas o
                    progresso do tutorial será reiniciado.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetOnboarding}
                  disabled={isResetting}
                >
                  {isResetting ? "Reiniciando..." : "Sim, Refazer Tutorial"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-3">Acesso Rápido às Etapas</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique para acessar diretamente qualquer etapa do onboarding
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {onboardingSteps.map((step) => (
              <Button
                key={step.id}
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => router.push(step.link)}
              >
                <span className="mr-2">{step.icon}</span>
                {step.title}
                {step.optional && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Opcional
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
