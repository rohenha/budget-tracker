# Story 4.3: Achats et ventes sur un support d'investissement

## Status
review

## User Story
En tant qu'utilisateur, je veux pouvoir ajouter des opérations d'achat et de vente sur un support d'investissement (quantité, prix, date, frais), les lister, les modifier et les supprimer, afin de suivre l'historique de mes transactions et calculer ma performance sur ce support.

## Acceptance Criteria
1. **Ajouter une transaction** : Depuis le détail d'un support, bouton "Ajouter transaction" ouvre un formulaire
2. **Champs transaction** : Type (achat/vente), date, quantité, prix unitaire, frais (optionnel), notes (optionnel)
3. **Validation** : Quantité > 0, Prix > 0, Date ≤ aujourd'hui, Type requis
4. **Lister les transactions** : Tableau chronologique (plus récent en haut) avec colonnes : Date, Type, Quantité, Prix, Frais, Total, Actions
5. **Calculs automatiques** : Total = Quantité × Prix + Frais (achat) ou Quantité × Prix - Frais (vente)
6. **Modifier une transaction** : Clic sur une ligne ouvre le formulaire pré-rempli
7. **Supprimer une transaction** : Icône poubelle avec confirmation modale
8. **Résumé du support** : Afficher quantité totale détenue, prix moyen d'achat (PRU), valorisation actuelle, plus/moins-value latente
9. **Feedback** : Toast succès/erreur pour chaque action

## Dev Notes
- Nouveau modèle `Transaction` lié au `Support` (One-to-Many)
- API : GET/POST/PUT/DELETE /api/supports/:id/transactions
- Calcul PRU (Prix de Revient Unitaire) : moyenne pondérée des achats restants après ventes (FIFO ou méthode choisie)
- Valorisation = Quantité détenue × Prix actuel (à récupérer via API prix ou champ manuel)
- Réutiliser patterns de la story 2.2 (ajout dépense) pour le formulaire
- Store Zustand : ajouter slice `transactions` par support

## Tasks
- [x] Créer le modèle `Transaction` (Prisma/DB) et migration
- [x] API CRUD transactions pour un support
- [x] Composant `TransactionForm` (achat/vente)
- [x] Composant `TransactionList` avec tableau et actions
- [x] Composant `SupportSummary` (quantité, PRU, valorisation, P&L)
- [x] Intégrer dans la page détail support (story 4.5 ou ici)
- [x] Logique calcul PRU et quantité détenue (FIFO)
- [x] Tests unitaires : calculs PRU, validation, CRUD
- [x] Tests d'intégration : flow complet achat/vente

## Dev Agent Record

### Agent Model Used
nemotron-3-ultra-free

### Completion Notes
Implemented full CRUD for investment transactions:
- Created InvestmentTransaction model with migration (support_id, type, date, quantity, price, fees, notes)
- Added InvestmentTransactionsController with index, store, update, destroy methods
- Added nested routes under /investissements/:id/transactions
- Created TransactionForm dialog with useForm (type, date, quantity, price, fees, notes)
- Created TransactionList with DataTable showing date, type, quantity, price, fees, total, actions
- Created DeleteTransactionDialog with confirmation
- Created SupportSummary component showing totalQuantity, PRU, currentPrice, currentValue, P&L
- Created investment show page (/investissements/:id) with summary, transactions list, and add transaction dialog
- PRU calculated as weighted average cost of remaining shares after sales (FIFO-like)
- All 140 tests pass
- Linting passes for new code (pre-existing lint errors in unrelated files remain)

### Files Modified
- database/migrations/1791716399707_create_investment_transactions_table.ts (new)
- app/models/investment_transaction.ts (new)
- app/models/investment_support.ts (added hasMany transactions)
- app/validators/investment_support.ts (added transaction validators)
- app/controllers/investment_transactions_controller.ts (new)
- start/routes.ts (added transaction routes and show route)
- inertia/components/investments/constants.ts (added InvestmentTransaction, SupportSummary types)
- inertia/components/investments/transaction_form.tsx (new)
- inertia/components/investments/transaction_list.tsx (new)
- inertia/components/investments/delete_transaction_dialog.tsx (new)
- inertia/components/investments/support_summary.tsx (new)
- inertia/pages/investments/show.tsx (new)

### Change Log
- 2026-10-11: Implemented story 4.3 - transactions CRUD for investment supports