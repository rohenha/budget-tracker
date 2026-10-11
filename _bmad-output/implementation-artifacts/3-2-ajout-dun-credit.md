# Story 3.2: Ajout d'un crédit

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a utilisateur,
I want ajouter un crédit immobilier avec calcul automatique de la mensualité,
so that suivre mes emprunts.

## Acceptance Criteria

1. **Given** un utilisateur authentifié sur la page Crédits (`inertia/pages/credits/index.tsx`), **When** il clique "Ajouter", **Then** un Dialog shadcn s'ouvre avec les champs : libellé (`name`), montant emprunté (`borrowedAmount`), apport initial/frais (`downPayment`), taux annuel % (`interestRate`), durée mois (`durationMonths`), date début (`startDate`), mensualité en lecture seule calculée en direct (preview).
2. **Given** le Dialog d'ajout ouvert, **When** l'utilisateur saisit montant + taux + durée valides, **Then** la mensualité preview est calculée en direct avec la formule annuité française (voir Dev Notes) et affichée formatée EUR ; si `interestRate === 0` alors `mensualité = borrowedAmount / durationMonths`.
3. **Given** le formulaire soumis avec données valides via `Form` Inertia vers route `loans.store` (`POST /credits`), **When** `LoansController.store` valide avec `storeLoanValidator` et crée le `Loan`, **Then** le crédit est créé avec son tableau d'amortissement calculable à la volée (`loan.schedule()`), le récapitulatif global se met à jour, un Toast Sonner "Crédit ajouté" s'affiche, le Dialog se ferme (`onSuccess`), la liste affiche la nouvelle ligne (nom, montant EUR, mensualité, taux, durée, statut).
4. **Given** l'apport initial renseigné (`downPayment >= 0`), **When** le crédit est créé, **Then** l'apport est persisté (`downPayment`, default 0) et inclus dans le coût total affiché ; il n'entre pas dans le calcul de la mensualité (mensualité = f(borrowedAmount, taux, durée) uniquement).
5. **Given** des données invalides (nom vide, `borrowedAmount <= 0`, `durationMonths < 1`, `interestRate < 0`, `startDate` absente/invalide), **When** la validation VineJS échoue, **Then** aucun crédit n'est créé, le Dialog reste ouvert, chaque champ en erreur affiche un message inline avec `aria-invalid` + `FieldError`, focus sur le premier champ en erreur.
6. **Given** aucun crédit après ajout (cas vide → premier ajout), **When** le crédit est créé, **Then** l'empty state `PageState` disparaît et la `DataTable` + les 4 cartes récap s'affichent.
7. **Given** un utilisateur non authentifié, **When** il appelle `POST /credits`, **Then** redirection `/login` (middleware auth). Un utilisateur ne peut créer que ses propres crédits (`userId = auth.user.id`).

## Tasks / Subtasks

- [ ] Task 1 — Audit existant (NE PAS recréer) (AC: 1, 3)
  - [ ] 1.1 Relire `app/models/loan.ts` (monthlyPayment, totalInterest, totalPaid, schedule(), settled()), `app/validators/loan.ts` (storeLoanValidator), `app/controllers/loans_controller.ts` (index/show/store), `start/routes.ts` (groupe `/credits`), `inertia/components/credits/add_loan_dialog.tsx`, `inertia/components/shared/form_dialog.tsx`, `inertia/pages/credits/index.tsx`
  - [ ] 1.2 Vérifier `database/migrations/20260726225019_create_loans_table.ts` : colonnes `user_id FK`, `name`, `borrowed_amount DECIMAL`, `down_payment DECIMAL default 0`, `interest_rate DECIMAL`, `duration_months INT`, `status ENUM active|paid`, `start_date DATE`
  - [ ] 1.3 Lister les écarts vs AC : preview mensualité live manquante dans `AddLoanDialog`, champ mensualité manuelle (optionnel — trancher : lecture seule suffit, cf Dev Notes), tests apport/downPayment partiels
- [ ] Task 2 — Backend : polish store + validation (AC: 3, 4, 5, 7)
  - [ ] 2.1 Conserver `storeLoanValidator` : `name` trim 1..255 required, `borrowedAmount` number >0.01, `downPayment` optional >=0, `interestRate` >=0, `durationMonths` int >=1, `status` optional enum, `startDate` date YYYY-MM-DD required. Ne pas ajouter de champ `monthlyPayment` côté serveur (calculé, jamais persisté)
  - [ ] 2.2 Conserver `LoansController.store` : `validateUsing`, `Loan.create({...payload, downPayment ?? 0, userId})`, `session.flash('success','Crédit ajouté')`, `redirect().toRoute('loans')`. Vérifier isolation user (`auth.user.id`)
  - [ ] 2.3 Ajouter/renforcer tests fonctionnels `tests/functional/loans.spec.ts` groupe POST /credits : création avec `downPayment: 30000` → persisté ; `interestRate: 0` accepté ; `borrowedAmount: 0`, `durationMonths: 0`, `name` manquant, `interestRate: -1` → 302 sans création
