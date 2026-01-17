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
  FileText,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OrionLogo from "./OrionLogo";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Clientes", href: "/dashboard/clientes" },
  { icon: Package, label: "Produtos", href: "/dashboard/produtos" },
  { icon: ShoppingCart, label: "Vendas", href: "/dashboard/vendas" },
  { icon: Wallet, label: "Financeiro", href: "/dashboard/financeiro" },
  { icon: FileText, label: "Relatórios", href: "/dashboard/relatorios" },
  { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
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
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                João da Silva
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Administrador
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
