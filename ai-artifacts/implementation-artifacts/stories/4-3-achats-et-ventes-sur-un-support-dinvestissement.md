# Story 4.3: Achats et ventes sur un support d'investissement

## Status
ready-for-dev

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
- [ ] Créer le modèle `Transaction` (Prisma/DB) et migration
- [ ] API CRUD transactions pour un support
- [ ] Composant `TransactionForm` (achat/vente)
- [ ] Composant `TransactionList` avec tableau et actions
- [ ] Composant `SupportSummary` (quantité, PRU, valorisation, P&L)
- [ ] Intégrer dans la page détail support (story 4.5 ou ici)
- [ ] Logique calcul PRU et quantité détenue (FIFO)
- [ ] Tests unitaires : calculs PRU, validation, CRUD
- [ ] Tests d'intégration : flow complet achat/vente

## Dev Agent Record

### Agent Model Used

### Completion Notes

### Files Modified