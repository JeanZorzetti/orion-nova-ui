import Link from "next/link";
import { BarChart3, Users, DollarSign, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RelatoriosPage() {
  const reports = [
    {
      title: "Relatório de Vendas",
      description: "Análise completa de vendas por período, produtos e clientes",
      icon: BarChart3,
      href: "/dashboard/relatorios/vendas",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Relatório de Clientes",
      description: "Estatísticas e segmentação da base de clientes",
      icon: Users,
      href: "/dashboard/relatorios/clientes",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Relatório Financeiro",
      description: "Fluxo de caixa, recebíveis e pagáveis",
      icon: DollarSign,
      href: "/dashboard/relatorios/financeiro",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Análises e relatórios gerenciais do seu negócio
        </p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.href}
              href={report.href}
              className="glass-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${report.bgColor}`}>
                  <Icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {report.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                  <Button variant="link" className="px-0 mt-2">
                    Ver relatório →
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
