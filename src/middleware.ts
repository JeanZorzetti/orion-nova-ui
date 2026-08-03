import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Rotas que requerem autenticação
const protectedRoutes = ["/perfil", "/assinaturas", "/dashboard"];

// Rotas apenas para não autenticados
const authRoutes = ["/login", "/cadastro"];

// Rotas apenas para admin
const adminRoutes = ["/admin"];

// Rotas que requerem trial/assinatura ativa (bloqueadas se trial expirado)
const trialRestrictedRoutes = ["/dashboard"];

// Rotas permitidas mesmo com trial expirado (para conversão)
const trialExceptionRoutes = ["/precos", "/checkout", "/perfil"];

export default auth(async (req) => {
  const { nextUrl } = req;
  // req.auth existe mesmo sem sessão; só `user` distingue. Os server components
  // checam `session?.user` — critério diferente aqui gera loop de redirect.
  const isLoggedIn = !!req.auth?.user;
  const isAdmin = req.auth?.user?.role === "ADMIN" || req.auth?.user?.role === "SUPER_ADMIN";

  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isTrialRestrictedRoute = trialRestrictedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isTrialExceptionRoute = trialExceptionRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Redirecionar usuários logados que tentam acessar login/cadastro
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirecionar usuários não logados que tentam acessar rotas protegidas
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirecionar não admins que tentam acessar rotas de admin
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Verificar status do trial para rotas restritas
  if (isLoggedIn && isTrialRestrictedRoute && !isTrialExceptionRoute) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.auth!.user!.id },
        select: {
          subscriptionStatus: true,
          trialEndsAt: true,
          subscriptions: {
            where: { status: "ACTIVE" },
            take: 1,
          },
        },
      });

      if (user) {
        // Se tem assinatura ativa, permitir acesso
        if (user.subscriptions.length > 0) {
          return NextResponse.next();
        }

        // Se está em trial, verificar se expirou
        if (user.subscriptionStatus === "TRIAL") {
          if (user.trialEndsAt) {
            const now = new Date();
            const trialEndsAt = new Date(user.trialEndsAt);
            const isExpired = trialEndsAt.getTime() <= now.getTime();

            if (isExpired) {
              // Atualizar status para EXPIRED
              await prisma.user.update({
                where: { id: req.auth!.user!.id },
                data: { subscriptionStatus: "EXPIRED" },
              });

              // Redirecionar para página de preços com mensagem
              const pricingUrl = new URL("/precos", req.url);
              pricingUrl.searchParams.set("trial", "expired");
              pricingUrl.searchParams.set("from", nextUrl.pathname);
              return NextResponse.redirect(pricingUrl);
            }
          }
        }

        // Se status é EXPIRED ou CANCELLED, bloquear acesso
        if (user.subscriptionStatus === "EXPIRED" || user.subscriptionStatus === "CANCELLED") {
          const pricingUrl = new URL("/precos", req.url);
          pricingUrl.searchParams.set("trial", "expired");
          pricingUrl.searchParams.set("from", nextUrl.pathname);
          return NextResponse.redirect(pricingUrl);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar trial no middleware:", error);
      // Fail closed. Liberar acesso aqui foi o que escondeu uma queda inteira de
      // produção: o banco estava fora, o dashboard abria e todo endpoint dava
      // 500. Melhor mandar para /precos com o motivo explícito.
      const errorUrl = new URL("/precos", req.url);
      errorUrl.searchParams.set("erro", "indisponivel");
      errorUrl.searchParams.set("from", nextUrl.pathname);
      return NextResponse.redirect(errorUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Proteger estas rotas e verificar trial
    "/perfil/:path*",
    "/assinaturas/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/cadastro",
    "/precos",
    "/checkout/:path*",
  ],
};
