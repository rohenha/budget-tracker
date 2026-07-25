# Story 2.2: Import CSV avec revue et édition

## Status

ready-for-dev

## Story

As a budget tracker user, I want to import a CSV file and review/edit parsed values before validation, so that I can fix parsing errors or adjust categories without manual re-entry.

## Acceptance Criteria

1. Given the user is on the import page, when selecting a CSV file, then the file is parsed and a review table displays all detected rows with editable fields (date, description, amount, category).
2. Given parsed transactions are displayed, when the user edits a field value in any row, then the change is reflected immediately in the review table.
3. Given the user is reviewing imported transactions, when clicking "Validate", then all transactions are saved to the database and the user is redirected to the transaction list.
4. Given the user is reviewing imported transactions, when clicking "Cancel", then no transactions are saved and the user returns to the import page.
5. Given a row has a parsing error or invalid value, when the review table renders, then the problematic row is visually flagged and the specific error is shown.
6. Given the user is reviewing transactions, when toggling a row's checkbox off, then that row is excluded from validation upon confirmation.
7. Given the file contains duplicate transactions already present in the database, when the review table renders, then duplicate rows are flagged and the user can choose to skip them.
8. Given the import format does not match expected Crédit Agricole CSV structure, when the file is uploaded, then a clear error message is displayed and no data is shown.

## Out of Scope

- Import formats other than Crédit Agricole CSV
- Automatic category assignment via ML or rules engine
- Bulk editing across multiple rows (only single-row edit)
- Import history or re-import of previous files
- Bank account connection or automatic import

## Tasks / Subtasks

- [ ] Task 1: Backend — Crédit Agricole CSV parser service (agent: backend)
  - [ ] Subtask 1.1: Create `app/services/csv_parser.ts` — parse semicolon-delimited Crédit Agricole CSV (skip header metadata lines before `"Date";"Libellé";` header row, handle French decimal format with `,`, map `Débit`/`Crédit` columns to positive/negative `montant`, parse `DD/MM/YYYY` dates to ISO)
  - [ ] Subtask 1.2: Define `ParsedRow` type `{ rawIndex, date, libelle, montant, description, type, errors[] }` returned by parser
  - [ ] Subtask 1.3: Add format validation — reject file if expected header (`Date`, `Libellé`, `Débit` or `Crédit`) not found after scanning first 10 lines; throw descriptive error with "Format non reconnu"

- [ ] Task 2: Backend — Import controller + duplicate detection (agent: backend)
  - [ ] Subtask 2.1: Create `app/controllers/imports_controller.ts` with `upload` action — accept multipart file via `request.file()`, call CSV parser, for each valid row query `Depense` for duplicates (`userId` + `date` + `montant` + `libelle` match within same day), return Inertia render of `depenses/import` with `{ rows: ParsedRow[], categories, duplicates: number[] }`
  - [ ] Subtask 2.2: Add `validate` action — receive array of edited rows (only checked/selected), VineJS-validate each (date ISO string, libelle non-empty, montant number > 0, categorieId exists for user), batch-create `Depense` records in a transaction, redirect to `depenses` index with flash success
  - [ ] Subtask 2.3: Add VineJS validator `#validators/import.ts` for both upload (file presence, mime type) and validate (row schema array)

- [ ] Task 3: Backend — Routes + navigation (agent: backend)
  - [ ] Subtask 3.1: Add routes under auth group in `start/routes.ts`: `GET /depenses/import` → `ImportsController.form`, `POST /depenses/import` → `ImportsController.upload`, `POST /depenses/import/validate` → `ImportsController.validate`
  - [ ] Subtask 3.2: Add "Importer CSV" button/link to depenses index page header (next to "Ajouter") linking to `/depenses/import`

- [ ] Task 4: Frontend — Import upload page (agent: frontend)
  - [ ] Subtask 4.1: Create `inertia/pages/depenses/import.tsx` — file input accepting `.csv`, submit via Inertia `router.post` with `useForm` and `FormData`, show upload state with loading spinner
  - [ ] Subtask 4.2: Handle format error response — display clear error message via `sonner` toast and stay on upload page

