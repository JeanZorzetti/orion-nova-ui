import webpush from "web-push";
import { prisma } from "./prisma";

// Configurar VAPID com as chaves do .env
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const email = process.env.VAPID_EMAIL || "mailto:contato@orion-erp.com";

if (publicKey && privateKey) {
  webpush.setVapidDetails(email, publicKey, privateKey);
}

export function isWebPushConfigured() {
  return !!publicKey && !!privateKey;
}

export function getPublicKey() {
  return publicKey;
}

// Enviar notificação push para um usuário específico
export async function sendPushNotificationToUser(
  userId: string,
  notification: {
    title: string;
    message: string;
    link?: string;
    icon?: string;
    badge?: string;
  }
) {
  if (!isWebPushConfigured()) {
    console.log("[Web Push] Não configurado. Notificação não enviada.");
    return { success: false, error: "Web Push not configured" };
  }

  try {
    // Buscar todas as subscrições do usuário
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
      console.log(`[Web Push] Usuário ${userId} não tem subscrições ativas`);
      return { success: false, error: "No subscriptions found" };
    }

    const payload = JSON.stringify({
      title: notification.title,
      body: notification.message,
      message: notification.message, // Compatibilidade
      icon: notification.icon || "/logo.png",
      badge: notification.badge || "/logo-badge.png",
      data: {
        link: notification.link || "/dashboard",
        tag: "orion-notification",
      },
    });

    const results = {
      total: subscriptions.length,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Enviar para todas as subscrições do usuário
    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Subscription ${sub.id}: ${error.message}`);

        // Se a subscrição está inválida (410 Gone), deletar do banco
        if (error.statusCode === 410) {
          console.log(
            `[Web Push] Subscrição ${sub.id} expirada, removendo do banco`
          );
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
      }
    }

    console.log(
      `[Web Push] Enviado para ${results.successful}/${results.total} subscrições do usuário ${userId}`
    );

    return { success: true, results };
  } catch (error: any) {
    console.error(`[Web Push] Erro ao enviar notificação:`, error);
    return { success: false, error: error.message };
  }
}

// Enviar notificação push para múltiplos usuários
export async function sendPushNotificationToMultipleUsers(
  userIds: string[],
  notification: {
    title: string;
    message: string;
    link?: string;
    icon?: string;
    badge?: string;
  }
) {
  if (!isWebPushConfigured()) {
    console.log("[Web Push] Não configurado. Notificações não enviadas.");
    return { success: false, error: "Web Push not configured" };
  }

  const results = {
    total: userIds.length,
    successful: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const userId of userIds) {
    try {
      const result = await sendPushNotificationToUser(userId, notification);
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push(`User ${userId}: ${result.error}`);
      }
    } catch (error: any) {
      results.failed++;
      results.errors.push(`User ${userId}: ${error.message}`);
    }
  }

  console.log(
    `[Web Push] Broadcast enviado para ${results.successful}/${results.total} usuários`
  );

  return { success: true, results };
}
