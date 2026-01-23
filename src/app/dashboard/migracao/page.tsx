"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, Upload, ArrowRight, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MigracaoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    sourceErp: "",
    dataType: "",
  });

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Marcar step como completo
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: "migration",
          action: "complete",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar migração");
      }

      toast({
        title: "Migração iniciada!",
        description:
          "Seus dados estão sendo processados. Você receberá uma notificação quando concluir.",
      });

      router.push("/dashboard/integracoes");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a migração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: "migration",
          action: "skip",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao pular etapa");
      }

      router.push("/dashboard/integracoes");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível pular a etapa.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Migração de Dados</h1>
            <p className="text-muted-foreground">
              Etapa Opcional - Importe dados do seu ERP anterior
            </p>
          </div>
        </div>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Migração Assistida</AlertTitle>
        <AlertDescription>
          Nossa equipe irá validar e importar seus dados com segurança.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dados da Migração</CardTitle>
            <CardDescription>
              Selecione o ERP de origem e o tipo de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceErp">ERP de Origem *</Label>
              <Select
                value={formData.sourceErp}
                onValueChange={(value) => handleSelectChange("sourceErp", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ERP de origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OMIE">Omie</SelectItem>
                  <SelectItem value="BLING">Bling</SelectItem>
                  <SelectItem value="TINY">Tiny ERP</SelectItem>
                  <SelectItem value="CONTA_AZUL">Conta Azul</SelectItem>
                  <SelectItem value="OTHER">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataType">Tipo de Dados *</Label>
              <Select
                value={formData.dataType}
                onValueChange={(value) => handleSelectChange("dataType", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="O que deseja migrar?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="products">Produtos</SelectItem>
                  <SelectItem value="customers">Clientes</SelectItem>
                  <SelectItem value="sales">Vendas/Pedidos</SelectItem>
                  <SelectItem value="all">Todos os Dados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Arquivo de Dados *</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                required
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: CSV, Excel, JSON
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            disabled={isLoading}
          >
            Pular Esta Etapa
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processando..." : "Iniciar Migração"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
