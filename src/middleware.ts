import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Rotas que requerem autenticação
const protectedRoutes = ["/perfil", "/assinaturas", "/dashboard"];

// Rotas apenas para não autenticados
const authRoutes = ["/login", "/cadastro"];

// Rotas apenas para admin
const adminRoutes = ["/admin"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
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
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirecionar usuários não logados que tentam acessar rotas protegidas
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirecionar não admins que tentam acessar rotas de admin
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Proteger estas rotas
    "/perfil/:path*",
    "/assinaturas/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/cadastro",
  ],
};
