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
import { type CategorySpending } from '~/components/budget/category_pie_chart'

export default function DeleteCategoryDialog({
  categorie,
  open,
  onOpenChange,
}: {
  categorie: CategorySpending
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form
          route="categories.destroy"
          routeParams={{ id: categorie.categorieId }}
          onSuccess={() => onOpenChange(false)}
        >
          {() => (
            <>
              <DialogHeader>
                <DialogTitle>Supprimer {categorie.label} ?</DialogTitle>
              </DialogHeader>
              <DialogDescription className="my-4">
                Les dépenses liées seront réaffectées à la catégorie Autre.
              </DialogDescription>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="destructive" size="sm">
                  Supprimer
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
