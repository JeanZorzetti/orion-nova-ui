/**
 * Permission System for Orion ERP
 *
 * Role-based access control with module-level granularity
 */

import { UserRole } from "@prisma/client";

// All available modules in the system
export const MODULES = [
  "dashboard",
  "customers",
  "products",
  "sales",
  "financial",
  "reports",
  "settings",
  "users",
  "integrations",
  "support",
] as const;

export type Module = (typeof MODULES)[number];

// Permission types
export type Permission = "view" | "create" | "edit" | "delete" | "manage";

// Role permissions matrix
const ROLE_PERMISSIONS: Record<UserRole, Record<Module, Permission[]>> = {
  USER: {
    dashboard: ["view"],
    customers: ["view", "create", "edit"],
    products: ["view"],
    sales: ["view", "create", "edit"],
    financial: ["view"],
    reports: ["view"],
    settings: [],
    users: [],
    integrations: [],
    support: ["view", "create"],
  },
  ADMIN: {
    dashboard: ["view", "manage"],
    customers: ["view", "create", "edit", "delete"],
    products: ["view", "create", "edit", "delete"],
    sales: ["view", "create", "edit", "delete"],
    financial: ["view", "create", "edit", "delete"],
    reports: ["view", "create"],
    settings: ["view", "edit"],
    users: ["view", "create", "edit"],
    integrations: ["view", "edit"],
    support: ["view", "create", "edit"],
  },
  SUPER_ADMIN: {
    dashboard: ["view", "manage"],
    customers: ["view", "create", "edit", "delete", "manage"],
    products: ["view", "create", "edit", "delete", "manage"],
    sales: ["view", "create", "edit", "delete", "manage"],
    financial: ["view", "create", "edit", "delete", "manage"],
    reports: ["view", "create", "manage"],
    settings: ["view", "edit", "manage"],
    users: ["view", "create", "edit", "delete", "manage"],
    integrations: ["view", "edit", "manage"],
    support: ["view", "create", "edit", "delete", "manage"],
  },
};

/**
 * Check if a user has a specific permission on a module
 */
export function hasPermission(
  userRole: UserRole,
  module: Module,
  permission: Permission
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const modulePermissions = rolePermissions[module];
  if (!modulePermissions) return false;

  // 'manage' includes all permissions
  if (modulePermissions.includes("manage")) return true;

  return modulePermissions.includes(permission);
}

/**
 * Check if user can access a module (has at least 'view' permission)
 */
export function canAccess(userRole: UserRole, module: Module): boolean {
  return hasPermission(userRole, module, "view");
}

/**
 * Check if user can create resources in a module
 */
export function canCreate(userRole: UserRole, module: Module): boolean {
  return hasPermission(userRole, module, "create");
}

/**
 * Check if user can edit resources in a module
 */
export function canEdit(userRole: UserRole, module: Module): boolean {
  return hasPermission(userRole, module, "edit");
}

/**
 * Check if user can delete resources in a module
 */
export function canDelete(userRole: UserRole, module: Module): boolean {
  return hasPermission(userRole, module, "delete");
}

/**
 * Check if user can manage a module (full access)
 */
export function canManage(userRole: UserRole, module: Module): boolean {
  return hasPermission(userRole, module, "manage");
}

/**
 * Get all permissions for a user role
 */
export function getRolePermissions(
  userRole: UserRole
): Record<Module, Permission[]> {
  return ROLE_PERMISSIONS[userRole] || ({} as Record<Module, Permission[]>);
}

/**
 * Get all modules a user can access
 */
export function getAccessibleModules(userRole: UserRole): Module[] {
  return MODULES.filter((module) => canAccess(userRole, module));
}

/**
 * Role display names
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  USER: "Usuario",
  ADMIN: "Administrador",
  SUPER_ADMIN: "Super Administrador",
};

/**
 * Role descriptions
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  USER: "Acesso basico para visualizacao e operacoes do dia a dia",
  ADMIN: "Acesso completo a maioria dos modulos e configuracoes",
  SUPER_ADMIN: "Acesso total ao sistema, incluindo gerenciamento de usuarios",
};

/**
 * Module display names
 */
export const MODULE_DISPLAY_NAMES: Record<Module, string> = {
  dashboard: "Dashboard",
  customers: "Clientes",
  products: "Produtos",
  sales: "Vendas",
  financial: "Financeiro",
  reports: "Relatorios",
  settings: "Configuracoes",
  users: "Usuarios",
  integrations: "Integracoes",
  support: "Suporte",
};

/**
 * Permission display names
 */
export const PERMISSION_DISPLAY_NAMES: Record<Permission, string> = {
  view: "Visualizar",
  create: "Criar",
  edit: "Editar",
  delete: "Excluir",
  manage: "Gerenciar",
};

/**
 * Check authorization and throw if not allowed
 */
export function requirePermission(
  userRole: UserRole | undefined,
  module: Module,
  permission: Permission
): void {
  if (!userRole) {
    throw new PermissionError("Usuario nao autenticado");
  }

  if (!hasPermission(userRole, module, permission)) {
    throw new PermissionError(
      `Voce nao tem permissao para ${PERMISSION_DISPLAY_NAMES[permission].toLowerCase()} em ${MODULE_DISPLAY_NAMES[module]}`
    );
  }
}

/**
 * Custom error class for permission errors
 */
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

/**
 * Higher-order function to wrap API handlers with permission check
 */
export function withPermission(
  module: Module,
  permission: Permission,
  handler: (userRole: UserRole) => Promise<Response> | Response
) {
  return async (userRole: UserRole | undefined): Promise<Response> => {
    try {
      requirePermission(userRole, module, permission);
      return await handler(userRole!);
    } catch (error) {
      if (error instanceof PermissionError) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
      throw error;
    }
  };
}
