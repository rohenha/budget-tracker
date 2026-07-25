import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '~/components/ui/table'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { formatBudget, getIcon, type Categorie } from '~/components/budget/constants'
import { AlertTriangle } from 'lucide-react'
import { cn } from '~/lib/utils'
import CategorySelect from '~/components/ui/category_select'

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

type EditableTransaction = ParsedTransaction & {
  editingField?: string | null
  originalValues: Record<string, any>
}

export default function ImportReviewTable({
  transactions,
  categories,
}: {
  transactions: ParsedTransaction[]
  categories: Categorie[]
}) {
  const [rows, setRows] = useState<EditableTransaction[]>(
    transactions.map((t) => ({
      ...t,
      editingField: null,
      originalValues: {
        date: t.date,
        libelle: t.libelle,
        montant: t.montant,
        type: t.type,
        description: t.description,
        categorieId: undefined,
      },
    }))
  )

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

  const startEdit = (index: number, field: string) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index ? { ...r, editingField: field } : { ...r, editingField: null }
      )
    )
  }

  const commitEdit = (index: number, field: keyof EditableTransaction, value: any) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              [field]: value,
              editingField: null,
              originalValues: {
                ...r.originalValues,
                [field]: r.originalValues[field] === undefined ? r[field] : r.originalValues[field],
              },
            }
          : r
      )
    )
  }

  const cancelEdit = (index: number) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? {
              ...r,
              date: r.originalValues.date,
              libelle: r.originalValues.libelle,
              montant: r.originalValues.montant,
              type: r.originalValues.type,
              description: r.originalValues.description,
              categorieId: r.originalValues.categorieId,
              editingField: null,
            }
          : { ...r, editingField: null }
      )
    )
  }

  const handleBlur = (index: number, _field: string) => {
    const row = rows[index]
    if (row.editingField) {
      cancelEdit(index)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, _index: number, _field: string) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget as HTMLElement
      target.blur()
    } else if (e.key === 'Escape') {
      cancelEdit(_index)
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
                      onChange={(e) => commitEdit(index, 'date', e.target.value)}
                      onBlur={() => handleBlur(index, 'date')}
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
                      onClick={() => startEdit(index, 'date')}
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
                    <Input
                      value={row.libelle}
                      onChange={(e) => commitEdit(index, 'libelle', e.target.value)}
                      onBlur={() => handleBlur(index, 'libelle')}
                      onKeyDown={(e) => handleKeyDown(e, index, 'libelle')}
                      autoFocus
                      className="w-full"
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-accent rounded px-1 py-0.5"
                      onClick={() => startEdit(index, 'libelle')}
                    >
                      {row.libelle}
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {row.editingField === 'montant' ? (
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={row.montant}
                      onChange={(e) =>
                        commitEdit(index, 'montant', Number.parseFloat(e.target.value) || 0)
                      }
                      onBlur={() => handleBlur(index, 'montant')}
                      onKeyDown={(e) => handleKeyDown(e, index, 'montant')}
                      autoFocus
                      className="w-24 text-right"
                    />
                  ) : (
                    <div
                      className={`cursor-pointer hover:bg-accent rounded px-1 py-0.5 text-right tabular-nums${row.type === 'entree' ? ' text-green-700' : ' text-red-700'}`}
                      onClick={() => startEdit(index, 'montant')}
                    >
                      {row.type === 'sortie' ? '-' : '+'}
                      {formatBudget(row.montant)}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {row.editingField === 'type' ? (
                    <Select
                      value={row.type}
                      onValueChange={(v) => commitEdit(index, 'type', v as 'entree' | 'sortie')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="entree">Entrée</SelectItem>
                          <SelectItem value="sortie">Sortie</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-accent rounded px-1 py-0.5"
                      onClick={() => startEdit(index, 'type')}
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
                        commitEdit(index, 'categorieId', v ? Number.parseInt(v, 10) : undefined)
                      }
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-accent rounded px-1 py-0.5"
                      onClick={() => startEdit(index, 'categorieId')}
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
                    <Input
                      value={row.description ?? ''}
                      onChange={(e) => commitEdit(index, 'description', e.target.value || null)}
                      onBlur={() => handleBlur(index, 'description')}
                      onKeyDown={(e) => handleKeyDown(e, index, 'description')}
                      autoFocus
                      placeholder="Optionnel"
                      className="w-full"
                    />
                  ) : (
                    <div
                      className="cursor-pointer hover:bg-accent rounded px-1 py-0.5 max-w-40 truncate"
                      onClick={() => startEdit(index, 'description')}
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
