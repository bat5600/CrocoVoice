# Epic 8 — Low-Latency Streaming Pipeline

## Status
Draft

## Goal
Provide live, low-latency dictation with partial transcripts and reliable fallbacks.

## User Value
- Immediate feedback while speaking
- Higher trust in responsiveness
- Reduced perceived latency

## In Scope
- AudioWorklet capture path
- WebSocket streaming transport
- Optional Opus encoding
- Partial transcript delivery to UI
- Fallback to file upload when streaming fails
- Feature flag gating

## Out of Scope
- gRPC transport
- Advanced multi-provider routing
- Full meeting automation

## Dependencies
- Permissions and diagnostics (Epic 7)
- Status bubble UI for partials (Epic 9)
- Telemetry/flags (Epic 10)

## Risks
- Disconnects causing lost text
- UI jank from large partial updates
- Latency spikes from encoding/transport

## Success Criteria
- First partial text visible < 700ms on supported machines
- Streaming recovers safely or falls back without data loss
- Feature flags can disable streaming safely

## KPIs
- First partial latency (ms)
- Stream failure rate and fallback rate
- Average dictation end-to-end latency

## Shard Plan (Stories)
- `docs/stories/8.1-low-latency-streaming.md` — AudioWorklet + partial transcript flow
- `docs/stories/8.2-streaming-transport-contract-and-reliability.md` — protocol, heartbeat, ordering, fallback

## Anti-Duplication Notes
- UI surfaces (status bubble, context menu) live in Epic 9
- Telemetry collection lives in Epic 10
- Local inference fallback lives in Epic 13
