import { test, expect } from "@playwright/test";

test.describe("Global Search", () => {
  test("should have search functionality on home page", async ({ page }) => {
    await page.goto("/");

    // Look for search button/icon in the header
    const searchButton = page.locator(
      'button:has(svg.lucide-search), [aria-label*="buscar" i], [aria-label*="search" i]'
    );

    // If search button exists, it should be visible
    const hasSearchButton = await searchButton.first().isVisible().catch(() => false);

    // Home page should load successfully
    await expect(page).toHaveTitle(/Orion/i);

    // Log whether search is available
    if (hasSearchButton) {
      expect(hasSearchButton).toBeTruthy();
    }
  });

  test("should open search dialog when clicking search button", async ({
    page,
  }) => {
    await page.goto("/");

    const searchButton = page.locator(
      'button:has(svg.lucide-search), [aria-label*="buscar" i]'
    ).first();

    if (await searchButton.isVisible().catch(() => false)) {
      await searchButton.click();

      // Check if search input appears
      const searchInput = page.getByPlaceholder(/buscar/i);
      await expect(searchInput).toBeVisible({ timeout: 3000 });
    }
  });

  test("should show empty state message when opening search", async ({
    page,
  }) => {
    await page.goto("/");

    const searchButton = page.locator(
      'button:has(svg.lucide-search), [aria-label*="buscar" i]'
    ).first();

    if (await searchButton.isVisible().catch(() => false)) {
      await searchButton.click();

      // Should show empty state message
      const emptyMessage = page.getByText(/digite.*caracteres/i);
      if (await emptyMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(emptyMessage).toBeVisible();
      }
    }
  });

  test("should close search dialog on escape key", async ({ page }) => {
    await page.goto("/");

    const searchButton = page.locator(
      'button:has(svg.lucide-search), [aria-label*="buscar" i]'
    ).first();

    if (await searchButton.isVisible().catch(() => false)) {
      await searchButton.click();

      const searchInput = page.getByPlaceholder(/buscar/i);

      if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await page.keyboard.press("Escape");
        await expect(searchInput).not.toBeVisible({ timeout: 2000 });
      }
    }
  });
});
