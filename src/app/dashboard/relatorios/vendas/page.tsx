"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, BarChart3, TrendingUp } from "lucide-react";
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
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  byStatus: Record<string, { count: number; total: number }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    category: string | null;
    quantity: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    orderCount: number;
    totalSpent: number;
  }>;
  orders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    orderDate: string;
    total: number;
    status: string;
    itemCount: number;
  }>;
}

export default function RelatorioVendasPage() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Filtros
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [groupBy, setGroupBy] = useState("day");

  useEffect(() => {
    // Definir período padrão (últimos 30 dias)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setEndDate(today.toISOString().split("T")[0]);
    setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);

    fetchReport();
  }, []);

  async function fetchReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (status) params.append("status", status);
      if (groupBy) params.append("groupBy", groupBy);

      const response = await fetch(`/api/reports/sales?${params.toString()}`);
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
      ["Número", "Cliente", "Data", "Status", "Itens", "Total"],
      ...reportData.orders.map((order) => [
        order.orderNumber,
        order.customer,
        new Date(order.orderDate).toLocaleDateString("pt-BR"),
        order.status,
        order.itemCount.toString(),
        `R$ ${order.total.toFixed(2)}`,
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio-vendas-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const statusLabels: Record<string, string> = {
    DRAFT: "Rascunho",
    CONFIRMED: "Confirmado",
    PROCESSING: "Processando",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
  };

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
              Relatório de Vendas
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise completa das suas vendas
            </p>
          </div>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
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
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                <SelectItem value="PROCESSING">Processando</SelectItem>
                <SelectItem value="COMPLETED">Concluído</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
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
          {/* Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                  <p className="text-2xl font-semibold">
                    {reportData.summary.totalOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-semibold gradient-text">
                    R$ {reportData.summary.totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                  <p className="text-2xl font-semibold">
                    R$ {reportData.summary.averageOrderValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Produtos e Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Top Produtos */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium mb-4">Top 10 Produtos</h3>
              <div className="space-y-3">
                {reportData.topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.quantity} unidades vendidas
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      R$ {product.revenue.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Clientes */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium mb-4">Top 10 Clientes</h3>
              <div className="space-y-3">
                {reportData.topCustomers.map((customer, index) => (
                  <div
                    key={customer.customerId}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{customer.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.orderCount} pedidos
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      R$ {customer.totalSpent.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabela de Pedidos */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Todos os Pedidos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Itens</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/vendas/${order.id}`}
                        className="hover:text-primary"
                      >
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{order.itemCount}</TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {order.total.toFixed(2)}
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
