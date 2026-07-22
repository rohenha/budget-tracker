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
import { getIcon, formatBudget, type Categorie } from '~/components/budget/constants'

export default function Budget({
  categories,
  categorySpending = [],
}: InertiaProps<{ categories: Categorie[]; categorySpending: CategorySpending[] }>) {
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
        {categories.length > 0 && (
          <Button size="sm" onClick={() => setAddOpen(true)}>
            Ajouter catégorie
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-2">
        <CategoryPieChart
          data={categorySpending}
          title="Répartition des entrées"
          description="Aucune entrée ce mois-ci"
        />
        <CategoryPieChart
          data={categorySpending}
          title="Répartition des dépenses"
          description="Aucune dépense ce mois-ci"
        />
      </div>

      <AddCategoryDialog open={addOpen} onOpenChange={setAddOpen} />

      <PageState
        empty={
          categories.length > 0
            ? null
            : {
                title: 'Aucune catégorie',
                message: 'Configure tes premières catégories de dépenses',
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
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Budget mensuel</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => {
              const Icon = getIcon(cat.icon)
              return (
                <TableRow key={cat.id}>
                  <TableCell>
                    <Icon className="size-4" style={{ color: cat.color }} />
                  </TableCell>
                  <TableCell className="font-medium">{cat.label}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell>
                    <TypeBadge type={cat.type} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatBudget(cat.budget)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => setEditId(cat.id)}>
                        <span className="sr-only">Modifier</span>
                        <SquarePen />
                      </Button>
                      <EditCategoryDialog
                        categorie={cat}
                        open={editId === cat.id}
                        onOpenChange={(o) => setEditId(o ? cat.id : null)}
                      />
                      {cat.slug !== 'autre' && (
                        <>
                          <Button
                            variant="destructive"
                            size="icon-sm"
                            onClick={() => setDeleteId(cat.id)}
                          >
                            <span className="sr-only">Supprimer</span>
                            <Trash2 />
                          </Button>
                          <DeleteCategoryDialog
                            categorie={cat}
                            open={deleteId === cat.id}
                            onOpenChange={(o) => setDeleteId(o ? cat.id : null)}
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
