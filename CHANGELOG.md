# CrocoVoice — Central Changelog

This document is the single source of truth for project evolution. It aggregates:
- milestone/decision records
- story change logs (all stories, including drafts and done)

## Milestones and Decisions
- 2026-01-31: MVP lock decision recorded (M0 locked; release packaging still pending). Source: `docs/mvp-lock-20260131.md`
- 2026-01-31: M0 done audit verified DONE for Epics 1–3. Source: `docs/m0-done-audit.md`

## Update Policy
- Whenever a story "Change Log" table is updated, add the same entry here (or re-aggregate).
- Record major project decisions here (locks, audits, release readiness, go/no-go).
- This file is the single source of truth for project evolution; do not rely on scattered notes.

## Project Snapshot (Current)
Source of truth: `docs/prd.md`, `docs/architecture.md`, `docs/front-end-spec.md`, `docs/mvp-lock-20260131.md`.

### Product Summary
CrocoVoice is a local-first Electron dictation app. It targets low-latency streaming feedback, context-aware post-processing, and multi-window UX (hub + status bubble + context menu), while remaining offline-friendly and privacy-safe.

### Core Goals
- Low-latency dictation with streaming partials and reliable delivery.
- Rich, opt-in context capture to improve accuracy (app/window/url, optional ax/textbox/screenshot).
- Personalization via dictionary, snippets, styles, and post-process polish.
- Safe rollouts using feature flags, telemetry, and diagnostics.
- Insights, onboarding, and CrocOmni assistant surfaces.
- Preserve local-first data integrity and offline behavior.

### Functional Scope (Condensed)
- AudioWorklet capture with WebSocket streaming + file-upload fallback.
- Status bubble controls (mic, language, audio level) + context menu actions.
- History with raw/formatted/edited text, metrics, and metadata.
- Dictionary v2, snippets, and style profiles.
- Feature flags, telemetry/diagnostics, notifications inbox.
- Onboarding flow, insights/Wrapped metrics.
- CrocOmni assistant with context-aware sessions.
- Local inference/VAD fallback path (optional).
- File transcription with progress + exports (txt/md/json).

### Non-Functional Requirements (Condensed)
- First partial text < 700ms on supported machines.
- Recording never blocks UI; offline-first behavior remains stable.
- No sensitive capture uploaded without explicit consent.
- Feature flags enable rollback without new release.
- Local data is authoritative; sync is best-effort.
- Accessibility target: WCAG AA for hub/dialogs.

### Architecture Summary
- Modular Electron monolith: main process orchestrates pipeline; renderer handles UX and capture.
- Local SQLite is the source of truth; optional Supabase sync.
- Streaming transport with fallback, feature flag gating, and telemetry hooks.

### Tech Stack (Key)
- Electron ^35.7.5, Node.js 20.x, JavaScript (CJS).
- Audio: Web Audio + AudioWorklet; optional Opus encoding.
- Streaming: WebSocket; ASR via OpenAI Whisper; post-process via OpenAI Chat.
- Local DB: SQLite; Sync/Auth: Supabase JS.
- Input automation: nut-js.

### Data Model Highlights
- HistoryEntry: raw/formatted/edited text + context + metrics.
- Dictionary/Snippets/Styles for personalization.
- FeatureFlag + Notification + StatsSnapshot.
- FileTranscriptionJob for long-form uploads.
- CrocOmniConversation for assistant sessions.

### Operational Defaults (M0 Lock)
- Quota mode: hybrid.
- Entitlement authority: server-backed (Stripe/Supabase).
- Offline entitlement cache TTL: ~3 days, then fall back to FREE quota until online verification.

