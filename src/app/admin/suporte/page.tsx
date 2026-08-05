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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HeadphonesIcon, Search, Eye, Loader2, Send, AlertCircle } from "lucide-react";
import { statusConfig, priorityConfig, formatTicketDate } from "@/lib/ticket-labels";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string | null;
    email: string;
  };
  replies: Array<{
    id: string;
    message: string;
    createdAt: string;
    isStaff: boolean;
  }>;
}

export default function AdminSuportePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      params.append("limit", "100");

      const response = await fetch(`/api/support?${params}`);
      const data = await response.json();

      if (response.ok) {
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setViewingTicket(ticket);
    setSelectedStatus(ticket.status);
    setSelectedPriority(ticket.priority);
    setReply("");
  };

  const handleSendReply = async () => {
    if (!viewingTicket || !reply.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/support/${viewingTicket.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: reply }),
      });

      if (response.ok) {
        const data = await response.json();
        setViewingTicket(data.ticket);
        setReply("");
        await fetchTickets();
      } else {
        alert("Erro ao enviar resposta");
      }
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      alert("Erro ao enviar resposta");
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateTicket = async () => {
    if (!viewingTicket) return;

    try {
      const response = await fetch(`/api/support/${viewingTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          priority: selectedPriority,
        }),
      });

      if (response.ok) {
        await fetchTickets();
        setViewingTicket(null);
      } else {
        alert("Erro ao atualizar ticket");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao atualizar ticket");
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(search.toLowerCase()) ||
      ticket.user.name?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = formatTicketDate;

  const getStatusCount = (status: string) => {
    return tickets.filter((t) => t.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <HeadphonesIcon className="h-8 w-8" />
          Gestão de Suporte
        </h1>
        <p className="text-muted-foreground">
          Visualizar e responder tickets de suporte
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              Abertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{getStatusCount("OPEN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{getStatusCount("IN_PROGRESS")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aguardando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {getStatusCount("WAITING_CUSTOMER")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Resolvidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{getStatusCount("RESOLVED")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fechados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{getStatusCount("CLOSED")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por assunto, usuário ou email..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="OPEN">Abertos</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                <SelectItem value="WAITING_CUSTOMER">Aguardando Cliente</SelectItem>
                <SelectItem value="RESOLVED">Resolvidos</SelectItem>
                <SelectItem value="CLOSED">Fechados</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="LOW">Baixa</SelectItem>
                <SelectItem value="MEDIUM">Média</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="URGENT">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>Todos os tickets de suporte</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8">
              <HeadphonesIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum ticket encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => {
                const StatusIcon = statusConfig[ticket.status]?.icon || AlertCircle;
                return (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleViewTicket(ticket)}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="h-4 w-4" />
                        <h3 className="font-semibold line-clamp-1">
                          {ticket.subject}
                        </h3>
                        <Badge
                          variant={statusConfig[ticket.status]?.variant || "default"}
                        >
                          {statusConfig[ticket.status]?.label || ticket.status}
                        </Badge>
                        <Badge
                          variant={
                            priorityConfig[ticket.priority]?.variant || "secondary"
                          }
                        >
                          {priorityConfig[ticket.priority]?.label || ticket.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{ticket.user.name || ticket.user.email}</span>
                        <span>•</span>
                        <span>{formatDate(ticket.createdAt)}</span>
                        <span>•</span>
                        <span>{ticket.replies.length} respostas</span>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Ticket Dialog */}
      <Dialog
        open={viewingTicket !== null}
        onOpenChange={() => setViewingTicket(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingTicket?.subject}</DialogTitle>
            <DialogDescription>
              Ticket de {viewingTicket?.user.name || viewingTicket?.user.email} •
              Criado em {viewingTicket && formatDate(viewingTicket.createdAt)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status e Prioridade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Aberto</SelectItem>
                    <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                    <SelectItem value="WAITING_CUSTOMER">
                      Aguardando Cliente
                    </SelectItem>
                    <SelectItem value="RESOLVED">Resolvido</SelectItem>
                    <SelectItem value="CLOSED">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={selectedPriority}
                  onValueChange={setSelectedPriority}
                >
                  <SelectTrigger>
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
            </div>

            {/* Mensagem Original */}
            <div className="space-y-2">
              <Label>Mensagem Original</Label>
              <div className="p-4 bg-muted rounded-lg">
                <p className="whitespace-pre-wrap">{viewingTicket?.message}</p>
              </div>
            </div>

            {/* Respostas */}
            {viewingTicket && viewingTicket.replies.length > 0 && (
              <div className="space-y-2">
                <Label>Histórico de Respostas</Label>
                <div className="space-y-3">
                  {viewingTicket.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-lg ${
                        reply.isStaff ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={reply.isStaff ? "default" : "secondary"}>
                          {reply.isStaff ? "Equipe" : "Cliente"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nova Resposta */}
            <div className="space-y-2">
              <Label htmlFor="reply">Adicionar Resposta</Label>
              <Textarea
                id="reply"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Digite sua resposta..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewingTicket(null)}
              disabled={isSending}
            >
              Fechar
            </Button>
            <Button onClick={handleUpdateTicket} variant="secondary">
              Atualizar Status
            </Button>
            <Button onClick={handleSendReply} disabled={isSending || !reply.trim()}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Resposta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
