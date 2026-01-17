"use client";

import { useEffect, useState } from "react";
import { Plus, Search, CheckCircle2, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface FinancialTransaction {
  id: string;
  type: "RECEIVABLE" | "PAYABLE";
  category: string;
  description: string;
  amount: number;
  dueDate: string;
  paidAt: string | null;
  status: string;
  customer: {
    id: string;
    name: string;
  } | null;
  order: {
    id: string;
    orderNumber: string;
  } | null;
}

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("RECEIVABLE");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchTransactions();
  }, [search, typeFilter, statusFilter, page]);

  async function fetchTransactions() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        type: typeFilter,
      });

      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/financial?${params}`);
      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsPaid(id: string) {
    try {
      const response = await fetch(`/api/financial/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "PAID",
          paidAt: paymentDate,
        }),
      });

      if (response.ok) {
        fetchTransactions();
        setSelectedTransaction(null);
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao registrar pagamento");
      }
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      alert("Erro ao registrar pagamento");
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/financial/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTransactions();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao excluir transação");
      }
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      alert("Erro ao excluir transação");
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

  function getStatusBadge(status: string, dueDate: string) {
    const today = new Date();
    const due = new Date(dueDate);

    if (status === "PAID") {
      return <Badge variant="default">Pago</Badge>;
    }

    if (status === "CANCELLED") {
      return <Badge variant="destructive">Cancelado</Badge>;
    }

    if (due < today) {
      return <Badge variant="destructive">Vencido</Badge>;
    }

    return <Badge variant="secondary">Pendente</Badge>;
  }

  const summary = transactions.reduce(
    (acc, t) => {
      if (t.status === "PAID") {
        acc.paid += t.amount;
      } else if (t.status === "PENDING" || t.status === "OVERDUE") {
        acc.pending += t.amount;
      }
      return acc;
    },
    { paid: 0, pending: 0 }
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {typeFilter === "RECEIVABLE" ? "Contas a Receber" : "Contas a Pagar"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas {typeFilter === "RECEIVABLE" ? "receitas" : "despesas"}
          </p>
        </div>
        <Link href="/dashboard/financeiro/novo">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Transação
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground">Total</p>
          <h3 className="text-2xl font-bold mt-2">
            {formatCurrency(summary.paid + summary.pending)}
          </h3>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground">
            {typeFilter === "RECEIVABLE" ? "Recebido" : "Pago"}
          </p>
          <h3 className="text-2xl font-bold mt-2 text-green-500">
            {formatCurrency(summary.paid)}
          </h3>
        </div>
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground">Pendente</p>
          <h3 className="text-2xl font-bold mt-2 text-amber-500">
            {formatCurrency(summary.pending)}
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por descrição, categoria ou cliente..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(value) => {
            setTypeFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RECEIVABLE">Contas a Receber</SelectItem>
            <SelectItem value="PAYABLE">Contas a Pagar</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="PAID">Pago</SelectItem>
            <SelectItem value="OVERDUE">Vencido</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Carregando...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhuma transação encontrada
            </p>
            <Link href="/dashboard/financeiro/novo">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Transação
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.order && (
                          <div className="text-xs text-muted-foreground">
                            Pedido: {transaction.order.orderNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.customer ? transaction.customer.name : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{transaction.category}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(transaction.dueDate)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status, transaction.dueDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {transaction.status !== "PAID" && transaction.status !== "CANCELLED" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(transaction.id)}>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Registrar Pagamento</DialogTitle>
                                <DialogDescription>
                                  Confirme o recebimento de {formatCurrency(transaction.amount)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="paymentDate">Data do Pagamento</Label>
                                  <Input
                                    id="paymentDate"
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => handleMarkAsPaid(transaction.id)}
                                  className="gap-2"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  Confirmar Recebimento
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                        {transaction.status !== "PAID" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Excluir transação?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(transaction.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
