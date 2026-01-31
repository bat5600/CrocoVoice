# Supabase schema snapshot

`schema.sql` is a CLI-generated snapshot of the live Supabase schema.
Do not edit it by hand; regenerate it after any Supabase-facing SQL change.

## Update the snapshot

1) Link the project:
   `npm run supabase:link`

2) Dump schema-only snapshot:
   `npm run supabase:schema`

Note: Supabase CLI v1+ does not support `--schema-only`; schema dump is the default.

## Traceability rule

Any change that touches Supabase (SQL migrations, RLS policies, functions, or schema changes)
must be followed by an updated `schema.sql` snapshot.
