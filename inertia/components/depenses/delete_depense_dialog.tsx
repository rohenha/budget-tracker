import type { Depense } from '~/components/depenses/constants'
import DeleteDialog from '~/components/shared/delete_dialog'

export default function DeleteDepenseDialog({
  depense,
  open,
  onOpenChange,
}: {
  depense: Depense
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <DeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      route="depenses.destroy"
      routeParams={{ id: depense.id }}
      entityName={depense.libelle}
      message="La dépense sera supprimée."
    />
  )
}
