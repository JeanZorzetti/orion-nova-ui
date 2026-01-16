import { Sparkles, AlertTriangle, TrendingDown, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const insights = [
  {
    icon: Package,
    title: "Estoque Baixo",
    description: "Papel A4 está abaixo do mínimo. Restam 23 unidades.",
    type: "warning",
  },
  {
    icon: TrendingDown,
    title: "Queda de Vendas",
    description: "Vendas do produto X caíram 15% esta semana.",
    type: "alert",
  },
  {
    icon: AlertTriangle,
    title: "Pagamento Pendente",
    description: "3 faturas vencem amanhã. Total: R$ 4.500,00",
    type: "warning",
  },
];

const AIInsightsCard = () => {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-effect">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Insights da IA
          </h3>
          <p className="text-sm text-muted-foreground">
            Sugestões inteligentes
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-xl border transition-all duration-200 hover-glow cursor-pointer",
              insight.type === "alert"
                ? "bg-destructive/10 border-destructive/20"
                : "bg-accent/10 border-accent/20"
            )}
          >
            <div className="flex items-start gap-3">
              <insight.icon
                className={cn(
                  "w-4 h-4 mt-0.5 flex-shrink-0",
                  insight.type === "alert"
                    ? "text-destructive"
                    : "text-accent"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {insight.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsCard;
