---
name: Budget Tracker
type: architecture-spine
purpose: build-substrate
altitude: feature
paradigm: MVC — AdonisJS + Inertia
scope: Toutes les fonctionnalités du PRD Budget Tracker (Budget, Dépenses, Crédits, Investissements, Cryptos, Dashboard)
status: final
created: 2026-07-19
updated: 2026-07-19
binds: [FR-1 → FR-2, FR-5 → FR-29]
sources:
  - _bmad-output/planning-artifacts/prds/prd-budget-tracker-2026-07-19/prd.md
  - _bmad-output/architecture/architecture-budget-tracker-2026-07-19/.memlog.md
companions: []
---

# Architecture Spine — Budget Tracker

## Design Paradigm

**MVC AdonisJS + Inertia** — server-driven UI.

Le serveur est l'unique source de vérité. Les contrôleurs AdonisJS reçoivent les requêtes HTTP via Inertia, exécutent la logique métier (parfois déléguée à des services), utilisent Lucid ORM pour la persistance, et renvoient des props Inertia aux pages React. Les composants React sont purement déclaratifs — pas de state global, pas de fetch API, pas de mutations depuis le client.

```
Navigateur → Inertia HTTP → AdonisJS Router → Controller
                  ↕               ↕
            Pages React     Services (opt.)
                                ↕
                            Lucid ORM
                                ↕
                            MySQL
```

## Invariants & Rules

### AD-1 — Aucun store client

- **Binds:** Tous les composants React
- **Prevents:** État désynchronisé serveur/client, doubles tours de validation
- **Rule:** Toute donnée affichée ou modifiée transite par Inertia. Les formulaires utilisent Inertia `<Form>` ou des requêtes Inertia. Pas de Zustand, Redux, React Query, ou fetch direct depuis le navigateur.

### AD-2 — Parsing CSV côté serveur uniquement

- **Binds:** FR-7, FR-26, import CSV
- **Prevents:** Injection de données malveillantes, contournement des validateurs
- **Rule:** Le fichier CSV est uploadé via Inertia vers un contrôleur AdonisJS. Le parsing utilise `csv-parse` et la validation VineJS. Aucun parsing CSV côté client.

### AD-3 — Clés API serveur uniquement

- **Binds:** FR-13, FR-14, FR-20, FR-27, FR-29, yahoo-finance2, CoinGecko
- **Prevents:** Exposition de clés API dans le bundle client
- **Rule:** Les appels à yahoo-finance2 et CoinGecko sont faits depuis des services AdonisJS (côté serveur). Les pages React reçoivent les données déjà récupérées via Inertia props.

### AD-5 — Prix moyen pondéré pour le calcul de plus/moins-value

- **Binds:** FR-15, FR-16, FR-21, FR-22, Achat/Vente Investissement et Crypto
- **Prevents:** Calcul erroné avec plusieurs achats à des prix différents
- **Rule:** Le prix moyen pondéré est calculé à la volée par query agrégée (`SUM(quantité * prix_unitaire + frais) / SUM(quantité)`). Pas de `total_quantity`/`total_cost` stocké sur le support. Une vente réduit la quantité sans affecter le coût unitaire des achats restants.

## Consistency Conventions

| Concern                      | Convention                                                            |
| ---------------------------- | --------------------------------------------------------------------- |
| Fichiers controllers         | snake_case (`categorie_controller.ts`, `depense_controller.ts`)       |
| Models                       | PascalCase (`Categorie`, `Depense`, `Credit`)                         |
| Routes                       | kebab-case, groupes par domaine (`/budget/categories`, `/depenses`)   |
| Tables Lucid                 | snake_case, pluriel (`categories`, `depenses`)                        |
| Clés étrangères              | `categorie_id` (snake_case)                                           |
| Validation                   | VineJS dans `app/validators/`                                         |
| Dates                        | Luxon `DateTime`, stockage MySQL DATETIME                             |
| Slugs                        | auto-générés depuis le label, modifiable, unique                      |
| Montants                     | DECIMAL(10,2) en base, formatés via Intl.NumberFormat en EUR en front |
| Types montant                | `type` ENUM('entree', 'sortie')                                       |
| Types support investissement | ENUM('PEA', 'AV', 'CTO')                                              |
| Messages flash               | Sonner via Inertia shared props (`flash.success`, `flash.error`)      |
| Layout                       | `inertia/layouts/default.tsx` pour toutes les pages authentifiées     |

## Stack

