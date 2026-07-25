# Story 2.1: Import CSV avec revue et édition

## Status

ready-for-dev

## Story

As a budget tracker user, I want to import a Crédit Agricole CSV file and review/edit the parsed transactions before confirming, so that I can correct parsing errors and adjust categories without re-entering data.

## Acceptance Criteria

1. Given the user is on the transactions page, when they click the import button and select a Crédit Agricole CSV file, then the file is parsed and a preview table displays all transactions with columns for date, label, amount, and category.

2. Given the preview table is displayed, when the user clicks on any cell (label, amount, or category), then the cell becomes editable inline.

3. Given a cell is in edit mode, when the user modifies the value and presses Enter or clicks outside the cell, then the new value is saved in the preview state.

4. Given the preview table is displayed, when the user changes the category dropdown for a transaction, then the category updates immediately for that row.

5. Given the preview table is displayed, when the user clicks the validate button, then all transactions are saved to the database and the user is redirected to the transactions list.

6. Given the CSV file contains malformed rows (invalid date, non-numeric amount), when the file is parsed, then affected rows are highlighted in red with an inline error message explaining the issue.

7. Given there are validation errors in the preview, when the user clicks the validate button, then only error-free transactions are saved and the user sees a summary of how many were imported vs skipped.

8. Given the user wants to discard the import, when they click the cancel button, then the preview is dismissed and no transactions are saved.

9. Given the CSV file has a date format of DD/MM/YYYY, when the file is parsed, then dates are correctly converted to ISO format (YYYY-MM-DD) for storage.

10. Given the CSV file contains duplicate transactions (same date + amount + label already exist), when the file is parsed, then duplicate rows are flagged with a warning icon and the user can choose to skip or keep them.

## Out of scope

- Import from bank APIs or Plaid integration
- Auto-categorization using ML or rules engine
- Support for other bank CSV formats beyond Crédit Agricole
- Bulk edit (editing multiple rows at once)
- Undo after validation is confirmed

## Tasks / Subtasks

- [ ] Task 1: CSV parser service (agent: backend)
  - [ ] 1.1 Install `papaparse` dependency (`npm install papaparse` + `@types/papaparse`)
  - [ ] 1.2 Create `app/services/csv_parser.ts` — parse Crédit Agricole CSV (separator `;`, header row `Date de l'opération`, `Date de valeur`, `Description`, `Débit`, `Crédit`). Return typed `ParsedTransaction[]` with fields: `dateStr`, `label`, `amountStr`, `rawAmount` (number|null), `errors[]`. Convert DD/MM/YYYY → ISO YYYY-MM-DD via Luxon. Compute amount from Débit (negative) / Crédit (positive) columns. Flag non-numeric amounts and unparseable dates as row-level errors.
  - [ ] 1.3 Create `app/services/csv_validator.ts` — accept `ParsedTransaction[]` + `userId`, check each row against: valid date parse, numeric amount, non-empty label. Check for duplicates by querying `Depense` table for matching `(userId, date, montant, libelle)` tuples. Return enriched array with `errors[]` and `isDuplicate: boolean` per row.
  - [ ] 1.4 Add unit tests for parser edge cases: empty file, missing columns, French decimal format (`42,50`), negative amounts, dates in correct/wrong format, duplicate detection.

- [ ] Task 2: Controller — preview endpoint (agent: backend)
  - [ ] 2.1 Add `GET /depenses/import` route (named `depenses.import`) in `start/routes.ts`, behind `auth` middleware.
  - [ ] 2.2 Add `showImport` method to `DepensesController` — render empty import preview page (initial state, no data yet).
  - [ ] 2.3 Add `POST /depenses/import/parse` route (named `depenses.import.parse`) behind `auth` middleware.
  - [ ] 2.4 Add `parseImport` method — accept multipart form upload, read CSV file from `request.file('csv')`, run through `csv_parser` + `csv_validator`, store parsed result in server-side session (`session.put('importData', ...)`), redirect to `depenses.import` with parsed data as Inertia props: `{ transactions: ParsedTransactionWithErrors[], categories: Categorie[], summary: { total, errors, duplicates } }`.

- [ ] Task 3: Controller — confirm/cancel endpoints (agent: backend)
  - [ ] 3.1 Add `POST /depenses/import/confirm` route (named `depenses.import.confirm`) behind `auth` middleware.
  - [ ] 3.2 Add `confirmImport` method — read `importData` from session, filter out rows with `errors.length > 0` (unless user opted to keep duplicates), batch-insert valid rows into `depenses` table using `Depense.createMany()`. Return JSON/Inertia response with `{ imported: number, skipped: number, errors: string[] }`.
  - [ ] 3.3 Add `POST /depenses/import/cancel` route (named `depenses.import.cancel`) behind `auth` middleware.
  - [ ] 3.4 Add `cancelImport` method — clear `importData` from session, redirect to `depenses` index with flash success message.

