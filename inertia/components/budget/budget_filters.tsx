import { router } from '@inertiajs/react'
import { Field, FieldLabel } from '~/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

export type MonthOption = {
  value: string
  label: string
}

type BudgetFiltersProps = {
  availableMonths: MonthOption[]
  selectedMonth: string
}

export default function BudgetFilters({ availableMonths, selectedMonth }: BudgetFiltersProps) {
  function handleMonthChange(value: string | null) {
    if (!value || value === selectedMonth) return
    router.get('/categories', { mois: value }, { preserveState: true, preserveScroll: true })
  }

  if (availableMonths.length <= 1) return null

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Field className="flex flex-col gap-1.5 w-fit">
        <FieldLabel htmlFor="mois" className="text-xs">
          Mois
        </FieldLabel>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger id="mois" className="w-44">
            <SelectValue>
              {availableMonths.find((m) => m.value === selectedMonth)?.label ?? '-'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {availableMonths.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  )
}
