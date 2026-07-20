---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
inputDocuments:
  - prds/prd-budget-tracker-2026-07-19/prd.md
  - architecture/architecture-budget-tracker-2026-07-19/ARCHITECTURE-SPINE.md
  - ux-designs/ux-budget-tracker-2026-07-19/DESIGN.md
  - ux-designs/ux-budget-tracker-2026-07-19/EXPERIENCE.md
---

# Budget Tracker - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Budget Tracker, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: Gestion des catégories — CRUD catégories (label, slug auto-généré modifiable, icône Lucide, montant budgété mensuel). Catégorie "Autre" créée par défaut. Dépenses importées sans catégorie ou slug inconnu → "Autre". Slug unique comme référence import CSV. Budget prévisionnel affiché et comparé au réel.

FR-2: Graphique de répartition par catégorie — camembert dépenses du mois par catégorie avec comparaison réel vs budgété. Chaque catégorie = part avec icône et pourcentage. Au clic/survol : montant dépensé vs montant budgété.

FR-3: Règles de dépenses obligatoires — définition règle (libellé, regex matching case-insensitive, type entrée/sortie, montant prévisionnel). Dépense importée matchant la regex → marquée "obligatoire".

FR-4: Suivi des charges obligatoires — liste dépenses obligatoires du mois, statut (débité/non débité), montant réel vs prévisionnel. Lignes débitées marquées visuellement. Coche manuelle. Totaux affichés.

FR-5: Liste des dépenses — tableau (date, libellé, montant formaté EUR, catégorie, type +/- , description). Tri par date (récent → ancien par défaut).

FR-6: Ajout manuel d'une dépense — formulaire (date, libellé, montant, catégorie sélection depuis catégories existantes, description optionnelle). Soumission crée la dépense et liste mise à jour.

FR-7: Import CSV format Crédit Agricole — séparateur `;`, colonnes Date (DD/MM/YYYY), Date valeur, Libellé, Débit euros, Crédit euros, Catégorie (slug). Parsing validation des colonnes. Si slug absent/inconnu → créée sans catégorie.

FR-8: Filtres par durée — journalier, hebdomadaire, mensuel (défaut), personnalisé. Liste et graphiques mis à jour selon période.

FR-9: Graphique des dépenses par jour — barres du total dépensé par jour pour la période. Moyenne mensuelle affichée en ligne de référence.

FR-10: Liste des crédits immobiliers — récap (total remboursement, total intérêts payés, total apport initial). Par crédit : montant, apport, taux, durée, mensualité, intérêts totaux. Calcul amortissement français.

FR-11: Ajout d'un crédit — popin (libellé, montant emprunté, apport initial/frais, taux annuel %, durée en mois, date début). Mensualité calculée automatiquement ou saisie. Apport ajouté au coût total.

FR-12: Modification / Suppression d'un crédit — clic → modifier paramètres ou supprimer (confirmation). Recalcul tableau d'amortissement. Suppression retire du patrimoine.

FR-13: Liste des supports d'investissement — nom, type (PEA, Assurance Vie, Compte Titres, CTO…), lieu stockage, évolution %, valeur actuelle, plus/moins-value tenant compte des frais. Prix actuels via API.

FR-14: Ajout d'un support — popin (ID/symbole, titre, type, lieu stockage, frais annuels %, description, lien externe). Prix actuel via API.

FR-15: Ajout d'un achat sur un support — date, quantité, prix unitaire, frais achat. Coût moyen pondéré recalculé (AD-5).

FR-16: Ajout d'une vente sur un support — date, quantité, prix unitaire, frais vente. Plus/moins-value réalisée enregistrée.

FR-17: Détail d'un support — historique transactions, lieu stockage, frais, lien externe cliquable (nouvel onglet), toutes métadonnées.

FR-18: Graphique de répartition investissements — camembert valeur totale par support.

FR-19: Liste des cryptos — nom, lieu stockage, évolution %, valeur actuelle, plus/moins-value, frais.

FR-20: Ajout d'une crypto — popin (ID CoinGecko, titre, lieu stockage, frais annuels %, description). Prix via CoinGecko.

FR-21: Ajout d'un achat crypto — identique FR-15.

FR-22: Ajout d'une vente crypto — identique FR-16.

FR-23: Détail d'une crypto — historique, lieu stockage, frais, lien CoinGecko.

FR-24: Graphique de répartition crypto — camembert.

