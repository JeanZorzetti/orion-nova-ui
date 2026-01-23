"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Customer {
  id: string;
  name: string;
  email: string | null;
}

interface Product {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  stockQuantity: number;
}

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function NovoVendaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "CONFIRMED">("DRAFT");

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  async function fetchCustomers() {
    try {
      const response = await fetch("/api/customers?limit=1000");
      const data = await response.json();
      if (response.ok) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch("/api/products?limit=1000&isActive=true");
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  function addProduct() {
    if (!selectedProductId) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    // Verificar se o produto já está na lista
    const existingItem = items.find((item) => item.productId === product.id);
    if (existingItem) {
      alert("Produto já adicionado. Altere a quantidade na tabela.");
      return;
    }

    const newItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      total: product.price,
    };

    setItems([...items, newItem]);
    setSelectedProductId("");
    setProductOpen(false);
  }

  function updateQuantity(index: number, quantity: number) {
    const newItems = [...items];
    newItems[index].quantity = quantity;
    newItems[index].total = quantity * newItems[index].unitPrice;
    setItems(newItems);
  }

  function updatePrice(index: number, price: number) {
    const newItems = [...items];
    newItems[index].unitPrice = price;
    newItems[index].total = newItems[index].quantity * price;
    setItems(newItems);
  }

  function removeItem(index: number) {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  }

  function calculateSubtotal() {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  function calculateTotal() {
    return Math.max(0, calculateSubtotal() - discount);
  }

  async function handleSubmit(e: React.FormEvent, saveStatus: "DRAFT" | "CONFIRMED") {
    e.preventDefault();

    if (!selectedCustomerId) {
      alert("Selecione um cliente");
      return;
    }

    if (items.length === 0) {
      alert("Adicione pelo menos um produto");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerId: selectedCustomerId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        discount,
        notes: notes || null,
        dueDate: dueDate || null,
        status: saveStatus,
        paymentStatus: "PENDING" as const,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Marcar step de onboarding como completo
        try {
          await fetch("/api/user/onboarding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              stepId: "first_sale",
              action: "complete",
            }),
          });
        } catch (onboardingError) {
          console.error("Erro ao atualizar onboarding:", onboardingError);
          // Não bloqueia o fluxo
        }

        router.push("/dashboard/vendas");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao criar pedido");
      }
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  }

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const subtotal = calculateSubtotal();
  const total = calculateTotal();

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
        <h1 className="text-2xl font-semibold text-foreground">
          Novo Pedido de Venda
        </h1>
        <p className="text-muted-foreground mt-1">
          Crie um novo pedido de venda
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        {/* Cliente */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Cliente</h3>
          <div>
            <Label>Selecione o Cliente <span className="text-destructive">*</span></Label>
            <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between mt-2"
                >
                  {selectedCustomer ? selectedCustomer.name : "Selecionar cliente..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar cliente..." />
                  <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {customers.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.name}
                        onSelect={() => {
                          setSelectedCustomerId(customer.id);
                          setCustomerOpen(false);
                        }}
                      >
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          {customer.email && (
                            <div className="text-xs text-muted-foreground">
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Produtos */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Produtos</h3>
            <Popover open={productOpen} onOpenChange={setProductOpen}>
              <PopoverTrigger asChild>
                <Button type="button" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Produto
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end">
                <Command>
                  <CommandInput placeholder="Buscar produto..." />
                  <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        onSelect={() => {
                          setSelectedProductId(product.id);
                          addProduct();
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span>R$ {product.price.toFixed(2)}</span>
                            {product.sku && <span>• SKU: {product.sku}</span>}
                            <span>• Estoque: {product.stockQuantity}</span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto adicionado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="w-32">Quantidade</TableHead>
                  <TableHead className="w-40">Preço Unit.</TableHead>
                  <TableHead className="w-40 text-right">Total</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(index, parseInt(e.target.value) || 1)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updatePrice(index, parseFloat(e.target.value) || 0)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {item.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Totais e Observações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Observações */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Detalhes Adicionais</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações internas..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Totais */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Resumo</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <Label htmlFor="discount">Desconto:</Label>
                <Input
                  id="discount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={subtotal}
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-32 text-right"
                />
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="gradient-text">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, "DRAFT")}
            variant="outline"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar como Rascunho"}
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, "CONFIRMED")}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Confirmar Pedido"}
          </Button>
          <Link href="/dashboard/vendas">
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
