# Story 1.8 Supprimer le texte CrocoVoice au-dessus du widget
As a user, I want the widget overlay to render cleanly without stray labels, so that the UI looks intentional and stable.

## Acceptance Criteria
1. 1: Le texte "CrocoVoice" n'apparait jamais au-dessus du widget en fonctionnement normal.
2. 2: Le rendu initial du widget est propre sans necessiter de survol.
3. 3: Le survol ne masque pas d'artefacts UI inattendus.
4. 4: Aucun regression sur le comportement ou l'interactivite du widget.
5. 5: Aucune modification des canaux IPC ni du comportement global du cycle start/stop.

## Integration Verification
1. IV1: L'overlay ne montre aucun texte parasite au premier affichage.
2. IV2: Le comportement reste identique avant/apres survol sur les plateformes principales.
3. IV3: Les actions du widget (start/stop, hover) restent fonctionnelles.
4. IV4: Aucun impact sur l'orchestration main/renderer existante.
