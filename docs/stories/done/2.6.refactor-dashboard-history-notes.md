# Story 2.6: Refactoriser l'historique et les notes du dashboard

## Status
Done

## Story
**As a** speech-to-text user,  
**I want** the dashboard to distinguish between a dedicated “Notes” tab for new voice captures and a “History” tab for previously created sessions,  
**so that** I can find, reuse and manage my captures more easily while still having fast actions (copy/delete), reliable search, and readable visual feedback.

## Acceptance Criteria
1. Le dashboard affiche deux onglets (“Notes” et “History”) ; “Notes” permet d’enregistrer une nouvelle capture vocale et de la sauvegarder, “History” liste les sessions passées.  
2. Les entrées d’historique affichent un titre IA (généré côté serveur), la date/heure en petit au-dessus et le texte transcrit en corps multi-lignes (retour à la ligne automatique).  
3. Chaque entrée “Notes” et “History” propose uniquement deux actions : “Copy” (copie dans le presse-papier) et “Delete” (supprime l’entrée de la base).  
4. “Search Across Your Notes” interroge simultanément les notes et l’historique stockés et met à jour la liste en temps réel.  
5. Le stockage supporte une nouvelle table/colonne `notes` par utilisateur pour les encodages vocaux persistants et conserve aussi l’historique nécessaire au tab “History”.  
6. L’affichage du dictionnaire espace les termes entre eux et respecte les marges avec les blocs adjacents.  
7. Les mots corrigés n’affichent que la forme finale (pas de répétition “mot -> mot corrigé” quand aucune correction n’a été appliquée).

## Tasks / Subtasks
- [x] Documenter et appliquer la nouvelle structure de données (table `notes` ou colonne par user + métadonnées d’historique) dans Supabase/local store (AC: 1,5).  
- [x] Adapter le backend pour sauvegarder les notes, restituer l’historique, supporter la recherche globale et déclencher la génération de titres IA côté serveur (AC: 2,3,4,5).  
- [x] Moderniser `dashboard.html`/JS pour afficher les deux onglets, positionner la date au-dessus du titre, forcer le wrapping et n’exposer que les boutons Copy/Delete (AC: 1,2,3).  
- [x] Implémenter les actions Copy/ Delete (presse-papier, confirmation suppression) pour les deux onglets et alimenter le champ search des résultats combinés (AC: 3,4).  
- [x] Corriger l’affichage du dictionnaire : espacer les termes et supprimer les répétitions inutiles sur les misspellings (AC: 6,7).  
- [x] Ajouter ou mettre à jour les spécifications front/back (docs/front-end-spec.md, architecture) pour refléter la nouvelle navigation notes/history et les comportements d’IA/Storage (AC: 1-7).  
- [x] Tester manuellement la navigation tab, la recherche, le copy/delete, les titres IA, et la section dictionnaire (AC: 1-7).

## Dev Notes
- Source d’architecture : `docs/architecture.md`
- Spécifications front-end pertinentes : `docs/front-end-spec.md`
- UX story de navigation actuelle : `docs/stories/2.1.moderniser-shell-dashboard-navigation.md`
- Fichiers cibles probables : `dashboard.html`, `dashboard.js`, `renderer.js`, `store.js`, `supabase/*`, `docs/front-end-spec.md`, `config/*`

### Testing
- Tests manuels uniquement (tabs Notes/History, IA title, copy/delete actions, search, dictionnaire).  
- Scénarios : création d’une note vocale, génération du titre IA, copy dans le presse-papier, suppression, recherche multi-onglets, vérification du dictionnaire pour les espaces et misspellings.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-16 | v0.1 | Création de la story pour refactoriser les notes/historique, actions copy/delete et recherche | PM |
| 2026-01-17 | v0.2 | Implémentation backend + UI pour onglets Notes/History, recherche globale, actions Copy/Delete, dictionnaire et titres IA | James |

## Dev Agent Record
### Agent Model Used
- Codex CLI (GPT-4.1)

### Debug Log References
- None (manual changes only, no automated logs collected)

### Completion Notes List
- Liste historisée et notes séparées avec onglets, search multi-dataset, dates/IA titles en haut et textes multi-lignes dans `dashboard.html`/`dashboard.js`.
- Backend élargi : nouvelle table `notes`, colonnes `title`, APIs `getDashboardData`, suppression `history/notes`, génération de titres IA côté serveur et synchronisation Supabase mise à jour.
- Dictionnaire reformatté (espacement, suppression de la flèche “->” quand aucun remplacement) et spec frontale actualisée pour documenter le nouveau flux Notes/History.

### File List
- docs/stories/2.6.refactor-dashboard-history-notes.md
- dashboard.html
- dashboard.js
- main.js
- store.js
- sync.js
- preload.js
- supabase/schema.sql
- docs/front-end-spec.md

## QA Results
- Aucune revue QA pour l’instant.
