# Technical Constraints and Integration Requirements

## Existing Technology Stack
**Languages**: JavaScript (ES standard, CommonJS)
**Frameworks**: Electron ^35.7.5, Node.js 16+
**Database**: SQLite (local), Postgres via Supabase (remote)
**Infrastructure**: Supabase Edge Functions (Deno), Electron desktop app
**External Dependencies**: OpenAI (Whisper + Chat), Supabase JS, Stripe, @nut-tree-fork/nut-js, robotjs fallback

## Integration Approach
**Database Integration Strategy**: Add SQLite indexes with CREATE INDEX IF NOT EXISTS. Add Supabase migrations for missing tables and RLS policies; keep all schema changes additive.
**API Integration Strategy**: Centralize Edge Function auth verification in shared helper and update Stripe and quota functions to use it.
**Frontend Integration Strategy**: Replace innerHTML use with DOM construction and textContent; add navigation/window-open guards in main process.
**Testing Integration Strategy**: Add a lightweight unit-test harness (minimal new deps). Mock external APIs and keep tests focused on core logic modules.

## Code Organization and Standards
**File Structure Approach**: Keep root entry points (main.js, renderer.js, preload.js, sync.js, store.js) and introduce small root-level modules with clear prefixes (e.g., main-auth.js, main-recording.js, utils.js) to minimize churn.
**Naming Conventions**: camelCase, lower-case filenames.
**Coding Standards**: Follow existing code style, avoid large-format changes. CommonJS only.
**Documentation Standards**: Update README/PRD or relevant docs when behaviors change; keep comments minimal and focused.

## Deployment and Operations
**Build Process Integration**: No change to existing build pipeline; modifications should remain compatible with current Electron packaging.
**Deployment Strategy**: No behavioral flags required; release as normal app update.
**Monitoring and Logging**: Add minimal error reporting hook if feasible (or document as a follow-up).
**Configuration Management**: Use existing dotenv pattern; ensure no secrets logged.

## Risk Assessment and Mitigation
**Technical Risks**: Edge Function auth changes could break existing token flows; sync changes may reveal RLS or schema gaps.
**Integration Risks**: Refactoring main.js could introduce regressions if behavior changes.
**Deployment Risks**: Supabase schema updates might affect existing data if not additive or if RLS is misconfigured.
**Mitigation Strategies**: Add targeted tests, stage changes in small stories, use feature-flag-like rollout where possible, and keep schema changes additive with backfill scripts if needed.
