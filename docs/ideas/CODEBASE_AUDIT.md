# CrocoVoice Codebase Audit (High-Level, End-to-End)

Audit date: 2026-01-24  
Audited revision: `543fa750ced7d678c5cf92794dfd4d35d0bd1849`  
Scope: Electron app (main/renderer/preload + dashboard), local SQLite store, Supabase sync client, Supabase Edge Functions + migrations.

This is a static review (reading code + schema files). I did not run the app or execute DB profiling, so performance notes are based on query shapes + likely row counts.

---

## Executive Summary

CrocoVoice is a local-first Electron dictation app with:
- Widget renderer recording audio (MediaRecorder) -> IPC -> main process pipeline (Whisper -> optional GPT post-process -> apply dictionary -> persist) -> deliver via clipboard paste.
- Local persistence via SQLite (`store.js`).
- Optional cloud sync + auth via Supabase (`sync.js`), plus Supabase Edge Functions for quota + Stripe billing (`supabase/functions/*`).

The foundations are workable for an MVP, but there are several high-severity security issues and a few correctness/perf footguns that should be addressed before scaling usage or adding features.

### Top priorities (in order)

1) **CRITICAL: Supabase Edge Functions auth is broken (JWT not verified).**  
   A forged JWT payload can pass `requireAuthenticatedUser` and the Stripe functions, enabling unauthorized operations with service-role DB access. See `supabase/functions/_shared/auth.ts:35-60` and `supabase/functions/stripe-checkout/index.ts:27-76`.

2) **HIGH: XSS in Electron renderers via `innerHTML` with user-controlled strings.**  
   In Electron, XSS is more serious than in a normal website because it can directly access privileged IPC APIs exposed in `preload.js`. See:
   - `renderer.js:181-193` (microphone device label injected into `innerHTML`)
   - `dashboard.js:625-694` (toast messages + button labels injected into `innerHTML`)

3) **HIGH: Remote purge bug in sync can delete across users if RLS is off/misconfigured.**  
   `_purgeRemoteHistory()` deletes without scoping to `user_id`. See `sync.js:417-423`.

4) **HIGH: Sync design has data-loss / drift risks (no pagination, no delete tombstones, clock skew cursor).**  
   The sync algorithm is "upsert + pull updated_at >= cursor". This is fragile without:
   - pagination (`select('*')` can be capped by PostgREST limits),
   - tombstones for deletions (offline deletes won't propagate),
   - cursor based on server time / max seen updated_at to handle clock skew.  
   See `sync.js:373-415`.

5) **MED/HIGH perf: Audio payload marshaling is O(n) memory heavy.**  
   Renderer converts the recorded audio `ArrayBuffer` into `Array<number>` (huge IPC overhead). See `renderer.js:809-829`.

6) **MED: SQLite missing indexes for its hottest queries.**  
   Your most frequent operations are `ORDER BY created_at DESC LIMIT ?` and deletes/purges on `created_at`. Without indexes, it's table scans. See `store.js:92-108`, `store.js:193-196`, schema in `store.js:331-374`.

---

## System Architecture & Module Boundaries

### Current module map (as implemented)

- `main.js` (2385 LOC): **Everything** in the main process:
  - App lifecycle, tray, windows, global shortcuts
  - Recording state machine (ad-hoc) + orchestration
  - OpenAI client + retries + pipeline (transcribe, post-process, title)
  - Clipboard/typing delivery
  - Quota logic (local/hybrid/server)
  - Auth state + subscription state
  - IPC handlers for all features
- `preload.js` (145 LOC): `contextBridge` exports a very large privileged API surface.
- `renderer.js` (1418 LOC): Widget renderer:
  - MediaRecorder lifecycle, waveform, mic monitor
  - UI state for widget, auth gate, quota gate, cancel/undo flow
  - Sends audio payload to main over IPC
- `dashboard.html`/`dashboard.js` (2856 LOC): Dashboard renderer:
  - Settings UI, history/notes UI, subscription UI, onboarding UI
  - Calls privileged APIs via preload bridge
