import DashboardSidebar from "@/components/DashboardSidebar";
import SearchCommand from "@/components/SearchCommand";
import RevenueChart from "@/components/RevenueChart";
import AIInsightsCard from "@/components/AIInsightsCard";
import RecentTasksCard from "@/components/RecentTasksCard";
import SystemStatusCard from "@/components/SystemStatusCard";
import { Bell, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="px-8 py-5 border-b border-border flex items-center gap-6">
          <div className="flex-1">
            <SearchCommand />
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Bem-vindo de volta, <span className="gradient-text">João</span>
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
        </div>
      </main>
    </div>
  );
};

export default Index;
