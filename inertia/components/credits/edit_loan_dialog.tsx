import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import FormDialog from '~/components/shared/form_dialog'
import type { Loan } from '~/components/credits/constants'

export default function EditLoanDialog({
  open,
  onOpenChange,
  loan,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  loan: Loan
}) {
  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      route="loans.update"
      routeParams={{ id: loan.id }}
      title={`Modifier ${loan.name}`}
      description="Modifie les paramètres du crédit"
      submitLabel="Éditer"
    >
      {({ errors }) => (
        <>
          <Field>
            <FieldLabel>Nom</FieldLabel>
            <FieldContent>
              <Input
                name="name"
                id="name"
                placeholder="Prêt immobilier"
                defaultValue={loan.name}
                autoFocus
                aria-invalid={!!errors.name}
              />
              <FieldError errors={[{ message: errors.name }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Montant emprunté (€)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                name="borrowedAmount"
                step="0.01"
                min="0.01"
                defaultValue={loan.borrowedAmount}
                placeholder="200000"
                aria-invalid={!!errors.borrowedAmount}
              />
              <FieldError errors={[{ message: errors.borrowedAmount }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Apport initial (€)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                name="downPayment"
                step="0.01"
                min="0"
                defaultValue={loan.downPayment}
                placeholder="30000"
                aria-invalid={!!errors.downPayment}
              />
              <FieldError errors={[{ message: errors.downPayment }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Taux annuel (%)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                name="interestRate"
                step="0.01"
                min="0"
                defaultValue={loan.interestRate}
                placeholder="3.5"
                aria-invalid={!!errors.interestRate}
              />
              <FieldError errors={[{ message: errors.interestRate }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Durée (mois)</FieldLabel>
            <FieldContent>
              <Input
                type="number"
                name="durationMonths"
                min="1"
                defaultValue={loan.durationMonths}
                placeholder="240"
                aria-invalid={!!errors.durationMonths}
              />
              <FieldError errors={[{ message: errors.durationMonths }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Statut</FieldLabel>
            <FieldContent>
              <select
                name="status"
                defaultValue={loan.status}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                aria-invalid={!!errors.status}
              >
                <option value="active">En cours</option>
                <option value="paid">Remboursé</option>
              </select>
              <FieldError errors={[{ message: errors.status }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Date de début</FieldLabel>
            <FieldContent>
              <Input
                type="date"
                name="startDate"
                defaultValue={loan.startDate}
                aria-invalid={!!errors.startDate}
              />
              <FieldError errors={[{ message: errors.startDate }]} />
            </FieldContent>
          </Field>
        </>
      )}
    </FormDialog>
  )
}
