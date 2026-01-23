"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Building2,
  FileText,
  Package,
  Users,
  ShoppingCart,
  Database,
  Plug,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  link?: string;
  optional?: boolean;
}

interface OnboardingChecklistProps {
  currentStep?: string;
  completedSteps?: string[];
  onStepComplete?: (stepId: string) => void;
}

export default function OnboardingChecklist({
  currentStep = "welcome",
  completedSteps = [],
}: OnboardingChecklistProps) {
  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Boas-vindas",
      description: "Conheça o Orion ERP e suas funcionalidades",
      icon: <Sparkles className="h-5 w-5" />,
      completed: completedSteps.includes("welcome"),
      link: "/dashboard/onboarding/welcome",
    },
    {
      id: "company_setup",
      title: "Configurar Empresa",
      description: "Adicione os dados da sua empresa",
      icon: <Building2 className="h-5 w-5" />,
      completed: completedSteps.includes("company_setup"),
      link: "/dashboard/configuracoes/empresa",
    },
    {
      id: "fiscal_setup",
      title: "Dados Fiscais",
      description: "Configure CNPJ e regime tributário",
      icon: <FileText className="h-5 w-5" />,
      completed: completedSteps.includes("fiscal_setup"),
      link: "/dashboard/configuracoes/fiscal",
    },
    {
      id: "first_product",
      title: "Primeiro Produto",
      description: "Cadastre seu primeiro produto ou serviço",
      icon: <Package className="h-5 w-5" />,
      completed: completedSteps.includes("first_product"),
      link: "/dashboard/produtos/novo",
    },
    {
      id: "first_customer",
      title: "Primeiro Cliente",
      description: "Adicione seu primeiro cliente",
      icon: <Users className="h-5 w-5" />,
      completed: completedSteps.includes("first_customer"),
      link: "/dashboard/clientes/novo",
    },
    {
      id: "first_sale",
      title: "Primeira Venda",
      description: "Crie sua primeira venda ou orçamento",
      icon: <ShoppingCart className="h-5 w-5" />,
      completed: completedSteps.includes("first_sale"),
      link: "/dashboard/vendas/nova",
    },
    {
      id: "migration",
      title: "Migrar Dados",
      description: "Importe dados do seu ERP anterior (opcional)",
      icon: <Database className="h-5 w-5" />,
      completed: completedSteps.includes("migration"),
      link: "/dashboard/migracao",
      optional: true,
    },
    {
      id: "integrations",
      title: "Integrações",
      description: "Conecte-se com outras ferramentas (opcional)",
      icon: <Plug className="h-5 w-5" />,
      completed: completedSteps.includes("integrations"),
      link: "/dashboard/integracoes",
      optional: true,
    },
  ];

  const totalSteps = steps.filter((s) => !s.optional).length;
  const completedCount = steps.filter((s) => !s.optional && s.completed).length;
  const progress = (completedCount / totalSteps) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Primeiros Passos
            </CardTitle>
            <CardDescription>
              Complete as etapas abaixo para começar a usar o Orion ERP
            </CardDescription>
          </div>
          <Badge variant={progress === 100 ? "default" : "secondary"}>
            {completedCount}/{totalSteps}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          {steps.map((step) => {
            const isCurrentStep = step.id === currentStep;
            const isCompleted = step.completed;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                  isCurrentStep
                    ? "border-primary bg-primary/5"
                    : isCompleted
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle
                      className={`h-5 w-5 ${
                        isCurrentStep ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-muted-foreground">{step.icon}</div>
                    <h4
                      className={`text-sm font-medium ${
                        isCompleted ? "text-green-700" : ""
                      }`}
                    >
                      {step.title}
                    </h4>
                    {step.optional && (
                      <Badge variant="outline" className="text-xs">
                        Opcional
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>

                {step.link && !isCompleted && (
                  <Link href={step.link}>
                    <Button
                      size="sm"
                      variant={isCurrentStep ? "default" : "ghost"}
                    >
                      {isCurrentStep ? "Continuar" : "Fazer"}
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {progress === 100 && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-700 mb-1">
              Parabéns! Você concluiu o onboarding
            </p>
            <p className="text-xs text-muted-foreground">
              Agora você está pronto para usar todas as funcionalidades do Orion ERP
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
