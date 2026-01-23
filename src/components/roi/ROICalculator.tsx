"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users, DollarSign } from "lucide-react";

export default function ROICalculator() {
  const [employees, setEmployees] = useState(5);
  const [avgSalary, setAvgSalary] = useState(3500);
  const [hoursWastedPerWeek, setHoursWastedPerWeek] = useState(10);

  // Cálculos
  const hourlyRate = avgSalary / 160; // 160 horas úteis por mês
  const monthlyWaste = (hoursWastedPerWeek * 4.33 * hourlyRate * employees);
  const yearlyWaste = monthlyWaste * 12;

  // Economia com Orion ERP (baseado no benchmark: -87% tempo em relatórios)
  const efficiencyGain = 0.75; // 75% de ganho de eficiência
  const monthlySavings = monthlyWaste * efficiencyGain;
  const yearlySavings = monthlySavings * 12;

  // Custo Orion Professional
  const orionCost = 249;
  const yearlyOrionCost = orionCost * 12;

  // ROI
  const netYearlySavings = yearlySavings - yearlyOrionCost;
  const roi = ((netYearlySavings / yearlyOrionCost) * 100);
  const paybackMonths = yearlyOrionCost / monthlySavings;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Calcule seu ROI</CardTitle>
          <CardDescription>
            Veja quanto você pode economizar com o Orion ERP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employees">Número de funcionários</Label>
            <Input
              id="employees"
              type="number"
              min="1"
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salário médio mensal (R$)</Label>
            <Input
              id="salary"
              type="number"
              min="0"
              step="100"
              value={avgSalary}
              onChange={(e) => setAvgSalary(Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">
              Horas/semana perdidas em tarefas manuais
              <span className="text-xs text-muted-foreground ml-2">
                (ex: relatórios, planilhas, conciliação)
              </span>
            </Label>
            <Input
              id="hours"
              type="number"
              min="0"
              value={hoursWastedPerWeek}
              onChange={(e) => setHoursWastedPerWeek(Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Custo/hora:</strong> {formatCurrency(hourlyRate)}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Tempo perdido/mês:</strong> {(hoursWastedPerWeek * 4.33).toFixed(0)}h
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {/* Current Waste */}
        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Desperdício Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-3xl font-bold text-orange-600">
                  {formatCurrency(monthlyWaste)}
                </p>
                <p className="text-sm text-muted-foreground">por mês</p>
              </div>
              <div className="pt-2 border-t border-orange-200">
                <p className="text-xl font-semibold">
                  {formatCurrency(yearlyWaste)}
                </p>
                <p className="text-sm text-muted-foreground">por ano</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* With Orion */}
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Com Orion ERP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(monthlySavings)}
                </p>
                <p className="text-sm text-muted-foreground">economia/mês</p>
              </div>
              <div className="pt-2 border-t border-green-200">
                <p className="text-xl font-semibold">
                  {formatCurrency(yearlySavings)}
                </p>
                <p className="text-sm text-muted-foreground">economia/ano</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROI Summary */}
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Retorno do Investimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">ROI Anual</p>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {roi.toFixed(0)}%
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payback</p>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {paybackMonths.toFixed(1)} meses
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Investimento anual (Orion Pro)</span>
                <span className="font-semibold">{formatCurrency(yearlyOrionCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Economia anual</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(yearlySavings)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                <span className="font-semibold">Lucro líquido/ano</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(netYearlySavings)}
                </span>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Para sua empresa:
              </p>
              <p className="text-sm text-muted-foreground">
                O Orion ERP se paga em <strong>{paybackMonths.toFixed(1)} meses</strong> e
                gera um retorno de <strong>{roi.toFixed(0)}%</strong> no primeiro ano.
                Você economiza <strong>{formatCurrency(netYearlySavings)}</strong> anualmente.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
