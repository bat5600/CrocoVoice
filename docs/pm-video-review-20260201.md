# CrocoVoice — PM Handoff: Video Review Findings & Required Fixes

Date: 2026-02-01  
Source: Internal video review transcript (Appendix A, verbatim)  
Audience: Architect → Dev

## Executive Summary

This review surfaces multiple **P0 blockers** (uploaded audio stuck “queued”, cancel not working, onboarding mic selection broken) plus a set of UX inconsistencies and product gaps (dashboard metrics meaning, editor shortcuts, mixed FR/EN, CrocOmni chat UX, context capture not working, diagnostics overflow).

Goal for architect/dev: **turn this transcript into an actionable, prioritized implementation plan** (bugfixes + UX polish + a few product decisions) without losing user intent.

## What “done” looks like (overall)

1. Core flows are reliable end-to-end:
   - Upload audio → transcribe → progress updates → complete/fail states → cancellation works.
   - Onboarding mic step is unblocked (device list + detection messaging consistent).
2. Hub/dashboard feels coherent:
   - Metrics are correctly defined and consistent; navigation is predictable (clicking totals opens the right tab).
3. Editing and UI polish meet “daily driver” expectations:
   - No flashing UI artifacts, no jumpy hover sizing, common editor shortcuts behave as expected.
4. Language experience is intentional:
   - App is English-first; optional French toggle exists and is consistent everywhere.
5. “Context” and “Profiles” are understandable and functional:
   - Context capture shows correct app/URL/screenshots where applicable; profiles UX is self-explanatory.

## Clarifications (PM follow-up answers)

1. Dashboard:
   - Streak = consecutive days.
   - Active days = distinct days with ≥1 dictation (but low-value; prefer showing streaks everywhere).
2. Upload import:
   - “Import an audio” refers to **Epic 6**.
   - Importing an audio should create a **Note** with the transcript **formatted**.
3. Cancel:
   - Cancel should always be allowed.
   - No history entry should be created for canceled uploads/transcriptions.
   - If importing creates a transient Note, cancel deletes that transient Note (no transcript left behind).
4. Notes editor:
   - Keep a rich-text editor.
   - Add markdown-like input shortcuts (e.g., typing “- ” creates bullets).
5. Language:
   - App UI language is **per-device**.
   - Changing language should **not require restart**.
6. CrocOmni:
   - Show **redacted excerpts** (no unredacted excerpts by default).
   - Support streaming tokens + persistence in chat, with a **Clear** button.
   - Enforce a **max-token cap** on persisted chat context (drop oldest messages when over the cap) to control cost.
7. Context screenshots:
   - Recommendation: keep **Context master switch OFF by default**, then when user enables Context:
     - request explicit consent for screenshots and show them as **recommended ON**,
     - capture/store screenshots locally only (never synced), with ephemeral retention (no long-term storage).
8. App profiles / “test rapide”:
   - Currently unclear and may not be useful; OK to defer/hide until clarified.

## Priority Backlog (from the transcript)

Legend:
- **P0** = blocks core usage / prevents progress
- **P1** = major UX issue / high annoyance / reduces trust
- **P2** = polish / restructuring / nice-to-have for now

### P0 — Blockers

#### P0.1 — Uploaded audio never processes (stuck “queued”) + Cancel doesn’t work
- Evidence: 1:26–1:40
- Area: Notes → imported audio (Epic 6) / local file transcription
- Current behavior:
  - After importing an audio file, the item stays in **queued** and “never processes”.
  - Clicking **Cancel** for the upload does nothing (UI unresponsive).
- Desired behavior:
  - Queue progresses through stages (queued → processing → completed/failed).
  - Import creates a Note with a formatted transcript when complete.
  - Cancel reliably cancels upload/transcription and updates UI immediately, with no history entry left behind.
- Acceptance Criteria:
  1. Importing a supported file creates a Note and triggers processing with status transitions visible in the UI.
  2. On completion, the Note contains the transcript in the expected formatted form.
  3. Cancel works at any stage (queued/processing), does not freeze/crash, deletes the transient Note (no transcript), and leaves no history entry.
  4. UI remains responsive throughout; no “dead buttons”.