## Story Index
| Story | Status | Path |
| --- | --- | --- |
| 0.0.patch-logs | Unknown | `docs/stories/0.0.patch-logs.md` |
| 0.1.fix-edge-functions-authentication-and-token-handling | InProgress | `docs/stories/0.1.fix-edge-functions-authentication-and-token-handling.md` |
| 0.2.harden-renderer-and-navigation-security | Review | `docs/stories/0.2.harden-renderer-and-navigation-security.md` |
| 0.3.fix-sync-integrity-and-user-scoping | Ready for Review | `docs/stories/0.3.fix-sync-integrity-and-user-scoping.md` |
| 0.4.stabilize-core-recording-and-paste-flow | Ready for Review | `docs/stories/0.4.stabilize-core-recording-and-paste-flow.md` |
| 0.5.improve-performance-hot-paths | Ready for Review | `docs/stories/0.5.improve-performance-hot-paths.md` |
| 0.6.reduce-maintenance-risk-and-add-tests | Ready for Review | `docs/stories/0.6.reduce-maintenance-risk-and-add-tests.md` |
| 1.1.robustifier-cycle-enregistrement-etats | Done | `docs/stories/done/1.1.robustifier-cycle-enregistrement-etats.md` |
| 1.10.alerter-absence-audio-et-supprimer-faux-texte | Done | `docs/stories/done/1.10.alerter-absence-audio-et-supprimer-faux-texte.md` |
| 1.11.configurer-raccourci-dictation-dashboard | Done | `docs/stories/done/1.11.configurer-raccourci-dictation-dashboard.md` |
| 1.2.stabiliser-appels-openai-erreurs | Done | `docs/stories/done/1.2.stabiliser-appels-openai-erreurs.md` |
| 1.3.fiabiliser-saisie-curseur-retours | Done | `docs/stories/done/1.3.fiabiliser-saisie-curseur-retours.md` |
| 1.4.renforcer-persistence-locale-sync | Done | `docs/stories/done/1.4.renforcer-persistence-locale-sync.md` |
| 1.5.structurer-code-maintenance-evolution | Done | `docs/stories/done/1.5.structurer-code-maintenance-evolution.md` |
| 1.6.annuler-enregistrement-historique-recent | Done | `docs/stories/done/1.6.annuler-enregistrement-historique-recent.md` |
| 1.7.saisie-multiligne-collage-invisible | Done | `docs/stories/done/1.7.saisie-multiligne-collage-invisible.md` |
| 1.8.supprimer-texte-crocovoice-widget | Done | `docs/stories/done/1.8.supprimer-texte-crocovoice-widget.md` |
| 1.9.boutons-fenetre-principale | Done | `docs/stories/done/1.9.boutons-fenetre-principale.md` |
| 10.1-feature-flags-and-telemetry | Ready for Review | `docs/stories/10.1-feature-flags-and-telemetry.md` |
| 10.2-telemetry-and-quality-metrics | Ready for Review | `docs/stories/10.2-telemetry-and-quality-metrics.md` |
| 10.3-notifications-inbox | Ready for Review | `docs/stories/10.3-notifications-inbox.md` |
| 11.1-onboarding-flow | Ready for Review | `docs/stories/11.1-onboarding-flow.md` |
| 11.2-insights-and-wrapped | Ready for Review | `docs/stories/11.2-insights-and-wrapped.md` |
| 12.1-crocomni-ui-and-storage | Ready for Review | `docs/stories/12.1-crocomni-ui-and-storage.md` |
| 12.2-crocomni-context-injection-and-redaction | Ready for Review | `docs/stories/12.2-crocomni-context-injection-and-redaction.md` |
| 13.1-local-vad-and-asr-path | Draft | `docs/stories/13.1-local-vad-and-asr-path.md` |
| 13.2-fallback-ui-and-safeguards | Ready for Review | `docs/stories/13.2-fallback-ui-and-safeguards.md` |
| 13.3-audio-enhancement-layer | Ready for Review | `docs/stories/13.3-audio-enhancement-layer.md` |
| 13.4-local-enhancement-model-integration | Ready for Review | `docs/stories/13.4-local-enhancement-model-integration.md` |
| 14.1-windows-packaging-and-signing | Draft | `docs/stories/14.1-windows-packaging-and-signing.md` |
| 14.2-auto-update-service-and-ux | Draft | `docs/stories/14.2-auto-update-service-and-ux.md` |
| 14.3-release-pipeline-and-rollback | Draft | `docs/stories/14.3-release-pipeline-and-rollback.md` |
| 2.1.moderniser-shell-dashboard-navigation | DONE | `docs/stories/done/2.1.moderniser-shell-dashboard-navigation.md` |
| 2.2.moderniser-settings-history | Done | `docs/stories/done/2.2.moderniser-settings-history.md` |
| 2.3.moderniser-dictionary-sync-auth | Done | `docs/stories/done/2.3.moderniser-dictionary-sync-auth.md` |
| 2.4.authentification-supabase-et-paywall | Done | `docs/stories/done/2.4.authentification-supabase-et-paywall.md` |
| 2.5.creer-landing-signup | Done | `docs/stories/done/2.5.creer-landing-signup.md` |
| 2.6.refactor-dashboard-history-notes | Done | `docs/stories/done/2.6.refactor-dashboard-history-notes.md` |
| 2.7.notes-management-ui | Done | `docs/stories/done/2.7.notes-management-ui.md` |
| 3.1.forgot-password-flow | Done | `docs/stories/done/3.1.forgot-password-flow.md` |
| 3.2.quota-tracking-and-ui-display | Done | `docs/stories/done/3.2.quota-tracking-and-ui-display.md` |
| 3.3.paywall-enforcement-and-upgrade-cta | Done | `docs/stories/done/3.3.paywall-enforcement-and-upgrade-cta.md` |
| 3.4.subscription-purchase-and-portal-access | Done | `docs/stories/done/3.4.subscription-purchase-and-portal-access.md` |
| 3.5.stripe-subscription-backend-and-sync | Done | `docs/stories/done/3.5.stripe-subscription-backend-and-sync.md` |
| 4.1-dictionary-v2 | Ready for Review | `docs/stories/4.1-dictionary-v2.md` |
| 4.2-history-search-and-actions | Ready for Review | `docs/stories/4.2-history-search-and-actions.md` |
| 4.3-notes-view-and-crud | Ready for Review | `docs/stories/4.3-notes-view-and-crud.md` |
| 4.4-snippets-v1 | Ready for Review | `docs/stories/4.4-snippets-v1.md` |
| 4.5-history-metadata-and-quality-metrics | Ready for Review | `docs/stories/4.5-history-metadata-and-quality-metrics.md` |
| 5.1-adaptive-transcript-formatting-v1 | Ready for Review | `docs/stories/5.1-adaptive-transcript-formatting-v1.md` |
| 5.2-context-privacy-and-controls | Ready for Review | `docs/stories/5.2-context-privacy-and-controls.md` |
| 5.3-context-signals-and-profiles | Ready for Review | `docs/stories/5.3-context-signals-and-profiles.md` |
| 5.4-context-capture-retention-and-redaction | Ready for Review | `docs/stories/5.4-context-capture-retention-and-redaction.md` |
| 5.5-context-aware-post-process | Ready for Review | `docs/stories/5.5-context-aware-post-process.md` |
| 6.1-upload-flow-and-status | Ready for Review | `docs/stories/6.1-upload-flow-and-status.md` |
| 6.2-exports-v1 | Ready for Review | `docs/stories/6.2-exports-v1.md` |
| 7.1-onboarding-flow | Done | `docs/stories/done/7.1-onboarding-flow.md` |
| 7.2-permissions-and-diagnostics | Ready for Review | `docs/stories/7.2-permissions-and-diagnostics.md` |
| 8.1-low-latency-streaming | Ready for Review | `docs/stories/8.1-low-latency-streaming.md` |
| 8.2-streaming-transport-contract-and-reliability | Ready for Review | `docs/stories/8.2-streaming-transport-contract-and-reliability.md` |
| 9.1-status-bubble-and-context-menu | Ready for Review | `docs/stories/9.1-status-bubble-and-context-menu.md` |

