# CrocoVoice Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Deliver a low-latency dictation pipeline with streaming feedback comparable to FakeWispr.
- Capture rich context (app/url/ax/textbox/screenshot) with explicit privacy controls.
- Expand personalization (styles, tone match, dictionary/snippets, auto-learn) to improve output quality.
- Provide multi-window UX (hub + status bubble + context menu) for fast control.
- Add feature flags, telemetry, and diagnostics to support safe rollouts and reliability.
- Build insights (top apps, WPM, streaks, Wrapped) and a stronger onboarding flow to improve retention.
- Enable teams/enterprise capabilities (invites, team dictionary, billing) where applicable.
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
2. FR2: The main process must support streaming transports (WebSocket and/or gRPC) with a file-upload fallback.
3. FR3: Optional Opus encoding must be supported for streaming paths.
4. FR4: Streaming partial transcript updates must be visible in the status bubble (or hub) while recording.
5. FR5: The app must capture app name, window title, URL (when available), and textbox context for each dictation.
6. FR6: Optional screenshot capture must be supported with user consent and per-app controls.
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
19. FR19: Team features must include invites, team dictionary, and team billing workflows.
20. FR20: Data usage controls must allow opting out of telemetry and context capture.
21. FR21: Sync must remain non-blocking and offline-friendly (local is source of truth).
22. FR22: Optional local inference/VAD must be supported as a fallback path.

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
- Add WebSocket service for streaming, with configurable endpoint.

## Epic List

1. Epic 1: Low-Latency Dictation Pipeline - AudioWorklet capture, streaming transport, and partial transcript feedback.
2. Epic 2: Context Capture & Privacy Controls - app/url/ax/screenshot capture with consent and per-app settings.
3. Epic 3: Personalization & Dictionary v2 - styles, snippets, auto-learn, and tone match.
4. Epic 4: Multi-Window UX & Polish - hub/status/context menu, mic/language selection, diff viewer.
5. Epic 5: Feature Flags, Telemetry & Diagnostics - remote config, logging, and opt-in diagnostics.
6. Epic 6: Insights & Onboarding - stats, streaks, Flow Wrapped, onboarding overhaul.
7. Epic 7: Teams & Notifications - team workflows, remote notifications inbox.
8. Epic 8: Local Inference & Offline Resilience - optional ONNX/VAD fallback.

## Epic Details

### Epic 1: Low-Latency Dictation Pipeline
Goal: Reduce perceived latency by moving to streaming audio capture and transport while preserving the current file-based fallback.

#### Story 1.1 AudioWorklet Chunker
As a user, I want low-latency audio capture, so that dictation starts instantly.

Acceptance Criteria
1. AudioWorklet captures audio in fixed-size chunks and streams to main.
2. Chunks are transferred using ArrayBuffer without JSON conversion.
3. Recording can still fall back to MediaRecorder file mode if needed.

#### Story 1.2 Streaming Transport Abstraction
As a user, I want streaming transcription, so that I see text earlier.

Acceptance Criteria
1. The app supports a streaming transport endpoint configuration.
2. If streaming fails, the pipeline falls back to file upload.
3. Transport is gated by a feature flag.

#### Story 1.3 Partial Transcript UX
As a user, I want live partial text, so that I can trust the system is working.

Acceptance Criteria
1. Partial transcripts are shown in the status bubble.
2. Final transcript replaces partials and is persisted to history.
3. Paste flow uses final text only.

### Epic 2: Context Capture & Privacy Controls
Goal: Capture context to improve personalization while giving users control.

#### Story 2.1 App/URL/Textbox Context
As a user, I want dictations tagged with app and url, so that I can filter and personalize.

Acceptance Criteria
1. History entries store app name, window title, and URL (when available).
2. Textbox snapshot is captured when accessible permissions are granted.
3. Context capture can be toggled off per user.

#### Story 2.2 Screenshot Capture
As a user, I want optional screenshots for richer context, so that AI can assist better.

Acceptance Criteria
1. Screenshot capture is opt-in and disabled by default.
2. Screenshots are stored locally and never synced without consent.
3. Per-app allow/deny list is supported.

### Epic 3: Personalization & Dictionary v2
Goal: Improve output quality via personalization and structured memory.

