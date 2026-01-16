# Roadmap: Sistema de Checkout e Pagamentos (Stripe)

**Fase:** 4 - Checkout e Pagamentos
**Prioridade:** 🟡 Alta
**Dependências:** Fase 2 (Autenticação), Fase 3 (Database)

---

## 🎯 Objetivo

Implementar sistema completo de checkout e pagamentos recorrentes usando Stripe, incluindo assinaturas, faturas, webhooks e gerenciamento de billing.

---

## 📦 Pacotes Necessários

```bash
npm install stripe
npm install @stripe/stripe-js
npm install @stripe/react-stripe-js
```

---

## 🗂️ Estrutura de Arquivos

```
src/
├── app/
│   ├── precos/
│   │   └── page.tsx              # Página de planos/preços
│   ├── checkout/
│   │   ├── page.tsx              # Página de checkout
│   │   ├── sucesso/
│   │   │   └── page.tsx          # Confirmação de pagamento
│   │   └── erro/
│   │       └── page.tsx          # Erro no pagamento
│   ├── assinaturas/
│   │   └── page.tsx              # Gerenciar assinatura
│   ├── faturas/
│   │   └── page.tsx              # Histórico de faturas
│   └── api/
│       ├── stripe/
│       │   ├── checkout/
│       │   │   └── route.ts      # Criar session de checkout
│       │   ├── portal/
│       │   │   └── route.ts      # Portal de billing do Stripe
│       │   ├── webhooks/
│       │   │   └── route.ts      # Webhooks do Stripe
│       │   └── plans/
│       │       └── route.ts      # Sincronizar planos
├── lib/
│   ├── stripe.ts                 # Cliente Stripe (server)
│   └── stripe-client.ts          # Cliente Stripe (client)
├── components/
│   ├── checkout/
│   │   ├── CheckoutForm.tsx      # Formulário de checkout
│   │   ├── PricingCard.tsx       # Card de plano
│   │   └── PaymentElement.tsx    # Elemento de pagamento
│   └── subscription/
│       ├── SubscriptionStatus.tsx
│       └── InvoiceList.tsx
└── webhooks/
    └── stripe-handlers.ts        # Handlers de webhooks
```

---

## 🔧 Implementação Passo a Passo

### PASSO 1: Configurar Stripe Account

#### 1.1 Criar conta Stripe
1. Criar conta em [stripe.com](https://stripe.com)
2. Ativar modo teste
3. Copiar API keys (Publishable e Secret)

#### 1.2 Configurar Produtos no Stripe Dashboard

**Criar 3 produtos:**

1. **Starter**
   - Preço: R$ 99,90/mês
   - Recurring: Monthly
   - Copiar Price ID

2. **Professional**
   - Preço: R$ 299,90/mês
   - Recurring: Monthly
   - Copiar Price ID

3. **Enterprise**
   - Preço: R$ 999,90/mês
   - Recurring: Monthly
   - Copiar Price ID

---

### PASSO 2: Setup Stripe SDK

#### 2.1 Criar `src/lib/stripe.ts` (Server-side)

```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não definida');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia', // Versão mais recente
  typescript: true,
});

// Helpers
export async function getStripeCustomerId(userId: string, email: string) {
  const { prisma } = await import('./prisma');

  // Buscar subscription existente com customerId
  const existingSub = await prisma.subscription.findFirst({
    where: {
      userId,
      stripeCustomerId: { not: null },
    },
    select: { stripeCustomerId: true },
  });

  if (existingSub?.stripeCustomerId) {
    return existingSub.stripeCustomerId;
  }

  // Criar novo customer no Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  return customer.id;
}
```

#### 2.2 Criar `src/lib/stripe-client.ts` (Client-side)

```typescript
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};
```

---

### PASSO 3: Criar Página de Preços

#### 3.1 Página `src/app/precos/page.tsx`

```typescript
import { prisma } from '@/lib/prisma';
import { PricingCard } from '@/components/checkout/PricingCard';

export default async function PrecosPage() {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' },
  });

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Escolha o plano ideal para sua empresa
          </h1>
          <p className="text-xl text-muted-foreground">
            Sem surpresas, sem taxas ocultas. Cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* FAQ, Comparativo, etc */}
      </div>
    </div>
  );
}
```

#### 3.2 Componente `src/components/checkout/PricingCard.tsx`

```typescript
"use client";

import { Plan } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface PricingCardProps {
  plan: Plan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const features = JSON.parse(plan.features as string) as string[];

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/login?callbackUrl=/precos');
      return;
    }

    // Criar checkout session
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: plan.id }),
    });

    const { url } = await response.json();
    if (url) {
      window.location.href = url;
    }
  };

  const isPopular = plan.slug === 'professional';

  return (
    <Card className={`relative ${isPopular ? 'border-primary shadow-lg scale-105' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Mais Popular
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">
            R$ {plan.price.toString()}
          </span>
          <span className="text-muted-foreground">/mês</span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubscribe}
          className="w-full"
          variant={isPopular ? 'default' : 'outline'}
        >
          Assinar {plan.name}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

### PASSO 4: Criar Checkout Session

#### 4.1 API Route `src/app/api/stripe/checkout/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe, getStripeCustomerId } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { planId } = await req.json();

    // Buscar plano
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.stripePriceId) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // Obter ou criar customer ID
    const customerId = await getStripeCustomerId(
      session.user.id,
      session.user.email!
    );

    // Criar checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/precos`,
      metadata: {
        userId: session.user.id,
        planId: plan.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar checkout' },
      { status: 500 }
    );
  }
}
```

---

### PASSO 5: Webhooks do Stripe

#### 5.1 API Route `src/app/api/stripe/webhooks/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import {
  handleCheckoutComplete,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
} from '@/webhooks/stripe-handlers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log('✅ Webhook recebido:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
```

#### 5.2 Handlers `src/webhooks/stripe-handlers.ts`

```typescript
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function handleCheckoutComplete(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    throw new Error('Missing metadata in checkout session');
  }

  // Criar registro de pedido
  await prisma.order.create({
    data: {
      userId,
      planId,
      amount: (session.amount_total || 0) / 100,
      status: 'SUCCEEDED',
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
    },
  });

  console.log('✅ Ordem criada para userId:', userId);
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    throw new Error('Missing userId in subscription metadata');
  }

  const plan = await prisma.plan.findFirst({
    where: { stripePriceId: subscription.items.data[0].price.id },
  });

  if (!plan) {
    throw new Error('Plan not found for price ID');
  }

  await prisma.subscription.create({
    data: {
      userId,
      planId: plan.id,
      status: 'ACTIVE',
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });

  console.log('✅ Assinatura criada:', subscription.id);
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status === 'active' ? 'ACTIVE' : 'CANCELED',
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log('✅ Assinatura atualizada:', subscription.id);
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });

  console.log('✅ Assinatura cancelada:', subscription.id);
}

