---
baseline_commit: bfaf2e70579962016f32ebca815805f4836e1e40
---

# Story 4.1: Liste des supports et répartition

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a utilisateur,
I want voir la liste de mes supports d'investissement avec leur valeur et répartition,
so that suivre mon portefeuille.

## Acceptance Criteria

1. **Given** un utilisateur authentifié sur la page Investissements, **When** la page se charge, **Then** une Table shadcn liste les supports : nom/titre, symbole, type (PEA/AV/CTO), lieu stockage, évolution %, valeur actuelle, plus/moins-value (0 si pas encore de transactions — calculs P&L complets en 4.4).
2. **Given** des supports existants avec valeur > 0, **When** la page s'affiche, **Then** un camembert Recharts (`accessibilityLayer={true}`) montre la répartition de la valeur totale par support.
3. **Given** aucun support enregistré, **When** la page est affichée, **Then** un message vide "Ajoute ton premier support" avec CTA s'affiche (`PageState` empty).
4. **Given** l'API de prix (yahoo-finance2) est indisponible ou le symbole inconnu, **When** la valeur actuelle ne peut pas être récupérée, **Then** le dernier prix connu (`lastKnownPrice`) est affiché avec un badge warning "Prix non mis à jour", la page reste utilisable (échec partiel : autres supports affichés normalement).
5. **Given** un utilisateur non authentifié, **When** il accède à la liste, **Then** redirect `/login`. Chaque utilisateur ne voit que ses supports (`where userId`).
6. **Given** la page chargée, **When** les temps de rendu sont mesurés, **Then** pas de fetch client direct : prix récupérés côté serveur (service AdonisJS, AD-3), données via props Inertia uniquement (AD-1).

## Tasks / Subtasks

- [x] Task 1 — Migration + modèle `InvestmentSupport` (AC: 1, 5)
  - [x] 1.1 Créer migration `create_investment_supports_table.ts` (pattern `20260726225019_create_loans_table.ts`) : `id`, `user_id` FK users CASCADE, `symbol` string (ex AAPL), `name` string (titre), `type` enum PEA/AV/CTO, `storage_location` string, `annual_fees` decimal 5,2 default 0, `description` text nullable, `external_link` string nullable, `last_known_price` decimal 15,2 nullable, `last_price_at` timestamp nullable, timestamps
  - [x] 1.2 Créer `app/models/investment_support.ts` : `@belongsTo(() => User)`, colonnes + serialize Number pour décimaux. Pas de `total_quantity`/`total_cost` stocké (AD-5 : calcul à la volée en 4.4)
- [x] Task 2 — Service prix serveur + dépendance (AC: 4, 6)
  - [x] 2.1 Installer `yahoo-finance2@4.0.0` (`npm i yahoo-finance2@4.0.0`). Vérifier absence actuelle du package (constaté : non présent au 2026-09-13)
  - [x] 2.2 Créer `app/services/prix_investissement_service.ts` : `getCurrentPrice(symbol): Promise<number|null>` via yahoo-finance2, timeout court, catch → `null` (jamais throw vers le contrôleur). JAMAIS appelé depuis le client (AD-3, NFR1)
- [x] Task 3 — Validator + contrôleur + routes (AC: 1, 4, 5, 6)
  - [x] 3.1 Pas de validator de création dans 4.1 (ajout = 4.2). Si besoin validation query filtres → VineJS dans `app/validators/`
  - [x] 3.2 Créer `app/controllers/supports_investissement_controller.ts` — `index` : `Support.query().where('userId')`, pour chaque support : tente prix live via service → si OK met à jour `lastKnownPrice/lastPriceAt` (best-effort, ne bloque pas le render), sinon garde dernier connu + flag `stale: true` ; calcule `currentValue = lastKnownPrice * totalQuantity` (0 sans transactions), `evolutionPct` vs prix de référence disponible (0 si indéterminable) ; retourne `inertia.render('investissements/index', { supports, summary: { totalValue } })`
  - [x] 3.3 Remplacer `router.on('/investissements')` placeholder dans `start/routes.ts` par groupe contrôleur : `GET /investissements` → `index` (nom `investissements`). Garder URLs kebab existantes, sidebar `href: '/investissements'` inchangée
