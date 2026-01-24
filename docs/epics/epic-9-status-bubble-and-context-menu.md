# Epic 9 — Status Bubble and Context Menu

## Status
Draft

## Goal
Deliver lightweight control surfaces for dictation without opening the hub.

## User Value
- Faster access to mic/language controls
- Quick actions without workflow breaks
- Clear visual feedback during recording

## In Scope
- Status bubble with recording state, audio level, mic, language
- Context menu with quick actions (paste last, open settings, open diff)
- Polish diff viewer for before/after text
- Feature flag gating for safe rollout

## Out of Scope
- Full settings or history management (hub only)
- Advanced theming or customization

## Dependencies
- Streaming partials and pipeline state (Epic 8)
- Feature flags (Epic 10)
- Permissions diagnostics (Epic 7)

## Risks
- UI clutter or distraction
- Inconsistent behavior across OSes

## Success Criteria
- Mic/language changes are reliable and immediate
- Quick actions complete without opening the hub
- Diff viewer opens/closes without blocking delivery

## KPIs
- Status bubble usage rate
- Action success rate (paste/open diff)

## Shard Plan (Stories)
- `docs/stories/9.1-status-bubble-and-context-menu.md` — bubble, menu, diff viewer

## Anti-Duplication Notes
- Hub management lives in Epic 4 and Epic 11
- Telemetry pipeline lives in Epic 10
