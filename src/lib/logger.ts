import pino from "pino";

// Create logger instance with configuration based on environment
const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  // Pretty print in development, JSON in production
  ...(process.env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        },
      }
    : {}),

  // Base fields for all logs
  base: {
    env: process.env.NODE_ENV,
    app: "orion-erp",
  },

  // Serializers for common objects
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  // Redact sensitive information
  redact: {
    paths: [
      "password",
      "senha",
      "token",
      "apiKey",
      "secret",
      "authorization",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    censor: "[REDACTED]",
  },
});

/**
 * Create a child logger with additional context
 * @param context - Additional fields to include in all logs
 * @returns Child logger instance
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Create a request-scoped logger with correlation ID
 * @param requestId - Unique request identifier
 * @param userId - Optional user ID
 * @returns Child logger with request context
 */
export function createRequestLogger(requestId: string, userId?: string) {
  return logger.child({
    requestId,
    ...(userId && { userId }),
  });
}

/**
 * Generate a correlation ID for request tracking
 * @returns UUID v4 string
 */
export function generateCorrelationId(): string {
  return crypto.randomUUID();
}

/**
 * Log an API request
 */
export function logApiRequest(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  userId?: string
) {
  const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";

  logger[level](
    {
      type: "api_request",
      method,
      path,
      statusCode,
      durationMs,
      userId,
    },
    `${method} ${path} ${statusCode} ${durationMs}ms`
  );
}

/**
 * Log a database query (for debugging)
 */
export function logDbQuery(
  operation: string,
  model: string,
  durationMs: number,
  rowCount?: number
) {
  logger.debug(
    {
      type: "db_query",
      operation,
      model,
      durationMs,
      rowCount,
    },
    `DB ${operation} ${model} ${durationMs}ms`
  );
}

/**
 * Log an authentication event
 */
export function logAuthEvent(
  event: "login" | "logout" | "register" | "password_reset" | "failed_login",
  email: string,
  success: boolean,
  ipAddress?: string
) {
  const level = success ? "info" : "warn";

  logger[level](
    {
      type: "auth_event",
      event,
      email,
      success,
      ipAddress,
    },
    `Auth ${event} for ${email}: ${success ? "success" : "failed"}`
  );
}

/**
 * Log an error with full context
 */
export function logError(
  error: Error,
  context?: Record<string, unknown>
) {
  logger.error(
    {
      type: "error",
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...context,
    },
    error.message
  );
}

/**
 * Log levels:
 * - trace: Very detailed logs (function entry/exit)
 * - debug: Diagnostic information
 * - info: General informational messages
 * - warn: Warning messages
 * - error: Error messages
 * - fatal: Critical errors that cause termination
 */

export default logger;
