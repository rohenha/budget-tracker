---
baseline_commit: NO_VCS
---

# Story 2.2 — Factorisation des popins CRUD + Ajout manuel d'une dépense

**Epic:** Epic 2 — Gestion des Dépenses
**Story Key:** 2-2-ajout-manuel-dune-depense

## Story

As a développeur et utilisateur,
I want factoriser les dialogs de création/édition/suppression des catégories en composants réutilisables, et les utiliser pour ajouter une dépense manuellement,
So that ne pas dupliquer le pattern dialog+form à chaque entité, et permettre à l'utilisateur d'enregistrer une dépense.

## Acceptance Criteria

### Partie 1 — Factorisation des dialogs

- **Given** les dialogs catégories existants (add/edit/delete)
  **When** on analyse le pattern commun
  **Then** un composant `FormDialog` réutilisable est créé pour encapsuler Dialog + Form Inertia + Header + Footer
  **And** un composant `DeleteDialog` réutilisable est créé pour les confirmations de suppression
  **And** les dialogs catégories sont refactorisés pour utiliser ces composants génériques

- **Given** le `FormDialog` est utilisé
  **When** on le configure avec route, title, description, children (les champs du formulaire)
  **Then** il gère l'ouverture/fermeture via `open`/`onOpenChange`
  **And** il wrappe le contenu dans un `Form` Inertia avec `onSuccess={() => onOpenChange(false)}`
  **And** il affiche un bouton Annuler et un bouton Submit dans le footer
  **And** il propage `routeParams` optionnellement (pour l'édition)

- **Given** le `DeleteDialog` est utilisé
  **When** on le configure avec `route`, `routeParams`, `entityName`, `message`
  **Then** il affiche "Supprimer {entityName} ?" en titre et {message} en description
  **And** les boutons Annuler et Supprimer (destructive) sont présents
  **And** la soumission appelle la route de destruction Inertia

- **Given** le `IconPicker` est utilisé
  **When** on l'inclut dans un formulaire
  **Then** c'est un composant autonome avec recherche, grille d'icônes, sélection visuelle et champ caché

- **Given** les dialogs catégories refactorisés
  **When** on ouvre/ferme ajout, édition, suppression
  **Then** le comportement reste identique à avant la refacto

### Partie 2 — Ajout manuel d'une dépense

- **Given** un utilisateur sur la page Dépenses
  **When** il clique "Ajouter"
  **Then** un `FormDialog` s'ouvre avec les champs : date (aujourd'hui par défaut), libellé, montant (décimal), catégorie (select depuis catégories existantes), type (entrée/sortie), description (optionnelle)
  **And** auto-focus sur le champ libellé

- **Given** le formulaire est soumis avec des champs valides
  **When** la requête Inertia est traitée
  **Then** un Toast "Dépense ajoutée" s'affiche
  **And** le Dialog se ferme
  **And** la liste des dépenses se met à jour

- **Given** le montant est invalide (négatif, zéro, non numérique)
  **When** la soumission échoue la validation VineJS
  **Then** un message d'erreur inline s'affiche sous le champ avec aria-invalid et aria-describedby
  **And** le Dialog reste ouvert, focus sur le champ en erreur

## Tasks

- [ ] Create `FormDialog` reusable component (Dialog + Form wrapper + Header + Footer with cancel/submit)
- [ ] Create `DeleteDialog` reusable component (generic delete confirmation)
- [ ] Extract `IconPicker` as standalone reusable component
- [ ] Refactor `AddCategoryDialog` to use `FormDialog` + `IconPicker`
- [ ] Refactor `EditCategoryDialog` to use `FormDialog` + `IconPicker`
- [ ] Refactor `DeleteCategoryDialog` to use `DeleteDialog`
- [ ] Verify category dialogs still work after refactoring
- [ ] Add `store` action to `DepensesController` with VineJS validation
- [ ] Add depenses.store route
- [ ] Create `AddDepenseDialog` using `FormDialog` (date, libellé, montant, catégorie select, type, description)
- [ ] Integrate `AddDepenseDialog` into depenses/index.tsx with "Ajouter" button
- [ ] Handle form validation errors inline
- [ ] Show success Toast on creation
- [ ] Run build and verify

## Dev Notes

### Architecture du pattern actuel (avant refacto)

Chaque dialog catégorie suit ce pattern manuellement :

```tsx
// Pattern actuel — dupliqué dans chaque dialog
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <Form route="categories.store" onSuccess={() => onOpenChange(false)}>
      {({ errors }) => (
        <>
          <DialogHeader>
            <DialogTitle>Ajouter une catégorie</DialogTitle>
            <DialogDescription>...</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* fields */}
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </div>
        </>
      )}
    </Form>
  </DialogContent>
</Dialog>
```

