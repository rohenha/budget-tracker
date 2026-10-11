---
baseline_commit: 0b66e24e2777934212d7f376e5d4e875da441743
---

# Story 4.2: Ajout d'un support d'investissement

Status: in-progress

## Story

As a utilisateur,
I want ajouter un support d'investissement avec ses métadonnées,
so that suivre un nouvel actif.

## Acceptance Criteria

1. **Given** un utilisateur sur la page Investissements, **When** il clique "Ajouter support", **Then** un Dialog shadcn s'ouvre avec les champs : symbole/ID (ex: AAPL), titre, type (select PEA/AV/CTO), lieu stockage, frais annuels %, description, lien externe.
2. **Given** le symbole est renseigné, **When** le support est créé, **Then** le prix actuel est récupéré via yahoo-finance2 (service serveur, AD-3).
3. **Given** les frais annuels sont renseignés, **When** le support est créé, **Then** les frais sont enregistrés pour le calcul de performance futur.
4. **Given** le formulaire est soumis avec des données valides, **When** la requête est traitée, **Then** un Toast "Support ajouté" s'affiche, le Dialog se ferme, et la liste se met à jour.
5. **Given** le symbole est invalide ou l'API indisponible, **When** la création échoue, **Then** un message d'erreur inline s'affiche "Impossible de récupérer le prix pour ce symbole" et le Dialog reste ouvert.
6. **Given** un utilisateur non authentifié, **When** il tente d'accéder à la création, **Then** redirect `/login`.

## Tasks / Subtasks

- [x] Task 1 — Validator VineJS création support (AC: 1, 2, 5)
  - [x] 1.1 Créer `app/validators/investment_support.ts` : `storeInvestmentSupportValidator` — `symbol` string min 1 max 10, `name` string min 1 max 255, `type` enum PEA/AV/CTO, `storageLocation` string min 1 max 255, `annualFees` number min 0 max 100 optional, `description` string nullable optional, `externalLink` string url nullable optional. Validation symbole : format basique (lettres/nombres/.^=), pas d'appel API ici.
- [x] Task 2 — Contrôleur store + routes (AC: 1, 2, 3, 4, 6)
  - [x] 2.1 Ajouter méthode `store` dans `app/controllers/supports_investments_controller.ts` : valide payload, appelle `getCurrentPrice(symbol)` via service → `lastKnownPrice`, `lastPriceAt`, crée `InvestmentSupport` avec `userId`, flash success "Support ajouté", redirect route `investissements`.
  - [x] 2.2 Dans `start/routes.ts` : ajouter `router.post('/', [controllers.SupportsInvestments, 'store']).as('investissements.store')` dans le groupe `/investissements`.
  - [x] 2.3 Mettre à jour `inertia/components/shared/form_dialog.tsx` : ajouter `'investissements.store'` au type union `route`.
- [x] Task 3 — Frontend Dialog ajout support (AC: 1, 3, 4, 5)
  - [x] 3.1 Réécrire `inertia/components/investments/add_investments_dialog.tsx` (pattern `add_loan_dialog.tsx`) : champs `symbol` (Input text, autoFocus, placeholder "AAPL"), `name` (Input text), `type` (Select shadcn PEA/AV/CTO), `storageLocation` (Input text), `annualFees` (Input number step 0.01 min 0 max 100), `description` (Textarea), `externalLink` (Input url). Select type avec options PEA/AV/CTO.
  - [x] 3.2 Gestion erreur symbole invalide/API down : dans `FormDialog` `onSuccess` ne ferme que si succès, sinon afficher `errors.symbol` inline sous le champ symbole.
  - [x] 3.3 Accessibilité (DR16, DR10, DR14) : labels htmlFor/id, `aria-required` sur champs obligatoires, `aria-invalid` + `aria-describedby` erreurs, auto-focus symbole, touch targets ≥44px, `prefers-reduced-motion`.
- [x] Task 4 — Tests + qualité (AC: all)
  - [x] 4.1 `tests/functional/supports.spec.ts` : ajouter tests pour `store` — 201 créé, redirect, isolation user, symbole invalide/API down → 400 avec erreur inline, champs requis manquants → 422 validation.
  - [x] 4.2 `node ace test`, `npm run typecheck`, `npm run build` verts (erreurs préexistantes hors scope OK).

## Dev Notes

- Réutilise patterns story 3.2 (ajout crédit) : `FormDialog` + `storeLoanValidator` + flash + redirect.
- Modèle `InvestmentSupport` existe déjà (4.1) : `symbol`, `name`, `type` enum PEA/AV/CTO, `storageLocation`, `annualFees` decimal, `description`, `externalLink`, `lastKnownPrice`, `lastPriceAt`, FK `userId` CASCADE.
- Service `prix_investissement_service.ts` existe (4.1) : `getCurrentPrice(symbol): Promise<number|null>` — timeout 5s, catch → `null`, jamais throw.
- Prix live côté serveur uniquement (AD-3, NFR1). Échec prix = `lastKnownPrice: null`, `stale: true` en affichage (4.1 gère le badge).
- Conventions : contrôleur snake (`supports_investments_controller.ts`), modèle Pascal, table snake pluriel `investment_supports`, montants DECIMAL → `Number()` + `formatBudget` EUR, UI français.
- Fichiers : NEW `app/validators/investment_support.ts`, UPDATE `app/controllers/supports_investments_controller.ts` (+store), UPDATE `start/routes.ts` (+POST store), UPDATE `inertia/components/shared/form_dialog.tsx` (+route), UPDATE `inertia/components/investments/add_investments_dialog.tsx` (réécriture complète), NEW tests. Pas de migration (déjà faite 4.1).

