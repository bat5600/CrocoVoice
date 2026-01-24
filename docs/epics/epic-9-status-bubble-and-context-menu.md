# Epic 9 — Status Bubble and Context Menu UX

## Status
Draft

## Story
**As a** user,
**I want** quick controls in a status bubble and context menu,
**so that** I can adjust mic/language and inspect polish without opening the hub.

## Acceptance Criteria
1. Status bubble shows recording state, audio level, mic, and language.
2. Mic selection dialog with volume indicator is available from bubble.
3. Context menu provides quick actions (paste last transcript, open settings, open polish diff).
4. Polish diff viewer shows before/after text and can auto-close safely.
5. All UX behaviors are gated by feature flags for safe rollout.

## Tasks / Subtasks
- [ ] Add status bubble indicators and mic/language controls (AC: 1,2)
- [ ] Implement context menu window and quick actions (AC: 3)
- [ ] Implement polish diff viewer (AC: 4)
- [ ] Gate new surfaces behind feature flags (AC: 5)

## Dev Notes
- Keep hub as deep management UI; bubble/menu should be lightweight.
- Use IPC domains for status events and polish events.

### Testing
- Manual: mic switch, language switch, paste last transcript, diff open/close.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-24 | v0.1 | New epic for bubble/menu UX | PO |

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
