# Story 3.1: Liste et récapitulatif des crédits

## Status

done

## Story

En tant qu'utilisateur, je veux voir la liste de mes crédits immobiliers avec un récapitulatif (total remboursement, intérêts payés, apport initial) et le détail de chaque crédit, donc connaître le coût total de mes emprunts.

## Acceptance Criteria

1. Given un utilisateur connecté avec au moins un crédit immobilier enregistré, when il navigue vers la page des crédits, then la liste affiche chaque crédit avec son nom, borrowed_amount formaté EUR, interest_rate, duration_months, et statut (en_cours/rembourse).
2. Given la liste des crédits affichée, when l'utilisateur consulte le récapitulatif global, then il voit le total borrowed, le total des intérêts payés, et le total remboursé pour tous les crédits combinés.
3. Given la liste des crédits affichée, when l'utilisateur clique sur un crédit, then une vue détaillée s'ouvre montrant le calcul d'amortissement complet (échéancier mensuel avec numéro, due_date, principal_amount, interest, remaining_balance).
4. Given un crédit est en cours, when le détail est affiché, then les métriques clés sont calculées en temps réel : monthly_payment (formule annuité), total_interest, total_paid, remaining_balance.
5. Given aucun crédit enregistré, when la page est affichée, then un message vide "Ajoute ton premier crédit immobilier" avec CTA est affiché.

## Out of Scope

- Modification / suppression de crédit (Story 3.3)
- Suivi des paiements réels vs échéancier prévu
- Export CSV/PDF de l'échéancier
- Calcul d'amortissement personnalisé (autres types que français)

## Tasks / Subtasks

- [x] Task 1: Create DB migration + model for loans (agent: backend)
  - [x] 1.1 Generate migration `create_loans_table.ts` — columns: `user_id` (FK), `name` (string), `borrowed_amount` (decimal 15,2), `down_payment` (decimal 15,2), `interest_rate` (decimal 5,3, ex: 3.5 pour 3.5%), `duration_months` (integer), `status` (enum: `active`/`paid`), `start_date` (date), timestamps
  - [x] 1.2 Create `app/models/loan.ts` — `@belongsTo(() => User)`, computed properties: `monthlyPayment` (formule annuité), `totalInterest`, `totalPaid`, `remainingBalance`
  - [x] 1.3 Add `schedule()` method to Loan model — returns array of installment objects computed on-the-fly

- [x] Task 2: Backend controller + validators + routes (agent: backend)
  - [x] 2.1 Create `app/validators/loan.ts` — `storeLoanValidator` (name required string, borrowed_amount required number >0, down_payment optional number >=0 default 0, interest_rate required number, duration_months required integer >0, status default `active`, start_date required date)
  - [x] 2.2 Create `app/controllers/loans_controller.ts` — `index`: fetch user's loans, compute per-loan aggregates via model computed props + global aggregates; `show`: return single loan with full schedule
  - [x] 2.3 Update `start/routes.ts` — replace with `/credits` group using LoansController

- [x] Task 3: Frontend — list page with global + per-loan summary (agent: frontend)
  - [x] 3.1 Rewrite `inertia/pages/credits/index.tsx` — receive `loans` array and `globalSummary` via Inertia props. Render global summary cards at top (total borrowed, total interest, total paid). Render list of loans showing `name`, `borrowedAmount` (EUR), `status` badge (active=blue, paid=green), `monthlyPayment`.
  - [x] 3.2 Create `inertia/components/credits/constants.ts` — TypeScript types: `Loan`, `GlobalSummary`, `InstallmentRow`
  - [x] 3.3 Global summary cards rendered inline in page using `Card` components (3 stat cards: Total emprunté, Total intérêts, Total remboursé)

- [x] Task 4: Frontend — loan detail with amortization schedule (agent: frontend)
  - [x] 4.1 Detail sheet rendered inline via `Sheet` component — opens on row click, receives `selectedLoan` with `schedule` array
  - [x] 4.2 Inside sheet: key metrics section (monthly_payment, total_interest, total_paid, remaining_balance, interest_rate, duration_months, down_payment, start_date) + DataTable showing installment schedule (installment_number, due_date, principal_amount, interest, total_payment, remaining_balance)
  - [x] 4.3 Wire up: on row click, `router.get('/credits/:id')` with `preserveState: true, only: ['selectedLoan']`

- [x] Task 5: Empty state + add dialog (agent: frontend)
  - [x] 5.1 Empty state: `PageState` with `empty` variant "Aucun crédit — Ajoute ton premier crédit immobilier" + CTA button
  - [x] 5.2 Add dialog: `inertia/components/credits/add_loan_dialog.tsx` using `FormDialog` wrapping `route="loans.store"` with fields: name, borrowed_amount, down_payment, interest_rate, duration_months, start_date

