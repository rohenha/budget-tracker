---
title: Budget Tracker
status: final
created: 2026-07-19
updated: 2026-07-19
---

# PRD : Budget Tracker

_Document de travail — à confirmer._

## 0. Objectif du document

Ce PRD définit le périmètre et les exigences fonctionnelles de **Budget Tracker**, une application web de suivi budgétaire et patrimonial open source. Le document est destiné au PM, au développeur, et servira de référence pour la conception UX, l'architecture technique et le découpage en épics et stories.

Stack technique : AdonisJS + React + **shadcn/ui** (composants Base UI). L'authentification est déjà en place. L'application est unilingue **français**. Le parti pris est la **simplicité** maximale — pas de clutter, pas de superflu.

## 1. Vision

Budget Tracker est un tableau de bord personnel complet pour suivre ses finances : dépenses quotidiennes, budget prévisionnel, crédits immobiliers, investissements et cryptomonnaies. L'utilisateur a une vue d'ensemble de son patrimoine en temps réel, avec des graphiques, des historiques et des alertes.

L'objectif est de remplacer les spreadsheets maison par une application structurée, extensible et open source, où l'utilisateur garde le contrôle total de ses données.

## 2. Utilisateur cible

### 2.1 Jobs To Be Done

- Suivre mes dépenses mensuelles et les catégoriser
- Savoir combien j'ai dépensé aujourd'hui / ce mois-ci
- Planifier mon budget en identifiant les charges fixes
- Visualiser l'évolution de mon patrimoine (banque, investissements, crypto, immobilier)
- Suivre la performance de mes investissements (plus/moins-value)
- Gérer mes crédits immobiliers et savoir combien je paie d'intérêts
- Avoir une vue d'ensemble rapide via un dashboard

### 2.2 Non-Utilisateurs (v1)

