"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Loader2,
  FileText,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SourceErp = "OMIE" | "BLING" | "TINY" | "CONTA_AZUL" | "SAP" | "TOTVS" | "OTHER";

interface MigrationStats {
  total: number;
  success: number;
  errors: number;
  warnings: number;
}

export default function MigracaoPage() {
  const router = useRouter();
  const [sourceErp, setSourceErp] = useState<SourceErp | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      // Validar tipo de arquivo
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/json",
      ];

      if (!validTypes.includes(uploadedFile.type)) {
        alert("Formato de arquivo não suportado. Use CSV, XLSX ou JSON.");
        return;
      }

      setFile(uploadedFile);
    }
  };

  const handleMigration = async () => {
    if (!sourceErp || !file) {
      alert("Selecione o ERP de origem e faça upload do arquivo.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sourceErp", sourceErp);

      const response = await fetch("/api/migration/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao processar migração");
      }

      const data = await response.json();

      // Simular progresso (no mundo real, seria via WebSocket ou polling)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Aguardar conclusão
      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setStats({
          total: data.totalRecords || 0,
          success: data.successRecords || 0,
          errors: data.errorRecords || 0,
          warnings: data.warnings?.length || 0,
        });
        setErrors(data.errors || []);
        setIsProcessing(false);
      }, 5000);
    } catch (error) {
      console.error("Erro na migração:", error);
      alert("Erro ao processar migração. Tente novamente.");
      setIsProcessing(false);
    }
  };

  const downloadTemplate = (erp: string) => {
    // No mundo real, retornaria um template específico por ERP
    const templates: Record<string, string> = {
      OMIE: "/templates/omie-template.csv",
      BLING: "/templates/bling-template.csv",
      TINY: "/templates/tiny-template.csv",
      CONTA_AZUL: "/templates/conta-azul-template.csv",
    };

    window.open(templates[erp] || "/templates/generic-template.csv", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Migração de Dados</h1>
          <p className="text-muted-foreground">
            Importe seus dados de outro ERP de forma rápida e segura
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Como funciona</AlertTitle>
          <AlertDescription>
            Selecione o ERP de origem, baixe o template correspondente, exporte
            seus dados no formato do template e faça o upload. Nosso sistema irá
            validar e importar automaticamente.
          </AlertDescription>
        </Alert>

        {/* Main Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configurar Migração</CardTitle>
            <CardDescription>
              Siga os passos abaixo para migrar seus dados
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Passo 1: Selecionar ERP */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                1. Selecione o ERP de Origem
              </label>
              <Select
                value={sourceErp || ""}
                onValueChange={(value) => setSourceErp(value as SourceErp)}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha o ERP..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OMIE">Omie ERP</SelectItem>
                  <SelectItem value="BLING">Bling ERP</SelectItem>
                  <SelectItem value="TINY">Tiny ERP</SelectItem>
                  <SelectItem value="CONTA_AZUL">Conta Azul</SelectItem>
                  <SelectItem value="SAP">SAP Business One</SelectItem>
                  <SelectItem value="TOTVS">TOTVS Protheus</SelectItem>
                  <SelectItem value="OTHER">Outro / Genérico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Passo 2: Download Template */}
            {sourceErp && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  2. Baixe o Template
                </label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => downloadTemplate(sourceErp)}
                  disabled={isProcessing}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Template para {sourceErp}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Exporte seus dados do {sourceErp} e preencha o template
                </p>
              </div>
            )}

            {/* Passo 3: Upload Arquivo */}
            {sourceErp && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  3. Faça Upload do Arquivo
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      {!isProcessing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFile(null)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-4">
                        Arraste e solte ou clique para selecionar
                      </p>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls,.json"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={isProcessing}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" asChild disabled={isProcessing}>
                          <span>Selecionar Arquivo</span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Formatos suportados: CSV, XLSX, JSON (máx 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {isProcessing && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Processando...</span>
                  <span className="text-sm text-muted-foreground">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {/* Results */}
            {stats && !isProcessing && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold">{stats.success}</p>
                          <p className="text-xs text-muted-foreground">
                            Registros Importados
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <XCircle className="h-8 w-8 text-red-500" />
                        <div>
                          <p className="text-2xl font-bold">{stats.errors}</p>
                          <p className="text-xs text-muted-foreground">
                            Erros
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erros Encontrados</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {errors.slice(0, 5).map((error, i) => (
                          <li key={i} className="text-xs">
                            {error}
                          </li>
                        ))}
                        {errors.length > 5 && (
                          <li className="text-xs">
                            + {errors.length - 5} erros adicionais
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleMigration}
              disabled={!sourceErp || !file || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Iniciar Migração"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Supported Entities */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Entidades Suportadas</CardTitle>
            <CardDescription>
              Dados que podem ser importados do seu ERP atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Clientes",
                "Fornecedores",
                "Produtos",
                "Serviços",
                "Categorias",
                "Estoque",
                "Vendas",
                "Notas Fiscais",
              ].map((entity) => (
                <div
                  key={entity}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{entity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
