"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardData {
  summary: {
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    totalOrdersThisMonth: number;
    revenueThisMonth: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    paymentStatus: string;
    orderDate: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string | null;
    stockQuantity: number;
    minStock: number;
    unit: string;
  }>;
  topCustomers: Array<{
    customer: {
      id: string;
      name: string;
    } | null;
    totalSpent: number;
    orderCount: number;
  }>;
}

export default function DashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch("/api/dashboard/stats");
      if (response.ok) {
        const stats = await response.json();
        setData(stats);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR");
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      DRAFT: { label: "Rascunho", variant: "secondary" },
      CONFIRMED: { label: "Confirmado", variant: "default" },
      PROCESSING: { label: "Processando", variant: "default" },
      COMPLETED: { label: "Concluído", variant: "outline" },
      CANCELLED: { label: "Cancelado", variant: "destructive" },
    };

    const config = variants[status] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando estatísticas...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Erro ao carregar estatísticas</div>
      </div>
    );
  }

  const { summary, recentOrders, lowStockProducts, topCustomers } = data;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clientes */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Clientes</p>
              <h3 className="text-2xl font-bold mt-2">{summary.totalCustomers}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Total Produtos */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Produtos</p>
              <h3 className="text-2xl font-bold mt-2">{summary.totalProducts}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Pedidos Este Mês */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pedidos Este Mês</p>
              <h3 className="text-2xl font-bold mt-2">{summary.totalOrdersThisMonth}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Total: {summary.totalOrders}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Receita Este Mês */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita Este Mês</p>
              <h3 className="text-2xl font-bold mt-2 gradient-text">
                {formatCurrency(summary.revenueThisMonth)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos Recentes */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-medium">Pedidos Recentes</h3>
            <Link href="/dashboard/vendas">
              <Button variant="ghost" size="sm">Ver todos</Button>
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Nenhum pedido encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.orderNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.customer}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/vendas/${order.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Top Clientes */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-medium">Top 5 Clientes</h3>
            <Link href="/dashboard/clientes">
              <Button variant="ghost" size="sm">Ver todos</Button>
            </Link>
          </div>
          {topCustomers.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              Nenhum dado disponível
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {topCustomers.map((item, index) => (
                <div key={item.customer?.id || index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{item.customer?.name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.orderCount} {item.orderCount === 1 ? "pedido" : "pedidos"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.totalSpent)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alertas de Estoque Baixo */}
      {lowStockProducts.length > 0 && (
        <div className="glass-card overflow-hidden border-l-4 border-l-destructive">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="text-lg font-medium">Produtos com Estoque Baixo</h3>
            </div>
            <Link href="/dashboard/produtos">
              <Button variant="ghost" size="sm">Ver todos</Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-center">Estoque Atual</TableHead>
                <TableHead className="text-center">Mínimo</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.sku && (
                        <div className="text-xs text-muted-foreground">
                          SKU: {product.sku}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive">
                      {product.stockQuantity} {product.unit}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {product.minStock} {product.unit}
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/produtos/${product.id}/editar`}>
                      <Button variant="ghost" size="sm">Reabastecer</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