- Pas de gestion de comptes multiples / famille
- Pas de synchronisation bancaire automatique (pas d'API bancaire)
- Pas d'alertes push ni de notifications

### 2.3 Parcours utilisateur clés

- **UJ-1. Rohenha configure son budget et ses catégories.**
  - **Persona + contexte :** Rohenha veut structurer son suivi financier. Définit les catégories de dépenses et les charges obligatoires.
  - **Entry state :** Page Budget.
  - **Path :** Crée des catégories (label, icône Lucide, montant budgété). Ajoute une règle de dépense obligatoire avec un motif regex et son type (entrée/sortie).
  - **Climax :** Les catégories sont disponibles dans toute l'app. Les dépenses obligatoires sont pistées automatiquement.
  - **Resolution :** Il peut lier les dépenses aux catégories et voir l'état des charges.

- **UJ-2. Rohenha enregistre une dépense.**
  - **Entry state :** Page Dépenses.
  - **Path :** Import CSV (format Crédit Agricole + catégorie slug) ou formulaire manuel (date, libellé, montant, catégorie, description).
  - **Climax :** La dépense apparaît dans la liste et les graphiques se mettent à jour.
  - **Resolution :** Filtre par mois pour voir le total.

- **UJ-3. Rohenha gère ses crédits immobiliers.**
  - **Entry state :** Page Crédits.
  - **Path :** Voir le récapitulatif (total dû, intérêts, apport initial). Ajouter un crédit (montant, apport, taux, durée).
  - **Climax :** Il visualise le coût total du crédit et l'argent déjà investi.
  - **Resolution :** Modification ou suppression d'un crédit.

- **UJ-4. Rohenha vérifie ses investissements.**
  - **Entry state :** Page Investissements.
  - **Path :** Voit la liste des supports (nom, type, lieu, évolution, +/-value). Clique sur un support → détail avec historique, lien externe, frais.
  - **Climax :** Il sait combien chaque support a rapporté/perdu et où il est stocké.
  - **Resolution :** Ajoute un achat/vente ou modifie le support.

- **UJ-5. Rohenha suit ses cryptos.**
  - **Entry state :** Page Cryptos.
  - **Path :** Liste des cryptos avec lieu de stockage, évolution, frais. Détail au clic.
  - **Climax :** Vue consolidée du portefeuille crypto.
  - **Resolution :** Graphique de répartition.

- **UJ-6. Rohenha consulte son dashboard.**
  - **Entry state :** Dashboard (page d'accueil).
  - **Path :** Voit le patrimoine net, soldes, évolution investissements, cours cryptos. Boutons "Importer CSV" et "Ajouter un DCA".
  - **Climax :** Un coup d'œil suffit pour savoir où il en est financièrement.
  - **Resolution :** Actions rapides sans quitter le dashboard.

## 3. Glossaire

- **Catégorie** — Label de classification des dépenses/revenus (Alimentation, Logement, Salaire…). Slug = identifiant unique. Icône Lucide associée. Budget prévisionnel défini.
- **Dépense obligatoire** — Charge fixe non compressible (loyer, électricité, crédit). Identifiée par une règle (regex + direction) dans le Budget.
- **Support** — Actif financier (action, ETF, token crypto). Possède un type (PEA, Assurance Vie, Compte Titres…), un lieu de stockage, des frais, et un lien externe.
- **Achat** — Transaction d'achat sur un support (date, quantité, prix unitaire, frais).
- **Vente** — Transaction de vente (date, quantité, prix unitaire, frais).
- **Crédit** — Prêt immobilier avec montant emprunté, apport initial, taux, durée, mensualité.
- **Patrimoine net** — Total actifs (banque + investissements + crypto) - total passifs (crédits).
- **Plus/moins-value** — Différence entre prix d'achat moyen et prix actuel/vente.

## 4. Fonctionnalités

### 4.1 Budget et Catégories

**Description :** Page de configuration budgétaire. Définition des catégories de dépenses/revenus, et des règles de dépenses obligatoires. Réalise UJ-1.

**Exigences fonctionnelles :**

#### FR-1: Gestion des catégories

L'utilisateur peut créer/modifier/supprimer des catégories avec : label, slug (auto-généré depuis le label, modifiable), icône Lucide, montant budgété mensuel.

Une catégorie **Autre** est créée par défaut. Les dépenses importées sans catégorie ou avec un slug inconnu sont automatiquement affectées à **Autre**.

**Conséquences (testable) :**
- La catégorie "Autre" existe dès la première connexion.
- Une dépense CSV avec catégorie vide ou slug invalide tombe dans "Autre".
- Le slug est unique et utilisé comme référence dans l'import CSV.
- Le budget prévisionnel est affiché et comparé au réel (cumul des dépenses de la catégorie).

#### FR-2: Graphique de répartition par catégorie

Un graphique camembert affiche la répartition des dépenses du mois par catégorie, avec comparaison réel vs budgété.

**Conséquences (testable) :**
- Chaque catégorie est une part du camembert avec son icône et pourcentage.
- Au clic/survol : montant dépensé vs montant budgété.

> ⚠️ **Retiré du MVP v1.** FR-3 et FR-4 (ci-dessous) sont exclus du périmètre initial. À réévaluer pour v2.

#### FR-3: Règles de dépenses obligatoires

L'utilisateur peut définir une règle de dépense obligatoire avec : libellé, regex de matching (ex: `EDF.*`, `Loyer.*`), type (entrée/sortie), montant prévisionnel.

**Conséquences (testable) :**
- Une dépense importée dont le libellé match la regex est automatique marquée "obligatoire".
- `[ASSUMPTION]` : Matching regex case-insensitive, appliqué au trimming du libellé.

#### FR-4: Suivi des charges obligatoires

L'utilisateur voit la liste des dépenses obligatoires du mois, leur statut (débité/non débité), et le montant réel vs prévisionnel.

**Conséquences (testable) :**
- Les lignes débitées sont marquées visuellement.
- L'utilisateur peut cocher manuellement une règle comme débitée.
- Les totaux des charges obligatoires débitées et restantes sont affichés.

---

### 4.2 Dépenses

**Description :** Page de gestion des dépenses et revenus avec liste et graphiques. Réalise UJ-2.

**Exigences fonctionnelles :**

#### FR-5: Liste des dépenses

L'utilisateur voit la liste avec les colonnes : date, libellé, montant, catégorie (slug → label affiché), type (+/-), description.

**Conséquences (testable) :**
- Tri par date (récent → ancien par défaut).
- Le montant est formaté en euros.

#### FR-6: Ajout manuel

Formulaire : date, libellé, montant, catégorie (sélection depuis les catégories définies), description (optionnelle).

**Conséquences (testable) :**
- La soumission crée la dépense et la liste se met à jour.
- Les catégories disponibles sont celles créées via FR-1.

#### FR-7: Import CSV

Import au format Crédit Agricole (séparateur `;`) avec catégorie en slug.

**Format CSV attendu :**
```
Date;Date valeur;Libellé;Débit euros;Crédit euros;Catégorie
15/01/2026;15/01/2026;Loyer Carrefour;1200,50;;logement
15/01/2026;15/01/2026;Salaire;3500,00;salaire
16/01/2026;17/01/2026;Restaurant Le Bistrot;45,80;;alimentation
```
- **Date** : format français `DD/MM/YYYY`
- **Débit euros** : montant sortant (décimal avec `,`)
- **Crédit euros** : montant entrant
- **Catégorie** : slug de la catégorie (optionnel, définie en amont dans le Budget)
- Une ligne avec `Débit` = sortie, `Crédit` = entrée

**Conséquences (testable) :**
- Parsing du CSV avec validation des colonnes.
- Si catégorie slug absente ou inconnue : la dépense est créée sans catégorie (à assigner manuellement).

#### FR-8: Filtres par durée

Filtres : journalier, hebdomadaire, mensuel (défaut), personnalisé.

**Conséquences (testable) :**
- La liste et les graphiques se mettent à jour selon la période.

#### FR-9: Graphique des dépenses par jour

Graphique en barres du total dépensé par jour pour la période.

**Conséquences (testable) :**
- Moyenne mensuelle affichée en ligne de référence.

---

### 4.3 Crédit Immobilier

**Description :** Page de gestion des crédits immobiliers. Réalise UJ-3.

**Exigences fonctionnelles :**

#### FR-10: Liste des crédits

Récapitulatif à gauche avec : total du remboursement, total des intérêts payés, total de l'apport initial (frais notaire, etc.). Pour chaque crédit : montant, apport, taux, durée, mensualité, intérêts totaux.

**Conséquences (testable) :**
- Calcul d'amortissement français (capital + intérêts).
- Le coût total du crédit inclut l'apport initial + somme des mensualités.

#### FR-11: Ajout d'un crédit

Popin avec : libellé, montant emprunté, apport initial/frais (ex: 7000€ notaire), taux annuel %, durée (mois), date de début. Mensualité calculée automatiquement ou saisie.

**Conséquences (testable) :**
- L'apport initial est ajouté au coût total du crédit pour le calcul du patrimoine.
- `[ASSUMPTION]` : Formule d'amortissement classique (capital + intérêts composés).

#### FR-12: Modification / Suppression

Au clic sur un crédit : modifier les paramètres ou supprimer (avec confirmation).

**Conséquences (testable) :**
- La modification recalcule le tableau d'amortissement.
- La suppression retire le crédit du calcul du patrimoine.

---

### 4.4 Investissements

**Description :** Page de gestion des investissements (actions, ETFs, etc.). Réalise UJ-4.

**Exigences fonctionnelles :**

#### FR-13: Liste des supports

Liste (gauche) avec : nom, type (PEA, Assurance Vie, Compte Titres, CTO…), lieu de stockage (Trade Republic, Crédit Agricole, CIC Epargne Salariale, Macif…), évolution (%), valeur actuelle, plus/moins-value.

**Conséquences (testable) :**
- La plus/moins-value tient compte des frais du support.
- Les prix actuels via API (à définir — voir Questions Ouvertes).

#### FR-14: Ajout d'un support

Popin avec : ID/symbole (ex: AAPL), titre, type, lieu de stockage, frais annuels %, description, lien externe (ex: site d'info du support). Prix actuel récupéré via API.

**Conséquences (testable) :**
- Le support est créé avec toutes ses métadonnées.
- Les frais sont déduits du calcul de performance.

#### FR-15: Ajout d'un achat

Date, quantité, prix unitaire, frais d'achat. Le coût moyen pondéré est recalculé.

#### FR-16: Ajout d'une vente

Date, quantité, prix unitaire, frais de vente. Enregistre la plus/moins-value réalisée.

#### FR-17: Détail d'un support

Au clic : historique complet des transactions, lieu de stockage, frais, lien externe cliquable vers une page d'info (ex: Yahoo Finance, site de l'entreprise).

**Conséquences (testable) :**
- Le détail affiche toutes les métadonnées du support.
- Le lien externe ouvre dans un nouvel onglet.

#### FR-18: Graphique de répartition

Camembert de la valeur totale par support.

---

### 4.5 Cryptos

**Description :** Page de gestion des cryptomonnaies. Prix via CoinGecko. Réalise UJ-5.

**Exigences fonctionnelles :**

#### FR-19: Liste des cryptos

Liste (gauche) avec : nom, lieu de stockage (exchange, wallet…), évolution (%), valeur actuelle, plus/moins-value, frais.

#### FR-20: Ajout d'une crypto

Popin : ID CoinGecko (ex: bitcoin), titre, lieu de stockage, frais annuels %, description. Prix actuel via CoinGecko.

#### FR-21: Ajout d'un achat crypto

Identique FR-15.

#### FR-22: Ajout d'une vente crypto

Identique FR-16.

#### FR-23: Détail d'une crypto

Historique, lieu de stockage, frais, lien CoinGecko.

#### FR-24: Graphique de répartition crypto

Camembert de répartition.

---

### 4.6 Dashboard

**Description :** Page d'accueil. Vue synthétique du patrimoine. Nécessite que les autres sections soient alimentées. Réalise UJ-6.

**Exigences fonctionnelles :**

#### FR-25: Vue synthétique du patrimoine

Indicateurs : solde bancaire, valeur investissements, valeur cryptos, total crédits (restant dû + apports), total charges obligatoires du mois, patrimoine net.

**Conséquences (testable) :**
- Le patrimoine net = (banque + investissements + crypto) - (crédits restants + apports initiaux).
- Mise à jour après chaque modification dans les sections sous-jacentes.

#### FR-26: Import CSV depuis le dashboard

Bouton "Importer CSV" → file picker → parse → dépenses créées.

#### FR-27: Rafraîchissement des prix

Prix actuels des cryptos (CoinGecko) et investissements (API à définir) au chargement.

**Conséquences (testable) :**
- Fallback au dernier prix connu avec indicateur visuel si API indisponible.

#### FR-28: DCA quick-add investissement

Modale : support existant, date, montant → API fetch prix historique → achat créé.

#### FR-29: DCA quick-add crypto

Même mécanisme que FR-28 via CoinGecko.

---

## 5. Non-Goals (Explicit)

- Budget Tracker n'est **pas** une application bancaire — pas de connexion Plaid/Stripe/banque.
- Pas de synchronisation multi-comptes ou multi-utilisateurs en v1.
- Pas d'application mobile native en v1 (PWA envisageable).
- Pas de notifications push.
- Pas d'export PDF / CSV des données.
- Pas de calcul d'impôts / fisc.

## 5.1 Contraintes de sécurité

- Les clés API (CoinGecko, Yahoo Finance) sont stockées côté serveur, jamais exposées au client.
- Le parsing CSV est effectué côté serveur avec validation stricte pour prévenir les injections.
- Les données sont stockées en base de données PostgreSQL via AdonisJS ORM (pas de stockage fichier local).
- L'authentification existante (session/JWT) protège tous les endpoints — pas d'accès non authentifié aux données.

## 6. Périmètre MVP

### 6.1 Dans le périmètre

- Budget : catégories + graphique répartition
  - *Note : les règles dépenses obligatoires (FR-3) et suivi charges (FR-4) sont retirés du MVP — voir §4.1*
- Dépenses : CRUD + import CSV (format Crédit Agricole) + graphique journalier
- Crédits immobiliers : CRUD avec apport initial + calcul intérêts
- Investissements : CRUD supports avec type, lieu stockage, frais, API prix, lien externe, DCA quick-add
- Cryptos : CRUD avec lieu stockage, frais, API CoinGecko, DCA quick-add
- Dashboard : vue synthétique + import CSV + DCA quick-add
- Graphiques de répartition et suivi

### 6.2 Hors périmètre MVP

- Synchronisation bancaire automatique — à définir
- Multi-utilisateurs — v2 potentielle
- Application mobile native — PWA envisageable
- Export des données (CSV / PDF) — v2
- Agrégateur de comptes externes — v2+
- Notifications push

## 7. Métriques de succès

**Primaire**

- **SM-1** : L'utilisateur (moi) utilise l'application au moins une fois par semaine pendant 3 mois.
- **SM-2** : Toutes les dépenses du mois sont enregistrées dans l'outil (taux de complétude > 90%).

**Secondaire**

- **SM-3** : Le temps de saisie d'une dépense est < 30 secondes.

**Contre-métriques**

- **SM-C1** : L'ajout de fonctionnalités ne doit pas ralentir l'affichage du dashboard (< 2s de chargement).

## 8. Questions ouvertes

1. API pour les prix des investissements — Yahoo Finance ? Alternative : API gratuite ? Twelve Data, Alpha Vantage, scraping ? À vérifier.
2. API historique pour prix DCA passés — Yahoo Finance historique ? CoinGecko `/coins/{id}/history` OK.
3. Cache serveur pour limite de rate limiting des API.
4. PWA ou app web classique ?

## 9. Index des hypothèses

- API investissements à définir — QO#1
- shadcn/ui (Base UI) composants + graphiques — §0
- Formule d'amortissement français pour crédits — FR-11
- Coût moyen pondéré pour prix d'achat après ventes — FR-15
- Matching regex case-insensitive pour règles dépenses obligatoires — FR-3 (retiré MVP, voir §4.1)
- CSV format Crédit Agricole (séparateur `;`) — FR-7
- L'utilisateur est un utilisateur unique — §2.2
- Pas d'export de données v1 — §6.2
