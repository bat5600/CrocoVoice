# Epic 10 — Feature Flags and Telemetry

## Status
Draft

## Story
**As a** developer,
**I want** feature flags and telemetry controls,
**so that** new capabilities can be rolled out safely and monitored.

## Acceptance Criteria
1. A feature flag service supports local overrides and remote fetch with TTL caching.
2. Flags can gate pipeline changes (streaming, polish diff, context capture).
3. Telemetry supports opt-in error reporting and product metrics.
4. Diagnostics log upload is user-initiated and redacts secrets.

## Tasks / Subtasks
- [ ] Implement feature flag store (local + remote) (AC: 1,2)
- [ ] Add flag gating hooks in main/renderer (AC: 2)
- [ ] Add telemetry provider wrapper with opt-in (AC: 3)
- [ ] Add diagnostics upload flow with redaction (AC: 4)

## Dev Notes
- Ensure flags fail closed if remote config is unavailable.
- Avoid capturing PII unless explicitly allowed.

### Testing
- Unit: flag evaluation, TTL cache.
- Manual: opt-in/out telemetry and log upload.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-24 | v0.1 | New epic for flags + telemetry | PO |

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
