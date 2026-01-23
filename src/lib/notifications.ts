import { prisma } from "./prisma";
import { NotificationType } from "@prisma/client";

// Criar notificação para trial expirando em 7 dias
export async function createTrialExpiringNotification(
  userId: string,
  daysRemaining: number
) {
  try {
    // Verificar se já existe notificação similar recente (últimas 24h)
    const recentNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type: "WARNING",
        title: {
          contains: "Trial expira em",
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
        },
      },
    });

    // Se já existe notificação recente, não criar outra
    if (recentNotification) {
      return null;
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "WARNING" as NotificationType,
        title: `Trial expira em ${daysRemaining} dias`,
        message: `Seu período de teste termina em ${daysRemaining} dias. Escolha um plano para continuar usando o Orion ERP sem interrupções.`,
        link: "/precos",
      },
    });

    return notification;
  } catch (error) {
    console.error("Erro ao criar notificação de trial:", error);
    return null;
  }
}

// Criar notificação para trial expirado
export async function createTrialExpiredNotification(userId: string) {
  try {
    // Verificar se já existe notificação similar recente (últimas 24h)
    const recentNotification = await prisma.notification.findFirst({
      where: {
        userId,
        type: "ERROR",
        title: {
          contains: "Trial expirou",
        },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (recentNotification) {
      return null;
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "ERROR" as NotificationType,
        title: "Seu trial expirou",
        message:
          "Seu período de teste de 30 dias terminou. Assine um plano para continuar usando o Orion ERP.",
        link: "/precos",
      },
    });

    return notification;
  } catch (error) {
    console.error("Erro ao criar notificação de trial expirado:", error);
    return null;
  }
}

// Criar notificação de boas-vindas
export async function createWelcomeNotification(userId: string) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "INFO" as NotificationType,
        title: "Bem-vindo ao Orion ERP!",
        message:
          "Comece seu trial de 30 dias e explore todas as funcionalidades. Precisando de ajuda? Confira nosso guia de primeiros passos.",
        link: "/dashboard",
      },
    });

    return notification;
  } catch (error) {
    console.error("Erro ao criar notificação de boas-vindas:", error);
    return null;
  }
}

// Verificar e criar notificações de trial para todos os usuários
export async function checkAndCreateTrialNotifications() {
  try {
    // Buscar todos os usuários em trial
    const usersInTrial = await prisma.user.findMany({
      where: {
        subscriptionStatus: "TRIAL",
        trialEndsAt: {
          not: null,
        },
      },
      select: {
        id: true,
        trialEndsAt: true,
        email: true,
      },
    });

    const now = new Date();
    const results = {
      checked: usersInTrial.length,
      notifications7Days: 0,
      notifications3Days: 0,
      notificationsExpired: 0,
    };

    for (const user of usersInTrial) {
      if (!user.trialEndsAt) continue;

      const trialEndsAt = new Date(user.trialEndsAt);
      const diffTime = trialEndsAt.getTime() - now.getTime();
      const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Trial expirado
      if (daysRemaining <= 0) {
        await createTrialExpiredNotification(user.id);
        results.notificationsExpired++;
      }
      // 3 dias restantes
      else if (daysRemaining === 3) {
        await createTrialExpiringNotification(user.id, 3);
        results.notifications3Days++;
      }
      // 7 dias restantes
      else if (daysRemaining === 7) {
        await createTrialExpiringNotification(user.id, 7);
        results.notifications7Days++;
      }
    }

    return results;
  } catch (error) {
    console.error("Erro ao verificar trials:", error);
    throw error;
  }
}
