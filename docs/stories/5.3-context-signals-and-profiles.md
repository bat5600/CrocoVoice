# Epic 5 - Context Signals and Profiles

## Status
Draft

## Story
**As a** user,
**I want** the app to detect what I am currently using and apply a matching context profile,
**so that** my dictation is formatted appropriately without manual setup each time.

## Acceptance Criteria
1. The app can detect the active app/window using accessibility permissions on supported OSes.
2. A context profile exists for each supported app, with configurable tone, formatting, and vocabulary hints.
3. If the active app has no profile or permissions are missing, the app falls back to default behavior.
4. Users can create, edit, and delete app profiles, and changes persist locally.
5. Profile selection is deterministic and debuggable (simple rule: active app bundle ID or window title match).

## Tasks / Subtasks
- [ ] Implement active app/window detection and expose it to the UI (AC: 1,5)
- [ ] Define context profile schema and storage (AC: 2,4)
- [ ] Add basic profile management UI (list/edit/create/delete) (AC: 4)
- [ ] Apply profile selection and fallback rules (AC: 3,5)

## Dev Notes
- Prefer local-only storage for profiles (no network dependency).
- Keep detection logic simple; avoid brittle heuristics.
- Use existing settings patterns for persistence and UI layout.

### Testing
- Manual: switch between two apps with distinct profiles and verify applied settings.
- Manual: remove permissions and confirm fallback behavior with clear messaging.

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
