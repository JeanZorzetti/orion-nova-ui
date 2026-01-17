import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentInfo } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar tipo de notificação
    if (body.type === "payment") {
      const paymentId = body.data?.id;

      if (!paymentId) {
        return NextResponse.json({ error: "Payment ID não encontrado" }, { status: 400 });
      }

      // Buscar informações do pagamento
      const paymentInfo = await getPaymentInfo(paymentId.toString()) as any;

      if (!paymentInfo) {
        return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
      }

      // Extrair dados da referência externa
      let externalReference;
      try {
        externalReference = JSON.parse(paymentInfo.external_reference || "{}");
      } catch {
        externalReference = {};
      }

      const { userId, planId } = externalReference;

      // Atualizar order - buscar pelo external_reference que contém os dados do usuário/plano
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { mercadoPagoPaymentId: paymentId.toString() },
            {
              userId: userId || undefined,
              planId: planId || undefined,
              status: "PENDING"
            }
          ]
        },
      });

      if (order) {
        // Determinar status baseado no status do pagamento
        let orderStatus: "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED" | "REFUNDED" = "PENDING";

        switch (paymentInfo.status) {
          case "approved":
            orderStatus = "SUCCEEDED";
            break;
          case "pending":
          case "in_process":
            orderStatus = "PROCESSING";
            break;
          case "rejected":
          case "cancelled":
            orderStatus = "FAILED";
            break;
          case "refunded":
            orderStatus = "REFUNDED";
            break;
        }

        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: orderStatus,
            mercadoPagoPaymentId: paymentId.toString(),
            paymentMethod: paymentInfo.payment_method_id || null,
            paidAt: orderStatus === "SUCCEEDED" ? new Date() : null,
          },
        });

        // Se pagamento aprovado, criar/atualizar assinatura
        if (paymentInfo.status === "approved" && userId && planId) {
          const existingSubscription = await prisma.subscription.findFirst({
            where: {
              userId,
              status: "ACTIVE",
            },
          });

          if (!existingSubscription) {
            // Criar nova assinatura
            const now = new Date();
            const periodEnd = new Date();
            periodEnd.setMonth(periodEnd.getMonth() + 1); // +1 mês

            await prisma.subscription.create({
              data: {
                userId,
                planId,
                status: "ACTIVE",
                currentPeriodStart: now,
                currentPeriodEnd: periodEnd,
                mercadoPagoPaymentId: paymentId.toString(),
                mercadoPagoPayerId: paymentInfo.payer?.id?.toString() || null,
              },
            });
          }
        }
      }

      return NextResponse.json({ success: true });
    }

    // Outros tipos de webhook
    return NextResponse.json({ success: true, message: "Webhook recebido" });
  } catch (error) {
    console.error("Erro no webhook do Mercado Pago:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

// Mercado Pago envia webhooks como GET para verificação
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
