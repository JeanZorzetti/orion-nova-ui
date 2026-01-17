"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SampleDataManager() {
  const [hasSampleData, setHasSampleData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkSampleData();
  }, []);

  const checkSampleData = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/sample-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });
      const data = await response.json();
      setHasSampleData(data.exists);
    } catch (error) {
      console.error("Erro ao verificar dados de exemplo:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAddSampleData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/sample-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "populate" }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Dados de exemplo adicionados!",
          description: (
            <div className="mt-2 space-y-1">
              <p>• {data.data.customers} clientes criados</p>
              <p>• {data.data.products} produtos criados</p>
              <p>• {data.data.salesOrders} vendas criadas</p>
              <p>• {data.data.financialTransactions} transações criadas</p>
            </div>
          ),
        });
        setHasSampleData(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar dados",
        description: error.message || "Não foi possível adicionar os dados de exemplo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSampleData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/sample-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "🗑️ Dados de exemplo removidos!",
          description: (
            <div className="mt-2 space-y-1">
              <p>• {data.data.customers} clientes removidos</p>
              <p>• {data.data.products} produtos removidos</p>
              <p>• {data.data.salesOrders} vendas removidas</p>
              <p>• {data.data.financialTransactions} transações removidas</p>
            </div>
          ),
        });
        setHasSampleData(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover dados",
        description: error.message || "Não foi possível remover os dados de exemplo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados de Exemplo</CardTitle>
          <CardDescription>Gerenciar dados de demonstração do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Dados de Exemplo
        </CardTitle>
        <CardDescription>
          Gerencie dados de demonstração para explorar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasSampleData ? (
          <>
            <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-700 dark:text-green-400">
                  Dados de exemplo estão ativos
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Seu sistema contém dados de demonstração. Todos os itens são marcados com [EXEMPLO].
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">O que está incluído:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• 3 clientes (PF e PJ)</li>
                <li>• 4 produtos (incluindo serviços)</li>
                <li>• 2 pedidos de venda</li>
                <li>• 6 transações financeiras</li>
                <li>• Produtos com estoque baixo</li>
                <li>• 1 conta atrasada para alertas</li>
              </ul>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isLoading ? "Removendo..." : "Remover Dados de Exemplo"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá remover todos os dados de exemplo do sistema, incluindo
                    clientes, produtos, vendas e transações financeiras marcadas com [EXEMPLO].
                    <br />
                    <br />
                    <strong>Esta ação não pode ser desfeita.</strong>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveSampleData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, remover dados
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <>
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-700 dark:text-blue-400">
                  Nenhum dado de exemplo encontrado
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Adicione dados de demonstração para explorar os recursos do sistema.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Dados que serão criados:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• 3 clientes de exemplo (João Silva, Tech Solutions LTDA, Maria Santos)</li>
                <li>• 4 produtos (Notebook, Mouse, Consultoria, Teclado)</li>
                <li>• 2 pedidos de venda com diferentes status</li>
                <li>• 6 transações financeiras (contas a receber e pagar)</li>
                <li>• Cenários realistas (estoque baixo, contas atrasadas)</li>
              </ul>
            </div>

            <Button
              onClick={handleAddSampleData}
              className="w-full"
              disabled={isLoading}
            >
              <Database className="w-4 h-4 mr-2" />
              {isLoading ? "Adicionando..." : "Adicionar Dados de Exemplo"}
            </Button>
          </>
        )}

        <p className="text-xs text-muted-foreground">
          <strong>Dica:</strong> Os dados de exemplo são úteis para testar a Orion AI e explorar
          os recursos do sistema sem comprometer seus dados reais.
        </p>
      </CardContent>
    </Card>
  );
}
