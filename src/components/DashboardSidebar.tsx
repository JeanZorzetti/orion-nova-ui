"use client";

import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  Package,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OrionLogo from "./OrionLogo";
import { cn } from "@/lib/utils";
import { settingsNav } from "@/lib/settings-nav";
import { WHATSAPP_SUPORTE, WHATSAPP_URL } from "@/lib/suporte";

const SETTINGS_HREF = "/dashboard/configuracoes";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clientes", href: "/dashboard/clientes" },
  { icon: Package, label: "Produtos", href: "/dashboard/produtos" },
  { icon: ShoppingCart, label: "Vendas", href: "/dashboard/vendas" },
  { icon: Wallet, label: "Financeiro", href: "/dashboard/financeiro" },
  { icon: FileText, label: "Relatórios", href: "/dashboard/relatorios" },
  { icon: Settings, label: "Configurações", href: SETTINGS_HREF },
];

const roleLabels: Record<string, string> = {
  USER: "Usuário",
  ADMIN: "Administrador",
  SUPER_ADMIN: "Super Admin",
};

type DashboardSidebarProps = {
  name: string;
  initials: string;
  role?: string;
};

const DashboardSidebar = ({ name, initials, role }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [settingsToggle, setSettingsToggle] = useState<boolean | null>(null);
  const pathname = usePathname();

  // Aberto por padrão quando já se está numa sub-rota; o clique sobrepõe.
  const settingsOpen = settingsToggle ?? pathname.startsWith(SETTINGS_HREF);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <OrionLogo collapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            // Configurações vira grupo colapsável — exceto com a sidebar
            // fechada, onde não há espaço para submenu e o hub resolve.
            if (item.href === SETTINGS_HREF && !collapsed) {
              return (
                <li key={item.label}>
                  <button
                    onClick={() => setSettingsToggle(!settingsOpen)}
                    aria-expanded={settingsOpen}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                      isActive
                        ? "gradient-primary text-primary-foreground glow-effect"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "" : "group-hover:text-primary"
                      )}
                    />
                    <span className="text-sm font-medium flex-1 text-left">
                      {item.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        settingsOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {settingsOpen && (
                    <ul className="mt-1 ml-4 pl-3 border-l border-sidebar-border space-y-0.5">
                      {settingsNav.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                              pathname === sub.href
                                ? "bg-sidebar-accent text-foreground font-medium"
                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                            )}
                          >
                            <sub.icon className="w-4 h-4 flex-shrink-0" />
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "gradient-primary text-primary-foreground glow-effect"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "" : "group-hover:text-primary"
                    )}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Suporte — fora do <ul> de propósito: é link externo, não tem rota
          interna nem estado ativo por pathname. Some enquanto não houver
          número real (ver lib/suporte.ts). */}
      {WHATSAPP_SUPORTE && (
        <div className="px-3 pb-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Suporte por WhatsApp"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#25D366] text-white font-medium transition-all duration-200 hover:brightness-95",
              collapsed && "justify-center"
            )}
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Suporte</span>}
          </a>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold flex-shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {roleLabels[role ?? ""] || "Usuário"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
