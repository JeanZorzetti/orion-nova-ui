import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "Orion ERP <noreply@orion.roilabs.com.br>";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://orion.roilabs.com.br";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured. Email not sent:", { to, subject });
    return { success: false, error: "Email service not configured" };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

// Email: Confirmação de Cadastro
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const subject = "Bem-vindo à Orion Nova!";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 Bem-vindo à Orion Nova!</h1>
    </div>
    <div class="content">
      <p>Olá <strong>${name}</strong>,</p>

      <p>É um prazer tê-lo conosco! Sua conta foi criada com sucesso e você já pode começar a transformar a gestão da sua empresa.</p>

      <p>Com a Orion Nova, você terá acesso a:</p>
      <ul>
        <li>✅ Gestão completa de clientes e vendas</li>
        <li>✅ Controle financeiro inteligente</li>
        <li>✅ Gestão de estoque e produtos</li>
        <li>✅ Relatórios e dashboards em tempo real</li>
        <li>✅ Suporte especializado</li>
      </ul>

      <div style="text-align: center;">
        <a href="${BASE_URL}/dashboard" class="button">Acessar Dashboard</a>
      </div>

      <p>Precisa de ajuda? Visite nossa <a href="${BASE_URL}/ajuda">Central de Ajuda</a> ou entre em <a href="${BASE_URL}/contato">contato conosco</a>.</p>

      <p>Boas-vindas e bons negócios!<br>
      <strong>Equipe Orion Nova</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Orion Nova. Todos os direitos reservados.</p>
      <p>Você está recebendo este email porque criou uma conta em orion.roilabs.com.br</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}

// Email: Recuperação de Senha
export async function sendPasswordResetEmail({
  to,
  name,
  resetToken,
}: {
  to: string;
  name: string;
  resetToken: string;
}) {
  const resetUrl = `${BASE_URL}/redefinir-senha?token=${resetToken}`;
  const subject = "Recuperação de Senha - Orion Nova";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Recuperação de Senha</h1>
    </div>
    <div class="content">
      <p>Olá <strong>${name}</strong>,</p>

      <p>Recebemos uma solicitação para redefinir a senha da sua conta Orion Nova.</p>

      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Redefinir Minha Senha</a>
      </div>

      <div class="alert">
        <strong>⚠️ Importante:</strong> Este link expira em 1 hora por segurança.
      </div>

      <p>Se você não solicitou a recuperação de senha, ignore este email. Sua senha permanecerá inalterada.</p>

      <p>Por segurança, nunca compartilhe este link com outras pessoas.</p>

      <p>Atenciosamente,<br>
      <strong>Equipe Orion Nova</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Orion Nova. Todos os direitos reservados.</p>
      <p>Se você não conseguir clicar no botão, copie e cole este link no navegador:<br>
      <small>${resetUrl}</small></p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}

// Email: Confirmação de Pagamento
export async function sendPaymentConfirmationEmail({
  to,
  name,
  planName,
  amount,
  transactionId,
  billingPeriod,
}: {
  to: string;
  name: string;
  planName: string;
  amount: number;
  transactionId: string;
  billingPeriod: "MONTHLY" | "YEARLY";
}) {
  const subject = "Pagamento Confirmado - Orion Nova";
  const periodText = billingPeriod === "MONTHLY" ? "mensal" : "anual";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .summary { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .summary-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .summary-row:last-child { border-bottom: none; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Pagamento Confirmado!</h1>
    </div>
    <div class="content">
      <p>Olá <strong>${name}</strong>,</p>

      <p>Seu pagamento foi processado com sucesso! Obrigado por escolher a Orion Nova.</p>

      <div class="summary">
        <h3 style="margin-top: 0;">Resumo da Compra</h3>
        <div class="summary-row">
          <span>Plano:</span>
          <span><strong>${planName}</strong></span>
        </div>
        <div class="summary-row">
          <span>Período:</span>
          <span>${periodText}</span>
        </div>
        <div class="summary-row">
          <span>Valor:</span>
          <span>R$ ${amount.toFixed(2).replace(".", ",")}</span>
        </div>
        <div class="summary-row">
          <span>ID da Transação:</span>
          <span><small>${transactionId}</small></span>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${BASE_URL}/assinaturas" class="button">Ver Minha Assinatura</a>
      </div>

      <p>Sua assinatura está ativa e você tem acesso total a todos os recursos do plano <strong>${planName}</strong>.</p>

      <p>Precisa de ajuda? Nossa equipe de suporte está sempre disponível para você.</p>

      <p>Atenciosamente,<br>
      <strong>Equipe Orion Nova</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Orion Nova. Todos os direitos reservados.</p>
      <p>Este é um email transacional enviado para confirmar o seu pagamento.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}

// Email: Lembrete de Renovação
export async function sendRenewalReminderEmail({
  to,
  name,
  planName,
  renewalDate,
  amount,
}: {
  to: string;
  name: string;
  planName: string;
  renewalDate: Date;
  amount: number;
}) {
  const subject = "Lembrete: Renovação da Assinatura - Orion Nova";
  const formattedDate = renewalDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .highlight { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Lembrete de Renovação</h1>
    </div>
    <div class="content">
      <p>Olá <strong>${name}</strong>,</p>

      <p>Este é um lembrete de que sua assinatura do plano <strong>${planName}</strong> será renovada automaticamente em breve.</p>

      <div class="highlight">
        <p style="margin: 0;"><strong>Data de Renovação:</strong> ${formattedDate}</p>
        <p style="margin: 10px 0 0 0;"><strong>Valor:</strong> R$ ${amount.toFixed(2).replace(".", ",")}</p>
      </div>

      <p>O valor será cobrado automaticamente no método de pagamento cadastrado.</p>

      <div style="text-align: center;">
        <a href="${BASE_URL}/assinaturas" class="button">Gerenciar Assinatura</a>
      </div>

      <p>Se desejar atualizar seu método de pagamento ou fazer alterações em seu plano, acesse a área de assinaturas.</p>

      <p>Agradecemos por confiar na Orion Nova!</p>

      <p>Atenciosamente,<br>
      <strong>Equipe Orion Nova</strong></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Orion Nova. Todos os direitos reservados.</p>
      <p>Você está recebendo este email porque possui uma assinatura ativa.</p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}

// Email: Newsletter
export async function sendNewsletterEmail({
  to,
  subject,
  content,
}: {
  to: string[];
  subject: string;
  content: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📬 Orion Nova Newsletter</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Orion Nova. Todos os direitos reservados.</p>
      <p>Você está recebendo este email porque se inscreveu na nossa newsletter.</p>
      <p><a href="${BASE_URL}/newsletter/cancelar">Cancelar inscrição</a></p>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({ to, subject, html });
}
