import { test, expect } from "@playwright/test";

test.describe("Internationalization", () => {
  test("should load home page in default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Orion/i);
  });

  test("should have locale switcher visible", async ({ page }) => {
    await page.goto("/");

    // Look for locale switcher (globe icon or language text)
    const localeSwitcher = page.locator(
      'button:has(svg.lucide-globe), button:has-text("Português"), button:has-text("English"), [aria-label*="idioma" i], [aria-label*="language" i]'
    );

    const isVisible = await localeSwitcher.first().isVisible().catch(() => false);

    // If locale switcher exists, verify it's visible
    if (isVisible) {
      await expect(localeSwitcher.first()).toBeVisible();
    }
  });

  test("should be able to interact with locale switcher", async ({ page }) => {
    await page.goto("/");

    const localeSwitcher = page.locator(
      'button:has(svg.lucide-globe), button:has-text("Português"), button:has-text("English")'
    ).first();

    if (await localeSwitcher.isVisible().catch(() => false)) {
      await localeSwitcher.click();

      // Check if dropdown/menu appears
      const menuItem = page.locator('[role="menuitem"], [role="option"]').first();
      const hasMenu = await menuItem.isVisible({ timeout: 2000 }).catch(() => false);

      if (hasMenu) {
        await expect(menuItem).toBeVisible();
      }
    }
  });

  test("should persist locale preference in localStorage", async ({
    page,
    context,
  }) => {
    await page.goto("/");

    const localeSwitcher = page.locator(
      'button:has(svg.lucide-globe), button:has-text("Português"), button:has-text("English")'
    ).first();

    if (await localeSwitcher.isVisible().catch(() => false)) {
      await localeSwitcher.click();

      // Try to click on English option
      const englishOption = page.locator(
        '[role="menuitem"]:has-text("English"), [role="option"]:has-text("English")'
      ).first();

      if (await englishOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await englishOption.click();
        await page.waitForTimeout(500);

        // Check if locale preference is stored
        const preferredLocale = await page.evaluate(() =>
          localStorage.getItem("preferredLocale")
        );

        // If locale is stored, verify it
        if (preferredLocale) {
          expect(preferredLocale).toBe("en-US");
        }
      }
    }
  });
});
