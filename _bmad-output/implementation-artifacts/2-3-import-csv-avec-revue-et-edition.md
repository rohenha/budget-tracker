---
baseline_commit: NO_VCS
---

# Story 2.3 — Import CSV avec revue et édition

**Epic:** Epic 2 — Gestion des Dépenses
**Story Key:** 2-3-import-csv-avec-revue-et-edition
**Status:** ready-for-dev

## Story

As a utilisateur,
I want importer un fichier CSV Crédit Agricole et pouvoir modifier les valeurs avant validation,
So that corriger les erreurs de parsing ou ajuster les catégories sans ressaisir.

## Acceptance Criteria

### AC1 — Déclenchement de l'import

- **Given** un utilisateur est sur la page Dépenses ou Dashboard
- **When** il clique "Importer CSV"
- **Then** un file picker s'ouvre avec label indiquant le format attendu (CSV Crédit Agricole, séparateur `;`)
- **And** le champ accepte uniquement les fichiers `.csv`

### AC2 — Upload et parsing serveur

- **Given** un fichier CSV sélectionné
- **When** le fichier est soumis au serveur
- **Then** le parsing est effectué côté serveur avec `csv-parse` (AD-2)
- **And** les colonnes attendues sont : `Date;Date valeur;Libellé;Débit euros;Crédit euros;Catégorie` (FR-7)
- **And** les dates au format DD/MM/YYYY sont converties en ISO YYYY-MM-DD via Luxon `DateTime.fromFormat`
- **And** les montants avec séparateur virgule (`42,50`) sont convertis en décimal (`42.50`)
- **And** une ligne avec `Débit` non vide → type `sortie`, une ligne avec `Crédit` non vide → type `entree`
- **And** le slug de catégorie est résolu : si absent ou inconnu → catégorie `Autre` (FR-1)
- **And** les lignes vides ou sans montant sont ignorées

### AC3 — Tableau de revue éditable

- **Given** le parsing est terminé sans erreur fatale
- **When** la page de revue s'affiche
- **Then** un tableau éditable présente les lignes parsées avec les colonnes : Date, Libellé, Montant, Type (+/-), Catégorie
- **And** chaque ligne a un select pour choisir/modifier la catégorie
- **And** chaque ligne a des champs éditables pour libellé et montant
- **And** le type (entree/sortie) est déterminé par le parsing et affiché via `TypeBadge`

### AC4 — Gestion des erreurs de parsing

- **Given** des lignes en erreur de parsing (date invalide, montant non numérique)
- **When** la revue s'affiche
- **Then** les lignes en erreur sont mises en évidence avec le détail du champ invalide (`role="alert"`)
- **And** les lignes en erreur ne peuvent pas être validées sans correction
- **And** un compteur d'erreurs est affiché dans le résumé en haut du tableau

### AC5 — Résumé de l'import

- **Given** la revue est affichée
- **When** le tableau est rendu
- **Then** un résumé en haut indique : nombre total de lignes, nombre de lignes valides, nombre d'erreurs
- **And** les boutons "Confirmer l'import" et "Annuler" sont présents en bas

### AC6 — Confirmation de l'import

- **Given** l'utilisateur a modifié des valeurs dans la revue
- **When** il clique "Confirmer l'import"
- **Then** les données modifiées sont envoyées au serveur pour validation finale (VineJS)
- **And** les lignes en erreur restent exclues de l'import
- **And** un Toast affiche "X lignes importées, Y erreurs"
- **And** la liste des dépenses se met à jour

### AC7 — Annulation

- **Given** l'utilisateur clique "Annuler"
- **When** la revue est affichée
- **Then** aucune donnée n'est importée
- **And** l'utilisateur retourne à la liste des dépenses

### AC8 — Fichier invalide ou vide

- **Given** un fichier CSV vide ou sans lignes valides est sélectionné
- **When** le parsing est traité
- **Then** un Toast d'erreur s'affiche "Fichier CSV vide ou format non reconnu"
- **And** aucune page de revue ne s'affiche

## Tasks / Subtasks

### Task 1: Service de parsing CSV (backend) — AC1, AC2

