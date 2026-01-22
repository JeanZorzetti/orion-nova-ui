import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("Login Page", () => {
    test("should display login page with correct title", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
    });

    test("should have email and password inputs", async ({ page }) => {
      await page.goto("/login");

      const emailInput = page.locator("#email");
      const passwordInput = page.locator("#password");

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    });

    test("should have submit button", async ({ page }) => {
      await page.goto("/login");
      const submitButton = page.getByRole("button", { name: "Entrar" });
      await expect(submitButton).toBeVisible();
    });

    test("should have link to signup page", async ({ page }) => {
      await page.goto("/login");
      const signupLink = page.getByRole("link", { name: "Cadastre-se" });
      await expect(signupLink).toBeVisible();
    });

    test("should navigate to signup page when clicking link", async ({
      page,
    }) => {
      await page.goto("/login");
      await page.getByRole("link", { name: "Cadastre-se" }).click();
      await expect(page).toHaveURL(/\/cadastro/);
    });

    test("should have forgot password link", async ({ page }) => {
      await page.goto("/login");
      const forgotLink = page.getByRole("link", { name: /esqueceu a senha/i });
      await expect(forgotLink).toBeVisible();
    });

    test("should have Google sign in button", async ({ page }) => {
      await page.goto("/login");
      const googleButton = page.getByRole("button", {
        name: /continuar com google/i,
      });
      await expect(googleButton).toBeVisible();
    });
  });

  test.describe("Signup Page", () => {
    test("should display signup page with correct title", async ({ page }) => {
      await page.goto("/cadastro");
      await expect(
        page.getByRole("heading", { name: "Criar Conta" })
      ).toBeVisible();
    });

    test("should have all required inputs", async ({ page }) => {
      await page.goto("/cadastro");

      await expect(page.locator("#name")).toBeVisible();
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
      await expect(page.locator("#confirmPassword")).toBeVisible();
    });

    test("should have submit button", async ({ page }) => {
      await page.goto("/cadastro");
      const submitButton = page.getByRole("button", { name: "Criar conta" });
      await expect(submitButton).toBeVisible();
    });

    test("should have link to login page", async ({ page }) => {
      await page.goto("/cadastro");
      const loginLink = page.getByRole("link", { name: "Faça login" });
      await expect(loginLink).toBeVisible();
    });

    test("should navigate to login page when clicking link", async ({
      page,
    }) => {
      await page.goto("/cadastro");
      await page.getByRole("link", { name: "Faça login" }).click();
      await expect(page).toHaveURL(/\/login/);
    });

    test("should show error when passwords do not match", async ({ page }) => {
      await page.goto("/cadastro");

      await page.locator("#name").fill("Test User");
      await page.locator("#email").fill("test@example.com");
      await page.locator("#password").fill("password123");
      await page.locator("#confirmPassword").fill("different123");

      await page.getByRole("button", { name: "Criar conta" }).click();

      await expect(page.getByText("As senhas não coincidem")).toBeVisible();
    });

    test("should show error when password is too short", async ({ page }) => {
      await page.goto("/cadastro");

      await page.locator("#name").fill("Test User");
      await page.locator("#email").fill("test@example.com");
      await page.locator("#password").fill("123");
      await page.locator("#confirmPassword").fill("123");

      await page.getByRole("button", { name: "Criar conta" }).click();

      await expect(
        page.getByText("A senha deve ter pelo menos 6 caracteres")
      ).toBeVisible();
    });
  });

  test.describe("Forgot Password Page", () => {
    test("should display forgot password page", async ({ page }) => {
      await page.goto("/esqueci-senha");
      // Check if page loads
      await expect(page).toHaveURL(/\/esqueci-senha/);
    });
  });
});
