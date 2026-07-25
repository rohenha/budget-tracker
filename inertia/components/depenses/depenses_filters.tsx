import { useState } from 'react'
import { router } from '@inertiajs/react'
import { RotateCcw } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Field, FieldLabel } from '~/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { Categorie } from '~/components/budget/constants'

export type Filters = {
  periode: string | undefined
  dateDebut: string
  dateFin: string
  category: string | undefined
  range: number
}

const PERIODE_OPTIONS = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: '7 jours' },
  { value: 'month', label: '30 jours' },
  { value: 'custom', label: 'Personnalisé' },
]

type DepensesFiltersProps = {
  filters: Filters
  categories: Categorie[]
}

export default function DepensesFilters({ filters, categories }: DepensesFiltersProps) {
  const [dateDebut, setDateDebut] = useState(filters.dateDebut ?? '')
  const [dateFin, setDateFin] = useState(filters.dateFin ?? '')
  const isCustom = filters.periode === 'custom'

  function applyFilters() {
    router.get(
      '/depenses',
      {
        category: filters.category,
        range: filters.range,
        periode: filters.periode,
        ...(isCustom ? { dateDebut, dateFin } : {}),
      },
      { preserveState: true, preserveScroll: true }
    )
  }

  function handlePeriodeChange(value: string | null) {
    if (!value || value === filters.periode) return
    if (value !== 'custom') {
      router.get(
        '/depenses',
        { category: filters.category, range: filters.range, periode: value },
        { preserveState: true, preserveScroll: true }
      )
    }
  }

  function handleCategoryChange(value: string | null) {
    if (value === filters.category) return
    router.get(
      '/depenses',
      { category: value, range: filters.range, periode: filters.periode },
      { preserveState: true, preserveScroll: true }
    )
  }

  function handleRangeChange(value: number | null) {
    const realValue = Number(value ?? 25)
    if (realValue === filters.range) return
    router.get(
      '/depenses',
      { category: filters.category, range: realValue, periode: filters.periode },
      { preserveState: true, preserveScroll: true }
    )
  }

  function handleResetFilters() {
    router.get(
      '/depenses',
      { category: '', periode: 'month', range: 25 },
      { preserveState: true, preserveScroll: true }
    )
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Field className="flex flex-col gap-1.5 w-fit">
        <FieldLabel htmlFor="periode" className="text-xs">
          Catégorie
        </FieldLabel>
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category" className="w-36">
            <SelectValue>
              {(() => {
                if (filters.category === '') {
                  return 'Toutes'
                }
                const cat = categories.find((c) => c.slug === filters.category)
                return cat ? cat.label : '-'
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="">Toutes</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field className="flex flex-col gap-1.5 w-fit">
        <FieldLabel htmlFor="periode" className="text-xs">
          Période
        </FieldLabel>
        <Select value={filters.periode} onValueChange={handlePeriodeChange}>
          <SelectTrigger id="periode" className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PERIODE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {isCustom && (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dateDebut" className="text-xs">
              Du
            </Label>
            <Input
              id="dateDebut"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dateFin" className="text-xs">
              Au
            </Label>
            <Input
              id="dateFin"
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-40"
            />
          </div>
          <Button size="sm" onClick={applyFilters}>
            Filtrer
          </Button>
        </>
      )}

      <Field className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Nombre par page</FieldLabel>
        <Select value={filters.range} onValueChange={handleRangeChange}>
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {(filters.periode !== 'month' || filters.category !== '' || filters.range !== 25) && (
        <Button size="sm" variant="outline" onClick={handleResetFilters}>
          <RotateCcw className="size-4 mr-2" />
          Réinitialiser
        </Button>
      )}
    </div>
  )
}
