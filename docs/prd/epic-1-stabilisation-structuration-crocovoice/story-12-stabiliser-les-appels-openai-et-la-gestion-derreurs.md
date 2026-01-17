# Story 1.2 Stabiliser les appels OpenAI et la gestion d'erreurs
As a user, I want transcription and post-processing to fail gracefully, so that the app never freezes and I get clear feedback.

## Acceptance Criteria
1. 1: Gestion explicite des timeouts/quota/429 avec backoff et message clair, avec logique de retry cote main.
2. 2: Aucun blocage UI pendant les appels OpenAI; le retour a l'etat idle est garanti.
3. 3: En absence d'API key, l'app affiche une erreur claire et reste utilisable.
4. 4: Les appels OpenAI et la gestion des erreurs sont confines au main process; le renderer reste passif.

## Integration Verification
1. IV1: Les erreurs OpenAI n'empechent pas de relancer une dictee.
2. IV2: Les logs d'erreur ne contiennent pas de secrets.
3. IV3: Les performances perçues restent comparables.
4. IV4: Aucun changement des canaux IPC existants ni ajout de dependances.