- Related docs:
  - `docs/stories/6.1-upload-flow-and-status.md`
  - `docs/qa/gates/6.1-upload-flow-and-status-local-file-transcription.yml`

#### P0.2 — Onboarding mic selection is broken; user cannot continue
- Evidence: 7:46–8:07
- Area: Onboarding
- Current behavior:
  - Microphone dropdown/menu is empty or cannot change.
  - UI shows “audio detected / signal audio détecté” but also “no microphone detected, check hardware”.
  - User is blocked from continuing onboarding.
- Desired behavior:
  - Device list shows actual available microphones (or clear “none detected” state).
  - “Audio detected” and “no microphone detected” cannot contradict; copy reflects reality.
  - User can proceed once a valid device is selected and audio is detected (or provide skip/troubleshooting).
- Acceptance Criteria:
  1. On a machine with a working mic, onboarding lists devices and allows selection.
  2. The detection status and the selected device status are consistent.
  3. The “Continue” button is enabled when requirements are met (and disabled with clear guidance otherwise).
- Related docs:
  - `docs/stories/11.1-onboarding-flow.md`
  - `docs/stories/7.2-permissions-and-diagnostics.md` (if permissions gating is involved)

#### P0.3 — Settings mic selection menu does not appear / is empty
- Evidence: 7:30–7:46
- Area: Settings (“réglages”)
- Current behavior:
  - In the status bubble/menu, mic selection works.
  - In settings, mic dropdown/menu does not appear.
- Desired behavior:
  - Same device list behavior across the status bubble and settings.
- Acceptance Criteria:
  1. Settings shows a functional microphone selector with populated devices.
  2. Changing it affects the same underlying selection as the status bubble (single source of truth).
- Related docs:
  - `docs/stories/9.1-status-bubble-and-context-menu.md`
  - `docs/stories/11.1-onboarding-flow.md`

### P1 — Major UX / trust issues

#### P1.1 — Dashboard metrics inconsistency: “1-day streak” vs “8 active days”
- Evidence: 0:11–0:33
- Area: Dashboard
- Current behavior:
  - “Vous êtes sur une série de 1 jour” shown above a bento box with “8 jours actifs”.
  - Reviewer expects this to be inconsistent (if 8 active days exist, streak shouldn’t be 1).
- Desired behavior:
  - Prefer showing **streaks** as the primary metric.
  - If “active days” remains anywhere, it must be explicitly defined as: distinct days with ≥1 dictation.
- Acceptance Criteria:
  1. Dashboard shows streak clearly (and does not surface “active days” by default unless there is a strong reason).
  2. If “active days” is shown, definitions are explicit (tooltip/help text or label) and cannot appear contradictory.
- Related docs:
  - `docs/stories/11.2-insights-and-wrapped.md` (streaks/insights)

#### P1.2 — Clicking “total notes” should open the Notes tab
- Evidence: 0:33–0:40
- Area: Dashboard navigation
- Current behavior:
  - “nombre de notes totale” is not a navigation entry point.
- Desired behavior:
  - Clicking the total notes metric opens the Notes tab.
- Acceptance Criteria:
  1. Click on total notes navigates to Notes view (with no noticeable lag).
  2. Keyboard accessibility: reachable and activatable.

#### P1.3 — History row actions: remove “Export” icon/button
- Evidence: 0:40–0:52
- Area: History list actions (hover buttons)
- Current behavior:
  - Hover shows: copy, export, delete.
  - Export “doesn’t serve much purpose” in history.
- Desired behavior:
  - Remove export from row-level actions (keep copy + delete; export available elsewhere if needed).
- Acceptance Criteria:
  1. No export action on history rows.
  2. Copy and delete remain and still work.
- Related docs:
  - `docs/stories/4.2-history-search-and-actions.md`
  - `docs/stories/6.2-exports-v1.md` (exports still exist; decide where)

#### P1.4 — Visual flash when deleting a note
- Evidence: 1:13–1:26
- Area: Notes/History UI
- Current behavior:
  - Deleting a note causes a noticeable “flash” in the UI.
  - Delete itself works and supports undo via notification.
- Desired behavior:
  - No visual flash; removal animation and reflow feel smooth.
- Acceptance Criteria:
  1. Deleting an item does not flash the interface.
  2. Undo remains available and stable.

