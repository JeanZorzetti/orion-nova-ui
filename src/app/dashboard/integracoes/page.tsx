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
import { Badge } from "@/components/ui/badge";
import { Plug, ArrowRight, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  available: boolean;
}

export default function IntegracoesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // ponytail: nenhuma integração está implementada — a tela é informativa até
  // a primeira existir. Selecionar/persistir volta junto com a implementação.
  const integrations: Integration[] = [
    {
      id: "mercadopago",
      name: "Mercado Pago",
      description: "Receba pagamentos online",
      icon: "💳",
      category: "Pagamentos",
      available: false,
    },
    {
      id: "maps",
      name: "Google Maps",
      description: "Rotas de entrega e logística",
      icon: "🗺️",
      category: "Logística",
      available: false,
    },
    {
      id: "analytics",
      name: "Google Analytics",
      description: "Análise de dados e métricas",
      icon: "📊",
      category: "Analytics",
      available: false,
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing",
      icon: "📧",
      category: "Marketing",
      available: false,
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automações com 5000+ apps",
      icon: "⚡",
      category: "Automação",
      available: false,
    },
  ];

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: "integrations",
          action: "skip",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao concluir etapa");
      }

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível concluir a etapa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const categories = Array.from(
    new Set(integrations.map((i) => i.category))
  );

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plug className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Integrações</h1>
            <p className="text-muted-foreground">
              Conexões com outras ferramentas — em desenvolvimento
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm">
            🚧 Nenhuma destas integrações está disponível ainda. Esta é a lista
            do que está no roteiro — avisaremos assim que a primeira sair. Para
            trazer dados de outro ERP agora, use a{" "}
            <a href="/dashboard/migracao" className="underline font-medium">
              migração de dados
            </a>
            , que já funciona.
          </p>
        </CardContent>
      </Card>

      {/* Integrations by Category */}
      <div>
        <div className="space-y-6 mb-8">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-4">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations
                  .filter((i) => i.category === category)
                  .map((integration) => (
                    <Card key={integration.id} className="opacity-70">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{integration.icon}</span>
                          <div>
                            <CardTitle className="text-base">
                              {integration.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {integration.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary" className="text-xs">
                          Em Breve
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Não encontrou o que procura?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Estamos sempre adicionando novas integrações. Sugerir uma
              integração ou conecte através da nossa API REST.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open("mailto:contato@orion-erp.com", "_blank")
                }
              >
                Sugerir Integração
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open("https://docs.orion-erp.com/api", "_blank")
                }
              >
                Ver Documentação API
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="button" onClick={handleContinue} disabled={isLoading}>
            {isLoading ? "Aguarde..." : "Voltar ao Dashboard"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
