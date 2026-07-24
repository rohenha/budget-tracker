import { useState } from 'react'
import { Input } from '~/components/ui/input'
import { FieldError } from '~/components/ui/field'
import { cn } from '~/lib/utils'
import { ICON_NAMES, getIcon } from '~/components/budget/constants'

type IconPickerProps = {
  value: string
  onChange: (icon: string) => void
  error?: string
}

export default function IconPicker({ value, onChange, error }: IconPickerProps) {
  const [search, setSearch] = useState('')
  const filtered = ICON_NAMES.filter((n) => n.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <Input
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-7"
      />
      <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto mt-1">
        {filtered.map((name) => {
          const I = getIcon(name)
          return (
            <button
              key={name}
              type="button"
              onClick={() => {
                onChange(name)
                setSearch('')
              }}
              className={cn(
                'flex size-7 items-center justify-center rounded-md border transition-colors',
                value === name
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-accent'
              )}
              title={name}
            >
              <I className="size-4" />
            </button>
          )
        })}
      </div>
      <input type="hidden" name="icon" value={value} />
      {error && <FieldError errors={[{ message: error }]} />}
    </>
  )
}
