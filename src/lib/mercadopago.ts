import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  },
});

// Instâncias dos recursos
export const preference = new Preference(client);
export const payment = new Payment(client);

// Tipos
export interface CreatePreferenceData {
  planId: string;
  planName: string;
  planPrice: number;
  userId: string;
  userEmail: string;
}

// Criar preferência de pagamento (checkout)
export async function createCheckoutPreference(data: CreatePreferenceData) {
  const { planId, planName, planPrice, userId, userEmail } = data;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const preferenceData = await preference.create({
    body: {
      items: [
        {
          id: planId,
          title: `Plano ${planName} - Orion`,
          description: `Assinatura mensal do plano ${planName}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: planPrice,
        },
      ],
      payer: {
        email: userEmail,
      },
      back_urls: {
        success: `${baseUrl}/checkout/sucesso`,
        failure: `${baseUrl}/checkout/erro`,
        pending: `${baseUrl}/checkout/pendente`,
      },
      auto_return: "approved",
      external_reference: JSON.stringify({
        userId,
        planId,
      }),
      notification_url: `${baseUrl}/api/mercadopago/webhooks`,
      statement_descriptor: "ORION",
    },
  });

  return preferenceData;
}

// Buscar informações de um pagamento
export async function getPaymentInfo(paymentId: string) {
  const paymentInfo = await payment.get({ id: paymentId });
  return paymentInfo;
}

// Planos disponíveis com preços
export const PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 99.9,
    description: "Perfeito para começar",
    features: [
      "Até 5 usuários",
      "10GB de armazenamento",
      "Suporte por email",
      "Dashboard básico",
    ],
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 299.9,
    description: "Para empresas em crescimento",
    features: [
      "Até 25 usuários",
      "100GB de armazenamento",
      "Suporte prioritário",
      "Relatórios avançados",
      "API access",
      "Integrações premium",
    ],
    popular: true,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 999.9,
    description: "Solução completa para grandes empresas",
    features: [
      "Usuários ilimitados",
      "1TB de armazenamento",
      "Suporte 24/7",
      "Gerente de conta dedicado",
      "SLA 99.9%",
      "Customizações",
      "Treinamento incluso",
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
