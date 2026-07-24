import { useState, useRef } from 'react'
import { router } from '@inertiajs/react'
import { Plus, Upload, SquarePen, Trash2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '~/components/ui/pagination'
import AddDepenseDialog from '~/components/depenses/add_depense_dialog'
import EditDepenseDialog from '~/components/depenses/edit_depense_dialog'
import DeleteDepenseDialog from '~/components/depenses/delete_depense_dialog'
import { getIcon, formatBudget, type Categorie } from '~/components/budget/constants'
import { toast } from 'sonner'
import type { Depense } from '~/components/depenses/constants'

type Filters = {
  periode: string | undefined
  dateDebut: string
  dateFin: string
  category: string | undefined
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
  depenses: { data: Depense[]; meta: any; links: any[] }
  categories: Categorie[]
  filters: Filters
}>) {
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [periode, setPeriode] = useState(filters.periode)
  const [category, setCategory] = useState(filters.category ?? '')
  const [dateDebut, setDateDebut] = useState(filters.dateDebut ?? '')
  const [dateFin, setDateFin] = useState(filters.dateFin ?? '')
  const isCustom = periode === 'custom'
  const items = depenses.data ?? []

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    router.post('/depenses/import', formData, {
      onSuccess: () => {},
      onError: (errors) => toast.error(errors.message ?? "Erreur lors de l'import"),
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function applyFilters() {
    router.get(
      '/depenses',
      { periode, ...(isCustom ? { dateDebut, dateFin } : {}) },
      { preserveState: true, preserveScroll: true }
    )
  }

  function handlePeriodeChange(value: string | null) {
    if (!value) {
      return
    }
    setPeriode(value)
    if (value !== 'custom') {
      router.get(
        '/depenses',
        { periode: value, category: category },
        { preserveState: true, preserveScroll: true }
      )
    }
  }

  function handleCategoryChange(value: string | null) {
    setCategory(value ?? '')
    router.get(
      '/depenses',
      { category: value, periode: periode },
      { preserveState: true, preserveScroll: true }
    )
  }

  function handleResetFilters() {
    setCategory('')
    setPeriode('month')
    setDateDebut('')
    setDateFin('')
    router.get(
      '/depenses',
      { category: '', periode: 'month' },
      { preserveState: true, preserveScroll: true }
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dépenses</h1>
          <p className="text-sm text-muted-foreground">Suivi des dépenses et revenus</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="size-4 mr-2" />
            Importer CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Ajouter
          </Button>
        </div>
      </div>

      <AddDepenseDialog open={addOpen} onOpenChange={setAddOpen} categories={categories} />

      <div className="flex flex-wrap items-end gap-3">
        <Field className="flex flex-col gap-1.5 max-w-40">
          <FieldLabel htmlFor="periode" className="text-xs">
            Catégorie
          </FieldLabel>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">-</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field className="flex flex-col gap-1.5 max-w-40">
          <FieldLabel htmlFor="periode" className="text-xs">
            Période
          </FieldLabel>
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

        {(periode !== 'month' || category) && (
          <Button size="sm" variant="outline" onClick={handleResetFilters}>
            <RotateCcw className="size-4 mr-2" />
            Réinitialiser
          </Button>
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
              <TableHead className="w-20" />
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
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => setEditId(depense.id)}
                      >
                        <span className="sr-only">Modifier</span>
                        <SquarePen />
                      </Button>
                      <EditDepenseDialog
                        depense={depense}
                        categories={categories}
                        open={editId === depense.id}
                        onOpenChange={(o) => setEditId(o ? depense.id : null)}
                      />
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => setDeleteId(depense.id)}
                      >
                        <span className="sr-only">Supprimer</span>
                        <Trash2 />
                      </Button>
                      <DeleteDepenseDialog
                        depense={depense}
                        open={deleteId === depense.id}
                        onOpenChange={(o) => setDeleteId(o ? depense.id : null)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {depenses.meta && depenses.meta.last_page > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                {depenses.meta.current_page > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => router.get(depenses.links[0]?.url)}
                      size="default"
                    >
                      <ChevronLeft data-icon="inline-start" />
                      <span className="hidden sm:block">Précédent</span>
                    </PaginationLink>
                  </PaginationItem>
                )}
                {Array.from({ length: depenses.meta.last_page }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() =>
                        router.get(depenses.links.find((l: any) => l.page === page)?.url)
                      }
                      isActive={page === depenses.meta.current_page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {depenses.meta.current_page < depenses.meta.last_page && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() =>
                        router.get(depenses.links[depenses.links.length - 1]?.url)
                      }
                      size="default"
                    >
                      <span className="hidden sm:block">Suivant</span>
                      <ChevronRight data-icon="inline-end" />
                    </PaginationLink>
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </PageState>
    </div>
  )
}
