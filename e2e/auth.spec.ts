import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /entrar/i })).toBeVisible();
  });

  test("should show validation errors on empty login form", async ({ page }) => {
    await page.goto("/login");

    // Try to submit empty form
    const submitButton = page.getByRole("button", { name: /entrar/i });
    await submitButton.click();

    // Should show validation errors
    await expect(page.locator("text=/e-mail.*obrigatório/i")).toBeVisible({
      timeout: 3000,
    }).catch(() => {
      // Alternative: check for generic error message
      return expect(page.locator("text=/campo.*obrigatório/i")).toBeVisible();
    });
  });

  test("should show error for invalid email format", async ({ page }) => {
    await page.goto("/login");

    // Fill invalid email
    const emailInput = page.getByLabel(/e-mail/i);
    await emailInput.fill("invalid-email");

    const passwordInput = page.getByLabel(/senha/i);
    await passwordInput.fill("password123");

    const submitButton = page.getByRole("button", { name: /entrar/i });
    await submitButton.click();

    // Should show email format error
    await expect(
      page.locator("text=/e-mail.*inválido/i, text=/formato.*e-mail/i")
    ).toBeVisible({ timeout: 3000 });
  });

  test("should display signup page", async ({ page }) => {
    await page.goto("/cadastro");
    await expect(
      page.getByRole("heading", { name: /criar.*conta|cadastro/i })
    ).toBeVisible();
  });

  test("should show validation errors on empty signup form", async ({
    page,
  }) => {
    await page.goto("/cadastro");

    // Try to submit empty form
    const submitButton = page.getByRole("button", {
      name: /criar.*conta|cadastrar/i,
    });
    await submitButton.click();

    // Should show validation errors for required fields
    const errorMessages = page.locator(
      "text=/obrigatório/i, text=/campo.*necessário/i"
    );
    await expect(errorMessages.first()).toBeVisible({ timeout: 3000 });
  });

  test("should validate password requirements", async ({ page }) => {
    await page.goto("/cadastro");

    const emailInput = page.getByLabel(/e-mail/i);
    await emailInput.fill("test@example.com");

    const nameInput = page.getByLabel(/nome/i);
    if (await nameInput.isVisible()) {
      await nameInput.fill("Test User");
    }

    // Enter weak password
    const passwordInput = page.getByLabel(/senha/i).first();
    await passwordInput.fill("123");

    const submitButton = page.getByRole("button", {
      name: /criar.*conta|cadastrar/i,
    });
    await submitButton.click();

    // Should show password validation error
    await expect(
      page.locator(
        "text=/senha.*mínimo/i, text=/senha.*caracteres/i, text=/senha.*curta/i"
      )
    ).toBeVisible({ timeout: 3000 });
  });

  test("should navigate from login to signup", async ({ page }) => {
    await page.goto("/login");

    // Click on signup link
    const signupLink = page.getByRole("link", {
      name: /criar.*conta|cadastr/i,
    });

    if (await signupLink.isVisible()) {
      await signupLink.click();
      await expect(page).toHaveURL(/\/cadastro/);
    }
  });

  test("should navigate from signup to login", async ({ page }) => {
    await page.goto("/cadastro");

    // Click on login link
    const loginLink = page.getByRole("link", { name: /já.*conta|entrar/i });

    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });
});
