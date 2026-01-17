"use client";

import { useEffect, useState } from "react";
import { Search, Sparkles, FileText, Users, Package, ShoppingCart, DollarSign, BarChart3, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const MODULES = [
  { name: "Dashboard", path: "/dashboard", icon: BarChart3, description: "Visão geral do negócio" },
  { name: "Clientes", path: "/dashboard/clientes", icon: Users, description: "Gestão de clientes" },
  { name: "Produtos", path: "/dashboard/produtos", icon: Package, description: "Catálogo de produtos" },
  { name: "Vendas", path: "/dashboard/vendas", icon: ShoppingCart, description: "Pedidos e vendas" },
  { name: "Financeiro", path: "/dashboard/financeiro", icon: DollarSign, description: "Contas a pagar e receber" },
  { name: "Relatórios", path: "/dashboard/relatorios", icon: FileText, description: "Relatórios gerenciais" },
  { name: "Configurações", path: "/dashboard/configuracoes", icon: Settings, description: "Configurações do sistema" },
];

const SearchCommand = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredModules = MODULES.filter((module) =>
    module.name.toLowerCase().includes(search.toLowerCase()) ||
    module.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectModule = (path: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(path);
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <div
          onClick={() => setIsOpen(true)}
          className="glass-card px-4 py-3 flex items-center gap-3 cursor-pointer hover-glow transition-all duration-300 group"
        >
          <div className="relative">
            <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-muted-foreground text-sm flex-1">
            Pergunte à Orion AI ou busque módulos...
          </span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent animate-pulse-glow" />
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-border bg-muted px-2 text-xs text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="px-4 pt-4 pb-0">
            <DialogTitle className="sr-only">Buscar módulos</DialogTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar módulos, funcionalidades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto p-4">
            {filteredModules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Nenhum módulo encontrado</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <button
                      key={module.path}
                      onClick={() => handleSelectModule(module.path)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">
                          {module.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {module.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Dica: Use{" "}
              <kbd className="inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 text-xs">
                <span>⌘</span>K
              </kbd>{" "}
              para abrir rapidamente
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchCommand;
