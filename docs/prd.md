# CrocoVoice Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Deliver a low-latency dictation pipeline with streaming feedback comparable to FakeWispr.
- Capture rich context (app/url/ax/textbox/screenshot) with explicit privacy controls.
- Make post-process context-aware (redacted app/window/url hints) to improve proper nouns.
- Expand personalization (styles, tone match, dictionary/snippets, auto-learn) to improve output quality.
- Provide multi-window UX (hub + status bubble + context menu) for fast control.
- Add feature flags, telemetry, and diagnostics to support safe rollouts and reliability.
- Build insights (top apps, WPM, streaks, Wrapped) and a stronger onboarding flow to improve retention.
- Add CrocOmni (Flow-lens-like) assistant for context-aware help.
- Preserve local-first reliability and avoid data loss under offline conditions.

### Background Context
CrocoVoice is a local-first Electron dictation app with a clear pipeline but limited context capture, observability, and UX surfaces. FakeWispr demonstrates a data-rich, low-latency pipeline with streaming, context-aware personalization, and robust product surfaces (hub, status bubble, context menu, onboarding, insights, notifications). This PRD upgrades CrocoVoice to a similar level of robustness while preserving the existing local-first architecture and minimal UI friction.

### Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-24 | v1.0 | Reframed PRD toward robustness parity with FakeWispr | PM |

## Requirements

### Functional
1. FR1: The renderer must support AudioWorklet-based chunking for low-latency audio capture.
2. FR2: The main process must support WebSocket streaming with a file-upload fallback (gRPC out of scope for v1).
3. FR3: Optional Opus encoding must be supported for streaming paths.
4. FR4: Streaming partial transcript updates must be visible in the status bubble (or hub) while recording.
5. FR5: The app must capture app name, window title, and URL (when available) for each dictation.
6. FR6: Optional signals (ax/textbox, screenshot) must be opt-in with per-app controls.
7. FR7: History entries must store multiple text stages (raw, formatted, edited) and quality metrics (latency, divergence).
8. FR8: Dictionary v2 must store usage stats, last used, source, and auto-learned entries.
9. FR9: Snippets (voice cue -> template) must be supported with safe matching and offline-first behavior.
10. FR10: Styles must support work/personal/email profiles and optional style detection.
11. FR11: Polish must provide a before/after diff viewer and allow auto-open on completion.
12. FR12: The app must provide multi-window UX: hub, status bubble, context menu.
13. FR13: The status bubble must allow mic selection, language selection, and show audio level.
14. FR14: Feature flags (local + remote) must gate pipeline, UX, and ops changes.
15. FR15: Diagnostics must support opt-in log upload and device info capture.
16. FR16: Local notifications must work with OS APIs; remote notifications must sync to an inbox.
17. FR17: Insights must compute top apps, WPM, dictation time, and streak metrics.
18. FR18: Onboarding must be a multi-step flow with resume support (permissions, mic test, shortcuts, use-cases).
19. FR19: CrocOmni must store conversation history with optional context signals.
20. FR20: Data usage controls must allow opting out of telemetry and context capture.
21. FR21: Sync must remain non-blocking and offline-friendly (local is source of truth).
22. FR22: Optional local inference/VAD must be supported as a fallback path.
23. FR23: The app must support local transcription of uploaded audio files with visible progress.
24. FR24: Users must be able to export transcripts as txt/md/json with optional timestamps.
25. FR25: Post-process must optionally use redacted context (app/window/url) when context capture is enabled.

### Non Functional
1. NFR1: End-to-end latency (start -> first partial text) should be < 700ms on supported machines.
2. NFR2: Recording must never block UI; streaming must not freeze renderer.
3. NFR3: No sensitive data (screenshots, text) is uploaded without explicit user consent.
4. NFR4: Feature flags must allow safe rollback without a new release.
5. NFR5: Local data is authoritative; sync failures never block dictation.
6. NFR6: All new modules must be testable with unit or integration tests.
7. NFR7: The new architecture must remain compatible with current Electron packaging.
8. NFR8: Accessibility targets WCAG AA for hub UI and dialogs.

## User Interface Design Goals

### Overall UX Vision
Fast, low-friction dictation with immediate feedback and minimal window switching. The status bubble is always-on and provides core controls; the hub provides deep management and insights.

### Key Interaction Paradigms
- Always-on status bubble with quick actions.
- Context menu for instant mic/language and paste actions.
- Hub for history, notes, dictionary, personalization, settings, and insights.

### Core Screens and Views
- Status Bubble (recording state, mic, language, audio level)
- Context Menu (quick actions, diff viewer)
- Hub: History, Dictionary, Snippets, Notes, Personalization, Settings
- Onboarding Flow (permissions, mic test, shortcuts, use-cases)
- Insights / Wrapped / Streaks

### Accessibility
WCAG AA

