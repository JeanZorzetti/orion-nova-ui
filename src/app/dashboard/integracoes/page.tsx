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
import { Plug, Check, ArrowRight, ExternalLink } from "lucide-react";
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
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>(
    []
  );

  const integrations: Integration[] = [
    {
      id: "mercadopago",
      name: "Mercado Pago",
      description: "Receba pagamentos online",
      icon: "💳",
      category: "Pagamentos",
      available: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Envie notificações e mensagens",
      icon: "💬",
      category: "Comunicação",
      available: true,
    },
    {
      id: "maps",
      name: "Google Maps",
      description: "Rotas de entrega e logística",
      icon: "🗺️",
      category: "Logística",
      available: true,
    },
    {
      id: "analytics",
      name: "Google Analytics",
      description: "Análise de dados e métricas",
      icon: "📊",
      category: "Analytics",
      available: true,
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

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Marcar step como completo
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: "integrations",
          action: "complete",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar integrações");
      }

      toast({
        title: "Integrações salvas!",
        description:
          selectedIntegrations.length > 0
            ? `${selectedIntegrations.length} integração(ões) selecionada(s).`
            : "Você pode configurar integrações mais tarde.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as integrações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
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
        throw new Error("Erro ao pular etapa");
      }

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível pular a etapa.",
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
              Etapa Opcional - Conecte-se com outras ferramentas
            </p>
          </div>
        </div>
      </div>

      {/* Info */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm">
            🎯 Selecione as integrações que você deseja configurar. Você pode
            ativá-las ou desativá-las a qualquer momento nas configurações.
          </p>
        </CardContent>
      </Card>

      {/* Integrations by Category */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 mb-8">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-lg font-semibold mb-4">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations
                  .filter((i) => i.category === category)
                  .map((integration) => (
                    <Card
                      key={integration.id}
                      className={`cursor-pointer transition-all ${
                        selectedIntegrations.includes(integration.id)
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      } ${!integration.available ? "opacity-60" : ""}`}
                      onClick={() =>
                        integration.available &&
                        toggleIntegration(integration.id)
                      }
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
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
                          {selectedIntegrations.includes(integration.id) && (
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {integration.available ? (
                          <Badge variant="outline" className="text-xs">
                            Disponível
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Em Breve
                          </Badge>
                        )}
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
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Pular Esta Etapa
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Salvando..."
              : selectedIntegrations.length > 0
              ? `Salvar ${selectedIntegrations.length} Integração(ões)`
              : "Concluir Onboarding"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Help Text */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        ✨ Parabéns! Você está quase concluindo o onboarding
      </p>
    </div>
  );
}
