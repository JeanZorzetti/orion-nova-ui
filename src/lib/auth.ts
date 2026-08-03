import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error("Credenciais inválidas");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Credenciais inválidas");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role as "USER" | "ADMIN" | "SUPER_ADMIN",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;

        // Conta a que este login pertence: o dono, ou ele mesmo se for o dono.
        // A query fica DENTRO do `if (user)` de propósito — esse ramo só roda no
        // sign-in, que acontece em route handler. O resto do callback roda
        // também no proxy, onde o Prisma não funciona (foi assim que o gate de
        // trial ficou meses sem rodar). Não mova esta query para fora daqui.
        const owner = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { ownerId: true },
        });
        token.accountId = owner?.ownerId ?? (user.id as string);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        // Fallback para tokens emitidos antes da feature de equipe existir.
        session.user.accountId = (token.accountId as string) ?? (token.id as string);
      }
      return session;
    },
  },
});
