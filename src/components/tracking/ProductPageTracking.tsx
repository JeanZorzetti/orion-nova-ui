"use client";

import { useEffect } from "react";
import { trackProductPageView } from "@/lib/analytics";
import { useScrollTracking } from "@/hooks/useScrollTracking";
import { useTimeTracking } from "@/hooks/useTimeTracking";

/**
 * Client-side tracking wrapper for product page
 * Tracks page views, scroll depth, and time on page
 */
export default function ProductPageTracking() {
  // Track scroll depth milestones
  useScrollTracking();

  // Track time on page milestones
  useTimeTracking();

  // Track page view on mount
  useEffect(() => {
    trackProductPageView();
  }, []);

  return null; // This component doesn't render anything
}