#### Story 3.1 Dictionary v2 with Usage Stats
As a user, I want dictionary entries to auto-learn and track usage, so that corrections improve over time.

Acceptance Criteria
1. Dictionary entries store lastUsed, frequencyUsed, source, and manual/auto flags.
2. Auto-learn can be toggled.
3. Team dictionary entries are supported if team mode is enabled.

#### Story 3.2 Snippets and Templates
As a user, I want voice cues to expand templates, so that I can produce structured text quickly.

Acceptance Criteria
1. Snippets support a cue and template with {{content}} placeholder.
2. Matching rules are conservative and documented.
3. Snippets work offline and sync when available.

#### Story 3.3 Style Profiles and Tone Match
As a user, I want output style profiles, so that dictation matches my context.

Acceptance Criteria
1. Work/personal/email styles are supported.
2. Style selection can be auto-detected by app type.
3. Tone match pairs are persisted for learning.

### Epic 4: Multi-Window UX & Polish
Goal: Provide fast controls and richer UX surfaces.

#### Story 4.1 Status Bubble Enhancements
As a user, I want a status bubble with controls, so that I can adjust input quickly.

Acceptance Criteria
1. Status bubble shows recording state, mic, language, audio level.
2. Mic and language can be changed during idle state.
3. Quick paste last transcript is available.

#### Story 4.2 Context Menu + Diff Viewer
As a user, I want a context menu and diff viewer, so that I can inspect polish results.

Acceptance Criteria
1. Context menu opens near cursor or bubble and lists key actions.
2. Polish diff viewer shows before/after text and auto-closes safely.
3. Diff viewer is gated by a feature flag.

### Epic 5: Feature Flags, Telemetry & Diagnostics
Goal: Improve reliability and safe rollout.

#### Story 5.1 Feature Flags Service
As a developer, I want a feature flag service, so that new features can be rolled out safely.

Acceptance Criteria
1. Flags can be set locally and fetched remotely.
2. Flags are cached with TTL and fail closed.
3. Flags are exposed to main and renderer.

#### Story 5.2 Diagnostics and Logs
As a user, I want opt-in diagnostics, so that support can help me faster.

Acceptance Criteria
1. Users can opt-in to share logs and device metadata.
2. Logs redact secrets and personal data.
3. Upload is triggered only by explicit user action.

### Epic 6: Insights & Onboarding
Goal: Improve activation and engagement with insights.

#### Story 6.1 Onboarding Overhaul
As a new user, I want a guided onboarding flow, so that I can get value quickly.

Acceptance Criteria
1. Onboarding includes permissions, mic test, shortcuts, and use-cases.
2. Onboarding can be resumed if interrupted.
3. Progress is stored locally.

#### Story 6.2 Insights and Wrapped
As a user, I want usage insights, so that I can see my progress.

Acceptance Criteria
1. Stats include top apps, WPM, dictation time, and streaks.
2. Wrapped summary can be generated locally.
3. Insights respect privacy settings.

### Epic 7: Teams & Notifications
Goal: Enable team workflows and proactive messaging.

#### Story 7.1 Teams and Billing
As a team admin, I want invites and billing, so that teams can adopt the app.

Acceptance Criteria
1. Team invites and membership are supported.
2. Team dictionary is enabled for team accounts.
3. Billing and subscription status are visible in settings.

#### Story 7.2 Notifications Inbox
As a user, I want remote notifications, so that I see product updates.

Acceptance Criteria
1. Remote notifications sync to a local inbox.
2. Notifications can be marked read/archived.
3. Local OS notifications use the system API.

### Epic 8: Local Inference & Offline Resilience
Goal: Provide optional local inference for fallback and privacy.

#### Story 8.1 Local Inference Toggle
As a user, I want a local inference toggle, so that I can run in privacy-first mode.

Acceptance Criteria
1. A local inference path is available when supported.
2. If local inference fails, cloud fallback is used.
3. Local inference status is visible in settings.

## Checklist Results Report
Pending after PM checklist.

## Next Steps

### UX Expert Prompt
Review this PRD and propose hub/status/context-menu UX flows, with emphasis on streaming feedback, mic/language controls, and privacy controls for context capture.
