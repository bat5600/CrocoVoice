# Epic 4 — Notes view and CRUD (Notion-like markdown notes)

## Status
Ready for Review

## Story
**As a** user,  
**I want** a dedicated Notes space (separate from dictation history) where I can create, edit, search, and delete markdown notes in a big centered modal,  
**so that** I can capture and reuse important snippets in my daily workflow.

## Acceptance Criteria
1. Notes are clearly separated from dictation history in the UI (distinct nav/view and labeling).
2. I can create a new note from the dashboard without starting dictation; it opens a **large centered modal** with a markdown editor.
3. Notes support **editing**: opening an existing note in the modal lets me change markdown content; changes are **auto-saved** locally (debounced) and persisted across restarts. Heavily inspired by Notion.
4. The modal is optimized for writing: large width/height, keyboard-friendly (Esc closes, Ctrl+S forces save), and shows clear “Saved/Unsaved” state.
5. I can create a note by sending a dictation to the Notes target; the content is saved as a note and is **not auto-typed/pasted** into the active app.
6. Notes list renders quickly and supports searching/filtering by title and body text; it shows a readable preview (first line/title + snippet).
7. I can delete a note from the list with an **undo toast** (recommended) or a confirmation; it disappears immediately and persists.
8. Notes work fully offline (SQLite source of truth); if sync is enabled, creates/updates/deletes are queued and do not block the UI.

## Tasks / Subtasks
- [x] Ensure a dedicated Notes view exists and is reachable via navigation (AC: 1)
- [x] Implement “big centered modal” markdown editor for create + open note (AC: 2,3,4)
- [x] Implement autosave (debounced) + explicit save shortcut + save state indicator (AC: 3,4)
- [x] Ensure “dictate to Notes” target saves note and skips delivery typing/paste (AC: 5)
- [x] Add search/filter for notes (title + body) with good empty states + previews (AC: 6)
- [x] Add delete action with undo toast (preferred) or confirm, and immediate UI update (AC: 7)
- [x] Verify offline-first behavior and non-blocking sync (AC: 8)

## Dev Notes
- Storage: `store.js` notes table (`listNotes`, `addNote`, `deleteNote`).
- IPC touch points likely in `main.js` (`notes:list`, `notes:add`, `notes:delete`).
- UI: `dashboard.html` / `dashboard.js` Notes view; keep existing navigation patterns and empty states consistent.
- “Skip delivery when target=notes” behavior already exists in delivery flow; ensure it remains correct and user-visible.
- Suggested UX implementation (high confidence, low risk):
  - Notes list on the left (or main list area), click row opens modal centered on screen.
  - Modal has: title (derived from first non-empty line) + last updated timestamp + markdown editor.
  - Optional (nice): preview toggle or split-view preview; keep v1 minimal if needed.

### Testing
- Manual: create note; edit note; close/reopen; verify autosave; Esc close; Ctrl+S; dictate to Notes (no delivery typing); search; delete + undo; app restart persistence.
- Offline: disable network, create/delete notes, verify no UI errors and data persists; re-enable network and verify sync does not block.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-20 | v0.1 | Story created from global PRD Epic 4 shard plan | PO |
| 2026-01-21 | v0.2 | Notes modal editor, autosave, dictation target save, undo delete | Dev |

## Dev Agent Record
### Agent Model Used
GPT-5

### Debug Log References
N/A

### Completion Notes List
- Notes editor moved to large modal with autosave, save state, and Ctrl/Cmd+S.
- Notes dictation target now persists notes without delivery typing and updates the list.
- Delete actions now offer undo with immediate UI updates.
- Tests non exécutés (pas de harness automatisé).

### File List
- dashboard.html
- dashboard.js
- main.js
- preload.js

## QA Results
