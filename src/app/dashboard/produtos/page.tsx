"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  sku: string | null;
  type: "PRODUCT" | "SERVICE";
  category: string | null;
  price: number;
  cost: number | null;
  stockQuantity: number;
  minStock: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [search, typeFilter, statusFilter, lowStockFilter, page]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) params.append("search", search);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (statusFilter !== "all")
        params.append("isActive", statusFilter === "active" ? "true" : "false");
      if (lowStockFilter) params.append("lowStock", "true");

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao excluir produto");
      }
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function isLowStock(product: Product) {
    return product.type === "PRODUCT" && product.stockQuantity <= product.minStock;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Produtos e Serviços
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seu catálogo de produtos e serviços
          </p>
        </div>
        <Link href="/dashboard/produtos/novo">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome, SKU ou descrição..."
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
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="PRODUCT">Produto</SelectItem>
            <SelectItem value="SERVICE">Serviço</SelectItem>
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
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={lowStockFilter ? "default" : "outline"}
          onClick={() => {
            setLowStockFilter(!lowStockFilter);
            setPage(1);
          }}
          className="gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Estoque Baixo
        </Button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Carregando...
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum produto encontrado
            </p>
            <Link href="/dashboard/produtos/novo">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-center">Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {product.name}
                          {isLowStock(product) && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                        {product.sku && (
                          <div className="text-xs text-muted-foreground">
                            SKU: {product.sku}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {product.type === "PRODUCT" ? (
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            Produto
                          </span>
                        ) : (
                          "Serviço"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.category || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(product.price)}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.type === "PRODUCT" ? (
                        <div className="flex flex-col items-center">
                          <span
                            className={
                              isLowStock(product) ? "text-destructive font-medium" : ""
                            }
                          >
                            {product.stockQuantity} {product.unit}
                          </span>
                          {product.minStock > 0 && (
                            <span className="text-xs text-muted-foreground">
                              Mín: {product.minStock}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.isActive ? "default" : "secondary"}
                      >
                        {product.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/produtos/${product.id}/editar`}
                        >
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir produto?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. O produto{" "}
                                <strong>{product.name}</strong> será
                                permanentemente excluído.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
