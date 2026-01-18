import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

// POST /api/webhooks/mercadopago - Webhook do Mercado Pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Webhook recebido:", body);

    // Mercado Pago envia notificações com diferentes tipos
    const { type, data } = body;

    // Processar apenas notificações de pagamento
    if (type === "payment") {
      const paymentId = data.id;

      // Buscar informações do pagamento no Mercado Pago
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      console.log("Informações do pagamento:", paymentInfo);

      const externalReference = paymentInfo.external_reference;
      const status = paymentInfo.status;

      if (!externalReference) {
        console.error("External reference não encontrada");
        return NextResponse.json({ received: true });
      }

      // Buscar pedido no banco de dados
      const order = await prisma.order.findUnique({
        where: { id: externalReference },
        include: {
          user: true,
          plan: true,
        },
      });

      if (!order) {
        console.error("Pedido não encontrado:", externalReference);
        return NextResponse.json({ received: true });
      }

      // Atualizar pedido com informações do pagamento
      await prisma.order.update({
        where: { id: order.id },
        data: {
          mercadoPagoPaymentId: paymentId.toString(),
          status:
            status === "approved"
              ? "SUCCEEDED"
              : status === "pending"
              ? "PROCESSING"
              : status === "rejected"
              ? "FAILED"
              : "PENDING",
          paidAt: status === "approved" ? new Date() : null,
        },
      });

      // Se o pagamento foi aprovado, criar/ativar assinatura
      if (status === "approved") {
        // Verificar se já existe assinatura ativa
        const existingSubscription = await prisma.subscription.findFirst({
          where: {
            userId: order.userId,
            status: "ACTIVE",
          },
        });

        if (existingSubscription) {
          // Atualizar assinatura existente
          await prisma.subscription.update({
            where: { id: existingSubscription.id },
            data: {
              planId: order.planId,
              mercadoPagoPaymentId: paymentId.toString(),
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ), // 30 dias
            },
          });
        } else {
          // Criar nova assinatura
          await prisma.subscription.create({
            data: {
              userId: order.userId,
              planId: order.planId,
              status: "ACTIVE",
              mercadoPagoPaymentId: paymentId.toString(),
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ), // 30 dias
            },
          });
        }

        // Atualizar status do usuário
        await prisma.user.update({
          where: { id: order.userId },
          data: {
            subscriptionStatus: "ACTIVE",
          },
        });

        console.log("Assinatura ativada para o usuário:", order.userId);
      }

      // Se o pagamento foi rejeitado
      if (status === "rejected" || status === "cancelled") {
        console.log("Pagamento rejeitado/cancelado para o pedido:", order.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    // Sempre retornar 200 para o Mercado Pago não reenviar
    return NextResponse.json({ received: true, error: "Internal error" });
  }
}

// GET - Para validação do webhook pelo Mercado Pago
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: "Webhook ativo" });
}
