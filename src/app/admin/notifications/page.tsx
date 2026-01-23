"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Send, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminNotificationsPage() {
  const [type, setType] = useState<string>("INFO");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [targetAudience, setTargetAudience] = useState<string>("trial");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    results?: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          message,
          link: link || undefined,
          sendEmail,
          targetAudience,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          results: data.results,
        });
        // Limpar formulário
        setTitle("");
        setMessage("");
        setLink("");
        setSendEmail(false);
      } else {
        setResult({
          success: false,
          message: data.error || "Erro ao enviar notificações",
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Erro ao enviar notificações",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const notificationTypes = [
    { value: "INFO", label: "Informação", color: "text-blue-500" },
    { value: "SUCCESS", label: "Sucesso", color: "text-green-500" },
    { value: "WARNING", label: "Aviso", color: "text-yellow-500" },
    { value: "ERROR", label: "Erro", color: "text-red-500" },
    { value: "PAYMENT", label: "Pagamento", color: "text-green-600" },
    { value: "SUBSCRIPTION", label: "Assinatura", color: "text-purple-500" },
    { value: "SUPPORT", label: "Suporte", color: "text-blue-600" },
    { value: "SYSTEM", label: "Sistema", color: "text-gray-500" },
  ];

  const audiences = [
    {
      value: "all",
      label: "Todos os Usuários",
      description: "Enviar para todos os usuários cadastrados",
    },
    {
      value: "trial",
      label: "Usuários em Trial",
      description: "Apenas usuários no período de teste",
    },
    {
      value: "active",
      label: "Assinantes Ativos",
      description: "Usuários com assinatura ativa",
    },
    {
      value: "expired",
      label: "Trials Expirados",
      description: "Usuários com trial expirado ou cancelado",
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Painel de Notificações - Admin
        </h1>
        <p className="text-muted-foreground">
          Envie notificações em massa para seus usuários
        </p>
      </div>

      {result && (
        <Alert
          variant={result.success ? "default" : "destructive"}
          className="mb-6"
        >
          {result.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>
            {result.success ? "Sucesso!" : "Erro"}
          </AlertTitle>
          <AlertDescription>
            {result.message}
            {result.results && (
              <div className="mt-2 text-sm">
                <p>
                  Total de usuários: {result.results.total}
                </p>
                <p className="text-green-600">
                  Enviados com sucesso: {result.results.successful}
                </p>
                {result.results.failed > 0 && (
                  <p className="text-red-600">
                    Falhas: {result.results.failed}
                  </p>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Nova Notificação em Massa</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para enviar uma notificação para
              múltiplos usuários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Público-alvo */}
            <div className="space-y-2">
              <Label htmlFor="target">Público-Alvo</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o público-alvo" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      <div>
                        <div className="font-medium">{audience.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {audience.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Notificação</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((notifType) => (
                    <SelectItem key={notifType.value} value={notifType.value}>
                      <span className={notifType.color}>
                        {notifType.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                placeholder="Ex: Nova funcionalidade disponível!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/100 caracteres
              </p>
            </div>

            {/* Mensagem */}
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite a mensagem que será exibida aos usuários..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/500 caracteres
              </p>
            </div>

            {/* Link (opcional) */}
            <div className="space-y-2">
              <Label htmlFor="link">Link (opcional)</Label>
              <Input
                id="link"
                placeholder="/dashboard ou /features"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Link interno para onde o usuário será redirecionado ao clicar
              </p>
            </div>

            {/* Enviar Email */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sendEmail"
                checked={sendEmail}
                onCheckedChange={(checked) => setSendEmail(checked as boolean)}
              />
              <Label
                htmlFor="sendEmail"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enviar também por email
              </Label>
            </div>

            {/* Botão Enviar */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !title || !message}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Notificações
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Preview da notificação */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview da Notificação</CardTitle>
          <CardDescription>
            Assim é como os usuários verão a notificação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-accent/50">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 ${
                  notificationTypes.find((t) => t.value === type)?.color ||
                  "text-gray-500"
                }`}
              >
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold">
                  {title || "Título da notificação"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {message || "Mensagem da notificação aparecerá aqui..."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
