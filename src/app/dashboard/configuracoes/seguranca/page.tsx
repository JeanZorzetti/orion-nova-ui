"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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

export default function SegurancaConfigPage() {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "";
  const [enviando, setEnviando] = useState(false);
  const [aberto, setAberto] = useState(false);

  // O botão era decorativo. O envio de link já existia inteiro em
  // /api/auth/forgot-password (NextAuth + Resend) — só não tinha quem chamasse.
  async function enviarLink() {
    setEnviando(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Não foi possível enviar o e-mail.");
      }

      setAberto(false);
      toast.success(`Link de redefinição enviado para ${email}.`, {
        description: "O link vale por 1 hora. Confira também a caixa de spam.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível enviar o e-mail."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Segurança</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie a segurança da sua conta
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-medium mb-2">Alterar Senha</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Recomendamos alterar sua senha regularmente
            </p>

            <AlertDialog open={aberto} onOpenChange={setAberto}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={!email}>
                  Alterar Senha
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Enviar link de redefinição?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enviaremos um link de redefinição de senha seguro para seu
                    e-mail de cadastro ({email}). Deseja continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={enviando}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={enviando}
                    onClick={(e) => {
                      // O AlertDialogAction fecha o diálogo por padrão; aqui ele
                      // precisa ficar aberto até a resposta do servidor.
                      e.preventDefault();
                      enviarLink();
                    }}
                  >
                    {enviando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {enviando ? "Enviando..." : "Enviar link"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Separator />

          <div>
            <h2 className="font-medium mb-2">Sessões Ativas</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Você está conectado em 1 dispositivo
            </p>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sessão Atual</p>
                  <p className="text-sm text-muted-foreground">
                    Windows • Chrome
                  </p>
                </div>
                <Badge variant="default">Ativo</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
