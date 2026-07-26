import { Input } from '~/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '~/components/ui/field'
import FormDialog from '~/components/shared/form_dialog'

export default function AddLoanDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      route="loans.store"
      title="Ajouter un crédit"
      description="Enregistre un nouveau crédit immobilier"
      submitLabel="Ajouter"
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
                placeholder="240"
                aria-invalid={!!errors.durationMonths}
              />
              <FieldError errors={[{ message: errors.durationMonths }]} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Date de début</FieldLabel>
            <FieldContent>
              <Input
                type="date"
                name="startDate"
                defaultValue={today}
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