## Consolidated Story Change Log (Newest First)

### 2026-01-31
- 14.3-release-pipeline-and-rollback (v0.1, PM): New story for release pipeline and rollback — `docs/stories/14.3-release-pipeline-and-rollback.md`
- 14.2-auto-update-service-and-ux (v0.1, PM): New story for auto-update service and UX — `docs/stories/14.2-auto-update-service-and-ux.md`
- 14.1-windows-packaging-and-signing (v0.1, PM): New story for Windows packaging/signing — `docs/stories/14.1-windows-packaging-and-signing.md`

### 2026-01-26
- 13.1-local-vad-and-asr-path (v0.2, PO): Extend scope: onboarding + model presets + local model manager — `docs/stories/13.1-local-vad-and-asr-path.md`

### 2026-01-25
- 9.1-status-bubble-and-context-menu (v0.2, PO): Removed click-through and repositioning requirements — `docs/stories/9.1-status-bubble-and-context-menu.md`
- 6.2-exports-v1 (v0.1, PO): Reactivated Epic 6 exports story — `docs/stories/6.2-exports-v1.md`
- 6.1-upload-flow-and-status (v0.1, PO): Reactivated Epic 6 upload flow story — `docs/stories/6.1-upload-flow-and-status.md`
- 5.5-context-aware-post-process (v0.1, PO): New story for context-aware post-process — `docs/stories/5.5-context-aware-post-process.md`
- 4.5-history-metadata-and-quality-metrics (v0.1, PO): New story to align PRD metrics requirements — `docs/stories/4.5-history-metadata-and-quality-metrics.md`
- 13.4-local-enhancement-model-integration (v0.1, PM): Story created for local enhancement integration — `docs/stories/13.4-local-enhancement-model-integration.md`
- 13.3-audio-enhancement-layer (v0.1, PM): Story created for adaptive audio diagnostics layer — `docs/stories/13.3-audio-enhancement-layer.md`
- 13.2-fallback-ui-and-safeguards (v0.1, PO): New story for fallback UI and safeguards — `docs/stories/13.2-fallback-ui-and-safeguards.md`
- 12.2-crocomni-context-injection-and-redaction (v0.1, PO): New story for CrocOmni context injection — `docs/stories/12.2-crocomni-context-injection-and-redaction.md`
- 11.2-insights-and-wrapped (v0.1, PO): New story for insights + Wrapped — `docs/stories/11.2-insights-and-wrapped.md`