#### P1.5 — Notes editor toolbar hover causes icons to grow (no size shift desired)
- Evidence: 1:40–2:00
- Area: Note editor toolbar
- Current behavior:
  - Toolbar items change size on hover (grow).
- Desired behavior:
  - Hover states do not change layout (no icon growth causing jitter).
- Acceptance Criteria:
  1. Hover styles never change element dimensions (no layout shift).

#### P1.6 — “Code” formatting toggle doesn’t toggle off
- Evidence: 1:57–2:23
- Area: Note editor
- Current behavior:
  - Applying code formatting works, but clicking “code” again does not remove it.
- Desired behavior:
  - Code formatting is a proper toggle (on/off) for the current selection.
- Acceptance Criteria:
  1. Code formatting behaves like a standard editor toggle and can be removed by re-clicking.
  2. Works predictably for both collapsed cursor and selection (choose best standard behavior).

#### P1.7 — Markdown-like list shortcut “- space” doesn’t create a bullet list
- Evidence: 2:23–3:04
- Area: Note editor input rules
- Current behavior:
  - Typing “- ” does not auto-create a formatted bulleted list.
  - Ctrl+B / Ctrl+I / Ctrl+U work.
- Desired behavior:
  - Common markdown shortcuts work (at least basic bullets).
- Acceptance Criteria:
  1. At the start of a line, typing “- ” creates a bullet list item.
  2. Same for “* ” (optional) and “1. ” (optional—confirm).
- Related docs:
  - `docs/stories/5.1-adaptive-transcript-formatting-v1.md` (adjacent concept; confirm scope)

#### P1.8 — Snippets: confusing “content” placeholder rendering (brackets / drawings)
- Evidence: 3:15–3:26
- Area: Snippets UI
- Current behavior:
  - UI shows “content” between brackets and “dessins” (unclear placeholder UI).
  - Tip says: “Astuce, utilisez Content.”
- Desired behavior:
  - Snippet templates and placeholders are understandable and consistently rendered.
  - `{{content}}` should be explained as: “the remaining spoken text after removing the cue” (and if `{{content}}` is not present in the template, append the remaining spoken text at the end).
- Acceptance Criteria:
  1. Inline help includes a concrete example (cue + template + spoken text → final inserted text).
  2. UI copy and rendering make `{{content}}` intuitive (ideally without requiring users to understand braces).
  3. Rendering is clear (no confusing bracket/drawing artifacts).
- Related docs:
  - `docs/stories/4.4-snippets-v1.md`

#### P1.9 — App language is mixed French/English; user wants English-first + French toggle
- Evidence: 3:26–3:37
- Area: Global UI copy / i18n
- Current behavior:
  - Mixed FR/EN strings across the app.
- Desired behavior:
  - App is **100% English** by default.
  - Provide a settings toggle to switch the app to French.
- Acceptance Criteria:
  1. Default locale is English; no French strings leak in English mode.
  2. French mode exists and covers major UI surfaces (define which).
  3. Language is per-device and toggling updates UI without restart.

#### P1.10 — CrocOmni typography hierarchy and chat UX need improvement
- Evidence: 3:37–4:34
- Area: CrocOmni
- Current behavior:
  - Font is “good”, but some labels/text (e.g., “Source”) are too large.
  - “Notes dictées / ou les deux” should be much smaller (hierarchy).
  - “Filtré par date” also (hierarchy).
  - Current UI seems oriented around “optional responses”; reviewer wants a full chat window like GPT.
  - Additional requirement mentioned: “generate a response from excerpts” and “send unredacted excerpts too” (needs clarification).
- Desired behavior:
  - CrocOmni behaves like a real chat agent (messages, thinking state, follow-up questions).
  - Clear typographic scale (labels smaller than main content).
  - Excerpt/citation support is intentionally designed (redaction rules).
- Acceptance Criteria:
  1. CrocOmni has a chat conversation UI (GPT-like).
  2. Typographic hierarchy updated for readability.
  3. Responses may cite **redacted excerpts** that are clearly labeled and follow privacy/redaction rules.
  4. Supports streaming tokens (“thinking” + partial answer).
  5. Conversation history is persisted only in the chat UI, has a Clear button, and enforces a context/token limit to control cost.
