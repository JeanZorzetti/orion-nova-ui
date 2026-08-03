import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Só checagens que cabem no JWT. A verificação de trial vivia aqui com uma
// query do Prisma que SEMPRE falhava neste contexto — o fail-open engolia o
// erro, então o gate nunca funcionou em produção. Ela mora agora no
// dashboard/layout.tsx, que é server component e roda onde o Prisma funciona.
// Não traga banco de volta para cá.

// Rotas que requerem autenticação
const protectedRoutes = ["/perfil", "/assinaturas", "/dashboard"];

// Rotas apenas para não autenticados
const authRoutes = ["/login", "/cadastro"];

// Rotas apenas para admin
const adminRoutes = ["/admin"];

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

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/perfil/:path*",
    "/assinaturas/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/cadastro",
  ],
};