FR-25: Vue synthétique du patrimoine (dashboard) — indicateurs : solde banque, valeur investissements, valeur cryptos, total crédits (restant dû + apports), total charges obligatoires mois, patrimoine net = (banque + investissements + crypto) - (crédits restants + apports). Mise à jour après chaque modification.

FR-26: Import CSV depuis le dashboard — bouton → file picker → parse → dépenses créées.

FR-27: Rafraîchissement des prix — prix actuels cryptos (CoinGecko) et investissements au chargement. Fallback dernier prix connu avec indicateur visuel si API indisponible.

FR-28: DCA quick-add investissement — modale support existant, date, montant → API fetch prix historique → achat créé.

FR-29: DCA quick-add crypto — même mécanisme FR-28 via CoinGecko.

### NonFunctional Requirements

NFR1: Clés API (CoinGecko, Yahoo Finance) stockées côté serveur, jamais exposées au client (AD-3).

NFR2: Parsing CSV côté serveur avec validation stricte — prévention injections (AD-2).

NFR3: Données stockées en base MySQL via AdonisJS ORM (Lucid) — pas de stockage fichier local.

NFR4: Authentification existante (session/JWT) protège tous les endpoints — pas d'accès non authentifié.

NFR5: Dashboard load time < 2 secondes (SM-C1).

NFR6: Application unilingue français — pas d'i18n en v1.

NFR7: Aucun store client — données transitent uniquement par Inertia (AD-1). Pas de Zustand, Redux, React Query, fetch direct.

NFR8: Prix moyen pondéré calculé à la volée par query agrégée pour plus/moins-value (AD-5).

### Additional Requirements (Architecture)

AD-1: Architecture MVC AdonisJS + Inertia — server-driven UI. Contrôleurs → Lucid ORM → props Inertia → React déclaratif. Pas de state global client.

AD-2: Parsing CSV avec csv-parse et validation VineJS côté serveur uniquement.

AD-3: Appels API (yahoo-finance2, CoinGecko) depuis services AdonisJS côté serveur.

AD-5: Prix moyen pondéré = `SUM(quantité * prix_unitaire + frais) / SUM(quantité)` à la volée. Vente réduit quantité sans affecter coût unitaire achats restants.

Conventions: controllers snake_case, models PascalCase, routes kebab-case, tables snake_case pluriel, clés étrangères snake_case, validation VineJS dans `app/validators/`, dates Luxon DateTime, slugs auto-générés modifiables uniques, montants DECIMAL(10,2) formatés Intl.NumberFormat EUR, type ENUM('entree', 'sortie').

Stack technique: Node.js >=24, AdonisJS 7.3.3, React 19.2.6, TS 6.0.3, Lucid ORM 22.4.2, Inertia.js 4.2.0/2.3.24, Tailwind 4.3.3, Base UI 1.6.0, shadcn CLI 4.13.1, MySQL 8+, VineJS 4.4.0, Luxon 3.7.2, Lucide React 1.25.0, Sonner 2.0.7, yahoo-finance2 4.0.0, Recharts 3.9.2, csv-parse 7.0.1.

Structure projet: controllers (session, new_account, categorie, depense, credit, support_investissement, crypto, dashboard), models (user, categorie, depense, credit, support_investissement, achat_investissement, vente_investissement, crypto, achat_crypto, vente_crypto), services (csv_import, prix_investissement, prix_crypto, patrimoine), migrations pour chaque table.

**Retiré du MVP :** FR-3 (Règles dépenses obligatoires) et FR-4 (Suivi charges obligatoires) — exclus du périmètre. À repenser ultérieurement.

### UX Design Requirements

UX-DR1: Design tokens — implémenter les variables CSS oklch (light/dark) pour tous les tokens (background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1 à 5, sidebar).

UX-DR2: Typographie — charger Inter Variable via `@fontsource-variable/inter`. Headings = même police que corps. Hiérarchie : h1 text-xl, h2 text-lg, h3 text-base, titres cartes text-sm font-semibold.

UX-DR3: Layout public (home/login/signup) — header fixe top bar, pt-24 pour le main. Layout authentifié — sidebar gauche 16rem, contenu droit.

UX-DR4: shadcn Card — en-tête + contenu + pied. Cartes indicateurs dashboard, cartes récap.

UX-DR5: shadcn Dialog — popins ajout/édition. Full-screen mobile. Focus trap (Base UI), auto-focus premier champ, retour focus déclencheur à fermeture. Escape ferme.

UX-DR6: shadcn Select — filtres (mois, catégorie).

