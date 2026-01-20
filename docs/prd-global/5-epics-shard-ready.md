# 5) Epics (shard-ready)

Each epic below includes: goal, scope boundaries, shard plan, exit criteria, dependencies, and risks.

## Epic 1 — Stabilization & Core Reliability (`DONE`)
**Goal**
- Make the end-to-end dictation flow reliable and predictable (state management, retries, error recovery, delivery fallback).

**In scope**
- Single source of truth for dictation state (avoid double triggers).
- Robust OpenAI/Whisper calls (timeouts, retries, clear error states).
- Delivery reliability (type/paste/clipboard fallbacks; never lose text).
- Local persistence robustness (serialized SQLite access; offline-first behavior).
- Optional Supabase sync that never blocks the local flow.

**Out of scope**
- New major product features (meetings, context awareness, search).

**Shard plan (what to create next)**
- `docs/stories/epic-1-state-machine-and-recording.md`
- `docs/stories/epic-1-openai-errors-and-retries.md`
- `docs/stories/epic-1-delivery-fallbacks-and-telemetry.md`
- `docs/stories/epic-1-sqlite-safety-and-sync-nonblocking.md`

**Exit criteria**
- No duplicate recordings from hotkey/widget; stable idle→recording→processing→delivered loop.
- Clear user-visible error handling; text always recoverable via clipboard.
- No UI freezes during STT/post-process.

**Dependencies**
- None (core).

**Risks**
- OS permission edge cases; inconsistent paste/typing behavior across apps.

## Epic 2 — Premium Dashboard UX (`DONE`)
**Goal**
- Ship a premium SaaS-like dashboard UI without breaking existing flows.

**In scope**
- Shell/navigation, typography/spacing, split view, glass header, smart list rows.
- Consistent empty/loading/error states.
- Keep existing data and IPC behaviors intact.

**Out of scope**
- New data models or major workflow changes.

**Shard plan**
- `docs/stories/epic-2-dashboard-shell-and-navigation.md`
- `docs/stories/epic-2-settings-history-premium-states.md`
- `docs/stories/epic-2-dictionary-sync-auth-premium-states.md`

**Exit criteria**
- All existing dashboard views work; UI is consistently premium and responsive.
- No new runtime dependencies (unless explicitly approved).

**Dependencies**
- `docs/front-end-spec.md` as design source of truth.

**Risks**
- Visual regressions; accessibility/focus traps.

## Epic 3 — Freemium, Billing, and Auth Flows (`DONE`)
**Goal**
- Monetize with a simple FREE/PRO model (weekly quota) and solid auth/billing flows.

**In scope**
- Weekly word quota tracking based on final text.
- Just-in-time paywall (trigger on action, not always-on blocking UI).
- PRO checkout + customer portal + entitlement persistence across restarts.
- Forgot/reset password flow.
- UX details: loading indicators for slow web opens (billing/portal).
 - Server-backed entitlement (source of truth) with offline cached PRO TTL and fallback-to-FREE policy when stale.

**Out of scope**
- Advanced pricing plans, team billing, enterprise controls.

**Shard plan**
- `docs/stories/epic-3-quota-definition-and-persistence.md`
- `docs/stories/epic-3-paywall-ux-and-triggering.md`
- `docs/stories/epic-3-billing-entitlements-and-portal.md`
- `docs/stories/epic-3-auth-reset-password.md`

**Exit criteria**
- Quota is correct and does not reset incorrectly on app restart.
- At 0 quota, dictation attempts show paywall and provide upgrade path; non-dictation areas remain usable.
- Subscription status is accurate and fast to access; user sees loading states.

**Dependencies**
- Stripe (or equivalent) for billing; Supabase auth where applicable.

**Risks**
- Client-only enforcement can be bypassed; entitlement syncing inconsistencies.

## Epic 4 — Daily Driver: History, Notes, Dictionary, Snippets (`NOW`)
**Goal**
- Make CrocoVoice a daily companion: capture, store, refine, reuse.

**In scope**
- Notes view (create/list/search/delete) distinct from dictation history (Notion-like).
- Premium history list (search, copy/delete, hover actions, good empty states).
- Dictionary v1 (manual add; optional “add from correction” hooks).
- Snippets v1 (voice cues mapped to templates; simple matching rules).
- Style previews (“before/after”) where relevant.

**Out of scope**
- Advanced semantic search, team collaboration, enterprise permissions.

**Shard plan**
- `docs/stories/epic-4-notes-view-and-crud.md`
- `docs/stories/epic-4-history-search-and-actions.md`
- `docs/stories/epic-4-dictionary-v1.md`
- `docs/stories/epic-4-snippets-v1.md`

