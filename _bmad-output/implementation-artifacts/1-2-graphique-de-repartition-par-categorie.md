---
baseline_commit: NO_VCS
---

# Story 1.2 — Graphique de répartition par catégorie

**Epic:** Epic 1 — Budget et Catégories
**Story Key:** 1-2-graphique-de-repartition-par-categorie

## Story

As a utilisateur,
I want voir un camembert de répartition des dépenses par catégorie,
So that comprendre où va mon argent.

## Acceptance Criteria

- **Given** des dépenses existantes dans le mois en cours
  **When** l'utilisateur consulte la page Budget
  **Then** un camembert Recharts affiche chaque catégorie avec son icône et pourcentage
  **And** le total budgété vs le total réel est affiché

- **Given** l'utilisateur survole/clique une part du camembert
  **When** l'interaction est détectée
  **Then** le montant dépensé vs le montant budgété pour cette catégorie est affiché

- **Given** aucune dépense dans le mois
  **When** l'utilisateur consulte la page Budget
  **Then** le graphique est vide avec message d'état approprié

## Tasks

- [x] Create depenses migration + Depense model (needed for spending data)
- [x] Install recharts dependency
- [x] Update CategoriesController index to return aggregated category spending for current month
- [x] Create CategoryPieChart component with Recharts PieChart
- [x] Add pie chart to budget page above the category table
- [x] Add tooltip on hover showing spent vs budgeted per category
- [x] Handle empty state (no expenses this month)
- [x] Run build and verify

## Dev Notes

- Stack: AdonisJS 7 + Inertia + React 19 + Tailwind v4 + shadcn/ui + Recharts
- Depense relation: belongsTo Categorie (via categorie_id FK)
- Query: aggregate SUM of montant per category for current month where type = 'sortie'
- Recharts PieChart with Cell for each category color
- Custom tooltip showing dépensé vs budgété
- Use shadcn Card as container for the chart
- accessibilityLayer={true} for a11y (UX-DR10)
- Props: `categories` (existing) + `categorySpending` (new: [{categorieId, spent, budget, label, icon, color}])

## Dev Agent Record

### Implementation Plan

1. Create depenses migration + Depense model
2. Install recharts
3. Update CategoriesController index to aggregate spending
4. Create CategoryPieChart component
5. Update budget page
6. Build & verify

### Debug Log

### Completion Notes

- Story 1.2 fully implemented and build passes
- Created depenses table + Depense model with FK to categories
- CategoriesController index now returns `categorySpending` with aggregated spending per category for current month
- CategoryPieChart component using Recharts PieChart with donut style
- Custom tooltip shows dépensé vs budgété per category on hover
- Empty state handles no expenses this month gracefully
- Card header shows total budgété vs total réel
- accessibilityLayer enabled on PieChart

## File List

- `database/migrations/1768896000000_create_depenses_table.ts`
- `app/models/depense.ts`
- `app/controllers/categories_controller.ts`
- `inertia/pages/budget/index.tsx`
- `inertia/components/budget/category_pie_chart.tsx`

## Change Log

- 2026-07-21: Initial implementation of Story 1.2 — Category PieChart

## Status

done
