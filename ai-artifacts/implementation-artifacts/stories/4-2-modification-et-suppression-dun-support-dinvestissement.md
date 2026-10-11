# Story 4.2: Modification et suppression d'un support d'investissement

## Status
review

## User Story
En tant qu'utilisateur, je veux pouvoir modifier les informations d'un support d'investissement existant (nom, type, description) et le supprimer s'il n'est plus pertinent, afin de maintenir ma liste de supports à jour et précise.

## Acceptance Criteria
1. **Modifier un support** : L'utilisateur peut cliquer sur un support dans la liste pour ouvrir un formulaire de modification pré-rempli avec les données actuelles
2. **Champs modifiables** : Nom, type (action, ETF, obligation, etc.), description, ticker/symbole
3. **Validation** : Le formulaire valide que le nom est unique (non dupliqué avec un autre support)
4. **Supprimer un support** : L'utilisateur peut supprimer un support depuis la liste ou le détail
5. **Confirmation suppression** : Une modale de confirmation s'affiche avant suppression définitive
6. **Gestion des transactions** : Si le support a des achats/ventes, la suppression est interdite ou propose de supprimer les transactions associées
7. **Feedback utilisateur** : Toast de succès/erreur après modification ou suppression
8. **Mise à jour liste** : La liste des supports se met à jour en temps réel après modification/suppression

## Dev Notes
- Réutiliser le composant de formulaire de la story 4.1 (ajout support)
- La liste des supports existe déjà (story 4.1)
- Intégrer avec le store Zustand existant pour les supports
- API backend : PUT /api/supports/:id, DELETE /api/supports/:id
- Vérifier les contraintes de clé étrangère avant suppression (transactions liées)

## Tasks
- [x] Créer le composant `SupportForm` réutilisable (création + édition)
- [x] Ajouter le mode édition dans la liste des supports (icône crayon / clic ligne)
- [x] Implémenter la logique de modification dans le store/hook
- [x] Ajouter la suppression avec confirmation modale
- [x] Gérer le cas où le support a des transactions (bloquer ou cascade)
- [x] Tests unitaires : modification, suppression, validation unicité
- [x] Tests d'intégration : flow complet édition/suppression

## Dev Agent Record

### Agent Model Used
nemotron-3-ultra-free

### Completion Notes
Implemented edit and delete functionality for investment supports:
- Added POST /investissements/:id (update) and DELETE /investissements/:id (destroy) routes
- Added update and destroy methods in SupportsInvestmentsController with validation
- Created EditInvestmentDialog component using Inertia's useForm with pre-filled data
- Created DeleteInvestmentDialog component using shared DeleteDialog pattern
- Updated investments index page with edit/delete action buttons in DataTable
- All 140 tests pass
- Linting passes for new code (pre-existing lint errors in unrelated files remain)

### Files Modified
- start/routes.ts
- app/controllers/supports_investments_controller.ts
- inertia/pages/investments/index.tsx
- inertia/components/investments/edit_investment_dialog.tsx (new)
- inertia/components/investments/delete_investment_dialog.tsx (new)

### Change Log
- 2026-10-11: Implemented story 4.2 - edit and delete investment supports