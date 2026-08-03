import {
  User,
  Users,
  Bell,
  Shield,
  Settings,
  Building2,
  FileText,
  Database,
  Plug,
  Key,
  type LucideIcon,
} from "lucide-react";

/** Fonte única das sub-rotas de Configurações: submenu da sidebar e hub. */
export const settingsNav: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Perfil", href: "/dashboard/configuracoes/perfil", icon: User },
  { label: "Equipe", href: "/dashboard/configuracoes/equipe", icon: Users },
  { label: "Notificações", href: "/dashboard/configuracoes/notificacoes", icon: Bell },
  { label: "Segurança", href: "/dashboard/configuracoes/seguranca", icon: Shield },
  { label: "Sistema", href: "/dashboard/configuracoes/sistema", icon: Settings },
  { label: "Empresa", href: "/dashboard/configuracoes/empresa", icon: Building2 },
  { label: "Fiscal", href: "/dashboard/configuracoes/fiscal", icon: FileText },
  { label: "Migração de Dados", href: "/dashboard/configuracoes/migracao", icon: Database },
  { label: "Integrações", href: "/dashboard/configuracoes/integracoes", icon: Plug },
  { label: "API Keys", href: "/dashboard/configuracoes/api-keys", icon: Key },
];
