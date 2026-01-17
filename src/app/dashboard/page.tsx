import { auth } from "@/lib/auth";
import RevenueChart from "@/components/RevenueChart";
import AIInsightsCard from "@/components/AIInsightsCard";
import RecentTasksCard from "@/components/RecentTasksCard";
import SystemStatusCard from "@/components/SystemStatusCard";

export default async function DashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "Usuário";

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Bem-vindo de volta, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Aqui está um resumo do seu negócio hoje.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Revenue Chart - Large */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8 min-h-[400px]">
          <RevenueChart />
        </div>

        {/* AI Insights - Medium */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-5 xl:col-span-4 min-h-[400px]">
          <AIInsightsCard />
        </div>

        {/* Recent Tasks - Medium */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-7 min-h-[280px]">
          <RecentTasksCard />
        </div>

        {/* System Status - Small */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-5 min-h-[280px]">
          <SystemStatusCard />
        </div>
      </div>
    </>
  );
}
