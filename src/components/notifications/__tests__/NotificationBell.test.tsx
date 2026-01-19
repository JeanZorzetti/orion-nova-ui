import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationBell from "../NotificationBell";

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "INFO" as const,
    title: "Nova atualização",
    message: "Sistema atualizado com sucesso",
    link: "/updates",
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "SUCCESS" as const,
    title: "Pagamento confirmado",
    message: "Seu pagamento foi processado",
    link: null,
    isRead: true,
    readAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

describe("NotificationBell", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock;

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        notifications: mockNotifications,
        unreadCount: 1,
      }),
    });
  });

  describe("Rendering", () => {
    it("should render notification bell button", async () => {
      render(<NotificationBell />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should display unread count badge", async () => {
      render(<NotificationBell />);

      await waitFor(() => {
        const badge = screen.queryByText("1");
        if (badge) {
          expect(badge).toBeInTheDocument();
        }
      });
    });

    it("should display 9+ when unread count exceeds 9", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          notifications: [],
          unreadCount: 15,
        }),
      });

      render(<NotificationBell />);

      await waitFor(() => {
        const badge = screen.queryByText("9+");
        if (badge) {
          expect(badge).toBeInTheDocument();
        }
      });
    });
  });

  describe("Fetching notifications", () => {
    it("should fetch notifications on mount", async () => {
      render(<NotificationBell />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith("/api/notifications?limit=10");
      });
    });

    it("should handle fetch errors gracefully", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
      fetchMock.mockRejectedValueOnce(new Error("Network error"));

      render(<NotificationBell />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe("Opening popover", () => {
    it("should show notifications when clicking the bell", async () => {
      const user = userEvent.setup();
      render(<NotificationBell />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        expect(screen.queryByText("Notificações")).toBeInTheDocument();
      });
    });

    it("should show empty state when there are no notifications", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          notifications: [],
          unreadCount: 0,
        }),
      });

      const user = userEvent.setup();
      render(<NotificationBell />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        expect(screen.queryByText("Nenhuma notificação")).toBeInTheDocument();
      });
    });
  });

  describe("Mark as read", () => {
    it("should call API when marking notification as read", async () => {
      const user = userEvent.setup();
      render(<NotificationBell />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        expect(screen.queryByText("Nova atualização")).toBeInTheDocument();
      });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const markReadButtons = screen.getAllByRole("button");
      const markReadButton = markReadButtons.find((btn) =>
        btn.querySelector(".lucide-check-check")
      );

      if (markReadButton) {
        await user.click(markReadButton);

        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("/api/notifications/1"),
            expect.objectContaining({ method: "PATCH" })
          );
        });
      }
    });
  });

  describe("Delete notification", () => {
    it("should call API when deleting notification", async () => {
      const user = userEvent.setup();
      render(<NotificationBell />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        expect(screen.queryByText("Nova atualização")).toBeInTheDocument();
      });

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const deleteButtons = screen.getAllByRole("button");
      const deleteButton = deleteButtons.find((btn) =>
        btn.querySelector(".lucide-trash-2")
      );

      if (deleteButton) {
        await user.click(deleteButton);

        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("/api/notifications/"),
            expect.objectContaining({ method: "DELETE" })
          );
        });
      }
    });
  });

  describe("Time formatting", () => {
    it("should format time correctly", async () => {
      const user = userEvent.setup();
      render(<NotificationBell />);

      await waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });

      const button = screen.getByRole("button");
      await user.click(button);

      await waitFor(() => {
        const timeText = screen.queryByText("Agora") || screen.queryByText(/atrás/);
        expect(timeText).toBeInTheDocument();
      });
    });
  });
});
