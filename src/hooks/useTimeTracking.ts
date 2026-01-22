"use client";

import { useEffect, useRef } from "react";
import { trackTimeOnPage } from "@/lib/analytics";

/**
 * Hook to track time on page milestones
 * Tracks when user stays on page for 30s, 1min, 2min, and 3min
 */
export function useTimeTracking() {
  const tracked = useRef<Set<number>>(new Set());
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    const milestones = [30, 60, 120, 180] as const;

    const checkMilestones = () => {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);

      milestones.forEach((milestone) => {
        if (elapsed >= milestone && !tracked.current.has(milestone)) {
          tracked.current.add(milestone);
          trackTimeOnPage(milestone);
        }
      });
    };

    // Check every 5 seconds
    const interval = setInterval(checkMilestones, 5000);

    return () => clearInterval(interval);
  }, []);
}