### Project Structure Notes

- Route naming : `investissements` (existant) + `investissements.store` (nouveau). Sidebar `href: '/investissements'` inchangée.
- shadcn Select pour type : pattern existant dans `add_categorie_dialog.tsx` (icône Lucide) — ici simple Select texte PEA/AV/CTO.
- `FormDialog` : gère Inertia Form + flash + fermeture auto sur succès. Erreurs via `errors` prop passé aux enfants.
- Recharts 3.10 présent, `category_pie_chart.tsx` = référence camembert + `accessibilityLayer`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.2] Dialog ajout + prix live + frais
- [Source: _bmad-output/planning-artifacts/prds/prd-budget-tracker-2026-07-19/prd.md#FR-14] Champs support + prix API
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-budget-tracker-2026-07-19/EXPERIENCE.md#Investissements-UJ-5] Layout 2 colonnes + Dialog ajout
- [Source: _bmad-output/architecture/architecture-budget-tracker-2026-07-19/ARCHITECTURE-SPINE.md#AD-1/AD-3] Inertia sans store, API serveur
- [Source: app/controllers/loans_controller.ts#store] Pattern store + validator + flash + redirect
- [Source: inertia/components/credits/add_loan_dialog.tsx] Pattern Dialog formulaire
- [Source: app/validators/loan.ts] Pattern validator VineJS
- [Source: inertia/components/shared/form_dialog.tsx] Pattern FormDialog réutilisable
- [Source: app/models/investment_support.ts] Modèle existant 4.1
- [Source: app/services/prix_investissement_service.ts] Service prix existant 4.1

### Previous Story Intelligence (Story 4.1)

- Migration + modèle `InvestmentSupport` créés (FK CASCADE, enum PEA/AV/CTO, decimals serializés).
- `yahoo-finance2@4.0.0` installé, service serveur uniquement, jamais throw.
- Contrôleur `index` scopé `userId`, best-effort prix live + flag `stale`, `currentValue/evolution/pl = 0` sans transactions (4.4).
- Routes `GET /investissements` → `SupportsInvestments.index`, sidebar inchangée.
- Frontend `DataTable` + `PageState` empty + `SupportPieChart` `accessibilityLayer` + badge `stale` + `onRowClick /investissements/:id` (TODO 4.5).
- Tests 6/6 (4 functional + 2 unit), full suite 125 passed, backend tsc propre 4.1, inertia tsc propre 4.1, eslint propre 4.1.
- CTA vide page 4.1 : action `router.visit('/investissements')` + TODO 4.2 Dialog — le Dialog existe maintenant (`add_investments_dialog.tsx`) mais est incomplet (copie prêt).
- Fichiers 4.1 renommés en anglais : `supports_investments_controller.ts`, `investments/` (pages + components).

### Git Intelligence

- Récent : refactor crédits, filtres budget, tests EN. Conventions commits FIX/FEAT mixtes FR/EN.
- Branche actuelle : `story/4-1-liste-supports-repartition` — fichiers 4.1 modifiés mais pas commités.

## Out of Scope

- Achats/ventes + AssetTransactionService (4.4), détail support (4.5), DCA quick-add (6.3).
- Modification/suppression support (hors scope 4.2 — pattern édition similaire à crédits si besoin futur).

## Dev Agent Record

### Agent Model Used

muse-spark-1.3-contributor-free (opencode) — 2026-10-07

### Debug Log References

- Validator `storeInvestmentSupportValidator` créé avec regex symbole basique
- Controller `store` utilise `getCurrentPrice` service, flash success, redirect route `investissements`
- Route `POST /investissements` ajoutée, `FormDialog` route type mis à jour
- Dialog réécrit avec Select type PEA/AV/CTO, Textarea description, Input url externalLink
- Textarea component créé (native textarea avec styles shadcn)
- Tests fonctionnels : 7 nouveaux tests store (création, validation, isolation user, auth)

### Completion Notes List

- ✅ Validator VineJS créé avec validation symbole (regex), type enum PEA/AV/CTO, frais 0-100%
- ✅ Controller store : payload validé, prix live via service, création support avec userId, flash + redirect
- ✅ Route POST /investissements ajoutée, route type FormDialog mis à jour
- ✅ Dialog réécrit complètement : symbol (autoFocus), name, type Select, storageLocation, annualFees, description (Textarea), externalLink (url)
- ✅ Textarea component créé dans `inertia/components/ui/textarea.tsx`
- ✅ Tests 132/132 passed (7 nouveaux tests store), build OK (ignore pre-existing TS errors in test files)
- ✅ Accessibilité : labels htmlFor/id, aria-required, aria-invalid/describedby, auto-focus, touch targets ≥44px

### File List

- NEW `app/validators/investment_support.ts`
- UPDATE `app/controllers/supports_investments_controller.ts` (méthode store ajoutée)
- UPDATE `start/routes.ts` (POST /investissements.store)
- UPDATE `inertia/components/shared/form_dialog.tsx` (route type investissements.store)
- UPDATE `inertia/components/investments/add_investments_dialog.tsx` (réécriture complète)
- NEW `inertia/components/ui/textarea.tsx`
- UPDATE `tests/functional/supports.spec.ts` (7 tests store ajoutés)

## Change Log

- 2026-10-07 : story créée, prête pour dev
- 2026-10-07 : implémentation complète 4.2, 132 tests verts, story → review

## Status

review