- [ ] 1.1 Installer `csv-parse` (`npm install csv-parse`) — library préconisée par l'architecture (AD-2)
- [ ] 1.2 Créer `app/services/csv_parser.ts` avec fonction `parseCreditAgricoleCsv(raw: string): ParsedTransaction[]`
  - Séparateur `;` (pas `,`)
  - Colonnes attendues : `Date;Date valeur;Libellé;Débit euros;Crédit euros;Catégorie`
  - Conversion DD/MM/YYYY → ISO via `DateTime.fromFormat(dateStr, 'dd/MM/yyyy')` + `.isValid`
  - Conversion montant virgule → point : `"42,50"` → `42.50`
  - Type : `Crédit` non vide → `entree`, `Débit` non vide → `sortie`
  - Slug catégorie : champ optionnel, passé tel quel
  - BOM UTF-8 strippé en amont
  - Lignes vides ignorées, whitespace trimé
- [ ] 1.3 Définir type `ParsedTransaction` :
  ```ts
  type ParsedTransaction = {
    rawDate: string
    date: string | null // ISO ou null si parsing échoue
    libelle: string
    montant: number
    type: 'entree' | 'sortie'
    categorieSlug: string | null
    description: string | null
    errors: string[] // erreurs spécifiques à cette ligne
    rowIndex: number // numéro de ligne originale (1-indexed)
  }
  ```
- [ ] 1.4 Créer `app/services/csv_validator.ts` avec `validateParsedTransactions(transactions: ParsedTransaction[], userId: number): ValidatedTransaction[]`
  - Vérifier : date non null, montant > 0, libellé non vide
  - Résoudre slug catégorie : `Categorie.query().where('slug', slug).where('userId', userId).first()` → si introuvable, catégorie "Autre" (slug: `autre`)
  - Si catégorie "Autre" n'existe pas pour l'utilisateur, la créer automatiquement (FR-1)
  - Retourner tableau enrichi avec `categorieId` résolu et `errors[]` mis à jour

### Task 2: Contrôleur import — upload + parsing (backend) — AC2, AC8

- [ ] 2.1 Créer `app/controllers/depenses_import_controller.ts`
  - Méthode `upload({ request, response, auth, session })` :
    - Accepter upload multipart, lire buffer du fichier
    - Parser via `parseCreditAgricoleCsv`
    - Si 0 transactions → flash error + redirect `/depenses` (AC8)
    - Sinon → stocker dans session : `session.put('importData', { transactions, fileName })`
    - Redirect vers `GET /depenses/import`
  - Méthode `review({ inertia, auth, session })` :
    - Lire `session.get('importData')`
    - Si absent → redirect `/depenses` avec flash error
    - Charger catégories utilisateur
    - Valider via `csv_validator`
    - Rendre `depenses/import` avec props `{ transactions, categories, fileName }`
  - Méthode `confirm({ request, response, auth, session, session: flashSession })` :
    - Lire transactions éditées depuis le body (pas depuis session — respecter les éditions client)
    - Valider via `importBatchValidator`
    - Créer `Depense.create()` dans une transaction DB
    - Flash succès "X dépenses importées"
    - Redirect `/depenses`
- [ ] 2.2 Ajouter routes dans `start/routes.ts` :
  ```ts
  // POST /depenses/import — upload CSV
  router.post('/', [controllers.DepensesImport, 'upload']).as('depenses.import')
  // GET /depenses/import — page de revue
  router.get('/', [controllers.DepensesImport, 'review']).as('depenses.import.review')
  // POST /depenses/import/validate — confirmer import
  router.post('/validate', [controllers.DepensesImport, 'confirm']).as('depenses.import.validate')
  ```
  Sous le group `/depenses` existant, avec middleware `auth`.

### Task 3: Validators (backend) — AC6

- [ ] 3.1 Ajouter `importUploadValidator` dans `app/validators/depense.ts` :
  ```ts
  export const importUploadValidator = vine.create({
    file: vine.file({
      size: '5mb',
      extnames: ['csv'],
    }),
  })
  ```
- [ ] 3.2 Ajouter `importBatchValidator` dans `app/validators/depense.ts` :
  ```ts
  export const importBatchValidator = vine.create({
    transactions: vine
      .array(
        vine.object({
          date: vine.string(),
          libelle: vine.string().trim().minLength(1).maxLength(255),
          montant: vine.number().min(0.01),
          type: vine.enum(['entree', 'sortie']),
          categorieId: vine.number().optional(),
          description: vine.string().trim().maxLength(1000).optional(),
        })
      )
      .maxLength(500),
  })
  ```

### Task 4: Composant ImportReviewTable (frontend) — AC3, AC4, AC5