- `store.js` (452 LOC): Local SQLite persistence (settings, history, notes, dictionary, styles).
- `sync.js` (475 LOC): Supabase auth + sync orchestration + edge-function invocation.
- `supabase/`: Edge Functions (Deno TS) + SQL migrations (quota table + RPCs only).

### Key architectural observation

The project is "simple" in number of files, but **complex in responsibilities per file**:
- `main.js` is a monolith spanning unrelated domains (windowing, auth, quota, OpenAI, persistence, typing, sync).
- Renderers (`renderer.js`, `dashboard.js`) are also monoliths with lots of UI logic, state, and side effects.

This is common in early MVPs, but it's already large enough that the lack of clear internal boundaries is becoming a maintenance and reliability risk (harder to test, harder to reason about state transitions, higher chance of regressions).

---

## Data Flow (Critical Path)

### Dictation pipeline

1) Hotkey / tray click triggers `startRecording()` in main (`main.js:1405+`).
2) Main sends `start-recording` IPC to widget renderer (`mainWindow.webContents.send`).
3) Renderer records audio via MediaRecorder, collects chunks (`renderer.js:773+`).
4) On stop, renderer builds a Blob -> ArrayBuffer -> **Array<number>** payload and sends `audio-ready` IPC (`renderer.js:809-829`).
5) Main `handleAudioPayload` normalizes payload -> transcribes via Whisper -> optionally GPT post-process -> apply dictionary -> generate title (`main.js:1585+`).
6) Main persists history to SQLite + updates quota + schedules sync (`main.js:1651+`).
7) Main delivers final text via clipboard + paste shortcut (`main.js:1544+`).
8) UI updated via `status-change` + dashboard events.

### Sync flow (local-first)

- Local SQLite is the system of record; sync is best-effort.
- Sync is deferred while recording/processing (`main.js:526-579`), then `syncService.syncAll()` pushes/pulls each table.
- For each table: upsert local changes since cursor, then pull remote changes since cursor, then set cursor to `new Date().toISOString()` (`sync.js:373-415`).

---

## Database Models & Relationships

### Local SQLite (`store.js`)

Tables created in `_createSchema()` (`store.js:331-374`):
- `settings(key PK, value TEXT, updated_at TEXT)`
- `history(id PK, user_id TEXT, text TEXT, raw_text TEXT, language TEXT, duration_ms INT, title TEXT, created_at TEXT, updated_at TEXT)`
- `notes(id PK, user_id TEXT, title TEXT, text TEXT, metadata TEXT, created_at TEXT, updated_at TEXT)`
- `dictionary(id PK, user_id TEXT, from_text TEXT, to_text TEXT, created_at TEXT, updated_at TEXT)`
- `styles(id PK, user_id TEXT, name TEXT, prompt TEXT, created_at TEXT, updated_at TEXT)`

Relationships:
- There are **no foreign keys**; `user_id` is a loose association to Supabase `auth.users.id`.
- This is acceptable for local-first, but it increases the risk of inconsistent `user_id` usage (see Sync section).

Design notes:
- Timestamps are stored as ISO strings. Lexicographic compare works for ISO-8601 UTC, but only if every timestamp is normalized (it mostly is).
- No schema/version table; migrations are implicit (`ALTER TABLE ... ADD COLUMN title`).

### Supabase / Postgres (inferred from usage)

Tables referenced in code:
- `history`, `notes`, `dictionary`, `styles` (synced via `sync.js`)
- `user_settings` (synced via `sync.js:_syncSettings`)
- `subscriptions` (read/write from Edge Functions + sync subscription snapshot)
- `stripe_events` (Stripe webhook idempotency)
- `quota_weekly_usage` + RPCs `_quota_weekly_consume`, `_quota_weekly_get_or_create` (migrations present)

Repository gap:
- Only `quota_weekly_usage` is defined in `supabase/migrations/*`. There are **no migrations** for `subscriptions`, `stripe_events`, `history`, `notes`, `dictionary`, `styles`, or `user_settings`, nor for RLS policies on those tables.

This is a deployment/maintainability footgun: the repo cannot recreate the backend schema deterministically.

---

## SQL & Storage Performance Audit

### Local SQLite: hottest queries + missing indexes

