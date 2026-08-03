"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, ArrowLeft, Construction } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ponytail: emissão fiscal (NF-e/NFC-e, certificado A1) é escopo próprio, não
// existe backend nenhum. Até existir, esta tela informa em vez de fingir que
// salva. O formulário anterior descartava tudo e mostrava "salvo com sucesso".
export default function FiscalConfigPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUnderstood = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: "fiscal_setup", action: "skip" }),
      });

      if (!response.ok) {
        throw new Error("Erro ao concluir etapa");
      }

      router.push("/dashboard/configuracoes");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível concluir a etapa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dados Fiscais</h1>
            <p className="text-muted-foreground">
              Inscrições, regime tributário e certificado digital
            </p>
          </div>
        </div>
      </div>

      <Alert className="mb-6">
        <Construction className="h-4 w-4" />
        <AlertTitle>Em desenvolvimento</AlertTitle>
        <AlertDescription>
          A emissão de notas fiscais eletrônicas ainda não está disponível no
          Orion. Enquanto isso, não pedimos inscrição estadual/municipal, regime
          tributário nem certificado digital — não teríamos onde usá-los.
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>O que já dá para preencher</CardTitle>
          <CardDescription>
            Razão social e CNPJ ficam em Dados da Empresa e já são salvos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/dashboard/configuracoes/empresa">
              Ir para Dados da Empresa
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/configuracoes")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Button type="button" onClick={handleUnderstood} disabled={isLoading}>
          {isLoading ? "Aguarde..." : "Entendi"}
        </Button>
      </div>
    </div>
  );
}
