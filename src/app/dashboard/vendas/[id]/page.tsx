"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, FileDown } from "lucide-react";
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
  TableFooter,
} from "@/components/ui/table";
import { generateOrderPDF } from "@/lib/pdf-generator";

interface OrderDetails {
  id: string;
  orderNumber: string;
  orderDate: string;
  dueDate: string | null;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    cpfCnpj: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
  };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
    product: {
      id: string;
      name: string;
      sku: string | null;
      unit: string;
    };
  }>;
}

interface ViewOrderPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewOrderPage({ params }: ViewOrderPageProps) {
  const [orderId, setOrderId] = useState<string>("");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setOrderId(p.id);
      fetchOrder(p.id);
    });
  }, []);

  async function fetchOrder(id: string) {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        alert("Pedido não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar pedido:", error);
      alert("Erro ao carregar pedido");
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

  function formatDate(dateString: string | null) {
    if (!dateString) return "-";
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

  function getPaymentBadge(paymentStatus: string) {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDING: { label: "Pendente", variant: "secondary" },
      PARTIAL: { label: "Parcial", variant: "outline" },
      PAID: { label: "Pago", variant: "default" },
      OVERDUE: { label: "Atrasado", variant: "destructive" },
    };

    const config = variants[paymentStatus] || { label: paymentStatus, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  }

  function handleGeneratePDF() {
    if (!order) return;

    generateOrderPDF({
      orderNumber: order.orderNumber,
      customerName: order.customer.name,
      customerEmail: order.customer.email || undefined,
      customerPhone: order.customer.phone || undefined,
      orderDate: order.orderDate,
      dueDate: order.dueDate || undefined,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items.map((item) => ({
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        total: Number(item.total),
      })),
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      total: Number(order.total),
      notes: order.notes || undefined,
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Pedido não encontrado</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/vendas"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Vendas
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Pedido {order.orderNumber}
            </h1>
            <p className="text-muted-foreground mt-1">
              Criado em {formatDate(order.orderDate)}
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleGeneratePDF}>
            <FileDown className="w-4 h-4" />
            Gerar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Cliente */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Cliente</h3>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">Nome</div>
              <div className="font-medium">{order.customer.name}</div>
            </div>
            {order.customer.cpfCnpj && (
              <div>
                <div className="text-sm text-muted-foreground">CPF/CNPJ</div>
                <div>{order.customer.cpfCnpj}</div>
              </div>
            )}
            {order.customer.email && (
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div>{order.customer.email}</div>
              </div>
            )}
            {order.customer.phone && (
              <div>
                <div className="text-sm text-muted-foreground">Telefone</div>
                <div>{order.customer.phone}</div>
              </div>
            )}
            {(order.customer.city || order.customer.state) && (
              <div>
                <div className="text-sm text-muted-foreground">Localização</div>
                <div>
                  {order.customer.city && order.customer.state
                    ? `${order.customer.city}/${order.customer.state}`
                    : order.customer.city || order.customer.state}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status e Datas */}
        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Status do Pedido</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Status do Pedido</div>
              {getStatusBadge(order.status)}
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Status do Pagamento</div>
              {getPaymentBadge(order.paymentStatus)}
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Data do Pedido</div>
              <div className="font-medium">{formatDate(order.orderDate)}</div>
            </div>
            {order.dueDate && (
              <div>
                <div className="text-sm text-muted-foreground">Vencimento</div>
                <div className="font-medium">{formatDate(order.dueDate)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itens do Pedido */}
      <div className="glass-card overflow-hidden mt-6">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-medium">Itens do Pedido</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Quantidade</TableHead>
              <TableHead className="text-right">Preço Unit.</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.product.name}</div>
                    {item.product.sku && (
                      <div className="text-xs text-muted-foreground">
                        SKU: {item.product.sku}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {item.quantity} {item.product.unit}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">
                Subtotal:
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(order.subtotal)}
              </TableCell>
            </TableRow>
            {order.discount > 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Desconto:
                </TableCell>
                <TableCell className="text-right font-medium text-destructive">
                  - {formatCurrency(order.discount)}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={3} className="text-right text-lg font-semibold">
                Total:
              </TableCell>
              <TableCell className="text-right text-lg font-semibold gradient-text">
                {formatCurrency(order.total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Observações */}
      {order.notes && (
        <div className="glass-card p-6 mt-6">
          <h3 className="text-lg font-medium mb-4">Observações</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
