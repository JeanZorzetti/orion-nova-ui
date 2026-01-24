/**
 * Rate Limiting Library
 *
 * Simple in-memory rate limiter with sliding window algorithm.
 * Can be replaced with Redis-based solution for distributed systems.
 */

import logger from "./logger";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis for production with multiple instances)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowInSeconds: number;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Number of requests remaining in the current window */
  remaining: number;
  /** Unix timestamp when the rate limit resets */
  reset: number;
  /** Maximum requests allowed */
  limit: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the rate limit (e.g., IP, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining requests and reset time
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowInSeconds * 1000;
  const resetTime = now + windowMs;

  const existing = rateLimitStore.get(identifier);

  if (!existing || existing.resetTime < now) {
    // First request or window expired - reset counter
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      remaining: config.limit - 1,
      reset: resetTime,
      limit: config.limit,
    };
  }

  if (existing.count >= config.limit) {
    // Rate limit exceeded
    logger.warn(
      { identifier, limit: config.limit, window: config.windowInSeconds },
      `Rate limit exceeded for ${identifier}`
    );
    return {
      success: false,
      remaining: 0,
      reset: existing.resetTime,
      limit: config.limit,
    };
  }

  // Increment counter
  existing.count++;

  return {
    success: true,
    remaining: config.limit - existing.count,
    reset: existing.resetTime,
    limit: config.limit,
  };
}

/**
 * Get rate limit headers for HTTP response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
  };
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
  /** Authentication endpoints: 5 requests per minute */
  auth: { limit: 5, windowInSeconds: 60 },

  /** Password reset: 3 requests per hour */
  passwordReset: { limit: 3, windowInSeconds: 3600 },

  /** General API: 100 requests per minute */
  api: { limit: 100, windowInSeconds: 60 },

  /** Strict API (expensive operations): 10 requests per minute */
  apiStrict: { limit: 10, windowInSeconds: 60 },

  /** AI Chat: 20 requests per minute */
  aiChat: { limit: 20, windowInSeconds: 60 },

  /** File uploads: 10 per hour */
  upload: { limit: 10, windowInSeconds: 3600 },

  /** Contact form: 5 per hour */
  contact: { limit: 5, windowInSeconds: 3600 },
} as const;

/**
 * Extract client identifier from request
 * Uses X-Forwarded-For header for proxied requests (Vercel, etc.)
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback - should not happen in production
  return "unknown";
}

/**
 * Create a rate-limited API handler wrapper
 *
 * @example
 * ```ts
 * import { withRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
 *
 * export const POST = withRateLimit(
 *   async (request) => {
 *     // Your handler logic
 *     return NextResponse.json({ success: true });
 *   },
 *   RATE_LIMITS.auth
 * );
 * ```
 */
export function withRateLimit<T>(
  handler: (request: Request) => Promise<T>,
  config: RateLimitConfig = RATE_LIMITS.api
) {
  return async (request: Request): Promise<T | Response> => {
    const identifier = getClientIdentifier(request);
    const result = rateLimit(identifier, config);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...getRateLimitHeaders(result),
            "Retry-After": String(Math.ceil((result.reset - Date.now()) / 1000)),
          },
        }
      );
    }

    const response = await handler(request);

    // Add rate limit headers to successful responses
    if (response instanceof Response) {
      const headers = new Headers(response.headers);
      Object.entries(getRateLimitHeaders(result)).forEach(([key, value]) => {
        headers.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  };
}
