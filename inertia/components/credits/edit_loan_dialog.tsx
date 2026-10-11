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
import type { Loan } from '~/components/credits/constants'
import { router } from '@inertiajs/react'

interface FormData {
  name: string
  borrowedAmount: string
  downPayment: string
  interestRate: string
  durationMonths: string
  status: 'active' | 'paid'
  startDate: string
}

export default function EditLoanDialog({
  open,
  onOpenChange,
  loan,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  loan: Loan
}) {
  const tuyau = useTuyau()

  const {
    data,
    setData,
    errors,
    processing,
    submit,
    reset: resetFormState,
  } = useForm<FormData>({
    name: loan.name,
    borrowedAmount: String(loan.borrowedAmount),
    downPayment: String(loan.downPayment),
    interestRate: String(loan.interestRate),
    durationMonths: String(loan.durationMonths),
    status: loan.status,
    startDate: loan.startDate,
  })

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    const routeInfo = tuyau.getRoute('loans.edit', { params: { id: loan.id } })
    const method = routeInfo.methods[0].toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete'
    submit(method, routeInfo.url, {
      onSuccess: () => {
        resetFormState()
        onOpenChange(false)
        router.visit('/credits')
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
            <DialogTitle>Modifier {loan.name}</DialogTitle>
            <DialogDescription>Modifie les paramètres du crédit</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="name">Nom</FieldLabel>
              <FieldContent>
                <Input
                  name="name"
                  id="name"
                  placeholder="Prêt immobilier"
                  autoFocus
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="name-error"
                  errors={errors.name ? [{ message: errors.name }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="borrowedAmount">Montant emprunté (€)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="borrowedAmount"
                  id="borrowedAmount"
                  step="0.01"
                  min="0.01"
                  placeholder="200000"
                  value={data.borrowedAmount}
                  onChange={(e) => setData('borrowedAmount', e.target.value)}
                  aria-invalid={!!errors.borrowedAmount}
                  aria-describedby={errors.borrowedAmount ? 'borrowedAmount-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="borrowedAmount-error"
                  errors={errors.borrowedAmount ? [{ message: errors.borrowedAmount }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="downPayment">Apport initial (€)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="downPayment"
                  id="downPayment"
                  step="0.01"
                  min="0"
                  placeholder="30000"
                  value={data.downPayment}
                  onChange={(e) => setData('downPayment', e.target.value)}
                  aria-invalid={!!errors.downPayment}
                  aria-describedby={errors.downPayment ? 'downPayment-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="downPayment-error"
                  errors={errors.downPayment ? [{ message: errors.downPayment }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="interestRate">Taux annuel (%)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="interestRate"
                  id="interestRate"
                  step="0.01"
                  min="0"
                  placeholder="3.5"
                  value={data.interestRate}
                  onChange={(e) => setData('interestRate', e.target.value)}
                  aria-invalid={!!errors.interestRate}
                  aria-describedby={errors.interestRate ? 'interestRate-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="interestRate-error"
                  errors={errors.interestRate ? [{ message: errors.interestRate }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="durationMonths">Durée (mois)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  name="durationMonths"
                  id="durationMonths"
                  min="1"
                  placeholder="240"
                  value={data.durationMonths}
                  onChange={(e) => setData('durationMonths', e.target.value)}
                  aria-invalid={!!errors.durationMonths}
                  aria-describedby={errors.durationMonths ? 'durationMonths-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="durationMonths-error"
                  errors={errors.durationMonths ? [{ message: errors.durationMonths }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Statut</FieldLabel>
              <FieldContent>
                <select
                  name="status"
                  id="status"
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value as 'active' | 'paid')}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  aria-invalid={!!errors.status}
                  aria-describedby={errors.status ? 'status-error' : undefined}
                  disabled={processing}
                >
                  <option value="active">En cours</option>
                  <option value="paid">Remboursé</option>
                </select>
                <FieldError
                  id="status-error"
                  errors={errors.status ? [{ message: errors.status }] : []}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="startDate">Date de début</FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={data.startDate}
                  onChange={(e) => setData('startDate', e.target.value)}
                  aria-invalid={!!errors.startDate}
                  aria-describedby={errors.startDate ? 'startDate-error' : undefined}
                  disabled={processing}
                />
                <FieldError
                  id="startDate-error"
                  errors={errors.startDate ? [{ message: errors.startDate }] : []}
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
