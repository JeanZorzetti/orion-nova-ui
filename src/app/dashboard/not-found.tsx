import Link from "next/link";
import { ArrowLeft, LifeBuoy, Package, ShoppingCart, Users } from "lucide-react";

const quickLinks = [
  { label: "Clientes", href: "/dashboard/clientes", icon: Users },
  { label: "Produtos", href: "/dashboard/produtos", icon: Package },
  { label: "Vendas", href: "/dashboard/vendas", icon: ShoppingCart },
  { label: "Suporte", href: "/dashboard/suporte", icon: LifeBuoy },
];

export default function DashboardNotFound() {
  return (
    <div className="glass-card mx-auto mt-12 max-w-lg p-10 text-center">
      <p className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-primary">
        Erro 404
      </p>

      <p className="gradient-text text-6xl font-bold leading-none">404</p>

      <h1 className="mt-5 text-2xl font-semibold">Essa tela saiu de órbita</h1>
      <p className="mt-3 text-muted-foreground text-balance">
        A página que você tentou abrir não existe ou foi movida para outro lugar do sistema.
      </p>

      <Link
        href="/dashboard"
        className="btn-primary mt-8 inline-flex w-full items-center justify-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o dashboard
      </Link>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {quickLinks.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl border border-border/60 p-3 text-left text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