- [x] Task 4 — Frontend liste + répartition (AC: 1, 2, 3, 4)
  - [x] 4.1 Réécrire `inertia/pages/investissements/index.tsx` (pattern `credits/index.tsx` + `budget/index.tsx`) : header h1 + sous-titre, `PageState` empty "Aucun investissement / Ajoute ton premier support", `DataTable` colonnes (nom, type, lieu, évolution %, valeur EUR via `formatBudget`, +/-value, badge "Prix non mis à jour" si `stale`), `onRowClick` → détail (page 4.5, même si détail complet vient plus tard — a minima navigation `/investissements/:id` ou désactivé avec TODO explicite si hors scope)
  - [x] 4.2 Créer `inertia/components/investissements/constants.ts` : types `InvestmentSupport`, `InvestmentsSummary`
  - [x] 4.3 Camembert : réutiliser pattern `inertia/components/budget/category_pie_chart.tsx` (Recharts ≥3 `accessibilityLayer`, `chart-1..5` tokens) — NOUVEAU `support_pie_chart.tsx` ou réutilisation directe si générique. État vide graphique si total 0
  - [x] 4.4 A11y/UX (DR16, DR10, DR14) : h1 unique, `aria-busy` chargement (Skeleton), badge warning visible, touch targets ≥44px, `prefers-reduced-motion` hérité Recharts
- [x] Task 5 — Tests + qualité (AC: all)
  - [x] 5.1 `tests/functional/supports.spec.ts` : 200 authentifié, redirect `/login` sinon, isolation user (2 users → 1 support chacun), symbole inconnu/API down → 200 avec `stale: true` (mocker service → null)
  - [x] 5.2 `tests/unit/prix_investissement_service.spec.ts` : symbole invalide → `null` (pas de throw)
  - [x] 5.3 `node ace test`, `npm run typecheck`, `npm run build` verts (noter : erreurs typecheck préexistantes hors scope le 2026-09-13 : `session.spec`, `pagination.spec`, `utils.spec` — ne pas les attribuer à 4.1)

## Dev Notes