**Exit criteria**
- Users can store/retrieve content quickly; common actions take < 2 seconds perceived.
- Notes/history/dictionary/snippets work offline with SQLite as source of truth.

**Dependencies**
- Epic 1 stability.

**Risks**
- Data model creep; UX clutter.

## Epic 5 — Contextual Awareness & Adaptive Output (`NEXT`)
**Goal**
- Adapt transcript style, tone, and formatting based on the active app and user context, using local signals.

**In scope**
- Active app/window detection via accessibility permissions.
- Per-app context profiles (tone, formatting, templates, vocabulary hints).
- Adaptive output rules (punctuation/structure tweaks; name handling where possible).
- User controls: global toggle, per-app overrides, privacy messaging.

**Out of scope**
- Deep integrations, marketplaces/SDKs, or 2-way sync.
- Automated actions/commands beyond formatting.

**Shard plan**
- `docs/stories/epic-5-context-signals-and-profiles.md`
- `docs/stories/epic-5-adaptive-transcript-formatting-v1.md`
- `docs/stories/epic-5-context-privacy-and-controls.md`

**Exit criteria**
- When dictating in supported apps, output matches the app profile consistently.
- Users can disable contextual awareness globally or per app; default behavior is preserved if context is unavailable.

**Dependencies**
- Accessibility/automation permissions (Epic 7).
- Local settings/profile storage.

**Risks**
- Permission friction; incorrect context leading to wrong tone/format; privacy concerns.

## Epic 6 — Long Form: Uploads & Exports (`NEXT`)
**Goal**
- Support long recordings (file uploads) and practical exports.

**In scope**
- Upload + processing status + saved results in history.
- Exports v1: md/txt/json; optional timestamps.
- Batch upload as a stretch goal (if it does not complicate MVP).

**Out of scope**
- Full meeting automation; advanced diarization; enterprise archival.

**Shard plan**
- `docs/stories/epic-6-upload-flow-and-status.md`
- `docs/stories/epic-6-exports-v1.md`

**Exit criteria**
- Files can be uploaded and transcribed with visible progress; exports work reliably.

**Dependencies**
- Storage strategy (local vs cloud), privacy/retention decisions.

**Risks**
- Large file handling; cost spikes; privacy concerns.

## Epic 7 — Onboarding, Permissions & Diagnostics (`NOW`)
**Goal**
- Make first-run success high and failures debuggable (especially OS permissions and delivery failures).

**In scope**
- Guided onboarding: mic permission, accessibility/automation permission, hotkey setup.
- Diagnostics: “why paste/type failed”, “why mic not detected”, “why no text inserted”.
- UX: clear loading indicators for external web opens (billing portal, help links).

**Out of scope**
- Full self-serve support portal, automated OS repair scripts (unless needed).

**Shard plan**
- `docs/stories/epic-7-onboarding-flow.md`
- `docs/stories/epic-7-permissions-and-diagnostics.md`

**Exit criteria**
- Majority of users can complete onboarding and successfully deliver a dictation on first session.

**Dependencies**
- OS APIs; Electron permission patterns.

**Risks**
- Platform differences; ongoing OS updates breaking behaviors.

## Epic 8 — Voice-to-Action (Intent & Orchestration) (`NEXT`)
**Goal**
- Turn speech into structured intent and execute a small set of safe actions.

**In scope**
- Intent detection for a small, explicit action set (e.g., “create a note”, “copy”, “open settings”).
- Confirmation gates for risky actions.
- Routing to context-aware delivery targets (paste/clipboard, notes, app-targeted insert).

**Out of scope**
- Full OS assistant replacement; arbitrary command execution.

**Shard plan**
- `docs/stories/epic-8-intent-taxonomy-and-safety.md`
- `docs/stories/epic-8-action-execution-v1.md`

**Exit criteria**
- High precision on supported intents; low-risk execution with clear user confirmations.

**Dependencies**
- Epic 5 context signals/profiles; Epic 1 telemetry and reliability.

**Risks**
- Mis-execution; user trust loss; prompt brittleness.

## Epic 9 — Meeting Assistant (Manual → Assisted) (`LATER`)
**Goal**
- Capture meetings and produce searchable transcripts and actionable summaries.

**In scope (v1)**
- Manual meeting recording from within the app.
- Transcript + summary/action items; editable before sharing.
- Keyword search across meetings.

**Out of scope (v1)**
- Auto-join Zoom/Meet/Teams; advanced diarization; sentiment analytics.