- [ ] Task 3 — Frontend : Dialog ajout avec preview mensualité (AC: 1, 2, 5)
  - [ ] 3.1 Réutiliser `FormDialog` (`route="loans.store"`, title "Ajouter un crédit", submit "Ajouter") — NE PAS réimplémenter Dialog/Form/Footer. Réutiliser `Field/FieldContent/FieldError/Input`, `formatBudget` (`Intl.NumberFormat fr-FR EUR`)
  - [ ] 3.2 Ajouter preview mensualité live dans `AddLoanDialog` : state local `borrowedAmount/interestRate/durationMonths` (controlled ou `onChange` sur Inputs non contrôlés), fonction `calcMonthly(b, r, n)` identique au modèle (annuité + cas taux 0 + garde `n<=0 → 0`), affichage sous les champs : "Mensualité estimée : X €" (`aria-live="polite"`), mise à jour à chaque frappe
  - [ ] 3.3 Champs : `name` (text, autoFocus, placeholder "Prêt immobilier"), `borrowedAmount` (number step 0.01 min 0.01), `downPayment` (number step 0.01 min 0, placeholder "30000"), `interestRate` (number step 0.01 min 0), `durationMonths` (number min 1), `startDate` (date, default today). Erreurs inline via `errors.*` + `aria-invalid`
  - [ ] 3.4 A11y/UX (UX-DR5, DR16, DR19) : auto-focus nom, `aria-required` champs obligatoires, `aria-describedby` erreurs, Dialog full-screen mobile (déjà géré par `dialog.tsx`), Escape ferme, retour focus déclencheur, touch targets >=44px
- [ ] Task 4 — Liste + récap + toast (AC: 3, 6)
  - [ ] 4.1 Vérifier `inertia/pages/credits/index.tsx` : bouton "Ajouter" ouvre `AddLoanDialog`, `PageState` empty "Aucun crédit / Ajoute ton premier crédit immobilier", `DataTable` + 4 cartes récap se mettent à jour après redirect Inertia (pas de state global, AD-1)
  - [ ] 4.2 Vérifier flash Sonner : `session.flash('success')` relayé via shared props Inertia → toast. Ne pas ajouter de toast manuel
- [ ] Task 5 — Qualité : types, tests, build (AC: all)
  - [ ] 5.1 Types `inertia/components/credits/constants.ts` inchangés (`Loan`, `GlobalSummary`, `InstallmentRow`) — la preview utilise un calcul local, pas de nouveau type serveur
  - [ ] 5.2 Lancer `node ace test` (groupes loans + loan_model), `npm run typecheck`, `npm run build`. Corriger jusqu'au vert

## Dev Notes

- NE PAS recréer : migration loans, `Loan` model, `LoansController.index/show/store`, routes `/credits`, `FormDialog`, `AddLoanDialog` (polish uniquement), `constants.ts`, `DataTable`, `PageState`. Story 3.1 a déjà livré le CRUD complet (voir Previous Story Intelligence).
- Formule annuité française (source unique : `app/models/loan.ts:52-62`) :
  ```
  monthly_rate = interest_rate / 100 / 12
  monthly_payment = borrowed_amount * monthly_rate * (1+monthly_rate)^n / ((1+monthly_rate)^n - 1)
  taux 0 → borrowed_amount / n
  ```
  Frontend preview DOIT dupliquer exactement cette formule (pas d'écart d'arrondi bloquant ; affichage `formatBudget`, calcul brut pour tests).
