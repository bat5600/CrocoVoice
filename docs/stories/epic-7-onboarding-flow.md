# Epic 7 — Onboarding flow (first-run success, Windows-first)

## Status
Draft

## Story
**As a** new user,  
**I want** a guided onboarding that helps me grant the required OS permissions and complete a first successful dictation,  
**so that** I succeed on the first session without confusion.

## Acceptance Criteria
1. On first launch (or when onboarding is incomplete), the app shows a guided onboarding flow with clear steps.
2. Windows-first: onboarding helps the user get to a first successful “dictate → deliver” loop, including a microphone check and a delivery check (type/paste/clipboard fallback).
3. The flow is clear and reassuring: each step explains “why”, offers a primary CTA, and has a simple failure path (retry + next action).
4. Onboarding ends with a lightweight success confirmation (or a clear failure reason with next actions).
5. Onboarding state is persisted locally (can be resumed; doesn’t reappear once completed unless user explicitly resets it).

## Tasks / Subtasks
- [ ] Define minimal onboarding state + persistence (AC: 1,5)
- [ ] Implement onboarding UI flow (stepper, modal, or dedicated view) (AC: 1,3)
- [ ] Implement Windows-first checks and a “first successful dictation” verification (AC: 2,4)
- [ ] Add clear user feedback (success/failure) and easy next actions (AC: 3,4)

## Dev Notes
- Likely stored in `store.js` settings (e.g., `onboarding:*` keys) and surfaced via `main.js`/IPC to `dashboard.js`.
- Permission handling differs across OS; keep UX resilient with fallbacks and clear messaging.
- Hotkey setup should reuse existing settings patterns and not break current flows.
- The exact UX is intentionally left to the dev (keep it minimal, fast, and consistent with the existing dashboard/widget UI).

### Testing
- Manual (Windows): clean profile first run; simulate failures (no mic, delivery failure); resume flow; verify completion persistence.
- Regression: ensure existing dictation flows remain unchanged for returning users.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-20 | v0.1 | Story created from global PRD Epic 7 shard plan | PO |

## Dev Agent Record
### Agent Model Used
TBD

### Debug Log References
N/A

### Completion Notes List
- TBD

### File List
- TBD

## QA Results
