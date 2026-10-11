import { useForm } from '@inertiajs/react'
import { useTuyau } from '@adonisjs/inertia/react'
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
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
import CategorySelect from '~/components/ui/category_select'
import { router } from '@inertiajs/react'

interface FormData {
  libelle: string
  montant: string
  date: string
  categorieId: string
  description: string
}

export default function AddDepenseDialog({
  open,
  onOpenChange,
  categories,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  categories: Categorie[]
}) {
  const today = new Date().toISOString().split('T')[0]
  const tuyau = useTuyau()

  const {
    data,
    setData,
    errors,
    processing,
    submit,
    reset: resetFormState,
  } = useForm<FormData>({
    libelle: '',
    montant: '',
    date: today,
    categorieId: '',
    description: '',
  })

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    const routeInfo = tuyau.getRoute('depenses.store', { params: {} })
    const method = routeInfo.methods[0].toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete'
    submit(method, routeInfo.url, {
      onSuccess: () => {
        resetFormState()
        onOpenChange(false)
        router.visit('/depenses')
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
            <DialogTitle>Ajouter une dépense</DialogTitle>
            <DialogDescription>Enregistre une nouvelle dépense ou rentrée</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="libelle">Libellé</FieldLabel>
              <FieldContent>
                <Input
                  name="libelle"
                  id="libelle"
                  placeholder="Courses"
                  autoFocus
                  value={data.libelle}
                  onChange={(e) => setData('libelle', e.target.value)}
                  aria-invalid={!!errors.libelle}
                  aria-describedby={errors.libelle ? 'libelle-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="libelle-error"
                  errors={errors.libelle ? [{ message: errors.libelle }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="montant">Montant (€)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="montant"
                  id="montant"
                  step="0.01"
                  min="0.01"
                  placeholder="50"
                  value={data.montant}
                  onChange={(e) => setData('montant', e.target.value)}
                  aria-invalid={!!errors.montant}
                  aria-describedby={errors.montant ? 'montant-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="montant-error"
                  errors={errors.montant ? [{ message: errors.montant }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  value={data.date}
                  onChange={(e) => setData('date', e.target.value)}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? 'date-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="date-error"
                  errors={errors.date ? [{ message: errors.date }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Catégorie</FieldLabel>
              <FieldContent>
                <CategorySelect
                  value={data.categorieId}
                  categories={categories}
                  onValueChange={(v) => setData('categorieId', v ?? '')}
                  errors={errors.categorieId}
                  disabled={processing}
                />
                <FieldError
                  id="categorieId-error"
                  errors={errors.categorieId ? [{ message: errors.categorieId }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description (optionnelle)</FieldLabel>
              <FieldContent>
                <Input
                  name="description"
                  id="description"
                  placeholder="Détails..."
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'description-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="description-error"
                  errors={errors.description ? [{ message: errors.description }] : []}
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
                {processing ? 'Ajout...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
