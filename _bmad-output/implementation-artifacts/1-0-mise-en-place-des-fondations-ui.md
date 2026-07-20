---
baseline_commit: d94e0decd1f857ff647e3e519d32c20369279580
---

# Story 1.0 — Mise en place des fondations UI

**Epic:** Epic 1 — Budget et Catégories
**Story Key:** 1-0-mise-en-place-des-fondations-ui

## Story

As a utilisateur,
I want que l'interface soit cohérente, accessible et responsive,
So that naviguer confortablement sur tous les écrans.

## Acceptance Criteria

- **Given** l'application est chargée (layout authentifié)
  **When** le rendu est effectué
  **Then** les tokens CSS oklch (light/dark) sont appliqués (UX-DR1)
  **And** Inter Variable est chargée via @fontsource-variable/inter (UX-DR2)
  **And** la typographie suit la hiérarchie : h1 text-xl, h2 text-lg, h3 text-base, titres cartes text-sm font-semibold

- **Given** un utilisateur sur une page authentifiée
  **When** la page s'affiche
  **Then** la sidebar gauche (shadcn width ~16rem) est présente avec icônes Lucide (aria-hidden) et labels (UX-DR3, UX-DR13)
  **And** le lien actif a aria-current="page"
  **And** un skip nav link "Aller au contenu principal" est le premier élément focusable (UX-DR12)

- **Given** un utilisateur sur mobile (<768px)
  **When** la sidebar est masquée
  **Then** un hamburger button avec aria-label="Ouvrir le menu", aria-expanded, aria-controls est affiché
  **And** le panneau latéral a aria-hidden quand fermé

- **Given** une page en chargement
  **When** les données ne sont pas encore disponibles
  **Then** des Skeleton shadcn sont affichés avec aria-busy="true" sur le conteneur (UX-DR9)

- **Given** un utilisateur avec prefers-reduced-motion
  **When** des animations sont présentes
  **Then** les animations sont désactivées (transitions sidebar, graphiques)

- **Given** le texte en --muted-foreground est utilisé
  **When** il s'agit d'un texte interactif (<18px)
  **Then** ce token n'est pas utilisé — réservé aux placeholders, timestamps, textes secondaires non interactifs (UX-DR22)

- **Given** un composant page_state global est défini
  **When** une page a besoin d'afficher un état loading, empty ou error
  **Then** page_state est utilisé avec les props loading, empty (titre + message + CTA), error (message + action), children
  **And** chaque page personnalise le texte du titre et message empty/error via les props
  **And** l'état loading utilise shadcn Skeleton avec aria-busy="true"
  **And** l'état error utilise un message avec variant destructive
  **And** l'état empty affiche un message centré avec un CTA

- **Given** le projet utilise shadcn/ui
  **When** un composant UI est nécessaire
  **Then** les composants shadcn existants (Card, Dialog, Select, Table, Skeleton, Toast/Sonner) sont prioritaires
  **And** shadcn CLI est utilisé pour tout composant manquant — pas de réimplémentation custom

## Tasks

- [x] Create story file
- [x] Create shadcn UI components: Skeleton, Card, Dialog, Select, Table
- [x] Create Sidebar component with responsive hamburger menu
- [x] Create page_state component with loading/empty/error/children states
- [x] Update default layout with sidebar, skip nav link, and authenticated layout
- [x] Update app.css with typography hierarchy base styles and prefers-reduced-motion
- [x] Add placeholder routes for main navigation sections
- [x] Update sprint-status.yaml and verify build

## Dev Notes

- Stack: AdonisJS 7 + Inertia + React 19 + Tailwind v4 + Base UI + shadcn/ui (base-mira style)
- Components use `data-slot` attributes following shadcn base-mira convention
- Base UI primitives already available: Button, Input, Label, Field, Separator
- Need to add: Skeleton, Card, Dialog, Select, Table
- Sidebar uses Lucide icons with aria-hidden for decorative icons
- Skip nav uses Tailwind sr-only/focus:not-sr-only pattern
- Mobile sidebar uses a sheet-style drawer with controlled state
- Auth state determined by `children.props.user` in layout
- prefers-reduced-motion via Tailwind `motion-reduce:*` utilities

## Dev Agent Record

### Implementation Plan

1. Create all shadcn UI components following existing patterns
2. Build Sidebar with navigation links + mobile hamburger
3. Build page_state with loading/empty/error states
4. Refactor default layout to support authenticated/public modes
5. Add typography base styles and reduced-motion
6. Define placeholder routes for all main sections
7. Update sprint status

### Debug Log

- Story created from epics.md specification
- All components follow base-mira shadcn style with data-slot pattern
- Dialog uses @base-ui/react/dialog
- Select uses @base-ui/react/select
- Card, Table, Skeleton use simple HTML elements with shadcn styling

### Completion Notes

- Created 5 shadcn UI components (Skeleton, Card, Dialog, Select, Table)
- Created Sidebar with 6 nav links, responsive hamburger, aria-current
- Created page_state with loading/empty/error/children variants
- Refactored default layout with skip nav, sidebar, proper html classes
- Added typography base styles + prefers-reduced-motion support
- Added 5 placeholder routes for main sections
- All components use data-slot pattern, Lucide icons with aria-hidden

## File List

- _bmad-output/implementation-artifacts/1-0-mise-en-place-des-fondations-ui.md (new)
- inertia/components/ui/skeleton.tsx (new)
- inertia/components/ui/card.tsx (new)
- inertia/components/ui/dialog.tsx (new)
- inertia/components/ui/select.tsx (new)
- inertia/components/ui/table.tsx (new)
- inertia/components/sidebar.tsx (new)
- inertia/components/page-state.tsx (new)
- inertia/layouts/default.tsx (modified)
- inertia/css/app.css (modified)
- start/routes.ts (modified)

## Change Log

- 2026-07-20: Initial implementation of Story 1.0 — UI foundations

## Status

done
