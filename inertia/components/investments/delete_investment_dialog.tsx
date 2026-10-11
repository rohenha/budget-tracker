import type { InvestmentSupport } from '~/components/investments/constants'
import DeleteDialog from '~/components/shared/delete_dialog'

export default function DeleteInvestmentDialog({
  open,
  onOpenChange,
  support,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  support: InvestmentSupport | null
}) {
  if (!support) return null

  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      route="investissements.destroy"
      routeParams={{ id: support.id }}
      entityName={support.name}
      message={`Le support "${support.name}" (${support.symbol}) sera définitivement supprimé.`}
    />
  )
}
