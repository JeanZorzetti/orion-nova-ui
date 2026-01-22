import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.describe("Public Pages", () => {
    test("should navigate to home page", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Orion/i);
    });

    test("should navigate to produto page", async ({ page }) => {
      await page.goto("/produto");
      await expect(page).toHaveURL(/\/produto/);
    });

    test("should navigate to sobre page", async ({ page }) => {
      await page.goto("/sobre");
      await expect(page).toHaveURL(/\/sobre/);
    });

    test("should navigate to features page", async ({ page }) => {
      await page.goto("/features");
      await expect(page).toHaveURL(/\/features/);
    });

    test("should navigate to solucoes page", async ({ page }) => {
      await page.goto("/solucoes");
      await expect(page).toHaveURL(/\/solucoes/);
    });

    test("should navigate to precos page", async ({ page }) => {
      await page.goto("/precos");
      await expect(page).toHaveURL(/\/precos/);
    });

    test("should navigate to ajuda page", async ({ page }) => {
      await page.goto("/ajuda");
      await expect(page).toHaveURL(/\/ajuda/);
    });

    test("should navigate to contato page", async ({ page }) => {
      await page.goto("/contato");
      await expect(page).toHaveURL(/\/contato/);
    });

    test("should navigate to blog page", async ({ page }) => {
      await page.goto("/blog");
      await expect(page).toHaveURL(/\/blog/);
    });

    test("should navigate to carreiras page", async ({ page }) => {
      await page.goto("/carreiras");
      await expect(page).toHaveURL(/\/carreiras/);
    });

    test("should navigate to termos page", async ({ page }) => {
      await page.goto("/termos");
      await expect(page).toHaveURL(/\/termos/);
    });

    test("should navigate to privacidade page", async ({ page }) => {
      await page.goto("/privacidade");
      await expect(page).toHaveURL(/\/privacidade/);
    });
  });

  test.describe("404 Page", () => {
    test("should show not found page for invalid routes", async ({ page }) => {
      const response = await page.goto("/pagina-inexistente-xyz123");
      // Not found page should return 404 status
      expect(response?.status()).toBe(404);
    });
  });

  test.describe("Mobile Navigation", () => {
    test("should display correctly on mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
      await expect(page).toHaveTitle(/Orion/i);
    });
  });
});
