// Utility para detectar locale do navegador
export function detectBrowserLocale(): string {
  if (typeof window === "undefined") return "pt-BR";

  const browserLocale =
    navigator.language || (navigator as any).userLanguage || "pt-BR";

  // Mapear locales do navegador para nossos locales suportados
  if (browserLocale.startsWith("en")) return "en-US";
  if (browserLocale.startsWith("pt")) return "pt-BR";

  return "pt-BR"; // Default
}

// Utility para alternar locale
export function getAlternateLocale(currentLocale: string): string {
  return currentLocale === "pt-BR" ? "en-US" : "pt-BR";
}

// Utility para obter o nome do locale para exibição
export function getLocaleDisplayName(locale: string): string {
  const names: Record<string, string> = {
    "pt-BR": "Português",
    "en-US": "English",
  };
  return names[locale] || locale;
}

// Utility para formatar moeda de acordo com o locale
export function formatCurrency(
  amount: number,
  locale: string = "pt-BR"
): string {
  const currency = locale === "pt-BR" ? "BRL" : "USD";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

// Utility para formatar data de acordo com o locale
export function formatDate(
  date: Date | string,
  locale: string = "pt-BR",
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}
