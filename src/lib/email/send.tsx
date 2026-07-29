import { getResend, FROM_EMAIL, isResendConfigured } from "./resend";
import {
  TrialExpiringEmail,
  TrialExpiredEmail,
  WelcomeEmail,
  OnboardingCompletedEmail,
  SalePaidEmail,
  GenericNotificationEmail,
} from "./templates";

interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
}

// Função genérica para enviar email
export async function sendEmail({ to, subject, react }: SendEmailParams) {
  // Se Resend não está configurado, apenas log
  if (!isResendConfigured()) {
    console.log(`[Email] Resend não configurado. Email não enviado para: ${to}`);
    console.log(`[Email] Assunto: ${subject}`);
    return { success: false, error: "Resend not configured" };
  }

  try {
    const data = await getResend().emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      react,
    });

    console.log(`[Email] Email enviado com sucesso para: ${to}`);
    return { success: true, data };
  } catch (error: any) {
    console.error(`[Email] Erro ao enviar email para ${to}:`, error);
    return { success: false, error: error.message };
  }
}

// Enviar email de trial expirando
export async function sendTrialExpiringEmail(
  to: string,
  userName: string,
  daysRemaining: number
) {
  return sendEmail({
    to,
    subject: `Seu trial do Orion ERP expira em ${daysRemaining} dias`,
    react: <TrialExpiringEmail userName={userName} daysRemaining={daysRemaining} />,
  });
}

// Enviar email de trial expirado
export async function sendTrialExpiredEmail(to: string, userName: string) {
  return sendEmail({
    to,
    subject: "Seu trial do Orion ERP expirou",
    react: <TrialExpiredEmail userName={userName} />,
  });
}

// Enviar email de boas-vindas
export async function sendWelcomeEmail(to: string, userName: string) {
  return sendEmail({
    to,
    subject: "Bem-vindo ao Orion ERP!",
    react: <WelcomeEmail userName={userName} />,
  });
}

// Enviar email de onboarding concluído
export async function sendOnboardingCompletedEmail(to: string, userName: string) {
  return sendEmail({
    to,
    subject: "Parabéns! Você concluiu o onboarding do Orion ERP",
    react: <OnboardingCompletedEmail userName={userName} />,
  });
}

// Enviar email de venda paga
export async function sendSalePaidEmail(
  to: string,
  userName: string,
  orderNumber: string,
  amount: number,
  customerName: string
) {
  return sendEmail({
    to,
    subject: `Nova venda paga - Pedido ${orderNumber}`,
    react: (
      <SalePaidEmail
        userName={userName}
        orderNumber={orderNumber}
        amount={amount}
        customerName={customerName}
      />
    ),
  });
}

// Enviar email genérico de notificação
export async function sendGenericNotificationEmail(
  to: string,
  userName: string,
  title: string,
  message: string,
  ctaText?: string,
  ctaUrl?: string
) {
  return sendEmail({
    to,
    subject: title,
    react: (
      <GenericNotificationEmail
        userName={userName}
        title={title}
        message={message}
        ctaText={ctaText}
        ctaUrl={ctaUrl}
      />
    ),
  });
}
