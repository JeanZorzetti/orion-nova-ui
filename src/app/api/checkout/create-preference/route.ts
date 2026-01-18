import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

// POST /api/checkout/create-preference - Criar preferência de pagamento
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: "ID do plano é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar plano
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: "Plano não encontrado ou inativo" },
        { status: 404 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Criar pedido no banco de dados
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        planId: plan.id,
        amount: plan.price,
        status: "PENDING",
      },
    });

    // Criar preferência no Mercado Pago
    const preference = new Preference(client);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const preferenceData = await preference.create({
      body: {
        items: [
          {
            id: plan.id,
            title: `Plano ${plan.name} - Orion ERP`,
            description: plan.description || `Assinatura do plano ${plan.name}`,
            quantity: 1,
            unit_price: Number(plan.price),
            currency_id: "BRL",
          },
        ],
        payer: {
          name: user.name || "",
          email: user.email,
        },
        back_urls: {
          success: `${appUrl}/checkout/sucesso?order_id=${order.id}`,
          failure: `${appUrl}/checkout/erro?order_id=${order.id}`,
          pending: `${appUrl}/checkout/sucesso?order_id=${order.id}&status=pending`,
        },
        auto_return: "approved",
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        external_reference: order.id,
        metadata: {
          order_id: order.id,
          user_id: session.user.id,
          plan_id: plan.id,
        },
      },
    });

    // Atualizar pedido com preference_id
    await prisma.order.update({
      where: { id: order.id },
      data: {
        mercadoPagoPreferenceId: preferenceData.id,
      },
    });

    return NextResponse.json({
      preferenceId: preferenceData.id,
      initPoint: preferenceData.init_point,
      sandboxInitPoint: preferenceData.sandbox_init_point,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
