import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  CreditCard,
  DollarSign,
  FileText,
  HeadphonesIcon,
  TrendingUp,
  Package,
  Activity,
} from "lucide-react";

export default async function AdminDashboardPage() {
  // Buscar estatísticas
  const [
    totalUsers,
    activeSubscriptions,
    totalOrders,
    openTickets,
    publishedPosts,
    activePlans,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({
      where: { status: "ACTIVE" },
    }),
    prisma.order.count({
      where: { status: "SUCCEEDED" },
    }),
    prisma.supportTicket.count({
      where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.post.count({
      where: { status: "PUBLISHED" },
    }),
    prisma.plan.count({
      where: { isActive: true },
    }),
  ]);

  // Calcular receita total (soma dos pedidos bem-sucedidos)
  const ordersRevenue = await prisma.order.aggregate({
    where: { status: "SUCCEEDED" },
    _sum: { amount: true },
  });

  const totalRevenue = Number(ordersRevenue._sum.amount || 0);

  // Buscar usuários recentes
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      subscriptionStatus: true,
      createdAt: true,
    },
  });

  // Buscar tickets recentes
  const recentTickets = await prisma.supportTicket.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const stats = [
    {
      title: "Total de Usuários",
      value: totalUsers,
      icon: Users,
      description: "Usuários cadastrados",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Assinaturas Ativas",
      value: activeSubscriptions,
      icon: CreditCard,
      description: "Clientes pagantes",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Receita Total",
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      description: "Pedidos confirmados",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Tickets Abertos",
      value: openTickets,
      icon: HeadphonesIcon,
      description: "Aguardando atendimento",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Posts Publicados",
      value: publishedPosts,
      icon: FileText,
      description: "Conteúdo ativo",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Planos Ativos",
      value: activePlans,
      icon: Package,
      description: "Disponíveis para venda",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const roleLabels: Record<string, string> = {
    USER: "Usuário",
    ADMIN: "Admin",
    SUPER_ADMIN: "Super Admin",
  };

  const statusLabels: Record<string, string> = {
    TRIAL: "Trial",
    ACTIVE: "Ativo",
    EXPIRED: "Expirado",
    CANCELLED: "Cancelado",
  };

  const ticketStatusLabels: Record<string, string> = {
    OPEN: "Aberto",
    IN_PROGRESS: "Em Progresso",
    WAITING_CUSTOMER: "Aguardando Cliente",
    RESOLVED: "Resolvido",
    CLOSED: "Fechado",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema e métricas principais
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Usuários Recentes
            </CardTitle>
            <CardDescription>Últimos 5 cadastros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant="outline" className="text-xs">
                      {roleLabels[user.role]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeadphonesIcon className="h-5 w-5" />
              Tickets Recentes
            </CardTitle>
            <CardDescription>Últimos 5 tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-start justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.user.name}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge
                      variant={
                        ticket.status === "OPEN"
                          ? "destructive"
                          : ticket.status === "RESOLVED"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {ticketStatusLabels[ticket.status]}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(ticket.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo Rápido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
              <p className="text-2xl font-bold">
                {totalUsers > 0
                  ? ((activeSubscriptions / totalUsers) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Ticket Médio (MRR)
              </p>
              <p className="text-2xl font-bold">
                R${" "}
                {activeSubscriptions > 0
                  ? (totalRevenue / activeSubscriptions).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pedidos Totais</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Receita por Usuário
              </p>
              <p className="text-2xl font-bold">
                R$ {totalUsers > 0 ? (totalRevenue / totalUsers).toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
