import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'
import AddDepenseDialog from '~/components/depenses/add_depense_dialog'
import { getIcon, formatBudget, type Categorie } from '~/components/budget/constants'

type Depense = {
  id: number
  userId: number
  categorieId: number | null
  libelle: string
  montant: number
  type: 'entree' | 'sortie'
  description: string | null
  date: string
  categorie: Categorie | null
}

type Filters = {
  periode: string | undefined
  dateDebut: string
  dateFin: string
}

const PERIODE_OPTIONS = [
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: '7 jours' },
  { value: 'month', label: '30 jours' },
  { value: 'custom', label: 'Personnalisé' },
]

function formatDate(date: string) {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR')
}

export default function Depenses({
  depenses,
  categories,
  filters,
}: InertiaProps<{
  depenses: { data: Depense[]; meta: any }
  categories: Categorie[]
  filters: Filters
}>) {
  const [addOpen, setAddOpen] = useState(false)
  const [periode, setPeriode] = useState(filters.periode)
  const [dateDebut, setDateDebut] = useState(filters.dateDebut ?? '')
  const [dateFin, setDateFin] = useState(filters.dateFin ?? '')
  const isCustom = periode === 'custom'
  const items = depenses.data ?? []

  function applyFilters() {
    router.get(
      '/depenses',
      { periode, ...(isCustom ? { dateDebut, dateFin } : {}) },
      { preserveState: true, preserveScroll: true }
    )
  }
  // '(value: string | null, eventDetails: SelectRootChangeEventDetails) => void'

  function handlePeriodeChange(value: string | null) {
    if (!value) {
      return
    }
    setPeriode(value)
    if (value !== 'custom') {
      router.get('/depenses', { periode: value }, { preserveState: true, preserveScroll: true })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dépenses</h1>
          <p className="text-sm text-muted-foreground">Suivi des dépenses et revenus</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Ajouter
        </Button>
      </div>

      <AddDepenseDialog open={addOpen} onOpenChange={setAddOpen} categories={categories} />

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="periode" className="text-xs">
            Période
          </Label>
          <Select value={periode} onValueChange={handlePeriodeChange}>
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
        </div>

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
      </div>

      <PageState
        empty={
          items.length === 0
            ? { title: 'Aucune dépense', message: 'Aucune dépense pour cette période' }
            : null
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((depense) => {
              const Icon = depense.categorie ? getIcon(depense.categorie.icon) : null
              return (
                <TableRow key={depense.id}>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(depense.date)}
                  </TableCell>
                  <TableCell className="font-medium">{depense.libelle}</TableCell>
                  <TableCell
                    className={`text-right font-medium tabular-nums ${
                      depense.type === 'sortie' ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {depense.type === 'sortie' ? '-' : '+'}
                    {formatBudget(depense.montant)}
                  </TableCell>
                  <TableCell>
                    {depense.categorie ? (
                      <div className="flex items-center gap-1.5">
                        {Icon && (
                          <Icon className="size-4" style={{ color: depense.categorie.color }} />
                        )}
                        <span className="text-sm">{depense.categorie.label}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-40 truncate">
                    {depense.description ?? '—'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </PageState>
    </div>
  )
}
