import type { ReactNode } from 'react'
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

type FormDialogProps = {
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
    | 'depenses.store'
    | 'depenses.edit'
    | 'depenses.destroy'
    | 'depenses.import.upload'
    | 'loans'
    | 'loans.store'
    | 'loans.edit'
    | 'investissements'
    | 'cryptos'
  routeParams?: Record<string, any>
  title: string
  description?: string
  submitLabel?: string
  cancelLabel?: string
  children: (props: {
    errors: Record<string, string>
    onOpenChange: (v: boolean) => void
  }) => ReactNode
}

export default function FormDialog({
  open,
  onOpenChange,
  route,
  routeParams,
  title,
  description,
  submitLabel = 'Enregistrer',
  cancelLabel = 'Annuler',
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form route={route} routeParams={routeParams} onSuccess={() => onOpenChange(false)}>
          {({ errors }) => (
            <>
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {children({ errors, onOpenChange })}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                  >
                    {cancelLabel}
                  </Button>
                  <Button type="submit" size="sm">
                    {submitLabel}
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
