# CrocoVoice

CrocoVoice is an Electron desktop app for **hotkey-first voice dictation**:
record → transcribe (Whisper) → optional AI cleanup → deliver (type/paste/clipboard), with a premium dashboard UI.

## Quick start

1) Install dependencies:
`npm install`

2) Run the app:
`npm run dev`

## Configuration (env vars)

Create a `.env` file in the repo root (or set env vars another way):

- `OPENAI_API_KEY` (required for transcription / post-processing)
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` (optional, for auth/sync)
- `STRIPE_CHECKOUT_URL` + `STRIPE_PORTAL_URL` (+ optional `STRIPE_RETURN_URL`) (optional, for billing links)

See `docs/configuration.md` for the full list and defaults.

## Supabase schema snapshot

`schema.sql` is a CLI-generated snapshot of the live Supabase schema.
Do not edit it by hand; regenerate it after any Supabase-facing change:

- `npm run supabase:link`
- `npm run supabase:schema`

More details in `docs/supabase.md`.

## Documentation

- Global PRD: `docs/prd.md`
- Architecture (current/brownfield): `docs/architecture.md`
- Architecture (vNext/M1+): `docs/architecture-vnext.md`
- Front-end spec: `docs/front-end-spec.md`
- MVP review: `docs/mvp-review-20260120.md`
- PO validation: `docs/po-validation-20260120.md`

## Note

The previous root README content (Supabase CLI) was archived to `docs/README-supabase-cli.md`.
