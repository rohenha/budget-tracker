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
import AddCategoryDialog from '~/components/budget/add-category-dialog'
import EditCategoryDialog from '~/components/budget/edit-category-dialog'
import DeleteCategoryDialog from '~/components/budget/delete-category-dialog'
import { getIcon, formatBudget, type Categorie } from '~/components/budget/constants'

export default function Budget({ categories }: InertiaProps<{ categories: Categorie[] }>) {
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Budget</h1>
          <p className="text-sm text-muted-foreground">Gestion des catégories et budget prévisionnel</p>
        </div>
        {categories.length > 0 && (
          <Button size="sm" onClick={() => setAddOpen(true)}>Ajouter catégorie</Button>
        )}
      </div>

      <AddCategoryDialog open={addOpen} onOpenChange={setAddOpen} />

      <PageState
        empty={{
          title: 'Aucune catégorie',
          message: 'Configure tes premières catégories de dépenses',
          action: { label: 'Ajouter catégorie', onClick: () => setAddOpen(true) },
        }}
      >
        {categories.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Catégorie</TableHead>
                <TableHead>Slug</TableHead>
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
                    <TableCell className="text-right font-medium">{formatBudget(cat.budget)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => setEditId(cat.id)}>
                          <span className="sr-only">Modifier</span>
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Button>
                        <EditCategoryDialog
                          categorie={cat}
                          open={editId === cat.id}
                          onOpenChange={(o) => setEditId(o ? cat.id : null)}
                        />
                        {cat.slug !== 'autre' && (
                          <>
                            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(cat.id)}>
                              <span className="sr-only">Supprimer</span>
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
        )}
      </PageState>
    </div>
  )
}
