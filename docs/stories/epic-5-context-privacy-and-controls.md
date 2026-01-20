# Epic 5 - Context Privacy and Controls

## Status
Draft

## Story
**As a** user,
**I want** clear privacy controls for contextual awareness,
**so that** I can enable or disable it confidently.

## Acceptance Criteria
1. A global toggle enables/disables contextual awareness across the app.
2. Users can override behavior per app (force on/off or choose a profile).
3. The UI explains which signals are used (active app/window) and what is not stored.
4. Disabling contextual awareness preserves the standard formatting pipeline.
5. Settings changes apply immediately and persist locally.

## Tasks / Subtasks
- [ ] Add global contextual awareness toggle to settings (AC: 1,4,5)
- [ ] Add per-app overrides in profile settings (AC: 2,5)
- [ ] Add privacy copy explaining signals and data handling (AC: 3)
- [ ] Ensure toggles affect the pipeline at runtime (AC: 4,5)

## Dev Notes
- Avoid collecting or storing app content; only store app identifiers and profile settings.
- Keep language clear and non-technical in the UI.

### Testing
- Manual: toggle global switch and confirm formatting reverts to default.
- Manual: per-app override supersedes global setting.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-20 | v0.1 | Story created from global PRD Epic 5 shard plan | PO |

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
