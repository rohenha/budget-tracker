# Story 3.1: Liste et récapitulatif des crédits

## Status

done

## Story

En tant qu'utilisateur, je veux voir la liste de mes crédits immobiliers avec un récapitulatif (total remboursement, intérêts payés, apport initial) et le détail de chaque crédit, donc connaître le coût total de mes emprunts.

## Acceptance Criteria

1. Given un utilisateur connecté avec au moins un crédit immobilier enregistré, when il navigue vers la page des crédits, then la liste affiche chaque crédit avec son nom, borrowed_amount formaté EUR, interest_rate, duration_months, et statut (en_cours/rembourse).
2. Given la liste des crédits affichée, when l'utilisateur consulte le récapitulatif global, then il voit le total borrowed, le total des intérêts payés, et le total remboursé pour tous les crédits combinés.
3. Given la liste des crédits affichée, when l'utilisateur clique sur un crédit, then une vue détaillée s'ouvre montrant le calcul d'amortissement complet (échéancier mensuel avec numéro, due_date, principal_amount, interest, remaining_balance).
4. Given un crédit est en cours, when le détail est affiché, then les métriques clés sont calculées en temps réel : monthly_payment (formule annuité), total_interest, total_paid, remaining_balance.
5. Given aucun crédit enregistré, when la page est affichée, then un message vide "Ajoute ton premier crédit immobilier" avec CTA est affiché.

## Out of Scope

- Modification / suppression de crédit (Story 3.3)
- Suivi des paiements réels vs échéancier prévu
- Export CSV/PDF de l'échéancier
- Calcul d'amortissement personnalisé (autres types que français)

## Tasks / Subtasks

- [x] Task 1: Create DB migration + model for loans (agent: backend)
- [x] Task 2: Backend controller + validators + routes (agent: backend)
- [x] Task 3: Frontend — list page with global + per-loan summary (agent: frontend)
- [x] Task 4: Frontend — loan detail with amortization schedule (agent: frontend)
- [x] Task 5: Empty state + add dialog (agent: frontend)
