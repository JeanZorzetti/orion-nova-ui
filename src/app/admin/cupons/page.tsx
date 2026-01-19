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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Percent,
  DollarSign,
  Calendar,
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_TRIAL";
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCuponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form fields
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT" | "FREE_TRIAL">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupons");
      const data = await response.json();

      if (response.ok) {
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error("Erro ao buscar cupons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCode("");
    setDescription("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMaxUses("");
    setValidFrom(new Date().toISOString().split("T")[0]);
    setValidUntil("");
    setIsActive(true);
  };

  const handleNewCoupon = () => {
    resetForm();
    setIsCreating(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setCode(coupon.code);
    setDescription(coupon.description || "");
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue.toString());
    setMaxUses(coupon.maxUses?.toString() || "");
    setValidFrom(coupon.validFrom.split("T")[0]);
    setValidUntil(coupon.validUntil ? coupon.validUntil.split("T")[0] : "");
    setIsActive(coupon.isActive);
    setEditingCoupon(coupon);
  };

  const handleSaveCoupon = async () => {
    if (!code || !discountValue) {
      alert("Código e valor do desconto são obrigatórios");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        code,
        description,
        discountType,
        discountValue: parseFloat(discountValue),
        maxUses: maxUses ? parseInt(maxUses) : null,
        validFrom,
        validUntil: validUntil || null,
        isActive,
      };

      const url = editingCoupon
        ? `/api/coupons/${editingCoupon.id}`
        : "/api/coupons";
      const method = editingCoupon ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchCoupons();
        setEditingCoupon(null);
        setIsCreating(false);
        resetForm();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao salvar cupom");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar cupom");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/coupons/${deleteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCoupons(coupons.filter((c) => c.id !== deleteId));
        setDeleteId(null);
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao deletar cupom");
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro ao deletar cupom");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDiscountTypeLabel = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return "Percentual";
      case "FIXED_AMOUNT":
        return "Valor Fixo";
      case "FREE_TRIAL":
        return "Trial Gratuito";
      default:
        return type;
    }
  };

  const formatDiscountValue = (type: string, value: number) => {
    switch (type) {
      case "PERCENTAGE":
        return `${value}%`;
      case "FIXED_AMOUNT":
        return `R$ ${value.toFixed(2).replace(".", ",")}`;
      case "FREE_TRIAL":
        return `${value} dias`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Ticket className="h-8 w-8" />
            Gerenciar Cupons de Desconto
          </h1>
          <p className="text-muted-foreground">
            Criar e gerenciar cupons promocionais
          </p>
        </div>
        <Button onClick={handleNewCoupon}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cupom
        </Button>
      </div>

      {/* Coupons Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Ticket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum cupom cadastrado</p>
            <Button onClick={handleNewCoupon} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Cupom
            </Button>
          </div>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl font-mono">
                        {coupon.code}
                      </CardTitle>
                      {coupon.isActive ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    {coupon.description && (
                      <CardDescription className="text-sm">
                        {coupon.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tipo:</span>
                    <Badge variant="secondary">
                      {getDiscountTypeLabel(coupon.discountType)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Desconto:</span>
                    <span className="font-semibold">
                      {formatDiscountValue(coupon.discountType, coupon.discountValue)}
                    </span>
                  </div>

                  {coupon.maxUses && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Usos:</span>
                      <span>
                        {coupon.usedCount} / {coupon.maxUses}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Válido até:</span>
                    <span>
                      {coupon.validUntil
                        ? new Date(coupon.validUntil).toLocaleDateString("pt-BR")
                        : "Sem prazo"}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditCoupon(coupon)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(coupon.id)}
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

      {/* Create/Edit Coupon Dialog */}
      <Dialog
        open={isCreating || editingCoupon !== null}
        onOpenChange={() => {
          setIsCreating(false);
          setEditingCoupon(null);
          resetForm();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
            </DialogTitle>
            <DialogDescription>
              {editingCoupon
                ? "Atualize as informações do cupom"
                : "Preencha os dados do novo cupom promocional"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="PROMO2026"
                  disabled={!!editingCoupon}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Tipo de Desconto *</Label>
                <Select
                  value={discountType}
                  onValueChange={(value: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_TRIAL") => setDiscountType(value)}
                  disabled={!!editingCoupon}
                >
                  <SelectTrigger id="discountType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentual (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Valor Fixo (R$)</SelectItem>
                    <SelectItem value="FREE_TRIAL">Trial Gratuito (dias)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Promoção de lançamento"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Valor do Desconto *{" "}
                  {discountType === "PERCENTAGE" && "(0-100)"}
                  {discountType === "FIXED_AMOUNT" && "(R$)"}
                  {discountType === "FREE_TRIAL" && "(dias)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step={discountType === "FIXED_AMOUNT" ? "0.01" : "1"}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === "PERCENTAGE" ? "10" : discountType === "FIXED_AMOUNT" ? "50.00" : "7"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUses">Limite de Usos</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Deixe vazio para ilimitado"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Válido A Partir De *</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Válido Até</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Cupom ativo
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false);
                setEditingCoupon(null);
                resetForm();
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveCoupon} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : editingCoupon ? (
                "Atualizar"
              ) : (
                "Criar Cupom"
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
              Tem certeza que deseja deletar este cupom? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCoupon}
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
