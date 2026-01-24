# CrocoVoice Brainstorming Session Results

## Executive Summary

- Session topic: Structurer et planifier CrocoVoice (concurrent Wispr Flow) pour une equipe de dev
- Goal: Ideation focalisee pour cadrer V1, roadmap, architecture, monetiation, packaging, documentation
- Techniques used: Question Storming (warm-up), Mind Mapping cible
- Key themes: vitesse + qualite du texte, UX widget + raccourci, hygiene repo/archi, quotas simples, distribution publique

## Technique Sections

### Question Storming (Warm-up)

- Questions clefs reformulees:
  - Quelles fonctionnalites prioriser maintenant vs plus tard ?
  - Quelles briques sont deja faites (repo, Supabase, SQL, GitHub) ?
  - Qu'est-ce qui est stable vs experimental ?
  - Quelle architecture cible (front, back, sync, data, auth) ?
  - Comment structurer la monetisation (plans, quotas mots/sem) ?
  - Comment integrer la gestion d'utilisateurs et permissions ?
  - Comment packager l'app (desktop + web connecte) ?
  - Quels flux utilisateurs doivent etre beton en premier ?
  - Comment documenter l'existant et le futur ?
  - Quelles possibilites d'evolution / scalabilite ?

- Insights:
  - Besoin fort de cadrage et de documentation pour eviter la perte de contexte
  - L'existant fonctionne mais manque de clean-up et de structure

### Mind Mapping (Cible)

#### Vision / Users

- Cibles: entrepreneurs du web qui ecrivent beaucoup (emails, Slack, Notion, pages de vente, IA)
- Promesse: dicter vite + obtenir un texte final propre et pro (ponctuation, structure, sans hesitations)
- Effet "wow": widget toujours dispo + raccourci, transcription longue possible, resultat qualite premium

#### Features

- Must-have V1:
  - Raccourci global -> enregistre audio -> Whisper -> post-process prompt -> texte tape au curseur
  - Vitesse et fiabilite au coeur

- Nice-to-have V2+:
  - Selection micro + auto-detection
  - Historique recent (ex: 50 dernieres transcriptions)
  - Dictionnaire perso + proposition d'ajout quand l'utilisateur corrige un mot
  - Styles de reformatage (casual, formel)
  - Personnalisation raccourci
  - Statistiques (mots dictes)

#### Architecture / Tech (etat observe)

- Electron desktop (main/renderer/preload)
- MediaRecorder (webm/opus) -> OpenAI Whisper (whisper-1)
- Post-process via OpenAI chat (gpt-4o-mini)
- Auto-typing via @nut-tree-fork/nut-js (fallback robotjs)
- SQLite local (settings, history, dictionary, styles)
- Supabase sync + auth (history, dictionary, styles, user_settings)

- Priorite: clean-up / audit repo + clarification de l'architecture cible

#### Monetization

- Plans simples:
  - Free: limite mots par semaine (ex: 2000)
  - Pro: illimite
  - Trial: 7 jours pro

#### Packaging / Distribution

- Distribution publique via site de vente
- Souhait: auto-update ou notification + bouton "mettre a jour"

#### Documentation / Process

- Documenter tout, avec ordre de production:
  1) Architecture globale
  2) Infra/Supabase
  3) Setup dev
  4) Roadmap/backlog
  5) Etat du projet (stable vs experimental)
  6) Packaging/release checklist

## Idea Categorization

- Immediate Opportunities:
  - Definir perimetre V1 exact (must-have + qualite)
  - Audit/clean-up du repo et stabilisation
  - Documenter l'architecture et l'etat du projet

- Future Innovations:
  - Dictionnaire intelligent (auto-suggestion)
  - Styles de reformatage personnalises
  - Historique avance + recuperation

- Moonshots:
  - Modes contextuels par usage (email, Slack, IA) avec prompts specifiques

- Insights & Learnings:
  - La valeur percue vient de la qualite du texte final + UX rapide
  - La structure de projet est critique avant d'ouvrir a l'equipe

## Action Planning

Top 3 priorites (proposees):

1) Cadrer le perimetre V1
   - Define features V1 precise + criteres de qualite
   - Livrable: spec V1 + user flows

2) Audit/clean-up + architecture cible
   - Inventaire des composants existants
   - Stabiliser ce qui marche, isoler ce qui est experimental
   - Livrable: doc architecture + carte technique

3) Roadmap 3 phases
   - V1: core dictation fiable + UX minimale
   - V1.5: quality-of-life (historique, dictionnaire, style)
   - V2: evolutions, scaling, optimisations et nouveaux modes

## Reflection & Follow-up

