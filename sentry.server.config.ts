// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Environment configuration
  environment: process.env.NODE_ENV,

  // Filter out common non-actionable errors
  beforeSend(event, hint) {
    const error = hint.originalException;

    // Ignore specific server errors
    if (error instanceof Error) {
      const ignoreMessages = [
        "NEXT_NOT_FOUND",
        "NEXT_REDIRECT",
      ];

      if (ignoreMessages.some(msg => error.message?.includes(msg))) {
        return null;
      }
    }

    return event;
  },

  // Spotlight for local development
  spotlight: process.env.NODE_ENV === "development",
});
