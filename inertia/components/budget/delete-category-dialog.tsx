import { Form } from '@adonisjs/inertia/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import type { Categorie } from '~/components/budget/constants'

export default function DeleteCategoryDialog({
  categorie,
  open,
  onOpenChange,
}: {
  categorie: Categorie
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Form route="categories.destroy" routeParams={{ id: categorie.id }} onSubmit={() => onOpenChange(false)}>
        {() => (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer {categorie.label} ?</DialogTitle>
              <DialogDescription>
                Les dépenses liées seront réaffectées à la catégorie Autre.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="destructive" size="sm">Supprimer</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Form>
    </Dialog>
  )
}
