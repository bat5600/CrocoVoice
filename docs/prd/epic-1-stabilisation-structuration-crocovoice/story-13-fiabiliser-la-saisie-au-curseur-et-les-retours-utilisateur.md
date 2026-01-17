# Story 1.3 Fiabiliser la saisie au curseur et les retours utilisateur
As a user, I want to trust that my transcription is typed at the right place, so that I don't lose or misplace text.

## Acceptance Criteria
1. 1: Si la saisie clavier echoue, l'utilisateur est informe explicitement.
2. 2: Des garde-fous evitent la saisie dans une fenetre cible inattendue pendant le processing.
3. 3: Le fallback robotjs reste supporte si nut-js est indisponible.
4. 4: En cas d'echec de saisie, l'etat revient a idle sans bloquer le pipeline.

## Integration Verification
1. IV1: La saisie fonctionne sur les plateformes principales avec permissions adequates.
2. IV2: Les erreurs de saisie ne bloquent pas le flux global.
3. IV3: Le widget et le tray restent reactifs.
4. IV4: Aucun changement des canaux IPC existants ni ajout de dependances.
