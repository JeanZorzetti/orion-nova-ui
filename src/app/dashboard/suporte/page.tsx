"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HeadphonesIcon, Loader2, Plus, AlertCircle } from "lucide-react";
import { statusConfig, priorityConfig, formatTicketDate } from "@/lib/ticket-labels";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  replies: Array<{ id: string }>;
}

export default function SuportePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [aberto, setAberto] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [isSending, setIsSending] = useState(false);

  // GET /api/support sem parâmetro já escopa por usuário no servidor.
  const fetchTickets = async () => {
    try {
      const response = await fetch("/api/support?limit=100");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao buscar chamados");
      setTickets(data.tickets || []);
      setErro("");
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCriar = async () => {
    if (!subject.trim() || !message.trim()) return;
    setIsSending(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, priority }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao abrir chamado");

      setAberto(false);
      setSubject("");
      setMessage("");
      setPriority("MEDIUM");
      await fetchTickets();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HeadphonesIcon className="h-8 w-8" />
            Suporte
          </h1>
          <p className="text-muted-foreground">
            Abra um chamado e acompanhe as respostas da nossa equipe
          </p>
        </div>
        <Button onClick={() => setAberto(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Abrir chamado
        </Button>
      </div>

      {erro && (
        <div className="flex items-center gap-2 p-4 rounded-lg border border-destructive/50 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {erro}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Meus chamados ({tickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <HeadphonesIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Você ainda não abriu nenhum chamado.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => {
                const StatusIcon = statusConfig[ticket.status]?.icon || AlertCircle;
                return (
                  <Link
                    key={ticket.id}
                    href={`/dashboard/suporte/${ticket.id}`}
                    className="flex items-center justify-between gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <StatusIcon className="h-4 w-4 flex-shrink-0" />
                        <h3 className="font-semibold line-clamp-1">{ticket.subject}</h3>
                        <Badge variant={statusConfig[ticket.status]?.variant || "default"}>
                          {statusConfig[ticket.status]?.label || ticket.status}
                        </Badge>
                        <Badge
                          variant={priorityConfig[ticket.priority]?.variant || "secondary"}
                        >
                          {priorityConfig[ticket.priority]?.label || ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatTicketDate(ticket.createdAt)}</span>
                        <span>•</span>
                        <span>{ticket.replies.length} respostas</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir chamado</DialogTitle>
            <DialogDescription>
              Descreva o problema. Nossa equipe responde por aqui e você recebe uma
              notificação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Resumo em uma linha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="O que aconteceu? O que você esperava?"
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAberto(false)} disabled={isSending}>
              Cancelar
            </Button>
            <Button
              onClick={handleCriar}
              disabled={isSending || !subject.trim() || !message.trim()}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Abrir chamado"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
