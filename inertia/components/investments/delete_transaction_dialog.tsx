import { useForm } from '@inertiajs/react'
import { useTuyau } from '@adonisjs/inertia/react'
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

interface DeleteTransactionDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  transaction: InvestmentTransaction | null
  supportId: number
}

export default function DeleteTransactionDialog({
  open,
  onOpenChange,
  transaction,
  supportId,
}: DeleteTransactionDialogProps) {
  const tuyau = useTuyau()

  const { processing, submit, reset: resetFormState } = useForm<Record<string, never>>({})

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    if (!transaction) return
    const routeInfo = tuyau.getRoute('investissements.transactions.destroy', {
      params: { id: supportId, transactionId: transaction.id },
    })
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

  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Supprimer cette transaction ?</DialogTitle>
          </DialogHeader>
          <DialogDescription className="my-4">
            Cette action est irréversible. La transaction du {formatDate(transaction.date)} sera
            définitivement supprimée.
          </DialogDescription>
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
            <Button type="submit" variant="destructive" size="sm" disabled={processing}>
              {processing ? 'Suppr...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
