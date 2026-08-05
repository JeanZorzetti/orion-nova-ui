import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { statusConfig, priorityConfig, formatTicketDate } from "@/lib/ticket-labels";
import { ReplyForm } from "./reply-form";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  // O escopo é a query: um id de outro usuário simplesmente não existe aqui.
  // Admin tem /admin/suporte — esta tela é a do dono do chamado.
  const ticket = await prisma.supportTicket.findFirst({
    where: { id, userId: session!.user.id },
    include: { replies: { orderBy: { createdAt: "asc" } } },
  });

  if (!ticket) notFound();

  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];
  const encerrado = ticket.status === "CLOSED" || ticket.status === "RESOLVED";

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/dashboard/suporte"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para meus chamados
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{ticket.subject}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={status?.variant || "default"}>
            {status?.label || ticket.status}
          </Badge>
          <Badge variant={priority?.variant || "secondary"}>
            {priority?.label || ticket.priority}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Aberto em {formatTicketDate(ticket.createdAt)}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">Você</Badge>
              <span className="text-xs text-muted-foreground">
                {formatTicketDate(ticket.createdAt)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm">{ticket.message}</p>
          </div>

          {ticket.replies.map((reply) => (
            <div
              key={reply.id}
              className={`p-4 rounded-lg ${reply.isStaff ? "bg-primary/10" : "bg-muted"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={reply.isStaff ? "default" : "secondary"}>
                  {reply.isStaff ? "Equipe" : "Você"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatTicketDate(reply.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {encerrado ? (
        <p className="text-sm text-muted-foreground">
          Este chamado está {status?.label.toLowerCase()}. Responder aqui reabre a
          conversa com a equipe.
        </p>
      ) : null}

      <ReplyForm ticketId={ticket.id} />
    </div>
  );
}