### 2026-01-24
- 9.1-status-bubble-and-context-menu (v0.1, PO): New epic for bubble/menu UX — `docs/stories/9.1-status-bubble-and-context-menu.md`
- 8.2-streaming-transport-contract-and-reliability (v0.1, PO): New story for streaming protocol and reliability — `docs/stories/8.2-streaming-transport-contract-and-reliability.md`
- 8.1-low-latency-streaming (v0.1, PO): New epic for streaming pipeline — `docs/stories/8.1-low-latency-streaming.md`
- 5.4-context-capture-retention-and-redaction (v0.1, PO): New story for context capture governance — `docs/stories/5.4-context-capture-retention-and-redaction.md`
- 3.3.paywall-enforcement-and-upgrade-cta (v0.3, Dev): Cache quota snapshot at startup, on-demand quota error CTA, dashboard upgrade nudge — `docs/stories/done/3.3.paywall-enforcement-and-upgrade-cta.md`
- 13.1-local-vad-and-asr-path (v0.1, PO): New epic for local inference fallback — `docs/stories/13.1-local-vad-and-asr-path.md`
- 12.1-crocomni-ui-and-storage (v0.1, PO): Split CrocOmni UI/storage from context injection — `docs/stories/12.1-crocomni-ui-and-storage.md`
- 11.1-onboarding-flow (v0.1, PO): Split onboarding from insights — `docs/stories/11.1-onboarding-flow.md`
- 10.3-notifications-inbox (v0.1, PO): New story for notifications inbox — `docs/stories/10.3-notifications-inbox.md`
- 10.2-telemetry-and-quality-metrics (v0.1, PO): New story for quality metrics — `docs/stories/10.2-telemetry-and-quality-metrics.md`
- 10.1-feature-flags-and-telemetry (v0.1, PO): New epic for flags + telemetry — `docs/stories/10.1-feature-flags-and-telemetry.md`
- 0.6.reduce-maintenance-risk-and-add-tests (v1.1, James): Manual verification reported complete; DoD checklist recorded — `docs/stories/0.6.reduce-maintenance-risk-and-add-tests.md`
- 0.6.reduce-maintenance-risk-and-add-tests (v1.0, James): Modularize utilities, add core tests, and IPC listener cleanup — `docs/stories/0.6.reduce-maintenance-risk-and-add-tests.md`
- 0.6.reduce-maintenance-risk-and-add-tests (v0.1, Bob): Draft story created from Epic 1 — `docs/stories/0.6.reduce-maintenance-risk-and-add-tests.md`
- 0.5.improve-performance-hot-paths (v1.1, James): Manual verification reported complete; DoD checklist recorded — `docs/stories/0.5.improve-performance-hot-paths.md`
- 0.5.improve-performance-hot-paths (v1.0, James): Optimize audio IPC payload, add indexes, reduce settings writes, cache dictionary — `docs/stories/0.5.improve-performance-hot-paths.md`
- 0.5.improve-performance-hot-paths (v0.1, Bob): Draft story created from Epic 1 — `docs/stories/0.5.improve-performance-hot-paths.md`
- 0.4.stabilize-core-recording-and-paste-flow (v1.1, James): Manual verification reported complete; DoD checklist recorded — `docs/stories/0.4.stabilize-core-recording-and-paste-flow.md`
- 0.4.stabilize-core-recording-and-paste-flow (v1.0, James): Make transition lock exception-safe, serialize paste, refresh tray menu, load dotenv early — `docs/stories/0.4.stabilize-core-recording-and-paste-flow.md`
- 0.4.stabilize-core-recording-and-paste-flow (v0.1, Bob): Draft story created from Epic 1 — `docs/stories/0.4.stabilize-core-recording-and-paste-flow.md`
- 0.3.fix-sync-integrity-and-user-scoping (v1.1, James): Manual verification reported complete; DoD checklist recorded — `docs/stories/0.3.fix-sync-integrity-and-user-scoping.md`
- 0.3.fix-sync-integrity-and-user-scoping (v1.0, James): Implemented pagination, cursor strategy, user-scoped purge, and delete reconciliation — `docs/stories/0.3.fix-sync-integrity-and-user-scoping.md`
- 0.3.fix-sync-integrity-and-user-scoping (v0.1, Bob): Draft story created from Epic 1 — `docs/stories/0.3.fix-sync-integrity-and-user-scoping.md`
- 0.2.harden-renderer-and-navigation-security (v1.5, James): Reverted to single-click for link opening — `docs/stories/0.2.harden-renderer-and-navigation-security.md`
- 0.2.harden-renderer-and-navigation-security (v1.4, James): Open links on double-click + pointer cursor — `docs/stories/0.2.harden-renderer-and-navigation-security.md`
- 0.2.harden-renderer-and-navigation-security (v1.3, James): Open note editor links on click — `docs/stories/0.2.harden-renderer-and-navigation-security.md`
- 0.2.harden-renderer-and-navigation-security (v1.2, James): Restored selection before link insertion — `docs/stories/0.2.harden-renderer-and-navigation-security.md`
- 0.2.harden-renderer-and-navigation-security (v1.1, James): Remplaced note link prompt with internal modal — `docs/stories/0.2.harden-renderer-and-navigation-security.md`
- 0.2.harden-renderer-and-navigation-security (v1.0, James): Implemented renderer/dashboard DOM safety and navigation guards — `docs/stories/0.2.harden-renderer-and-navigation-security.md`
- 0.2.harden-renderer-and-navigation-security (v0.1, Bob): Draft story created from Epic 1 — `docs/stories/0.2.harden-renderer-and-navigation-security.md`
- 0.1.fix-edge-functions-authentication-and-token-handling (v1.0, James): Implemented auth verification changes and sync token removal — `docs/stories/0.1.fix-edge-functions-authentication-and-token-handling.md`
- 0.1.fix-edge-functions-authentication-and-token-handling (v0.2, Bob): Align story sources to architecture-only guidance — `docs/stories/0.1.fix-edge-functions-authentication-and-token-handling.md`
- 0.1.fix-edge-functions-authentication-and-token-handling (v0.1, Bob): Draft story created from Epic 1 — `docs/stories/0.1.fix-edge-functions-authentication-and-token-handling.md`

