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

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  route: string
  routeParams: Record<string, any>
  entityName: string
  message?: string
}

export default function DeleteDialog({
  open,
  onOpenChange,
  route,
  routeParams,
  entityName,
  message,
}: DeleteDialogProps) {
  const tuyau = useTuyau()

  const { processing, submit, reset: resetFormState } = useForm<Record<string, never>>({})

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    const routeInfo = tuyau.getRoute(route, { params: routeParams })
    const method = routeInfo.methods[0].toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete'
    submit(method, routeInfo.url, {
      onSuccess: () => {
        resetFormState()
        onOpenChange(false)
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
            <DialogTitle>Supprimer {entityName} ?</DialogTitle>
          </DialogHeader>
          {message && <DialogDescription className="my-4">{message}</DialogDescription>}
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
