import { useState } from 'react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'
import { Trash2, SquarePen } from 'lucide-react'
import TypeBadge from '~/components/depenses/type_badge'
import AddCategoryDialog from '~/components/budget/add_category_dialog'
import EditCategoryDialog from '~/components/budget/edit_category_dialog'
import DeleteCategoryDialog from '~/components/budget/delete_category_dialog'
import CategoryPieChart, { type CategorySpending } from '~/components/budget/category_pie_chart'
import { getIcon, formatBudget } from '~/components/budget/constants'
import ProgressBadge from '~/components/depenses/progress_badge'

export default function Budget({
  // categories,
  categorySpending = [],
  categoryEntry = [],
}: InertiaProps<{
  // categories: Categorie[]
  categorySpending: CategorySpending[]
  categoryEntry: CategorySpending[]
}>) {
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Budget</h1>
          <p className="text-sm text-muted-foreground">
            Gestion des catégories et budget prévisionnel
          </p>
        </div>
        {(categorySpending.length > 0 || categoryEntry.length > 0) && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
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
          categoryEntry.length > 0 || categorySpending.length > 0
            ? null
            : {
                title: 'Aucune catégorie',
                message: 'Configure tes premières catégories de dépenses et rentrées',
                action: { label: 'Ajouter catégorie', onClick: () => setAddOpen(true) },
              }
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Catégorie</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Budget mensuel</TableHead>
              <TableHead className="text-right">Réel</TableHead>
              <TableHead className="text-center w-10">Type</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...categoryEntry, ...categorySpending].map((cat) => {
              const Icon = getIcon(cat.icon)
              return (
                <TableRow key={cat.categorieId}>
                  <TableCell>
                    <Icon className="size-4" style={{ color: cat.color }} />
                  </TableCell>
                  <TableCell className="font-medium">{cat.label}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatBudget(cat.budget)}
                  </TableCell>
                  {cat.type === 'entree' ? (
                    <TableCell className="text-right">
                      <ProgressBadge
                        text={formatBudget(cat.spent)}
                        type={!cat.budget ? 'neutral' : cat.budget <= cat.spent ? 'up' : 'down'}
                      />
                    </TableCell>
                  ) : (
                    <TableCell className="text-right">
                      <ProgressBadge
                        text={formatBudget(cat.spent)}
                        type={!cat.budget ? 'neutral' : cat.budget >= cat.spent ? 'up' : 'down'}
                        reverse={true}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <TypeBadge type={cat.type} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => setEditId(cat.categorieId)}
                      >
                        <span className="sr-only">Modifier</span>
                        <SquarePen />
                      </Button>
                      <EditCategoryDialog
                        categorie={cat}
                        open={editId === cat.categorieId}
                        onOpenChange={(o) => setEditId(o ? cat.categorieId : null)}
                      />
                      {cat.slug !== 'autre' && (
                        <>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => setDeleteId(cat.categorieId)}
                          >
                            <span className="sr-only">Supprimer</span>
                            <Trash2 />
                          </Button>
                          <DeleteCategoryDialog
                            categorie={cat}
                            open={deleteId === cat.categorieId}
                            onOpenChange={(o) => setDeleteId(o ? cat.categorieId : null)}
                          />
                        </>
                      )}
                    </div>
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
