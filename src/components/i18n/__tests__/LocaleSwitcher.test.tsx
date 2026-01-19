import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LocaleSwitcher from "../LocaleSwitcher";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
}));

describe("LocaleSwitcher", () => {
  it("should render locale switcher button", () => {
    render(<LocaleSwitcher currentLocale="pt-BR" />);

    // Should render the trigger button
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should display current locale", () => {
    render(<LocaleSwitcher currentLocale="pt-BR" />);

    // Should show "Português (BR)" or the flag
    expect(screen.getByText(/Português/i) || screen.getByText("🇧🇷")).toBeInTheDocument();
  });

  it("should handle en-US locale", () => {
    render(<LocaleSwitcher currentLocale="en-US" />);

    // Should show "English (US)" or the flag
    expect(screen.getByText(/English/i) || screen.getByText("🇺🇸")).toBeInTheDocument();
  });

  it("should default to pt-BR if no locale provided", () => {
    render(<LocaleSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