Observed query patterns:
- History list: `SELECT * FROM history ORDER BY created_at DESC LIMIT ?` (`store.js:92-100`)
- Notes list: `SELECT * FROM notes ORDER BY created_at DESC LIMIT ?` (`store.js:106-108`)
- Dictionary/styles: `ORDER BY updated_at DESC` (`store.js:240-242`, `store.js:278-280`)
- Purge: `DELETE FROM history WHERE created_at < ?` (`store.js:193-196`)
- Stats: `SELECT text, created_at FROM history WHERE created_at >= ?` then JS word counting (`store.js:210-238`)

Issues:
- There are **no secondary indexes**. As history grows, these become table scans + full sorts.

Recommended local indexes (safe to add via `CREATE INDEX IF NOT EXISTS` in `_createSchema()`):
- `history(created_at DESC)`
- `history(updated_at DESC)`
- `history(user_id, updated_at DESC)` (for sync queries if you add them later)
- `notes(created_at DESC)`
- `notes(updated_at DESC)`
- `dictionary(updated_at DESC)`
- `styles(updated_at DESC)`

Other local perf notes:
- `saveSettings()` upserts **every key** every time (`store.js:52-63`). If used frequently, this is unnecessary write amplification. Prefer `setSetting()` for single-key changes.

### Supabase / Postgres: likely slow paths + missing indexes

Sync pulls use:
- `.select('*').eq('user_id', ...).gte('updated_at', cursor)` (`sync.js:394-401`, `sync.js:321-328`)

For those to be fast, you likely need composite indexes:
- `history(user_id, updated_at)`
- `notes(user_id, updated_at)`
- `dictionary(user_id, updated_at)`
- `styles(user_id, updated_at)`
- `user_settings(user_id, updated_at)`

Stripe webhook queries:
- `subscriptions` lookup by `stripe_customer_id` (`supabase/functions/stripe-webhook/index.ts:10-18`)
- `stripe_events` lookup by `id` (`supabase/functions/stripe-webhook/index.ts:46-55`)

Recommended constraints/indexes:
- `subscriptions`: unique on `(user_id)`; unique on `(stripe_customer_id)`; index on `(user_id)`
- `stripe_events`: primary key on `(id)`; optional index on `(created_at)`

Potential sync pagination issue:
- Supabase/PostgREST often enforces a max rows cap. `select('*')` without `.range()` can silently return partial data.
- If you ever have >1000 rows updated since cursor (history can reach that), you risk missing changes.

---

## Security Posture Audit

### CRITICAL: Supabase Edge Functions JWT is not verified (signature not validated)

Problem:
- `requireAuthenticatedUser` only base64-decodes the JWT payload and checks `iss` and `exp`, then uses `serviceClient.auth.admin.getUserById(sub)` to "validate".
- That does **not** validate the JWT signature. An attacker can craft a fake token with any `sub` and pass checks as long as `iss` matches and `exp` is in the future.

References:
- `supabase/functions/_shared/auth.ts:13-60`
- Stripe functions duplicate the same pattern instead of reusing shared auth:
  - `supabase/functions/stripe-checkout/index.ts:27-76`
  - `supabase/functions/stripe-portal/index.ts` (same pattern)

Impact:
- Unauthorized calls to quota / Stripe endpoints, with service-role DB access behind them.
- Potential account tampering (subscriptions table), quota exhaustion against another user, etc.

Fix direction:
- Do not decode JWT manually.
- Use Supabase auth verification:
  - Create a user-scoped client from the Authorization header and call `supabase.auth.getUser()` (which verifies the token with Supabase), OR
  - Validate JWT signature using JWKS / jose in Deno (more complex, but avoids network call).

### HIGH: Electron renderer XSS risks (innerHTML + privileged bridge)

Renderer XSS:
- Microphone labels come from `navigator.mediaDevices.enumerateDevices()` and are treated as trusted HTML:
  - `renderer.js:186-189` sets `button.innerHTML = ...${label}...`
  - A malicious device label (or any injected label source) can execute JS in the renderer.

Dashboard XSS:
- Toasts interpolate unescaped `message` and `actionLabel` into `innerHTML`:
  - `dashboard.js:625-694`
  - Many call sites pass user-controlled strings (dictionary word, style names, error messages).

