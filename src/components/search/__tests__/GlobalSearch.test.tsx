import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GlobalSearch from "../GlobalSearch";

// Mock trackSearch
vi.mock("@/lib/analytics", () => ({
  trackSearch: vi.fn(),
}));

const mockSearchResults = {
  posts: [
    {
      id: "1",
      title: "Como implementar autenticação com Next.js",
      excerpt: "Aprenda a implementar autenticação segura...",
      url: "/blog/autenticacao-nextjs",
      type: "post" as const,
      category: { name: "Tutorial" },
    },
  ],
  categories: [
    {
      id: "c1",
      title: "Tutorial",
      description: "Tutoriais e guias práticos",
      url: "/blog/categoria/tutorial",
      type: "category" as const,
      _count: { posts: 15 },
    },
  ],
};

describe("GlobalSearch", () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should not render when closed", () => {
      render(<GlobalSearch open={false} onOpenChange={mockOnOpenChange} />);
      expect(screen.queryByPlaceholderText("Buscar no site...")).not.toBeInTheDocument();
    });

    it("should render search input when open", () => {
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);
      expect(screen.getByPlaceholderText("Buscar no site...")).toBeInTheDocument();
    });

    it("should show initial empty state", () => {
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);
      expect(
        screen.getByText("Digite pelo menos 2 caracteres para buscar")
      ).toBeInTheDocument();
    });
  });

  describe("Search behavior", () => {
    it("should not search with less than 2 characters", async () => {
      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "a");

      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 400));

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("should search with 2 or more characters", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ results: mockSearchResults }),
      });

      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "nex");

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/api/search?q=nex");
      }, { timeout: 1000 });
    });

    it("should display search results", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ results: mockSearchResults }),
      });

      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "next");

      await waitFor(() => {
        expect(
          screen.queryByText("Como implementar autenticação com Next.js")
        ).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it("should display no results message when nothing found", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ results: {} }),
      });

      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "xyz123");

      await waitFor(() => {
        expect(
          screen.queryByText(/Nenhum resultado encontrado para/)
        ).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it("should handle search errors gracefully", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      fetchMock.mockRejectedValue(new Error("Network error"));

      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "test");

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          "Search error:",
          expect.any(Error)
        );
      }, { timeout: 1000 });

      consoleError.mockRestore();
    });
  });

  describe("Result categories", () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ results: mockSearchResults }),
      });
    });

    it("should display posts section", async () => {
      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "next");

      await waitFor(() => {
        expect(screen.queryByText("Artigos do Blog")).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it("should display categories section", async () => {
      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "tutorial");

      await waitFor(() => {
        expect(screen.queryByText("Categorias")).toBeInTheDocument();
        expect(screen.queryByText("15 posts")).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it("should display excerpts", async () => {
      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "next");

      await waitFor(() => {
        expect(
          screen.queryByText("Aprenda a implementar autenticação segura...")
        ).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });

  describe("Result selection", () => {
    beforeEach(() => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ results: mockSearchResults }),
      });
    });

    it("should call onOpenChange when selecting a result", async () => {
      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "next");

      await waitFor(() => {
        expect(
          screen.queryByText("Como implementar autenticação com Next.js")
        ).toBeInTheDocument();
      }, { timeout: 1000 });

      const resultButton = screen.getByText(
        "Como implementar autenticação com Next.js"
      ).closest("button");

      if (resultButton) {
        await user.click(resultButton);

        await waitFor(() => {
          expect(mockOnOpenChange).toHaveBeenCalledWith(false);
        });
      }
    });
  });

  describe("Result footer", () => {
    it("should display total results count", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ results: mockSearchResults }),
      });

      const user = userEvent.setup();
      render(<GlobalSearch open={true} onOpenChange={mockOnOpenChange} />);

      const input = screen.getByPlaceholderText("Buscar no site...");
      await user.type(input, "next");

      await waitFor(() => {
        expect(screen.queryByText(/resultados? encontrados?/)).toBeInTheDocument();
      }, { timeout: 1000 });
    });
  });
});