- Ce qui a bien marche: focalisation sur la valeur coeur (dictation propre + UX)
- Zones a approfondir:
  - Packaging/auto-update (choix d'outil, flux de release)
  - Quotas et logique de limitation
  - Documentation technique pour l'equipe
- Questions ouvertes:
  - Quels criteres exacts pour dire qu'une feature est "stable" ?
  - Quel niveau de latence acceptable pour V1 ?
  - Quel canal de distribution pour les updates (auto-update vs manuel) ?

## Pour plus tard
- TODO: Ouvrir l'app via deep link depuis le login web (a faire apres packaging).

---

# Brainstorming Session Results - Paywall & Auth (2026-01-15)

## Executive Summary

- Session topic: Paywall + authentification (signup/login, reset password, FREE 2000 mots/sem, PRO illimite)
- Goal: Ideation focalisee sur le scope paywall/auth + experience utilisateur
- Techniques used: Question Storming (warm-up), Mind Mapping (cible)
- Key themes: quota hebdo, limites soft/hard, pricing, affichage quota, essais, plans additionnels

## Technique Sections

### Question Storming (Warm-up)

- Questions clefs formulees:
  - Comment on track la consommation par semaine ?
  - Comment on la limite concretement ?
  - Est-ce qu'on bloque tout ou bien une "soft limit" et une "hard limit" ?
  - Est-ce qu'on fait 3 forfaits plutot que 2 ?
  - Est-ce qu'on fait un essai gratuit du forfait illimite par defaut ?
  - Est-ce qu'il faut plus de features pour un forfait genre GPT Pro (features experimental) ?
  - Quel est le meilleur pricing ?
  - Comment on affiche le nombre de mots pour cette semaine dans l'UI ?

- Insights:
  - Besoin de clarifier la metrique "mots/semaine" et la methode de comptage
  - Le positionnement des plans influence la friction d'activation et le upsell

### Mind Mapping (Cible)

- Centre: Paywall + Auth (FREE 2000 mots/sem, PRO illimite, reset password)
  - Quota & limites:
    - Comptage sur les mots transcrits post-process (texte final), pas audio brut
    - Fenetre hebdo glissante (7 jours) vs reset fixe (lundi 00:00)
    - Soft limit: alerte + CTA upgrade, hard limit: blocage transcription
    - Depassement tolere avec "grace pack" (ex: +200 mots une fois/semaine)
    - Affichage clair: compteur restant + date/heure de reset
  - Plans & pricing:
    - 2 plans: FREE 2000 mots/sem + PRO illimite a 9.90 EUR/mois
    - Option trial PRO 7 jours lors du signup, puis downgrade auto vers FREE
    - Plan PRO+ (beta) avec features experimentales (styles, dictionnaire pro, priorite)
    - Pricing ancre (ex: 9.90 EUR/mois, annuel -20%)
  - UX paywall:
    - Paywall au moment du quota atteint (modal/blocker)
    - Upsell discret en amont: "Il vous reste 200 mots"
    - CTA in-app dans le dashboard + page pricing web
    - Etat degrade: lecture de l'historique OK, dictation bloquee
  - Auth flows:
    - Signup/login minimal (existant) + forgot password par email
    - Reset via lien (Supabase), retour automatique en mode login
    - Magic link optionnel pour fluidifier la connexion (a etudier)
  - Billing & acces:
    - Stripe Checkout pour l'achat PRO
    - Portail client Stripe pour gerer abo/factures
    - Badge plan actuel + lien "Gerer mon abonnement"
  - Messaging & trust:
    - Copie simple: "FREE 2000 mots/sem", "PRO illimite"
    - Garantie "Annulation en 1 clic"
    - Preuve sociale (nombre d'utilisateurs, avis)
  - Tracking & analytics:
    - Events: signup, upgrade, paywall_shown, quota_reached, reset_password
    - Suivi conversion FREE -> PRO
    - Alertes churn: retour en FREE, echec paiement

## Idea Categorization (Paywall & Auth)

- Immediate Opportunities:
  - Implementer flow forgot password dans signup.html (Supabase reset)
  - Ajouter compteur de mots restants dans l'UI
  - Definir quota hebdo + hard limit avec message clair

- Future Innovations:
  - Essai PRO automatique a l'inscription
  - Plan PRO+ avec features experimentales
  - Magic link pour login sans mot de passe

- Moonshots:
  - Quotas dynamiques selon usage/engagement
  - Offre "team" avec multi-utilisateurs

- Insights & Learnings:
  - La perception de valeur depend de la lisibilite du quota et du moment du blocage
  - La gestion d'abonnement doit etre simple (Stripe Checkout + portail)

## Action Planning (Paywall & Auth)

Top 3 priorites (proposees):

1) Flow forgot password + UX paywall baseline
   - Implementation reset password via Supabase
   - Messages clairs et retour en mode login

2) Quota hebdo + affichage
   - Choisir methode de comptage (texte final)
   - Afficher compteur + date de reset

3) Upgrade PRO
   - Stripe Checkout + plan PRO a 9.90 EUR/mois
   - Lien "Gerer mon abonnement" vers portail client

## Reflection & Follow-up (Paywall & Auth)

- Ce qui reste a trancher:
  - Soft vs hard limit (ou hybride)
  - Trial PRO par defaut ou opt-in
  - 2 plans vs 3 plans
- Questions ouvertes:
  - Quelle metrique exacte de "mots" pour la facturation ?
  - Quelle experience au depassement (blocage ou fallback) ?
