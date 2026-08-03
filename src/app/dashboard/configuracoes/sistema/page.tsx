"use client";

import { useSession } from "next-auth/react";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SampleDataManager } from "@/components/sample-data-manager";
import { OnboardingControl } from "@/components/onboarding-control";

export default function SistemaConfigPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-3xl space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Sistema</h1>
            <p className="text-sm text-muted-foreground">
              Configurações gerais do sistema
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Tipo de Conta</Label>
            <div className="mt-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {session?.user?.role === "ADMIN" ? "Administrador" : "Usuário"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.role === "ADMIN"
                      ? "Acesso completo ao sistema"
                      : "Acesso aos módulos principais"}
                  </p>
                </div>
                <Badge variant={session?.user?.role === "ADMIN" ? "default" : "secondary"}>
                  {session?.user?.role || "USER"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="font-medium mb-2">Informações do Sistema</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versão:</span>
                <span className="font-medium">1.0.0 MVP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última atualização:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial */}
      <OnboardingControl />

      {/* Dados de Exemplo */}
      <SampleDataManager />
    </div>
  );
}