| Name                | Version                           |
| ------------------- | --------------------------------- |
| Node.js             | >=24.0.0                          |
| AdonisJS            | 7.3.3                             |
| React               | 19.2.6                            |
| TypeScript          | 6.0.3                             |
| Lucid ORM           | 22.4.2                            |
| Inertia.js          | 4.2.0 (AdonisJS) / 2.3.24 (React) |
| Tailwind CSS        | 4.3.3                             |
| Base UI (shadcn/ui) | 1.6.0                             |
| shadcn CLI          | 4.13.1                            |
| MySQL               | 8+ (driver mysql2 3.23.0)         |
| VineJS              | 4.4.0                             |
| Luxon               | 3.7.2                             |
| Lucide React        | 1.25.0                            |
| Sonner              | 2.0.7                             |
| yahoo-finance2      | 4.0.0                             |
| Recharts            | 3.9.2                             |
| csv-parse           | 7.0.1                             |

## Structural Seed

```
project-root/
  app/
    controllers/
      session_controller.ts
      new_account_controller.ts
      categorie_controller.ts
      depense_controller.ts
      credit_controller.ts
      support_investissement_controller.ts
      crypto_controller.ts
      dashboard_controller.ts
    models/
      user.ts
      categorie.ts
      depense.ts
      credit.ts
      support_investissement.ts
      achat_investissement.ts
      vente_investissement.ts
      crypto.ts
      achat_crypto.ts
      vente_crypto.ts
    services/
      csv_import_service.ts
      prix_investissement_service.ts  # wrapper yahoo-finance2
      prix_crypto_service.ts          # wrapper CoinGecko
      patrimoine_service.ts           # calculs agrégés dashboard
    validators/
    transformers/
    middleware/
    exceptions/
  database/
    migrations/
      *_create_categories_table.ts
      *_create_depenses_table.ts
      *_create_credits_table.ts
      *_create_supports_investissement_table.ts
      *_create_achats_investissement_table.ts
      *_create_ventes_investissement_table.ts
      *_create_cryptos_table.ts
      *_create_achats_crypto_table.ts
      *_create_ventes_crypto_table.ts
  inertia/
    components/
      ui/
        button.tsx
        chart.tsx   # via shadcn (Recharts)
        dialog.tsx  # via shadcn (Base UI)
        ...
    layouts/
      default.tsx
    pages/
      home.tsx
      budget/
        index.tsx   # FR-1 → FR-2
      depenses/
        index.tsx   # FR-5 → FR-9
      credits/
        index.tsx   # FR-10 → FR-12
      investissements/
        index.tsx   # FR-13 → FR-18
      cryptos/
        index.tsx   # FR-19 → FR-24
      dashboard/
        index.tsx   # FR-25 → FR-29
  start/
    routes.ts
    kernel.ts
```

## Capability → Architecture Map

| Capability                   | Lives in                                                                                                                                 | Governed by      |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Budget / Catégories (FR-1→2) | `categorie_controller`, `Categorie` model, `budget/` page                                                                                | AD-1             |
| Dépenses (FR-5→9)            | `depense_controller`, `Depense` model, `depenses/` page                                                                                  | AD-1, AD-2       |
| Crédits (FR-10→12)           | `credit_controller`, `Credit` model, `credits/` page                                                                                     | AD-1             |
| Investissements (FR-13→18)   | `support_investissement_controller`, `SupportInvestissement`/`AchatInvestissement`/`VenteInvestissement` models, `investissements/` page | AD-1, AD-3, AD-5 |
| Cryptos (FR-19→24)           | `crypto_controller`, `Crypto`/`AchatCrypto`/`VenteCrypto` models, `cryptos/` page                                                        | AD-1, AD-3, AD-5 |
| Dashboard (FR-25→29)         | `dashboard_controller`, `patrimoine_service`, `dashboard/` page                                                                          | AD-1, AD-2, AD-3 |
| Import CSV                   | `csv_import_service` + `depense_controller`                                                                                              | AD-2             |
| Prix live                    | `prix_investissement_service` (yahoo-finance2), `prix_crypto_service` (CoinGecko)                                                        | AD-3             |
| Graphiques                   | Recharts dans les pages concernées                                                                                                       | AD-1             |

## Deferred

- **Règles dépenses obligatoires (FR-3, FR-4)** — Fonctionnalité retirée du périmètre MVP. À repenser : identifier les dépenses récurrentes via historique plutôt que règles regex.
- **Cache API des prix** — Pas nécessaire pour un usage personnel avec une faible fréquence d'appels. À réévaluer si les limites de rate limiting de yahoo-finance2 sont atteintes.
- **PWA** — PRD §6.2 la mentionne comme envisageable. Pas dans le périmètre MVP.
- **Export CSV/PDF** — PRD §6.2, v2.
- **Multi-utilisateurs** — Le modèle User existe déjà (auth), mais pas de gestion multi-comptes. L'architecture MVC + Inertia n'impose pas de contrainte qui empêcherait de l'ajouter plus tard (ajout d'un `team_id` ou scope utilisateur sur les queries).
- **Déploiement O2Switch** — Les contraintes spécifiques (Apache reverse proxy, Node.js via O2Switch Manager, build AdonisJS) sont à définir au moment du déploiement. Aucun impact sur la spine.
