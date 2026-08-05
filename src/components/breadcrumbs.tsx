"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

const pathNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  clientes: "Clientes",
  produtos: "Produtos",
  vendas: "Vendas",
  financeiro: "Financeiro",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
  suporte: "Suporte",
  perfil: "Perfil",
  notificacoes: "Notificações",
  seguranca: "Segurança",
  sistema: "Sistema",
  empresa: "Empresa",
  fiscal: "Fiscal",
  migracao: "Migração de Dados",
  integracoes: "Integrações",
  "api-keys": "API Keys",
  novo: "Novo",
  editar: "Editar",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (pathname === "/" || pathname === "/dashboard") {
    return null;
  }

  const paths = pathname.split("/").filter((path) => path);

  // Remove 'dashboard' from paths as it's redundant
  const breadcrumbPaths = paths.filter((path) => path !== "dashboard");

  if (breadcrumbPaths.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbPaths.map((path, index) => {
        // Build the href up to this point
        const href = `/dashboard/${breadcrumbPaths.slice(0, index + 1).join("/")}`;
        const isLast = index === breadcrumbPaths.length - 1;

        // Skip UUIDs and dynamic segments
        if (path.length > 20 || path.match(/^[a-z0-9-]{20,}$/i)) {
          return null;
        }

        const label = pathNameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <Fragment key={path}>
            <ChevronRight className="w-4 h-4" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground transition-colors">
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
