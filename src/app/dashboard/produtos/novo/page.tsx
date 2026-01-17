"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";

export default function NovoProdutoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    type: "PRODUCT" as "PRODUCT" | "SERVICE",
    category: "",
    price: "",
    cost: "",
    stockQuantity: "0",
    minStock: "0",
    unit: "UN",
    isActive: true,
  });

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
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        minStock: parseInt(formData.minStock),
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/dashboard/produtos");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao criar produto");
      }
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/produtos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Produtos
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">
          Novo Produto
        </h1>
        <p className="text-muted-foreground mt-1">
          Adicione um novo produto ou serviço ao catálogo
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        {/* Informações Básicas */}
        <div>
          <h3 className="text-lg font-medium mb-4">Informações Básicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="name">
                Nome do Produto/Serviço{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Digite o nome"
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "PRODUCT" | "SERVICE") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRODUCT">Produto</SelectItem>
                  <SelectItem value="SERVICE">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sku">SKU / Código</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Ex: PROD-001"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Eletrônicos, Alimentos, Consultoria"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição detalhada do produto/serviço..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Preços */}
        <div>
          <h3 className="text-lg font-medium mb-4">Preços</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">
                Preço de Venda <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="cost">Custo</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Opcional - usado para calcular margem
              </p>
            </div>
          </div>
        </div>

        {/* Estoque - Apenas para produtos */}
        {formData.type === "PRODUCT" && (
          <div>
            <h3 className="text-lg font-medium mb-4">Controle de Estoque</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="stockQuantity">Quantidade em Estoque</Label>
                <Input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input
                  id="minStock"
                  name="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={handleChange}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Alerta quando atingir este valor
                </p>
              </div>

              <div>
                <Label htmlFor="unit">Unidade de Medida</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, unit: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UN">Unidade (UN)</SelectItem>
                    <SelectItem value="CX">Caixa (CX)</SelectItem>
                    <SelectItem value="KG">Quilograma (KG)</SelectItem>
                    <SelectItem value="G">Grama (G)</SelectItem>
                    <SelectItem value="L">Litro (L)</SelectItem>
                    <SelectItem value="ML">Mililitro (ML)</SelectItem>
                    <SelectItem value="M">Metro (M)</SelectItem>
                    <SelectItem value="M2">Metro Quadrado (M²)</SelectItem>
                    <SelectItem value="M3">Metro Cúbico (M³)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <Label htmlFor="isActive" className="cursor-pointer">
              Produto Ativo
            </Label>
            <p className="text-sm text-muted-foreground">
              Produtos ativos aparecem no catálogo e podem ser vendidos
            </p>
          </div>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isActive: checked }))
            }
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Criar Produto"}
          </Button>
          <Link href="/dashboard/produtos">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
