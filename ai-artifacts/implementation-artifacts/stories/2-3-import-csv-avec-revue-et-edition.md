# Story 2.3: Import CSV avec revue et édition

## Status

review

## Story

As a budget tracker user, I want to import a Crédit Agricole CSV file and review/edit parsed transactions before validating, so that I can fix parsing errors and adjust categories without manual re-entry.

## Acceptance Criteria

1. Given I am on the transactions page, when I click the import CSV button and select a valid Crédit Agricole CSV file, then a review table displays all parsed transactions with editable fields for date, description, amount, and category.
2. Given the CSV import review table is displayed, when I click on any cell (date, description, amount, or category), then the cell becomes editable inline without opening a modal.
3. Given I have edited one or more transaction fields in the review table, when I click the "Validate" button, then only the edited and confirmed transactions are saved to the database and the review view closes.
4. Given I have edited one or more transaction fields in the review table, when I click "Cancel", then no transactions are saved and I return to the transactions list.
5. Given the CSV contains a date format that fails parsing, when the review table loads, then the affected row highlights the date cell in error state and displays a message indicating the parse failure.
6. Given the CSV contains an amount with comma decimal separator (e.g. "15,50"), when the review table loads, then amounts are correctly parsed and displayed in the standard numeric format.
7. Given I click "Validate" with one or more rows still showing a validation error, when the action triggers, then a warning indicates the number of rows with errors and asks for confirmation before saving only the valid rows.
8. Given the CSV file is empty or contains no valid transaction rows, when I select the file, then an error message is displayed and no review table is shown.

Now I have full context of the codebase. Let me produce the task breakdown.

---

## Tasks / Subtasks

- [x] Task 1: Install CSV parsing dependency and scaffold parser service (agent: backend)
  - [x] Subtask 1.1: Install `csv-parse` npm package
  - [x] Subtask 1.2: Create `app/services/csv_parser.ts` with a `parseCreditAgricoleCsv(raw: string): ParsedTransaction[]` function that handles semicolon separator, comma-to-dot decimal conversion (`"15,50"` → `15.50`), DD/MM/YYYY date normalization to ISO, and debit/credit column mapping (Débit → `type: 'sortie'`, Crédit → `type: 'entree'`)
  - [x] Subtask 1.3: Define `ParsedTransaction` type: `{ rawDate: string, date: string | null, libelle: string, montant: number, type: 'entree' | 'sortie', description: string | null, dateError?: string }` — `date` is null and `dateError` set when DD/MM/YYYY parsing fails
  - [x] Subtask 1.4: Handle edge cases — UTF-8 BOM stripping, empty rows skipped, rows with no debit/credit value mapped to 0 then flagged, leading/trailing whitespace trimmed from all fields

- [x] Task 2: Add import upload endpoint (agent: backend)
  - [x] Subtask 2.1: Create `app/controllers/depenses_import_controller.ts` with an `upload` method — accepts `multipart/form-data` with a `file` field, reads buffer, calls `parseCreditAgricoleCsv`, stores result in `session.flash('importData', { transactions, fileName, errorCount })`, redirects to `GET /depenses/import`
  - [x] Subtask 2.2: Create VineJS validator `importUploadValidator` in `app/validators/depense.ts` — validates file presence and MIME type (`text/csv`, `application/csv`, `text/plain`), max file size ~5MB
  - [x] Subtask 2.3: Handle empty/invalid file — if parser returns zero transactions, flash an error message (`'Le fichier CSV est vide ou ne contient aucune transaction valide'`) and redirect back to `/depenses` (AC8)
  - [x] Subtask 2.4: Route `POST /depenses/import` → `DepensesImportController.upload` inside the authenticated group in `start/routes.ts`