### Composants à créer

#### `FormDialog`

Props:
- `open: boolean`
- `onOpenChange: (v: boolean) => void`
- `route: string` — nom de la route Inertia
- `routeParams?: Record<string, any>` — optionnel (pour édition)
- `title: string`
- `description?: string`
- `submitLabel?: string` — défaut "Enregistrer"
- `cancelLabel?: string` — défaut "Annuler"
- `children: (props: { errors: Record<string, string>; onOpenChange: (v: boolean) => void }) => ReactNode`

Le composant wrappe le contenu dans `Form` + `Dialog` + gère Header/Footer.

#### `DeleteDialog`

Props:
- `open: boolean`
- `onOpenChange: (v: boolean) => void`
- `route: string`
- `routeParams: Record<string, any>`
- `entityName: string` — affiché dans "Supprimer {entityName} ?"
- `message?: string` — description optionnelle

#### `IconPicker`

Props:
- `value: string` — icône sélectionnée
- `onChange: (icon: string) => void`
- `error?: string`

### Formulaire création dépense

Route: `depenses.store`
Champs:
- `date` (date, défaut aujourd'hui, required)
- `libelle` (string, required, max 255)
- `montant` (decimal > 0, required)
- `type` (enum 'entree' | 'sortie', required, défaut 'sortie')
- `categorieId` (number, nullable, foreign key to categories)
- `description` (string, nullable, max 500)

Validation VineJS:
- `date`: `schema.date()`
- `libelle`: `schema.string({ trim: true, maxLength: 255 })`
- `montant`: `schema.number([rules.unsigned(), rules.range(0.01, 999999.99)])`
- `type`: `schema.enum(['entree', 'sortie'])`
- `categorieId`: `schema.number.optional([rules.exists({ table: 'categories', column: 'id' })])`
- `description`: `schema.string.optional({ trim: true, maxLength: 500 })`

### Gestion state page dépenses

Le bouton "Ajouter" est placé dans le header de la page, à droite du titre. Quand le dialog est ouvert, les filtres et la liste restent visibles derrière.

Après soumission réussie :
1. Dialog se ferme
2. Toast succès "Dépense ajoutée"
3. La liste Inertia se re-render avec la nouvelle dépense (grâce à l'Inertia redirect du controller)

### Fichiers modifiés/créés

- `inertia/components/shared/form_dialog.tsx` — NOUVEAU
- `inertia/components/shared/delete_dialog.tsx` — NOUVEAU
- `inertia/components/shared/icon_picker.tsx` — NOUVEAU
- `inertia/components/budget/add_category_dialog.tsx` — REFACTOR
- `inertia/components/budget/edit_category_dialog.tsx` — REFACTOR
- `inertia/components/budget/delete_category_dialog.tsx` — REFACTOR
- `inertia/components/depenses/add_depense_dialog.tsx` — NOUVEAU
- `inertia/pages/depenses/index.tsx` — AJOUT bouton + dialog
- `app/controllers/depenses_controller.ts` — AJOUT store
- `app/validators/depense.ts` — AJOUT validation création
- `start/routes.ts` — AJOUT route depenses.store

## Dev Agent Record

### Implementation Plan

1. Create `FormDialog` shared component
2. Create `DeleteDialog` shared component
3. Create `IconPicker` shared component
4. Refactor `AddCategoryDialog` with `FormDialog` + `IconPicker`
5. Refactor `EditCategoryDialog` with `FormDialog` + `IconPicker`
6. Refactor `DeleteCategoryDialog` with `DeleteDialog`
7. Verify category page still works
8. Add depenses.store to controller + validator + route
9. Create `AddDepenseDialog`
10. Add "Ajouter" button to depenses page
11. Build & verify

### Debug Log

### Completion Notes

## File List

- `inertia/components/shared/form_dialog.tsx`
- `inertia/components/shared/delete_dialog.tsx`
- `inertia/components/shared/icon_picker.tsx`
- `inertia/components/budget/add_category_dialog.tsx`
- `inertia/components/budget/edit_category_dialog.tsx`
- `inertia/components/budget/delete_category_dialog.tsx`
- `inertia/components/depenses/add_depense_dialog.tsx`
- `inertia/pages/depenses/index.tsx`
- `app/controllers/depenses_controller.ts`
- `app/validators/depense.ts`
- `start/routes.ts`

## Change Log

## Status

done
