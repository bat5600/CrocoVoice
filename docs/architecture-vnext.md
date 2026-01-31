# CrocoVoice Architecture — vNext (M1/M2+)

> Deprecated as of 2026-01-31. Canonical roadmap alignment now lives in `docs/prd.md` (Milestones) and `docs/architecture.md` (Roadmap Alignment). See `docs/ssot.md` and update canonical docs instead of this file.

This document aligns architecture guidance with the **global PRD roadmap** (`docs/prd.md`), focusing on the next milestones:

- **M1 (NOW):** Epic 4 + Epic 7 + Epic 9 (Daily Driver data + permissions/diagnostics + status bubble)
- **M2 (NEXT):** Epic 5 + Epic 8 + Epic 10 + Epic 11 (context capture + streaming + telemetry/flags + onboarding/insights)
- **M3 (LATER):** Epic 6 + Epic 12 + Epic 13 (long-form uploads + CrocOmni + local inference fallback)

It complements (does not replace) the existing brownfield stability architecture in `docs/architecture.md`.

## 1) Current Baseline (observed)

- Electron app with main/renderer split and IPC via `preload.js`
- Local SQLite (flow.sqlite) as source of truth via `store.js`
- Dictation pipeline orchestrated in `main.js` (state machine, OpenAI calls, typing/paste fallback)
- Dashboard UI in `dashboard.html` + `dashboard.js`
- Optional Supabase auth/sync via `sync.js`

## 2) Architectural Goals (vNext)

- Keep **core dictation flow** reliable and fast (Epic 1 is the dependency for everything).
- Add low-latency streaming (AudioWorklet + WebSocket) with a file-upload fallback.
- Expand “daily driver” data/features (notes/history/dictionary/snippets) without breaking offline-first behavior.
- Make permissions, failures, and delivery issues diagnosable (first-run success).
- Capture context with explicit privacy controls and per-app opt-in.
- Add feature flags, telemetry, and notifications for safe rollout and supportability.
- Prepare CrocOmni conversation surfaces with local-first storage.
- Enable local long-form file transcription with export workflows.

## 3) High-Level Component Map

```mermaid
graph TD
  Status[Status Bubble (status window)] -->|IPC| Main[Main process (main.js)]
  Hub[Hub UI (dashboard.html/dashboard.js)] -->|IPC| Main
  Menu[Context Menu (tray/menu)] -->|IPC| Main
  Main --> Store[SQLite Store (store.js)]
  Main --> Sync[Sync Service (sync.js) optional]
  Main --> Transport[Streaming Transport (WebSocket)]
  Main --> ASR[ASR Providers (Whisper + optional)]
  Main --> Post[Post-process/Styles]
  Main --> Context[Context Capture]
  Main --> Flags[Feature Flags]
  Main --> Telemetry[Telemetry/Diagnostics]
  Main --> Notify[Notifications Inbox]
  Main --> Deliver[Delivery (nut-js/robotjs/paste/clipboard)]
  Main --> CrocOmni[CrocOmni (M3)]
  Main --> FileTx[File Transcription (M3)]
```

## 4) Data Model (local-first)

### 4.1 SQLite as source of truth

Principle: features in M1 must work **offline**, with SQLite as the canonical store.
Supabase sync (if enabled) is a replica and must remain non-blocking.

### 4.2 Entities (M1/M2)

- **history**: completed dictations/transcriptions (already present)
- **notes**: user-authored notes (already present)
- **dictionary**: custom spellings/corrections (already present)
- **styles**: writing style presets (already present)
- **snippets**: voice cue → template (new table or settings blob)
- **context_snapshots**: app/url/window/title + optional ax/textbox/screenshot metadata
- **notifications**: remote/local inbox items (read/archive)
- **metrics**: aggregates for insights (top apps, WPM, streaks)
- **crocomni_sessions**: conversation history (M3)
- **settings**: app preferences + subscription snapshot + quota cache

### 4.3 Quota and entitlement

- Local quota state is stored in settings (`quota_weekly`) with a period start and words used.
- Subscription snapshot is stored in settings (`subscription`) and drives “isPro” checks client-side.

Design decision for vNext:
- **Quota mode:** `hybrid` — prefer server snapshot/consume when available, but enforce locally offline using the last known allowance.
- **Entitlement authority:** server-backed (Stripe/Supabase as source of truth).
- **Offline PRO TTL:** allow “unlimited” while offline if a cached PRO entitlement is still valid (target: 3 days since last verification). After TTL expiry, fall back to FREE quota mode until re-verified online.

## 5) UI Surfaces and Responsibilities

### 5.1 Status Bubble (Quick Dictate)

Responsibilities:
- capture audio (AudioWorklet, MediaRecorder fallback)
- show state (idle/recording/processing/error) and audio level
- show mic/language selection and quota gate UI when blocked
- show partial transcript updates during streaming

Non-responsibilities:
- business logic and authority (quota checks, entitlement, OpenAI calls should remain in main process)

### 5.2 Hub

Responsibilities:
- show history/notes/dictionary/snippets/styles/settings
- show quota/subscription surfaces and handle “open checkout/portal” actions
- provide onboarding flow, diagnostics, and insights surfaces
- display notifications inbox

### 5.3 Context Menu

Responsibilities:
- quick actions (copy, retry, toggle mic/language)
- open diff viewer when post-processing completes

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

## 7) Streaming Transport (Epic 8)

Key requirements:
- WebSocket streaming contract for audio chunks and partial transcripts.
- Optional Opus encoding for bandwidth reduction.
- File-upload fallback when streaming is unavailable or fails.
- Heartbeat, retry/backoff, and session IDs to ensure reliability.

## 8) Context Capture & Privacy (Epic 5)

Key requirements:
- Capture app name, window title, and URL by default.
- Optional ax/textbox/screenshot capture with explicit opt-in and per-app controls.
- Retention limits and redaction rules before any upload or sync.

## 9) Feature Flags, Telemetry, Notifications (Epic 10)

Key requirements:
- Local + remote flags with kill switch behavior.
- Telemetry events for latency, divergence, failure reasons, and pipeline stages.
- Notifications inbox that syncs remote items and surfaces OS notifications.
- User controls to opt out of telemetry and sensitive capture.

## 10) CrocOmni + Local Inference (Epic 12/13)

Key requirements:
- CrocOmni sessions stored locally with optional context summaries.
- Local inference/VAD as a safe fallback path when cloud is unavailable.

## 11) Long-Form Uploads and Exports (Epic 6)

Key requirements:
- File upload flow with progress and cancel.
- Local-only processing by default; cloud fallback is opt-in.
- Export formats: txt/md/json with optional timestamps.

## 12) Open Questions (to resolve before sharding M1/M2)

- Where should “snippets” live (new SQLite table vs settings blob)?
- How should the PRO entitlement TTL be stored and enforced (settings vs server-provided expiry, and what is the exact TTL configuration surface)?
