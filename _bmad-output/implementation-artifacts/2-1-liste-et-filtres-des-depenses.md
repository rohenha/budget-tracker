---
baseline_commit: NO_VCS
---

# Story 2.1 — Liste et filtres des dépenses

**Epic:** Epic 2 — Gestion des Dépenses
**Story Key:** 2-1-liste-et-filtres-des-depenses

## Story

As a utilisateur,
I want voir mes dépenses dans une liste paginée avec filtres par durée,
So that suivre mes dépenses du mois.

## Acceptance Criteria

- **Given** un utilisateur authentifié sur la page Dépenses
  **When** la page se charge
  **Then** une Table shadcn paginée affiche les colonnes : date, libellé, montant formaté EUR, catégorie, type (+/-), description
  **And** le tri est par date décroissante par défaut

- **Given** un filtre par durée (Select)
  **When** l'utilisateur sélectionne journalier, hebdomadaire, mensuel ou personnalisé
  **Then** la liste et les totaux sont mis à jour selon la période

- **Given** aucun résultat pour la période
  **When** la liste est vide
  **Then** un message d'état vide "Aucune dépense pour cette période" est affiché

## Tasks

- [x] Create DepensesController with index action (paginated, filterable by date range)
- [x] Create VineJS validator for depense
- [x] Add depenses CRUD routes
- [x] Implement depenses index page with shadcn Table
- [x] Add date range filter (Select: journalier/hebdomadaire/mensuel/personnalisé)
- [x] Add type badge (entree/sortie) with +/- indicator
- [x] Handle empty state
- [x] Run build and verify

## Dev Notes

- Stack: AdonisJS 7 + Inertia + React 19 + Tailwind v4 + shadcn/ui
- DepensesController index: paginated (20 per page), filterable by date range, ordered by date DESC
- Date filter: Select component with options (Aujourd'hui, 7 jours, 30 jours, Personnalisé)
- Custom date range: DatePicker or two date inputs when "Personnalisé" selected
- Table columns: date (DD/MM/YYYY), libellé, montant (EUR formated), catégorie (icon + label), type (+/- badge), description
- Type "sortie" = rouge, "entree" = vert
- Montant négatif for sortie, positif for entree
- Empty state: PageEmpty with "Aucune dépense pour cette période"
- Props: depenses (paginated data), categories (for display), filters (current filter state)

## Dev Agent Record

### Implementation Plan

1. Create DepensesController with index
2. Create VineJS validator
3. Update routes
4. Build depenses index page with Table, filters, badges
5. Build & verify

### Debug Log

### Completion Notes

## File List

- `app/controllers/depenses_controller.ts`
- `app/validators/depense.ts`
- `start/routes.ts`
- `inertia/pages/depenses/index.tsx`
- `inertia/components/depenses/type_badge.tsx`

## Change Log

- 2026-07-21: Initial implementation of Story 2.1 — Dépenses listing with filters

## Status

done