UX-DR7: shadcn Table — listes paginées (dépenses, crédits). Ligne cliquable.

UX-DR8: Sonner Toast — notifications succès/erreur. role="status" + aria-live="polite".

UX-DR9: Skeleton — écrans chargement. aria-busy="true" sur conteneur parent.

UX-DR10: Recharts — LineChart (évolution patrimoine), PieChart (répartitions), BarChart (dépenses/jour). Recharts >= 3.0 avec accessibilityLayer={true}.

UX-DR11: File upload — input type="file" avec label explicitant format CSV Crédit Agricole.

UX-DR12: Skip navigation link — premier élément focusable, "Aller au contenu principal". Visuellement caché, visible au focus.

UX-DR13: Sidebar — icône Lucide aria-hidden="true" + label. Lien actif aria-current="page". Rétractable hamburger mobile (aria-label, aria-expanded, aria-controls).

UX-DR14: State patterns — Loading (Skeleton + aria-busy), Empty (CTA centré), Error API (Toast destructive), Error CSV (Toast liste lignes erreur + role="alert"), Error validation (inline aria-describedby aria-invalid), Suppression (Dialog confirmation), Données obsolètes (badge warning), Échec partiel (Toast erreur + données réussies préservées).

UX-DR15: CSV import flow — upload → preview 3 premières lignes → confirmer ou annuler. Traitement serveur. Résultat via toast.