- [ ] 4.1 Créer `inertia/components/depenses/import_review_table.tsx`
  - Props : `transactions: ParsedTransaction[]`, `categories: Categorie[]`, `onEdit: (index, field, value) => void`
  - Tableau shadcn `Table` avec colonnes : Date, Libellé, Montant, Type (+/-), Catégorie, Erreur
  - État local : `useState<ParsedTransaction[]>` pour les éditions
- [ ] 4.2 Cellules éditables inline (AC3) :
  - Click sur cellule → bascule `<span>` → `<Input>` / `<Select>`
  - State : `editingCell: { rowIndex: number; field: string } | null`
  - Blur ou Enter → commit modification dans le state, retour mode affichage
  - Category : `<Select>` même pattern que `AddDepenseDialog` (hidden input + Select)
- [ ] 4.3 Mise en évidence erreurs (AC4) :
  - Lignes avec `errors.length > 0` → `bg-red-50 dark:bg-red-950/30` + `border-destructive`
  - Message d'erreur inline sous la ligne avec `role="alert"`
- [ ] 4.4 Badge type `TypeBadge` existant dans `inertia/components/depenses/type_badge.tsx`
- [ ] 4.5 Résumé en haut : `total`, `valid`, `errors` counts

### Task 5: Page de revue import (frontend) — AC5, AC6, AC7

- [ ] 5.1 Créer `inertia/pages/depenses/import.tsx`
  - Props Inertia : `{ transactions, categories, fileName }`
  - Afficher : nom du fichier, résumé (total/valid/erreurs), tableau `ImportReviewTable`
  - Bouton "Confirmer l'import" et "Annuler"
- [ ] 5.2 Logique "Confirmer" (AC6) :
  - Filtrer lignes sans erreur
  - Si erreurs présentes → Dialog confirmation "X lignes contiennent des erreurs. Seules les Y lignes valides seront importées. Continuer ?"
  - POST via `router.post(route('depenses.import.validate'), { transactions })`
  - Toast succès "X dépenses importées, Y erreurs"
  - Redirect `/depenses`
- [ ] 5.3 Logique "Annuler" (AC7) :
  - `router.get(route('depenses'))` → retour liste, aucune donnée sauvegardée
- [ ] 5.4 Gestion erreurs Inertia — Si validation serveur échoue, afficher via Sonner toast (UX-DR8)

### Task 6: Bouton import sur page dépenses (frontend) — AC1

- [ ] 6.1 Dans `inertia/pages/depenses/index.tsx`, ajouter bouton "Importer CSV" avec icône `<Upload>` de lucide-react, à côté du bouton "Ajouter"
- [ ] 6.2 Clic → input file hidden (`accept=".csv"`), sur sélection → soumettre form multipart vers `POST /depenses/import`
- [ ] 6.3 Utiliser `<Form>` de `@adonisjs/inertia/react` avec `encType="multipart/form-data"` ou `<form>` natif avec Inertia `router.post` + `FormData`

### Task 7: Intégration Dashboard (future story 6.2) — hors périmètre cette story

- [ ] 7.1 La story 6.2 réutilisera le même flow depuis le Dashboard — simplement un bouton "Importer CSV" pointant vers la même route
- [ ] 7.2 **Hors scope de cette story** — voir story 6.2

## Dev Notes

### Intelligence de la story précédente (Story 2.2)

La story 2.2 a établi les patterns suivants qu'il faut **impérativement respecter** :

- **Composant `FormDialog`** (`inertia/components/shared/form_dialog.tsx`) : composant réutilisable avec `route` union type — **attention** : si on l'utilise pour l'upload, il faut étendre le type union. Préférer un `<form>` natif ou `router.post` avec `FormData` pour l'upload fichier (multipart)
- **Composant `DeleteDialog`** : pattern de confirmation existant
- **Modèle `Depense`** (`app/models/depense.ts`) : champs `userId`, `categorieId`, `libelle`, `montant`, `type` ('entree'|'sortie'), `description`, `date`
- **Modèle `Categorie`** (`app/models/categorie.ts`) : champs `label`, `slug`, `icon`, `budget`, `type`, `color`
- **Validateur VineJS** (`app/validators/depense.ts`) : patterns existants pour create/update
- **Contrôleur** (`app/controllers/depenses_controller.ts`) : pattern `auth.user!`, query builder Lucid, session flash, redirect
- **Page dépenses** (`inertia/pages/depenses/index.tsx`) : structure avec filtres, `PageState`, table shadcn, AddDepenseDialog

