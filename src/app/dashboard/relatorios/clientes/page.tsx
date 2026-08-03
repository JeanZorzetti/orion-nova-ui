"use client";

import { useEntitlements } from "@/hooks/useEntitlements";

import { useEffect, useState } from "react";
import { ArrowLeft, Download, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    totalCustomers: number;
    activeCustomers: number;
    inactiveCustomers: number;
    customersWithOrders: number;
    customersWithoutOrders: number;
  };
  byType: Record<string, number>;
  byState: Record<string, number>;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string | null;
    orderCount: number;
    totalSpent: number;
    averageOrderValue: number;
  }>;
  customers: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    type: string;
    city: string | null;
    state: string | null;
    isActive: boolean;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string | null;
  }>;
}

export default function RelatorioClientesPage() {
  const entitlements = useEntitlements();
  // null enquanto carrega: mostra o botão em vez de piscar.
  const podeExportar = entitlements?.canExport !== false;

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Filtros
  const [type, setType] = useState("ALL");
  const [isActive, setIsActive] = useState("ALL");

  useEffect(() => {
    fetchReport();
  }, []);

  async function fetchReport() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type && type !== "ALL") params.append("type", type);
      if (isActive && isActive !== "ALL") params.append("isActive", isActive);

      const response = await fetch(
        `/api/reports/customers?${params.toString()}`
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
        "Nome",
        "Email",
        "Telefone",
        "Tipo",
        "Cidade",
        "Estado",
        "Status",
        "Pedidos",
        "Total Gasto",
        "Ticket Médio",
        "Último Pedido",
      ],
      ...reportData.customers.map((customer) => [
        customer.name,
        customer.email || "",
        customer.phone || "",
        customer.type,
        customer.city || "",
        customer.state || "",
        customer.isActive ? "Ativo" : "Inativo",
        customer.orderCount.toString(),
        `R$ ${customer.totalSpent.toFixed(2)}`,
        `R$ ${customer.orderCount > 0 ? (customer.totalSpent / customer.orderCount).toFixed(2) : "0.00"}`,
        customer.lastOrderDate
          ? new Date(customer.lastOrderDate).toLocaleDateString("pt-BR")
          : "",
      ]),
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `relatorio-clientes-${new Date().toISOString().split("T")[0]}.csv`
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
              Relatório de Clientes
            </h1>
            <p className="text-muted-foreground mt-1">
              Estatísticas e análise da sua base de clientes
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="PESSOA_FISICA">Pessoa Física</SelectItem>
                <SelectItem value="PESSOA_JURIDICA">Pessoa Jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="isActive">Status</Label>
            <Select value={isActive} onValueChange={setIsActive}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                <SelectItem value="true">Ativos</SelectItem>
                <SelectItem value="false">Inativos</SelectItem>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold">
                    {reportData.summary.totalCustomers}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                  <p className="text-2xl font-semibold">
                    {reportData.summary.activeCustomers}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Com Pedidos</p>
                  <p className="text-2xl font-semibold">
                    {reportData.summary.customersWithOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sem Pedidos</p>
                  <p className="text-2xl font-semibold">
                    {reportData.summary.customersWithoutOrders}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Clientes */}
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Top 10 Clientes</h3>
            <div className="space-y-3">
              {reportData.topCustomers.map((customer, index) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email || "Sem email"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold gradient-text">
                      R$ {customer.totalSpent.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer.orderCount} pedidos • Ticket médio: R${" "}
                      {customer.averageOrderValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabela de Clientes */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Todos os Clientes</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cidade/Estado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Pedidos</TableHead>
                  <TableHead className="text-right">Total Gasto</TableHead>
                  <TableHead>Último Pedido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/clientes/${customer.id}/editar`}
                        className="hover:text-primary"
                      >
                        {customer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {customer.email || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {customer.city && customer.state
                        ? `${customer.city}/${customer.state}`
                        : customer.city || customer.state || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={customer.isActive ? "default" : "secondary"}
                      >
                        {customer.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.orderCount}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {customer.totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {customer.lastOrderDate
                        ? new Date(customer.lastOrderDate).toLocaleDateString(
                            "pt-BR"
                          )
                        : "-"}
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
