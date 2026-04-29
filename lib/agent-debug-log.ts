/**
 * Session debug: POST NDJSON to Cursor ingest + Metro/console fallback when ingest is unreachable
 * (e.g. web CORS, physical device localhost, ingest offline).
 */
export function agentDebugLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string
): void {
  const payload = {
    sessionId: '504de4',
    location,
    message,
    data,
    timestamp: Date.now(),
    hypothesisId,
  };
  // #region agent log
  fetch('http://127.0.0.1:7296/ingest/8ca10641-5bf3-4fb5-8642-08318e4e7f93', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '504de4' },
    body: JSON.stringify(payload),
  }).catch(() => {});
  if (__DEV__) {
    console.warn('[agent-debug]', JSON.stringify(payload));
  }
  // #endregion
}