**Shard plan**
- `docs/stories/epic-9-manual-meeting-recording.md`
- `docs/stories/epic-9-meeting-summary-and-actions.md`
- `docs/stories/epic-9-meeting-search-v1.md`

**Exit criteria**
- Users can reliably record, retrieve, and summarize meetings without complex automation.

**Dependencies**
- Privacy/consent; storage strategy; long-form pipeline maturity.

**Risks**
- Legal/privacy constraints; large audio storage; latency/cost.

## Epic 10 — Packaging, Distribution & Auto-Update (`LATER`)
**Goal**
- Ship releases safely and reduce support burden.

**In scope**
- Release process (versioning, changelog).
- Auto-update (or update notification + one-click).
- Crash reporting and basic diagnostics export.

**Out of scope**
- Enterprise managed deployments.

**Shard plan**
- `docs/stories/epic-10-release-pipeline-and-updates.md`
- `docs/stories/epic-10-crash-reporting-and-diagnostics-export.md`

**Exit criteria**
- Users can update with minimal friction; crashes are observable and triageable.

**Dependencies**
- Build/signing requirements per OS.

**Risks**
- Signing/notarization complexity; update failures causing trust issues.

## Epic 11 — Platform Expansion & Compatibility Matrix (`LATER`)
**Goal**
- Expand to Windows/Linux without sacrificing core reliability.

**In scope**
- OS abstraction for hotkeys, app focus, paste/typing, permissions.
- Compatibility matrix of target apps (Slack/Notion/VS Code/etc.) and required permissions.
- Cross-OS test plan.

**Out of scope**
- Perfect parity across all OS features from day one.

**Shard plan**
- `docs/stories/epic-11-os-abstraction-layer.md`
- `docs/stories/epic-11-compatibility-matrix-and-test-plan.md`

**Exit criteria**
- Clear platform strategy with staged rollout and measurable reliability.

**Dependencies**
- Epic 7 onboarding/permissions and diagnostics.

**Risks**
- OS APIs differences; high QA surface area.

## Epic 12 — Search, Knowledge Base & Retrieval (`LATER`)
**Goal**
- Help users find and reuse past content (history/notes/transcripts) and ask questions over it.

**In scope**
- Strong full-text search baseline.
- Optional semantic search/embeddings and RAG over user content.

**Out of scope**
- Team knowledge graph and enterprise governance (unless prioritized later).

**Shard plan**
- `docs/stories/epic-12-full-text-search.md`
- `docs/stories/epic-12-semantic-search-and-rag.md`

**Exit criteria**
- Users can find relevant content quickly; retrieval respects privacy and retention settings.

**Dependencies**
- Data model maturity (Epic 4/6/9); privacy policies (Epic 13).

**Risks**
- Cost growth; confusing results; privacy concerns.

## Epic 13 — Privacy, Security & Compliance (`LATER`)
**Goal**
- Build trust and reduce risk around sensitive audio and transcripts.

**In scope**
- Consent flows, retention policies, one-click deletion, transparency (what is stored and why).
- Encryption-at-rest where applicable; minimize audio storage by default.
- “Local-first” options roadmap (local STT/LLM) where feasible.

**Out of scope**
- Formal certifications (SOC2/HIPAA) unless required for target customers.

**Shard plan**
- `docs/stories/epic-13-privacy-controls-and-retention.md`
- `docs/stories/epic-13-security-baseline.md`

**Exit criteria**
- Clear, enforceable privacy posture with UX that users understand.

**Dependencies**
- Storage and sync decisions; legal review where needed.

**Risks**
- Regulatory requirements; user trust erosion after incidents.

## Epic 14 — Observability, Quality Loop & Cost Control (`LATER`)
**Goal**
- Continuously improve output quality while keeping costs under control.

**In scope**
- Event taxonomy and dashboards (internal).
- Quality feedback loop (thumbs up/down, “report bad output”).
- Prompt/versioning discipline; A/B test simple prompt variants.
- Budgets/alerts on API spend; per-user/per-action cost visibility.

**Out of scope**
- Complex experimentation platform.

**Shard plan**
- `docs/stories/epic-14-event-taxonomy-and-dashboards.md`
- `docs/stories/epic-14-quality-feedback-loop.md`
- `docs/stories/epic-14-cost-budgets-and-alerts.md`

**Exit criteria**
- Clear signal on quality and cost; ability to detect regressions quickly.

**Dependencies**
- Instrumentation hooks in core pipeline (Epic 1).

**Risks**
- Over-instrumentation; privacy concerns if telemetry is not designed carefully.
