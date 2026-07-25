---
baseline_commit: NO_VCS
---

# Story 1.1 — Création et configuration des catégories

**Epic:** Epic 1 — Budget et Catégories
**Story Key:** 1-1-creation-et-configuration-des-categories

## Story

As a utilisateur,
I want créer, modifier et supprimer des catégories avec label, slug, icône Lucide et budget mensuel,
So that structurer mes finances par catégorie.

## Acceptance Criteria

- **Given** un utilisateur authentifié sur la page Budget
  **When** il clique "Ajouter catégorie"
  **Then** un Dialog shadcn s'ouvre avec les champs nom, icône Lucide (sélection visuelle), budget mensuel, couleur camembert
  **And** la soumission crée la catégorie et elle apparaît dans la liste

- **Given** la catégorie "Autre" n'existe pas
  **When** l'utilisateur accède à la page Budget pour la première fois
  **Then** la catégorie "Autre" est créée automatiquement avec slug "autre"

- **Given** une dépense importée avec slug de catégorie inconnu ou vide
  **When** l'import CSV est traité
  **Then** la dépense est affectée à la catégorie "Autre"

- **Given** un utilisateur modifie une catégorie existante
  **When** il change le budget mensuel
  **Then** le slug reste inchangé sauf modification explicite
  **And** le slug est unique

- **Given** un utilisateur supprime une catégorie
  **When** il confirme la suppression
  **Then** les dépenses liées sont réaffectées à "Autre"

## Tasks

- [x] Create migration `create_categories_table` with label, slug (unique), icon, budget (DECIMAL(10,2)), color, user_id
- [x] Create Categorie model with Lucid ORM
- [x] Create CategorieController with index, store, update, destroy
- [x] Create VineJS validator for categorie (create + update)
- [x] Add CRUD routes for categories under auth group
- [x] Create default "Autre" category on first budget page access (or via seeder)
- [x] Update budget/index.tsx with category list using shadcn Table
- [x] Create AddCategoryDialog with name, icon picker, budget, color fields
- [x] Create EditCategoryDialog with pre-filled values
- [x] Create DeleteCategoryDialog with confirmation
- [x] Handle empty state when no categories exist
- [x] Update sprint-status.yaml and verify build

## Dev Notes

- Stack: AdonisJS 7 + Inertia + React 19 + Tailwind v4 + shadcn/ui + Base UI + VineJS + Lucid ORM
- Model `Categorie`: label string, slug string (unique), icon string (Lucide icon name), budget decimal(10,2), color string (hex), belongsTo User
- Table name: `categories` (snake_case plural convention)
- Slug auto-generated from label via AdonisJS hook or beforeSave; user can modify
- Icon picker: display Lucide icons grid, searchable, selectable
- Color picker: HTML native `<input type="color">` or predefined palette
- "Autre" category created lazily on first budget page access if not exists
- On delete category, depense records re-assigned to "Autre" (slug lookup)
- Controller uses Inertia response with props: categories list
- uses Lucid ORM's `slugify` or custom beforeSave hook for slug
- Validation: label required, slug unique (ignore current on update), icon required, budget nullable decimal >= 0, color required hex

## Dev Agent Record

### Implementation Plan

1. Create migration for categories table
2. Create Categorie model with slug hook
3. Create CategorieController with CRUD
4. Create VineJS validators
5. Add routes
6. Update budget page with category management UI
7. Handle "Autre" auto-creation
8. Update sprint status

### Debug Log

### Completion Notes

- Story 1.1 fully implemented and build passes
- Categories CRUD working with Inertia forms
- Default "Autre" created lazily on first page load
- Slug auto-generated from label with uniqueness check
- Icon picker with 24 Lucide icons, searchable
- Budget formatting uses fr-FR locale / EUR currency
- Edit dialog pre-fills all fields, delete prevents removing "Autre"

## File List

- `database/migrations/1761885935169_create_categories_table.ts`
- `app/models/categorie.ts`
- `app/controllers/categories_controller.ts`
- `app/validators/categorie.ts`
- `start/routes.ts`
- `inertia/pages/budget/index.tsx`

## Change Log

- 2026-07-20: Initial implementation of Story 1.1 — Category management

## Status

done
