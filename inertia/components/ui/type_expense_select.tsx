import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import TypeBadge from '~/components/depenses/type_badge'

const LABELS: Record<string, { label: string; value: string }> = {
  entree: { label: 'Entrée', value: 'entree' },
  sortie: { label: 'Sortie', value: 'sortie' },
}

export default function TypeExpenseSelect({
  value,
  onValueChange,
  errors,
}: {
  value: string
  onValueChange: (value: 'entree' | 'sortie') => void
  errors?: string | string[]
  showPreview?: boolean
}) {
  const display = (() => {
    const label = LABELS[value]?.label ?? ''

    if (!label) {
      return 'Type'
    }
    return (
      <span className="flex items-center gap-1">
        <TypeBadge type={value as 'entree' | 'sortie'} />
        {label}
      </span>
    )
  })()

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onValueChange={(v) => onValueChange(v as 'entree' | 'sortie')}
        data-invalid={!!errors}
      >
        <SelectTrigger className="w-36" aria-invalid={!!errors}>
          <SelectValue placeholder="Type">
            <span>{display}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Object.values(LABELS).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <TypeBadge type={item.value as 'entree' | 'sortie'} />
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {/* {showPreview && <TypeBadge type={value as 'entree' | 'sortie'} />} */}
    </div>
  )
}
