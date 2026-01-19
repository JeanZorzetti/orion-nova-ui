import { test, expect } from "@playwright/test";

test.describe("Global Search", () => {
  test("should open search modal with keyboard shortcut", async ({ page }) => {
    await page.goto("/");

    // Press Ctrl+K or Cmd+K to open search
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+K" : "Control+K"
    );

    // Search dialog should be visible
    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible({ timeout: 2000 });
  });

  test("should open search modal by clicking search button", async ({
    page,
  }) => {
    await page.goto("/");

    // Click search button/icon
    const searchButton = page.locator(
      'button[aria-label*="buscar" i], button:has-text("Buscar"), button:has(svg.lucide-search)'
    );

    if (await searchButton.first().isVisible()) {
      await searchButton.first().click();

      const searchInput = page.getByPlaceholder(/buscar/i);
      await expect(searchInput).toBeVisible();
    }
  });

  test("should show empty state when no query", async ({ page }) => {
    await page.goto("/");

    // Open search
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+K" : "Control+K"
    );

    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();

    // Should show empty state message
    await expect(
      page.getByText(/digite.*2.*caracteres|mínimo.*caracteres/i)
    ).toBeVisible();
  });

  test("should not search with less than 2 characters", async ({ page }) => {
    await page.goto("/");

    // Open search
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+K" : "Control+K"
    );

    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();

    // Type single character
    await searchInput.fill("a");

    // Wait a bit for debounce
    await page.waitForTimeout(500);

    // Should still show empty state
    await expect(
      page.getByText(/digite.*2.*caracteres|mínimo.*caracteres/i)
    ).toBeVisible();
  });

  test("should perform search with valid query", async ({ page }) => {
    await page.goto("/");

    // Open search
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+K" : "Control+K"
    );

    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();

    // Type search query
    await searchInput.fill("next");

    // Wait for results
    await page.waitForTimeout(500);

    // Should show results or "no results" message
    const hasResults =
      (await page
        .locator("text=/artigos|categorias|páginas/i")
        .isVisible()
        .catch(() => false)) ||
      (await page
        .locator("text=/nenhum.*resultado/i")
        .isVisible()
        .catch(() => false));

    expect(hasResults).toBeTruthy();
  });

  test("should show no results message for non-existent query", async ({
    page,
  }) => {
    await page.goto("/");

    // Open search
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+K" : "Control+K"
    );

    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();

    // Type query that should return no results
    await searchInput.fill("xyzabc123nonexistent");

    // Wait for search to complete
    await page.waitForTimeout(500);

    // Should show no results message
    await expect(page.getByText(/nenhum.*resultado/i)).toBeVisible({
      timeout: 3000,
    });
  });

  test("should close search modal on escape", async ({ page }) => {
    await page.goto("/");

    // Open search
    await page.keyboard.press(
      process.platform === "darwin" ? "Meta+K" : "Control+K"
    );

    const searchInput = page.getByPlaceholder(/buscar/i);
    await expect(searchInput).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");

    // Search should be closed
    await expect(searchInput).not.toBeVisible();
  });
});
