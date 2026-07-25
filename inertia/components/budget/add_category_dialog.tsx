import { useState } from 'react'
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import IconPicker from '~/components/shared/icon_picker'
import FormDialog from '~/components/shared/form_dialog'
import TypeExpenseSelect from '~/components/ui/type_expense_select'

export default function AddCategoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [icon, setIcon] = useState('Circle')
  const [typeState, setTypeState] = useState('sortie' as 'entree' | 'sortie')
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      route="categories.store"
      title="Ajouter une catégorie"
      description="Crée une nouvelle catégorie de dépenses"
      submitLabel="Ajouter"
    >
      {({ errors }) => (
        <>
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
              <IconPicker value={icon} onChange={setIcon} error={errors.icon} />
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
                placeholder="500"
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
                defaultValue="#6366f1"
                className="h-7 w-14 p-0.5"
                aria-invalid={!!errors.color}
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
        </>
      )}
    </FormDialog>
  )
}