### 2026-01-23
- 3.3.paywall-enforcement-and-upgrade-cta (v0.2, Dev): Paywall dictation gating + CTA upgrade — `docs/stories/done/3.3.paywall-enforcement-and-upgrade-cta.md`

### 2026-01-22
- 3.5.stripe-subscription-backend-and-sync (v0.3, Dev): Validation en production (checkout + portal) — `docs/stories/done/3.5.stripe-subscription-backend-and-sync.md`
- 3.5.stripe-subscription-backend-and-sync (v0.2, Dev): Stripe backend + webhook + sync — `docs/stories/done/3.5.stripe-subscription-backend-and-sync.md`
- 3.5.stripe-subscription-backend-and-sync (v0.1, Dev): Creation de la story 3.5 — `docs/stories/done/3.5.stripe-subscription-backend-and-sync.md`
- 3.4.subscription-purchase-and-portal-access (v0.2, Dev): Checkout/portal + statut abonnement UI — `docs/stories/done/3.4.subscription-purchase-and-portal-access.md`

### 2026-01-21
- 7.1-onboarding-flow (v0.2, Gemini): Refonte UX pour focus "Magic Moment" + details techniques Windows — `docs/stories/done/7.1-onboarding-flow.md`
- 4.3-notes-view-and-crud (v0.3, Dev): Focused note view with markdown preview and centered layout — `docs/stories/4.3-notes-view-and-crud.md`
- 4.3-notes-view-and-crud (v0.2, Dev): Notes modal editor, autosave, dictation target save, undo delete — `docs/stories/4.3-notes-view-and-crud.md`

