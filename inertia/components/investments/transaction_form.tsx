import { useForm } from '@inertiajs/react'
import { useTuyau } from '@adonisjs/inertia/react'
import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { router } from '@inertiajs/react'
import type { InvestmentTransaction } from '~/components/investments/constants'

interface FormData {
  type: 'achat' | 'vente' | ''
  date: string
  quantity: string
  price: string
  fees: string
  notes: string
}

interface TransactionFormProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  supportId: number
  transaction?: InvestmentTransaction | null
}

export default function TransactionForm({
  open,
  onOpenChange,
  supportId,
  transaction,
}: TransactionFormProps) {
  const tuyau = useTuyau()
  const isEditing = !!transaction

  const {
    data,
    setData,
    errors,
    processing,
    submit,
    reset: resetFormState,
  } = useForm<FormData>({
    type: transaction?.type ?? '',
    date: transaction?.date ?? new Date().toISOString().split('T')[0],
    quantity: String(transaction?.quantity ?? ''),
    price: String(transaction?.price ?? ''),
    fees: String(transaction?.fees ?? ''),
    notes: transaction?.notes ?? '',
  })

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    let routeName: 'investissements.transactions.store' | 'investissements.transactions.edit'
    let routeParams: { id: number; transactionId?: number }

    if (isEditing) {
      routeName = 'investissements.transactions.edit'
      routeParams = { id: supportId, transactionId: transaction!.id }
    } else {
      routeName = 'investissements.transactions.store'
      routeParams = { id: supportId }
    }

    const routeInfo = tuyau.getRoute(routeName, { params: routeParams })
    const method = routeInfo.methods[0].toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete'
    submit(method, routeInfo.url, {
      onSuccess: () => {
        resetFormState()
        onOpenChange(false)
        router.visit(`/investissements/${supportId}`)
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
            <DialogTitle>{isEditing ? 'Modifier' : 'Ajouter'} transaction</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Modifie les détails de la transaction'
                : "Enregistre une nouvelle opération d'achat ou de vente"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Type</FieldLabel>
              <FieldContent>
                <Select
                  name="type"
                  value={data.type}
                  onValueChange={(value) => setData('type', value as FormData['type'])}
                  aria-invalid={!!errors.type}
                  aria-required="true"
                  disabled={processing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achat">Achat</SelectItem>
                    <SelectItem value="vente">Vente</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError
                  id="type-error"
                  errors={errors.type ? [{ message: errors.type }] : []}
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
                  max={new Date().toISOString().split('T')[0]}
                  aria-invalid={!!errors.date}
                  aria-describedby={errors.date ? 'date-error' : undefined}
                  aria-required="true"
                  disabled={processing}
                />
                <FieldError
                  id="date-error"
                  errors={errors.date ? [{ message: errors.date }] : []}
                />
              </FieldContent>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="quantity">Quantité</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    name="quantity"
                    id="quantity"
                    step="0.00000001"
                    min="0.00000001"
                    placeholder="10"
                    value={data.quantity}
                    onChange={(e) => setData('quantity', e.target.value)}
                    aria-invalid={!!errors.quantity}
                    aria-describedby={errors.quantity ? 'quantity-error' : undefined}
                    aria-required="true"
                    disabled={processing}
                  />
                  <FieldError
                    id="quantity-error"
                    errors={errors.quantity ? [{ message: errors.quantity }] : []}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="price">Prix unitaire (€)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    min="0.01"
                    placeholder="150.00"
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    aria-invalid={!!errors.price}
                    aria-describedby={errors.price ? 'price-error' : undefined}
                    aria-required="true"
                    disabled={processing}
                  />
                  <FieldError
                    id="price-error"
                    errors={errors.price ? [{ message: errors.price }] : []}
                  />
                </FieldContent>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="fees">Frais (€)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    name="fees"
                    id="fees"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={data.fees}
                    onChange={(e) => setData('fees', e.target.value)}
                    aria-invalid={!!errors.fees}
                    aria-describedby={errors.fees ? 'fees-error' : undefined}
                    disabled={processing}
                  />
                  <FieldError
                    id="fees-error"
                    errors={errors.fees ? [{ message: errors.fees }] : []}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel htmlFor="total">Total (€)</FieldLabel>
                <FieldContent>
                  <Input
                    type="text"
                    id="total"
                    value={
                      data.quantity && data.price
                        ? (
                            Number(data.quantity) * Number(data.price) +
                            Number(data.fees ?? 0)
                          ).toFixed(2)
                        : ''
                    }
                    readOnly
                    className="bg-muted"
                    disabled={processing}
                  />
                </FieldContent>
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <FieldContent>
                <Textarea
                  name="notes"
                  id="notes"
                  placeholder="Notes optionnelles"
                  rows={2}
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  aria-invalid={!!errors.notes}
                  aria-describedby={errors.notes ? 'notes-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="notes-error"
                  errors={errors.notes ? [{ message: errors.notes }] : []}
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
                {processing ? 'Enreg...' : isEditing ? 'Éditer' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
