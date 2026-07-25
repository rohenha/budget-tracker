import { useState } from 'react'
import TypeBadge from '~/components/depenses/type_badge'
// import { NativeSelect, NativeSelectOption } from '~/components/ui/native-select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import { getIcon } from '~/components/budget/constants'
import { type CategorySpending } from '~/components/budget/category_pie_chart'
import FormDialog from '~/components/shared/form_dialog'

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
          <Field>
            <FieldLabel>Type</FieldLabel>
            <FieldContent className="flex flex-row items-center gap-2">
              <Select
                data-invalid={!!errors.type}
                defaultValue={categorie.type}
                onValueChange={(v) => setTypeState(v as 'entree' | 'sortie')}
              >
                <SelectTrigger id="periode" className="w-36" aria-invalid={!!errors.categorieId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="entree" className="text-green-700">
                      Entrée
                    </SelectItem>
                    <SelectItem value="sortie" className="text-red-700">
                      Sortie
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <TypeBadge type={typeState} />
              <input type="hidden" name="type" value={typeState} />
              <FieldError errors={[{ message: errors.type }]} />
            </FieldContent>
          </Field>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon className="size-4" style={{ color: categorie.color }} />
            <span>{categorie.icon}</span>
          </div>
        </>
      )}
    </FormDialog>
  )
}
