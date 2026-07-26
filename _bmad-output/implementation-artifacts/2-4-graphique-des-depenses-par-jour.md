---
baseline_commit: c95364e1ccdd289eb0d040311512713292f06036
---

# Story 2.4 — Graphique des dépenses par jour

Status: review

## Story

As a utilisateur,
I want voir un graphique barres du total dépensé par jour pour la période courante,
so that visualiser ma consommation quotidienne et repérer les pics de dépenses.

## Acceptance Criteria

### AC1 — BarChart des dépenses par jour

- **Given** des dépenses de type `sortie` existent dans la période filtrée (today/week/month/custom)
- **When** la page Dépenses se charge
- **Then** un BarChart Recharts est affiché au-dessus de la table des dépenses
- **And** chaque barre représente un jour avec le total dépensé (montant) sur l'axe Y
- **And** l'axe X affiche les dates formatées `dd/MM`
- **And** le graphique est responsive (redimensionnement avec la fenêtre)

### AC2 — Ligne de référence moyenne mensuelle

- **Given** le BarChart est affiché
- **When** les données sont chargées
- **Then** une `ReferenceLine` Recharts affiche la moyenne des dépenses par jour sur la période
- **And** la ligne est visuellement distinctive (couleur `--destructive` ou `--muted-foreground`, dash `3 3`)
- **And** un label "Moyenne : XX €" est affiché sur la ligne

### AC3 — Tooltip interactif

- **Given** l'utilisateur survole une barre
- **When** le tooltip s'affiche
- **Then** le tooltip indique la date au format `dddd dd MMMM` et le montant formaté en EUR
- **And** le tooltip suit le style shadcn (bg-popover, border, rounded-lg)

### AC4 — Filtres synchronisés

- **Given** l'utilisateur change de période (today/week/month/custom) ou de catégorie
- **When** la page se recharge (Inertia)
- **Then** le graphique se met à jour avec les données de la nouvelle période
- **And** les barres reflètent uniquement les dépenses filtrées

### AC5 — État vide

- **Given** aucune dépense de type `sortie` dans la période
- **When** la page se charge
- **Then** le composant graphique affiche un message "Aucune dépense pour cette période"
- **And** la carte (Card) est rendue sans graphique, uniquement le titre et le message

### AC6 — Accessibilité (UX-DR10, UX-DR16)

- **Given** le BarChart est rendu
- **When** Recharts génère le SVG
- **Then** `accessibilityLayer={true}` est passé au BarChart
- **And** le conteneur du graphique a `role="img"` avec `aria-label` décrivant le graphique
- **And** la navigation clavier est possible sur les barres

### AC7 — Mobile responsive (UX-DR17)

- **Given** l'écran est < 768px
- **When** le graphique s'affiche
- **Then** les labels de l'axe X sont espacés pour éviter le chevauchement (intervalle automatique ou rotation)
- **And** la hauteur du graphique s'adapte (h-64 ou moins)

## Tasks / Subtasks

### Task 1: Aggrégation quotidienne côté serveur (backend) — AC4

- [x] 1.1 Ajouter une méthode `async getDailyChartData(startDate: string, endDate: string, userId: number, categorieId?: number | null)` dans `DepensesController` ou créer un service dédié
  - Requête : `Depense.query().where('userId', userId).where('type', 'sortie').whereBetween('date', [startDate, endDate]).select('date').groupBy('date').count('* as count').sum('montant as total').orderBy('date', 'asc')`
  - Si `categorieId` est fourni, filtrer par `categorieId`
  - Retourner `Array<{ date: string, total: number, count: number }>`
- [x] 1.2 Modifier `DepensesController.index()` pour calculer `dailyChartData` avec les mêmes `startDate`/`endDate` que la requête principale
  - Calculer la moyenne : `total / nombre_de_jours` ou `sum(total) / data.length`
  - Ajouter `dailyChartData` et `dailyAverage` aux props Inertia
  - Passer les données sérialisées au format `{ date: string, total: number }[]`

### Task 2: Composant DailyExpensesChart (frontend) — AC1, AC2, AC3, AC5, AC6

- [x] 2.1 Créer `inertia/components/depenses/daily_expenses_chart.tsx`
  - Props : `data: Array<{ date: string, total: number }>`, `average: number`
  - Wrapper shadcn `Card` avec `CardHeader` (titre "Dépenses par jour") et `CardContent`
  - Utiliser `ResponsiveContainer` avec hauteur `h-72` (desktop) → `h-64` (mobile via Tailwind responsive)
