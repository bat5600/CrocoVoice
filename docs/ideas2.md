Product Requirements Document (PRD) - CrocoVoice "Mode Agentique" (MCP Architecture)

Version : 2.0 (Pivot MCP)

Statut : Draft

Cible : Q3 2026

Équipe : Product / Engineering / Design

1. Résumé Exécutif (Executive Summary)

Pivot Architectural : Au lieu de développer des intégrations point-à-point propriétaires, CrocoVoice devient un Client MCP (Model Context Protocol) universel optimisé pour la voix.

La Promesse : "Si ça a un serveur MCP, on peut lui parler."
L'utilisateur connecte CrocoVoice à des serveurs MCP (hébergés par nous ou par eux) pour Notion, GoHighLevel (GHL), Slack, etc. L'IA utilise les outils exposés par le protocole standardisé pour agir.

2. Scope MVP (Minimum Viable Product)

Pour la V1, nous fournissons un set de "Serveurs MCP Officiels" (Managed) et une option pour connecter des serveurs tiers.

2.1 Serveurs MCP "Managed" (Hébergés par CrocoVoice)

Nous hébergeons l'infrastructure MCP pour les outils les plus populaires. L'utilisateur n'a qu'à faire un OAuth.

GoHighLevel (GHL) - Priorité Agences :

Tools: create_contact, add_tag, trigger_automation, book_appointment.

Notion :

Tools: append_block, create_page, query_database.

Google Workspace (Mail/Calendar) :

Tools: send_email, create_event.

Filesystem (Local/Cloud) :

Tools: write_file, read_file (pour générer des rapports PDF/MD directement).

2.2 Fonctionnalité "Bring Your Own MCP" (Enterprise)

Permettre aux utilisateurs techniques d'ajouter l'URL de leur propre serveur MCP (ex: un serveur MCP connecté à leur base de données interne SQL ou leur ERP maison).

3. Parcours Utilisateur (User Stories)

Rôle

Story

MCP Server Sollicité

Critère de succès

Agency Owner

"Je sors d'un call, crée le contact 'Jean Dupont', ajoute le tag 'Lead Chaud' et mets-le dans le workflow de nurturing GHL."

GoHighLevel (GHL)

Contact créé dans GHL avec les bons tags et l'automation déclenchée.

Consultant

"Ajoute cette note de réunion dans ma database Notion 'Clients' et crée une tâche pour envoyer le devis demain."

Notion

Note ajoutée dans la bonne DB, propriétés (Date, Client) remplies via l'analyse du contexte.

Dev

"Connecte-toi à mon MCP server local et lance le script de déploiement sur la prod."

Custom (BYO-MCP)

CrocoVoice détecte l'outil deploy_prod exposé par le serveur local et l'exécute.

Sécurité

"Je veux voir quels outils (tools) sont exposés par le serveur MCP avant de les autoriser."

Core System

Liste des outils visibles dans les settings (ex: read_contacts autorisé, delete_contacts bloqué).

4. Spécifications Fonctionnelles (Adaptées MCP)

4.1 MCP Client Core (Le Cerveau)

L'application CrocoVoice agit comme l'hôte (Host).

Discovery : Au démarrage, CrocoVoice interroge les serveurs connectés (mcp.list_tools()) pour savoir de quoi ils sont capables.

Routing : Le LLM reçoit la liste des outils disponibles via le prompt système.

Execution : Quand le LLM décide d'appeler un outil (ex: ghl.create_contact), CrocoVoice transmet la requête JSON au serveur MCP GHL.

4.2 Module d'Intégration (The Registry)

Une interface unifiée pour gérer les connexions.

Managed : Boutons "Connect with Notion/GHL" (OAuth -> Provisionning d'une instance MCP dédiée).

Custom : Champ "Add MCP Server URL" + Token d'auth (SSE/WebSocket transport).

4.3 Interface de Validation (Human-in-the-loop)

Crucial pour éviter les appels d'outils destructifs.

Capture Vocale : "Supprime tous les contacts inactifs."

Tool Call Detection : L'IA propose d'appeler ghl.delete_contacts(filter="inactive").

MCP Preview UI : CrocoVoice interroge le serveur MCP pour une prévisualisation (si supporté) ou affiche le payload JSON brut de manière lisible.

Action : DELETE

Cible : GHL / Contacts

Filtre : "Inactive"

Confirmation : Slider "Confirmer l'exécution".

5. Architecture Technique

5.1 Stack Suggérée

LLM : Claude 3.5 Sonnet (Recommandé par Anthropic pour l'usage MCP et le function calling complexe) ou GPT-4o.

Protocole : Implémentation stricte de la spec MCP (Model Context Protocol) via SDK TypeScript/Python.

Transport :

Managed : Communication interne via queues (Redis/BullMQ) vers nos conteneurs MCP.

Custom : Server-Sent Events (SSE) pour le streaming des réponses.

5.2 Schema de Données (Action Log MCP)

{
  "trace_id": "trc_888",
  "user_id": "usr_999",
  "mcp_server": "ghl-connector-v1",
  "tool_name": "create_contact",
  "arguments": { 
    "first_name": "Jean",
    "email": "jean@example.com",
    "tags": ["lead_chaud"]
  },
  "mcp_response": { 
    "content": [{"type": "text", "text": "Contact id_555 created successfully"}] 
  },
  "latency_ms": 450
}


6. Risques et Mitigations (Spécifique MCP)

Risque

Impact

Mitigation

Latence MCP (Le serveur GHL est lent à répondre)

Moyen

Timeout strict sur les appels MCP + UI "Optimistic" qui dit "Action en cours..."

Contexte Trop Lourd (Trop d'outils exposés au LLM)

Élevé

Filtrage intelligent des outils. Ne charger dans le contexte du LLM que les outils pertinents selon la commande vocale initiale (RAG sur les définitions d'outils).

Erreur de Schéma (Le LLM hallucine un paramètre non supporté par l'outil MCP)

Moyen

Validation stricte via Pydantic/Zod avant d'envoyer la requête au serveur MCP. Retry automatique avec message d'erreur.

7. Critères de Lancement V2

[ ] Client MCP fonctionnel capable de list_tools et call_tool.

[ ] Serveur MCP GoHighLevel déployé et testé (Create Contact, Add Note).

[ ] Serveur MCP Notion déployé et testé (Append Block).

[ ] UI de "Permission Granting" (l'utilisateur accepte que CrocoVoice utilise l'outil X).

[ ] Fallback gracieux : Si le serveur MCP est hors ligne, l'IA doit dire "Je ne peux pas accéder à GHL pour le moment" et proposer de sauvegarder en note texte.