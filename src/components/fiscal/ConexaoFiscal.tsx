"use client";

import { useState, useEffect } from "react";
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
import { Plug, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Status = {
  conectado: boolean;
  ambiente: "HOMOLOGACAO" | "PRODUCAO";
  token: string | null;
  conectadoEm: string | null;
};

/**
 * Modelo BYO: a conta na Focus NFe é do cliente. Ele cola aqui o token da
 * empresa e a Orion passa a emitir por ele — sem certificado passando pela
 * Orion e sem custo por documento na conta da ROI Labs.
 */
export function ConexaoFiscal() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status | null>(null);
  const [token, setToken] = useState("");
  const [ambiente, setAmbiente] = useState<Status["ambiente"]>("HOMOLOGACAO");
  const [isLoading, setIsLoading] = useState(false);

  const carregar = () =>
    fetch("/api/fiscal/conexao")
      .then((r) => r.json())
      .then((data: Status) => {
        setStatus(data);
        setAmbiente(data.ambiente);
      })
      .catch(() => {});

  useEffect(() => {
    carregar();
  }, []);

  const conectar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/fiscal/conexao", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ambiente }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao conectar");

      setToken("");
      await carregar();
      toast({
        title: "Emissão fiscal conectada!",
        description: `Ambiente: ${ambiente === "PRODUCAO" ? "Produção" : "Homologação"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Não deu para conectar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const desconectar = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/fiscal/conexao", { method: "DELETE" });
      await carregar();
      toast({ title: "Emissão fiscal desconectada." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-primary" />
          <CardTitle>Emissão Fiscal</CardTitle>
        </div>
        <CardDescription>
          A Orion emite suas notas usando sua conta na{" "}
          <a
            href="https://focusnfe.com.br/cadastro/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Focus NFe
          </a>
          . Seu certificado digital fica no painel deles — não passa pela Orion.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {status?.conectado ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-green-500/40 bg-green-500/10 p-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>
                Conectado em{" "}
                {status.ambiente === "PRODUCAO" ? "Produção" : "Homologação"} ·{" "}
                <code className="text-xs">{status.token}</code>
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={desconectar}
              disabled={isLoading}
            >
              Desconectar
            </Button>
          </div>
        ) : (
          <form onSubmit={conectar} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Token da empresa</Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Cole aqui o token da Focus NFe"
                autoComplete="off"
                required
              />
              {/* O master token emite para qualquer CNPJ da conta. Se o cliente
                  colar o errado, a Orion recusa — mas avisar antes evita a ida
                  e volta. */}
              <p className="text-xs text-muted-foreground">
                No painel da Focus, em <strong>Minhas Empresas</strong>, use o token
                da empresa — <strong>não</strong> o token master da conta.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ambiente">Ambiente</Label>
              <select
                id="ambiente"
                value={ambiente}
                onChange={(e) => setAmbiente(e.target.value as Status["ambiente"])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="HOMOLOGACAO">Homologação (notas de teste)</option>
                <option value="PRODUCAO">Produção (notas valem de verdade)</option>
              </select>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Validando..." : "Conectar"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
