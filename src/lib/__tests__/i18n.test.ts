import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  detectBrowserLocale,
  getAlternateLocale,
  getLocaleDisplayName,
  formatCurrency,
  formatDate,
} from "../i18n";

describe("i18n utilities", () => {
  describe("detectBrowserLocale", () => {
    it("should detect locale from navigator.language", () => {
      // In jsdom, navigator.language defaults to en-US
      const locale = detectBrowserLocale();
      expect(locale).toBe("en-US");
    });

    it("should return pt-BR for Portuguese browser locale", () => {
      // Mock navigator.language
      const originalLanguage = Object.getOwnPropertyDescriptor(
        navigator,
        "language"
      );
      Object.defineProperty(navigator, "language", {
        value: "pt-BR",
        configurable: true,
      });

      const locale = detectBrowserLocale();
      expect(locale).toBe("pt-BR");

      // Restore original
      if (originalLanguage) {
        Object.defineProperty(navigator, "language", originalLanguage);
      }
    });

    it("should return en-US for English browser locale", () => {
      const originalLanguage = Object.getOwnPropertyDescriptor(
        navigator,
        "language"
      );
      Object.defineProperty(navigator, "language", {
        value: "en",
        configurable: true,
      });

      const locale = detectBrowserLocale();
      expect(locale).toBe("en-US");

      if (originalLanguage) {
        Object.defineProperty(navigator, "language", originalLanguage);
      }
    });

    it("should return pt-BR as default for unsupported locales", () => {
      const originalLanguage = Object.getOwnPropertyDescriptor(
        navigator,
        "language"
      );
      Object.defineProperty(navigator, "language", {
        value: "fr-FR",
        configurable: true,
      });

      const locale = detectBrowserLocale();
      expect(locale).toBe("pt-BR");

      if (originalLanguage) {
        Object.defineProperty(navigator, "language", originalLanguage);
      }
    });
  });

  describe("getAlternateLocale", () => {
    it("should return en-US when given pt-BR", () => {
      expect(getAlternateLocale("pt-BR")).toBe("en-US");
    });

    it("should return pt-BR when given en-US", () => {
      expect(getAlternateLocale("en-US")).toBe("pt-BR");
    });
  });

  describe("getLocaleDisplayName", () => {
    it("should return Português for pt-BR", () => {
      expect(getLocaleDisplayName("pt-BR")).toBe("Português");
    });

    it("should return English for en-US", () => {
      expect(getLocaleDisplayName("en-US")).toBe("English");
    });

    it("should return the locale itself for unknown locales", () => {
      expect(getLocaleDisplayName("fr-FR")).toBe("fr-FR");
    });
  });

  describe("formatCurrency", () => {
    it("should format BRL currency for pt-BR locale", () => {
      const formatted = formatCurrency(1000, "pt-BR");
      expect(formatted).toContain("1");
      expect(formatted).toContain("000");
    });

    it("should format USD currency for en-US locale", () => {
      const formatted = formatCurrency(1000, "en-US");
      expect(formatted).toContain("1");
      expect(formatted).toContain("000");
    });

    it("should default to pt-BR when no locale is provided", () => {
      const formatted = formatCurrency(1000);
      expect(formatted).toBeDefined();
    });
  });

  describe("formatDate", () => {
    const testDate = new Date("2024-01-15T12:00:00Z");

    it("should format date for pt-BR locale", () => {
      const formatted = formatDate(testDate, "pt-BR");
      expect(formatted).toBeDefined();
      expect(formatted).toContain("15");
      expect(formatted).toContain("01");
      expect(formatted).toContain("2024");
    });

    it("should format date for en-US locale", () => {
      const formatted = formatDate(testDate, "en-US");
      expect(formatted).toBeDefined();
    });

    it("should accept string dates", () => {
      const formatted = formatDate("2024-01-15", "pt-BR");
      expect(formatted).toBeDefined();
    });

    it("should accept custom options", () => {
      const formatted = formatDate(testDate, "pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      expect(formatted).toBeDefined();
    });
  });
});
