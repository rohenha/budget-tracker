import { Form } from '@adonisjs/inertia/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'

type DeleteDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  route:
    | 'home'
    | 'budget'
    | 'depenses'
    | 'new_account.create'
    | 'new_account.store'
    | 'session.create'
    | 'session.store'
    | 'session.destroy'
    | 'dashboard'
    | 'categories.store'
    | 'categories.edit'
    | 'categories.destroy'
    | 'depenses.edit'
    | 'depenses.destroy'
    | 'loans'
    | 'loans.store'
    | 'loans.destroy'
    | 'investissements'
    | 'cryptos'
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form route={route} routeParams={routeParams} onSuccess={() => onOpenChange(false)}>
          {() => (
            <>
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
                >
                  Annuler
                </Button>
                <Button type="submit" variant="destructive" size="sm">
                  Supprimer
                </Button>
              </DialogFooter>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
