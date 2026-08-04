"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, ArrowLeft, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pendenciasEmitente, usaCsosn } from "@/lib/fiscal";
import { ConexaoFiscal } from "@/components/fiscal/ConexaoFiscal";

const REGIMES = [
  { value: "SIMPLES_NACIONAL", label: "Simples Nacional" },
  { value: "SIMPLES_NACIONAL_EXCESSO", label: "Simples Nacional — excesso de sublimite" },
  { value: "REGIME_NORMAL", label: "Regime Normal (Lucro Presumido ou Real)" },
  { value: "MEI", label: "MEI" },
] as const;

export default function EmpresaConfigPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    tradeName: "",
    cnpj: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    numero: "",
    complemento: "",
    bairro: "",
    city: "",
    state: "",
    zipCode: "",
    // Fiscal (NF-e)
    regimeTributario: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    cnae: "",
    codigoMunicipioIBGE: "",
    serieNfe: "",
    proximoNumeroNfe: "",
  });

  const pendencias = pendenciasEmitente(formData);

  // Carrega o que já está salvo (a tela é de configurações, não só de onboarding)
  useEffect(() => {
    fetch("/api/company")
      .then((r) => r.json())
      .then(({ company }) => {
        if (!company) return;
        setFormData((prev) =>
          Object.fromEntries(
            Object.keys(prev).map((k) => [k, company[k] ?? ""])
          ) as typeof prev
        );
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar configurações");
      }

      // Marca o step de onboarding (não bloqueia o save se falhar)
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: "company_setup", action: "complete" }),
      }).catch(() => {});

      toast({
        title: "Dados da empresa salvos!",
        description: "As informações foram gravadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar as configurações.",
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
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dados da Empresa</h1>
            <p className="text-muted-foreground">
              Razão social, CNPJ e endereço usados em documentos e cobrança
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dados Básicos</CardTitle>
            <CardDescription>
              Informações principais da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">
                  Razão Social <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Ex: Minha Empresa Ltda"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeName">Nome Fantasia</Label>
                <Input
                  id="tradeName"
                  name="tradeName"
                  value={formData.tradeName}
                  onChange={handleChange}
                  placeholder="Ex: Minha Loja"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                  inputMode="numeric"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Telefone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@empresa.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.minhaempresa.com.br"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>
              Localização da sua empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Separado em logradouro/número/bairro porque a NF-e exige os três
                em campos distintos — não dá para mandar uma linha só. */}
            <div className="grid md:grid-cols-[3fr_1fr] gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">
                  Logradouro <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua das Flores"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero">
                  Número <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bairro">
                  Bairro <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  placeholder="Centro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Sala 12"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="São Paulo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="SP"
                  maxLength={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">
                  CEP <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Dados Fiscais (NF-e)</CardTitle>
            </div>
            <CardDescription>
              Preencha para emitir notas fiscais pela Orion. O emitente é sempre
              a sua empresa: CNPJ, certificado e responsabilidade fiscal são seus.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primeira pergunta de propósito: o regime decide se os produtos
                usam CSOSN ou CST, e isso muda metade do cadastro. */}
            <div className="space-y-2">
              <Label htmlFor="regimeTributario">Regime Tributário</Label>
              <select
                id="regimeTributario"
                name="regimeTributario"
                value={formData.regimeTributario}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Selecione…</option>
                {REGIMES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {formData.regimeTributario && (
                <p className="text-xs text-muted-foreground">
                  Seus produtos vão usar{" "}
                  <strong>
                    {usaCsosn(formData.regimeTributario) ? "CSOSN" : "CST de ICMS"}
                  </strong>
                  .
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  name="inscricaoEstadual"
                  value={formData.inscricaoEstadual}
                  onChange={handleChange}
                  placeholder="ISENTO se não tiver"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                <Input
                  id="inscricaoMunicipal"
                  name="inscricaoMunicipal"
                  value={formData.inscricaoMunicipal}
                  onChange={handleChange}
                  placeholder="Só para NFS-e"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigoMunicipioIBGE">Código IBGE do Município</Label>
                <Input
                  id="codigoMunicipioIBGE"
                  name="codigoMunicipioIBGE"
                  value={formData.codigoMunicipioIBGE}
                  onChange={handleChange}
                  placeholder="3550308"
                  inputMode="numeric"
                  maxLength={7}
                />
                <p className="text-xs text-muted-foreground">
                  7 dígitos. Consulte em ibge.gov.br pelo nome da cidade.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnae">CNAE Principal</Label>
                <Input
                  id="cnae"
                  name="cnae"
                  value={formData.cnae}
                  onChange={handleChange}
                  placeholder="4751201"
                  inputMode="numeric"
                  maxLength={7}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serieNfe">Série da NF-e</Label>
                <Input
                  id="serieNfe"
                  name="serieNfe"
                  value={formData.serieNfe}
                  onChange={handleChange}
                  placeholder="1"
                  inputMode="numeric"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proximoNumeroNfe">Próximo Número</Label>
                <Input
                  id="proximoNumeroNfe"
                  name="proximoNumeroNfe"
                  value={formData.proximoNumeroNfe}
                  onChange={handleChange}
                  placeholder="1"
                  inputMode="numeric"
                />
                <p className="text-xs text-muted-foreground">
                  Se você já emitiu notas em outro sistema, continue a numeração
                  a partir da última.
                </p>
              </div>
            </div>

            {pendencias.length > 0 && (
              <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                <p className="font-medium">Ainda falta para emitir NF-e:</p>
                <p className="text-muted-foreground">{pendencias.join(", ")}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/configuracoes")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>

      {/* Fora do <form> acima de propósito: form aninhado é HTML inválido, e
          conectar o provedor não deve depender de salvar o cadastro. */}
      <ConexaoFiscal />

      {/* Help Text */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        💡 Dica: Você pode atualizar esses dados a qualquer momento nas
        configurações
      </p>
    </div>
  );
}
