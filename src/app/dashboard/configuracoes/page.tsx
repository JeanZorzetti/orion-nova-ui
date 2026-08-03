import Link from "next/link";
import { settingsNav } from "@/lib/settings-nav";

export default function ConfiguracoesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="glass-card p-6 flex items-center gap-3 hover:bg-muted transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