- Greenfield partiel : page placeholder actuelle (`investissements/index.tsx` vide), route `router.on` sans contrôleur, aucun modèle/service/validator. NE PAS toucher : `loans`, `categories`, `depenses`, `csv_import`, auth.
- AD-5 : pas de colonnes agrégées stockées. En 4.1 sans transactions : quantité totale = 0 → valeur 0, évolution 0, +/-value 0. Tables `achat/vente_investissement` + `AssetTransactionService` (formule `SUM(qté*prix+frais)/SUM(qté)`) = Story 4.4, réutilisée en 5.3. Ne pas les créer ici.
- Prix live : yahoo-finance2 côté serveur uniquement. Échec = fallback `lastKnownPrice` + badge, jamais d'écran d'erreur bloquant. Premier affichage sans prix connu : valeur "—" + badge.
- Conventions : contrôleur snake (`supports_investissement_controller.ts`), modèle Pascal, table snake pluriel `investment_supports`, montants DECIMAL → `Number()` + `formatBudget` EUR, UI français ("Ajouter support" CTA vide → route 4.2, même si Dialog 4.2 hors scope : CTA peut être inactif avec TODO ou pointer vers 4.2 à venir — trancher à l'implémentation, noter le choix).
- Fichiers : NEW migration, `app/models/investment_support.ts`, `app/services/prix_investissement_service.ts`, `app/controllers/supports_investissement_controller.ts`, `inertia/components/investissements/constants.ts` (+ pie chart), UPDATE `start/routes.ts`, `inertia/pages/investissements/index.tsx`, NEW tests. `package.json` (+lock) via install yahoo-finance2.

### Project Structure Notes

- Alignement spine : `support_investissement_controller`, modèles `SupportInvestissement/Achat/Vente` (4.1 = support seul), page `investissements/index`, service `prix_investissement_service`. Nommage réel existant du projet : `loans_controller`/`Loan` (anglais) — pour investissements, préférer `investment_support` (anglais, cohérent loans) tout en gardant labels FR. Noter l'écart spine (`support_investissement` FR) sans bloquer.
- Recharts 3.10 présent, `category_pie_chart.tsx` = référence camembert + `accessibilityLayer`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.1] Table + camembert + empty + badge prix
- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.2-note] Tâche technique AssetTransactionService (4.4, réutilisée 5.3) — ne pas implémenter en 4.1
- [Source: _bmad-output/planning-artifacts/prds/prd-budget-tracker-2026-07-19/prd.md#FR-13/FR-18] Champs support + camembert valeur par support
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-budget-tracker-2026-07-19/EXPERIENCE.md#Investissements-UJ-5] Layout 2 colonnes + camembert + fallback badge
- [Source: _bmad-output/architecture/architecture-budget-tracker-2026-07-19/ARCHITECTURE-SPINE.md#AD-1/AD-3/AD-5] Inertia sans store, API serveur, prix moyen à la volée
- [Source: database/migrations/20260726225019_create_loans_table.ts] Pattern migration FK + decimal + enum
- [Source: app/controllers/loans_controller.ts#index] Pattern index scopé user + aggregates + inertia.render
- [Source: inertia/pages/credits/index.tsx + budget/index.tsx] Patterns page liste + récap + empty
- [Source: inertia/components/budget/category_pie_chart.tsx] Pattern PieChart réutilisable
- [Source: package.json] yahoo-finance2 absent (à installer 4.0.0), recharts 3.10 OK

### Previous Story Intelligence (Epic 3)

- CRUD loans livré avec `FormDialog`/`DeleteDialog`, `DataTable onRowClick`, flash Sonner via redirect, routes POST-style (O2Switch), tests Japa fonctionnels + unit. Réutiliser ces patterns pour supports.
- Typecheck a des erreurs préexistantes hors crédits (session/pagination/utils) — ne pas confondre avec régressions 4.1.

### Git Intelligence

- Récent : refactor crédits, filtres budget, tests EN. Conventions commits FIX/FEAT mixtes FR/EN.

## Out of Scope

- Ajout support Dialog (4.2), achats/ventes + AssetTransactionService (4.4), détail support (4.5), DCA quick-add (6.3)

## Dev Agent Record

### Agent Model Used

muse-spark-1.3-contributor-free (opencode) — 2026-09-13

### Debug Log References

- Migration `investment_supports` OK via `node ace migration:run`
- Service yahoo-finance2 v4 class API `new YahooFinance()`, `quote()` + race timeout 5s, catch → null
- Unit timeout suite passé 2s → 15s (adonisrc.ts) : appel réseau invalide ~3s
- Tooltip Recharts v3 type Formatter : cast `any` pour `formatBudget`
- `Button` unused retiré de `investissements/index.tsx`, prettier appliqué

### Completion Notes List

- ✅ Migration + modèle InvestmentSupport (FK CASCADE, enum PEA/AV/CTO, decimals serializés)
- ✅ yahoo-finance2@4.0.0 installé, service serveur uniquement, jamais throw
- ✅ Contrôleur index scopé userId, best-effort prix live + flag stale, currentValue/evolution/pl = 0 sans transactions (4.4)
- ✅ Routes GET /investissements → SupportsInvestissement.index, sidebar inchangée
- ✅ Frontend DataTable + PageState empty + SupportPieChart accessibilityLayer + badge stale + onRowClick /investissements/:id (TODO 4.5)
- ✅ Tests 6/6 (4 functional + 2 unit), full suite 125 passed, backend tsc propre 4.1, inertia tsc propre 4.1, eslint propre 4.1
- Choix CTA vide : action router.visit('/investissements') + TODO 4.2 Dialog

### File List

- NEW database/migrations/20260913000001_create_investment_supports_table.ts
- NEW app/models/investment_support.ts
- NEW app/services/prix_investissement_service.ts
- NEW app/controllers/supports_investissement_controller.ts
- NEW inertia/components/investissements/constants.ts
- NEW inertia/components/investissements/support_pie_chart.tsx
- NEW tests/functional/supports.spec.ts
- NEW tests/unit/prix_investissement_service.spec.ts
- UPDATE start/routes.ts
- UPDATE inertia/pages/investissements/index.tsx
- UPDATE package.json + package-lock.json (yahoo-finance2@4.0.0)
- UPDATE adonisrc.ts (unit timeout 2s → 15s)
- AUTO .adonisjs/server/controllers.ts (SupportsInvestissement)

## Change Log

- 2026-09-13 : implémentation complète 4.1, 125 tests verts, story → review
- 2026-10-07 : code review validée, story → done

## Status

done
