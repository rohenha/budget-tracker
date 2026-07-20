# PRD Quality Review — Budget Tracker

Reviewer: Code Review Agent
Date: 2026-07-19

## Overall verdict

PRD solide pour un projet open source — substance, cohérent, scope honnête. Trois findings **HIGH** à adresser avant implémentation (ventes manquantes, matching flou, CSV non défini).

## Decision-readiness — ADEQUATE

Trade-offs nommés (Yahoo Finance, CSV format TBD). Open Questions §8 honnêtes mais parfois trop courtes. `[ASSUMPTION]` taggées. Manque : pourquoi Chart.js vs Recharts dans l'écosystème shadcn ? Pourquoi Yahoo Finance plutôt qu'Alpha Vantage ?

## Substance over theater — STRONG

Zero persona theater. JTBD §2.1 lean et fonctionnel. Protagoniste unique "Rohenha" parfait pour un projet solo. Zéro filler.

## Strategic coherence — STRONG

Thèse claire : remplacer les spreadsheets. Les 7 sections servent cette thèse. "Simplicité" annoncé en §0 et respecté.

## Done-ness clarity — ADEQUATE

Chaque FR a des "Conséquences (testable)" — bonne pratique. Mais plusieurs sont trop vagues : FR-13 (matching "compare le libellé" pas clair), FR-12 (trop trivial). Pas d'états d'erreur documentés.

## Scope honesty — STRONG

§5 Non-Goals explicite (7 items). §6.2 renforce avec "à définir" / "v2+". `[ASSUMPTION]` cohérentes. Angle mort : ventes (seulement en Open Question #4, pas dans Non-Goals).

## Downstream usability — ADEQUATE

Bon : Glossaire §3 (10 termes). FR IDs 1-27 et UJ IDs 1-6 contigus. `[ASSUMPTION]` cohérents.
Faible : FR ne référencent pas leur UJ directement. §4.6 Crypto copie-collé "Identique à FR-X" pour 4/5 FRs. Certains FRs trop maigres pour être standalone.

## Shape fit — STRONG

Bien calibré hobby/solo. 6 feature areas ambitieux mais réaliste. Détail approprié — pas d'UML, pas de wireframes, pas sous-spécifié. Non-goals préventifs.

## Findings

### HIGH — Ventes non traitées pour Investissements et Cryptos

- **§4.5, §4.6, QO#4**
- FR-20 à FR-27 décrivent uniquement des achats. §6.1 dit "CRUD complet" mais sans ventes. Un portfolio tracker a besoin des plus/moins-values réalisées.
- **Fix:** Ajouter des FRs pour les ventes OU ajouter explicitement dans Non-Goals : "Pas de gestion des ventes en v1".

### HIGH — Algorithme de matching rattrapage automatique sous-spécifié

- **FR-13 (§4.3)**
- "Le système compare le libellé" n'est pas implantable tel quel. Exact ? Case-insensitive ? Substring ? Fuzzy ?
- **Fix:** Spécifier la stratégie (ex: "case-insensitive exact match; partial matches suggérées mais pas auto-liées").

### HIGH — Format CSV d'import non défini

- **FR-8 (§4.2), QO#3**
- Feature core (importer depuis spreadsheets = la thèse) sans colonnes définies.
- **Fix:** Ajouter une subsection sous FR-8 avec colonnes attendues, types, exemples. Si TBD, le dire explicitement avec deadline.

### MEDIUM — Pas d'export / portabilité

- Aucune feature d'export alors que §1 promet "l'utilisateur garde le contrôle total de ses données". Ajouter FR pour CSV export.

### MEDIUM — Pas de considérations sécurité

- CSV parsing = vecteur d'injection. Stockage clés API. Aucune mention nulle part.
