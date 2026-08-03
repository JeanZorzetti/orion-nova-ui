import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="glass-card max-w-md mx-auto mt-12 p-10 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground">
        <Compass className="h-7 w-7" />
      </div>
      <p className="text-sm font-medium text-primary mb-2">Erro 404</p>
      <h1 className="text-2xl font-semibold mb-3">Página não encontrada</h1>
      <p className="text-muted-foreground mb-8">
        Esta tela do sistema não existe ou foi movida.
      </p>
      <Link href="/dashboard">
        <Button className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o dashboard
        </Button>
      </Link>
    </div>
  );
}
