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
import { Switch } from "@/components/ui/switch";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  billingPeriod: string;
  features: any;
  maxUsers: number | null;
  maxStorage: number | null;
  isActive: boolean;
  stripePriceId: string | null;
  _count: {
    subscriptions: number;
  };
}

export default function AdminPlanosPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [billingPeriod, setBillingPeriod] = useState("MONTHLY");
  const [maxUsers, setMaxUsers] = useState("");
  const [maxStorage, setMaxStorage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [stripePriceId, setStripePriceId] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      const data = await response.json();

      if (response.ok) {
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setPrice("");
    setBillingPeriod("MONTHLY");
    setMaxUsers("");
    setMaxStorage("");
    setIsActive(true);
    setStripePriceId("");
  };

  const handleNewPlan = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setName(plan.name);
    setSlug(plan.slug);
    setDescription(plan.description || "");
    setPrice(plan.price.toString());
    setBillingPeriod(plan.billingPeriod);
    setMaxUsers(plan.maxUsers?.toString() || "");
    setMaxStorage(plan.maxStorage?.toString() || "");
    setIsActive(plan.isActive);
    setStripePriceId(plan.stripePriceId || "");
    setEditingPlan(plan);
  };

  const handleSavePlan = async () => {
    if (!name || !slug || !price) {
      alert("Nome, slug e preço são obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        slug,
        description,
        price: parseFloat(price),
        billingPeriod,
        maxUsers: maxUsers ? parseInt(maxUsers) : null,
        maxStorage: maxStorage ? parseInt(maxStorage) : null,
        isActive,
        // features não é editável aqui e {} é truthy: mandar o campo apagaria
        // os bullets que /precos renderiza. Omitir = a rota mantém os atuais.
        stripePriceId: stripePriceId.trim() || null,
      };

      const url = editingPlan
        ? `/api/plans/${editingPlan.id}`
        : "/api/plans";
      const method = editingPlan ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchPlans();
        setEditingPlan(null);
        setIsCreating(false);
        resetForm();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao salvar plano");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar plano");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (planId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchPlans();
      } else {
        alert("Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar status");
    }
  };

  const handleDeletePlan = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/plans/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPlans(plans.filter((p) => p.id !== deleteId));
        setDeleteId(null);
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao deletar plano");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar plano");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const billingPeriodLabels: Record<string, string> = {
    MONTHLY: "Mensal",
    QUARTERLY: "Trimestral",
    SEMIANNUAL: "Semestral",
    YEARLY: "Anual",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Gerenciar Planos
          </h1>
          <p className="text-muted-foreground">
            Criar, editar e gerenciar planos de assinatura
          </p>
        </div>
        <Button onClick={handleNewPlan}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum plano cadastrado</p>
            <Button onClick={handleNewPlan} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Plano
            </Button>
          </div>
        ) : (
          plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      {plan.isActive ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </CardTitle>
                    <CardDescription>{plan.slug}</CardDescription>
                  </div>
                  <Badge variant={plan.isActive ? "default" : "secondary"}>
                    {plan.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">{formatPrice(plan.price)}</p>
                    <p className="text-sm text-muted-foreground">
                      {billingPeriodLabels[plan.billingPeriod] || plan.billingPeriod}
                    </p>
                  </div>

                  {plan.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {plan.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {plan.maxUsers !== null && (
                      <div>
                        <p className="text-muted-foreground">Máx. Usuários</p>
                        <p className="font-medium">
                          {plan.maxUsers === -1 ? "Ilimitado" : plan.maxUsers}
                        </p>
                      </div>
                    )}
                    {plan.maxStorage !== null && (
                      <div>
                        <p className="text-muted-foreground">Storage (GB)</p>
                        <p className="font-medium">{plan.maxStorage}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Assinaturas</p>
                      <p className="font-medium">{plan._count?.subscriptions || 0}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(plan.id, plan.isActive)}
                    >
                      {plan.isActive ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(plan.id)}
                      disabled={plan._count?.subscriptions > 0}
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

      {/* Create/Edit Plan Dialog */}
      <Dialog
        open={isCreating || editingPlan !== null}
        onOpenChange={() => {
          setIsCreating(false);
          setEditingPlan(null);
          resetForm();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Editar Plano" : "Criar Novo Plano"}
            </DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Atualize as informações do plano"
                : "Preencha os dados do novo plano de assinatura"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Professional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Ex: professional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição do plano"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 179.90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingPeriod">Período de Cobrança</Label>
                <select
                  id="billingPeriod"
                  value={billingPeriod}
                  onChange={(e) => setBillingPeriod(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="MONTHLY">Mensal</option>
                  <option value="QUARTERLY">Trimestral</option>
                  <option value="SEMIANNUAL">Semestral</option>
                  <option value="YEARLY">Anual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Máx. de Usuários</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={maxUsers}
                  onChange={(e) => setMaxUsers(e.target.value)}
                  placeholder="Vazio = ilimitado"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStorage">Storage (GB)</Label>
                <Input
                  id="maxStorage"
                  type="number"
                  value={maxStorage}
                  onChange={(e) => setMaxStorage(e.target.value)}
                  placeholder="Ex: 50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stripePriceId">Stripe Price ID</Label>
              <Input
                id="stripePriceId"
                value={stripePriceId}
                onChange={(e) => setStripePriceId(e.target.value)}
                placeholder="price_..."
              />
              <p className="text-sm text-muted-foreground">
                Sem isto o checkout responde 409. Copie do Price recorrente do
                Product deste plano na Stripe.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">Plano ativo e disponível para venda</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setEditingPlan(null);
                resetForm();
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSavePlan} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : editingPlan ? (
                "Atualizar"
              ) : (
                "Criar Plano"
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
              Tem certeza que deseja deletar este plano? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
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
