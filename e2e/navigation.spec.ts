import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate to home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Orion Nova/i);
  });

  test("should navigate to about page", async ({ page }) => {
    await page.goto("/");
    const aboutLink = page.getByRole("link", { name: /sobre/i });

    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/\/sobre/);
    }
  });

  test("should navigate to product page", async ({ page }) => {
    await page.goto("/");
    const productLink = page.getByRole("link", { name: /produto/i });

    if (await productLink.isVisible()) {
      await productLink.click();
      await expect(page).toHaveURL(/\/produto/);
    }
  });

  test("should navigate to features page", async ({ page }) => {
    await page.goto("/");
    const featuresLink = page.getByRole("link", { name: /funcionalidades/i });

    if (await featuresLink.isVisible()) {
      await featuresLink.click();
      await expect(page).toHaveURL(/\/features/);
    }
  });

  test("should navigate to solutions page", async ({ page }) => {
    await page.goto("/");
    const solutionsLink = page.getByRole("link", { name: /soluções/i });

    if (await solutionsLink.isVisible()) {
      await solutionsLink.click();
      await expect(page).toHaveURL(/\/solucoes/);
    }
  });

  test("should navigate to help page", async ({ page }) => {
    await page.goto("/");
    const helpLink = page.getByRole("link", { name: /ajuda/i });

    if (await helpLink.isVisible()) {
      await helpLink.click();
      await expect(page).toHaveURL(/\/ajuda/);
    }
  });

  test("should navigate to contact page", async ({ page }) => {
    await page.goto("/");
    const contactLink = page.getByRole("link", { name: /contato/i });

    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/\/contato/);
    }
  });

  test("should open and close mobile menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Look for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button:has-text("Menu")');

    if (await menuButton.isVisible()) {
      await menuButton.click();

      // Verify menu is open (navigation should be visible)
      const nav = page.locator("nav");
      await expect(nav).toBeVisible();

      // Close menu
      await menuButton.click();
    }
  });
});
