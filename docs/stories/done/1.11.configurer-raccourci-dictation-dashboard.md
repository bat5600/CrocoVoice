# Story 1.11: Configurer le raccourci de dictee dans le dashboard

## Status
Done

## Story
**As a** utilisateur,
**I want** pouvoir modifier le raccourci global qui demarre/arrete la dictee depuis les reglages du dashboard,
**so that** je puisse adapter le declenchement a mon usage sans conflit de raccourci.

## Story Context
**Existing System Integration:**
- Integrates with: dashboard settings UI, settings IPC, enregistrement dictation (globalShortcut)
- Technology: Electron (main/renderer), IPC, SQLite settings store
- Follows pattern: champs `data-setting` + `handleSettingChange` + `settings:save`
- Touch points: `dashboard.html`, `dashboard.js`, `main.js`, `preload.js`, `renderer.js`

## Acceptance Criteria
**Functional Requirements:**
1. Un champ "Raccourci de dictee" est ajoute dans les Reglages du dashboard et affiche la valeur actuelle (ex: `Ctrl+Shift+R`).
2. Modifier le champ met a jour la valeur en base et re-enregistre le raccourci global immediatement.
3. Si le raccourci est invalide ou ne peut pas etre enregistre, l'utilisateur est notifie et l'ancien raccourci reste actif.

**Integration Requirements:**
4. Le flux de dictee existant (start/stop via raccourci global) continue de fonctionner sans regression.
5. Les autres reglages conservent le meme comportement et le meme format d'enregistrement.
6. La mise a jour du raccourci suit le meme pattern `data-setting`/`settings:save`.

**Quality Requirements:**
7. Le changement est couvert par tests manuels essentiels (maj du raccourci, echec d'enregistrement).
8. Aucune regression sur l'affichage du raccourci dans l'app principale.
9. Aucune degradation de performance observable.

## Technical Notes
- **Integration Approach:** ajouter un input `data-setting="shortcut"` dans `dashboard.html`, utiliser `handleSettingChange` dans `dashboard.js`, et reutiliser `ipcMain.handle('settings:save')` qui appelle `registerGlobalShortcut`.
- **Existing Pattern Reference:** inputs settings actuels (langue, micro, post-process) via `data-setting` + save IPC.
- **Key Constraints:** compatibilite multi-OS des raccourcis Electron; garder un raccourci valide en cas d'echec.

## Definition of Done
- [ ] Functional requirements met
- [ ] Integration requirements verified
- [ ] Existing functionality regression tested
- [ ] Code follows existing patterns and standards
- [ ] Tests pass (existing and new)
- [ ] Documentation updated if applicable

## Risk and Compatibility Check
**Primary Risk:** raccourci invalide ou conflit OS provoquant un echec d'enregistrement.
**Mitigation:** valider via `globalShortcut.register` et restaurer l'ancien raccourci en cas d'echec.
**Rollback:** revert de la valeur settings a la precedente et re-enregistrement du raccourci precedent.

**Compatibility Verification:**
- [ ] No breaking changes to existing APIs
- [ ] Database changes (if any) are additive only
- [ ] UI changes follow existing design patterns
- [ ] Performance impact is negligible

## Validation Checklist
**Scope Validation:**
- [ ] Story can be completed in one development session
- [ ] Integration approach is straightforward
- [ ] Follows existing patterns exactly
- [ ] No design or architecture work required

**Clarity Check:**
- [ ] Story requirements are unambiguous
- [ ] Integration points are clearly specified
- [ ] Success criteria are testable
- [ ] Rollback approach is simple

## Change Log
| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 2026-01-15 | v0.1 | Creation de la dev story | PM |
| 2026-01-18 | v0.2 | Shortcut capture UI + safe rollback | Dev |
| 2026-01-18 | v0.3 | Validation utilisateur | Dev |

## Dev Agent Record
### Agent Model Used
GPT-5.2

### Debug Log References
N/A

### Completion Notes List
- Ajout d’un champ de raccourci dans le dashboard (capture clavier, reset, feedback via toast).
- Sauvegarde robuste: si `globalShortcut.register` echoue, l’ancien raccourci reste actif et la valeur est revertie.
- Tests manuels a effectuer: modifier le raccourci, verifier start/stop global, tester un raccourci invalide (sans modificateur) et un raccourci deja reserve par l’OS.

### File List
- dashboard.html
- dashboard.js
- main.js

## QA Results
