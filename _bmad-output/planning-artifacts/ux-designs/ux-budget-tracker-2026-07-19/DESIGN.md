---
name: Budget Tracker
type: design
status: final
created: 2026-07-19
updated: 2026-07-19
sources:
  - ../../prds/prd-budget-tracker-2026-07-19/prd.md
  - ../../../architecture/architecture-budget-tracker-2026-07-19/ARCHITECTURE-SPINE.md
companions: []
---

# Design — Budget Tracker

Hérite de **shadcn/ui** (Base UI runtime + Tailwind v4 + CSS variables). Les tokens ci-dessous documentent les valeurs actuelles du projet ; les tokens non listés héritent des défauts shadcn.

## Brand & Style

- Marque: Budget Tracker (nom fonctionnel, pas de logo)
- Ton: utilitaire, sobre, sans fioritures
- Police: Inter Variable (chargée via `@fontsource-variable/inter`)

## Colors

Dark mode activé par classe `.dark` sur `<html>`. Tous les tokens ont des paires light/dark. Les tokens `--chart-1` à `--chart-5` sont utilisés par Recharts.

| Token                          | Light (oklch)      | Dark (oklch)        |
| ------------------------------ | ------------------ | ------------------- |
| `--background`                 | 1 0 0              | 0.148 0.004 228.8   |
| `--foreground`                 | 0.148 0.004 228.8  | 0.987 0.002 197.1   |
| `--card`                       | 1 0 0              | 0.218 0.008 223.9   |
| `--card-foreground`            | 0.148 0.004 228.8  | 0.987 0.002 197.1   |
| `--popover`                    | 1 0 0              | 0.218 0.008 223.9   |
| `--popover-foreground`         | 0.148 0.004 228.8  | 0.987 0.002 197.1   |
| `--primary`                    | 0.218 0.008 223.9  | 0.925 0.005 214.3   |
| `--primary-foreground`         | 0.987 0.002 197.1  | 0.218 0.008 223.9   |
| `--secondary`                  | 0.963 0.002 197.1  | 0.275 0.011 216.9   |
| `--secondary-foreground`       | 0.218 0.008 223.9  | 0.987 0.002 197.1   |
| `--muted`                      | 0.963 0.002 197.1  | 0.275 0.011 216.9   |
| `--muted-foreground`           | 0.56 0.021 213.5   | 0.723 0.014 214.4   |
| `--accent`                     | 0.963 0.002 197.1  | 0.275 0.011 216.9   |
| `--accent-foreground`          | 0.218 0.008 223.9  | 0.987 0.002 197.1   |
| `--destructive`                | 0.577 0.245 27.325 | 0.704 0.191 22.216  |
| `--destructive-foreground`     | oklch(1 0 0)       | oklch(1 0 0)        |
| `--border`                     | 0.925 0.005 214.3  | 1 0 0 / 10%         |
| `--input`                      | 0.925 0.005 214.3  | 1 0 0 / 15%         |
| `--ring`                       | 0.723 0.014 214.4  | 0.56 0.021 213.5    |
| `--chart-1`                    | 0.872 0.007 219.6  | 0.872 0.007 219.6   |
| `--chart-2`                    | 0.56 0.021 213.5   | 0.56 0.021 213.5    |
| `--chart-3`                    | 0.45 0.017 213.2   | 0.45 0.017 213.2    |
| `--chart-4`                    | 0.378 0.015 216    | 0.378 0.015 216     |
| `--chart-5`                    | 0.275 0.011 216.9  | 0.275 0.011 216.9   |
| `--sidebar`                    | 0.987 0.002 197.1  | 0.218 0.008 223.9   |
| `--sidebar-foreground`         | 0.148 0.004 228.8  | 0.987 0.002 197.1   |
| `--sidebar-primary`            | 0.218 0.008 223.9  | 0.488 0.243 264.376 |
| `--sidebar-primary-foreground` | 0.987 0.002 197.1  | 0.987 0.002 197.1   |
| `--sidebar-accent`             | 0.963 0.002 197.1  | 0.275 0.011 216.9   |
| `--sidebar-accent-foreground`  | 0.218 0.008 223.9  | 0.987 0.002 197.1   |
| `--sidebar-border`             | 0.925 0.005 214.3  | 1 0 0 / 10%         |
| `--sidebar-ring`               | 0.723 0.014 214.4  | 0.56 0.021 213.5    |

Note: `--muted-foreground` en light mode (~3.4:1) ne passe pas WCAG AA pour du texte normal (<18px). Acceptable pour textes secondaires, placeholders, timestamps. À ne pas utiliser pour des labels interactifs.

## Typography

- Police système: Inter Variable (`--font-sans`)
- Headings: `--font-sans` (identique au corps)
- Tailles: définies par shadcn/ui (par défaut: `text-xs/relaxed` pour les labels, `text-sm` pour le corps)
- Hiérarchie headings: h1 (`text-xl`), h2 (`text-lg`), h3 (`text-base`), titres cartes (`text-sm font-semibold`)

## Layout & Spacing

- Layout public (home/login/signup): header fixe top bar, `pt-24` pour le main
- Layout authentifié: sidebar gauche (largeur shadcn standard ~16rem), contenu à droite
- Mixins: shadcn.card pour les cartes indicateurs, shadcn.dialog pour les popins d'ajout

## Elevation & Depth

- shadcn par défaut: pas d'ombres fortes, `border-border` pour les séparations
- Dialog: overlay semi-transparent, carte centrée avec `shadow-lg`

## Shapes

- `--radius`: 0.625rem (10px)
- `--radius-sm`: 0.375rem — inputs, petits composants
- `--radius-md`: 0.5rem
- `--radius-lg`: 0.625rem — cards, dialogs
- Arrondis homogènes sur tous les composants interactifs

## Components

Tous les composants suivent shadcn/ui/Base UI. Composants actuellement disponibles:

- Button (`variant`: default, outline, secondary, ghost, destructive, link)
- Input, Label, Field, Separator

Pour ce projet on ajoutera:

- **Card** — en-tête + contenu + pied. Cartes indicateurs dashboard, cartes récap
- **Dialog** — popins ajout/édition. Full-screen sur mobile. Focus trap (Base UI), auto-focus premier champ, retour focus sur le bouton déclencheur à la fermeture
- **Select** — filtres (mois, catégorie)
- **Table** — listes paginées (dépenses, crédits). Ligne cliquable
- **Toast** (Sonner) — notifications succès/erreur. `role="status"` + `aria-live="polite"` (Sonner gère nativement)
- **Skeleton** — écrans de chargement. `aria-busy="true"` sur le conteneur parent
- **LineChart** (Recharts) — graphique évolution patrimoine (Dashboard)
- **PieChart** / **BarChart** (Recharts) — camemberts et barres. Recharts >= 3.0 requis pour `accessibilityLayer={true}`
- **input type="file"** — upload CSV. Label accessible + format accepté dans le label

## Do's and Don'ts

- ✅ Utiliser les boutons variant `default` pour les CTA principaux, `outline` pour les secondaires
- ✅ Préférer la sidebar pour la navigation plutôt qu'un fil d'Ariane
- ❌ Pas d'icônes décoratives sans `aria-hidden="true"`
- ❌ Pas de couleurs custom hors palette CSS variables
- ✅ Icônes fonctionnelles (bouton icône seul) : toujours un `aria-label`
