import { User } from "@prisma/client";

export type SubscriptionStatus = "TRIAL" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  isActive: boolean;
  trialEndsAt: Date | null;
  daysRemaining: number | null;
  canAccess: boolean;
}

/**
 * Verifica o status da subscription do usuário
 */
export function checkSubscriptionStatus(user: Pick<User, "subscriptionStatus" | "trialEndsAt" | "createdAt">): SubscriptionInfo {
  const now = new Date();
  const status = user.subscriptionStatus;

  // Se não tem trialEndsAt definido mas está em TRIAL, calcula 30 dias do createdAt
  let trialEndsAt = user.trialEndsAt;
  if (status === "TRIAL" && !trialEndsAt) {
    trialEndsAt = new Date(user.createdAt);
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);
  }

  // Calcula dias restantes
  let daysRemaining: number | null = null;
  if (trialEndsAt) {
    const diff = trialEndsAt.getTime() - now.getTime();
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Verifica se pode acessar
  let canAccess = false;
  let isActive = false;

  switch (status) {
    case "TRIAL":
      // Trial ativo se ainda não expirou
      if (trialEndsAt && now < trialEndsAt) {
        canAccess = true;
        isActive = true;
      }
      break;
    case "ACTIVE":
      // Subscription ativa sempre pode acessar
      canAccess = true;
      isActive = true;
      break;
    case "EXPIRED":
    case "CANCELLED":
      // Não pode acessar
      canAccess = false;
      isActive = false;
      break;
  }

  return {
    status,
    isActive,
    trialEndsAt,
    daysRemaining,
    canAccess,
  };
}

/**
 * Calcula a data de fim do trial (30 dias após o registro)
 */
export function calculateTrialEndDate(createdAt: Date): Date {
  const trialEnd = new Date(createdAt);
  trialEnd.setDate(trialEnd.getDate() + 30);
  return trialEnd;
}

/**
 * Retorna mensagem descritiva do status
 */
export function getSubscriptionMessage(info: SubscriptionInfo): string {
  if (info.status === "TRIAL" && info.isActive && info.daysRemaining !== null) {
    if (info.daysRemaining <= 0) {
      return "Seu trial expirou. Faça upgrade para continuar usando o Orion ERP.";
    } else if (info.daysRemaining <= 7) {
      return `Seu trial expira em ${info.daysRemaining} ${info.daysRemaining === 1 ? "dia" : "dias"}. Faça upgrade para continuar.`;
    } else {
      return `Você tem ${info.daysRemaining} dias restantes no seu trial gratuito.`;
    }
  }

  if (info.status === "ACTIVE") {
    return "Sua assinatura está ativa.";
  }

  if (info.status === "EXPIRED") {
    return "Seu trial expirou. Faça upgrade para continuar usando o Orion ERP.";
  }

  if (info.status === "CANCELLED") {
    return "Sua assinatura foi cancelada. Reative para continuar usando o Orion ERP.";
  }

  return "Status desconhecido.";
}

/**
 * Retorna cor do badge baseado no status
 */
export function getSubscriptionBadgeColor(info: SubscriptionInfo): "default" | "secondary" | "destructive" | "outline" {
  if (info.status === "TRIAL" && info.isActive) {
    if (info.daysRemaining && info.daysRemaining <= 7) {
      return "destructive"; // Vermelho se expira em breve
    }
    return "secondary"; // Azul para trial normal
  }

  if (info.status === "ACTIVE") {
    return "default"; // Verde para ativo
  }

  return "destructive"; // Vermelho para expirado/cancelado
}
