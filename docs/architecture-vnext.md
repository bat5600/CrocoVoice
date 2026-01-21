# CrocoVoice Architecture — vNext (M1/M2+)

This document aligns architecture guidance with the **global PRD roadmap** (`docs/prd.md`), focusing on the next milestones:

- **M1 (NOW):** Epic 4 + Epic 7 (Daily Driver + Onboarding/Permissions)
- **M2 (NEXT):** Epic 5 + Epic 8 (Integrations + Voice-to-Action)

It complements (does not replace) the existing brownfield stability architecture in `docs/architecture.md`.

## 1) Current Baseline (observed)

- Electron app with main/renderer split and IPC via `preload.js`
- Local SQLite (flow.sqlite) as source of truth via `store.js`
- Dictation pipeline orchestrated in `main.js` (state machine, OpenAI calls, typing/paste fallback)
- Dashboard UI in `dashboard.html` + `dashboard.js`
- Optional Supabase auth/sync via `sync.js`

## 2) Architectural Goals (vNext)

- Keep **core dictation flow** reliable and fast (Epic 1 is the dependency for everything).
- Expand “daily driver” data/features (notes/history/dictionary/snippets) without breaking offline-first behavior.
- Make permissions and failures diagnosable (first-run success).
- Introduce integrations behind a stable adapter interface with graceful degradation.
- Prepare a safe, limited Voice-to-Action layer (intent taxonomy + confirmations).

## 3) High-Level Component Map

```mermaid
graph TD
  UIWidget[Widget UI (index.html/renderer.js)] -->|IPC| Main[Main process (main.js)]
  UIDash[Dashboard UI (dashboard.html/dashboard.js)] -->|IPC| Main
  Main --> Store[SQLite Store (store.js)]
  Main --> Sync[Sync Service (sync.js) optional]
  Main --> OpenAI[OpenAI (Whisper + Chat) optional]
  Main --> Deliver[Delivery (nut-js/robotjs/paste/clipboard)]
  Main --> Integrations[Integration Adapters (M2)]
  Main --> Intent[Intent Router (M2)]
```

## 4) Data Model (local-first)

### 4.1 SQLite as source of truth

Principle: features in M1 must work **offline**, with SQLite as the canonical store.
Supabase sync (if enabled) is a replica and must remain non-blocking.

### 4.2 Entities (M1)

- **history**: completed dictations/transcriptions (already present)
- **notes**: user-authored notes (already present)
- **dictionary**: custom spellings/corrections (already present)
- **styles**: writing style presets (already present)
- **snippets**: voice cue → template (may be implemented as a new table or stored in settings depending on current schema choices)
- **settings**: app preferences + subscription snapshot + quota cache

### 4.3 Quota and entitlement

- Local quota state is stored in settings (`quota_weekly`) with a period start and words used.
- Subscription snapshot is stored in settings (`subscription`) and drives “isPro” checks client-side.

Design decision for vNext:
- **Quota mode:** `hybrid` — prefer server snapshot/consume when available, but enforce locally offline using the last known allowance.
- **Entitlement authority:** server-backed (Stripe/Supabase as source of truth).
- **Offline PRO TTL:** allow “unlimited” while offline if a cached PRO entitlement is still valid (target: 3 days since last verification). After TTL expiry, fall back to FREE quota mode until re-verified online.

## 5) UI Surfaces and Responsibilities

### 5.1 Widget (Quick Dictate)

Responsibilities:
- capture audio (MediaRecorder)
- show state (idle/recording/processing/error)
- display quota gate UI when blocked

Non-responsibilities:
- business logic and authority (quota checks, entitlement, OpenAI calls should remain in main process)

### 5.2 Dashboard

Responsibilities:
- show history/notes/dictionary/styles/settings
- show quota/subscription surfaces and handle “open checkout/portal” actions
- provide a place for onboarding hints and diagnostics (Epic 7)

## 6) Permissions & Diagnostics (Epic 7)

Key requirements:
- Detect and clearly communicate missing permissions: microphone, accessibility/automation for typing, clipboard/paste limitations.
- Provide “why delivery failed” diagnostics:
  - typing library missing / not permitted
  - active window changed during processing (typing guard)
  - paste blocked by target app

Implementation approach:
- Centralize diagnostic events in main process (single place to compute reason codes).
- Expose a small IPC endpoint for “diagnostics snapshot” and render it in the dashboard.

## 7) Integrations Platform (Epic 5, M2)

### 7.1 Adapter interface (conceptual)

Create a thin abstraction with:
- `connect()` / `disconnect()` / `status()`
- `sendText(payload)` returning `{ ok, id?, error? }`

Design constraints:
- Always support a fallback path: type/paste/clipboard.
- Never block dictation completion on integration delivery; delivery can be async with status updates.

### 7.2 Token storage

Store integration tokens/credentials:
- locally in SQLite settings (encrypted if you introduce encryption later), or
- via OS keychain/credential store (preferred if added later).

## 8) Voice-to-Action (Epic 8, M2)

Principles:
- Small, explicit intent taxonomy (no “execute arbitrary commands”).
- Confirmations for destructive or high-impact actions.
- Deterministic execution path once intent is chosen.

Suggested first intents:
- “create note”
- “send to Slack #channel”
- “copy to clipboard”
- “open dashboard/settings”

## 9) Observability (cross-cutting)

Even without a full analytics stack, log structured events (local):
- dictation_started / dictation_stopped
- transcription_succeeded / failed (+ reason code)
- delivery_succeeded / failed (+ method: typing/paste/clipboard)
- quota_checked / quota_blocked
- checkout_opened / portal_opened

These become the foundation for Epic 14 later.

## 10) Open Questions (to resolve before sharding M1/M2)

- Where should “snippets” live (new SQLite table vs settings blob)?
- How should the PRO entitlement TTL be stored and enforced (settings vs server-provided expiry, and what is the exact TTL configuration surface)?
