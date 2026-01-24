# Epic 8 — Low-Latency Streaming Pipeline

## Status
Draft

## Goal
Provide low-latency streaming dictation with reliable fallback and clear protocol rules.

## Scope
- AudioWorklet capture + partial transcript UX
- WebSocket streaming transport with heartbeat, backoff, ordering
- Optional Opus encoding
- File-upload fallback

## Stories (Shards)
- `docs/stories/8.1-low-latency-streaming.md`
- `docs/stories/8.2-streaming-transport-contract-and-reliability.md`

## Sharding
Multi-story (2).
