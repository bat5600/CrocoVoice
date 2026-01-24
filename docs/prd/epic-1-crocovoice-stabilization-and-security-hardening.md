# Epic 1: CrocoVoice Stabilization and Security Hardening

**Epic Goal**: Secure and stabilize the current CrocoVoice codebase by eliminating critical vulnerabilities, improving sync integrity, and reducing maintenance risk without changing the user experience.

**Integration Requirements**: Maintain current dictation flow, IPC surface, Supabase connectivity, and local-first behavior; all changes must be additive and backward compatible.

## Story 1.1 Fix Edge Functions Authentication and Token Handling
As a user,
I want server-side authentication to be properly verified,
so that unauthorized access to quota and billing endpoints is prevented.

### Acceptance Criteria
1. Only JWTs with valid signatures are accepted by Edge Functions.
2. Stripe checkout/portal functions reuse shared auth verification logic.
3. Access tokens are not sent in request bodies when Authorization headers are present.
4. Regression tests or local validation steps confirm no auth bypass.

### Integration Verification
1. IV1: Existing quota and billing flows still work for valid users.
2. IV2: Unauthorized requests are rejected with clear errors.
3. IV3: No changes required to client configuration or keys.

## Story 1.2 Harden Renderer and Navigation Security
As a user,
I want renderer UIs to be safe from script injection,
so that the app cannot be compromised by untrusted strings.

### Acceptance Criteria
1. All user- or device-controlled strings are rendered via textContent or DOM APIs.
2. External links cannot open in Electron windows; they open in the OS browser.
3. The dashboard and widget remain visually and behaviorally unchanged.

### Integration Verification
1. IV1: Dictation UI, toasts, and settings display correctly.
2. IV2: Link clicks open externally and do not navigate the Electron window.
3. IV3: IPC APIs are unchanged from the renderer perspective.

## Story 1.3 Fix Sync Integrity and User Scoping
As a user,
I want sync to be reliable and user-scoped,
so that my data is consistent and protected.

### Acceptance Criteria
1. Remote purge operations are scoped by user_id as defense in depth.
2. Sync uses pagination for pull operations to avoid missing rows.
3. Sync cursor is based on server timestamps or max updated_at seen, not local clock.
4. Delete propagation is supported (tombstones or reconciliation) for offline deletes.

### Integration Verification
1. IV1: Existing synced tables still round-trip correctly.
2. IV2: Large datasets sync without missing records.
3. IV3: No user can affect another user's remote data.

## Story 1.4 Stabilize Core Recording and Paste Flow
As a user,
I want recording and paste to be reliable,
so that the app never gets stuck or corrupts my clipboard.

### Acceptance Criteria
1. transitionLock is always released via try/finally.
2. Paste operations are serialized to prevent overlap and clipboard stomping.
3. Tray menu reflects recording state accurately.
4. Dotenv is loaded before any config reads to avoid undefined values.

### Integration Verification
1. IV1: Start/stop recording works repeatedly without app restart.
2. IV2: Clipboard contents are restored correctly after paste.
3. IV3: Existing hotkeys and tray controls still work.

## Story 1.5 Improve Performance Hot Paths
As a user,
I want faster processing for long recordings and large history lists,
so that the app remains responsive over time.

### Acceptance Criteria
1. Audio IPC sends ArrayBuffer directly without Array-from JSON conversion.
2. SQLite indexes are added for history/notes/dictionary/styles sorting and purge queries.
3. Settings writes avoid bulk upserts when only one key changes.
4. Dictionary lookups are cached or optimized without altering results.

### Integration Verification
1. IV1: Dictation latency improves for longer recordings.
2. IV2: History and notes lists load quickly as data grows.
3. IV3: Settings behavior remains unchanged.

## Story 1.6 Reduce Maintenance Risk and Add Tests
As a developer,
I want the core logic modularized and covered by tests,
so that regressions are less likely and changes are safer.

### Acceptance Criteria
1. main.js responsibilities are split into focused modules without changing runtime behavior.
2. Shared utilities are de-duplicated (word count, subscription logic, retention logic).
3. A minimal unit-test suite exists for recording state transitions, quota logic, dictionary application, and sync cursor logic.
4. Preload IPC listeners provide cleanup mechanisms to avoid duplicate handlers.

### Integration Verification
1. IV1: All existing features work after refactor without behavior changes.
2. IV2: Tests run locally and pass consistently.
3. IV3: No new dependencies require runtime changes for end users.

