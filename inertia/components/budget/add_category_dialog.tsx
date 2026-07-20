import { useState } from 'react'
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
import { cn } from '~/lib/utils'
import { ICON_NAMES, getIcon } from '~/components/budget/constants'

export default function AddCategoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [icon, setIcon] = useState('Circle')
  const [search, setSearch] = useState('')
  const filtered = ICON_NAMES.filter((n) => n.toLowerCase().includes(search.toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form route="categories.store" onSubmit={() => onOpenChange(false)}>
          {({ errors }) => (
            <>
              <DialogHeader>
                <DialogTitle>Ajouter une catégorie</DialogTitle>
                <DialogDescription>Crée une nouvelle catégorie de dépenses</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Field>
                  <FieldLabel>Nom</FieldLabel>
                  <FieldContent>
                    <Input
                      name="label"
                      id="label"
                      placeholder="Alimentation"
                      aria-invalid={!!errors.label}
                    />
                    <FieldError errors={[{ message: errors.label }]} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Icône</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Rechercher..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-7"
                    />
                    <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto mt-1">
                      {filtered.map((name) => {
                        const I = getIcon(name)
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setIcon(name)
                              setSearch('')
                            }}
                            className={cn(
                              'flex size-7 items-center justify-center rounded-md border transition-colors',
                              icon === name
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:bg-accent'
                            )}
                            title={name}
                          >
                            <I className="size-4" />
                          </button>
                        )
                      })}
                    </div>
                    <input type="hidden" name="icon" value={icon} />
                    <FieldError errors={[{ message: errors.icon }]} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Budget mensuel (€)</FieldLabel>
                  <FieldContent>
                    <Input type="number" name="budget" step="0.01" min="0" placeholder="500" />
                    <FieldError errors={[{ message: errors.budget }]} />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Couleur</FieldLabel>
                  <FieldContent>
                    <Input
                      type="color"
                      name="color"
                      defaultValue="#6366f1"
                      className="h-7 w-14 p-0.5"
                    />
                    <FieldError errors={[{ message: errors.color }]} />
                  </FieldContent>
                </Field>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm">
                  Ajouter
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