UX-DR16: Accessibility — landmarks (nav, main#main-content, header), heading hierarchy (h1 unique par page), focus trap Base UI dialogs, aria-required sur champs obligatoires, aria-describedby erreurs, skeleton aria-busy, Sonner aria-live, Recharts accessibilityLayer, touch targets >= 44x44px, prefers-reduced-motion, focus-visible:ring-2.

UX-DR17: Responsive breakpoints — ≥lg (1024px+) sidebar visible, 2 colonnes. md (768-1023px) sidebar icônes only, 1 colonne. <md hamburger sheet, dialog full-screen, graphiques empilés.

UX-DR18: Confirmation suppression — Dialog "Supprimer [élément] ?" + boutons Confirmer (destructive) / Annuler.

UX-DR19: Interaction primitives — ajout dépense Dialog (date picker natif, libellé text, montant number decimal, catégorie select). Ajout investissement/crypto Dialog (support select/autocomplete, quantité, prix, frais, date). Ajout crédit Dialog (montant, taux, durée, date début, apport). Ajout catégorie Dialog (nom, icône Lucide, budget, couleur). Filtre Select mois.

UX-DR20: Couleur camembert par catégorie — champ couleur dans formulaire ajout catégorie.

UX-DR21: Indicateur visuel "Prix non mis à jour" — badge warning sur carte quand fallback prix utilisé (FR-27).

UX-DR22: --muted-foreground light mode ~3.4:1 ne passe pas WCAG AA pour textes < 18px. Réservé textes non interactifs (placeholders, timestamps, secondaires).

### FR Coverage Map

FR-1: Epic 1 — Gestion des catégories (CRUD + slug + icône + budget)
FR-2: Epic 1 — Graphique répartition par catégorie (camembert)
FR-5: Epic 2 — Liste des dépenses (tableau + tri)
FR-6: Epic 2 — Ajout manuel d'une dépense (formulaire)
FR-7: Epic 2 — Import CSV Crédit Agricole
FR-8: Epic 2 — Filtres par durée (journalier/hebdo/mensuel/perso)
FR-9: Epic 2 — Graphique dépenses par jour (barres + moyenne)
FR-10: Epic 3 — Liste des crédits immobiliers (récap + amortissement)
FR-11: Epic 3 — Ajout d'un crédit (popin + calcul mensualité)
FR-12: Epic 3 — Modification / Suppression d'un crédit
FR-13: Epic 4 — Liste des supports d'investissement
FR-14: Epic 4 — Ajout d'un support d'investissement
FR-15: Epic 4 — Ajout d'un achat sur support
FR-16: Epic 4 — Ajout d'une vente sur support
FR-17: Epic 4 — Détail d'un support
FR-18: Epic 4 — Graphique répartition investissements
FR-19: Epic 5 — Liste des cryptos
FR-20: Epic 5 — Ajout d'une crypto
FR-21: Epic 5 — Ajout d'un achat crypto
FR-22: Epic 5 — Ajout d'une vente crypto
FR-23: Epic 5 — Détail d'une crypto
FR-24: Epic 5 — Graphique répartition crypto
FR-25: Epic 6 — Vue synthétique du patrimoine (dashboard)
FR-26: Epic 6 — Import CSV depuis le dashboard
FR-27: Epic 6 — Rafraîchissement des prix (CoinGecko + API)
FR-28: Epic 6 — DCA quick-add investissement
FR-29: Epic 6 — DCA quick-add crypto

## Epic List

### Epic 1: Budget et Catégories

L'utilisateur configure ses catégories de dépenses/revenus avec label, slug, icône Lucide et budget mensuel. Visualise la répartition des dépenses via un camembert réel vs budgété. La catégorie "Autre" existe par défaut.
**FRs couverts :** FR-1, FR-2

### Epic 2: Gestion des Dépenses

L'utilisateur gère ses dépenses quotidiennes : ajout manuel, import CSV Crédit Agricole, filtres par durée. Visualise les dépenses par jour via graphique barres avec moyenne mensuelle.
**FRs couverts :** FR-5, FR-6, FR-7, FR-8, FR-9

### Epic 3: Crédits Immobiliers

L'utilisateur gère ses crédits immobiliers avec calcul d'amortissement français. Visualise le récapitulatif (total dû, intérêts, apport initial) et modifie/supprime les crédits.
**FRs couverts :** FR-10, FR-11, FR-12

### Epic 4: Investissements

L'utilisateur gère ses supports d'investissement (actions, ETFs) avec achats/ventes, prix via yahoo-finance2, et visualise la répartition du portefeuille.
**FRs couverts :** FR-13, FR-14, FR-15, FR-16, FR-17, FR-18

### Epic 5: Cryptomonnaies

L'utilisateur gère ses cryptos avec achats/ventes, prix via CoinGecko. Utilise le même pattern AssetTransactionService que les investissements.
**FRs couverts :** FR-19, FR-20, FR-21, FR-22, FR-23, FR-24

### Epic 6: Dashboard et Vue d'Ensemble

L'utilisateur consacre son patrimoine net en un coup d'œil : indicateurs synthétiques, import CSV rapide, DCA quick-add. Prix rafraîchis automatiquement avec fallback.
**FRs couverts :** FR-25, FR-26, FR-27, FR-28, FR-29

## Epic 1: Budget et Catégories

L'utilisateur configure ses catégories de dépenses/revenus avec label, slug, icône Lucide et budget mensuel. Visualise la répartition des dépenses via un camembert réel vs budgété. La catégorie "Autre" existe par défaut.
**FRs couverts :** FR-1, FR-2

### Story 1.0: Mise en place des fondations UI

As a utilisateur,
I want que l'interface soit cohérente, accessible et responsive,
So que naviguer confortablement sur tous les écrans.

**Acceptance Criteria:**

**Given** l'application est chargée (layout authentifié)
**When** le rendu est effectué
**Then** les tokens CSS oklch (light/dark) sont appliqués (UX-DR1)
**And** Inter Variable est chargée via @fontsource-variable/inter (UX-DR2)
**And** la typographie suit la hiérarchie : h1 text-xl, h2 text-lg, h3 text-base, titres cartes text-sm font-semibold

**Given** un utilisateur sur une page authentifiée
**When** la page s'affiche
**Then** la sidebar gauche (shadcn width ~16rem) est présente avec icônes Lucide (aria-hidden) et labels (UX-DR3, UX-DR13)
**And** le lien actif a aria-current="page"
**And** un skip nav link "Aller au contenu principal" est le premier élément focusable (UX-DR12)

**Given** un utilisateur sur mobile (<768px)
**When** la sidebar est masquée
**Then** un hamburger button avec aria-label="Ouvrir le menu", aria-expanded, aria-controls est affiché
**And** le panneau latéral a aria-hidden quand fermé

**Given** une page en chargement
**When** les données ne sont pas encore disponibles
**Then** des Skeleton shadcn sont affichés avec aria-busy="true" sur le conteneur (UX-DR9)

**Given** un utilisateur avec prefers-reduced-motion
**When** des animations sont présentes
**Then** les animations sont désactivées (transitions sidebar, graphiques)

**Given** le texte en --muted-foreground est utilisé
**When** il s'agit d'un texte interactif (<18px)
**Then** ce token n'est pas utilisé — réservé aux placeholders, timestamps, textes secondaires non interactifs (UX-DR22)

**Given** un composant page_state global est défini
**When** une page a besoin d'afficher un état loading, empty ou error
**Then** page_state est utilisé avec les props loading, empty (titre + message + CTA), error (message + action), children
**And** chaque page personnalise le texte du titre et message empty/error via les props
**And** l'état loading utilise shadcn Skeleton avec aria-busy="true"
**And** l'état error utilise shadcn Toast (variant destructive) pour les erreurs API/CSV
**And** l'état empty affiche un message centré avec un CTA

**Given** le projet utilise shadcn/ui
**When** un composant UI est nécessaire
**Then** les composants shadcn existants (Card, Dialog, Select, Table, Skeleton, Toast/Sonner, Chart/Recharts) sont prioritaires
**And** shadcn CLI est utilisé pour ajouter tout composant manquant — pas de réimplémentation custom

### Story 1.1: Création et configuration des catégories

As a utilisateur,
I want créer, modifier et supprimer des catégories avec label, slug, icône Lucide et budget mensuel,
So that structurer mes finances par catégorie.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur la page Budget
**When** il clique "Ajouter catégorie"
**Then** un Dialog shadcn s'ouvre avec les champs nom, icône Lucide (sélection visuelle), budget mensuel, couleur camembert
**And** la soumission crée la catégorie et elle apparaît dans la liste

**Given** la catégorie "Autre" n'existe pas
**When** l'utilisateur accède à la page Budget pour la première fois
**Then** la catégorie "Autre" est créée automatiquement avec slug "autre"

**Given** une dépense importée avec slug de catégorie inconnu ou vide
**When** l'import CSV est traité
**Then** la dépense est affectée à la catégorie "Autre"

**Given** un utilisateur modifie une catégorie existante
**When** il change le budget mensuel
**Then** le slug reste inchangé sauf modification explicite
**And** le slug est unique

**Given** un utilisateur supprime une catégorie
**When** il confirme la suppression
**Then** les dépenses liées sont réaffectées à "Autre"

### Story 1.2: Graphique de répartition par catégorie

As a utilisateur,
I want voir un camembert de répartition des dépenses par catégorie,
So que comprendre où va mon argent.

**Acceptance Criteria:**

**Given** des dépenses existantes dans le mois en cours
**When** l'utilisateur consulte la page Budget
**Then** un camembert Recharts affiche chaque catégorie avec son icône et pourcentage
**And** le total budgété vs le total réel est affiché

**Given** l'utilisateur survole/clique une part du camembert
**When** l'interaction est détectée
**Then** le montant dépensé vs le montant budgété pour cette catégorie est affiché

**Given** aucune dépense dans le mois
**When** l'utilisateur consulte la page Budget
**Then** le graphique est vide avec message d'état approprié

## Epic 2: Gestion des Dépenses

L'utilisateur gère ses dépenses quotidiennes : ajout manuel, import CSV Crédit Agricole, filtres par durée. Visualise les dépenses par jour via graphique barres avec moyenne mensuelle.
**FRs couverts :** FR-5, FR-6, FR-7, FR-8, FR-9

### Story 2.1: Liste et filtres des dépenses

As a utilisateur,
I want voir mes dépenses dans une liste paginée avec filtres par durée,
So that suivre mes dépenses du mois.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur la page Dépenses
**When** la page se charge
**Then** une Table shadcn paginée affiche les colonnes : date, libellé, montant formaté EUR, catégorie, type (+/-), description
**And** le tri est par date décroissante par défaut

**Given** un filtre par durée (Select)
**When** l'utilisateur sélectionne journalier, hebdomadaire, mensuel ou personnalisé
**Then** la liste et les totaux sont mis à jour selon la période

**Given** aucun résultat pour la période
**When** la liste est vide
**Then** un message d'état vide "Aucune dépense pour cette période" est affiché

### Story 2.2: Ajout manuel d'une dépense

As a utilisateur,
I want ajouter une dépense manuellement via un formulaire,
So that enregistrer une dépense non couverte par l'import CSV.

**Acceptance Criteria:**

**Given** un utilisateur sur la page Dépenses
**When** il clique "Ajouter"
**Then** un Dialog shadcn s'ouvre avec les champs : date (aujourd'hui par défaut), libellé, montant (décimal), catégorie (select depuis catégories existantes), description (optionnelle)
**And** auto-focus sur le champ libellé

