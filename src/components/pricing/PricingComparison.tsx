"use client";

import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles } from "lucide-react";

interface CompetitorPlan {
  name: string;
  price: string;
  features: {
    users: string;
    ia: boolean;
    bi: boolean;
    api: boolean;
  };
}

const competitors: CompetitorPlan[] = [
  {
    name: "Tiny ERP",
    price: "R$ 45",
    features: {
      users: "2",
      ia: false,
      bi: false,
      api: false,
    },
  },
  {
    name: "Bling ERP",
    price: "R$ 119",
    features: {
      users: "5",
      ia: false,
      bi: false,
      api: false,
    },
  },
  {
    name: "Omie ERP",
    price: "R$ 199",
    features: {
      users: "10",
      ia: false,
      bi: true,
      api: false,
    },
  },
  // A linha do Orion é o plano de entrada, com os números que a rota aplica.
  // Antes dizia "Orion Pro R$ 249 / 10 usuários / BI ✅": preço de um plano que
  // hoje custa outro, assentos que o produto não tinha e BI que são 3
  // relatórios.
  {
    name: "Orion Starter",
    price: "R$ 89",
    features: {
      users: "2",
      ia: true,
      bi: false,
      api: false,
    },
  },
];

export default function PricingComparison() {
  return (
    <div className="bg-muted/30 rounded-2xl p-8">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Comparação de Mercado
        </Badge>
        <h3 className="text-2xl font-bold mb-2">
          Orion vs Concorrentes
        </h3>
        <p className="text-muted-foreground">
          Preços de tabela dos concorrentes, sem maquiagem do nosso lado
        </p>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-semibold">ERP</th>
              <th className="text-left py-4 px-4 font-semibold">Preço/mês</th>
              <th className="text-left py-4 px-4 font-semibold">Usuários</th>
              <th className="text-center py-4 px-4 font-semibold">IA Nativa</th>
              <th className="text-center py-4 px-4 font-semibold">BI Avançado</th>
              <th className="text-center py-4 px-4 font-semibold">API Aberta</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((competitor, index) => {
              const isOrion = competitor.name === "Orion Starter";
              return (
                <tr
                  key={index}
                  className={`border-b border-border/50 ${
                    isOrion ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="py-4 px-4">
                    <span className={isOrion ? "font-bold text-primary" : ""}>
                      {competitor.name}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={isOrion ? "font-bold text-primary" : ""}>
                      {competitor.price}
                    </span>
                  </td>
                  <td className="py-4 px-4">{competitor.features.users}</td>
                  <td className="py-4 px-4 text-center">
                    {competitor.features.ia ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {competitor.features.bi ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {competitor.features.api ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {competitors.map((competitor, index) => {
          const isOrion = competitor.name === "Orion Starter";
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                isOrion ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`font-semibold ${isOrion ? "text-primary" : ""}`}>
                  {competitor.name}
                </span>
                <span className={`font-bold ${isOrion ? "text-primary" : ""}`}>
                  {competitor.price}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Usuários</span>
                  <span>{competitor.features.users}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">IA Nativa</span>
                  {competitor.features.ia ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">BI Avançado</span>
                  {competitor.features.bi ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">API Aberta</span>
                  {competitor.features.api ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground/30" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        {/* Sem "único" e sem "IA preditiva": o que existe é chat com contexto
            dos dados, e superlativo de mercado não temos como comprovar. */}
        <p className="text-sm text-center">
          <span className="font-semibold text-primary">Onde o Orion ganha:</span>{" "}
          assistente de IA que enxerga os seus dados, no plano de entrada.{" "}
          <span className="font-semibold text-primary">Onde ainda perde:</span>{" "}
          não emite NF-e nem faz controle de estoque — se você precisa dos dois,
          Tiny e Bling resolvem melhor hoje.
        </p>
      </div>
    </div>
  );
}