- [x] 2.2 Implémenter le BarChart Recharts :
  - `BarChart` avec `accessibilityLayer={true}`
  - `Bar` avec `dataKey="total"`, `fill="hsl(var(--chart-1))"`, `radius={[4, 4, 0, 0]}`
  - `XAxis` avec `dataKey="date"`, tick formatter `(d) => DateTime.fromISO(d).toFormat('dd/MM')`
  - `YAxis` avec tick formatter `(v) => formatBudget(v)`
  - `CartesianGrid` avec `strokeDasharray="3 3"` et `stroke="hsl(var(--border))"`
  - `Tooltip` custom suivant le même pattern que `CategoryPieChart.CustomTooltip` (bg-popover, border, rounded-lg, shadow-md) :
    - Date formatée longue : `DateTime.fromISO(date).toFormat('dddd dd MMMM')`
    - Montant : `formatBudget(total)`
- [x] 2.3 Ajouter `ReferenceLine` pour la moyenne (AC2) :
  - `y={average}`, `stroke="hsl(var(--destructive))"`, `strokeDasharray="3 3"`
  - `label` avec position `insideTopRight` ou `top` : valeur formatée "Moyenne : XX €"
- [x] 2.4 Implémenter l'état vide (AC5) :
  - Si `data.length === 0`, ne pas rendre le graphique, afficher un message centré "Aucune dépense pour cette période" dans le CardContent
- [x] 2.5 Ajouter `role="img"` et `aria-label` sur le conteneur (AC6) :
  - `aria-label="Graphique des dépenses par jour de la période"`

### Task 3: Intégration dans la page Dépenses — AC1, AC4

- [x] 3.1 Modifier `inertia/pages/depenses/index.tsx` :
  - Ajouter `dailyChartData` et `dailyAverage` aux types des props Inertia
  - Importer `DailyExpensesChart`
  - Rendre le composant avant `DepensesFilters` (ou entre filters et DataTable)
  - Placer dans une section responsive (full width)
- [x] 3.2 Vérifier que le chargement initial et les changements de filtre mettent bien à jour les props

### Task 4: Tests

- [x] 4.1 Test unitaire : la requête d'agrégation retourne les bonnes données groupées par jour
- [x] 4.2 Test unitaire : moyenne calculée correctement (total / nb jours)
- [ ] 4.3 Test visuel : le composant s'affiche correctement avec des données
- [ ] 4.4 Test visuel : l'état vide s'affiche quand pas de données
- [ ] 4.5 Test intégration : le changement de filtre met à jour les données du graphique

### Task 5: Vérification responsive

- [x] 5.1 Tester l'affichage sur écran large (≥1024px) — les barres sont lisibles, la moyenne est visible
- [x] 5.2 Tester sur mobile (<768px) — l'axe X ne se chevauche pas, la hauteur est adaptée

## Dev Notes

### Intelligence de la story précédente (Story 2.3)

Story 2.3 a ajouté :
- `app/services/csv_parser.ts` — service de parsing CSV
- `app/services/csv_validator.ts` — validation et résolution catégories
- `app/controllers/depenses_import_controller.ts` — upload, review, confirm
- `inertia/pages/depenses/import.tsx` — page de revue import
- `inertia/components/depenses/import_review_table.tsx` — tableau éditable

### Patterns de code à respecter

| Élément | Pattern existant | Fichier |
|---------|-----------------|---------|
| Contrôleur  | `auth.user!`, query builder Lucid, `inertia.render()` avec props | `app/controllers/depenses_controller.ts` |
| Query Lucid | `Depense.query().where('userId', user.id).whereBetween(...)`, `.preload()`, `.orderBy()`, `.paginate()` | `app/controllers/depenses_controller.ts` |
| Aggrégation Lucid | `.select()`, `.groupBy()`, `.count()`, `.sum()` | À créer (même pattern) |
| Composant graphique | Recharts `ResponsiveContainer` + `PieChart`/`BarChart` dans shadcn `Card` | `inertia/components/budget/category_pie_chart.tsx` |
| Tooltip custom | Composant fonction Recharts, bg-popover, border, rounded-lg, shadow-md | `inertia/components/budget/category_pie_chart.tsx` |
| État empty | Condition `data.length === 0`, message centré muted-foreground | `inertia/components/budget/category_pie_chart.tsx` (ligne 65-77) |
| Format montant | `formatBudget()` utilitaire dans constants | `inertia/components/budget/constants.ts` |
| Page dépenses | Props Inertia + `DepensesFilters` + `DataTable` + `DataPagination` | `inertia/pages/depenses/index.tsx` |
| Nav. Inertia | `router.get()` avec `preserveState: true, preserveScroll: true` | `inertia/components/depenses/depenses_filters.tsx` |

### Architecture technique

- **Stack** : AdonisJS 7.3.3 + React 19.2.6 + Inertia.js 4.2.0 + shadcn/ui + Tailwind 4.3.3
- **Graphique** : Recharts 3.10.0 (`BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ReferenceLine`, `CartesianGrid`, `ResponsiveContainer`)
- **Accessibilité** : Recharts `accessibilityLayer={true}` (UX-DR10)
- **Dates** : Luxon 3.7.2 (`DateTime.fromISO().toFormat()`)
- **CSS** : Variables oklch pour les couleurs du graphique (`--chart-1`, `--destructive` pour la ligne moyenne)
- **Pas de state global client** (AD-1) — données transitent par Inertia uniquement
- **Filtres existants** : `indexDepenseValidator` gère `periode` (today/week/month/custom), `category` (slug), `dateDebut`, `dateFin`

