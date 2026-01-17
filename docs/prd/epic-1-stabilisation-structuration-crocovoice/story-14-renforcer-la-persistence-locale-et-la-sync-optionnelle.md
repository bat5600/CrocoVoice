# Story 1.4 Renforcer la persistence locale et la sync optionnelle
As a user, I want my history and settings to be reliable locally, so that the app remains usable offline without corruption.

## Acceptance Criteria
1. 1: Les acces SQLite sont serialises pour eviter les locks/corruptions.
2. 2: La politique de purge est explicite et documentee (seuil en jours ou volumetrie) avant application.
3. 3: La sync Supabase, si activee, ne bloque jamais le flux de dictee.
4. 4: Aucun changement de schema SQLite ni ajout de tables/index.

## Integration Verification
1. IV1: Les operations CRUD (history/dict/styles/settings) restent stables en local.
2. IV2: La sync ne degrade pas les performances en usage normal.
3. IV3: Le mode local fonctionne sans Supabase configuree.
4. IV4: La sync reste optionnelle et ne bloque pas le demarrage de l'app.
