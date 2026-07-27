import { SquarePen, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '~/components/ui/table'

type Column<T> = {
  label: string
  className?: string
  render: (item: T) => React.ReactNode
}

type DataTableProps<T> = {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string | number
  onRowClick?: (item: T) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  canDelete?: (item: T) => boolean
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  onEdit,
  onDelete,
  canDelete,
}: DataTableProps<T>) {
  const hasActions = onEdit || onDelete

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
          {hasActions && <TableHead className="w-20" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={keyExtractor(item)}
            className={onRowClick ? 'cursor-pointer' : undefined}
            onClick={
              onRowClick
                ? (e) => {
                    const target = e.target as HTMLElement
                    if (!target.closest('button')) {
                      onRowClick(item)
                    }
                  }
                : undefined
            }
          >
            {columns.map((col) => (
              <TableCell key={col.label} className={col.className}>
                {col.render(item)}
              </TableCell>
            ))}
            {hasActions && (
              <TableCell>
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Button variant="secondary" size="icon-sm" onClick={() => onEdit(item)}>
                      <span className="sr-only">Modifier</span>
                      <SquarePen />
                    </Button>
                  )}
                  {onDelete && (!canDelete || canDelete(item)) && (
                    <Button variant="destructive" size="icon-sm" onClick={() => onDelete(item)}>
                      <span className="sr-only">Supprimer</span>
                      <Trash2 />
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
