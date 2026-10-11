# Story 3.3: Modification et suppression d'un crédit

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a utilisateur,
I want modifier ou supprimer un crédit existant,
so that mettre à jour mes emprunts.

## Acceptance Criteria

1. **Given** un crédit existant dans la liste (`credits/index`) ou la page détail (`credits/show`), **When** l'utilisateur clique Modifier (ligne `onEdit` ou bouton show), **Then** un Dialog `EditLoanDialog` s'ouvre pré-rempli avec les valeurs actuelles : `name`, `borrowedAmount`, `downPayment`, `interestRate`, `durationMonths`, `status`, `startDate`.
2. **Given** le Dialog de modification soumis avec données valides vers `loans.edit` (`POST /credits/:id`), **When** `LoansController.update` valide avec `updateLoanValidator` (tous champs optionnels) et sauvegarde, **Then** le tableau d'amortissement (`schedule()`) est recalculé à la volée, le récapitulatif global et la liste se mettent à jour, un Toast "Crédit modifié" s'affiche, le Dialog se ferme.
3. **Given** des données de modification invalides (`borrowedAmount <= 0`, `durationMonths < 1`, `interestRate < 0`, `name` vide), **When** la validation VineJS échoue, **Then** rien n'est persisté, le Dialog reste ouvert, erreurs inline avec `aria-invalid` + `FieldError`.
4. **Given** l'utilisateur clique Supprimer, **When** la demande est initiée, **Then** un Dialog `DeleteLoanDialog` ("Supprimer [libellé] ?" + message définitif) avec boutons Annuler (outline) / Confirmer (destructive) s'affiche (UX-DR18).
5. **Given** la suppression confirmée (`DELETE /credits/:id` → `loans.destroy`), **When** le crédit est supprimé, **Then** il disparaît de la liste, est retiré du calcul du patrimoine (globalSummary recalculé sans lui), un Toast "Crédit supprimé" s'affiche. Annuler ne supprime rien.
6. **Given** un crédit d'un autre utilisateur, **When** update/delete/show est appelé, **Then** 404 (scope `where userId`). Non authentifié → redirect `/login`.

## Tasks / Subtasks

- [ ] Task 1 — Audit existant (NE PAS recréer) (AC: 1, 4)
  - [ ] 1.1 Relire `app/controllers/loans_controller.ts` (update/destroy), `app/validators/loan.ts` (updateLoanValidator), `inertia/components/credits/edit_loan_dialog.tsx`, `delete_loan_dialog.tsx`, `inertia/components/shared/delete_dialog.tsx`, `inertia/pages/credits/index.tsx` (onEdit/onDelete), `inertia/pages/credits/show.tsx` (boutons Modifier/Supprimer)
  - [ ] 1.2 Vérifier routes `start/routes.ts` : `POST /credits/:id` → `loans.edit`, `DELETE /credits/:id` → `loans.destroy` (POST pas PATCH, compat O2Switch)
- [ ] Task 2 — Backend : polish update/destroy (AC: 2, 3, 5, 6)
  - [ ] 2.1 Conserver `updateLoanValidator` tout-optionnel + `update` par champ (`if payload.x !== undefined`) + `loan.save()` + flash "Crédit modifié" + redirect `loans`. Conserver `destroy` : `firstOrFail` scopé user + `delete()` + flash "Crédit supprimé" + redirect
  - [ ] 2.2 Vérifier aucun champ `monthlyPayment` persisté ; recalcul = getters modèle (pas de migration). Vérifier `status` enum active|paid expose le passage en "Remboursé" (remainingBalance 0, show gère `remainingDue = 0`)
  - [ ] 2.3 Renforcer `tests/functional/loans.spec.ts` si manquant : update partiel (ex. `interestRate` seul → totalInterest change), update invalide (`borrowedAmount: 0` → 302 sans changement), update/delete cross-user → 404, delete → 404 au re-get
- [ ] Task 3 — Frontend : edit dialog (AC: 1, 2, 3)
  - [ ] 3.1 Réutiliser `FormDialog` (`route="loans.edit"`, `routeParams={{id}}`) — pré-remplissage via `defaultValue`, `autoFocus` nom, select statut natif En cours/Remboursé, erreurs inline `errors.*`
  - [ ] 3.2 Optionnel mais recommandé : preview mensualité recalculée live comme en 3.2 (même fonction `calcMonthly`) avec `aria-live="polite"` — cohérence ajout/édition
  - [ ] 3.3 A11y (UX-DR5/DR16) : `aria-required`, `aria-describedby` erreurs, Escape ferme, retour focus déclencheur, full-screen mobile via `dialog.tsx`
