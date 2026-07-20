import { Dialog as DialogPrimitive, type Dialog as DialogTypes } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { cn } from '~/lib/utils'

function DialogTrigger(props: DialogTypes.Trigger.Props) {
  return <DialogPrimitive.Trigger {...props} />
}

function DialogPortal(props: DialogTypes.Portal.Props) {
  return <DialogPrimitive.Portal {...props} />
}

function DialogOverlay({ className, ...props }: DialogTypes.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        'fixed inset-0 bg-black/15 data-closed:opacity-0 data-entering:animate-in data-leaving:animate-out data-leaving:fade-out-0 data-entering:fade-in-0 dark:bg-black/40',
        className
      )}
      {...props}
    />
  )
}

function DialogContent({ className, children, ...props }: DialogTypes.Popup.Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        className={cn(
          'fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-popover p-4 shadow-lg data-closed:opacity-0 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-leaving:animate-out data-leaving:fade-out-0 data-leaving:zoom-out-95 duration-200',
          className
        )}
        {...props}
      >
        <DialogPrimitive.Close>
          <button
            type="button"
            aria-label="Fermer"
            className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <X className="size-4" />
          </button>
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

function DialogTitle({ className, ...props }: DialogTypes.Title.Props) {
  return <DialogPrimitive.Title className={cn('text-base font-semibold', className)} {...props} />
}

function DialogDescription({ className, ...props }: DialogTypes.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    />
  )
}

function DialogClose(props: DialogTypes.Close.Props) {
  return <DialogPrimitive.Close {...props} />
}

export {
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
