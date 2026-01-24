# Requirements

These requirements are based on my understanding of the existing system and the two audits. Please review carefully and confirm they align with the project's reality.

## Functional
1. FR1: Edge Functions must verify Supabase JWT signatures using Supabase auth verification (or JWKS), rejecting forged tokens.
2. FR2: Stripe checkout/portal functions must reuse the shared auth verifier and remove ad-hoc JWT parsing.
3. FR3: All renderer UI elements that display external/user-controlled strings must avoid innerHTML and use safe DOM APIs.
4. FR4: External navigation must be blocked in Electron windows; external links must open via shell.openExternal.
5. FR5: Sync purge operations must be scoped to the authenticated user as defense in depth.
6. FR6: Sync must support pagination and server-based cursors to avoid missing rows and clock-skew drift.
7. FR7: Sync must support delete propagation (tombstones or reconciliation) for offline deletes.
8. FR8: Audio payload IPC must avoid Array-from JSON conversion and use native ArrayBuffer transfer.
9. FR9: Main-process recording transition lock must be exception-safe (try/finally) to avoid permanent lockout.
10. FR10: Paste flow must be serialized to prevent overlapping clipboard writes and race conditions.
11. FR11: Local SQLite must add indexes for hot queries and purges without changing schema semantics.
12. FR12: Settings updates must avoid unnecessary bulk writes when a single key changes.
13. FR13: Preload IPC listeners must support cleanup to prevent duplicate handlers during reloads.
14. FR14: Core shared helpers (word count, subscription logic, retention logic) must be de-duplicated into a shared module.
15. FR15: Main-process code must be modularized into smaller units without changing external behavior.
16. FR16: A minimal automated test suite must cover recording state transitions, quota logic, dictionary application, and sync cursor behavior.
17. FR17: Supabase schema and RLS for synced tables must be represented in migrations to allow deterministic backend setup.

## Non Functional
1. NFR1: Security fixes must not introduce new privileged renderer capabilities or widen IPC surface area.
2. NFR2: Performance must not regress; audio processing latency should improve for large recordings.
3. NFR3: Reliability must improve; no known blocking states should remain in recording flow.
4. NFR4: Sync changes must preserve existing data and avoid destructive migrations.
5. NFR5: Test suite must run locally without external services (mocked Supabase/OpenAI).
6. NFR6: The existing user experience and UI layout must remain visually consistent.

## Compatibility Requirements
1. CR1: Existing IPC APIs and renderer behaviors remain compatible with current UI.
2. CR2: Database schema changes are additive and backward compatible.
3. CR3: UI styling and interaction patterns remain consistent with current app.
4. CR4: Integration with Supabase, SQLite, and OpenAI must maintain current behavior and config expectations.
