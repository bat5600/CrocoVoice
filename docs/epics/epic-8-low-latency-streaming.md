# Epic 8 — Low Latency Streaming Pipeline

## Status
Draft

## Story
**As a** user,
**I want** dictation to stream with low latency,
**so that** I can see text quickly and trust the system is responsive.

## Acceptance Criteria
1. AudioWorklet chunking is used for low-latency capture (file mode remains as fallback).
2. Streaming transport is configurable (WebSocket first, fallback to file upload).
3. Partial transcripts are displayed in the status bubble during recording.
4. Final transcript replaces partials and is persisted to history.
5. Streaming pipeline is gated behind feature flags and can be disabled safely.

## Tasks / Subtasks
- [ ] Add AudioWorklet capture path and IPC chunk transfer (AC: 1)
- [ ] Add streaming transport abstraction and fallback to file upload (AC: 2)
- [ ] Add partial transcript UI updates in status bubble (AC: 3)
- [ ] Persist final transcript and clear partials on completion (AC: 4)
- [ ] Add feature flags for streaming and worklet (AC: 5)

## Dev Notes
- Keep MediaRecorder path for compatibility.
- Ensure ArrayBuffer transfers are used to avoid JSON overhead.
- Add guard rails for transport failures.

### Testing
- Manual: verify low-latency partial updates, fallback behavior.
- Integration: mock transport, assert final transcript persistence.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-24 | v0.1 | New epic for streaming pipeline | PO |

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