Why it matters in Electron:
- `preload.js` exposes a large privileged API (`window.electronAPI`). If the renderer is compromised, attackers can call IPC handlers to exfiltrate data, trigger actions, and potentially escalate via app features (clipboard typing, file ops, etc).

Fix direction:
- Replace `innerHTML` with DOM construction + `textContent`, or at minimum escape text before interpolation.
- Add `webContents.setWindowOpenHandler` and `will-navigate` guards to prevent navigation to untrusted origins (see below).

### HIGH: Missing navigation/window-open restrictions (link handling)

- Renderers build `<a target="_blank">` in markdown rendering (`dashboard.js:881-891`).
- There is no `setWindowOpenHandler` / `will-navigate` handling in `main.js`.

Risk:
- External links could open inside Electron (depending on Electron defaults), creating a new window that may not have the intended hardened webPreferences.

Fix direction:
- In `main.js`, set a window open handler to deny by default and open external http(s) links via `shell.openExternal`.
- Add `will-navigate` listener to deny unexpected navigation.

### HIGH: Token handling footguns (exposure + duplication)

- `sync.js` includes `accessToken` in both Authorization header and request body (`sync.js:100-111`).
  - This increases the chance of token leaks through logs or error traces in Edge Functions.

Fix direction:
- Send tokens only via `Authorization: Bearer ...`.
- Remove token from request JSON payload.

### MED: Local credential storage is plaintext

- Supabase session stored in local SQLite settings with `access_token` + `refresh_token` (`sync.js:425-434`).
- This is common for desktop apps, but if you care about threat model beyond "single-user machine", consider OS keychain storage.

---

## Correctness Bugs & Footguns (Prioritized Findings)

### CRITICAL

1) Supabase Edge Functions accept forged JWTs (no signature verification).  
   - `supabase/functions/_shared/auth.ts:35-60`  
   - `supabase/functions/stripe-checkout/index.ts:54-76`  
   Impact: authentication bypass with service-role operations.

### HIGH

2) XSS in widget renderer via microphone label inserted into `innerHTML`.  
   - `renderer.js:181-193`  
   Fix: construct DOM and set label via `textContent`.

3) XSS in dashboard renderer via `showToast` / `showUndoToast`.  
   - `dashboard.js:625-694`  
   Fix: never inject untrusted strings into `innerHTML`.

4) Remote history purge is not scoped to authenticated user.  
   - `sync.js:417-423`  
   Fix: add `.eq('user_id', this.user.id)` as a defense-in-depth guard even if RLS exists.

5) Sync algorithm risks data drift / loss:
   - No delete propagation for offline deletes (no tombstones)
   - Cursor uses local time (clock skew can skip remote updates)
   - No pagination (may miss rows)
   - `select('*')` pulls everything and can get slow  
   - `sync.js:373-415`, `sync.js:321-338`  
   Fix: pagination + server-based cursors + tombstones or periodic reconciliation.

### MEDIUM

6) Audio payload IPC is unnecessarily heavy: ArrayBuffer -> Array<number>.  
   - `renderer.js:809-829`  
   Fix: send raw `ArrayBuffer` (supported by Electron IPC) or use transferable objects.

7) Clipboard/paste concurrency footgun: global `pendingPasteBuffer` + fixed delays.  
   - `main.js:1544-1578`  
   Risks: overlapping pastes, clipboard stomping if multiple paste calls happen close together.

8) SQLite missing indexes for hot paths.  
   - Schema in `store.js:331-374`, hot queries in `store.js:92-108`, `store.js:193-196`  
   Fix: add indexes as described earlier.

9) Settings write amplification: `saveSettings()` upserts all keys even for single changes.  
   - `store.js:52-63`  
   Fix: use `setSetting()` for single updates; reserve `saveSettings()` for bulk.

10) Renderer "no audio" duration check is likely broken by resetting the start timestamp before `onstop`.  
   - `renderer.js:301-315` + `renderer.js:909-943`  
   `recordingStartedAt` is set to `null` in `stopRecording()` before `MediaRecorder.onstop` runs, so duration-based checks can become ineffective.

