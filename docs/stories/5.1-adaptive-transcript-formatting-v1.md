# Epic 5 - Adaptive Transcript Formatting v1

## Status
Draft

## Story
**As a** user,
**I want** my dictation to adapt in tone and formatting based on the active app profile,
**so that** the output matches the context without extra editing.

## Acceptance Criteria
1. The app applies per-app profile rules to punctuation, line breaks, and structure before delivery.
2. Tone presets (e.g., concise vs. conversational) are supported and influence the final text.
3. The adaptation step is deterministic and does not change meaning or remove content.
4. The user can preview or test a profile with sample input in settings.
5. If a profile is missing or disabled, the default formatting pipeline is used.

## Tasks / Subtasks
- [ ] Add formatting/tone parameters to the profile schema (AC: 1,2)
- [ ] Implement adaptive formatting step in the pipeline (AC: 1,3,5)
- [ ] Add a preview/test UI for profiles (AC: 4)
- [ ] Ensure delivery output uses the adapted text (AC: 1)

## Dev Notes
- Keep this v1 rule-based; avoid introducing model or network dependencies.
- Log profile usage for debugging when enabled.

### Testing
- Manual: dictation in two apps produces different formatting based on profiles.
- Manual: profile disabled or missing uses default formatting.

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
