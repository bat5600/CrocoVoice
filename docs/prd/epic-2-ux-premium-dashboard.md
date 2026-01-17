# Epic 2: UX Premium du Dashboard

**Epic Goal**: Moderniser l'interface du dashboard (settings/history/dictionary/sync) pour un look SaaS premium, sans modifier les fonctionnalites ni les flux existants.

**Integration Requirements**: Conserver les canaux IPC et la separation main/renderer, ne pas changer le schema SQLite, pas de nouvelles dependances runtime, compatibilite Windows/Mac.

## Story 2.1 Moderniser le shell du dashboard et la navigation
As a user, I want a premium dashboard shell with clearer hierarchy and navigation, so that the app feels modern and easier to use.

### Acceptance Criteria
1. 1: Le header et la navigation du dashboard sont modernises (typo, spacing, contrast) sans changer les routes ou labels.
2. 2: Les controles de fenetre (fermer/reduire/agrandir) sont visibles et suivent les conventions OS.
3. 3: Le layout se redimensionne sans clipping ni overlap.
4. 4: La navigation vers settings/history/dictionary/sync reste fonctionnelle.

### Integration Verification
1. IV1: Les vues existantes s'affichent sans erreur apres refonte du shell.
2. IV2: Aucun changement des canaux IPC utilises par le dashboard.
3. IV3: Aucun impact sur le widget et le tray.

## Story 2.2 Moderniser settings et history
As a user, I want settings and history views to look polished and consistent, so that the app feels high quality and professional.

### Acceptance Criteria
1. 1: Les champs, labels et boutons des settings adoptent le nouveau style premium.
2. 2: Les items d'historique ont une meilleure hierarchie visuelle (spacing, typo, etats).
3. 3: Les etats empty/loading/error sont redesignes de maniere claire et premium.
4. 4: Les actions settings et history existantes se comportent comme avant.

### Integration Verification
1. IV1: Les actions save settings et list history restent fonctionnelles.
2. IV2: Aucune regression sur navigation clavier et focus.
3. IV3: Performance comparable au dashboard actuel.

## Story 2.3 Moderniser dictionary et sync/auth
As a user, I want dictionary and sync/auth views to feel premium and cohesive, so that the entire dashboard experience is consistent.

### Acceptance Criteria
1. 1: Les listes et actions dictionary (ajout/edition/suppression) suivent le nouveau style.
2. 2: Les etats sync/auth (login, syncing, error) sont clairs et coherents.
3. 3: Les messages d'erreur restent actionnables et non bloquants.
4. 4: Les flux dictionary et sync/auth existants fonctionnent sans changement.

### Integration Verification
1. IV1: Les flows CRUD dictionary et auth/sync restent intacts.
2. IV2: Aucun impact sur rendu des listes ou performances.
3. IV3: Les etats visuels respectent accessibilite (contraste, focus).

This story sequence is designed to minimize risk to your existing system. Does this order make sense given your project's architecture and constraints?
