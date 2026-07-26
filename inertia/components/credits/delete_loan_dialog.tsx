import type { Loan } from '~/components/credits/constants'
import DeleteDialog from '~/components/shared/delete_dialog'

export default function DeleteLoanDialog({
  loan,
  open,
  onOpenChange,
}: {
  loan: Loan
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      route="loans.destroy"
      routeParams={{ id: loan.id }}
      entityName={loan.name}
      message="Le crédit sera définitivement supprimé."
    />
  )
}
