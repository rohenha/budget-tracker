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
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import { getIcon, type Categorie } from '~/components/budget/constants'

export default function EditCategoryDialog({
  categorie,
  open,
  onOpenChange,
}: {
  categorie: Categorie
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const Icon = getIcon(categorie.icon)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form
          route="categories.update"
          routeParams={{ id: categorie.id }}
          onSuccess={() => onOpenChange(false)}
        >
          {({ errors }) => (
            <>
              <DialogHeader>
                <DialogTitle>Modifier {categorie.label}</DialogTitle>
                <DialogDescription>Modifie les paramètres de la catégorie</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Field>
                  <FieldLabel>Nom</FieldLabel>
                  <FieldContent>
                    <Input
                      name="label"
                      id="label"
                      defaultValue={categorie.label}
                      aria-invalid={!!errors.label}
                    />
                    <FieldError errors={[{ message: errors.label }]} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Budget mensuel (€)</FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      name="budget"
                      step="0.01"
                      min="0"
                      defaultValue={categorie.budget ?? ''}
                      aria-invalid={!!errors.budget}
                    />
                    <FieldError errors={[{ message: errors.budget }]} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Couleur</FieldLabel>
                  <FieldContent>
                    <Input
                      type="color"
                      name="color"
                      defaultValue={categorie.color}
                      className="h-7 w-14 p-0.5"
                      aria-invalid={!!errors.color}
                    />
                    <FieldError errors={[{ message: errors.color }]} />
                  </FieldContent>
                </Field>
              </div>
              <DialogFooter>
                <div className="flex items-center gap-1 mr-auto">
                  <Icon className="size-4" style={{ color: categorie.color }} />
                  <span className="text-xs text-muted-foreground">{categorie.icon}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" size="sm">
                  Enregistrer
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
