"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";

/**
 * Usa `POST /api/support/[id]/reply` — o mesmo caminho do painel do admin.
 * Não use o `reply` do `PUT /api/support`: dois caminhos para a mesma escrita
 * é um que vai divergir.
 */
export function ReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [erro, setErro] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    setErro("");
    try {
      const response = await fetch(`/api/support/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao enviar resposta");

      setMessage("");
      router.refresh();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="reply">Responder</Label>
      <Textarea
        id="reply"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua resposta..."
        rows={4}
      />
      {erro && <p className="text-sm text-destructive">{erro}</p>}
      <div className="flex justify-end">
        <Button onClick={handleSend} disabled={isSending || !message.trim()}>
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar resposta
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
