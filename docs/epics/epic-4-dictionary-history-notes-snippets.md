# Epic 4 — Dictionary, History, Notes, Snippets

## Status
Draft

## Goal
Deliver daily-driver data surfaces that make dictation reusable, editable, and personalized.

## User Value
- Faster reuse of past dictations
- Fewer repetitive corrections via dictionary/snippets
- Reliable local-first storage for notes and history

## In Scope
- Dictionary v2 with usage metadata and predictable matching rules
- History list/search/actions with offline-first behavior
- History metadata + quality metrics storage
- Notes CRUD in the hub
- Snippets (voice cues -> templates) applied in the pipeline

## Out of Scope
- Team/shared dictionaries or notes
- Real-time collaboration
- Advanced semantic search (later epic)

## Dependencies
- Stable dictation pipeline (Epic 1)
- Local SQLite store and sync pipeline
- Hub UI patterns

## Risks
- Performance degradation with large history sets
- Confusing matching rules for dictionary/snippets
- Data conflicts when sync is enabled

## Success Criteria
- History list loads and is searchable for >= 200 entries without noticeable lag
- Dictionary and snippets apply consistently in the main pipeline
- Notes and history remain fully functional offline

## KPIs
- History search response time
- Dictionary usage frequency per week
- Snippet usage frequency per week

## Shard Plan (Stories)
- `docs/stories/4.1-dictionary-v2.md` — dictionary rules + usage metadata
- `docs/stories/4.2-history-search-and-actions.md` — list, search, copy/delete/undo
- `docs/stories/4.3-notes-view-and-crud.md` — notes surfaces and CRUD
- `docs/stories/4.4-snippets-v1.md` — voice cues -> templates
- `docs/stories/4.5-history-metadata-and-quality-metrics.md` — raw/formatted/edited text + metrics

## Anti-Duplication Notes
- Telemetry/analytics pipeline lives in Epic 10
- Context capture and privacy controls live in Epic 5
- Onboarding/insights UX lives in Epic 11