- [ ] Task 4 — Frontend : delete + câblage pages (AC: 4, 5)
  - [ ] 4.1 Réutiliser `DeleteDialog` (`route="loans.destroy"`, `entityName={loan.name}`) — titre "Supprimer [libellé] ?", Confirmer destructive. Ne pas réimplémenter
  - [ ] 4.2 Vérifier câblage `index.tsx` (`onEdit` → `EditLoanDialog`, `onDelete` → `DeleteLoanDialog`, `onRowClick` → `router.visit('/credits/:id')`) et `show.tsx` (boutons Modifier/Supprimer + retour liste). Après mutation, redirect Inertia rafraîchit liste + récap (AD-1, pas de state global)
- [ ] Task 5 — Qualité (AC: all)
  - [ ] 5.1 `node ace test` (loans + loan_model), `npm run typecheck`, `npm run build` au vert

## Dev Notes

- NE PAS recréer : `updateLoanValidator`, `LoansController.update/destroy`, routes edit/destroy, `Edit/DeleteLoanDialog`, `DeleteDialog`/`FormDialog`, pages index/show. Livrés en 3.1, vérifiés en 3.2 (store). Cette story = verrouillage + polish.
- Recalcul amortissement : aucune table échéancier ; `schedule()`, `monthlyPayment`, `totalInterest`, `totalPaid`, `settled()` recalculés à chaque render serveur (`index` mappe chaque loan + `globalSummary` réduit sans le supprimé). Éditer taux/durée/montant change immédiatement mensualité + intérêts + progression.
- Conventions : labels FR ("Modifier", "Supprimer", "En cours", "Remboursé"), code EN. Montants `Number()` + `formatBudget` EUR. Dates Luxon `YYYY-MM-DD`. Routes POST pour edit (O2Switch), DELETE pour destroy. Flash via `session.flash` → Sonner, pas de toast manuel.
- Sécurité : scope systématique `where('userId', auth.user.id)` + `firstOrFail` → 404 cross-user. Middleware auth → `/login`.
- Fichiers : UPDATE `inertia/components/credits/edit_loan_dialog.tsx` (preview optionnelle), UPDATE `tests/functional/loans.spec.ts` (cas manquants). Ne pas toucher modèle/migration/contrôleur/routes sauf bug bloquant.

### Project Structure Notes

- Alignement : `loans_controller.ts` snake, `Loan` Pascal, VineJS `app/validators/loan.ts`, groupe `/credits`, table `loans`, pages `credits/index` + `credits/show`, composants `credits/*` + `shared/*`. Écart spine (`credit_*` vs `loan_*`) conservé depuis 3.1 — ne pas renommer ici.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.3] AC modif pré-remplie, recalcul, confirmation destructive, retrait patrimoine, toast
- [Source: _bmad-output/planning-artifacts/prds/prd-budget-tracker-2026-07-19/prd.md#FR-12] Modifier recalcule, supprimer retire du patrimoine
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-budget-tracker-2026-07-19/EXPERIENCE.md#UJ-3] Clic crédit → modif/suppression
- [Source: _bmad-output/architecture/architecture-budget-tracker-2026-07-19/ARCHITECTURE-SPINE.md#AD-1] Inertia server-driven, pas de store client
- [Source: app/models/loan.ts#schedule-settled] Amortissement on-the-fly
- [Source: app/validators/loan.ts#updateLoanValidator] Contrat update partiel
- [Source: app/controllers/loans_controller.ts#update-destroy] Save/delete scopés + flash + redirect
- [Source: start/routes.ts#credits-group] POST /:id edit, DELETE /:id destroy
- [Source: inertia/components/shared/form_dialog.tsx + delete_dialog.tsx] Wrappers réutilisables
- [Source: inertia/components/credits/edit_loan_dialog.tsx + delete_loan_dialog.tsx] Base existante
- [Source: inertia/pages/credits/index.tsx + show.tsx] Câblage edit/delete/détail
- [Source: tests/functional/loans.spec.ts#update-destroy] Tests existants à compléter

### Previous Story Intelligence (3.1, 3.2)

- 3.1 `done` : CRUD complet + dialogs + détail amortissement + tests 29 pass. 3.2 `done` (vérifiée) : store + validator + toast + récap OK ; seul gap = preview mensualité live non bloquante.
- Réutiliser : `FormDialog route loans.edit + routeParams`, `DeleteDialog route loans.destroy`, `FieldError`, `formatBudget`, badges statut, `router.visit`, flash Sonner.
- Pièges : POST pas PATCH ; `data_table.tsx` ; sidebar route `loans` ; `remainingBalance` simplifié.

## Out of Scope

- Création (3.2), suivi paiements réels, export échéancier, mensualité manuelle persistée, renommage Loan→Credit

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

## Status

ready-for-dev — Ultimate context engine analysis completed - comprehensive developer guide created
