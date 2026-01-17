import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CreditCard,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Rocket,
} from "lucide-react";
import { CancelSubscriptionButton } from "./cancel-button";

const statusConfig = {
  ACTIVE: {
    label: "Ativa",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-500",
  },
  CANCELED: {
    label: "Cancelada",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-red-500",
  },
  PAST_DUE: {
    label: "Pagamento Atrasado",
    variant: "destructive" as const,
    icon: AlertCircle,
    color: "text-red-500",
  },
  UNPAID: {
    label: "Não Pago",
    variant: "secondary" as const,
    icon: AlertCircle,
    color: "text-yellow-500",
  },
  TRIALING: {
    label: "Período de Teste",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-blue-500",
  },
};

export default async function AssinaturasPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/assinaturas");
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatPrice = (price: number | any) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(price));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/perfil">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Perfil
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Minhas Assinaturas</h1>
          <div className="w-32" />
        </div>

        {subscription ? (
          <div className="space-y-6">
            {/* Subscription Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      Plano {subscription.plan.name}
                    </CardTitle>
                    <CardDescription>
                      {subscription.plan.description}
                    </CardDescription>
                  </div>
                  <Badge variant={statusConfig[subscription.status].variant}>
                    {statusConfig[subscription.status].label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="font-medium">Valor mensal</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {formatPrice(subscription.plan.price)}
                  </span>
                </div>

                <Separator />

                {/* Dates */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <Calendar className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Início do período
                      </p>
                      <p className="font-medium">
                        {formatDate(subscription.currentPeriodStart)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Próxima cobrança
                      </p>
                      <p className="font-medium">
                        {formatDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                {subscription.plan.features && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">
                        Recursos do seu plano
                      </h3>
                      <ul className="grid gap-2 md:grid-cols-2">
                        {(
                          JSON.parse(
                            subscription.plan.features as string
                          ) as string[]
                        ).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Cancel warning */}
                {subscription.cancelAtPeriodEnd && (
                  <>
                    <Separator />
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-500">
                            Cancelamento agendado
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Sua assinatura será cancelada em{" "}
                            {formatDate(subscription.currentPeriodEnd)}. Você
                            ainda terá acesso até essa data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/precos" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Mudar de plano
                    </Button>
                  </Link>

                  {subscription.status === "ACTIVE" &&
                    !subscription.cancelAtPeriodEnd && (
                      <CancelSubscriptionButton
                        subscriptionId={subscription.id}
                      />
                    )}
                </div>
              </CardContent>
            </Card>

            {/* Payment History placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
                <CardDescription>
                  Seus últimos pagamentos e faturas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  O histórico de pagamentos estará disponível em breve.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* No subscription */
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-full bg-muted mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Você não tem assinatura ativa
              </h2>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Escolha um plano e comece a usar todos os recursos do Orion
                hoje mesmo.
              </p>
              <Link href="/precos">
                <Button size="lg">
                  <Rocket className="mr-2 h-4 w-4" />
                  Ver planos disponíveis
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
