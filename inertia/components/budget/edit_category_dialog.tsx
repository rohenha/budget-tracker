import { useState } from 'react'
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import { getIcon } from '~/components/budget/constants'
import { type CategorySpending } from '~/components/budget/category_pie_chart'
import FormDialog from '~/components/shared/form_dialog'
import TypeExpenseSelect from '~/components/ui/type_expense_select'

export default function EditCategoryDialog({
  categorie,
  open,
  onOpenChange,
}: {
  categorie: CategorySpending
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const Icon = getIcon(categorie.icon)
  const [typeState, setTypeState] = useState(categorie.type)
  const [iconColor, setIconColor] = useState(categorie.color || '#6366f1')

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      route="categories.update"
      routeParams={{ id: categorie.categorieId }}
      title={`Modifier ${categorie.label}`}
      description="Modifie les paramètres de la catégorie"
    >
      {({ errors }) => (
        <>
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
              <input
                type="color"
                name="color"
                defaultValue={categorie.color || '#6366f1'}
                onChange={(e) => setIconColor(e.target.value)}
                className="h-7 w-14 rounded border border-input bg-transparent p-0.5"
              />
              <FieldError errors={[{ message: errors.color }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Type</FieldLabel>
            <FieldContent className="flex flex-row items-center gap-2">
              <TypeExpenseSelect
                value={typeState}
                onValueChange={setTypeState}
                errors={errors.type}
              />
              <input type="hidden" name="type" value={typeState} />
              <FieldError errors={[{ message: errors.type }]} />
            </FieldContent>
          </Field>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon className="size-4" style={{ color: iconColor }} />
            <span>{categorie.icon}</span>
          </div>
        </>
      )}
    </FormDialog>
  )
}
