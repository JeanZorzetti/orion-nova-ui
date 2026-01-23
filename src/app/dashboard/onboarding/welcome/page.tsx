"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, ArrowRight, CheckCircle2, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const completeStep = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: "welcome", action: "complete" }),
      });

      if (!response.ok) {
        throw new Error("Erro ao completar etapa");
      }

      toast({
        title: "Etapa concluída!",
        description: "Você completou a etapa de boas-vindas.",
      });

      // Redirecionar para próxima etapa
      router.push("/dashboard/configuracoes/empresa");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível completar a etapa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Bem-vindo ao Orion ERP! 🎉
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Estamos felizes em ter você aqui. Vamos configurar sua conta em
          poucos minutos para você começar a gerenciar seu negócio de forma
          profissional.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Rápido e Fácil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure sua empresa, produtos e clientes em menos de 10
              minutos. Nossa interface intuitiva torna tudo simples.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Tudo Integrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Vendas, estoque, financeiro e fiscal em um só lugar. Tenha o
              controle total do seu negócio.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Steps Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>O que vamos fazer</CardTitle>
          <CardDescription>
            Estas são as etapas que vamos percorrer juntos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Configurar sua empresa",
                description: "Nome, endereço e informações básicas",
              },
              {
                step: "2",
                title: "Dados fiscais",
                description: "CNPJ, regime tributário e informações fiscais",
              },
              {
                step: "3",
                title: "Primeiro produto",
                description: "Cadastre um produto ou serviço que você vende",
              },
              {
                step: "4",
                title: "Primeiro cliente",
                description: "Adicione um cliente à sua base",
              },
              {
                step: "5",
                title: "Primeira venda",
                description: "Crie sua primeira venda ou orçamento",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trial Info */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm font-medium mb-2">
              🎁 Você tem 30 dias de trial gratuito
            </p>
            <p className="text-sm text-muted-foreground">
              Explore todas as funcionalidades sem limitações. Não é necessário
              cartão de crédito para começar.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={completeStep}
          disabled={isLoading}
          className="min-w-[200px]"
        >
          {isLoading ? "Carregando..." : "Começar Configuração"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Pular por Enquanto
        </Button>
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        Dúvidas? Acesse nossa{" "}
        <a href="/ajuda" className="text-primary hover:underline">
          central de ajuda
        </a>{" "}
        ou entre em contato com nosso suporte.
      </p>
    </div>
  );
}
