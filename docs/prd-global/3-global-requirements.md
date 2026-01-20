# 3) Global Requirements

## Functional (high-level)
- Universal dictation: global hotkeys, Quick Dictate overlay, Full Dictate editor.
- Pipeline: STT (Whisper) + configurable post-processing (cleanup/punctuation/structure) + writing styles.
- Delivery: auto-typing with paste fallback, then clipboard fallback, with explicit delivery feedback.
- History: list/search/copy/delete + re-apply a style.
- Notes + Dictionary + Voice snippets (voice cue → template insertion).
- Freemium: weekly word quota + just-in-time paywall + PRO unlimited + billing settings.
- Auth: existing signup/login + forgot/reset password.
- Contextual awareness: adapt style/formatting based on the active app, with user controls.
- Long form: file uploads transcription + exports; then meetings (manual record → transcript → summary/action items).

## MVP Operational Defaults (locked)

These defaults must be consistent across product, docs, and implementation.

- **Quota authority:** `CROCOVOICE_QUOTA_MODE=hybrid` (prefer server quota when available; fall back to local enforcement).
- **Entitlement authority:** server-backed (Stripe/Supabase is the source of truth), with cached entitlement for offline use.
- **Offline behavior (FREE):** allowed to dictate; quota is enforced locally against the last known allowance; once remaining hits 0, dictation is blocked until reconnection + refresh/sync.
- **Offline behavior (PRO):** allowed to dictate with “unlimited” if a cached PRO entitlement is still valid within an entitlement TTL (target: **3 days since last verification**); once TTL expires without re-verification, fall back to FREE quota mode until online verification succeeds.

## Non-Functional (targets)
- Hotkey → “listening” feedback < 100ms (p95).
- Short dictation (<= 30s) → final text < 3s (p95), excluding bad network conditions.
- Delivery robustness: never “lose” text (clipboard fallback + toast).
- Privacy: consent, configurable retention, easy deletion, minimize stored audio.
- Cost control: quotas + caching + model selection + per-action cost instrumentation.
- Supabase sync (if enabled) must be non-blocking; SQLite remains the source of truth.
