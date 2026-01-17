"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Customer {
  id: string;
  name: string;
}

export default function NovaTransacaoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    type: "RECEIVABLE" as "RECEIVABLE" | "PAYABLE",
    category: "",
    description: "",
    amount: "",
    customerId: "",
    dueDate: "",
    status: "PENDING" as "PENDING" | "PAID",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const response = await fetch("/api/customers?limit=1000&isActive=true");
      const data = await response.json();
      if (response.ok) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        customerId: formData.customerId || null,
      };

      const response = await fetch("/api/financial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/dashboard/financeiro");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao criar transação");
      }
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      alert("Erro ao criar transação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/financeiro"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Financeiro
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">
          Nova Transação
        </h1>
        <p className="text-muted-foreground mt-1">
          Registre uma nova transação financeira
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        {/* Tipo */}
        <div>
          <h3 className="text-lg font-medium mb-4">Tipo de Transação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo <span className="text-destructive">*</span></Label>
              <Select
                value={formData.type}
                onValueChange={(value: "RECEIVABLE" | "PAYABLE") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECEIVABLE">Conta a Receber</SelectItem>
                  <SelectItem value="PAYABLE">Conta a Pagar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria <span className="text-destructive">*</span></Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="Ex: Venda, Serviço, Aluguel"
              />
            </div>
          </div>
        </div>

        {/* Informações */}
        <div>
          <h3 className="text-lg font-medium mb-4">Informações</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="description">
                Descrição <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Descrição detalhada da transação..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="amount">
                Valor <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="dueDate">
                Data de Vencimento <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="customerId">Cliente (Opcional)</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, customerId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "PENDING" | "PAID") =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="PAID">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Criar Transação"}
          </Button>
          <Link href="/dashboard/financeiro">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
