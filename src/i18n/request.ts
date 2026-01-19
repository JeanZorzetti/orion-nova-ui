import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Locales suportados
export const locales = ["pt-BR", "en-US"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validar que o locale é suportado
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
