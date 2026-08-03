"use client";

import { useEntitlements } from "@/hooks/useEntitlements";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ReportData {
  receivables: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  payables: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
  };
  balance: {
    total: number;
    paid: number;
    pending: number;
  };
  byCategory: Array<{
    type: string;
    category: string;
    count: number;
    total: number;
    paid: number;
    pending: number;
  }>;
  upcomingDue: Array<{
    id: string;
    type: string;
    category: string;
    description: string;
    amount: number;
    dueDate: string;
    customer: string | null;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    category: string;
    description: string;
    amount: number;
    dueDate: string;
    paidAt: string | null;
    status: string;
    customer: string | null;
  }>;
}

export default function RelatorioFinanceiroPage() {
  const entitlements = useEntitlements();
  // null enquanto carrega: mostra o botão em vez de piscar.
  const podeExportar = entitlements?.canExport !== false;

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Filtros
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("ALL");

  useEffect(() => {
    // Definir período padrão (mês atual)
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setStartDate(startOfMonth.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);

    fetchReport();
  }, []);

  async function fetchReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (type && type !== "ALL") params.append("type", type);

      const response = await fetch(
        `/api/reports/financial?${params.toString()}`
      );
      const data = await response.json();

      if (response.ok) {
        setReportData(data);
      } else {
        alert(data.error || "Erro ao carregar relatório");
      }
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      alert("Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (!reportData) return;

    const rows = [
      [
        "Tipo",
        "Categoria",
        "Descrição",
        "Valor",
        "Vencimento",
        "Pagamento",
        "Status",
        "Cliente",
      ],
      ...reportData.transactions.map((t) => [
        t.type === "RECEIVABLE" ? "Recebível" : "Pagável",
        t.category,
        t.description,
        `R$ ${t.amount.toFixed(2)}`,
        new Date(t.dueDate).toLocaleDateString("pt-BR"),
        t.paidAt ? new Date(t.paidAt).toLocaleDateString("pt-BR") : "",
        t.status,
        t.customer || "",
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio-financeiro-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando relatório...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/relatorios"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Relatórios
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Relatório Financeiro
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise de fluxo de caixa e movimentações financeiras
            </p>
          </div>
          {podeExportar && (
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="startDate">Data Início</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Data Fim</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="RECEIVABLE">Recebíveis</SelectItem>
                <SelectItem value="PAYABLE">Pagáveis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={fetchReport} className="w-full">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>

      {reportData && (
        <>
          {/* Resumo Geral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Recebíveis */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium">Contas a Receber</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-green-600">
                    R$ {reportData.receivables.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recebido:</span>
                  <span>R$ {reportData.receivables.paid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">A Receber:</span>
                  <span>R$ {reportData.receivables.pending.toFixed(2)}</span>
                </div>
                {reportData.receivables.overdue > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vencido:</span>
                    <span className="text-destructive">
                      R$ {reportData.receivables.overdue.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Pagáveis */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-medium">Contas a Pagar</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold text-red-600">
                    R$ {reportData.payables.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pago:</span>
                  <span>R$ {reportData.payables.paid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">A Pagar:</span>
                  <span>R$ {reportData.payables.pending.toFixed(2)}</span>
                </div>
                {reportData.payables.overdue > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Vencido:</span>
                    <span className="text-destructive">
                      R$ {reportData.payables.overdue.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Saldo */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Saldo</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Saldo Total:</span>
                  <span
                    className={`font-semibold ${
                      reportData.balance.total >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    R$ {reportData.balance.total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Realizado:</span>
                  <span
                    className={
                      reportData.balance.paid >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    R$ {reportData.balance.paid.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Previsto:</span>
                  <span
                    className={
                      reportData.balance.pending >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    R$ {reportData.balance.pending.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Por Categoria */}
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Por Categoria</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Transações</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Pago</TableHead>
                  <TableHead className="text-right">Pendente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.byCategory.map((cat, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge
                        variant={
                          cat.type === "RECEIVABLE" ? "default" : "destructive"
                        }
                      >
                        {cat.type === "RECEIVABLE" ? "Recebível" : "Pagável"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{cat.category}</TableCell>
                    <TableCell className="text-right">{cat.count}</TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {cat.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      R$ {cat.paid.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-yellow-600">
                      R$ {cat.pending.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Próximos Vencimentos */}
          {reportData.upcomingDue.length > 0 && (
            <div className="glass-card p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">
                Próximos Vencimentos (30 dias)
              </h3>
              <div className="space-y-2">
                {reportData.upcomingDue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant={
                            item.type === "RECEIVABLE" ? "default" : "destructive"
                          }
                          className="text-xs"
                        >
                          {item.type === "RECEIVABLE" ? "Receber" : "Pagar"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.category}
                        </span>
                      </div>
                      <p className="font-medium text-sm">{item.description}</p>
                      {item.customer && (
                        <p className="text-xs text-muted-foreground">
                          {item.customer}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        R$ {item.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.dueDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Todas as Transações */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Todas as Transações</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Badge
                        variant={
                          t.type === "RECEIVABLE" ? "default" : "destructive"
                        }
                      >
                        {t.type === "RECEIVABLE" ? "Receber" : "Pagar"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{t.category}</TableCell>
                    <TableCell className="text-sm">{t.description}</TableCell>
                    <TableCell className="text-sm">{t.customer || "-"}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(t.dueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={t.status === "PAID" ? "default" : "secondary"}
                      >
                        {t.status === "PAID" ? "Pago" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {t.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
