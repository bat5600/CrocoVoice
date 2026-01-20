# Epic 7 — Permissions and diagnostics (Windows-first)

## Status
Draft

## Story
**As a** user,  
**I want** clear diagnostics when dictation or delivery fails (mic/permissions/paste/typing),  
**so that** I can understand what went wrong and fix it quickly.

## Acceptance Criteria
1. When dictation fails due to missing mic permission/device issues, the UI shows a clear reason and next action (retry / open settings).
2. When delivery fails (typing/paste/clipboard), the app explains why it likely failed and confirms the text is still available (clipboard fallback + toast).
3. A Diagnostics surface exists (screen/modal) that shows: permission statuses, last delivery mode used, and recent relevant errors/events.
4. Diagnostics includes Windows-first self-checks: microphone availability, hotkey registration status, clipboard write/read test, and last delivery attempt outcome.
5. Diagnostics can be copied/exported as text for support/debugging without exposing sensitive user content by default (redact transcripts; include counts/lengths only).
6. External web opens (billing portal, help links) show a clear loading indicator until the system browser is opened (or errors).

## Tasks / Subtasks
- [ ] Add/standardize failure reasons for mic and delivery flows (AC: 1,2)
- [ ] Implement Diagnostics UI surface and required data plumbing (AC: 3)
- [ ] Add Windows-first self-checks and display them (AC: 4)
- [ ] Implement safe “copy diagnostics” export (AC: 5)
- [ ] Add loading indicators for external web opens (AC: 6)

## Dev Notes
- Delivery pipeline and fallback behavior is main-process-driven (`main.js`); emit structured failure reasons/events to the renderer for display.
- Keep diagnostics privacy-safe: avoid including full transcripts by default; include metadata and error codes/messages.
- UI: align to existing toast/status banner patterns in `dashboard.js` / `renderer.js`.
- Suggested diagnostics fields (v1):
  - App version + OS + locale
  - Last 20 events (timestamp + code + short message)
  - Microphone: device count + last getUserMedia error (if any)
  - Delivery: last mode attempted (type/paste/clipboard) + last failure reason + fallback used
  - Clipboard: write/read test results
  - Hotkey: configured shortcut + registration status

### Testing
- Manual: simulate permission denied, no mic device, paste failure, typing failure; verify diagnostics accuracy and clipboard fallback.
- UX: verify loading indicator for external web opens appears and clears reliably.

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