**Given** le formulaire est soumis avec des champs valides
**When** la requête Inertia est traitée
**Then** un Toast "Dépense ajoutée" s'affiche
**And** le Dialog se ferme
**And** la liste des dépenses se met à jour

**Given** le montant est invalide (négatif, zéro, non numérique)
**When** la soumission échoue la validation VineJS
**Then** un message d'erreur inline s'affiche sous le champ avec aria-invalid et aria-describedby
**And** le Dialog reste ouvert, focus sur le champ en erreur

### Story 2.3: Import CSV avec revue et édition

As a utilisateur,
I want importer un fichier CSV Crédit Agricole et pouvoir modifier les valeurs avant validation,
So that corriger les erreurs de parsing ou ajuster les catégories sans ressaisir.

**Acceptance Criteria:**

**Given** un utilisateur sur la page Dépenses ou Dashboard
**When** il clique "Importer CSV"
**Then** un file picker s'ouvre avec label indiquant le format attendu (CSV Crédit Agricole, séparateur `;`)

**Given** un fichier CSV sélectionné et parsé par le serveur
**When** la preview s'affiche
**Then** un tableau éditable présente les lignes parsées (date, libellé, montant, type, catégorie)
**And** chaque ligne a un select pour choisir/modifier la catégorie
**And** chaque ligne a des champs pour modifier libellé et montant

