---
name: Budget Tracker
type: experience
status: final
created: 2026-07-19
updated: 2026-07-19
sources:
  - ../../prds/prd-budget-tracker-2026-07-19/prd.md
  - ../../../architecture/architecture-budget-tracker-2026-07-19/ARCHITECTURE-SPINE.md
companions:
  - DESIGN.md
---

# Experience — Budget Tracker

## Foundation

- **Form-factor**: Web responsive (desktop → mobile)
- **UI System**: shadcn/ui (Base UI runtime) — visual tokens in `{DESIGN.md}`
- **Public pages**: home, auth/login, auth/signup — layout header fixe (inchangé)
- **Authenticated app**: sidebar gauche + contenu principal — nouveau layout
- **Skip navigation link**: premier élément focusable sur toutes les pages. Lien visuellement caché, visible au focus : "Aller au contenu principal"

## Information Architecture

```
Dashboard (accueil)
├── Cartes indicateurs (patrimoine net, solde, invest, crypto, crédits, charges)
├── Boutons actions (importer CSV, ajout invest, ajout crypto)
└── Graphique évolution patrimoine (mois)

Dépenses
├── Graphique barres par jour
├── Filtre mois
├── Boutons (Ajouter manuel, Importer CSV)
└── Liste paginée (date, libellé, montant, catégorie)

Budget / Catégories
├── Bouton Ajouter catégorie
├── Colonne gauche: liste catégories (nom, icône Lucide, budget mensuel, réel)
├── Colonne droite: camembert répartition
└── Total budgété vs réel

Crédits
├── Colonne gauche: récap (total dû, intérêts, apport initial)
├── Colonne droite: liste crédits
├── Clic crédit → popin détails/modif
└── Bouton Ajouter crédit

Investissements
├── Colonne gauche: liste supports (symbole, variation %, valeur actuelle)
├── Colonne droite: détail support (type PEA/AV/CTO, frais, lien, +/-value)
├── Camembert répartition (en haut à droite)
├── Historique achats/ventes (dans détail)
└── Boutons (Ajouter support, Ajouter achat/vente)

Cryptos
└── Pattern identique Investissements
```

## Voice and Tone

| Contexte | Ton |
|---|---|
| Titres pages | Utilitaire : "Dashboard", "Dépenses" |
| Messages vides | Directif mais pas culpabilisant : "Ajoute ta première dépense" |
| Erreurs | Cause + action : "Vérifie le format CSV" |
| Succès | Concis : "Dépense ajoutée" |
| Confirmation (suppression) | "Supprimer X ?" avec bouton "Confirmer" en variant destructive |
| Général | Pas de tutoiement forcé, pas de brand voice héroïque |

## Component Patterns

- **Cards indicateur**: chiffre principal + label + icône Lucide + micro-variation (si applicable). Clic → nulle (information pure)
- **Listes**: shadcn Table. Ligne cliquable pour ouvrir le détail. Pagination en bas
- **Popins**: shadcn Dialog pour tous les formulaires d'ajout/édition. Full-screen sur mobile. Jamais de page dédiée
- **Sidebar**: icône Lucide (`aria-hidden="true"`) + label. Lien actif surligné (`aria-current="page"`). Rétractable en hamburger sur mobile
- **Graphiques**: Recharts ≥ 3.0 avec `accessibilityLayer={true}`. PieChart (répartitions), BarChart (par-jour), LineChart (évolution)
- **File upload**: input type="file" avec label explicitant le format attendu (CSV Crédit Agricole)

## State Patterns

| État | Comportement |
|---|---|
| **Chargement** | shadcn Skeleton sur les cartes et listes. Graphiques en shimmer. Conteneur parent `aria-busy="true"` |
| **Vide (1ère connexion)** | Push CTA centré: "Ajoute ta première dépense" + bouton action |
| **Vide (catégorie)** | "Aucune catégorie — crée-la pour commencer" + bouton |
| **Vide (recherche/filtre)** | "Aucun résultat pour ce filtre" |
| **Erreur API** | Toast `variant: destructive` avec message. Données utilisateur préservées |
| **Erreur CSV** | Toast listant les lignes en erreur avec le champ invalide. `role="alert"` |
| **Erreur validation formulaire** | Inline : message d'erreur sous le champ, `aria-describedby` lié à l'input, `aria-invalid="true"` |
| **Suppression (confirmation)** | Dialog avec texte de confirmation + bouton "Confirmer" (destructive variant) + bouton "Annuler" |
| **Données obsolètes (prix)** | FR-27 : fallback au dernier prix connu, indicateur visuel "Prix non mis à jour" sur la carte (badge warning) |
| **Échec partiel** | Une API échoue, les autres réussissent. Toast pour l'erreur, données affichées pour les sources réussies |
| **Mode déconnecté** | Redirect vers /login. Pas de cache local |

