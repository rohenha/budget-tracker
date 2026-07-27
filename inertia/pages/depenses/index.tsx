import { useState, useRef } from 'react'
import { router } from '@inertiajs/react'
import { Plus, Upload } from 'lucide-react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
import { Button } from '~/components/ui/button'
import { getIcon, formatBudget, type Categorie } from '~/components/budget/constants'
import { toast } from 'sonner'
import type { Depense } from '~/components/depenses/constants'
import DepensesFilters from '~/components/depenses/depenses_filters'
import type { Filters } from '~/components/depenses/depenses_filters'
import DataTable from '~/components/ui/data-table'
import DataPagination, { type PaginationSource } from '~/components/ui/data-pagination'
import AddDepenseDialog from '~/components/depenses/add_depense_dialog'
import EditDepenseDialog from '~/components/depenses/edit_depense_dialog'
import DeleteDepenseDialog from '~/components/depenses/delete_depense_dialog'
import DailyExpensesChart from '~/components/depenses/daily_expenses_chart'

function formatDate(date: string) {
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR')
}

export default function Depenses({
  depenses,
  categories,
  filters,
  pagination,
  dailyChartData,
}: InertiaProps<{
  depenses: { data: Depense[]; meta: { current_page: number; last_page: number }; links: any[] }
  categories: Categorie[]
  filters: Filters
  pagination: PaginationSource
  dailyChartData: Array<{ date: string; total: number }>
}>) {
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const items = depenses.data ?? []
  const isCustom = filters.periode === 'custom'

  const columns = [
    {
      label: 'Date',
      className: 'text-muted-foreground text-sm',
      render: (d: Depense) => formatDate(d.date),
    },
    {
      label: 'Libellé',
      className: 'font-medium',
      render: (d: Depense) => d.libelle,
    },
    {
      label: 'Montant',
      className: 'text-right font-medium tabular-nums',
      render: (d: Depense) => (
        <span className={d.type === 'sortie' ? 'text-red-600' : 'text-green-600'}>
          {d.type === 'sortie' ? '-' : '+'}
          {formatBudget(d.montant)}
        </span>
      ),
    },
    {
      label: 'Catégorie',
      render: (d: Depense) => {
        const Icon = d.categorie ? getIcon(d.categorie.icon) : null
        return d.categorie ? (
          <div className="flex items-center gap-1.5">
            {Icon && <Icon className="size-4" style={{ color: d.categorie.color }} />}
            <span className="text-sm">{d.categorie.label}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )
      },
    },
    {
      label: 'Description',
      className: 'text-xsm text-muted-foreground max-w-40 truncate',
      render: (d: Depense) => d.description ?? '—',
    },
  ]

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

  function handlePageClick(page: number) {
    return (e: React.MouseEvent) => {
      e.preventDefault()
      router.get(
        '/depenses',
        {
          category: filters.category,
          periode: filters.periode,
          range: filters.range,
          ...(isCustom ? { dateDebut: filters.dateDebut, dateFin: filters.dateFin } : {}),
          page,
        },
        { preserveState: true, preserveScroll: true }
      )
    }
  }

  const editDepense = editId !== null ? items.find((d) => d.id === editId) : null
  const deleteDepense = deleteId !== null ? items.find((d) => d.id === deleteId) : null

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

      <DepensesFilters filters={filters} categories={categories} />

      <DailyExpensesChart data={dailyChartData} />

      <PageState
        empty={
          items.length === 0
            ? { title: 'Aucune dépense', message: 'Aucune dépense pour cette période' }
            : null
        }
      >
        <DataTable
          data={items}
          columns={columns}
          keyExtractor={(d) => d.id}
          onEdit={(d) => setEditId(d.id)}
          onDelete={(d) => setDeleteId(d.id)}
        />
        {pagination.links.length > 1 && (
          <DataPagination pagination={pagination} onPageChange={handlePageClick} />
        )}
      </PageState>

      <AddDepenseDialog open={addOpen} onOpenChange={setAddOpen} categories={categories} />

      {editDepense && (
        <EditDepenseDialog
          depense={editDepense}
          categories={categories}
          open
          onOpenChange={(o) => !o && setEditId(null)}
        />
      )}
      {deleteDepense && (
        <DeleteDepenseDialog
          depense={deleteDepense}
          open
          onOpenChange={(o) => !o && setDeleteId(null)}
        />
      )}
    </div>
  )
}
