import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import { useTuyau } from '@adonisjs/inertia/react'
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import IconPicker from '~/components/shared/icon_picker'
import type { CategorySpending } from '~/components/budget/category_pie_chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import TypeExpenseSelect from '~/components/ui/type_expense_select'
import { router } from '@inertiajs/react'

interface FormData {
  label: string
  icon: string
  budget: string
  color: string
  type: 'entree' | 'sortie'
}

export default function EditCategoryDialog({
  categorie,
  open,
  onOpenChange,
}: {
  categorie: CategorySpending
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [typeState, setTypeState] = useState<'entree' | 'sortie'>(categorie.type)
  const tuyau = useTuyau()

  const {
    data,
    setData,
    errors,
    processing,
    submit,
    reset: resetFormState,
  } = useForm<FormData>({
    label: categorie.label,
    icon: categorie.icon,
    budget: String(categorie.budget ?? ''),
    color: categorie.color || '#6366f1',
    type: categorie.type,
  })

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    const routeInfo = tuyau.getRoute('categories.edit', { params: { id: categorie.categorieId } })
    const method = routeInfo.methods[0].toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete'
    submit(method, routeInfo.url, {
      onSuccess: () => {
        resetFormState()
        onOpenChange(false)
        router.visit('/categories')
      },
      onError: () => {
        // Errors are automatically handled by useForm
      },
    })
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      resetFormState()
    }
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier {categorie.label}</DialogTitle>
            <DialogDescription>Modifie les paramètres de la catégorie</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="label">Nom</FieldLabel>
              <FieldContent>
                <Input
                  name="label"
                  id="label"
                  value={data.label}
                  onChange={(e) => setData('label', e.target.value)}
                  aria-invalid={!!errors.label}
                  aria-describedby={errors.label ? 'label-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="label-error"
                  errors={errors.label ? [{ message: errors.label }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Icône</FieldLabel>
              <FieldContent>
                <IconPicker
                  value={data.icon}
                  onChange={(value) => setData('icon', value)}
                  error={errors.icon}
                />
                <FieldError
                  id="icon-error"
                  errors={errors.icon ? [{ message: errors.icon }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="budget">Budget mensuel (€)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="budget"
                  id="budget"
                  step="0.01"
                  min="0"
                  value={data.budget}
                  onChange={(e) => setData('budget', e.target.value)}
                  aria-invalid={!!errors.budget}
                  aria-describedby={errors.budget ? 'budget-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="budget-error"
                  errors={errors.budget ? [{ message: errors.budget }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="color">Couleur</FieldLabel>
              <FieldContent>
                <Input
                  type="color"
                  name="color"
                  id="color"
                  value={data.color}
                  onChange={(e) => setData('color', e.target.value)}
                  className="h-7 w-14 p-0.5"
                  aria-invalid={!!errors.color}
                  aria-describedby={errors.color ? 'color-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="color-error"
                  errors={errors.color ? [{ message: errors.color }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Type</FieldLabel>
              <FieldContent className="flex flex-row items-center gap-2">
                <TypeExpenseSelect
                  value={typeState}
                  onValueChange={(value) => {
                    setTypeState(value)
                    setData('type', value)
                  }}
                  errors={errors.type}
                />
                <FieldError
                  id="type-error"
                  errors={errors.type ? [{ message: errors.type }] : []}
                />
              </FieldContent>
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={processing}
              >
                Annuler
              </Button>
              <Button type="submit" size="sm" disabled={processing}>
                {processing ? 'Enreg...' : 'Éditer'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
