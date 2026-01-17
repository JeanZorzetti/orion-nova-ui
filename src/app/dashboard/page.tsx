import { auth } from "@/lib/auth";
import DashboardStats from "@/components/dashboard/DashboardStats";

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

      {/* Dashboard Stats Component */}
      <DashboardStats />
    </>
  );
}