### Implémentation détaillée

#### Backend — Requête d'agrégation

À ajouter dans `DepensesController.index()` :

```ts
// Récupérer les agrégations quotidiennes pour le graphique
const dailyQuery = Depense.query()
  .where('userId', user.id)
  .where('type', 'sortie')
  .whereBetween('date', [startDate, endDate])
  .select('date')
  .count('* as count')
  .sum('montant as total')
  .groupBy('date')
  .orderBy('date', 'asc')

if (categoryId) {
  dailyQuery.where('categorieId', categoryId)
}

const dailyData = await dailyQuery

const dailyChartData = dailyData.map((d: any) => ({
  date: d.$extras.date,
  total: Number(d.$extras.total),
}))

// Moyenne = somme des totaux / nombre de jours dans la période
const totalPeriod = dailyChartData.reduce((sum, d) => sum + d.total, 0)
const dayCount = DateTime.fromSQL(endDate!).diff(DateTime.fromSQL(startDate!), 'days').days + 1
const dailyAverage = dayCount > 0 ? totalPeriod / dayCount : 0
```

Ajouter aux props Inertia :
```ts
return inertia.render('depenses/index', {
  depenses: depenses.serialize() as any,
  categories: categories.map((c) => c.serialize()) as any,
  pagination,
  filters: { periode, dateDebut: startDate, dateFin: endDate, category, range },
  dailyChartData,
  dailyAverage,
})
```

Note : la propriété `$extras` contient les résultats des agrégations `.count()`, `.sum()`, etc. (Lucid ORM ne mappe pas ces colonnes virtuelles sur le modèle).

#### Frontend — DailyExpensesChart

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
```

Pattern tooltip similaire à `CategoryPieChart` :
- Wrapper `div.rounded-lg.border.bg-popover.px-3.py-2.text-sm.shadow-md`
- Date formatée avec Luxon `DateTime.fromISO(date).toFormat('dddd dd MMMM')`
- Montant avec `formatBudget(total)`

### Fichiers à modifier

| Fichier | Modification |
|---------|-------------|
| `app/controllers/depenses_controller.ts` | Ajouter requête d'agrégation quotidienne + moyenne → props Inertia |
| `inertia/components/depenses/daily_expenses_chart.tsx` | **Nouveau** — composant BarChart |
| `inertia/pages/depenses/index.tsx` | Importer et rendre `DailyExpensesChart` avec les nouvelles props |

### Fichiers à créer

| Fichier | Description |
|---------|-------------|
| `inertia/components/depenses/daily_expenses_chart.tsx` | Composant BarChart dépenses par jour |

### Contraintes

- **Pas de migration nécessaire** — la requête utilise la table `depenses` existante
- **Pas de nouvelle dépendance** — Recharts est déjà installé (v3.10.0)
- **Type ENUM** : on filtre uniquement `'sortie'` pour les barres (on ne représente que les dépenses, pas les revenus)
- **Moyenne** : `total_sum / day_count` où `day_count = (endDate - startDate) + 1` en jours
- **Format axe X** : `dd/MM` court pour éviter le chevauchement (Luxon `toFormat('dd/MM')`)

## Testing Requirements

- Unit test : la requête d'agrégation groupe correctement par date avec les bons totaux
- Unit test : le calcul de la moyenne est correct (période de 1 jour, 7 jours, 31 jours)
- Unit test : fonctionnement avec et sans filtre catégorie
- Test visuel : vérifier que `accessibilityLayer` est présent sur le BarChart
- Test intégration : naviguer entre les filtres et vérifier que les données du graphique correspondent à la période

## Dev Agent Record

### Agent Model Used

deepseek-v4-flash-free

### Debug Log References

### Completion Notes List

- Backend: aggregation query with GROUP BY date + SUM(montant) in DepensesController.index()
- Backend: dailyAverage computed as totalPeriod / dayCount
- Frontend: DailyExpensesChart component created with BarChart, ReferenceLine, custom tooltip, empty state
- Frontend: Chart integrated in depenses page after filters, below filters
- Tests: unit tests for data transformation and average calculation in tests/unit/
- Responsive: h-72/h-64 via Tailwind responsive classes

### File List

- `app/controllers/depenses_controller.ts` (modifié)
- `inertia/components/depenses/daily_expenses_chart.tsx` (créé)
- `inertia/pages/depenses/index.tsx` (modifié)
- `tests/unit/daily_chart_data.spec.ts` (créé)
