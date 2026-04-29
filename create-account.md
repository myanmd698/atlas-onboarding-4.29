# Create account: API specification & onboarding (prototype)

This document defines the HTTP API contract for **real** registration to replace the Atlas MVP prototype’s local-only `signUp` (`lib/auth.tsx`), and documents the **current onboarding route sequence** in the app.

---

## Part A — Backend specification: user registration

### 1. Client contract (mobile app)

The Expo screen collects:

| Client field | Maps to API | Notes |
|--------------|-------------|--------|
| Email | `email` | Trimmed; client uses email keyboard |
| Full name | `full_name` | Trimmed |
| Password | `password` | Not stored client-side for auth in the prototype; production must accept and verify server-side |

**Password policy (must be enforced on the server; client mirrors this for UX)**

| Rule | Enforcement |
|------|----------------|
| Length | 8–64 characters (inclusive) |
| Uppercase | ≥ 1 `[A-Z]` |
| Lowercase | ≥ 1 `[a-z]` |
| Digit | ≥ 1 `[0-9]` |
| Special | ≥ 1 character outside `[A-Za-z0-9]` |

Normalize `email` to lowercase before uniqueness checks and storage.

---

### 2. Endpoint

#### `POST /v1/auth/register`

Public endpoint. Creates a `User` record, hashes the password, and returns a session so the app does not require a separate login step after sign-up.

| Property | Value |
|----------|--------|
| **Consumes** | `application/json` |
| **Produces** | `application/json` |
| **Auth** | None |

**Request headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | Must be `application/json` |
| `Accept` | No | Prefer `application/json` |
| `Idempotency-Key` | Optional | If supported, same key + same body within TTL returns same `201` response without double-creating users |

**Request body**

```json
{
  "email": "string",
  "full_name": "string",
  "password": "string"
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `email` | string | Required; after trim, RFC 5322–aligned validation (practical subset); max length **254**; store/compare lowercase |
| `full_name` | string | Required; trim; **1–200** chars after trim; reject empty |
| `password` | string | Required; apply password policy above; max raw length **128** before hashing (buffer against abuse) |

**Success: `201 Created`**

Body:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "full_name": "string",
    "created_at": "2026-04-29T12:00:00.000Z"
  },
  "tokens": {
    "access_token": "string",
    "refresh_token": "string",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

| Field | Type | Notes |
|-------|------|--------|
| `user.id` | string | Opaque, stable (e.g. UUID v7 or prefixed id); never sequential integers exposed if avoiding enumeration |
| `user.email` | string | Normalized lowercase |
| `user.full_name` | string | As stored |
| `user.created_at` | string | ISO 8601 UTC (`date-time`) |
| `tokens.access_token` | string | Short-lived; mobile sends as `Authorization: Bearer <access_token>` |
| `tokens.refresh_token` | string | Long-lived; single-use rotation recommended |
| `tokens.token_type` | string | Always `Bearer` if using Bearer tokens |
| `tokens.expires_in` | integer | Seconds until `access_token` expires |

Optional response header: `Location: /v1/users/{id}` if you expose a user resource URL.

**Semantics**

- **Atomicity:** Either the user row exists with a valid password hash **and** refresh token is persisted, or the request fails with no partial user (no orphan users without credentials).
- **Email uniqueness:** Enforced with a unique index on normalized email; conflict → `409`.
- **Password:** Never returned, logged, or echoed.

---

### 3. Error envelope

Use one JSON shape for all non-2xx responses so clients can branch on `error.code`.

```json
{
  "error": {
    "code": "snake_case_machine_code",
    "message": "Human-readable summary safe for UI",
    "details": {},
    "request_id": "opaque_correlation_id"
  }
}
```

| Field | Description |
|-------|-------------|
| `code` | Stable identifier; do not rename without versioning |
| `message` | Generic enough for display; no stack traces |
| `details` | Optional; validation errors, etc. |
| `request_id` | Echo from `X-Request-Id` header if present, else server-generated; use in logs |

**Suggested `error.code` values**

| HTTP | `code` | When |
|------|--------|------|
| `400` | `invalid_json` | Body not valid JSON |
| `400` | `invalid_request` | Wrong content type or missing required fields |
| `422` | `validation_failed` | Field-level validation (see below) |
| `422` | `weak_password` | Password fails policy (optional dedicated code) |
| `409` | `email_already_registered` | Normalized email exists |
| `429` | `rate_limited` | Too many requests |
| `500` | `internal_error` | Unexpected failure |

**`422` validation details (recommended)**

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Validation failed.",
    "details": {
      "fields": [
        { "field": "email", "message": "Invalid email format." },
        { "field": "password", "message": "Password must include a special character." }
      ]
    },
    "request_id": "req_…"
  }
}
```