### 2026-01-20
- 7.2-permissions-and-diagnostics (v0.1, PO): Story created from global PRD Epic 7 shard plan — `docs/stories/7.2-permissions-and-diagnostics.md`
- 7.1-onboarding-flow (v0.1, PO): Story created from global PRD Epic 7 shard plan — `docs/stories/done/7.1-onboarding-flow.md`
- 5.3-context-signals-and-profiles (v0.1, PO): Story created from global PRD Epic 5 shard plan — `docs/stories/5.3-context-signals-and-profiles.md`
- 5.2-context-privacy-and-controls (v0.1, PO): Story created from global PRD Epic 5 shard plan — `docs/stories/5.2-context-privacy-and-controls.md`
- 5.1-adaptive-transcript-formatting-v1 (v0.1, PO): Story created from global PRD Epic 5 shard plan — `docs/stories/5.1-adaptive-transcript-formatting-v1.md`
- 4.4-snippets-v1 (v0.1, PO): Story created from global PRD Epic 4 shard plan — `docs/stories/4.4-snippets-v1.md`
- 4.3-notes-view-and-crud (v0.1, PO): Story created from global PRD Epic 4 shard plan — `docs/stories/4.3-notes-view-and-crud.md`
- 4.2-history-search-and-actions (v0.1, PO): Story created from global PRD Epic 4 shard plan — `docs/stories/4.2-history-search-and-actions.md`
- 4.1-dictionary-v2 (v0.1, PO): Story created from global PRD Epic 4 shard plan — `docs/stories/4.1-dictionary-v2.md`
- 3.4.subscription-purchase-and-portal-access (v0.3, Dev): Auto-refresh + polling abonnement, message pending — `docs/stories/done/3.4.subscription-purchase-and-portal-access.md`

### 2026-01-19
- 3.2.quota-tracking-and-ui-display (v0.3, Dev): RPC snapshot + migration addition — `docs/stories/done/3.2.quota-tracking-and-ui-display.md`

