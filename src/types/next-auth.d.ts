import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

declare module "next-auth" {
  interface Session {
    user: {
      /** Quem está logado. Use para dados pessoais: perfil, notificações, push. */
      id: string;
      /**
       * Dono da conta — é nele que todo dado do ERP está gravado. Use para
       * clientes, produtos, vendas, financeiro, relatórios e dashboard, senão
       * um membro da equipe abre o sistema vazio.
       */
      accountId: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    accountId: string;
    role: UserRole;
  }
}
