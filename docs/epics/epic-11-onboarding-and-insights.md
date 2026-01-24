# Epic 11 — Onboarding and Insights

## Status
Draft

## Story
**As a** user,
**I want** a guided onboarding flow and meaningful insights,
**so that** I can activate quickly and stay engaged.

## Acceptance Criteria
1. Onboarding covers permissions, mic test, shortcuts, and use-cases.
2. Onboarding progress can be resumed after interruption.
3. Insights show top apps, WPM, dictation time, and streaks.
4. Wrapped summary can be generated locally and respects privacy settings.

## Tasks / Subtasks
- [ ] Build onboarding wizard with persistent progress (AC: 1,2)
- [ ] Implement insights calculations from history (AC: 3)
- [ ] Add Wrapped summary UI (AC: 4)

## Dev Notes
- Store onboarding state locally in settings.
- Ensure insights compute without remote dependency.

### Testing
- Manual: onboarding resume, insights correctness, privacy toggles.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-24 | v0.1 | New epic for onboarding + insights | PO |

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