## Interaction Primitives

- **Formulaire ajout dépense**: Dialog. Champs: date (picker natif), libellé (text), montant (number avec décimales), catégorie (select avec `aria-describedby` pour erreurs). Submit → toast, fermeture dialog, mise à jour liste
- **Import CSV**: Upload fichier → preview 3 premières lignes → confirmer ou annuler. Traitement serveur. Résultat via toast
- **Achat investissement/crypto**: Dialog. Champs: support (select/autocomplete), quantité, prix unitaire, frais, date. Champs requis marqués `aria-required="true"`. Submit → toast + refresh
- **Ajout crédit**: Dialog (montant, taux, durée, date début, apport). Champs requis marqués
- **Ajout catégorie**: Dialog (nom, icône Lucide, budget mensuel, couleur camembert)
- **Filtre liste**: Select mois → rechargement Inertia. Label associé au select
- **Confirmation suppression**: Dialog "Supprimer [élément] ?" + boutons Confirmer/Annuler
- **Dialog focus management**: auto-focus sur le premier champ (ou bouton "Confirmer" pour les confirmations), retour focus au déclencheur à la fermeture, `Escape` ferme

## Accessibility Floor

- **Skip navigation link**: premier élément focusable. Pattern: `<a href="#main-content">Aller au contenu principal</a>` (sr-only, visible au focus)
- **Landmarks**: `<nav>` pour sidebar, `<main id="main-content">` pour contenu, `<header>` pour top bar
- **Heading hierarchy**: chaque page a un h1 unique. h2 pour les sections. h3 pour les sous-sections
- **Sidebar liens**: `aria-current="page"` sur le lien actif. Icônes décoratives `aria-hidden="true"`
- **Hamburger mobile**: `aria-label="Ouvrir le menu"`, `aria-expanded`, `aria-controls` sur le bouton. Panneau avec `aria-hidden` quand fermé
- **Dialogs**: focus trap géré par Base UI. Auto-focus premier champ. Retour focus au déclencheur à la fermeture. Escape ferme
- **Formulaires**: label/input via htmlFor/id (shadcn Field). `aria-invalid="true"` + `aria-describedby` pour les erreurs. `aria-required="true"` sur les champs obligatoires
- **Chargement**: Skeleton `aria-busy="true"` sur le conteneur. `aria-live="polite"` pour les mises à jour asynchrones
- **Graphiques Recharts (≥ 3.0)**: `accessibilityLayer={true}` pour navigation clavier et aria-labels. `role="application"` sur les conteneurs
- **Toasts Sonner**: `role="status"` + `aria-live="polite"` (géré nativement par Sonner)
- **Contraste**: shadcn tokens WCAG AA. `--muted-foreground` réservé aux textes non interactifs
- **Touch targets**: ≥ 44x44px sur les éléments interactifs (boutons, icônes cliquables). WCAG 2.5.8 minimum 24x24px
- **Reduced motion**: `prefers-reduced-motion` respecté. Transitions sidebar et animations graphiques désactivées si l'utilisateur le demande
- **Focus indicators**: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` (shadcn par défaut)

## Responsive & Platform

| Breakpoint | Comportement |
|---|---|
| `≥ lg` (1024px+) | Sidebar visible. Layout 2 colonnes (Crédits, Investissements). Tableaux complets |
| `md` (768–1023px) | Sidebar réduite aux icônes. Layout 1 colonne |
| `< md` (sm) | Sidebar → hamburger sheet. Dialog → full-screen. Graphiques empilés verticalement |
| Touch | Tap pour ouvrir les détails (pas de hover-only). `focus-visible`rings visibles |

## Key Flows

### UJ-1: Rohenha configure son budget

1. Navigue vers Budget → liste vide avec message "Aucune catégorie"
2. Clique "Ajouter catégorie" → Dialog avec champs nom, icône Lucide (select visuel), budget mensuel, couleur
3. Ajoute "Logement" (icône house, 1500€), "Alimentation" (utensils, 500€), "Transport" (car, 200€)
4. **Climax**: Le camembert s'affiche avec les 3 catégories, le total budgété apparaît en bas. Les catégories sont prêtes à recevoir des dépenses
5. **Failure**: Si une catégorie avec le même nom existe déjà, toast "Cette catégorie existe déjà" et le dialog reste ouvert

### UJ-2: Rohenha ajoute une dépense manuelle

1. Navigue vers Dépenses → clique "Ajouter"
2. Dialog s'ouvre. Auto-focus sur le champ libellé. Date = aujourd'hui, catégorie = dernière utilisée
3. Remplit libellé et montant. Les champs requis (`aria-required`) sont marqués
4. **Climax**: Submit → toast "Dépense ajoutée". Dialog fermé. La ligne apparaît dans la liste. Le graphique barres se met à jour. Le total budgété dans Budget est recalculé
5. **Failure**: Montant invalide → message inline sous le champ, `aria-invalid` et `aria-describedby` activés, dialog reste ouvert. Le focus reste sur le champ en erreur

### UJ-3: Rohenha importe ses relevés Crédit Agricole

1. Dashboard → clique "Importer CSV"
2. Select fichier (input type="file" avec label "Fichier CSV Crédit Agricole"). Preview 3 lignes affichées dans une table avec en-têtes
3. **Climax**: Confirme → traitement serveur → toast "15 lignes importées, 1 erreur" avec détails. Les dépenses apparaissent dans la liste, les catégories sont rattrapées automatiquement par matching libellé
4. **Failure**: Format invalide → toast `variant: destructive` avec "Fichier non reconnu. Vérifie le format CSV Crédit Agricole"

### UJ-4: Rohenha enregistre un crédit immobilier

1. Navigue vers Crédits → récap vide avec message
2. Clique "Ajouter crédit" → Dialog: libellé, montant total, apport initial, taux annuel, durée (mois), date début, mensualité (calculée auto ou manuelle)
3. Remplit "Appartement" (250000€, apport 50000€, taux 3.5%, 180 mois)
4. **Climax**: Submit → le crédit apparaît dans la liste avec mensualité, taux, reste dû. Le récap gauche se met à jour : "Total dû : 200000€ | Intérêts : 62345€"
5. **Failure**: Taux ou durée invalide → message inline. Confirmation suppression si tentative de suppression

### UJ-5: Rohenha enregistre un achat d'action

1. Navigue vers Investissements → "Ajouter achat"
2. Sélectionne un support existant ou ajoute d'abord le support (nom, symbole, type PEA/AV/CTO, frais, lien optionnel)
3. Dialog achat: quantité, prix unitaire, frais, date. `aria-required` sur tous les champs
4. **Climax**: Le prix moyen pondéré est recalculé (AD-5). La ligne apparaît dans l'historique. La valeur du support et le camembert se mettent à jour. Le dashboard reflète le nouveau total
5. **Failure**: API Yahoo Finance indisponible → pas de prix actuel. La valeur affichée utilise le dernier prix connu avec badge "Prix non mis à jour"

### UJ-6: Rohenha achète une crypto

1. Navigue vers Cryptos → pattern identique Investissements
2. Ajoute "Bitcoin" (symbole BTC) avec frais de plateforme et wallet de stockage
3. Saisit l'achat: 0.5 BTC à 45000€
4. **Climax**: Prix moyen pondéré mis à jour. La valeur crypto apparaît dans le dashboard
5. **Failure**: API CoinGecko indisponible → fallback au dernier prix avec badge warning

### UJ-7: Rohenha vérifie son patrimoine mensuel

1. Dashboard → cartes indicateurs avec patrimoine net, solde banque, investissements, cryptos, crédits, charges du mois
2. Scrolle au graphique LineChart → voit la tendance par mois sur les 12 derniers mois
3. **Climax**: Vue d'ensemble consolidée : le graphique montre clairement la progression, les cartes résument les chiffres clés. Rohenha peut identifier les mois où les dépenses ont dépassé les revenus
4. **Failure**: Une source de données échoue (ex: crypto) → les cartes réussies restent affichées, la carte crypto affiche "Données indisponibles" avec le dernier prix connu
