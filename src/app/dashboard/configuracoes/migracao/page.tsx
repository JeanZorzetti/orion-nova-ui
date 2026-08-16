"use client";

import { useCallback, useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, Upload, ArrowRight, Info, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface MigrationResult {
  totalRecords: number;
  successRecords: number;
  errorRecords: number;
  errors: string[];
}

interface MigrationRow {
  id: string;
  createdAt: string;
  sourceErp: string;
  dataType: string;
  status: string;
  fileName: string | null;
  totalRecords: number;
  processedRecords: number;
  successRecords: number;
  errorRecords: number;
}

// Mesmas regras da rota: o formulário não deixa sair um POST que o servidor
// vai recusar.
const formSchema = z.object({
  sourceErp: z.enum(["OMIE", "BLING", "TINY", "CONTA_AZUL", "OTHER"], {
    errorMap: () => ({ message: "Selecione o ERP de origem" }),
  }),
  dataType: z.enum(["CUSTOMERS", "PRODUCTS", "ALL"], {
    errorMap: () => ({ message: "Selecione o tipo de dados" }),
  }),
});

const ERP_LABELS: Record<string, string> = {
  OMIE: "Omie",
  BLING: "Bling",
  TINY: "Tiny ERP",
  CONTA_AZUL: "Conta Azul",
  SAP: "SAP",
  TOTVS: "TOTVS",
  OTHER: "Outro",
};

const TIPO_LABELS: Record<string, string> = {
  CUSTOMERS: "Clientes",
  PRODUCTS: "Produtos",
  ALL: "Todos os dados",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Aguardando",
  VALIDATING: "Validando",
  PROCESSING: "Processando",
  COMPLETED: "Concluída",
  FAILED: "Falhou",
  PARTIAL: "Concluída com erros",
};

const EM_ANDAMENTO = ["PENDING", "VALIDATING", "PROCESSING"];

function statusVariant(status: string) {
  if (status === "COMPLETED") return "default" as const;
  if (status === "FAILED") return "destructive" as const;
  return "secondary" as const;
}

export default function MigracaoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [erros, setErros] = useState<Record<string, string>>({});

  const [history, setHistory] = useState<MigrationRow[] | null>(null);

  const [formData, setFormData] = useState({
    sourceErp: "",
    dataType: "",
  });

  const carregarHistorico = useCallback(async () => {
    try {
      const res = await fetch("/api/migration");
      if (!res.ok) throw new Error("falha");
      const data = await res.json();
      setHistory(data.migrations);
      return data.migrations as MigrationRow[];
    } catch {
      setHistory([]);
      return [];
    }
  }, []);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  // Só pesquisa o servidor enquanto existe migração viva. Sem job pendente, sem
  // polling — o histórico é estático até o próximo upload.
  useEffect(() => {
    if (!history?.some((m) => EM_ANDAMENTO.includes(m.status))) return;
    const t = setInterval(carregarHistorico, 3000);
    return () => clearInterval(t);
  }, [history, carregarHistorico]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErros((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validado = formSchema.safeParse(formData);
    if (!validado.success) {
      const campos: Record<string, string> = {};
      for (const issue of validado.error.errors) {
        campos[String(issue.path[0])] = issue.message;
      }
      setErros(campos);
      return;
    }

    if (!file) {
      toast({
        title: "Selecione um arquivo",
        description: "Escolha o arquivo exportado do seu ERP anterior.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setErros({});

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("sourceErp", validado.data.sourceErp);
      body.append("dataType", validado.data.dataType);

      const response = await fetch("/api/migration", { method: "POST", body });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar migração");
      }

      setResult(data);
      carregarHistorico();

      // Marcar step como completo (não bloqueia o resultado se falhar)
      await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: "migration", action: "complete" }),
      }).catch(() => {});

      toast({
        title: "Migração concluída!",
        description: `${data.successRecords} de ${data.totalRecords} registro(s) importado(s).`,
        variant: data.errorRecords > 0 ? "destructive" : undefined,
      });
    } catch (error: any) {
      carregarHistorico();
      toast({
        title: "Erro",
        description: error.message || "Não foi possível processar a migração.",
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
              Importe clientes e produtos de outro ERP
            </p>
          </div>
        </div>
      </div>

      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>Importação Automática</AlertTitle>
        <AlertDescription>
          O arquivo é validado e importado na hora. O resultado aparece nesta
          tela ao final. Tamanho máximo: 10MB.
        </AlertDescription>
      </Alert>

      {result && (
        <Alert
          className="mb-6"
          variant={result.errorRecords > 0 ? "destructive" : undefined}
        >
          {result.errorRecords > 0 ? (
            <XCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertTitle>Migração concluída</AlertTitle>
          <AlertDescription>
            <p>
              {result.successRecords} de {result.totalRecords} registro(s)
              importado(s)
              {result.errorRecords > 0 && `, ${result.errorRecords} com erro`}.
            </p>
            {result.errors?.length > 0 && (
              <ul className="mt-2 list-disc pl-4 text-xs space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
            <Button
              type="button"
              size="sm"
              className="mt-3"
              onClick={() => router.push("/dashboard/configuracoes/integracoes")}
            >
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
              >
                <SelectTrigger
                  id="sourceErp"
                  aria-invalid={!!erros.sourceErp}
                  className={erros.sourceErp ? "border-destructive" : ""}
                >
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
              {erros.sourceErp && (
                <p className="text-xs text-destructive">{erros.sourceErp}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataType">Tipo de Dados *</Label>
              <Select
                value={formData.dataType}
                onValueChange={(value) => handleSelectChange("dataType", value)}
              >
                <SelectTrigger
                  id="dataType"
                  aria-invalid={!!erros.dataType}
                  className={erros.dataType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="O que deseja migrar?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMERS">Clientes</SelectItem>
                  <SelectItem value="PRODUCTS">Produtos</SelectItem>
                  <SelectItem value="ALL">Clientes e Produtos</SelectItem>
                </SelectContent>
              </Select>
              {erros.dataType && (
                <p className="text-xs text-destructive">{erros.dataType}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Importação de pedidos de venda ainda não está disponível.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Arquivo de Dados *</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Formatos aceitos: CSV, Excel, JSON
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Importando..."
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar Dados
              </>
            )}
          </Button>
        </div>
      </form>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Histórico de Migrações</CardTitle>
          <CardDescription>
            Últimas 20 importações desta conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history === null ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center">
              <Database className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="font-medium">Nenhuma migração ainda</p>
              <p className="text-sm text-muted-foreground">
                Envie um arquivo acima e o histórico aparece aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Sistema de Origem</TableHead>
                    <TableHead>Tipo de Dados</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Registros Importados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((m) => {
                    const emAndamento = EM_ANDAMENTO.includes(m.status);
                    const pct = m.totalRecords
                      ? Math.round((m.processedRecords / m.totalRecords) * 100)
                      : 0;

                    return (
                      <TableRow key={m.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(m.createdAt).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>{ERP_LABELS[m.sourceErp] ?? m.sourceErp}</TableCell>
                        <TableCell>{TIPO_LABELS[m.dataType] ?? m.dataType}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(m.status)}>
                            {STATUS_LABELS[m.status] ?? m.status}
                          </Badge>
                          {emAndamento && (
                            <Progress value={pct} className="mt-2 h-1 w-24" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {m.successRecords}
                          {m.errorRecords > 0 && (
                            <span className="text-destructive">
                              {" "}
                              ({m.errorRecords} c/ erro)
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
