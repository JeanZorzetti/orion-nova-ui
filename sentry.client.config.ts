// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable Session Replay for better debugging
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],

  // Filter out common non-actionable errors
  beforeSend(event, hint) {
    const error = hint.originalException;

    // Ignore network errors that are expected
    if (error instanceof Error) {
      const ignoreMessages = [
        "ResizeObserver loop",
        "Network request failed",
        "Load failed",
        "ChunkLoadError",
      ];

      if (ignoreMessages.some(msg => error.message?.includes(msg))) {
        return null;
      }
    }

    return event;
  },

  // Environment configuration
  environment: process.env.NODE_ENV,

  // Release tracking (auto-set by Sentry during build)
  // release: process.env.SENTRY_RELEASE,
});
