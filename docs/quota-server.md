# Quota server-side (hybride) – notes de mise en place

Objectif: rendre le quota **FREE** robuste (non bidouillable en local) en le stockant côté Supabase, tout en gardant un cache local pour l’UX.

## 1) Schéma DB (Supabase)

- Appliquer les migrations:
  - `supabase/migrations/20260119_000001_quota_weekly_usage.sql`
  - `supabase/migrations/20260120_000001_quota_weekly_usage_get_or_create.sql`
- Table créée: `public.quota_weekly_usage` (clé `(user_id, period_start)`).
- Helper RPC (service_role only): `public._quota_weekly_consume(...)` (atomique).
- Helper RPC (service_role only): `public._quota_weekly_get_or_create(...)` (lecture + init sans modifier `words_used`).

## 2) Edge Functions Supabase

Fonctions ajoutées:
- `supabase/functions/quota-snapshot`
- `supabase/functions/quota-consume`

Variables d’environnement côté Supabase Functions:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WEEKLY_QUOTA_WORDS` (ex: `2000`)

## 3) App Electron (modes quota)

Variables `.env` côté app:
- `CROCOVOICE_QUOTA_MODE`
  - `local`: quota local-only (dev)
  - `hybrid`: tente les Edge Functions, fallback local/cache si indispo
  - `server`: bloque la dictée FREE si le quota ne peut pas être vérifié côté serveur
- `CROCOVOICE_WEEKLY_QUOTA_WORDS` (dev local uniquement)
- `CROCOVOICE_QUOTA_CACHE_TTL_MS` (TTL du cache quota)

Notes:
- Le “paywall” est déclenché quand `remaining <= 0` avant démarrage d’une dictée.
- En mode `server`, une panne réseau affiche une erreur (“Impossible de vérifier le quota”) et bloque la dictée FREE.

## 4) Sync (historique / notes / dictionnaire)

- Les données (history/notes/dictionary/styles) restent **local-first** (SQLite) puis synchronisées via `sync.js`.
- Certains settings sensibles/éphémères ne sont plus synchronisés (`supabase_session`, `last_transcription`, `quota_weekly`, `quota_snapshot_cache`, `sync:*`).
- La rétention de l’historique peut être différente entre FREE/PRO (env `CROCOVOICE_HISTORY_RETENTION_DAYS_FREE` / `CROCOVOICE_HISTORY_RETENTION_DAYS_PRO`).

## 5) Test rapide

1. Déployer la migration + les 2 Edge Functions.
2. Mettre `WEEKLY_QUOTA_WORDS=100` (env Supabase Functions) pour un test rapide.
3. Côté app: `CROCOVOICE_QUOTA_MODE=server`.
4. Dicter jusqu’à atteindre 0 → vérifier blocage + paywall, puis redémarrer l’app → quota inchangé.
