# Epic 5 — Context Signals, Profiles, Privacy, Retention

## Status
Draft

## Goal
Capture useful context safely and use it to improve post-processing (proper nouns) without compromising user privacy.

## User Value
- Better proper-noun handling using app/window/url hints during post-process
- Clear control over what data is captured
- Reduced surprise from context usage

## In Scope
- Context capture is OFF by default; when enabled, capture app/window/url (where available)
- Optional sensitive signals (ax/textbox/screenshot) with explicit opt-in
- Per-app overrides for context capture
- Context-aware post-process using redacted context hints
- Retention and redaction rules before any upload/sync

## Out of Scope
- Adaptive formatting per app/use-case (deferred)
- Full meeting capture or background monitoring
- Team/enterprise retention policies
- Automated context labeling without user control

## Dependencies
- Permissions and diagnostics (Epic 7)
- Feature flags and telemetry opt-in (Epic 10)

## Risks
- Privacy concerns if opt-in is unclear
- Incorrect context leading to wrong proper nouns
- OS permission friction

## Success Criteria
- Users can clearly enable/disable context globally and per app
- Default behavior is safe and minimal
- Post-process improves proper nouns without introducing extra corrections

## KPIs
- % of users enabling context capture
- Proper-noun correction rate (manual edits after dictation)
- Support tickets related to privacy or unexpected formatting

## Shard Plan (Stories)
- `docs/stories/5.1-adaptive-transcript-formatting-v1.md` — profile-based formatting (deferred)
- `docs/stories/5.2-context-privacy-and-controls.md` — global/per-app toggles and privacy copy
- `docs/stories/5.3-context-signals-and-profiles.md` — signal capture and profile mapping
- `docs/stories/5.4-context-capture-retention-and-redaction.md` — retention, redaction, and limits
- `docs/stories/5.5-context-aware-post-process.md` — inject redacted context hints into post-process

## Anti-Duplication Notes
- Telemetry event collection is Epic 10
- CrocOmni context injection is Epic 12
- History metadata storage is Epic 4.5
