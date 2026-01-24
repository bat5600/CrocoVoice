# Epic 7 — Permissions and Diagnostics

## Status
Draft

## Goal
Make failures diagnosable and permission issues actionable on first run.

## User Value
- Faster setup and fewer failures
- Clear explanations for delivery errors
- Safe export of diagnostics for support

## In Scope
- Permission detection (mic, accessibility/automation, clipboard)
- Diagnostics UI surface
- Failure reasons and recovery hints
- Copy/export diagnostics with redaction
- Loading indicators for external web opens

## Out of Scope
- Auto-fix OS permission issues
- Support portal or ticketing integration

## Dependencies
- Core dictation pipeline (Epic 1)
- Hub and status UI surfaces

## Risks
- OS-specific differences and regression risk
- Diagnostics data leaking sensitive content if not redacted

## Success Criteria
- Majority of users can complete onboarding and deliver a dictation in first session
- Failure reasons are visible and actionable

## KPIs
- First-session success rate
- Volume of permission-related support issues

## Shard Plan (Stories)
- `docs/stories/7.2-permissions-and-diagnostics.md` — permissions + diagnostics + export

## Anti-Duplication Notes
- Onboarding flow details live in Epic 11
- Telemetry pipeline and error reporting live in Epic 10
