# Requirements

These requirements are based on my understanding of your existing system. Please review carefully and confirm they align with your project's reality.

## Functional
1. FR1: L'app conserve le flux actuel MediaRecorder -> Whisper -> post-process -> saisie au curseur sans regression fonctionnelle.
2. FR2: L'app garantit un etat coherent "idle/recording/processing/error" entre main et renderer, meme en cas d'erreur d'enregistrement ou de transcription.
3. FR3: L'utilisateur peut demarrer/arretter l'enregistrement via raccourci global et via le widget, avec retour visuel fiable.
4. FR4: Les parametres utilisateur (langue, raccourci, micro, styles, dictionnaire) restent persistants et consultables via le dashboard.
5. FR5: L'historique de transcription reste accessible, exportable/pasteable, et purgable sans bloquer le flux principal.
6. FR6: La synchronisation Supabase, si activee, sync history/dict/styles/settings et n'affecte pas la dictiee en cas d'indisponibilite reseau.
7. FR7: L'app continue de fonctionner en mode local sans Supabase configure.
8. FR8: Les erreurs (permissions micro, API key, reseau) sont affichees de facon explicite et ramenees a un etat stable.

## Non Functional
1. NFR1: Aucune regression de performances: demarrage rapide, latence de transcription comparable a l'existant.
2. NFR2: Robustesse: pas de crash ni de fuite memoire lors de sessions longues.
3. NFR3: Mode degrade: en absence d'API OpenAI, l'app informe clairement l'utilisateur et reste stable.
4. NFR4: Ressources locales limites: l'historique et caches locaux sont limites dans le temps (ex: purge 14 jours) et n'accroissent pas l'usage disque indefiniment.
5. NFR5: Securite des secrets: les cles (OpenAI/Supabase) ne sont jamais logguees.
6. NFR6: Compatibilite multiplateforme Electron maintenue (Windows/macOS/Linux).

## Compatibility Requirements
1. CR1: Compatibility API/IPC - les canaux IPC existants (start/stop recording, settings, history, sync) restent compatibles.
2. CR2: Compatibility DB - le schema SQLite actuel (settings/history/styles/dictionary) reste lisible sans migration destructive.
3. CR3: Compatibility UI/UX - le widget minimaliste et le dashboard existants conservent leurs interactions et libelles principaux.
4. CR4: Integration - les integrations OpenAI Whisper, @nut-tree-fork/nut-js/robotjs et Supabase restent supportees sans changement de setup utilisateur.