### Patterns de code à respecter

| Élément           | Pattern existant                                                     | Fichier                                      |
| ----------------- | -------------------------------------------------------------------- | -------------------------------------------- |
| Modèle Lucid      | `@column`, `@belongsTo`, `BaseModel`                                 | `app/models/*.ts`                            |
| Contrôleur        | `auth.user!`, `request.validateUsing()`, `session.flash()`           | `app/controllers/*.ts`                       |
| Route Inertia     | `router.get/post/patch/delete` dans `start/routes.ts`                | `start/routes.ts`                            |
| Composant UI      | shadcn/ui (`Table`, `Dialog`, `Input`, `Select`, `Button`)           | `inertia/components/ui/*`                    |
| Type Categorie    | `{ id, userId, label, slug, icon, budget, type, color }`             | `inertia/components/budget/constants.ts`     |
| Formatage montant | `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })` | `formatBudget()`                             |
| Badge type        | `TypeBadge` composant existant                                       | `inertia/components/depenses/type_badge.tsx` |

### Architecture technique

- **Stack** : AdonisJS 7.3.3 + React 19.2.6 + Inertia.js 4.2.0 + shadcn/ui + Tailwind 4.3.3
- **Parsing CSV** : `csv-parse` côté serveur uniquement (AD-2)
- **Validation** : VineJS 4.4.0 dans `app/validators/`
- **ORM** : Lucid ORM 22.4.2, MySQL 8+
- **Dates** : Luxon 3.7.2 (`DateTime`)
- **Toast** : Sonner 2.0.7 (`toast()` depuis `sonner`)
- **Pas de state global client** (AD-1) — données transitent par Inertia uniquement

### Format CSV Crédit Agricole (FR-7)

```
Date;Date valeur;Libellé;Débit euros;Crédit euros;Catégorie
15/01/2026;15/01/2026;Loyer Carrefour;1200,50;;logement
15/01/2026;15/01/2026;Salaire;;3500,00;salaire
16/01/2026;17/01/2026;Restaurant Le Bistrot;45,80;;alimentation
```

- Séparateur `;` (pas `,`)
- Montants : virgule décimale française → convertir en point
- Dates : DD/MM/YYYY → ISO
- Catégorie : slug optionnel (dernière colonne)
- Une seule colonne montant remplie par ligne (Débit OU Crédit)

### Fichiers à créer

| Fichier                                               | Description                             |
| ----------------------------------------------------- | --------------------------------------- |
| `app/services/csv_parser.ts`                          | Service de parsing CSV Crédit Agricole  |
| `app/services/csv_validator.ts`                       | Validation et résolution des catégories |
| `app/controllers/depenses_import_controller.ts`       | Upload, review, confirm                 |
| `inertia/pages/depenses/import.tsx`                   | Page de revue import                    |
| `inertia/components/depenses/import_review_table.tsx` | Tableau éditable de revue               |

### Fichiers à modifier

| Fichier                            | Modification                                                               |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `start/routes.ts`                  | Ajouter 3 routes sous `/depenses` (import, import.review, import.validate) |
| `app/validators/depense.ts`        | Ajouter `importUploadValidator` + `importBatchValidator`                   |
| `inertia/pages/depenses/index.tsx` | Ajouter bouton "Importer CSV" + input file                                 |

### Contraintes

- **Pas de migration** nécessaire — table `depenses` existante avec tous les champs requis
- **Pas de dépendance client** — parsing 100% serveur (AD-2)
- **Limite** : max 500 lignes par import (sécurité)
- **Taille max fichier** : 5MB

## Testing Requirements

- Unit tests pour `csv_parser.ts` : cas normaux, BOM UTF-8, montants virgule, dates invalides, lignes vides
- Unit tests pour `csv_validator.ts` : résolution catégories, fallback "Autre", doublons
- Test intégration : upload fichier → revue → confirmation → vérifier dépenses en base
- Test edge cases : fichier vide, format invalide, session expirée

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

- `app/services/csv_parser.ts`
- `app/services/csv_validator.ts`
- `app/controllers/depenses_import_controller.ts`
- `app/validators/depense.ts` (modifié)
- `start/routes.ts` (modifié)
- `inertia/pages/depenses/import.tsx`
- `inertia/components/depenses/import_review_table.tsx`
- `inertia/pages/depenses/index.tsx` (modifié)
