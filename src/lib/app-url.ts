/**
 * URL pública da aplicação, para success_url/return_url/links de e-mail.
 *
 * `NEXT_PUBLIC_APP_URL` não está configurada na Vercel; sem os fallbacks o
 * cliente paga e é jogado em http://localhost:3000. `NEXTAUTH_URL` já existe lá
 * e `VERCEL_PROJECT_PRODUCTION_URL` a Vercel injeta sozinha.
 * Só use no servidor — as duas últimas não existem no bundle do browser.
 */
export function appUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);

  return (fromEnv || "http://localhost:3000").replace(/\/+$/, "");
}
