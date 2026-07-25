import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '~/components/ui/table'
import { Input } from '~/components/ui/input'
import { formatBudget, getIcon, type Categorie } from '~/components/budget/constants'
import { AlertTriangle, Check } from 'lucide-react'
import { cn } from '~/lib/utils'
import CategorySelect from '~/components/ui/category_select'
import TypeExpenseSelect from '~/components/ui/type_expense_select'

type ParsedTransaction = {
  rawDate: string
  date: string | null
  libelle: string
  montant: number
  type: 'entree' | 'sortie'
  description: string | null
  dateError?: string
  categorieId?: number
}

export type EditableTransaction = ParsedTransaction & {
  editingField?: string | null
  originalValues: Record<string, any>
}

export default function ImportReviewTable({
  rows,
  categories,
  onStartEdit,
  onUpdateField,
  onCommitEdit,
  onCancelEdit,
}: {
  rows: EditableTransaction[]
  categories: Categorie[]
  onStartEdit: (index: number, field: keyof EditableTransaction) => void
  onUpdateField: (index: number, field: keyof EditableTransaction, value: any) => void
  onCommitEdit: (index: number, field: keyof EditableTransaction, value?: any) => void
  onCancelEdit: (index: number) => void
}) {
  const isRowEdited = (row: EditableTransaction) => {
    const o = row.originalValues
    return (
      o.date !== row.date ||
      o.libelle !== row.libelle ||
      o.montant !== row.montant ||
      o.type !== row.type ||
      o.description !== row.description ||
      (o.categorieId !== undefined && o.categorieId !== row.categorieId)
    )
  }

  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    field: keyof EditableTransaction
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onCommitEdit(index, field)
    } else if (e.key === 'Escape') {
      onCancelEdit(index)
    }
  }

  const errorCount = rows.filter((r) => r.dateError).length
  const validCount = rows.filter((r) => !r.dateError).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {rows.length} lignes &middot; {validCount} valides &middot; {errorCount} erreurs
        </span>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Date</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead className="text-right w-28">Montant</TableHead>
              <TableHead className="w-36">Type</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                className={cn(
                  isRowEdited(row) && 'bg-primary/5',
                  row.dateError && 'bg-destructive/5'
                )}
              >
                <TableCell className="relative">
                  {row.editingField === 'date' ? (
                    <Input
                      type="date"
                      value={row.date ?? ''}
                      onChange={(e) => onCommitEdit(index, 'date', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index, 'date')}
                      autoFocus
                      className={cn(
                        'w-full',
                        row.dateError && 'border-destructive bg-destructive/10'
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        'cursor-pointer hover:bg-accent rounded px-1 py-0.5',
                        row.dateError && 'border-destructive bg-destructive/10'
                      )}
                      onClick={() => onStartEdit(index, 'date')}
                    >
                      {row.date ? new Date(row.date).toLocaleDateString('fr-FR') : row.rawDate}
                      {row.dateError && (
                        <span
                          className={cn(
                            'absolute right-1 top-1/2 -translate-y-1/2 size-4 shrink-0',
                            'text-destructive'
                          )}
                          title={row.dateError}
                        >
                          <AlertTriangle className="size-4" />
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {row.editingField === 'libelle' ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={row.libelle}
                        onChange={(e) => onUpdateField(index, 'libelle', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index, 'libelle')}
                        autoFocus
                        className="w-full"
                      />
                      <button
                        type="button"
                        onClick={() => onCommitEdit(index, 'libelle')}
                        className="shrink-0 rounded p-0.5 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                      >
                        <Check className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-accent rounded px-1 py-0.5"
                      onClick={() => onStartEdit(index, 'libelle')}
                    >
                      {row.libelle}
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {row.editingField === 'montant' ? (
                    <div className="flex items-center gap-1 justify-end">
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={row.montant}
                        onChange={(e) =>
                          onUpdateField(index, 'montant', Number.parseFloat(e.target.value) || 0)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index, 'montant')}
                        autoFocus
                        className="w-24 text-right"
                      />
                      <button
                        type="button"
                        onClick={() => onCommitEdit(index, 'montant')}
                        className="shrink-0 rounded p-0.5 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                      >
                        <Check className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`cursor-pointer hover:bg-accent rounded px-1 py-0.5 text-right tabular-nums${row.type === 'entree' ? ' text-green-700' : ' text-red-700'}`}
                      onClick={() => onStartEdit(index, 'montant')}
                    >
                      {row.type === 'sortie' ? '-' : '+'}
                      {formatBudget(row.montant)}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {row.editingField === 'type' ? (
                    <TypeExpenseSelect
                      value={row.type}
                      onValueChange={(v) => onCommitEdit(index, 'type', v)}
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-accent rounded px-1 py-0.5"
                      onClick={() => onStartEdit(index, 'type')}
                    >
                      {row.type === 'entree' ? 'Entrée' : 'Sortie'}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {row.editingField === 'categorieId' ? (
                    <CategorySelect
                      value={row.categorieId}
                      categories={categories}
                      onValueChange={(v) =>
                        onCommitEdit(index, 'categorieId', v ? Number.parseInt(v, 10) : undefined)
                      }
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-accent rounded px-1 py-0.5"
                      onClick={() => onStartEdit(index, 'categorieId')}
                    >
                      {row.categorieId ? (
                        (() => {
                          const cat = categories.find((c) => c.id === row.categorieId)
                          if (!cat) return '—'
                          const Icon = getIcon(cat.icon)
                          return (
                            <span className="flex items-center gap-1.5">
                              <Icon className="size-3.5" style={{ color: cat.color }} />
                              {cat.label}
                            </span>
                          )
                        })()
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell className="max-w-40">
                  {row.editingField === 'description' ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={row.description ?? ''}
                        onChange={(e) => onUpdateField(index, 'description', e.target.value || null)}
                        onKeyDown={(e) => handleKeyDown(e, index, 'description')}
                        autoFocus
                        placeholder="Optionnel"
                        className="w-full"
                      />
                      <button
                        type="button"
                        onClick={() => onCommitEdit(index, 'description')}
                        className="shrink-0 rounded p-0.5 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                      >
                        <Check className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-accent rounded px-1 py-0.5 max-w-40 truncate"
                      onClick={() => onStartEdit(index, 'description')}
                    >
                      {row.description ?? '—'}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {rows.some(isRowEdited) && (
          <span className="flex items-center gap-1 text-primary">
            <span className="size-2 rounded-full bg-primary" />
            Lignes modifiées
          </span>
        )}
      </div>
    </div>
  )
}