- [ ] Task 5: Frontend — Review table with inline editing (agent: frontend)
  - [ ] Subtask 5.1: Build `inertia/components/depenses/import_review_table.tsx` — editable table with columns: checkbox, date (input type=date), libellé (input text), montant (input number), catégorie (Select from user's categories), description (input text), status/error column
  - [ ] Subtask 5.2: Row-level state management — local `useState<ParsedRow[]>` with `handleFieldChange(rowIndex, field, value)` that updates immediately; rows flagged with errors get red background + error text below field; duplicate rows get yellow/amber background + "Doublon détecté" badge
  - [ ] Subtask 5.3: Checkbox toggle per row — checked by default, unchecking marks row as excluded; "Select all" checkbox in header; show count of selected/total above table

- [ ] Task 6: Frontend — Validate + Cancel actions (agent: frontend)
  - [ ] Subtask 6.1: "Valider" button — collect only checked rows, POST to `/depenses/import/validate` via Inertia `router.post`, disable button during submission, show loading state
  - [ ] Subtask 6.2: "Annuler" button — simple `router.get('/depenses')` redirect, no data saved
  - [ ] Subtask 6.3: Show summary bar above table: "X transactions à importer / Y exclues / Z doublons"

- [ ] Task 7: Backend — Unit tests for CSV parser (agent: backend)
  - [ ] Subtask 7.1: Create `tests/unit/csv_parser.spec.ts` — test valid Crédit Agricole CSV parsing (semicolon, french decimals, debit/credit mapping), test header detection, test invalid format rejection, test edge cases (empty file, rows with missing columns)

- [ ] Task 8: Backend — Functional tests for import flow (agent: backend)
  - [ ] Subtask 8.1: Create `tests/functional/import.spec.ts` — test upload returns parsed rows, test validate creates depenses with correct fields, test duplicate flagging, test format error for bad file, test validation rejects invalid row data

## Dev Notes

**Architecture decision — Two-step server-side flow:**
CSV parsing happens server-side (not in browser) for three reasons: (1) duplicate detection requires DB queries, (2) Crédit Agricole format quirks are easier to handle in TS with full test control, (3) prevents sending raw bank data to client. The flow is: `POST upload → render review page → POST validate → redirect to list`.

**Crédit Agricole CSV format specifics:**
Typical structure: first 4-6 lines are metadata (RIB info, account number, etc.) starting with non-`Date` tokens. Actual header row is `"Date";"Libellé";"Débit";"Crédit"` or `"Date";"Libellé";"Montant"`. Amounts use French locale: `1234,56`. Some exports use `"Numéro de compte"` columns — skip them. Dates are `DD/MM/YYYY`. The parser must be resilient to varying header positions (scan first 10 lines for the actual column header).

**Depense model mapping:**

- `libelle` ← `Libellé` column
- `montant` ← absolute value of (`Débit` or `Crédit`, whichever is non-zero)
- `type` ← `'sortie'` if `Débit` column has value, `'entree'` if `Crédit` has value
- `date` ← parsed from `DD/MM/YYYY` to `DateTime`
- `description` ← empty string or an extra "Cinq emojis" column if present
- `categorieId` ← user selects during review (null by default from import)
- `userId` ← from `auth.user!`

**Existing patterns to reuse:**

- Follow `DepensesController` pattern: auth-guarded, uses `inertia.render()`, session flash for success messages
- Use `FormDialog` pattern from `add_depense_dialog.tsx` for reference on field/error layout with `Field`, `FieldLabel`, `FieldContent`, `FieldError`
- Use shadcn `Table` components already in `~/components/ui/table`
- Use `Select` component for category picker (same pattern as `AddDepenseDialog`)
- VineJS validation pattern from `#validators/depense`

**Database concern — batch insert:**
Use `Depense.createMany()` inside a Lucid database transaction for the validate action. Wrap in `DB.transaction()` to ensure atomicity — if any row fails validation, none are inserted.

**Frontend state approach:**
Keep parsed rows as local component state in `import.tsx`. No server round-trip for edits — all edits are client-side until "Valider" is clicked. Use `useState<ParsedRow[]>` with immutable update functions. This avoids complexity of state management libraries for what is a single-page workflow.

**File upload handling:**
Use AdonisJS `request.file()` with `tmpPath` option for multipart upload. Validate mime type is `text/csv` or `application/vnd.ms-excel`. Set reasonable file size limit (1MB). Clean up temp file after parsing.

**Navigation integration:**
Add the import link to the depenses index header area. Consider also adding it to the sidebar if it becomes a frequent action, but for now keep it scoped to the depenses page.

## Dev Agent Record

### Agent Model Used

### Completion Notes

### Files Modified
