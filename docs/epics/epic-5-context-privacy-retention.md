# Epic 5 — Context Signals, Profiles, Privacy, Retention

## Status
Draft

## Goal
Capture useful context safely and adapt formatting without compromising user privacy.

## User Value
- Better formatting per app and use-case
- Clear control over what data is captured
- Reduced surprise from context usage

## In Scope
- App/window/url context capture by default
- Optional sensitive signals (ax/textbox/screenshot) with explicit opt-in
- Per-app profiles and overrides
- Adaptive formatting based on profiles
- Retention and redaction rules before any upload/sync

## Out of Scope
- Full meeting capture or background monitoring
- Team/enterprise retention policies
- Automated context labeling without user control

## Dependencies
- Permissions and diagnostics (Epic 7)
- Feature flags and telemetry opt-in (Epic 10)

## Risks
- Privacy concerns if opt-in is unclear
- Incorrect context leading to wrong tone/format
- OS permission friction

## Success Criteria
- Users can clearly enable/disable context globally and per app
- Default behavior is safe and minimal
- Adaptive formatting is deterministic and reversible

## KPIs
- % of users enabling context capture
- Profile usage frequency
- Support tickets related to privacy or unexpected formatting

## Shard Plan (Stories)
- `docs/stories/5.1-adaptive-transcript-formatting-v1.md` — profile-based formatting + optional style detection hints
- `docs/stories/5.2-context-privacy-and-controls.md` — global/per-app toggles and privacy copy
- `docs/stories/5.3-context-signals-and-profiles.md` — signal capture and profile mapping
- `docs/stories/5.4-context-capture-retention-and-redaction.md` — retention, redaction, and limits

## Anti-Duplication Notes
- Telemetry event collection is Epic 10
- CrocOmni context injection is Epic 12
- History metadata storage is Epic 4.5
