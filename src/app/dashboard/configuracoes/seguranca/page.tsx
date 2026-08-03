"use client";

import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SegurancaConfigPage() {
  return (
    <div className="max-w-3xl">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-lg">
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Segurança</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie a segurança da sua conta
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="font-medium mb-2">Alterar Senha</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Recomendamos alterar sua senha regularmente
            </p>
            <Button variant="outline">Alterar Senha</Button>
          </div>

          <Separator />

          <div>
            <h2 className="font-medium mb-2">Sessões Ativas</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Você está conectado em 1 dispositivo
            </p>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sessão Atual</p>
                  <p className="text-sm text-muted-foreground">
                    Windows • Chrome
                  </p>
                </div>
                <Badge variant="default">Ativo</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
