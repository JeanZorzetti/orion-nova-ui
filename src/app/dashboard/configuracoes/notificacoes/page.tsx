"use client";

import { Bell } from "lucide-react";

export default function NotificacoesConfigPage() {
  return (
    <div className="max-w-3xl">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Notificações</h1>
            <p className="text-sm text-muted-foreground">
              Configure como você deseja receber notificações
            </p>
          </div>
        </div>

        {/* ponytail: toggles decorativos — persistir exige coluna nova em `users` */}
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
    </div>
  );
}
