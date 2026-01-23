import * as React from "react";

// Template base para emails
interface EmailTemplateProps {
  title: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const BaseEmailTemplate: React.FC<EmailTemplateProps> = ({
  title,
  content,
  ctaText,
  ctaUrl,
}) => (
  <html>
    <head>
      <meta charSet="utf-8" />
    </head>
    <body style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6, color: "#333" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", padding: "20px 0", borderBottom: "2px solid #0066cc" }}>
          <h1 style={{ color: "#0066cc", margin: 0 }}>Orion ERP</h1>
        </div>

        {/* Content */}
        <div style={{ padding: "30px 0" }}>
          <h2 style={{ color: "#333", marginBottom: "20px" }}>{title}</h2>
          <div style={{ marginBottom: "30px", whiteSpace: "pre-line" }}>
            {content}
          </div>

          {/* CTA Button */}
          {ctaText && ctaUrl && (
            <div style={{ textAlign: "center", margin: "30px 0" }}>
              <a
                href={ctaUrl}
                style={{
                  display: "inline-block",
                  padding: "12px 30px",
                  backgroundColor: "#0066cc",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                {ctaText}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 0",
            borderTop: "1px solid #ddd",
            textAlign: "center",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <p>© 2026 Orion ERP. Todos os direitos reservados.</p>
          <p>
            <a href="https://orion-erp.com/ajuda" style={{ color: "#0066cc" }}>
              Central de Ajuda
            </a>
            {" | "}
            <a href="https://orion-erp.com/privacidade" style={{ color: "#0066cc" }}>
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </body>
  </html>
);

// Template para trial expirando
export const TrialExpiringEmail: React.FC<{ daysRemaining: number; userName: string }> = ({
  daysRemaining,
  userName,
}) => (
  <BaseEmailTemplate
    title={`Seu trial expira em ${daysRemaining} dias`}
    content={`Olá ${userName},

Seu período de teste do Orion ERP está chegando ao fim em ${daysRemaining} dias.

Para continuar aproveitando todas as funcionalidades sem interrupções, escolha um plano que se encaixe perfeitamente nas necessidades do seu negócio.

Benefícios de assinar agora:
• Acesso ilimitado a todas as funcionalidades
• Suporte prioritário da nossa equipe
• Dados sempre seguros e disponíveis
• Atualizações e melhorias contínuas

Não perca o progresso que você já fez!`}
    ctaText="Ver Planos"
    ctaUrl="https://orion-erp.com/precos"
  />
);

// Template para trial expirado
export const TrialExpiredEmail: React.FC<{ userName: string }> = ({ userName }) => (
  <BaseEmailTemplate
    title="Seu trial expirou"
    content={`Olá ${userName},

Seu período de teste de 30 dias do Orion ERP terminou.

Sentimos sua falta! Para continuar gerenciando seu negócio com eficiência, assine um de nossos planos.

Escolha o plano ideal para você:
• Starter: R$ 89/mês - Para quem está começando
• Professional: R$ 249/mês - Para empresas em crescimento
• Enterprise: R$ 599/mês - Solução completa

Seus dados estão seguros e você pode reativar sua conta a qualquer momento.`}
    ctaText="Assinar Agora"
    ctaUrl="https://orion-erp.com/precos"
  />
);

// Template de boas-vindas
export const WelcomeEmail: React.FC<{ userName: string }> = ({ userName }) => (
  <BaseEmailTemplate
    title={`Bem-vindo ao Orion ERP, ${userName}!`}
    content={`Olá ${userName},

Estamos muito felizes em ter você conosco!

Você acaba de iniciar seu trial gratuito de 30 dias com acesso completo a todas as funcionalidades do Orion ERP.

Próximos passos:
1. Configure os dados da sua empresa
2. Cadastre seus primeiros produtos
3. Adicione seus clientes
4. Crie sua primeira venda

Nossa equipe está aqui para ajudar você em cada etapa. Se tiver dúvidas, nossa central de ajuda está sempre disponível.

Vamos começar?`}
    ctaText="Acessar Dashboard"
    ctaUrl="https://orion-erp.com/dashboard"
  />
);

// Template para onboarding concluído
export const OnboardingCompletedEmail: React.FC<{ userName: string }> = ({ userName }) => (
  <BaseEmailTemplate
    title="Parabéns! Você concluiu o onboarding"
    content={`Olá ${userName},

Você completou todos os passos iniciais do Orion ERP! 🎉

Agora você está pronto para aproveitar ao máximo todas as funcionalidades:
• Gestão completa de vendas
• Controle de estoque em tempo real
• Relatórios e análises com IA
• Emissão de notas fiscais
• E muito mais!

Continue explorando e não hesite em entrar em contato se precisar de ajuda.`}
    ctaText="Ir para Dashboard"
    ctaUrl="https://orion-erp.com/dashboard"
  />
);

// Template para venda paga
export const SalePaidEmail: React.FC<{
  userName: string;
  orderNumber: string;
  amount: number;
  customerName: string;
}> = ({ userName, orderNumber, amount, customerName }) => (
  <BaseEmailTemplate
    title="Nova venda paga!"
    content={`Olá ${userName},

Ótimas notícias! Uma venda foi paga com sucesso.

Detalhes da venda:
• Pedido: ${orderNumber}
• Cliente: ${customerName}
• Valor: ${new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount)}

O pagamento foi confirmado e você pode emitir a nota fiscal.`}
    ctaText="Ver Detalhes"
    ctaUrl={`https://orion-erp.com/dashboard/vendas/${orderNumber}`}
  />
);

// Template genérico para notificações
export const GenericNotificationEmail: React.FC<{
  userName: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}> = ({ userName, title, message, ctaText, ctaUrl }) => (
  <BaseEmailTemplate
    title={title}
    content={`Olá ${userName},

${message}`}
    ctaText={ctaText}
    ctaUrl={ctaUrl}
  />
);
