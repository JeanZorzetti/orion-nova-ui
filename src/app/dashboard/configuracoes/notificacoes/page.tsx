"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

type Pref = "notifyNewOrders" | "notifyLowStock" | "notifyDueBills";

const TOGGLES: Array<{ id: Pref; titulo: string; descricao: string }> = [
  {
    id: "notifyNewOrders",
    titulo: "Pedidos novos",
    descricao: "Receba notificação quando um novo pedido for criado",
  },
  {
    id: "notifyLowStock",
    titulo: "Estoque baixo",
    descricao: "Alertas quando produtos atingirem o estoque mínimo",
  },
  {
    id: "notifyDueBills",
    titulo: "Contas a vencer",
    descricao: "Lembrete de contas a receber/pagar próximas do vencimento",
  },
];

// Espera o dedo parar antes de gravar. Sem isto, cinco cliques seguidos no mesmo
// switch viram cinco PATCHes concorrentes e quem chega por último vence.
const DEBOUNCE_MS = 400;

export default function NotificacoesConfigPage() {
  const [prefs, setPrefs] = useState<Record<Pref, boolean> | null>(null);
  const timers = useRef<Partial<Record<Pref, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("falha"))))
      .then((u) =>
        setPrefs({
          notifyNewOrders: u.notifyNewOrders,
          notifyLowStock: u.notifyLowStock,
          notifyDueBills: u.notifyDueBills,
        })
      )
      .catch(() => toast.error("Não foi possível carregar suas preferências."));

    const pendentes = timers.current;
    return () => Object.values(pendentes).forEach((t) => t && clearTimeout(t));
  }, []);

  async function gravar(id: Pref, valor: boolean) {
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [id]: valor }),
      });
      if (!res.ok) throw new Error("falha ao salvar");
    } catch {
      // Desfaz o otimismo: o switch volta para onde estava e o usuário vê por quê.
      setPrefs((p) => (p ? { ...p, [id]: !valor } : p));
      toast.error("Não foi possível salvar a preferência.", {
        action: { label: "Tentar novamente", onClick: () => alternar(id, valor) },
      });
    }
  }

  function alternar(id: Pref, valor: boolean) {
    setPrefs((p) => (p ? { ...p, [id]: valor } : p));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => gravar(id, valor), DEBOUNCE_MS);
  }

  return (
    <div className="max-w-3xl">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Notificações</h1>
            <p className="text-sm text-muted-foreground">
              Configure como você deseja receber notificações
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {TOGGLES.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{t.titulo}</p>
                <p className="text-sm text-muted-foreground">{t.descricao}</p>
              </div>
              {prefs ? (
                <Switch
                  checked={prefs[t.id]}
                  onCheckedChange={(v) => alternar(t.id, v)}
                  aria-label={t.titulo}
                />
              ) : (
                <Skeleton className="h-6 w-11 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
