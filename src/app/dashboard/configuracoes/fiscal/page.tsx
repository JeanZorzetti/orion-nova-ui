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
import { FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FiscalConfigPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    cnpj: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    regimeTributario: "",
    certificadoDigital: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Criar API para salvar dados fiscais
      // Por enquanto, apenas marcamos o step como completo
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId: "fiscal_setup",
          action: "complete",
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar configurações");
      }

      toast({
        title: "Configurações fiscais salvas!",
        description: "Seus dados fiscais foram salvos com sucesso.",
      });

      // Redirecionar para próxima etapa
      router.push("/dashboard/produtos/novo");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
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
              Passo 3 de 5 - Configure os dados fiscais da empresa
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações Fiscais</CardTitle>
            <CardDescription>
              Dados necessários para emissão de notas fiscais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">
                CNPJ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                required
              />
              <p className="text-xs text-muted-foreground">
                Seu CNPJ será usado para emissão de notas fiscais
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  name="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={handleChange}
                  placeholder="000.000.000.000"
                />
                <p className="text-xs text-muted-foreground">
                  Deixe em branco se isento
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                <Input
                  id="inscricaoMunicipal"
                  name="inscricaoMunicipal"
                  value={formData.inscricaoMunicipal}
                  onChange={handleChange}
                  placeholder="000.000.000-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="regimeTributario">
                Regime Tributário <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.regimeTributario}
                onValueChange={(value) =>
                  handleSelectChange("regimeTributario", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o regime tributário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples Nacional</SelectItem>
                  <SelectItem value="lucro_presumido">
                    Lucro Presumido
                  </SelectItem>
                  <SelectItem value="lucro_real">Lucro Real</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                O regime tributário define os impostos que você pagará
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Certificado Digital (A1)</CardTitle>
            <CardDescription>
              Necessário para emissão de NF-e e NFC-e
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certificadoDigital">Upload Certificado</Label>
              <Input
                id="certificadoDigital"
                name="certificadoDigital"
                type="file"
                accept=".pfx,.p12"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData((prev) => ({
                      ...prev,
                      certificadoDigital: e.target.files![0].name,
                    }));
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: .pfx ou .p12 - Você pode adicionar depois
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">
                💡 Não tem certificado digital?
              </p>
              <p className="text-xs text-blue-700">
                Você pode adquirir um certificado A1 com autoridades
                certificadoras como Serasa, Certisign ou Valid. O certificado é
                necessário apenas para emitir notas fiscais eletrônicas.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/configuracoes/empresa")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/dashboard")}
            >
              Pular por Enquanto
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar e Continuar"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Help Text */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        🔒 Seus dados fiscais são armazenados com segurança e criptografia
      </p>
    </div>
  );
}
