# Story 1.7 Saisie multiligne par collage invisible
As a user, I want multi-line transcription to be inserted correctly in target apps without accidental send, so that formatting is preserved.

## Acceptance Criteria
1. 1: Le texte dicte est conserve dans un buffer invisible pendant le processing.
2. 2: L'insertion dans la fenetre cible se fait via collage (Ctrl+V ou methode equivalente fiable), pas via saisie touche par touche des retours a la ligne.
3. 3: Les retours a la ligne sont preserves dans la destination (ex: VSCode, chats) sans ecraser les phrases precedentes.
4. 4: Aucun envoi automatique n'est declenche par les retours a la ligne (ex: ChatGPT).
5. 5: Le collage est orchestre par le main process dans le pipeline existant; le renderer ne tape pas directement.

## Integration Verification
1. IV1: Le collage preserve le format multi-ligne dans les cibles principales avec permissions adequates.
2. IV2: En cas d'echec de collage, l'utilisateur est notifie et aucune frappe Enter n'est envoyee.
3. IV3: Le workflow de dictee reste fluide (pas de blocage du widget ou du tray).
4. IV4: Les canaux IPC et payloads existants restent inchanges.
