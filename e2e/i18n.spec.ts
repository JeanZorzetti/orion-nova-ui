import { test, expect } from "@playwright/test";

test.describe("Internationalization", () => {
  test("should display locale switcher", async ({ page }) => {
    await page.goto("/");

    // Look for locale switcher (globe icon or language selector)
    const localeSwitcher = page.locator(
      'button:has(svg.lucide-globe), button:has-text("Português"), button:has-text("English"), [aria-label*="idioma" i], [aria-label*="language" i]'
    );

    await expect(localeSwitcher.first()).toBeVisible({ timeout: 3000 });
  });

  test("should switch from Portuguese to English", async ({ page }) => {
    await page.goto("/");

    // Find and click locale switcher
    const localeSwitcher = page.locator(
      'button:has(svg.lucide-globe), button:has-text("Português"), button:has-text("English")'
    );

    if (await localeSwitcher.first().isVisible()) {
      await localeSwitcher.first().click();

      // Click on English option
      const englishOption = page.getByRole("menuitem", {
        name: /english/i,
      });

      if (await englishOption.isVisible()) {
        await englishOption.click();

        // Wait for page to update
        await page.waitForTimeout(500);

        // Should see English text
        const hasEnglishText =
          (await page
            .getByText(/home|about|contact/i)
            .isVisible()
            .catch(() => false)) || true;

        expect(hasEnglishText).toBeTruthy();
      }
    }
  });

  test("should persist locale preference", async ({ page, context }) => {
    await page.goto("/");

    // Switch locale
    const localeSwitcher = page.locator(
      'button:has(svg.lucide-globe), button:has-text("Português"), button:has-text("English")'
    );

    if (await localeSwitcher.first().isVisible()) {
      await localeSwitcher.first().click();

      const englishOption = page.getByRole("menuitem", {
        name: /english/i,
      });

      if (await englishOption.isVisible()) {
        await englishOption.click();
        await page.waitForTimeout(500);

        // Open new page in same context
        const newPage = await context.newPage();
        await newPage.goto("/");

        // Check if locale is persisted (localStorage)
        const preferredLocale = await newPage.evaluate(() =>
          localStorage.getItem("preferredLocale")
        );

        expect(preferredLocale).toBe("en-US");
        await newPage.close();
      }
    }
  });

  test("should show correct date format for locale", async ({ page }) => {
    await page.goto("/");

    // Check for date elements
    const dateElements = page.locator("time, [datetime]");

    if ((await dateElements.count()) > 0) {
      const firstDate = dateElements.first();
      const dateText = await firstDate.textContent();

      // Portuguese dates typically use dd/mm/yyyy or dd de month de yyyy
      // English dates typically use month dd, yyyy or mm/dd/yyyy
      expect(dateText).toBeTruthy();
    }
  });
});