- [ ] Task 4: Import preview page — upload UI (agent: frontend)
  - [ ] 4.1 Create `inertia/pages/depenses/import.tsx` page component, receives props `{ transactions?, categories?, summary?, step: 'upload'|'preview' }`.
  - [ ] 4.2 Build upload step: file input (accept `.csv`), styled card with drag-drop hint, submit button. Use `<Form route="depenses.import.parse" encType="multipart/form-data">` with a hidden file input triggered by button click. Show loading state during parse.
  - [ ] 4.3 Wire upload page into Inertia page resolver and add "Importer CSV" button to `inertia/pages/depenses/index.tsx` top bar (next to "Ajouter" button), linking to `depenses.import`.

- [ ] Task 5: Import preview page — editable table (agent: frontend)
  - [ ] 5.1 Build preview table using shadcn `Table` components: columns for Date, Libellé, Montant, Catégorie, Statut (icon for errors/duplicates).
  - [ ] 5.2 Implement inline editing: on cell click (label, amount), swap display span with `<input>` or `<select>` (for category). On Enter or blur, update local state. Use `useState<ParsedTransactionWithErrors[]>` for the entire editable dataset. Use shadcn `Select` with hidden input pattern (consistent with existing `AddDepenseDialog`) for category dropdown.
  - [ ] 5.3 Implement error highlighting: rows with `errors.length > 0` get `bg-red-50 dark:bg-red-950/30` + red border. Show error message inline below the row or in a tooltip/badge.
  - [ ] 5.4 Implement duplicate warning: rows with `isDuplicate: true` get amber warning icon (Lucide `AlertTriangle`). Add a toggle/checkbox per row to skip or keep the duplicate.
  - [ ] 5.5 Summary bar at top: total rows, error count, duplicate count, valid count. Validate/Cancel buttons at bottom.

- [ ] Task 6: Confirm flow and feedback (agent: frontend)
  - [ ] 6.1 On "Valider" click, POST edited transaction array to `depenses.import.confirm`. Use `router.post()` from Inertia with the modified data as payload (not the original session data — send edited rows so server respects user edits).
  - [ ] 6.2 Handle response: on success, show toast with "X transactions importées, Y ignorées" via `sonner`, then `router.visit(route('depenses'))`.
  - [ ] 6.3 On "Annuler" click, POST to `depenses.import.cancel`, redirect to depenses index.
  - [ ] 6.4 Add confirmation dialog (reuse existing `DeleteDialog` pattern or shadcn `AlertDialog`) before confirm if there are skipped rows, showing count of what will be imported vs skipped.

- [ ] Task 7: VineJS validation + edge cases (agent: backend)
  - [ ] 7.1 Add `importConfirmValidator` in `app/validators/depense.ts` — validate the incoming array of edited transactions: each row must have `date` (string), `libelle` (string, non-empty), `montant` (number, min 0.01), `categorieId` (number, exists in categories), `type` (enum). Reject if > 500 rows (safety limit).
  - [ ] 7.2 Handle edge cases: empty CSV, CSV with no valid rows, file larger than bodyparser limit (20MB), non-CSV file type, session expired (importData missing).

## Dev Notes

**Crédit Agricole CSV format** (semicolon-separated, UTF-8):

```
"Date de l'opération";"Date de valeur";"Libellé";"Débit";"Crédit"
"24/07/2026";"24/07/2026";"CARTE X COMMERCE";"42,50";""
```

- Separator: `;` (not `,`)
- Amount split across two columns: `Débit` (expense, format `XX,XX`) and `Crédit` (income, format `XX,XX`). Only one is populated per row.
- French decimal format: comma as decimal separator — must convert to `.` before parsing to float.

**Amount computation logic:**

```
amount = Crédit is non-empty ? parseFloat(Crédit) : -parseFloat(Débit)
type = Crédit is non-empty ? 'entree' : 'sortie'
```

**Date conversion:** DD/MM/YYYY → ISO YYYY-MM-DD via `DateTime.fromFormat(dateStr, 'dd/MM/yyyy')`. Validate with `.isValid` — if false, add error to row.

**Session-based state pattern:** Store parsed/import data in AdonisJS session between parse and confirm steps. This avoids passing large arrays

## Dev Agent Record

### Agent Model Used

### Completion Notes

### Files Modified
