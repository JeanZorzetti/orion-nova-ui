import {
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  type LucideIcon,
} from "lucide-react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

/** Fonte única dos rótulos de ticket: painel do admin e telas do cliente. */
export const statusConfig: Record<
  string,
  { label: string; icon: LucideIcon; variant: BadgeVariant }
> = {
  OPEN: { label: "Aberto", icon: AlertCircle, variant: "destructive" },
  IN_PROGRESS: { label: "Em Andamento", icon: Clock, variant: "default" },
  WAITING_CUSTOMER: { label: "Aguardando Cliente", icon: Clock, variant: "secondary" },
  RESOLVED: { label: "Resolvido", icon: CheckCircle2, variant: "outline" },
  CLOSED: { label: "Fechado", icon: XCircle, variant: "secondary" },
};

export const priorityConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  LOW: { label: "Baixa", variant: "secondary" },
  MEDIUM: { label: "Média", variant: "default" },
  HIGH: { label: "Alta", variant: "destructive" },
  URGENT: { label: "Urgente", variant: "destructive" },
};

export const formatTicketDate = (date: string | Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
