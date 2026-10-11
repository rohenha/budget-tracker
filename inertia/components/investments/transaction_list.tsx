import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
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
import { formatBudget } from '~/components/budget/constants'
import TransactionForm from './transaction_form'
import DeleteTransactionDialog from './delete_transaction_dialog'
import type { InvestmentTransaction } from '~/components/investments/constants'

interface TransactionListProps {
  transactions: InvestmentTransaction[]
  supportId: number
}

export default function TransactionList({ transactions, supportId }: TransactionListProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<InvestmentTransaction | null>(null)

  const handleEdit = (transaction: InvestmentTransaction) => {
    setSelectedTransaction(transaction)
    setEditOpen(true)
  }

  const handleDelete = (transaction: InvestmentTransaction) => {
    setSelectedTransaction(transaction)
    setDeleteOpen(true)
  }

  const columns = [
    {
      label: 'Date',
      render: (t: InvestmentTransaction) => format(new Date(t.date), 'dd/MM/yyyy', { locale: fr }),
    },
    {
      label: 'Type',
      render: (t: InvestmentTransaction) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            t.type === 'achat' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {t.type === 'achat' ? 'Achat' : 'Vente'}
        </span>
      ),
    },
    {
      label: 'Quantité',
      className: 'text-right tabular-nums',
      render: (t: InvestmentTransaction) =>
        t.quantity.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 8 }),
    },
    {
      label: 'Prix (€)',
      className: 'text-right tabular-nums',
      render: (t: InvestmentTransaction) => formatBudget(t.price),
    },
    {
      label: 'Frais (€)',
      className: 'text-right tabular-nums',
      render: (t: InvestmentTransaction) => formatBudget(t.fees ?? 0),
    },
    {
      label: 'Total (€)',
      className: 'text-right tabular-nums font-medium',
      render: (t: InvestmentTransaction) => formatBudget(t.total),
    },
  ]

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.label} className={col.className}>
                {col.label}
              </TableHead>
            ))}
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              {columns.map((col) => (
                <TableCell key={col.label} className={col.className}>
                  {col.render(transaction)}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex items-center gap-1 justify-end">
                  <Button
                    variant="secondary"
                    size="icon-sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    <span className="sr-only">Modifier</span>
                    <SquarePen />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDelete(transaction)}
                  >
                    <span className="sr-only">Supprimer</span>
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TransactionForm
        supportId={supportId}
        transaction={selectedTransaction}
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v)
          if (!v) setSelectedTransaction(null)
        }}
      />
      {selectedTransaction && (
        <DeleteTransactionDialog
          transaction={selectedTransaction}
          supportId={supportId}
          open={deleteOpen}
          onOpenChange={(v) => {
            setDeleteOpen(v)
            if (!v) setSelectedTransaction(null)
          }}
        />
      )}
    </>
  )
}