- [x] Task 3: Add import review page route and controller (agent: backend)
  - [x] Subtask 3.1: Add `review` method to `DepensesImportController` — reads `session.flash('importData')`, loads user categories, renders Inertia page `depenses/import` with props `{ transactions, categories, fileName, errorCount }`
  - [x] Subtask 3.2: Route `GET /depenses/import` → `DepensesImportController.review` in `start/routes.ts`, named `depenses.import`
  - [x] Subtask 3.3: Guard — if no importData in session, redirect to `/depenses` with flash error

- [x] Task 4: Add batch store endpoint for validated transactions (agent: backend)
  - [x] Subtask 4.1: Create `storeBatch` method in `DepensesController` — accepts JSON body `{ transactions: [...] }` via `POST /depenses/import/validate`, validates each row against a new `importBatchValidator`, bulk-creates `Depense` records in a transaction
  - [x] Subtask 4.2: Create VineJS `importBatchValidator` in `app/validators/depense.ts` — validates array of objects with `date` (string, valid ISO), `libelle` (string, required), `montant` (number, min 0.01), `type` (enum entree/sortie), optional `categorieId` (must exist in user's categories), optional `description`
  - [x] Subtask 4.3: Each `Depense` created with `userId` from `auth.user!.id`; if `categorieId` provided, verify it belongs to the authenticated user before linking; derive `type` from category's type if `categorieId` set, otherwise use the `type` from parsed data
  - [x] Subtask 4.4: Flash success with count (`'X dépenses importées'`), redirect to `/depenses`
  - [x] Subtask 4.5: Route `POST /depenses/import/validate` → `DepensesController.storeBatch` in `start/routes.ts`, named `depenses.import.validate`

- [x] Task 5: Build the ImportReviewTable component (agent: frontend)
  - [x] Subtask 5.1: Create `inertia/components/depenses/import_review_table.tsx` — receives `transactions: ParsedTransaction[]`, `categories: Categorie[]`, exposes edited transactions via a callback or state lift
  - [x] Subtask 5.2: Inline editable cells — clicking a cell (date, libellé, montant, description) switches from display to `<Input>` / `<Select>` in-place (AC2). Use controlled local state `useState<EditableTransaction[]>` for all rows. Category uses `<Select>` with the same pattern as `AddDepenseDialog`
  - [x] Subtask 5.3: Amount column — display in `fr-FR` currency format via `formatBudget()`, edit mode shows raw number input with `step="0.01"` (AC6 handles comma parsing upstream; display is already standard)
  - [x] Subtask 5.4: Error state highlighting — rows with `dateError` show the date cell with `border-destructive` + `bg-destructive/10` styling and a tooltip/popover with the error message (AC5)
  - [x] Subtask 5.5: Visual indicator for edited rows — track which rows/cells have been modified vs original, show a subtle dot/badge on changed rows

- [x] Task 6: Build the import review Inertia page (agent: frontend)
  - [x] Subtask 6.1: Create `inertia/pages/depenses/import.tsx` — renders page header with file name, summary counts (total, valid, errors), the `ImportReviewTable`, and action buttons (Valider / Annuler)
  - [x] Subtask 6.2: "Valider" button logic (AC3, AC7) — on click, filter out rows with errors, if error count > 0 show a `Dialog` warning: `"X lignes contiennent des erreurs. Seules les Y lignes valides seront enregistrées. Continuer ?"` with Confirm/Cancel. On confirm (or if no errors), POST valid transactions via `router.post('/depenses/import/validate', { transactions })` using Inertia router
  - [x] Subtask 6.3: "Annuler" button (AC4) — `router.get('/depenses')` returns to list, no save
  - [x] Subtask 6.4: Handle Inertia errors — if server validation fails on batch, display flash error via Sonner toast

- [x] Task 7: Add import button to depenses page (agent: frontend)
  - [x] Subtask 7.1: In `inertia/pages/depenses/index.tsx`, add an "Importer CSV" button next to the existing "Ajouter" button, using `<Upload>` icon from lucide-react
  - [x] Subtask 7.2: Click opens a file input (hidden `<input type="file" accept=".csv">`), on file select submits a `<Form>` with `encType="multipart/form-data"` to `POST /depenses/import` using `@adonisjs/inertia/react` `<Form>` component — this triggers server parse and redirect to review page
  - [x] Subtask 7.3: Add route name `depenses.import` to the `FormDialog` route union type in `form_dialog.tsx` if needed, or use a plain `<form>` element with `action` attribute for the upload (since it's a file upload, Inertia's `<Form>` may need `useForm` with manual submit)

## Dev Notes

**Architecture decision — Server-side CSV parsing:**
The CSV is parsed entirely on the server. The upload sends raw file → controller parses → flash stores result → redirect to review page with parsed data as Inertia props. This keeps the parser testable, avoids shipping `csv-parse` to the client bundle, and matches the project's server-driven Inertia pattern. Inline editing during review is the only client-side state.

**Crédit Agricole CSV format reference:**
Typical columns: `"Date d'opération";"Date de valeur";"Libellé";"Débit";"Crédit";"Solde"`. Semicolon-separated, comma as decimal separator, dates as DD/MM/YYYY. Some exports include a UTF-8 BOM. The parser must handle all these variants.

**Batch insert strategy:**
Use AdonisJS Lucid's transaction support: `await Database.transaction(async (trx) => { ... })` with `Depense.create()` calls inside. This ensures all-or-nothing semantics. If any row fails VineJS validation, the entire batch is rejected and the controller returns errors to the client.

**Category resolution:**
During review, the user can assign a category to each row. The category `<Select>` uses the same `categories` prop passed from the controller. On batch save, if `categorieId` is set, the `type` (entree/sortie) is derived from `categorie.type` — matching the existing `store` behavior in `DepensesController`. If no category, the parsed `type` from the CSV is used.

**Inline editing approach:**
No library needed. Each cell toggles between display `<span>` and `<Input>`/`<Select>` based on a local `editingCell` state (`{ rowIndex: number, field: string } | null`). On blur or Enter key, the edit is committed to the `transactions` array state and the cell returns to display mode. This is lightweight and consistent with the project's minimal client-side state philosophy.

**Key files to create:**

- `app/services/csv_parser.ts` — CSV parsing logic
- `app/controllers/depenses_import_controller.ts` — upload + review endpoints
- `inertia/pages/depenses/import.tsx` — review page
- `inertia/components/depenses/import_review_table.tsx` — editable table component

**Key files to modify:**

- `start/routes.ts` — add 3 new routes under `/depenses` prefix
- `app/validators/depense.ts` — add `importUploadValidator` and `importBatchValidator`
- `app/controllers/depenses_controller.ts` — add `storeBatch` method
- `inertia/pages/depenses/index.tsx` — add import button + file input
- `inertia/components/shared/form_dialog.tsx` — extend route union type if using FormDialog for upload

**No new database migrations needed** — the `depenses` table schema already has all required fields. The import just batch-creates rows using the existing model.

**Dependencies to install:**

- `csv-parse` — battle-tested Node CSV parser, supports semicolons, custom delimiters, stream and sync modes

## Dev Agent Record

### Agent Model Used
nemotron-3-ultra-free (opencode)

### Completion Notes
All tasks completed. The CSV import feature with review and editing is fully implemented:
- Backend: CSV parser service (csv-parse), upload endpoint, review endpoint, batch validation endpoint with database transactions
- Frontend: ImportReviewTable with inline editing, review page with validation dialog, import button on depenses page
- All 8 acceptance criteria satisfied

### Files Modified
- app/services/csv_parser.ts (created)
- app/controllers/depenses_import_controller.ts (created)
- app/controllers/depenses_controller.ts (added storeBatch method)
- app/validators/depense.ts (added importUploadValidator and importBatchValidator)
- start/routes.ts (added 3 new routes)
- inertia/components/depenses/import_review_table.tsx (created)
- inertia/pages/depenses/import.tsx (created)
- inertia/pages/depenses/index.tsx (added import button)
- inertia/components/shared/form_dialog.tsx (added depenses.import.upload route)
