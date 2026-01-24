# Epic 11 — Onboarding and Insights

## Status
Draft

## Goal
Improve activation and retention through guided onboarding and usage insights.

## User Value
- Faster time-to-first-success
- Motivation through progress and wrapped summaries
- Clear understanding of app benefits

## In Scope
- Onboarding flow with resume support
- Permissions guidance and mic test
- Insights: top apps, WPM, dictation time, streaks
- Wrapped summary (local and privacy-safe)

## Out of Scope
- Marketing funnels or paid growth experiments
- Team dashboards

## Dependencies
- Permissions diagnostics (Epic 7)
- History metrics storage (Epic 4.5)
- Telemetry definitions (Epic 10) if metrics are sent remotely

## Risks
- Inaccurate metrics undermining trust
- Onboarding friction if steps are too long

## Success Criteria
- High first-session success rate
- Insights data matches user expectations

## KPIs
- Onboarding completion rate
- D7 retention lift after onboarding
- Insights usage frequency

## Shard Plan (Stories)
- `docs/stories/11.1-onboarding-and-insights.md` — onboarding + insights surfaces

## Anti-Duplication Notes
- Diagnostics UI details are Epic 7
- Telemetry pipeline is Epic 10
