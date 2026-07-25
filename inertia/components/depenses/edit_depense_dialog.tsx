import { useState } from 'react'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import FormDialog from '~/components/shared/form_dialog'
import { getIcon } from '~/components/budget/constants'
import type { Categorie } from '~/components/budget/constants'
import type { Depense } from '~/components/depenses/constants'

export default function EditDepenseDialog({
  open,
  onOpenChange,
  categories,
  depense,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  categories: Categorie[]
  depense: Depense
}) {
  const today = new Date().toISOString().split('T')[0]
  const [categorieId, setCategorieId] = useState<string>(String(depense.categorieId))

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      route="depenses.update"
      routeParams={{ id: depense.id }}
      title={`Modifier ${depense.libelle}`}
      description="Modifie les paramètres de la dépense"
      submitLabel="Éditer"
    >
      {({ errors }) => (
        <>
          <Field>
            <FieldLabel>Libellé</FieldLabel>
            <FieldContent>
              <Input
                name="libelle"
                id="libelle"
                placeholder="Courses"
                defaultValue={depense.libelle}
                autoFocus
                aria-invalid={!!errors.libelle}
              />
              <FieldError errors={[{ message: errors.libelle }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Montant (€)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                name="montant"
                defaultValue={depense.montant}
                step="0.01"
                min="0.01"
                placeholder="50"
                aria-invalid={!!errors.montant}
              />
              <FieldError errors={[{ message: errors.montant }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <FieldContent>
              <Input
                type="date"
                name="date"
                defaultValue={depense.date ?? today}
                aria-invalid={!!errors.date}
              />
              <FieldError errors={[{ message: errors.date }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Catégorie</FieldLabel>
            <FieldContent>
              <Select value={categorieId} onValueChange={(v) => setCategorieId(v ?? '')}>
                <SelectTrigger className="w-full" aria-invalid={!!errors.categorieId}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((cat) => {
                      const Icon = getIcon(cat.icon)
                      return (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          <div className="flex items-center gap-2">
                            <Icon className="size-4" style={{ color: cat.color }} />
                            <span>{cat.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input type="hidden" name="categorieId" value={categorieId} />
              <FieldError errors={[{ message: errors.categorieId }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Description (optionnelle)</FieldLabel>
            <FieldContent>
              <Input
                name="description"
                placeholder="Détails..."
                aria-invalid={!!errors.description}
                defaultValue={depense.description ?? ''}
              />
              <FieldError errors={[{ message: errors.description }]} />
            </FieldContent>
          </Field>
        </>
      )}
    </FormDialog>
  )
}