### LOW

11) Backend schema is not fully represented in repo (missing migrations for key tables).  
   - Only quota migrations exist in `supabase/migrations/*`.  
   Fix: add migrations + RLS policies for all referenced tables.

12) Large privileged API surface in `preload.js` increases impact radius of renderer bugs.  
   - `preload.js` exports many "powerful" operations (auth, sync, subscription, clipboard/paste triggers, etc).  
   Fix: reduce surface area and/or add strict input validation in main IPC handlers.

---

## Design Smells / Simplifications (Pragmatism vs Over-Engineering)

What's good (pragmatic choices):
- Local-first persistence with SQLite is a strong choice for a desktop dictation tool.
- Electron security basics are mostly correct (nodeIntegration off, contextIsolation on).
- OpenAI calls have retries + timeouts (though timeouts don't cancel underlying requests).
- Sync is optional and doesn't block the core flow.

Where the code is currently "convoluted" (and should be simplified):
- **Monolithic files**: the primary maintainability problem is not a fancy architecture, it's that everything is in 3 massive scripts.
- **Custom auth implementation in Edge Functions**: reinventing JWT verification is both unnecessary and dangerously incorrect.
- **Sync semantics**: the current cursor approach is simple, but too easy to lose consistency without additional guardrails.

Low-risk simplifications with high ROI:
- Split `main.js` into small modules by concern (recording pipeline, quota, auth/subscription, sync, window/tray, IPC registration).
- Split renderer/dashboard UI into components or at least logical modules (notes, history, subscription, onboarding).
- Centralize config/env parsing into one module (avoid repeating parsing logic between main + sync).

---

## Scores (/10)

### Database models & relationships: **5.5/10**
- Local schema is coherent and simple, but lacks indexes and any relational constraints.
- Supabase schema is incomplete in-repo (missing migrations for multiple referenced tables), which is a big operational risk.

### Architectural design: **5/10**
- Clear high-level split (main vs renderer, local store, optional sync), but boundaries inside files are weak and coupling is high.

### Clean code & maintainability: **4/10**
- Large monoliths, lots of mutable global state, minimal validation, no automated tests.

### Readability & clarity: **5/10**
- Many sections are understandable, but file size + mixed responsibilities makes comprehension expensive.

### Smells/bugs/footguns risk (higher = fewer issues): **3/10**
- Critical auth bug in Edge Functions + multiple XSS vectors + sync drift risks raise the overall risk substantially.

### SQL performance: **6/10**
- Query shapes are simple, but missing indexes (local + likely remote) and missing pagination in sync are concerning.

### Security posture: **2/10**
- Electron hardening basics are okay, but renderer XSS + broken Edge auth dominates the score.

### Pragmatism vs over-engineering: **6/10**
- MVP choices are pragmatic overall, but some areas are over-complicated in the wrong way (custom auth) and under-engineered where it matters (boundaries, tests, sync correctness).

---

## Recommended Remediation Plan (Suggested Order)

### Phase 0 (same day / ASAP)
- Fix Edge Functions auth (verify token properly) and remove duplicated ad-hoc JWT parsing in Stripe functions.
- Remove token from Edge Function request bodies (`sync.js:110`).
- Fix XSS: replace `innerHTML` in `renderer.js` microphone list + `dashboard.js` toasts with safe DOM construction.
- Add user_id scoping to `_purgeRemoteHistory()` as defense in depth.

### Phase 1 (next 1-3 days)
- Add navigation restrictions (`setWindowOpenHandler`, `will-navigate`) and safe external link handling.
- Add SQLite indexes for history/notes/dictionary/styles.
- Improve audio payload IPC (send ArrayBuffer directly) to reduce latency and memory churn.
- Add basic validation in IPC handlers for the highest-risk endpoints (settings save, dictionary/style upserts).

### Phase 2 (next 1-2 weeks)
- Sync hardening: pagination, cursor strategy, and deletion semantics (tombstones or reconciliation).
- Add automated tests for core pipeline logic (quota gating, sync cursors, dictionary application, OpenAI retry behavior).
- Refactor `main.js` into modules; reduce global mutable state.
