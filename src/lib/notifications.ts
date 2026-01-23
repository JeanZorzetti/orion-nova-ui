import { prisma } from "./prisma";
import { NotificationType } from "@prisma/client";
import {
  sendTrialExpiringEmail,
  sendTrialExpiredEmail,
  sendWelcomeEmail,
  sendOnboardingCompletedEmail,
  sendSalePaidEmail,
  sendGenericNotificationEmail,
} from "./email/send";
import { sendPushNotificationToUser } from "./web-push";

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

    // Enviar email (não bloqueante - se falhar, notificação já foi criada)
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        await sendTrialExpiringEmail(
          user.email,
          user.name || "Usuário",
          daysRemaining
        );
        console.log(
          `[Notifications] Email de trial expirando enviado para: ${user.email}`
        );
      }
    } catch (emailError) {
      console.error("Erro ao enviar email de trial expirando:", emailError);
      // Não falha a função - notificação já foi criada
    }

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

    // Enviar email (não bloqueante - se falhar, notificação já foi criada)
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        await sendTrialExpiredEmail(user.email, user.name || "Usuário");
        console.log(
          `[Notifications] Email de trial expirado enviado para: ${user.email}`
        );
      }
    } catch (emailError) {
      console.error("Erro ao enviar email de trial expirado:", emailError);
      // Não falha a função - notificação já foi criada
    }

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

    // Enviar email (não bloqueante - se falhar, notificação já foi criada)
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        await sendWelcomeEmail(user.email, user.name || "Usuário");
        console.log(
          `[Notifications] Email de boas-vindas enviado para: ${user.email}`
        );
      }
    } catch (emailError) {
      console.error("Erro ao enviar email de boas-vindas:", emailError);
      // Não falha a função - notificação já foi criada
    }

    return notification;
  } catch (error) {
    console.error("Erro ao criar notificação de boas-vindas:", error);
    return null;
  }
}

// Criar notificação quando usuário completa uma etapa do onboarding
export async function createOnboardingStepCompletedNotification(
  userId: string,
  stepId: string,
  stepName: string
) {
  try {
    const stepMessages: Record<string, string> = {
      welcome: "Você deu o primeiro passo! Continue explorando o sistema.",
      company_setup:
        "Empresa configurada com sucesso! Agora você pode configurar os dados fiscais.",
      fiscal_setup:
        "Dados fiscais configurados! Hora de adicionar seus produtos.",
      first_product:
        "Primeiro produto cadastrado! Que tal adicionar um cliente agora?",
      first_customer:
        "Ótimo! Cliente cadastrado. Agora você pode criar sua primeira venda.",
      first_sale:
        "Parabéns pela primeira venda! Continue usando o sistema para explorar mais funcionalidades.",
      migration:
        "Dados migrados com sucesso! Seu histórico está pronto para uso.",
      integrations:
        "Integrações configuradas! Seu ERP está conectado com outras ferramentas.",
    };

    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "SUCCESS" as NotificationType,
        title: `Etapa concluída: ${stepName}`,
        message:
          stepMessages[stepId] ||
          "Parabéns! Você concluiu mais uma etapa do onboarding.",
        link: "/dashboard",
      },
    });

    return notification;
  } catch (error) {
    console.error(
      "Erro ao criar notificação de etapa de onboarding:",
      error
    );
    return null;
  }
}

// Criar notificação quando usuário completa todo o onboarding
export async function createOnboardingCompletedNotification(userId: string) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "SUCCESS" as NotificationType,
        title: "Onboarding Concluído! 🎉",
        message:
          "Parabéns! Você completou todas as etapas essenciais. Agora você está pronto para usar o Orion ERP com todo seu potencial!",
        link: "/dashboard",
      },
    });

    // Enviar email (não bloqueante - se falhar, notificação já foi criada)
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        await sendOnboardingCompletedEmail(
          user.email,
          user.name || "Usuário"
        );
        console.log(
          `[Notifications] Email de onboarding concluído enviado para: ${user.email}`
        );
      }
    } catch (emailError) {
      console.error(
        "Erro ao enviar email de onboarding concluído:",
        emailError
      );
      // Não falha a função - notificação já foi criada
    }

    return notification;
  } catch (error) {
    console.error(
      "Erro ao criar notificação de onboarding concluído:",
      error
    );
    return null;
  }
}

// Criar notificação quando uma venda é paga
export async function createSalePaidNotification(
  userId: string,
  saleId: string,
  orderNumber: string,
  amount: number,
  customerName: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: "PAYMENT" as NotificationType,
        title: `Nova venda paga - Pedido ${orderNumber}`,
        message: `Você recebeu o pagamento de R$ ${amount.toFixed(
          2
        )} do cliente ${customerName}. O pedido ${orderNumber} foi concluído com sucesso!`,
        link: `/dashboard/sales/${saleId}`,
      },
    });

    // Enviar email (não bloqueante - se falhar, notificação já foi criada)
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        await sendSalePaidEmail(
          user.email,
          user.name || "Usuário",
          orderNumber,
          amount,
          customerName
        );
        console.log(
          `[Notifications] Email de venda paga enviado para: ${user.email}`
        );
      }
    } catch (emailError) {
      console.error("Erro ao enviar email de venda paga:", emailError);
      // Não falha a função - notificação já foi criada
    }

    return notification;
  } catch (error) {
    console.error("Erro ao criar notificação de venda paga:", error);
    return null;
  }
}

// Criar notificação genérica para um usuário
export async function createGenericNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  sendEmail: boolean = false,
  sendPush: boolean = true
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      },
    });

    // Enviar web push (não bloqueante)
    if (sendPush) {
      try {
        await sendPushNotificationToUser(userId, {
          title,
          message,
          link,
        });
      } catch (pushError) {
        console.error("Erro ao enviar push notification:", pushError);
        // Não falha a função - notificação já foi criada
      }
    }

    // Enviar email se solicitado (não bloqueante)
    if (sendEmail) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, name: true },
        });

        if (user?.email) {
          await sendGenericNotificationEmail(
            user.email,
            user.name || "Usuário",
            title,
            message,
            link ? "Ver Detalhes" : undefined,
            link ? `${process.env.NEXT_PUBLIC_APP_URL}${link}` : undefined
          );
          console.log(
            `[Notifications] Email genérico enviado para: ${user.email}`
          );
        }
      } catch (emailError) {
        console.error("Erro ao enviar email genérico:", emailError);
        // Não falha a função - notificação já foi criada
      }
    }

    return notification;
  } catch (error) {
    console.error("Erro ao criar notificação genérica:", error);
    return null;
  }
}

// Criar notificação em massa para múltiplos usuários
export async function createBroadcastNotification(
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  link?: string,
  sendEmail: boolean = false,
  sendPush: boolean = true
) {
  try {
    const results = {
      total: userIds.length,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const userId of userIds) {
      try {
        await createGenericNotification(
          userId,
          type,
          title,
          message,
          link,
          sendEmail,
          sendPush
        );
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`User ${userId}: ${error.message}`);
      }
    }

    console.log(
      `[Notifications] Broadcast enviado para ${results.successful}/${results.total} usuários`
    );

    return results;
  } catch (error) {
    console.error("Erro ao criar notificação em massa:", error);
    throw error;
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
        name: true,
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