- Related docs:
  - `docs/stories/12.1-crocomni-ui-and-storage.md`
  - `docs/stories/12.2-crocomni-context-injection-and-redaction.md`

#### P1.11 — Context feature: concept is good, but it “doesn’t work”
- Evidence: 4:47–5:03
- Area: Context capture/surface
- Current behavior:
  - It captures the “Croco Voice Dashboard” window.
  - But the app is always “unknown” and URL is “not available”.
  - No screenshots appear even though something is added here.
- Desired behavior:
  - App name and URL are populated when available.
  - Screenshots appear when captured (and when allowed by privacy settings).
- Acceptance Criteria:
  1. For supported apps/browsers, app name and URL populate reliably.
  2. Screenshots appear when capture is enabled and permissions granted; default should be ON if it does not increase transcription cost/time.
  3. When data is unavailable, UI explains why (permissions/unsupported app).
- Related docs:
  - `docs/stories/5.3-context-signals-and-profiles.md`
  - `docs/stories/5.4-context-capture-retention-and-redaction.md`

#### P1.12 — Diagnostics summary: long lines overflow the menu instead of wrapping
- Evidence: 5:19–5:36
- Area: Diagnostics
- Current behavior:
  - Summary contains lines that are too long and overflow outside the menu, causing ugly UI.
- Desired behavior:
  - Long lines wrap or are truncated safely within the panel.
- Acceptance Criteria:
  1. No horizontal overflow; content remains inside its container.
  2. Copy-to-clipboard remains possible (if relevant).
- Related docs:
  - `docs/stories/7.2-permissions-and-diagnostics.md`

#### P1.13 — Status bubble menu behavior: submenus close when cursor is between them
- Evidence: 6:38–6:58
- Area: Status bubble / tray menu / quick controls
- Current behavior:
  - Choosing “change microphone” opens a second menu.
  - If the cursor is in the “gap” between menus, the submenu closes.
  - Same issue for language selection.
- Desired behavior:
  - Submenus remain open with reasonable hover intent handling.
- Acceptance Criteria:
  1. Moving cursor from parent to submenu does not close submenu unintentionally.
  2. Works for both microphone and language selectors.
- Related docs:
  - `docs/stories/9.1-status-bubble-and-context-menu.md`

#### P1.14 — If there’s no text, app “translates with fake text” and outputs a fake transcript
- Evidence: 7:18–7:30
- Area: Dictation/transcription pipeline
- Current behavior:
  - When there’s no text, the app outputs a fake transcript (“faux texte”).
- Desired behavior:
  - No fake text is generated; show empty result or a clear “no speech detected” message.
- Acceptance Criteria:
  1. No placeholder transcript is inserted on empty/no-speech input.
  2. User gets actionable feedback (e.g., “No speech detected”).

### P2 — Product/IA structure ideas (keep but not urgent)

#### P2.1 — Inbox is “not very useful” but can be kept for now
- Evidence: 4:34–4:47
- Decision: Keep as-is for now; revisit after core flows are stable.
- Related docs:
  - `docs/stories/10.3-notifications-inbox.md`

#### P2.2 — Consolidate “Settings + Profile + Billing” into a dedicated modal/window with sub-navigation
- Evidence: 5:36–6:12
- Request:
  - Merge settings with profile and billing into a dedicated surface (modal is okay, or a dedicated tab).
  - Inside that surface, add a top horizontal submenu for sections (profile, billing, transcription, advanced settings, etc.).
- Acceptance Criteria (if we decide to do it):
  1. Single entry point for profile/billing/settings.
  2. Clear information architecture (tabs/sub-tabs).
  3. No regression in existing settings accessibility.
  4. Implemented in-app (not as a separate Electron window/app).

#### P2.3 — Show “Polish” somewhere in the dashboard
- Evidence: 6:58–7:18
- Request:
  - The “Polish” feature is interesting; user wants it visible in the dashboard too.
- Acceptance Criteria:
  1. Dashboard provides an entry point to Polish (or its last-run result).
  2. Clarify what “Polish” means and when it appears.

## Areas explicitly called “good”

- History: copy works; delete works; undo via notification is “superb” (0:40–1:13).
- Dictionary: “works very well” (3:04–3:15).
- Styles: “work” (5:19).
- Most of Notes editor: aside from listed issues, “rest works very well” (2:23).