export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
) {
  console.log('✅ Pagamento de fatura bem-sucedido:', invoice.id);
  // TODO: Enviar email de confirmação
}

export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
) {
  console.log('❌ Falha no pagamento da fatura:', invoice.id);
  // TODO: Enviar email de cobrança falhada
  // TODO: Atualizar status da assinatura
}
```

---

### PASSO 6: Testar Webhooks Localmente

#### 6.1 Instalar Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
# Download do binário em stripe.com/docs/stripe-cli
```

#### 6.2 Configurar Webhook Local

```bash
# Login no Stripe CLI
stripe login

# Redirecionar webhooks para localhost
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Stripe CLI irá mostrar o webhook signing secret
# Copiar para .env.local como STRIPE_WEBHOOK_SECRET
```

#### 6.3 Testar Checkout

```bash
# Trigger evento de teste
stripe trigger checkout.session.completed
```

---

### PASSO 7: Página de Gerenciamento de Assinatura

#### 7.1 Página `src/app/assinaturas/page.tsx`

```typescript
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function AssinaturasPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ['ACTIVE', 'TRIALING'] },
    },
    include: { plan: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!subscription) {
    return (
      <div className="min-h-screen p-8">
        <Card>
          <CardHeader>
            <CardTitle>Sem assinatura ativa</CardTitle>
            <CardDescription>
              Você não possui uma assinatura ativa no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/precos">Ver Planos</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Minha Assinatura</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{subscription.plan.name}</CardTitle>
              <CardDescription>Plano atual</CardDescription>
            </div>
            <Badge variant={subscription.status === 'ACTIVE' ? 'default' : 'secondary'}>
              {subscription.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="text-2xl font-bold">
                R$ {subscription.plan.price.toString()}/mês
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Próxima cobrança</p>
              <p className="text-lg font-semibold">
                {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <form action="/api/stripe/portal" method="POST">
              <Button type="submit">
                Gerenciar Assinatura
              </Button>
            </form>

            <Button variant="outline" asChild>
              <a href="/faturas">Ver Faturas</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 7.2 Portal de Billing `src/app/api/stripe/portal/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Buscar customer ID
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Assinatura não encontrada' },
        { status: 404 }
      );
    }

    // Criar portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/assinaturas`,
    });

    return NextResponse.redirect(portalSession.url);
  } catch (error) {
    console.error('Portal error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar portal' },
      { status: 500 }
    );
  }
}
```

---

## ✅ Checklist de Implementação

### Setup Stripe
- [ ] Criar conta Stripe
- [ ] Criar produtos e preços
- [ ] Copiar API keys
- [ ] Configurar webhook endpoint

### Backend
- [ ] Configurar Stripe SDK
- [ ] Criar API de checkout session
- [ ] Implementar webhooks
- [ ] Criar handlers de eventos
- [ ] Testar webhooks localmente

### Frontend
- [ ] Criar página de preços
- [ ] Criar componente PricingCard
- [ ] Criar página de checkout
- [ ] Implementar página de sucesso
- [ ] Implementar página de erro

### Gerenciamento
- [ ] Criar página de assinaturas
- [ ] Implementar portal de billing
- [ ] Criar página de faturas
- [ ] Testar upgrade/downgrade
- [ ] Testar cancelamento

### Testes
- [ ] Testar fluxo completo de checkout
- [ ] Testar webhooks em produção
- [ ] Testar cenários de erro
- [ ] Validar segurança

---

## 🔒 Segurança

1. **Webhook Signature**: Sempre validar signature dos webhooks
2. **Idempotência**: Webhooks podem ser enviados múltiplas vezes
3. **HTTPS**: Obrigatório em produção
4. **PCI Compliance**: Nunca processar dados de cartão diretamente

---

## 📚 Recursos

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

---

**Status:** 📝 Pronto para implementação
**Última atualização:** 16/01/2026
