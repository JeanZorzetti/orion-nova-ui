# Roadmap: Sistema de Autenticação Completo

**Fase:** 2 - Sistema de Autenticação
**Prioridade:** 🔴 Crítica
**Dependências:** Fase 1 (Estrutura Base)

---

## 🎯 Objetivo

Implementar sistema de autenticação robusto e seguro usando NextAuth.js v5 (Auth.js), com suporte a login tradicional (email/senha) e OAuth (Google, Microsoft).

---

## 📦 Pacotes Necessários

```bash
npm install next-auth@beta @auth/prisma-adapter
npm install bcryptjs
npm install @types/bcryptjs -D
npm install resend # para envio de emails
```

---

## 🗂️ Estrutura de Arquivos

```
src/
├── app/
│   ├── (auth)/                    # Grupo de rotas de autenticação
│   │   ├── login/
│   │   │   └── page.tsx          # Página de login
│   │   ├── cadastro/
│   │   │   └── page.tsx          # Página de cadastro
│   │   ├── recuperar-senha/
│   │   │   └── page.tsx          # Recuperar senha
│   │   ├── redefinir-senha/
│   │   │   └── page.tsx          # Redefinir senha (com token)
│   │   └── verificar-email/
│   │       └── page.tsx          # Verificação de email
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # Auth routes
│   │   └── register/
│   │       └── route.ts          # Endpoint de registro
│   └── perfil/
│       └── page.tsx               # Página de perfil do usuário
├── lib/
│   ├── auth.ts                    # Configuração do NextAuth
│   ├── auth-options.ts            # Opções de autenticação
│   └── email.ts                   # Funções de envio de email
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx          # Formulário de login
│   │   ├── RegisterForm.tsx       # Formulário de cadastro
│   │   ├── ResetPasswordForm.tsx  # Formulário de reset de senha
│   │   ├── SocialLogin.tsx        # Botões de login social
│   │   └── VerifyEmailBanner.tsx  # Banner de verificação de email
│   └── providers/
│       └── SessionProvider.tsx    # Provider de sessão
└── middleware.ts                  # Middleware de proteção de rotas
```

---

## 🔧 Implementação Passo a Passo

### PASSO 1: Configurar NextAuth.js

#### 1.1 Criar arquivo de configuração `src/lib/auth.ts`

```typescript
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/dashboard",
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
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
```

#### 1.2 Criar API Route `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

#### 1.3 Atualizar Schema do Prisma

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          String    @default("user")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  subscriptions Subscription[]
  orders        Order[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

---

### PASSO 2: Criar Páginas de Autenticação

#### 2.1 Página de Login `src/app/(auth)/login/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import OrionLogo from "@/components/OrionLogo";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou senha incorretos");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <OrionLogo collapsed={false} />
          </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
          <CardDescription>
            Entre com sua conta para acessar o dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link href="/cadastro" className="text-primary hover:underline font-semibold">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
```

#### 2.2 Página de Cadastro `src/app/(auth)/cadastro/page.tsx`

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import OrionLogo from "@/components/OrionLogo";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de uso",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function CadastroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar conta");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <OrionLogo collapsed={false} />
          </div>
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para começar
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="João Silva"
                {...register("name")}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                {...register("termsAccepted")}
                disabled={loading}
              />
              <label
                htmlFor="terms"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aceito os{" "}
                <Link href="/termos" className="text-primary hover:underline">
                  termos de uso
                </Link>{" "}
                e{" "}
                <Link href="/privacidade" className="text-primary hover:underline">
                  política de privacidade
                </Link>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
```

---

### PASSO 3: Criar API de Registro

#### 3.1 API Route `src/app/api/register/route.ts`

```typescript
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // TODO: Enviar email de verificação

    return NextResponse.json(
      { message: "Usuário criado com sucesso", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
```

---

### PASSO 4: Middleware de Proteção de Rotas

#### 4.1 Criar `src/middleware.ts`

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Rotas protegidas
  const protectedRoutes = ["/dashboard", "/perfil", "/assinaturas", "/checkout"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirecionar para login se não autenticado
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rotas apenas para admins
  const adminRoutes = ["/admin"];
  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/perfil/:path*",
    "/assinaturas/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
};
```

---

### PASSO 5: Variáveis de Ambiente

#### 5.1 Adicionar ao `.env.local`

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui" # Gerar com: openssl rand -base64 32

# OAuth Providers
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"

# Email (Resend)
RESEND_API_KEY="seu-resend-api-key"
```

---

## ✅ Checklist de Implementação

### Setup Inicial
- [ ] Instalar dependências necessárias
- [ ] Configurar variáveis de ambiente
- [ ] Criar schema do Prisma
- [ ] Executar migrations

### Autenticação Base
- [ ] Configurar NextAuth.js
- [ ] Criar API routes de autenticação
- [ ] Implementar página de login
- [ ] Implementar página de cadastro
- [ ] Testar login com credenciais

### OAuth
- [ ] Configurar Google OAuth Console
- [ ] Adicionar provider do Google
- [ ] Testar login com Google

### Proteção de Rotas
- [ ] Criar middleware
- [ ] Proteger rotas do dashboard
- [ ] Implementar RBAC (roles)
- [ ] Testar redirecionamentos

### Recuperação de Senha
- [ ] Criar página de recuperação
- [ ] Implementar envio de email
- [ ] Criar página de redefinição
- [ ] Testar fluxo completo

### Email Verification
- [ ] Implementar envio de email de verificação
- [ ] Criar página de verificação
- [ ] Adicionar banner de "verificar email"

### Perfil do Usuário
- [ ] Criar página de perfil
- [ ] Implementar edição de dados
- [ ] Upload de avatar (opcional)
- [ ] Alterar senha

### Testes
- [ ] Testar todos os fluxos de autenticação
- [ ] Testar proteção de rotas
- [ ] Testar OAuth
- [ ] Validar segurança

---

## 🔒 Considerações de Segurança

1. **Senhas**: Sempre usar bcrypt com salt rounds adequado (10+)
2. **CSRF**: NextAuth.js já protege contra CSRF
3. **Rate Limiting**: Implementar limite de tentativas de login
4. **Email Verification**: Obrigatório para produção
5. **2FA**: Considerar implementar em versão futura
6. **Session Management**: Usar JWT com expiração adequada

---

## 📚 Recursos

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**Status:** 📝 Pronto para implementação
**Última atualização:** 16/01/2026
