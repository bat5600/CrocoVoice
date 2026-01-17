# Story 1.5 Structurer le code pour maintenance et evolution
As a maintainer, I want clearer separation and documentation of core flows, so that future changes are safer and faster.

## Acceptance Criteria
1. 1: Les flux critiques (record/transcribe/post-process/type) sont isoles et documentes.
2. 2: Les points d'integration externes sont clairement delimites.
3. 3: La structure facilite l'ajout de tests ou checks manuels de non-regression.
4. 4: Les changements restent dans les fichiers existants (main.js, renderer.js, preload.js, store.js, sync.js) sans nouveaux dossiers.

## Integration Verification
1. IV1: Aucune regression fonctionnelle par rapport a l'existant.
2. IV2: Les changements n'introduisent pas de dependances externes non prevues.
3. IV3: Le comportement utilisateur reste inchangé.
4. IV4: Les canaux IPC et payloads existants restent inchanges.