**Given** des lignes en erreur de parsing
**When** la preview s'affiche
**Then** les lignes en erreur sont mises en évidence avec le détail du champ invalide (role="alert")

**Given** l'utilisateur a modifié des valeurs dans la preview
**When** il clique "Confirmer l'import"
**Then** les données modifiées sont envoyées au serveur pour validation finale
**And** un Toast affiche "X lignes importées, Y erreurs"

**Given** l'utilisateur clique "Annuler"
**When** la preview est affichée
**Then** aucune donnée n'est importée

### Story 2.4: Graphique des dépenses par jour

As a utilisateur,
I want voir un graphique barres du total dépensé par jour,
So que visualiser ma consommation quotidienne.

**Acceptance Criteria:**

**Given** des dépenses dans la période courante
**When** l'utilisateur consulte la page Dépenses
**Then** un BarChart Recharts affiche le total dépensé par jour
**And** une ligne de référence indique la moyenne mensuelle

**Given** aucune dépense dans la période
**When** le graphique est rendu
**Then** un état vide approprié est affiché

## Epic 3: Crédits Immobiliers

L'utilisateur gère ses crédits immobiliers avec calcul d'amortissement français. Visualise le récapitulatif (total dû, intérêts, apport initial) et modifie/supprime les crédits.
**FRs couverts :** FR-10, FR-11, FR-12

### Story 3.1: Liste et récapitulatif des crédits

As a utilisateur,
I want voir la liste de mes crédits immobiliers avec un récapitulatif,
So que connaître le coût total de mes emprunts.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur la page Crédits
**When** la page se charge
**Then** une colonne gauche affiche le récapitulatif : total remboursement, total intérêts payés, total apport initial
**And** une colonne droite liste chaque crédit (montant, apport, taux, durée, mensualité, intérêts totaux)

**Given** des crédits existent
**When** le récapitulatif est calculé
**Then** le total dû inclut l'apport initial + somme des mensualités

**Given** aucun crédit enregistré
**When** la page est affichée
**Then** un message vide "Ajoute ton premier crédit immobilier" avec CTA est affiché

### Story 3.2: Ajout d'un crédit

As a utilisateur,
I want ajouter un crédit immobilier avec calcul automatique de la mensualité,
So que suivre mes emprunts.

**Acceptance Criteria:**

**Given** un utilisateur sur la page Crédits
**When** il clique "Ajouter crédit"
**Then** un Dialog s'ouvre avec les champs : libellé, montant emprunté, apport initial/frais, taux annuel %, durée (mois), date début, mensualité (calculée auto ou saisie manuelle)

**Given** le formulaire est soumis
**When** les données sont valides
**Then** le crédit est créé avec son tableau d'amortissement calculé
**And** le récapitulatif gauche se met à jour
**And** un Toast "Crédit ajouté" s'affiche

**Given** l'apport initial est renseigné
**When** le crédit est créé
**Then** l'apport est inclus dans le coût total du crédit

### Story 3.3: Modification et suppression d'un crédit

As a utilisateur,
I want modifier ou supprimer un crédit existant,
So que mettre à jour mes emprunts.

**Acceptance Criteria:**

**Given** un crédit existant dans la liste
**When** l'utilisateur clique sur le crédit
**Then** un Dialog de modification s'ouvre avec les paramètres actuels pré-remplis

**Given** les paramètres sont modifiés
**When** le formulaire est soumis
**Then** le tableau d'amortissement est recalculé
**And** le récapitulatif est mis à jour

