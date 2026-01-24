# Epic 4 — Dictionary v1

## Status
Draft

## Story
**As a** user,  
**I want** a Dictionary where I can add and manage correction rules,  
**so that** CrocoVoice consistently fixes recurring terms in my transcriptions.

## Acceptance Criteria
1. I can add a dictionary entry from the dashboard (term + correction) and it is persisted locally.
2. I can delete a dictionary entry from the dashboard and it is removed immediately.
3. Dictionary corrections are applied in the dictation pipeline consistently (same behavior for widget and dashboard flows).
4. Matching rules are explicit and predictable (v1 recommendation):
   - Case-insensitive matching.
   - Whole-word matching by default (avoid surprising replacements inside other words).
   - When multiple terms match, apply the **most specific** (longest term) first; do not re-replace inside already replaced segments.
5. Dictionary works offline (SQLite source of truth); if sync is enabled, upserts/deletes are queued and non-blocking.
6. Empty states and errors are user-friendly (no silent failures).

## Tasks / Subtasks
- [ ] Confirm dictionary UI supports add + delete with clear validation (AC: 1,2,6)
- [ ] Define and implement matching rules and conflict resolution (AC: 4)
- [ ] Ensure dictionary is applied in the main pipeline for all dictation entry points (AC: 3)
- [ ] Ensure offline-first behavior and non-blocking sync (AC: 5)

## Dev Notes
- Storage: `store.js` dictionary table (`listDictionary`, `upsertDictionary`, `deleteDictionary`).
- Pipeline: `main.js` has a “record → transcribe → post-process → dictionary → persist → type” flow; dictionary application should live in the main process.
- UI: `dashboard.html` / `dashboard.js` Dictionary view; keep patterns consistent with Notes/History.
- UX recommendation for clarity:
  - Show “From → To” rows and allow quick delete.
  - Add lightweight validation: non-empty term, prevent exact duplicates, and show a small example preview (“This will change …”).

### Testing
- Manual: add entries, verify text transforms, delete entries, verify transforms stop applying, restart persistence.
- Edge cases: overlapping entries, casing, accents, punctuation boundaries.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-20 | v0.1 | Story created from global PRD Epic 4 shard plan | PO |

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
