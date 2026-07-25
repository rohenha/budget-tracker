import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { createElement } from 'react'
import { getIcon, type Categorie } from '~/components/budget/constants'

function CategorySelectItem({ cat }: { cat: Categorie }) {
  return (
    <SelectItem value={String(cat.id)}>
      <div className="flex items-center gap-2">
        {createElement(getIcon(cat.icon), {
          className: 'size-4',
          style: { color: cat.color },
        })}
        <span>{cat.label}</span>
      </div>
    </SelectItem>
  )
}

export default function CategorySelect({
  categories,
  value,
  onValueChange,
  errors,
}: {
  categories: Categorie[]
  value: string | number | undefined
  onValueChange: (value: string | null) => void
  errors?: string | string[]
}) {
  const display = (() => {
    if (value === undefined || value === null || value === '') return '-'
    const cat = categories.find((c) => String(c.id) === String(value))
    if (cat) {
      return (
        <>
          {createElement(getIcon(cat.icon), {
            className: 'size-4',
            style: { color: cat.color },
          })}
          <span>{cat.label}</span>
        </>
      )
    }
    return '-'
  })()

  return (
    <Select value={String(value ?? '')} onValueChange={onValueChange} data-invalid={!!errors}>
      <SelectTrigger className="w-full" aria-invalid={!!errors}>
        <SelectValue placeholder="Sélectionner">{display}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="">— Aucune —</SelectItem>
          {categories.map((cat) => (
            <CategorySelectItem key={cat.id} cat={cat} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
