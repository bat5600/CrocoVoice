# Story 1.1 Robustifier le cycle d'enregistrement et les etats
As a user, I want the recording lifecycle to be consistent and resilient, so that I can start/stop dictation without glitches or duplicate triggers.

## Acceptance Criteria
1. 1: Les actions start/stop sont debounced et ne peuvent pas etre declenchees en double par raccourci + widget.
2. 2: Une source de verite unique gere l'etat global (ex: state machine cote main); le renderer ne fait que le refleter.
3. 3: En cas d'erreur d'enregistrement, l'app revient en etat stable et permet un nouvel essai.
4. 4: Les transitions d'etat sont notifiees via IPC (ex: status-change) sans changement de payload.

## Integration Verification
1. IV1: La dictee fonctionne via raccourci global sans double-enregistrement.
2. IV2: Le widget affiche un etat coherent pendant tout le cycle.
3. IV3: Aucun impact negatif sur latence ou CPU par rapport a l'existant.
4. IV4: Les canaux IPC existants (start/stop, status-change, audio-ready) restent compatibles.
