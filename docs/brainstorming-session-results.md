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
