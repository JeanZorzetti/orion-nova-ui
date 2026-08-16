"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  maskedKey: string;
  lastUsed: string | null;
  expiresAt: string | null;
  requestCount: number;
  createdAt: string;
}

interface NewApiKey extends ApiKey {
  key: string; // Full key - only shown once
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<NewApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Form state
  const [keyName, setKeyName] = useState("");
  const [expiresIn, setExpiresIn] = useState<string>("never");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch API keys on mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  async function fetchApiKeys() {
    try {
      const response = await fetch("/api/settings/api-keys");
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.apiKeys);
      }
    } catch (error) {
      console.error("Erro ao carregar API keys:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateKey(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);

    try {
      const expiresInDays =
        expiresIn === "never"
          ? undefined
          : expiresIn === "30"
            ? 30
            : expiresIn === "90"
              ? 90
              : expiresIn === "365"
                ? 365
                : undefined;

      const response = await fetch("/api/settings/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: keyName,
          expiresInDays,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewKey(data.apiKey);
        setKeyName("");
        setExpiresIn("never");
        setIsDialogOpen(false);
        fetchApiKeys();
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao criar API key");
      }
    } catch (error) {
      console.error("Erro ao criar API key:", error);
      alert("Erro ao criar API key");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteKey(id: string) {
    if (!confirm("Tem certeza que deseja revogar esta API key? Esta ação não pode ser desfeita.")) {
      return;
    }

    setDeleting(id);

    try {
      const response = await fetch(`/api/settings/api-keys/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApiKeys((prev) => prev.filter((k) => k.id !== id));
      } else {
        const data = await response.json();
        alert(data.error || "Erro ao revogar API key");
      }
    } catch (error) {
      console.error("Erro ao revogar API key:", error);
      alert("Erro ao revogar API key");
    } finally {
      setDeleting(null);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function isExpired(expiresAt: string | null) {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard/configuracoes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Key className="w-5 h-5 text-primary" />
              </div>
              API Keys
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas chaves de API para integração com sistemas externos
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={apiKeys.length >= 5}>
                <Plus className="w-4 h-4 mr-2" />
                Nova API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova API Key</DialogTitle>
                <DialogDescription>
                  Crie uma nova chave de API para integrar com sistemas externos.
                  A chave completa será exibida apenas uma vez.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <Label htmlFor="keyName">Nome da Key</Label>
                  <Input
                    id="keyName"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="Ex: Chave de Produção"
                    required
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Um nome descritivo para identificar onde a key está sendo usada
                  </p>
                </div>

                <div>
                  <Label htmlFor="expiresIn">Validade</Label>
                  <Select value={expiresIn} onValueChange={setExpiresIn}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Sem expiração</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="365">1 ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={creating || !keyName.trim()}>
                    {creating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      "Criar API Key"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* New Key Alert */}
      {newKey && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">
            Guarde sua API Key com segurança!
          </AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            <p className="mb-3">
              Esta é a única vez que a chave completa será exibida. Copie e guarde em
              um local seguro.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-white dark:bg-gray-900 rounded-lg font-mono text-sm border">
                {showKey ? newKey.key : "••••••••••••••••••••••••••••••••••••••••"}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(newKey.key)}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setNewKey(null)}
            >
              Entendi, já copiei a chave
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Info */}
      <div className="glass-card p-6 mb-6">
        <h3 className="font-medium mb-2">Como usar sua API Key</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Inclua sua API key no header <code className="font-mono">x-api-key</code> das
          requisições para <code className="font-mono">/api/customers</code>,{" "}
          <code className="font-mono">/api/products</code>,{" "}
          <code className="font-mono">/api/orders</code> e{" "}
          <code className="font-mono">/api/financial</code>:
        </p>
        <code className="block p-3 bg-muted rounded-lg text-sm font-mono">
          x-api-key: sk_live_...
        </code>
        <p className="text-xs text-muted-foreground mt-2">
          O header <code className="font-mono">Authorization: Bearer sk_live_...</code>{" "}
          também é aceito. Sem chave válida a resposta é 401.
        </p>
      </div>

      {/* API Keys Table */}
      <div className="glass-card">
        {loading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Carregando API keys...</p>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-8 text-center">
            <Key className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhuma API Key</h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira API key para começar a integrar com sistemas externos.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira API Key
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Chave</TableHead>
                <TableHead>Último Uso</TableHead>
                <TableHead>Requisições</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {key.maskedKey}
                    </code>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {key.lastUsed ? (
                      formatDate(key.lastUsed)
                    ) : (
                      <Badge variant="outline">Ociosa — aguardando primeira chamada</Badge>
                    )}
                  </TableCell>
                  <TableCell>{key.requestCount.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>
                    {key.expiresAt ? (
                      isExpired(key.expiresAt) ? (
                        <Badge variant="destructive">Expirada</Badge>
                      ) : (
                        formatDate(key.expiresAt)
                      )
                    ) : (
                      <Badge variant="secondary">Sem expiração</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(key.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteKey(key.id)}
                      disabled={deleting === key.id}
                      className="text-destructive hover:text-destructive"
                    >
                      {deleting === key.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Limit info */}
      <p className="text-sm text-muted-foreground mt-4 text-center">
        {apiKeys.length}/5 API keys criadas
      </p>
    </div>
  );
}
