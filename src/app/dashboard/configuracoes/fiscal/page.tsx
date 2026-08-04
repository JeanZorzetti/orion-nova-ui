"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pendenciasEmitente, usaCsosn } from "@/lib/fiscal";
import { ConexaoFiscal } from "@/components/fiscal/ConexaoFiscal";

const REGIMES = [
  { value: "SIMPLES_NACIONAL", label: "Simples Nacional" },
  { value: "SIMPLES_NACIONAL_EXCESSO", label: "Simples Nacional — excesso de sublimite" },
  { value: "REGIME_NORMAL", label: "Regime Normal (Lucro Presumido ou Real)" },
  { value: "MEI", label: "MEI" },
] as const;

export default function FiscalConfigPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    regimeTributario: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    cnae: "",
    codigoMunicipioIBGE: "",
    serieNfe: "",
    proximoNumeroNfe: "",
  });

  // Endereço e CNPJ ficam em Dados da Empresa, mas a NF-e precisa deles — então
  // esta tela lê a empresa inteira para conseguir cobrar o que falta lá.
  const [empresa, setEmpresa] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetch("/api/company")
      .then((r) => r.json())
      .then(({ company }) => {
        if (!company) return;
        setEmpresa(company);
        setFormData((prev) =>
          Object.fromEntries(
            Object.keys(prev).map((k) => [k, company[k] ?? ""])
          ) as typeof prev
        );
      })
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pendencias = pendenciasEmitente({ ...empresa, ...formData });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // O PUT valida `companyName` como obrigatório, então reenvia o cadastro
      // que já existe junto dos campos fiscais desta tela.
      const response = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...empresa, ...formData }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao salvar");

      setEmpresa(data.company);

      // A tela antiga só sabia "pular" este passo, porque não salvava nada.
      // Agora salva, então ele conclui. (não bloqueia o save se falhar)
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: "fiscal_setup", action: "complete" }),
      }).catch(() => {});

      toast({
        title: "Dados fiscais salvos!",
        description: "As informações foram gravadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar.",
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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Dados Fiscais</h1>
            <p className="text-muted-foreground">
              Regime tributário, inscrições e emissão de NF-e
            </p>
          </div>
        </div>
      </div>

      {/* O repo já pagou caro por anunciar o que não existe (G4). O cadastro e a
          conexão funcionam hoje; o botão de emitir no pedido, ainda não. */}
      <div className="mb-6 rounded-md border border-border bg-muted/40 p-3 text-sm">
        <p className="font-medium">O que funciona hoje</p>
        <p className="text-muted-foreground">
          Guardar o enquadramento e conectar sua conta da Focus NFe. A emissão a
          partir do pedido ainda está em construção — nada é cobrado por nota
          pela Orion, você paga direto ao provedor.
        </p>
      </div>

      {!empresa && (
        <Card className="mb-6 border-amber-500/40 bg-amber-500/10">
          <CardHeader>
            <CardTitle className="text-base">Cadastre a empresa primeiro</CardTitle>
            <CardDescription>
              Razão social, CNPJ e endereço são obrigatórios na nota e ficam em
              Dados da Empresa.
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
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Enquadramento</CardTitle>
            <CardDescription>
              O emitente da nota é sempre a sua empresa: CNPJ, certificado e
              responsabilidade fiscal são seus. A Orion é o software que emite.
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

        <div className="flex justify-end mb-6">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>

      {/* Fora do <form> acima: form aninhado é HTML inválido, e conectar o
          provedor não deve depender de salvar o cadastro. */}
      <ConexaoFiscal />

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/configuracoes")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    </div>
  );
}
