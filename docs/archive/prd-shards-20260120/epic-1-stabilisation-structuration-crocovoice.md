# Epic 1: Stabilisation & Structuration CrocoVoice

**Epic Goal**: Stabiliser le flux de dictee end-to-end, reduire les erreurs runtime, et structurer le code pour evolutions futures sans regression.

**Integration Requirements**: Maintenir compatibilite IPC/UI/DB, supporter mode offline sans Supabase, et conserver le comportement utilisateur actuel.

## Story 1.1 Robustifier le cycle d'enregistrement et les etats
As a user, I want the recording lifecycle to be consistent and resilient, so that I can start/stop dictation without glitches or duplicate triggers.

### Acceptance Criteria
1. 1: Les actions start/stop sont debounced et ne peuvent pas etre declenchees en double par raccourci + widget.
2. 2: Une source de verite unique gere l'etat global (ex: state machine cote main); le renderer ne fait que le refleter.
3. 3: En cas d'erreur d'enregistrement, l'app revient en etat stable et permet un nouvel essai.

### Integration Verification
1. IV1: La dictee fonctionne via raccourci global sans double-enregistrement.
2. IV2: Le widget affiche un etat coherent pendant tout le cycle.
3. IV3: Aucun impact negatif sur latence ou CPU par rapport a l'existant.

## Story 1.2 Stabiliser les appels OpenAI et la gestion d'erreurs
As a user, I want transcription and post-processing to fail gracefully, so that the app never freezes and I get clear feedback.

### Acceptance Criteria
1. 1: Gestion explicite des timeouts/quota/429 avec backoff et message clair, avec logique de retry cote main.
2. 2: Aucun blocage UI pendant les appels OpenAI; le retour a l'etat idle est garanti.
3. 3: En absence d'API key, l'app affiche une erreur claire et reste utilisable.

### Integration Verification
1. IV1: Les erreurs OpenAI n'empechent pas de relancer une dictee.
2. IV2: Les logs d'erreur ne contiennent pas de secrets.
3. IV3: Les performances perçues restent comparables.

## Story 1.3 Fiabiliser la saisie au curseur et les retours utilisateur
As a user, I want to trust that my transcription is typed at the right place, so that I don't lose or misplace text.

### Acceptance Criteria
1. 1: Si la saisie clavier echoue, l'utilisateur est informe explicitement.
2. 2: Des garde-fous evitent la saisie dans une fenetre cible inattendue pendant le processing.
3. 3: Le fallback robotjs reste supporte si nut-js est indisponible.

### Integration Verification
1. IV1: La saisie fonctionne sur les plateformes principales avec permissions adequates.
2. IV2: Les erreurs de saisie ne bloquent pas le flux global.
3. IV3: Le widget et le tray restent reactifs.

## Story 1.4 Renforcer la persistence locale et la sync optionnelle
As a user, I want my history and settings to be reliable locally, so that the app remains usable offline without corruption.

### Acceptance Criteria
1. 1: Les acces SQLite sont serialises pour eviter les locks/corruptions.
2. 2: La politique de purge est explicite et documentee (seuil en jours ou volumetrie) avant application.
3. 3: La sync Supabase, si activee, ne bloque jamais le flux de dictee.

### Integration Verification
1. IV1: Les operations CRUD (history/dict/styles/settings) restent stables en local.
2. IV2: La sync ne degrade pas les performances en usage normal.
3. IV3: Le mode local fonctionne sans Supabase configuree.

## Story 1.5 Structurer le code pour maintenance et evolution
As a maintainer, I want clearer separation and documentation of core flows, so that future changes are safer and faster.

### Acceptance Criteria
1. 1: Les flux critiques (record/transcribe/post-process/type) sont isoles et documentes.
2. 2: Les points d'integration externes sont clairement delimites.
3. 3: La structure facilite l'ajout de tests ou checks manuels de non-regression.

### Integration Verification
1. IV1: Aucune regression fonctionnelle par rapport a l'existant.
2. IV2: Les changements n'introduisent pas de dependances externes non prevues.
3. IV3: Le comportement utilisateur reste inchangé.

This story sequence is designed to minimize risk to your existing system. Does this order make sense given your project's architecture and constraints?
