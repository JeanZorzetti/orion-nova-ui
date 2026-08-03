import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="glass-card max-w-md w-full p-10 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-primary-foreground">
          <Compass className="h-7 w-7" />
        </div>
        <p className="text-sm font-medium text-primary mb-2">Erro 404</p>
        <h1 className="text-2xl font-semibold mb-3">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          O endereço que você acessou não existe ou foi movido.
        </p>
        <Link href="/">
          <Button className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a home
          </Button>
        </Link>
      </div>
    </div>
  );
}