- Mensualité manuelle (épic : "calculée auto ou saisie manuelle") : TRANCHÉ — lecture seule calculée uniquement. Le backend ne persiste pas la mensualité (`storeLoanValidator` n'a pas ce champ) ; ajouter un champ saisissable casserait le contrat modèle/validator/tests. Si besoin futur → story dédiée avec migration + recalcul amortissement custom (hors scope, cf Out of Scope).
- Apport : `downPayment` inclus dans coût total affiché (`totalPaid + downPayment` côté présentation si besoin) mais exclu du calcul mensualité/amortissement. `schedule()` itère `1..durationMonths`, `dueDate = startDate.plus({months: i})`, ajustement dernier mois pour solde 0.
- Conventions : labels UI en français ("Crédit", "Montant emprunté (€)", "Taux annuel (%)", "Durée (mois)", "Date de début", "Mensualité estimée"), code en anglais (`borrowedAmount`, `downPayment`, `interestRate`, `durationMonths`, `startDate`). Montants `DECIMAL` base → `Number()` côté contrôleur, formatés `Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'})`. Dates Luxon `DateTime`, input `YYYY-MM-DD`. Routes POST (pas PATCH) pour compat O2Switch — `loans.edit` = `POST /credits/:id`.
- Architecture : AD-1 (aucun store client, tout via Inertia `Form` + redirect), NFR6 (français uniquement), NFR3 (MySQL via Lucid). Pas de CSV, pas d'API externe dans cette story.
- Fichiers touchés : UPDATE `inertia/components/credits/add_loan_dialog.tsx`, UPDATE `tests/functional/loans.spec.ts` (cas apport/taux0/validation), UPDATE éventuel `inertia/pages/credits/index.tsx` (câblage mineur uniquement). Ne pas modifier `loan.ts`, `validators/loan.ts`, `loans_controller.ts`, `routes.ts` sauf bug bloquant constaté.

### Project Structure Notes

- Alignement : `app/controllers/loans_controller.ts` (snake_case), `app/models/loan.ts` (PascalCase `Loan`), `app/validators/loan.ts` (VineJS), routes kebab `/credits` groupées, tables snake pluriel `loans`, `inertia/pages/credits/index.tsx` + `inertia/components/credits/*`, `inertia/components/shared/form_dialog.tsx` réutilisé.
- Conflit détecté : spine prévoit `credit_controller.ts` / modèle `Credit` mais implémentation réelle = `loans_controller.ts` / `Loan` / table `loans` (décision 3.1, conservée). Ne pas renommer dans cette story.
- Pas de nouveau service, pas de nouvelle migration, pas de nouveau composant shadcn (utiliser existants ; `shadcn CLI` seulement si composant manquant — non prévu ici).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.2] AC ajout crédit, Dialog champs + mensualité auto/manuelle, apport inclus, toast, récap maj
- [Source: _bmad-output/planning-artifacts/prds/prd-budget-tracker-2026-07-19/prd.md#FR-11] Popin libellé/montant/apport/taux/durée/date, mensualité auto ou saisie, apport dans coût total
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-budget-tracker-2026-07-19/EXPERIENCE.md#UJ-4] Flow Ajouter crédit → Dialog → liste + récap "Total dû / Intérêts"
- [Source: _bmad-output/architecture/architecture-budget-tracker-2026-07-19/ARCHITECTURE-SPINE.md#AD-1] Server-driven Inertia, pas de store/fetch client
- [Source: app/models/loan.ts#monthlyPayment-schedule] Formule annuité + schedule on-the-fly, pas de table installments
- [Source: app/validators/loan.ts#storeLoanValidator] Contrat validation création
- [Source: app/controllers/loans_controller.ts#store] Create + flash + redirect loans
- [Source: start/routes.ts#credits-group] GET / + GET /:id + POST / + POST /:id + DELETE /:id sous `/credits`
- [Source: inertia/components/shared/form_dialog.tsx] Wrapper Dialog+Form réutilisable (route loans.store)
- [Source: inertia/components/credits/add_loan_dialog.tsx] Base existante à polisher (preview manquante)
- [Source: tests/functional/loans.spec.ts#POST-credits] Tests store existants à étendre
- [Source: tests/unit/loan_model.spec.ts] Référence calculs mensualité/taux0 à зеркалить en preview

### Previous Story Intelligence (3.1)

- 3.1 livrée `done` : migration `20260726225019_create_loans_table.ts`, modèle avec `monthlyPayment/totalInterest/totalPaid/remainingBalance/schedule()/settled()`, validator store+update, contrôleur CRUD complet, routes `/credits` (5 routes POST-style), pages `credits/index` + `credits/show`, `Add/Edit/DeleteLoanDialog`, `constants.ts`, `DataTable` avec `onRowClick`, `form_dialog`/`delete_dialog` câblés aux routes loans.
- Patterns à réutiliser : `FormDialog route="loans.store" onSuccess close`, `FieldError errors=[{message: errors.x}]`, `formatBudget`, badges statut active=blue/paid=green, `router.visit('/credits/:id')`, flash Sonner via redirect.
- Pièges connus : routes POST pas PATCH (O2Switch) ; `.adonisjs` folder à ne pas committer n'importe comment ; `data-table.tsx` renommé `data_table.tsx` ; sidebar utilise route `loans` ; `remainingBalance` = 0 si paid sinon borrowed (pas de calcul pro-rata — conservé).
- Ce qui reste pour 3.2 : uniquement polish ajout (preview mensualité + tests apport). Ne pas refaire le CRUD.

### Git Intelligence

- Commits récents : `bfaf2e7 FIX: refactor global data on credits`, `504a7e7 FEAT: add month filter for budget`, `0024963 FIX: change tests texts in english` — activité sur crédits + filtres ; conventions commits mixtes FR/EN, préfixe FIX/FEAT.
- Dépôts : controllers `loans_controller.ts`, models `loan.ts` existent ; `session/new_account/categorie/depense/depenses_import` comme références patterns CRUD + tests (`categories.spec`, `depenses.spec`, `loans.spec`).

## Out of Scope

- Modification / suppression (Story 3.3)
- Mensualité manuelle persistée / amortissement custom
- Suivi paiements réels vs échéancier, export CSV/PDF échéancier
- Renommage Loan→Credit, refonte récap global

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

## Status

ready-for-dev — Ultimate context engine analysis completed - comprehensive developer guide created
