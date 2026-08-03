"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Settings, User, Bell, Shield, Key } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SampleDataManager } from "@/components/sample-data-manager";
import { OnboardingControl } from "@/components/onboarding-control";

export default function ConfiguracoesPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await update();
        toast.success("Perfil atualizado com sucesso!");
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="glass-card p-6">
          <nav className="space-y-2">
            <a
              href="#perfil"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
            >
              <User className="w-4 h-4" />
              Perfil
            </a>
            <a
              href="#notificacoes"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Bell className="w-4 h-4" />
              Notificações
            </a>
            <a
              href="#seguranca"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Shield className="w-4 h-4" />
              Segurança
            </a>
            <a
              href="#sistema"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Settings className="w-4 h-4" />
              Sistema
            </a>
            <Link
              href="/dashboard/configuracoes/api-keys"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <Key className="w-4 h-4" />
              API Keys
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Perfil */}
          <div id="perfil" className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Perfil</h2>
                <p className="text-sm text-muted-foreground">
                  Atualize suas informações pessoais
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </div>

          {/* Notificações */}
          <div id="notificacoes" className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Notificações</h2>
                <p className="text-sm text-muted-foreground">
                  Configure como você deseja receber notificações
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Pedidos novos</p>
                  <p className="text-sm text-muted-foreground">
                    Receba notificação quando um novo pedido for criado
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Estoque baixo</p>
                  <p className="text-sm text-muted-foreground">
                    Alertas quando produtos atingirem o estoque mínimo
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Contas a vencer</p>
                  <p className="text-sm text-muted-foreground">
                    Lembrete de contas a receber/pagar próximas do vencimento
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div id="seguranca" className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Segurança</h2>
                <p className="text-sm text-muted-foreground">
                  Gerencie a segurança da sua conta
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Alterar Senha</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recomendamos alterar sua senha regularmente
                </p>
                <Button variant="outline">Alterar Senha</Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Sessões Ativas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Você está conectado em 1 dispositivo
                </p>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sessão Atual</p>
                      <p className="text-sm text-muted-foreground">
                        Windows • Chrome
                      </p>
                    </div>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sistema */}
          <div id="sistema" className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Sistema</h2>
                <p className="text-sm text-muted-foreground">
                  Configurações gerais do sistema
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Tipo de Conta</Label>
                <div className="mt-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {session?.user?.role === "ADMIN" ? "Administrador" : "Usuário"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session?.user?.role === "ADMIN"
                          ? "Acesso completo ao sistema"
                          : "Acesso aos módulos principais"}
                      </p>
                    </div>
                    <Badge variant={session?.user?.role === "ADMIN" ? "default" : "secondary"}>
                      {session?.user?.role || "USER"}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Informações do Sistema</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Versão:</span>
                    <span className="font-medium">1.0.0 MVP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Última atualização:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tutorial */}
          <OnboardingControl />

          {/* Dados de Exemplo */}
          <SampleDataManager />
        </div>
      </div>
    </div>
  );
}