## Implementation Defaults (PM recommendation unless you disagree)

1. **Context supported apps first:** support Chrome/Chromium browsers (Chrome/Edge/Brave) + VS Code + Slack first for app name + URL; show “unsupported” messaging for others.
2. **Screenshots default (privacy vs UX):** Context master switch OFF by default; when enabling Context, request explicit consent for screenshots and present them as recommended ON; screenshots are local-only, never synced, ephemeral retention.
3. **Snippets placeholders (UX):** keep `{{content}}` semantics, but add “Insert Content” UI affordance + examples so users don’t have to learn braces.
4. **Code toggle:** toolbar “Code” toggles **inline code** (best standard editor behavior); code blocks can be separate (optional follow-up).
5. **App Profiles + “test rapide”:** hide/defer until the value proposition is clear (avoid shipping confusing UX).
6. **Diagnostics summary UI:** wrap by default + “Copy full” (optional expand/collapse).
7. **CrocOmni token cap:** cap persisted chat context by tokens (drop oldest first). Initial default: **4,000 tokens** (configurable).

## Appendix A — Video Review Transcript (verbatim)

0:00 Dans cette vidéo, je vais faire une review de l'application CrocoVoice pour voir tout ce qu'il y a à corriger. Alors premièrement, on voit un premier souci sur le dashboard juste ici.
0:11 On voit qu'il y a marqué, vous êtes sur une série de 1 jour. Et juste en dessous, on a une bento box avec marqué 8 jours actifs.
0:18 Donc je comprends que ici, c'est des jours d'affilée. Tandis que là, 8 jours actifs, c'est le nombre de jours total où je me suis connecté à CrocoVoice.
0:25 Cependant, ça crée une incohérence. puisque ici une série d'un jour, ça ne devrait pas être une série d'un jour, puisqu'on a huit jours actifs juste en dessous.
0:33 Ensuite, on a le total de mots transcrits, le nombre de notes totales et le nombre de mots restants pour cette semaine.
0:40 J'aimerais que quand je clique sur le nombre de notes totale, ça m'ouvre l'onglet notes. Ensuite on a l'historique. Et ici l'historique, on a en hover trois boutons copier, exporter, supprimer.
0:52 Le bouton exporter ne sert pas à grand chose sur l'historique, on n'en a pas besoin. En revanche, le bouton copier est très utile et fonctionne.
1:02 Et pareil pour le bouton supprimer. Ça fonctionne, sachant qu'on a en plus une superbe notification qui nous permet d'annuler la suppression.
1:13 Ensuite, si je vais supprimer une note, on voit qu'il y a une espèce de flash au niveau de de l'interface, donc ça c'est pas top.
1:26 Si je vais dans l'onglet notes, je vois mes importés audio, quand j'importe un audio, mon audio pour l'instant il est queued seulement, il ne se processe jamais, et si je clique sur annuler, pour annuler du coup l'upload, rien ne fonctionne, ça ne répond pas.
1:40 En revanche, nouvelle note, ça fonctionne très bien, j'ai juste un souci au niveau de l'éditeur des notes. Quand je suis sur la barre des outils pour mettre du gras, etc., les éléments on over changent de taille, ils grossissent.
1:57 Je ne veux pas qu'ils grossissent. Si je mets quelque chose en code et que je reclipe dessus sur code, ça ne m'enlève pas le formatage code.
2:23 Le reste fonctionne très bien. Cependant, quand j'édite des choses, ça ne me met pas du markdown. Par exemple, si je fais "-espace", ça devrait me créer une liste en boulet.
2:35 Si je fais "-espace", ça devrait me créer une liste formatée. Si j'ai un texte et que je fais CTRL-B, là ça fonctionne, ça le met en graphe.
2:45 CTRL-I, ça le met bien en italique. CTRL-U, ça le met bien en underline. Mais, par contre, les listes, ça ne fonctionne pas.
3:04 Ensuite, pour le dictionnaire. Le dictionnaire fonctionne très bien, j'ai pas grand chose à redire. On peut effectivement avoir la correction, donc tout est bien.
3:15 Les snippets, je ne comprends pas pourquoi ça me met content entre braquettes et dessins. Astuce, utilisez Content. Le reste fonctionne bien.
3:26 J'ai par contre un mix de français et d'anglais dans l'application et j'ai envie que l'application soit 100% en anglais. Avec un petit toggle dans les paramètres pour mettre l'application en français.
3:37 Au niveau de Croc Omni, je trouve que les polices ne sont pas top. La police c'est top, mais par contre les textes, comme par exemple source, c'est très bien en grand, les notes dictées ou les deux, ça devrait être beaucoup plus petit.
3:59 Filtré par date, pareil. génère une réponse à partir d'extraits aussi et envoie des extraits non rédactés aussi. Également, je n'ai pas de fenêtre de chat, plutôt que réponses optionnelles, activer répondre avec l'IA pour générer une réponse, j'aimerais bien qu'il y ait comme une fenêtre pour parler
4:18 avec un agent, donc exactement quelque chose comme GPT, qui simule le même comportement, poser des questions sur nos notes, etc., en train de réfléchir, etc.
4:34 Inbox, je ne vois pas trop l'intérêt, mais pourquoi pas, on peut le laisser pour l'instant. Pas trop utile non plus.
4:47 Ensuite on a contexte. Contexte c'est super, c'est très bien fait. Le seul truc c'est que ça ne marche pas. Effectivement ça prend bien la fenêtre Croco Voice Dashboard mais en revanche l'application elle est toujours inconnue et l'URL est toujours non disponible.
5:03 Également on n'a pas les screenshots etc. Alors que c'est quelque chose qu'on met ici. Pour ce qui est des profils d'app, je ne comprends pas le principe.
5:12 Donc il faut bien que tu me l'expliques. Et enfin, test rapide, choisir un profil, il faut bien que tu me l'expliques aussi.
5:19 Les styles fonctionnent. Les réglages, il y a beaucoup de choses, mais pour l'instant, on va laisser comme ça. Et le diagnostic, j'ai un problème avec le résumé, c'est qu'il y a des lignes qui sont beaucoup trop longues et au lieu du coup de faire un 3 à la ligne dans la boîte, eh bien ça dépasse du
5:36 menu et ça crée quelque chose de très très moche. Et enfin, je pense que ça serait intéressant en fait de fusionner les réglages avec les avec le profil et facturation dans un modal spécial ou dans une fenêtre spéciale, mais un modal c'est pas mal, ou une fenêtre, pardon, un onglet, ça, ça serait très
6:12 bien, sachant que dans l'onglet, on peut avoir un sous-menu, c'est-à-dire qu'on a un onglet et ensuite on a un menu, par exemple, horizontal en haut qui permet justement d'aller dans les différentes partie, profil et facturation, l'angle de transcription etc etc et paramètres avancés.
6:38 De plus donc ça c'était concernant Le dashboard, maintenant concernant la pile, tout semble bien fonctionner. J'ai juste, oui, ici, on voit changer le micro, tac.
6:51 On voit que si je me mets sur changer le micro, ça m'ouvre le deuxième menu. Et si je suis dans l'entre-deux des menus, eh bien, ça se ferme.
6:58 Et pareil pour la langue, il n pas de souci. C'est que pour s'il y a un souci, même souci. Et également, j'ai toujours à voir le polish, c très intéressant, j'aimerais bien qu'il y ait quelque chose où on peut le voir également dans le dashboard.
7:18 Et on voit ici que s'il n'y avait pas de texte, après, on ça traduit avec un faux texte, ça ressort en transcription un faux texte, donc ça c'est pas top.
7:30 Et concernant la pile, on voit qu'ici je peux sélectionner le micro. Par contre dans les paramètres, juste là, si je vais dans les réglages et que je veux choisir mon micro, voilà j'ai un menu qui n'apparaît pas.
7:46 Exactement pareil dans l'onboarding, c'est-à-dire que j'ai un menu mais vide pour le micro, donc je vais recommencer l'onboarding. Tac, ok, donc là, pas de souci, j'autorise le micro.
7:57 Et là, en fait, voilà, j'ai un menu où je ne peux pas changer. Et on voit ici, donc là j'ai du son, signal audio détecté, et pourtant il n marqué aucun micro détecté, vérifiez votre matériel.
8:07 Alors pourtant il y a du son. Et donc je ne peux pas continuer.
