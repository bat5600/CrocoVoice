# Story 2.4: Authentification Supabase et paywall

## Status
Done

## Story
**As a** CrocoVoice user,
**I want** to be obligé·e de me connecter à mon compte avant d’accéder à l’app,
**so that** on puisse verrouiller les fonctions premium (paywall) et synchroniser mes historiques/dictionnaires personnels.

## Acceptance Criteria
1. Au lancement, l’app affiche une page de login (email + mot de passe), bloque l’accès au reste de l’UI, et reste suspendue tant que la réhydratation de `supabase.auth.getSession()`/`auth.onAuthStateChange()` n’a pas confirmé une session valide.
2. Le login récupère une session, affiche les erreurs contextualisées, et le lien « Créer un compte » ouvre la landing interne (story 2.5) puis redirige vers l’URL Supabase/marketing définie via la configuration partagée.
3. Les flux de sync (history, dictionary, options) utilisent systématiquement l’utilisateur courant ; les actions bloquées indiquent qu’une authentification est requise et renvoient à la page de login si la session expire.
4. Une action de déconnexion détruit la session locale, annule les sync en cours, vide les stores sensibles, et renvoie sur la page de login.
5. En cas de réseau indisponible ou d’erreurs Supabase répétées la solution propose un message de retry/lecture seule, et l’UI premium reste verrouillée tant qu’une session active n’est pas confirmée.

## Tasks / Subtasks
- [x] Concevoir la page de login et le gating initial (AC: 1,2)
  - [x] Préparer les éléments UI (formulaires/états) dans `renderer.js`/`index.html` ou une page dédiée.
- [x] Initialiser Supabase dans `main.js`/`preload.js`/`renderer.js` pour exposer login/logout, écouter `auth.onAuthStateChange`, et bloquer l’UI dès qu’une session devient invalide (AC: 1,2,4).
- [x] Documenter le comportement réseau/offline (retry/backoff, mode lecture seule, messages explicites) et la manière de garder les composants premium verrouillés tant que la session n’a pas confirmé sa validité (AC: 5).
- [x] Réorienter les flux sync/history/dictionary pour dépendre de la session Supabase, annuler les requêtes quand la session change, et exposer des alertes utilisateur lorsque l’auth échoue (AC: 3).
- [x] Gérer la déconnexion propre (réinitialiser store + retour à login) et s’assurer que toute donnée sensible est invalidée (AC: 4).
- [x] Tests manuels : login réussi/échec, message d’erreur réseau, mode lecture seule, logout, data sync après login.
- [x] Documenter et utiliser `auth.signupUrl` via `window.electronAPI.getSignupUrl()`/`openSignupUrl()` pour que le CTA “Créer un compte” dans la page de login et la landing pointe toujours vers la même configuration.

## Dev Notes
- Source d’architecture : `docs/architecture.md`
- Rappels :
  - `supabase/` contient le schéma DB utilisé pour sync.
  - `store.js`, `sync.js` et `main.js` orchestrent les événements applicatifs clés.
  - L’app reste dans la racine ; éviter de créer de nouveaux dossiers ou dépendances.
- Fichiers cibles probables : `index.html` (nouvelle vue), `renderer.js`, `main.js`, `preload.js`, `store.js`, `sync.js`.
- Communiquer que le login renvoie vers la landing interne (`docs/signup.html`) pour l’instant, et que `auth.signupUrl` est défini dans `config/auth.json` (modifiable via `AUTH_SIGNUP_URL`) afin de piloter la redirection vers l’URL Supabase/marketing finale ; ouvrir ce lien via `shell.openExternal`.

### Testing
- Tests manuels uniquement.
- Scénarios :
 1. Lancement sans session → login page visible, login acceptant email+password.
 2. Login échoue (mauvais mot de passe/erreur réseau) → message compréhensible.
 3. Login réussi → accès à l’UI principale, données historiques sauvegardées, sync peut s’exécuter.
 4. Déconnexion → retour à la page de login et suppression de la session.

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-02-XX | v0.1 | Crée la story d’auth Supabase et paywall | PM |
| 2026-02-XX | v0.2 | Implémentation auth + paywall et tests manuels | dev |
| 2026-02-XX | v0.3 | Ajout du formulaire de login in-app | dev |

## Dev Agent Record
### Agent Model Used
GPT-5

### Debug Log References
N/A

### Completion Notes List
- Login gating affiche l'ecran de connexion tant qu'aucune session valide n'est confirme.
- Les erreurs reseau affichent un mode lecture seule et un bouton de retry.
- La deconnexion purge les donnees sensibles locales avant retour au login.
- Le bouton "Creer un compte" ouvre directement l'URL Supabase configuree.
- La page `docs/signup.html` est une landing web autonome a publier.
- Ajout d'un formulaire de login in-app (widget + dashboard) pour authentifier via `auth:sign-in`.
- Tests manuels realises (login/signup/logout/sync).

### File List
- main.js
- preload.js
- renderer.js
- index.html
- dashboard.js
- dashboard.html
- sync.js
- store.js
- README.md
- docs/signup.html

## QA Results
