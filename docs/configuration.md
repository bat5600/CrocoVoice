# CrocoVoice Configuration

This project is a local Electron app. Configuration is done via environment variables (commonly a `.env` file in the repo root).

## Required

### `OPENAI_API_KEY`
Required for:
- Whisper transcription
- Optional LLM post-processing

If missing, dictation will fail with a clear error message.

## Optional (Auth / Sync)

### `SUPABASE_URL`
Supabase project URL (enables auth/sync if paired with anon key).

### `SUPABASE_ANON_KEY`
Supabase anon key (client key).

### `AUTH_SIGNUP_URL`
Used as a fallback signup URL if `config/auth-config` is not present.

## Optional (Billing)

CrocoVoice uses “open a hosted URL” style billing entrypoints.

### `STRIPE_CHECKOUT_URL`
Base URL for Stripe Checkout.

### `STRIPE_PORTAL_URL`
Base URL for Stripe Customer Portal.

### `STRIPE_RETURN_URL`
Optional return URL passed as `return_to` query param.

Note: the app also appends `client_reference_id` / `user_id` and `email` query params when possible.

## Optional (App defaults)

### `CROCOVOICE_LANGUAGE`
Default language (default: `fr`).

### `CROCOVOICE_SHORTCUT`
Default global hotkey. If unset, defaults to:
- macOS: `Command+Shift+R`
- Windows/Linux: `Ctrl+Shift+R`

## Quotas

### `CROCOVOICE_WEEKLY_QUOTA_WORDS`
Weekly FREE word quota (default: `2000`).

### `CROCOVOICE_QUOTA_MODE`
Controls quota authority (default: `local`):
- `local`: quota tracked locally in SQLite settings
- `hybrid`: use server snapshot/consume when available, fall back to local
- `server`: require server quota checks (network/auth needed)

Product default (MVP): **`hybrid`** (see `docs/prd.md`).

### `CROCOVOICE_QUOTA_CACHE_TTL_MS`
Quota snapshot cache TTL (default: `300000` = 5 minutes).

## Entitlements (PRO vs FREE)

Product decision (MVP):
- Entitlement is **server-backed** (Stripe/Supabase is the source of truth).
- The app may use a **cached PRO entitlement** for offline use with a TTL target of **3 days since last verification**.
- If the entitlement TTL expires while offline/unverifiable, the app falls back to FREE quota mode until it can re-verify online.

Implementation note: exact storage location and TTL wiring are implementation details; this section captures the intended operating model.

## Retention & Sync Limits

### `CROCOVOICE_HISTORY_RETENTION_DAYS_FREE`
Default: `14`

### `CROCOVOICE_HISTORY_RETENTION_DAYS_PRO`
Default: `365`

### `CROCOVOICE_HISTORY_SYNC_LIMIT_FREE`
Default: `1000`

### `CROCOVOICE_HISTORY_SYNC_LIMIT_PRO`
Default: `5000`

## Recommended `.env` templates

### Minimal (local only)
```
OPENAI_API_KEY=...
```

### With Supabase
```
OPENAI_API_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

### With Stripe links
```
STRIPE_CHECKOUT_URL=...
STRIPE_PORTAL_URL=...
STRIPE_RETURN_URL=...
```
