---
baseline_commit: 0b66e24e2777934212d7f376e5d4e875da441743
---

# Story 4.2-bis: Recherche support investissement (auto-complete)

Status: in-progress

## Story

As a utilisateur,
I want rechercher un support par son nom ou symbole et auto-remplir le formulaire,
so that gagner du temps et éviter les erreurs de saisie.

## Acceptance Criteria

1. **Given** un utilisateur sur la page Investissements, **When** il clique "Ajouter support", **Then** le Dialog affiche un champ "Rechercher" au-dessus du formulaire (debounce 300ms, min 2 caractères).
2. **Given** l'utilisateur tape dans le champ recherche, **When** la requête retourne des résultats, **Then** une liste déroulante affiche : symbole, nom, type (déduit), place de cotation.
3. **Given** l'utilisateur sélectionne un résultat, **When** il clique, **Then** les champs symbole, titre, lien externe sont auto-remplis **et passés en lecture seule (disabled)**, le focus passe au champ "Type".
4. **Given** aucun résultat trouvé, **When** la recherche termine, **Then** message "Aucun support trouvé — saisie manuelle possible".
5. **Given** l'API yahoo-finance2 est indisponible, **When** la recherche échoue, **Then** Toast error "Recherche indisponible" + saisie manuelle reste possible.
6. **Given** un utilisateur non authentifié, **When** il accède à la recherche, **Then** redirect `/login`.

## Tasks / Subtasks

- [x] Task 1 — Service recherche yahoo-finance2 (AC: 1, 2, 5)
  - [x] 1.1 Ajouter `searchSymbols(query): Promise<SearchResult[]>` dans `app/services/prix_investissement_service.ts` : appelle `yahooFinance.search(query)` (v4), mappe vers `{ symbol, name, exchange, quoteType }`, timeout 5s, catch → `[]`.
- [x] Task 2 — Contrôleur search + routes (AC: 1, 5, 6)
  - [x] 2.1 Ajouter méthode `search` dans `app/controllers/supports_investments_controller.ts` : valide `q` (min 2), appelle service, retourne JSON `{ results }`, gère erreurs validation 422.
  - [x] 2.2 Dans `start/routes.ts` : ajouter `router.get('/search', [controllers.SupportsInvestments, 'search']).as('investissements.search')` dans le groupe `/investissements`.
- [x] Task 3 — Frontend composant recherche + Dialog mise à jour (AC: 1, 2, 3, 4)
  - [x] 3.1 Créer `inertia/components/investments/support_search.tsx` : Input recherche + debounce 300ms, liste résultats (dropdown custom), loading skeleton, état vide, sélection → callback `onSelect(result)`.
  - [x] 3.2 Mettre à jour `add_investments_dialog.tsx` : intégrer `SupportSearch` au-dessus du formulaire, `onSelect` pré-remplit symbol/name/externalLink **et les passe en `disabled`**, focus → type Select.
  - [x] 3.3 Accessibilité (DR16) : `aria-label` recherche, `aria-live` résultats, navigation clavier (flèches, Enter), focus trap.
- [x] Task 4 — Tests + qualité (AC: all)
  - [x] 4.1 `tests/functional/supports.spec.ts` : ajouter tests search — 200 auth, résultats mappés, query < 2 → 422, API down → 200 résultats vides, isolation user.
  - [x] 4.2 `tests/unit/prix_investissement_service.spec.ts` : test `searchSymbols` — query valide → résultats, query vide → [], erreur API → [].
  - [x] 4.3 `node ace test`, `npm run typecheck`, `npm run build` verts (erreurs préexistantes hors scope OK).

## Dev Notes

- yahoo-finance2 v4 : `search(query)` retourne `{ quotes: [{ symbol, shortname, longname, exchange, quoteType, ... }] }`. Filtrer `quoteType === 'EQUITY' | 'ETF' | 'MUTUALFUND'`.
- Type déduit : `quoteType` → EQUITY/ETF → PEA/CTO possible, MUTUALFUND → AV/CTO. Laisser user choisir final.
- Endpoint GET `/investissements/search?q=...` retourne JSON (pas Inertia page) pour auto-complete client.
- Pas de migration, pas de modèle nouveau.
- Réutilise `prix_investissement_service.ts` existant.

### References

- [Source: _bmad-output/architecture/architecture-budget-tracker-2026-07-19/ARCHITECTURE-SPINE.md#AD-3] API serveur uniquement
- [Source: app/services/prix_investissement_service.ts] Service existant à étendre
- [Source: app/controllers/supports_investments_controller.ts] Contrôleur existant
- [Source: yahoo-finance2 v4 docs] `search()` method

## Out of Scope

- Cache résultats recherche (optionnel v2)
- Historique recherches utilisateur

## Dev Agent Record

### Agent Model Used

muse-spark-1.3-contributor-free (opencode) — 2026-10-07

### Debug Log References

- Service `searchSymbols` ajouté dans `prix_investissement_service.ts` avec `yahooFinance.search()` v4
- Contrôleur `search` avec validation `q` min 2, gestion erreurs VineJS → 422 JSON
- Route `GET /investissements/search` ajoutée
- Composant `SupportSearch` créé : debounce 300ms, dropdown custom, loading, empty state, keyboard nav
- Dialog `add_investments_dialog.tsx` mis à jour : pré-remplissage + disabled symbol/name/externalLink, focus → type
- Tests : 6 nouveaux tests search fonctionnels + 4 tests unitaires searchSymbols

### Completion Notes List

- ✅ Service `searchSymbols` : filtre EQUITY/ETF/MUTUALFUND, max 10 résultats, timeout 5s, catch → []
- ✅ Contrôleur `search` : validation `q` min 2, retourne JSON `{ results }`, erreurs validation → 422
- ✅ Route `GET /investissements/search` ajoutée
- ✅ Composant `SupportSearch` : Input + dropdown custom (pas Select shadcn pour flexibilité), debounce 300ms, loading spinner, empty state, keyboard nav (arrows, Enter, Escape)
- ✅ Dialog mis à jour : `onSelect` pré-remplit symbol/name/externalLink + `disabled={true}`, focus auto sur type Select
- ✅ ExternalLink auto-généré : `https://finance.yahoo.com/quote/${symbol}`
- ✅ Tests 140/140 passed (6 nouveaux fonctionnels, 4 nouveaux unitaires)
- ✅ Build OK (erreurs TS préexistantes dans test files non liées)
- ✅ Accessibilité : aria-label, aria-live, aria-expanded, role combobox/listbox/option, keyboard nav

### File List

- UPDATE `app/services/prix_investissement_service.ts` (ajout searchSymbols + type SearchResult)
- UPDATE `app/controllers/supports_investments_controller.ts` (méthode search + ValidationError import)
- UPDATE `start/routes.ts` (GET /investissements/search)
- NEW `inertia/components/investments/support_search.tsx`
- UPDATE `inertia/components/investments/add_investments_dialog.tsx` (intégration SupportSearch + disabled fields)
- UPDATE `tests/functional/supports.spec.ts` (6 tests search ajoutés)
- UPDATE `tests/unit/prix_investissement_service.spec.ts` (4 tests searchSymbols ajoutés)

## Change Log

- 2026-10-07 : story créée, prête pour dev
- 2026-10-07 : implémentation complète 4.2-bis, 140 tests verts, story → review

## Status

review