# Story 1.6 Annuler l'enregistrement et formater l'historique recent
As a user, I want to cancel a recording without sending audio and see readable history, so that I can discard mistakes and read past entries.

## Acceptance Criteria
1. 1: Le bouton croix annule l'enregistrement en cours sans envoyer d'audio ni declencher de transcription.
2. 2: Une barre de "chargement" apparait pendant 5 secondes avec un bouton "undo" pour finalement envoyer l'audio et proceder normalement (comme un arret classique de dictee).
3. 3: Apres annulation, l'etat repasse a idle sans creer d'entree dans l'historique.
4. 4: L'historique recent affiche les sauts de ligne et un formatage lisible (retours preserves).
5. 5: Aucune emission d'audio-ready ni d'appel OpenAI n'est declenchee lors d'une annulation.
6. 6: Si l'utilisateur clique sur "undo" avant la fin des 5 secondes, l'audio est traite normalement.

## Integration Verification
1. IV1: L'annulation ne declenche aucun appel reseau de transcription ou d'upload audio.
2. IV2: Les retours a la ligne sont preserves dans l'historique sur les plateformes principales.
3. IV3: Un nouvel enregistrement fonctionne normalement apres une annulation.
4. IV4: Le status-change indique un retour a idle apres annulation.
