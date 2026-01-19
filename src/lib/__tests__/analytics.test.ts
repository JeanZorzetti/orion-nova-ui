import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  trackPageView,
  trackEvent,
  trackSignUp,
  trackLogin,
  trackSearch,
  trackButtonClick,
} from "../analytics";

describe("Analytics utilities", () => {
  beforeEach(() => {
    // Mock window.gtag
    global.window = global.window || {};
    (window as any).gtag = vi.fn();
    (window as any).dataLayer = [];
  });

  describe("trackPageView", () => {
    it("should call gtag with correct parameters", () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackPageView("/test-page");

      expect(mockGtag).toHaveBeenCalledWith(
        "config",
        expect.any(String),
        expect.objectContaining({
          page_path: "/test-page",
        })
      );
    });

    it("should not throw if gtag is undefined", () => {
      (window as any).gtag = undefined;
      expect(() => trackPageView("/test")).not.toThrow();
    });
  });

  describe("trackEvent", () => {
    it("should call gtag with event parameters", () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackEvent({
        action: "click",
        category: "button",
        label: "test-button",
        value: 1,
      });

      expect(mockGtag).toHaveBeenCalledWith("event", "click", {
        event_category: "button",
        event_label: "test-button",
        value: 1,
      });
    });

    it("should not throw if gtag is undefined", () => {
      (window as any).gtag = undefined;
      expect(() =>
        trackEvent({ action: "test", category: "test" })
      ).not.toThrow();
    });
  });

  describe("trackSignUp", () => {
    it("should track signup with method", () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackSignUp("email");

      expect(mockGtag).toHaveBeenCalledWith("event", "sign_up", {
        event_category: "engagement",
        event_label: "email",
        value: undefined,
      });
    });
  });

  describe("trackLogin", () => {
    it("should track login with method", () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackLogin("google");

      expect(mockGtag).toHaveBeenCalledWith("event", "login", {
        event_category: "engagement",
        event_label: "google",
        value: undefined,
      });
    });
  });

  describe("trackSearch", () => {
    it("should track search with term", () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackSearch("test query");

      expect(mockGtag).toHaveBeenCalledWith("event", "search", {
        event_category: "engagement",
        event_label: "test query",
        value: undefined,
      });
    });
  });

  describe("trackButtonClick", () => {
    it("should track button click with name", () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackButtonClick("cta-button");

      expect(mockGtag).toHaveBeenCalledWith("event", "button_click", {
        event_category: "engagement",
        event_label: "cta-button",
        value: undefined,
      });
    });
  });
});
