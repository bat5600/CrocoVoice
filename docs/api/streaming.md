# Streaming Protocol (v1)

> **Deprecated**: streaming is currently disabled due to stability issues. This protocol is kept for reference.

## Overview
This document specifies the client-to-server streaming protocol used by CrocoVoice for low-latency dictation. It supports PCM (default) and optional Opus payloads, with a file-upload fallback on failure.

## Transport
- WebSocket v1 (single connection per session)
- Messages are JSON unless noted. Binary payloads are allowed for audio chunks.

## Session
- Each session has a unique `session_id` (UUID v4).
- Chunks are ordered with a strictly increasing `seq` starting at 0.
- Client must send `start` before any `chunk`.
- Client must send `stop` to finalize.

## Message Types

### Client -> Server

#### start
```
{
  "type": "start",
  "session_id": "<uuid>",
  "codec": "pcm" | "opus",
  "sample_rate": 16000,
  "chunk_ms": 900,
  "client": {
    "app_version": "1.0.0",
    "platform": "win32"
  }
}
```
Notes:
- `codec` defaults to `pcm`.
- If `codec=opus`, server should accept `audio/webm;codecs=opus` chunks.

#### chunk (PCM)
```
{
  "type": "chunk",
  "session_id": "<uuid>",
  "seq": 0,
  "codec": "pcm",
  "sample_rate": 16000,
  "samples": <Float32Array or binary payload>
}
```

#### chunk (Opus)
```
{
  "type": "chunk",
  "session_id": "<uuid>",
  "seq": 0,
  "codec": "opus",
  "mime": "audio/webm;codecs=opus",
  "payload": <binary>
}
```

#### stop
```
{
  "type": "stop",
  "session_id": "<uuid>"
}
```

#### ping
```
{ "type": "ping", "at": 1737830000000 }
```

### Server -> Client

#### ack
```
{ "type": "ack", "session_id": "<uuid>" }
```

#### partial
```
{ "type": "partial", "session_id": "<uuid>", "text": "Bonjour..." }
```

#### final
```
{ "type": "final", "session_id": "<uuid>", "text": "Bonjour tout le monde." }
```

#### error
```
{
  "type": "error",
  "session_id": "<uuid>",
  "code": "invalid_order" | "payload_too_large" | "timeout" | "unsupported_codec",
  "message": "Human readable message"
}
```

#### pong
```
{ "type": "pong", "at": 1737830000000 }
```

## Reliability Rules
- Heartbeat: client sends `ping` every 10s, server replies `pong`.
- Disconnect/backoff: client retries with exponential backoff (1s, 2s, 4s, max 10s).
- Out-of-order chunks MUST be rejected with `error: invalid_order`.
- On `error`, client must stop streaming and fall back to file upload.

## Limits (client-side)
- Max session duration: 60 minutes
- Max PCM chunk size: 15 seconds @ 16 kHz (`240k` samples)
- Max Opus chunk size: 5 MB

## Fallback
If streaming fails (timeout, disconnect, error), client should:
1. Close the WebSocket session.
2. Switch to the file-based upload pipeline.

## Configuration
These settings are client-configurable:
- `streamChunkMs` (default: 900)
- `streamSampleRate` (default: 16000)
- `featureFlags.streaming` (default: false)
- `featureFlags.worklet` (default: false)