**Given** l'utilisateur clique "Supprimer"
**When** la confirmation est affichée
**Then** un Dialog "Supprimer [libellé] ?" avec bouton Confirmer (destructive) et Annuler s'affiche

**Given** la suppression est confirmée
**When** le crédit est supprimé
**Then** le crédit est retiré du calcul du patrimoine
**And** un Toast "Crédit supprimé" s'affiche

## Epic 4: Investissements

L'utilisateur gère ses supports d'investissement (actions, ETFs) avec achats/ventes, prix via yahoo-finance2, et visualise la répartition du portefeuille.
**FRs couverts :** FR-13, FR-14, FR-15, FR-16, FR-17, FR-18

### Story 4.1: Liste des supports et répartition

As a utilisateur,
I want voir la liste de mes supports d'investissement avec leur valeur et répartition,
So que suivre mon portefeuille.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur la page Investissements
**When** la page se charge
**Then** une Table liste les supports (nom, type PEA/AV/CTO, lieu stockage, évolution %, valeur actuelle, plus/moins-value)
**And** un camembert Recharts affiche la répartition de la valeur totale par support

**Given** aucun support enregistré
**When** la page est affichée
**Then** un message vide "Ajoute ton premier support" avec CTA s'affiche

**Given** l'API de prix (yahoo-finance2) est indisponible
**When** la valeur actuelle ne peut pas être récupérée
**Then** le dernier prix connu est affiché avec un badge warning "Prix non mis à jour"

### Story 4.2: Ajout d'un support d'investissement

As a utilisateur,
I want ajouter un support d'investissement avec ses métadonnées,
So que suivre un nouvel actif.

**Acceptance Criteria:**

**Given** un utilisateur sur la page Investissements
**When** il clique "Ajouter support"
**Then** un Dialog s'ouvre avec les champs : symbole/ID (ex: AAPL), titre, type (select PEA/AV/CTO), lieu stockage, frais annuels %, description, lien externe

**Given** le symbole est renseigné
**When** le support est créé
**Then** le prix actuel est récupéré via yahoo-finance2 (service serveur, AD-3)
**And** les frais sont enregistrés pour le calcul de performance

> **Tâche technique — AssetTransactionService**
> Service partagé (Investissements + Cryptos) pour transactions achat/vente avec prix moyen pondéré.
>
> - Formule AD-5 : `SUM(quantité * prix_unitaire + frais) / SUM(quantité)`
> - Vente réduit quantité sans affecter coût unitaire achats restants
> - Validateur VineJS partagé pour date, quantité, prix unitaire, frais
> - Implémentée pendant Story 4.4, réutilisée par Story 5.3

### Story 4.4: Achats et ventes sur un support

As a utilisateur,
I want enregistrer un achat ou une vente sur un support,
So que suivre mes transactions et ma plus/moins-value.

**Acceptance Criteria:**

**Given** un support existant
**When** l'utilisateur clique "Ajouter achat"
**Then** un Dialog s'ouvre (asset, date, quantité, prix unitaire, frais d'achat)

**Given** l'utilisateur clique "Ajouter vente"
**When** le formulaire est soumis
**Then** le prix moyen pondéré est recalculé
**And** la plus/moins-value réalisée est enregistrée

**Given** une tentative de vente avec quantité > quantité possédée
**When** la validation échoue
**Then** un message d'erreur inline s'affiche "Quantité insuffisante"

### Story 4.5: Détail d'un support

As a utilisateur,
I want voir le détail complet d'un support avec son historique,
So que analyser la performance de mon investissement.

**Acceptance Criteria:**

**Given** un support dans la liste
**When** l'utilisateur clique sur le support
**Then** le détail affiche : type, lieu stockage, frais, lien externe cliquable (nouvel onglet), historique complet des transactions

**Given** le lien externe est présent
**When** l'utilisateur clique sur le lien
**Then** le lien s'ouvre dans un nouvel onglet

## Epic 5: Cryptomonnaies

L'utilisateur gère ses cryptos avec achats/ventes, prix via CoinGecko. Réutilise le pattern AssetTransactionService (tâche technique partagée).
**FRs couverts :** FR-19, FR-20, FR-21, FR-22, FR-23, FR-24

### Story 5.1: Liste des cryptos et répartition