### 2026-01-18
- 3.2.quota-tracking-and-ui-display (v0.2, Dev): Quota tracking + dashboard display — `docs/stories/done/3.2.quota-tracking-and-ui-display.md`
- 3.1.forgot-password-flow (v0.2, Dev): Magic link + set password flow — `docs/stories/done/3.1.forgot-password-flow.md`
- 2.7.notes-management-ui (v0.1, James): Ajout d’une vue Notes manuelle avec formulaire, API notes:add et filtres contextuels — `docs/stories/done/2.7.notes-management-ui.md`
- 2.3.moderniser-dictionary-sync-auth (v0.3, Dev): Debounced auto-sync after local changes — `docs/stories/done/2.3.moderniser-dictionary-sync-auth.md`
- 2.3.moderniser-dictionary-sync-auth (v0.2, Dev): Dictionary actions polish + sync/auth status UI — `docs/stories/done/2.3.moderniser-dictionary-sync-auth.md`
- 2.2.moderniser-settings-history (v0.2, Dev): History loading/error polish + empty state messaging — `docs/stories/done/2.2.moderniser-settings-history.md`
- 2.1.moderniser-shell-dashboard-navigation (v0.3, James): Alignement du dashboard avec le nouveau style premium fourni — `docs/stories/done/2.1.moderniser-shell-dashboard-navigation.md`
- 1.11.configurer-raccourci-dictation-dashboard (v0.3, Dev): Validation utilisateur — `docs/stories/done/1.11.configurer-raccourci-dictation-dashboard.md`
- 1.11.configurer-raccourci-dictation-dashboard (v0.2, Dev): Shortcut capture UI + safe rollback — `docs/stories/done/1.11.configurer-raccourci-dictation-dashboard.md`
- 1.10.alerter-absence-audio-et-supprimer-faux-texte (v0.4, Dev): Validation utilisateur — `docs/stories/done/1.10.alerter-absence-audio-et-supprimer-faux-texte.md`
- 1.10.alerter-absence-audio-et-supprimer-faux-texte (v0.3, Dev): Add low-audio prefilter in renderer (RMS) — `docs/stories/done/1.10.alerter-absence-audio-et-supprimer-faux-texte.md`
- 1.10.alerter-absence-audio-et-supprimer-faux-texte (v0.2, Dev): Implement no-audio alert + filler detection — `docs/stories/done/1.10.alerter-absence-audio-et-supprimer-faux-texte.md`

### 2026-01-17
- 2.6.refactor-dashboard-history-notes (v0.2, James): Implémentation backend + UI pour onglets Notes/History, recherche globale, actions Copy/Delete, dictionnaire et titres IA — `docs/stories/done/2.6.refactor-dashboard-history-notes.md`
- 1.10.alerter-absence-audio-et-supprimer-faux-texte (v0.1, PM): Creation de la dev story — `docs/stories/done/1.10.alerter-absence-audio-et-supprimer-faux-texte.md`

### 2026-01-16
- 2.6.refactor-dashboard-history-notes (v0.1, PM): Création de la story pour refactoriser les notes/historique, actions copy/delete et recherche — `docs/stories/done/2.6.refactor-dashboard-history-notes.md`
- 2.1.moderniser-shell-dashboard-navigation (v0.2, James): Modernisation du shell, navigation premium et controles fenetre custom — `docs/stories/done/2.1.moderniser-shell-dashboard-navigation.md`
- 1.9.boutons-fenetre-principale (v0.7, Dev): Retrait handler inline (evite double maximize). — `docs/stories/done/1.9.boutons-fenetre-principale.md`
- 1.9.boutons-fenetre-principale (v0.6, Dev): Boutons ancrés au header (no-drag). — `docs/stories/done/1.9.boutons-fenetre-principale.md`
- 1.9.boutons-fenetre-principale (v0.5, Dev): Handler inline de secours pour clics. — `docs/stories/done/1.9.boutons-fenetre-principale.md`
- 1.9.boutons-fenetre-principale (v0.4, Dev): Boutons fixes hors zones drag pour clics fiables. — `docs/stories/done/1.9.boutons-fenetre-principale.md`
- 1.9.boutons-fenetre-principale (v0.3, Dev): Fix clics (fallback action + auth-locked). — `docs/stories/done/1.9.boutons-fenetre-principale.md`
- 1.9.boutons-fenetre-principale (v0.2, Dev): Boutons fenetre relies aux actions (dataset + bind). — `docs/stories/done/1.9.boutons-fenetre-principale.md`
- 1.5.structurer-code-maintenance-evolution (v0.2, Dev): Isolation pipeline + documentation integrations + checks manuels. — `docs/stories/done/1.5.structurer-code-maintenance-evolution.md`
- 1.4.renforcer-persistence-locale-sync (v0.2, Dev): Renforcement serialisation SQLite, retention documentee, sync deferree en enregistrement. — `docs/stories/done/1.4.renforcer-persistence-locale-sync.md`
- 1.1.robustifier-cycle-enregistrement-etats (v0.2, Dev): Debounce start/stop par action + mise a jour taches — `docs/stories/done/1.1.robustifier-cycle-enregistrement-etats.md`