## Dev Notes

### Amortization calculation (real-time)

Use the standard French annuity formula — no separate installments table:

```
monthly_rate = interest_rate / 100 / 12
monthly_payment = borrowed_amount * monthly_rate * (1 + monthly_rate)^duration_months / ((1 + monthly_rate)^duration_months - 1)
```

For each month `i` (1 to duration_months):

```
interest = remaining_balance * monthly_rate
principal_amount = monthly_payment - interest
remaining_balance = remaining_balance - principal_amount
```

Edge cases:

- If `interest_rate === 0`: `monthly_payment = borrowed_amount / duration_months`
- The final month may need a small adjustment to bring remaining_balance to 0 (floating point rounding)
- `start_date` determines the due_date: `start_date.plus({ months: i })`

### Data model

```typescript
// loans table (english naming)
// id, user_id, name, borrowed_amount, down_payment, interest_rate,
// duration_months, status (active|paid), start_date, created_at, updated_at
```

No `loan_installments` table — schedule computed on-the-fly via model method.

### Controller pattern

```typescript
// LoansController.index
const loans = await Loan.query().where('userId', auth.user!.id)

const loansWithSummary = loans.map((loan) => ({
  ...loan.serialize(),
  monthlyPayment: loan.monthlyPayment,
  totalInterest: loan.totalInterest,
  totalPaid: loan.totalPaid,
  remainingBalance: loan.remainingBalance,
}))

const globalSummary = {
  totalBorrowed: loansWithSummary.reduce((s, l) => s + Number(l.borrowedAmount), 0),
  totalInterest: loansWithSummary.reduce((s, l) => s + l.totalInterest, 0),
  totalPaid: loansWithSummary.reduce((s, l) => s + l.totalPaid, 0),
}
```

### Route pattern

```typescript
router
  .group(() => {
    router.get('/', [controllers.Loans, 'index']).as('loans')
    router.get('/:id', [controllers.Loans, 'show']).as('loans.show')
    router.post('/', [controllers.Loans, 'store']).as('loans.store')
    // update + destroy in Story 3.3
  })
  .prefix('/loans')
```

### UI conventions

- "Crédit" in French UI labels (user-facing text stays French per NFR6)
- Table/column names in English (code convention)
- Follow existing patterns: `inertia/pages/depenses/index.tsx` for CRUD page, `form_dialog.tsx` for add dialog, `page_state.tsx` for empty state, `sheet.tsx` for detail view
- Format currency: `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`
- Status badge: active=blue, paid=green

## Dev Agent Record

### Agent Model Used

opencode (deepseek-v4-flash-free)

### Completion Notes

Story 3.1 fully implemented and validated (done):

- Migration `create_loans_table.ts` with user_id FK, name, borrowed_amount, down_payment, interest_rate, duration_months, status (active/paid), start_date
- `app/models/loan.ts` with amortization logic: monthlyPayment (annuity formula), totalInterest, totalPaid, remainingBalance, schedule(), settled()
- `app/validators/loan.ts` with storeLoanValidator and updateLoanValidator
- `app/controllers/loans_controller.ts` with CRUD: index (loans + globalSummary), show (single loan + schedule + settled), store, update, destroy
- Routes updated: `/credits` group with all 5 REST routes
- Updated sidebar to use 'loans' route, active URL detection via href
- Added route types 'loans' / 'loans.store' / 'loans.update' / 'loans.destroy' to form_dialog.tsx and delete_dialog.tsx
- Added onRowClick to DataTable component; renamed data-table.tsx → data_table.tsx
- Frontend index page: 3 featured global summary cards (total emprunté, déjà remboursé, reste à rembourser) + compact récapitulatif card
- Frontend show page: dedicated `/credits/:id` page with 3 featured cards (restant dû, mensualité, déjà remboursé) + compact paramètres card + amortization schedule DataTable + Edit/Delete buttons
- AddLoanDialog, EditLoanDialog, DeleteLoanDialog components
- `inertia/components/credits/constants.ts` with Loan, GlobalSummary, InstallmentRow types
- All tests pass, typecheck passes, migration applied

### Files Modified

- database/migrations/20260726225019_create_loans_table.ts (new)
- app/models/loan.ts (new)
- app/validators/loan.ts (new)
- app/controllers/loans_controller.ts (new)
- start/routes.ts (modified)
- inertia/components/sidebar.tsx (modified)
- inertia/components/shared/form_dialog.tsx (modified)
- inertia/components/shared/delete_dialog.tsx (modified)
- inertia/components/ui/data_table.tsx (modified)
- inertia/components/credits/constants.ts (new)
- inertia/components/credits/add_loan_dialog.tsx (new)
- inertia/pages/credits/index.tsx (rewritten)