### Branding
Maintain CrocoVoice brand and visual system; introduce consistent tone for system sounds and status cues.

### Target Device and Platforms
Desktop Only (Electron)

### UX Artifacts (Authoritative)
- Front-end spec: docs/front-end-spec.md
- UX brief: docs/ux/cahier-des-charges-crocovoice-2-0.md

## Technical Assumptions

### Repository Structure
Monorepo (existing)

### Service Architecture
Monolith Electron app with optional Supabase edge functions; modularized services inside main/renderer.

### Testing Requirements
Unit + Integration; light E2E where feasible.

### Additional Technical Assumptions and Requests
- Keep JavaScript (CommonJS) for now; introduce TypeScript only if justified.
- Use existing OpenAI integration; allow alternate ASR providers as optional fallback.
- Use SQLite for local storage; sync via Supabase remains optional.
- Add WebSocket service for streaming, with configurable endpoint and defined protocol.

## Epic List (aligned with docs/stories)

1. Epic 4: Dictionary / History / Notes / Snippets (stories 4.1-4.5)
2. Epic 5: Context Signals + Profiles + Adaptive Formatting + Privacy + Retention (stories 5.1-5.4)
3. Epic 6: Long-Form Uploads + Exports (stories 6.1-6.2)
4. Epic 7: Permissions & Diagnostics (existing story 7.2)
5. Epic 8: Low-Latency Streaming Pipeline (stories 8.1-8.2)
6. Epic 9: Status Bubble + Context Menu (story 9.1)
7. Epic 10: Feature Flags, Telemetry, Metrics, Notifications (stories 10.1-10.3)
8. Epic 11: Onboarding & Insights (stories 11.1-11.2)
9. Epic 12: CrocOmni Assistant (stories 12.1-12.2)
10. Epic 13: Local Inference Fallback (stories 13.1-13.4)

## Epic Mapping to Story Files

| Epic | Scope | Story Files | Epic Overview |
| --- | --- | --- | --- |
| Epic 4 | Dictionary/History/Notes/Snippets | docs/stories/4.1-dictionary-v2.md, 4.2-history-search-and-actions.md, 4.3-notes-view-and-crud.md, 4.4-snippets-v1.md, 4.5-history-metadata-and-quality-metrics.md | docs/epics/epic-4-dictionary-history-notes-snippets.md |
| Epic 5 | Context signals + Privacy + Context-aware Post-process + Retention (adaptive formatting deferred) | docs/stories/5.1-adaptive-transcript-formatting-v1.md (deferred), 5.2-context-privacy-and-controls.md, 5.3-context-signals-and-profiles.md, 5.4-context-capture-retention-and-redaction.md, 5.5-context-aware-post-process.md | docs/epics/epic-5-context-privacy-retention.md |
| Epic 6 | Long-Form Uploads + Exports | docs/stories/6.1-upload-flow-and-status.md, 6.2-exports-v1.md | docs/epics/epic-6-long-form-uploads-exports.md |
| Epic 7 | Permissions & Diagnostics | docs/stories/7.2-permissions-and-diagnostics.md | docs/epics/epic-7-permissions-and-diagnostics.md |
| Epic 8 | Streaming Pipeline | docs/stories/8.1-low-latency-streaming.md, 8.2-streaming-transport-contract-and-reliability.md | docs/epics/epic-8-low-latency-streaming.md |
| Epic 9 | Status Bubble + Context Menu | docs/stories/9.1-status-bubble-and-context-menu.md | docs/epics/epic-9-status-bubble-and-context-menu.md |
| Epic 10 | Flags + Telemetry + Metrics + Notifications | docs/stories/10.1-feature-flags-and-telemetry.md, 10.2-telemetry-and-quality-metrics.md, 10.3-notifications-inbox.md | docs/epics/epic-10-feature-flags-telemetry-notifications.md |
| Epic 11 | Onboarding + Insights | docs/stories/11.1-onboarding-flow.md, 11.2-insights-and-wrapped.md | docs/epics/epic-11-onboarding-and-insights.md |
| Epic 12 | CrocOmni Assistant | docs/stories/12.1-crocomni-ui-and-storage.md, 12.2-crocomni-context-injection-and-redaction.md | docs/epics/epic-12-crocomni-assistant.md |
| Epic 13 | Local Inference | docs/stories/13.1-local-vad-and-asr-path.md, 13.2-fallback-ui-and-safeguards.md, 13.3-audio-enhancement-layer.md, 13.4-local-enhancement-model-integration.md | docs/epics/epic-13-local-inference-fallback.md |

## Checklist Results Report
Pending after PM checklist.

## Next Steps

### UX Expert Prompt
Review this PRD and propose hub/status/context-menu UX flows, with emphasis on streaming feedback, mic/language controls, and privacy controls for context capture.
