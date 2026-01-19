"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: {
    posts: number;
  };
}

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Auto-gerar slug do nome
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  }, [name]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/blog/categories");
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
  };

  const handleNewCategory = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleEditCategory = (category: Category) => {
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setEditingCategory(category);
  };

  const handleSaveCategory = async () => {
    if (!name || !slug) {
      alert("Nome e slug são obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      const payload = { name, slug, description };

      const url = editingCategory
        ? `/api/blog/categories/${editingCategory.id}`
        : "/api/blog/categories";
      const method = editingCategory ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchCategories();
        setEditingCategory(null);
        setIsCreating(false);
        resetForm();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao salvar categoria");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar categoria");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/categories/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== deleteId));
        setDeleteId(null);
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao deletar categoria");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar categoria");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderOpen className="h-8 w-8" />
            Gerenciar Categorias
          </h1>
          <p className="text-muted-foreground">
            Criar e organizar categorias do blog
          </p>
        </div>
        <Button onClick={handleNewCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma categoria cadastrada</p>
            <Button onClick={handleNewCategory} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Categoria
            </Button>
          </div>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      /{category.slug}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {category._count?.posts || 0} posts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {category.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(category.id)}
                      disabled={category._count?.posts > 0}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Category Dialog */}
      <Dialog
        open={isCreating || editingCategory !== null}
        onOpenChange={() => {
          setIsCreating(false);
          setEditingCategory(null);
          resetForm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Atualize as informações da categoria"
                : "Preencha os dados da nova categoria"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Tecnologia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: tecnologia"
              />
              <p className="text-xs text-muted-foreground">
                URL: /blog/categoria/{slug || "slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição da categoria"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setEditingCategory(null);
                resetForm();
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveCategory} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : editingCategory ? (
                "Atualizar"
              ) : (
                "Criar Categoria"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta categoria? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
