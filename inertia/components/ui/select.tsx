import { Select as SelectPrimitive, type Select as SelectTypes } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '~/lib/utils'

function Select(props: SelectTypes.Root.Props<string>) {
  return <SelectPrimitive.Root {...props} />
}

function SelectTrigger({ className, children, ...props }: SelectTypes.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        'flex h-7 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-3.5 text-muted-foreground" />
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({ className, ...props }: SelectTypes.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('text-sm', className)}
      {...props}
    />
  )
}

function SelectPopup({ className, ...props }: SelectTypes.Popup.Props) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner>
        <SelectPrimitive.Popup
          data-slot="select-popup"
          className={cn(
            'z-50 max-h-[var(--anchor-max-height)] min-w-[var(--anchor-width)] origin-[var(--transform-origin)] rounded-xl border bg-popover p-1 shadow-lg data-leaving:animate-out data-leaving:fade-out-0 data-leaving:zoom-out-95 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95',
            className
          )}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...props }: SelectTypes.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default items-center rounded-md py-1.5 pr-8 pl-2 text-xs/relaxed outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 inline-flex items-center">
        <Check className="size-3.5" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectGroup({ className, ...props }: SelectTypes.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" className={cn('', className)} {...props} />
}

function SelectLabel({ className, ...props }: SelectTypes.Label.Props) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('px-2 py-1.5 text-xs font-medium', className)}
      {...props}
    />
  )
}

function SelectSeparator({ className, ...props }: SelectTypes.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
}