### 2026-01-15
- 3.4.subscription-purchase-and-portal-access (v0.1, PM): Creation de la dev story — `docs/stories/done/3.4.subscription-purchase-and-portal-access.md`
- 3.2.quota-tracking-and-ui-display (v0.1, PM): Creation de la dev story — `docs/stories/done/3.2.quota-tracking-and-ui-display.md`
- 3.1.forgot-password-flow (v0.1, PM): Creation de la dev story — `docs/stories/done/3.1.forgot-password-flow.md`
- 2.3.moderniser-dictionary-sync-auth (v0.1, PM): Creation de la dev story — `docs/stories/done/2.3.moderniser-dictionary-sync-auth.md`
- 2.2.moderniser-settings-history (v0.1, PM): Creation de la dev story — `docs/stories/done/2.2.moderniser-settings-history.md`
- 2.1.moderniser-shell-dashboard-navigation (v0.1, PM): Creation de la dev story — `docs/stories/done/2.1.moderniser-shell-dashboard-navigation.md`
- 1.9.boutons-fenetre-principale (v0.1, PM): Creation de la dev story — `docs/stories/done/1.9.boutons-fenetre-principale.md`
- 1.8.supprimer-texte-crocovoice-widget (v0.1, PM): Creation de la dev story — `docs/stories/done/1.8.supprimer-texte-crocovoice-widget.md`
- 1.7.saisie-multiligne-collage-invisible (v0.1, PM): Creation de la dev story — `docs/stories/done/1.7.saisie-multiligne-collage-invisible.md`
- 1.6.annuler-enregistrement-historique-recent (v0.4, Dev): Validation utilisateur — `docs/stories/done/1.6.annuler-enregistrement-historique-recent.md`
- 1.6.annuler-enregistrement-historique-recent (v0.3, Dev): Undo UI polish (hide pill, progress bar visibility, hover pause, resize) — `docs/stories/done/1.6.annuler-enregistrement-historique-recent.md`
- 1.6.annuler-enregistrement-historique-recent (v0.2, Dev): Implemented cancel/undo flow + history preview formatting — `docs/stories/done/1.6.annuler-enregistrement-historique-recent.md`
- 1.6.annuler-enregistrement-historique-recent (v0.1, PM): Creation de la dev story — `docs/stories/done/1.6.annuler-enregistrement-historique-recent.md`
- 1.5.structurer-code-maintenance-evolution (v0.1, PM): Creation de la dev story — `docs/stories/done/1.5.structurer-code-maintenance-evolution.md`
- 1.4.renforcer-persistence-locale-sync (v0.1, PM): Creation de la dev story — `docs/stories/done/1.4.renforcer-persistence-locale-sync.md`
- 1.3.fiabiliser-saisie-curseur-retours (v0.1, PM): Creation de la dev story — `docs/stories/done/1.3.fiabiliser-saisie-curseur-retours.md`
- 1.2.stabiliser-appels-openai-erreurs (v0.1, PM): Creation de la dev story — `docs/stories/done/1.2.stabiliser-appels-openai-erreurs.md`
- 1.11.configurer-raccourci-dictation-dashboard (v0.1, PM): Creation de la dev story — `docs/stories/done/1.11.configurer-raccourci-dictation-dashboard.md`
- 1.1.robustifier-cycle-enregistrement-etats (v0.1, PM): Creation de la dev story — `docs/stories/done/1.1.robustifier-cycle-enregistrement-etats.md`
