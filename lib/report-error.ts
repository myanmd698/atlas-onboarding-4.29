/**
 * Central hook for production error reporting (Sentry, Datadog, etc.).
 * Replace the body when the product team wires monitoring.
 */
export function reportError(error: Error, context?: string): void {
  const prefix = context ? `[${context}] ` : '';
  if (__DEV__) {
    console.error(prefix, error);
  }
}