As a utilisateur,
I want voir la liste de mes cryptos avec valeur et répartition,
So que suivre mon portefeuille crypto.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur la page Cryptos
**When** la page se charge
**Then** une Table liste les cryptos (nom, lieu stockage, évolution %, valeur actuelle, plus/moins-value, frais)
**And** un camembert Recharts affiche la répartition

**Given** l'API CoinGecko est indisponible
**When** la valeur ne peut pas être récupérée
**Then** le dernier prix connu est affiché avec badge warning "Prix non mis à jour"

### Story 5.2: Ajout d'une crypto

As a utilisateur,
I want ajouter une crypto avec son ID CoinGecko,
So que suivre un nouvel actif crypto.

**Acceptance Criteria:**

**Given** un utilisateur sur la page Cryptos
**When** il clique "Ajouter crypto"
**Then** un Dialog s'ouvre : ID CoinGecko (ex: bitcoin), titre, lieu stockage, frais annuels %, description

**Given** l'ID CoinGecko est renseigné
**When** la crypto est créée
**Then** le prix actuel est récupéré via CoinGecko (service serveur, AD-3)

### Story 5.3: Achats et ventes de crypto

As a utilisateur,
I want enregistrer un achat ou une vente de crypto,
So que suivre mes transactions crypto.

**Acceptance Criteria:**

**Given** une crypto existante
**When** l'utilisateur ajoute un achat ou une vente
**Then** AssetTransactionService (tâche technique partagée) est utilisé avec les mêmes Dialog et validation

**Given** le prix moyen pondéré est calculé
**When** une transaction est créée
**Then** la valeur et la répartition sont mises à jour

### Story 5.4: Détail d'une crypto

As a utilisateur,
I want voir le détail d'une crypto avec historique,
So que analyser ma position.

**Acceptance Criteria:**

**Given** une crypto dans la liste
**When** l'utilisateur clique dessus
**Then** le détail affiche : historique transactions, lieu stockage, frais, lien CoinGecko cliquable (nouvel onglet)

## Epic 6: Dashboard et Vue d'Ensemble

L'utilisateur consacre son patrimoine net en un coup d'œil : indicateurs synthétiques, import CSV rapide, DCA quick-add. Prix rafraîchis automatiquement avec fallback.
**FRs couverts :** FR-25, FR-26, FR-27, FR-28, FR-29

### Story 6.1: Indicateurs du patrimoine

As a utilisateur,
I want voir en un coup d'œil mon patrimoine net et mes indicateurs clés,
So que savoir où j'en suis financièrement.

**Acceptance Criteria:**

**Given** un utilisateur authentifié sur le Dashboard
**When** la page se charge
**Then** des cartes shadcn affichent : solde banque, valeur investissements, valeur cryptos, total crédits (restant dû + apports), total charges du mois, patrimoine net

**Given** des données existent dans les sections sous-jacentes
**When** le patrimoine net est calculé
**Then** patrimoine net = (banque + investissements + crypto) - (crédits restants + apports initiaux)

**Given** des données de plusieurs mois
**When** le dashboard est affiché
**Then** un LineChart Recharts montre l'évolution du patrimoine par mois

**Given** aucune donnée n'est encore saisie
**When** le dashboard est affiché
**Then** des cartes avec valeur "—" et message "Ajoute tes premières données" sont affichées

### Story 6.2: Import CSV depuis le dashboard

As a utilisateur,
I want importer un fichier CSV directement depuis le dashboard,
So que gagner du temps sans naviguer vers la page Dépenses.

**Acceptance Criteria:**

**Given** un utilisateur sur le Dashboard
**When** il clique "Importer CSV"
**Then** le même flow de la Story 2.3 (upload → preview éditable → confirmation) est déclenché

### Story 6.3: Rafraîchissement des prix et DCA quick-add

As a utilisateur,
I want que les prix de mes investissements et cryptos soient à jour et pouvoir ajouter un achat DCA rapidement,
So que décider en connaissance de cause.

**Acceptance Criteria:**

**Given** le dashboard se charge
**When** les prix sont récupérés
**Then** CoinGecko (cryptos) et yahoo-finance2 (investissements) sont appelés depuis les services serveur (AD-3)

**Given** une API de prix est indisponible
**When** la récupération échoue
**Then** le dernier prix connu est utilisé avec un badge warning "Prix non mis à jour"

**Given** un utilisateur veut ajouter un DCA
**When** il clique "Ajouter un DCA" (investissement ou crypto)
**Then** une modale s'ouvre avec : support existant (select), date, montant
**And** le prix historique est récupéré via API et l'achat est créé automatiquement