---

### 4. HTTP status summary

| Status | Use |
|--------|------|
| `201` | User created; tokens issued |
| `400` | Malformed request |
| `409` | Duplicate email |
| `422` | Semantically invalid input (validation / weak password) |
| `429` | Rate limit exceeded; send `Retry-After` when possible |
| `500` | Server error |

---

### 5. Implementation notes for backend engineers

**Password storage**

- Hash with **Argon2id** (preferred) or **scrypt**; tune cost for your hardware budget.
- Store only hash + algorithm metadata + optional pepper via KMS; never reversible encryption for passwords.

**Database**

- Unique index on `lower(trim(email))` or stored normalized email column.
- Consider separate `auth_credentials` / `sessions` table if refresh tokens are many-to-one user.

**Rate limiting**

- Per IP and per email hash (normalized): e.g. **5 registrations / hour / IP** and **3 / hour / email** (tune per risk).
- Return `429` with `Retry-After`.

**Security**

- TLS 1.2+ only; HSTS at edge.
- Do not log request bodies or passwords; log `request_id`, route, status, latency.
- Optional: CAPTCHA or proof-of-work after repeated `429`s on registration.

**Observability**

- Metrics: `auth_register_total{status}` (success vs `4xx` vs `5xx`), latency histogram.
- Traces: propagate `X-Request-Id` / W3C `traceparent` through auth and DB calls.

**Companion endpoints (same auth stack)**

Implement alongside registration so login and token refresh match token format:

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/auth/login` | Email + password → same `user` + `tokens` shape |
| `POST` | `/v1/auth/token` | Refresh token rotation → new `tokens` |
| `POST` | `/v1/auth/logout` | Invalidate refresh token(s) |

---

## Part B — Onboarding flow (prototype, current)

Today the mobile app **does not call** the registration API above; `signUp` writes `AuthUser` to AsyncStorage only. Wiring the client means: `POST /v1/auth/register` → persist `tokens` in secure storage → map `user` to app state → **`router.replace('/onboarding/primer')`** (same as `app/(auth)/sign-up.tsx` today).

### Entry after sign-up

Successful **sign-up** navigates to **`/onboarding/primer`**.

### Linear onboarding sequence

Screens use a **5-step** progress rail (`ProgressHeader` `totalSteps={5}`) through step 5; the flow **ends** on the linked-accounts screen (no automatic navigation to plan preview).

| Order | Route | Role |
|-------|--------|------|
| 1 | `/onboarding/primer` | Value props → **Continue** → goal |
| 2 | `/onboarding/goal` | Choose starting **goal** (`GoalId`) → account priority |
| 3 | `/onboarding/account-priority` | Plan hero + recommended plan → **CTA** → link |
| 4 | `/onboarding/link` | Link institutions (mock Plaid sheet); **See your overview** → connecting |
| 5 | `/onboarding/connecting` | Per-account “connecting” animation → **linked accounts** |
| End | `/onboarding/linked-accounts` | Lists linked accounts; **`markComplete()`** runs here; user stays on screen |

Back behavior is driven by each screen’s header (`backFallback` / `onBackPress`), generally stepping backward along this chain.

### After onboarding completes

When `onboarding.completed` is true (persisted via `lib/onboarding.tsx`), **`app/index.tsx`** redirects authenticated users to **`/onboarding/plan-preview`**. That screen is **post-onboarding** entry (e.g. reopening the app), not the last step of the linear onboarding rail above.

### Other routes under `app/onboarding/`

These exist in the codebase but are **not** part of the primary navigation chain today: **`atlas-intro`**, **`household`**, **`life-events`**. **`plan-preview`** is reachable after completion and from index, not as the onboarding terminator.
