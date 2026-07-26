import { useState } from 'react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
import { Button } from '~/components/ui/button'
import { Plus } from 'lucide-react'
import TypeBadge from '~/components/depenses/type_badge'
import AddCategoryDialog from '~/components/budget/add_category_dialog'
import EditCategoryDialog from '~/components/budget/edit_category_dialog'
import DeleteCategoryDialog from '~/components/budget/delete_category_dialog'
import CategoryPieChart, { type CategorySpending } from '~/components/budget/category_pie_chart'
import { getIcon, formatBudget } from '~/components/budget/constants'
import ProgressBadge from '~/components/depenses/progress_badge'
import DataTable from '~/components/ui/data_table'

export default function Budget({
  categorySpending = [],
  categoryEntry = [],
}: InertiaProps<{
  categorySpending: CategorySpending[]
  categoryEntry: CategorySpending[]
}>) {
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const items = [...categoryEntry, ...categorySpending]

  const columns = [
    {
      label: '',
      className: 'w-8',
      render: (cat: CategorySpending) => {
        const Icon = getIcon(cat.icon)
        return <Icon className="size-4" style={{ color: cat.color }} />
      },
    },
    {
      label: 'Catégorie',
      className: 'font-medium',
      render: (cat: CategorySpending) => cat.label,
    },
    {
      label: 'Slug',
      className: 'text-muted-foreground',
      render: (cat: CategorySpending) => cat.slug,
    },
    {
      label: 'Budget mensuel',
      className: 'text-right font-medium',
      render: (cat: CategorySpending) => formatBudget(cat.budget),
    },
    {
      label: 'Réel',
      className: 'text-right',
      render: (cat: CategorySpending) => {
        let badgeType: 'neutral' | 'up' | 'down'
        if (!cat.budget) {
          badgeType = 'neutral'
        } else if (cat.type === 'entree') {
          badgeType = cat.budget <= cat.spent ? 'up' : 'down'
        } else {
          badgeType = cat.budget >= cat.spent ? 'up' : 'down'
        }
        return (
          <ProgressBadge
            text={formatBudget(cat.spent)}
            type={badgeType}
            reverse={cat.type === 'sortie'}
          />
        )
      },
    },
    {
      label: 'Type',
      className: 'text-center w-10',
      render: (cat: CategorySpending) => <TypeBadge type={cat.type} />,
    },
  ]

  const editItem = editId !== null ? items.find((c) => c.categorieId === editId) : null
  const deleteItem = deleteId !== null ? items.find((c) => c.categorieId === deleteId) : null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Budget</h1>
          <p className="text-sm text-muted-foreground">
            Gestion des catégories et budget prévisionnel
          </p>
        </div>
        {items.length > 0 && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Ajouter catégorie
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-2">
        <CategoryPieChart
          data={categoryEntry}
          label="Rentrées"
          title="Répartition des rentrées"
          description="Aucune rentrée ce mois-ci"
          spending={false}
        />
        <CategoryPieChart
          data={categorySpending}
          label="Dépensé"
          title="Répartition des dépenses"
          description="Aucune dépense ce mois-ci"
          spending={true}
        />
      </div>

      <AddCategoryDialog open={addOpen} onOpenChange={setAddOpen} />

      <PageState
        empty={
          items.length > 0
            ? null
            : {
                title: 'Aucune catégorie',
                message: 'Configure tes premières catégories de dépenses et rentrées',
                action: { label: 'Ajouter catégorie', onClick: () => setAddOpen(true) },
              }
        }
      >
        <DataTable
          data={items}
          columns={columns}
          keyExtractor={(c) => c.categorieId}
          onEdit={(c) => setEditId(c.categorieId)}
          onDelete={(c) => setDeleteId(c.categorieId)}
          canDelete={(c) => c.slug !== 'autre'}
        />
      </PageState>

      {editItem && (
        <EditCategoryDialog categorie={editItem} open onOpenChange={(o) => !o && setEditId(null)} />
      )}
      {deleteItem && (
        <DeleteCategoryDialog
          categorie={deleteItem}
          open
          onOpenChange={(o) => !o && setDeleteId(null)}
        />
      )}
    </div>
  )
}
