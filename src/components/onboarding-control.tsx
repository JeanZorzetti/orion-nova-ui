"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, RotateCcw } from "lucide-react";

export function OnboardingControl() {
  const handleRestartTutorial = () => {
    localStorage.removeItem("orion-onboarding-seen");
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Tutorial do Sistema
        </CardTitle>
        <CardDescription>
          Reveja o tour guiado do Orion ERP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          O tutorial interativo apresenta os principais recursos do sistema em 4 etapas:
        </p>

        <ul className="text-sm text-muted-foreground space-y-2 ml-4">
          <li>• <strong>Bem-vindo:</strong> Visão geral dos módulos</li>
          <li>• <strong>IA Integrada:</strong> Como usar a Orion AI</li>
          <li>• <strong>Dados de Exemplo:</strong> Explorar o sistema com dados prontos</li>
          <li>• <strong>Próximos Passos:</strong> Dicas e atalhos úteis</li>
        </ul>

        <div className="pt-2">
          <Button
            onClick={handleRestartTutorial}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar Tutorial
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          <strong>Dica:</strong> Você também pode acessar o tutorial através do menu do seu perfil
          (canto superior direito) → Tutorial.
        </p>
      </CardContent>
    </Card>
  );
}
