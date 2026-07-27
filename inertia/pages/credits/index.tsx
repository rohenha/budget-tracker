import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import DataTable from '~/components/ui/data_table'
import { formatBudget } from '~/components/budget/constants'
import AddLoanDialog from '~/components/credits/add_loan_dialog'
import EditLoanDialog from '~/components/credits/edit_loan_dialog'
import DeleteLoanDialog from '~/components/credits/delete_loan_dialog'
import type { Loan, GlobalSummary } from '~/components/credits/constants'

export default function Credits({
  loans = [],
  globalSummary = {
    totalBorrowed: 0,
    totalInterest: 0,
    totalPaid: 0,
    currentPaid: 0,
    currentInterest: 0,
  },
}: InertiaProps<{
  loans: Loan[]
  globalSummary: GlobalSummary
}>) {
  const [addOpen, setAddOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [deleteLoan, setDeleteLoan] = useState<Loan | null>(null)

  const editLoan = editId !== null ? loans.find((l) => l.id === editId) : null

  const totalPaidSoFar = globalSummary.currentPaid + globalSummary.currentInterest
  const remainingTotal = globalSummary.totalPaid - totalPaidSoFar
  const progressPct =
    globalSummary.totalPaid > 0
      ? Math.round((totalPaidSoFar / globalSummary.totalPaid) * 10) / 10
      : 0

  const columns = [
    {
      label: 'Nom',
      className: 'font-medium',
      render: (l: Loan) => l.name,
    },
    {
      label: 'Montant',
      className: 'text-right tabular-nums',
      render: (l: Loan) => formatBudget(l.borrowedAmount),
    },
    {
      label: 'Déjà remboursé',
      className: 'text-right tabular-nums',
      render: (l: Loan) => formatBudget(l.settled.currentPaid),
    },
    {
      label: 'Intérêts',
      className: 'text-right tabular-nums',
      render: (l: Loan) => formatBudget(l.settled.currentInterest),
    },
    {
      label: 'Pourcentage',
      className: 'text-right tabular-nums',
      render: (l: Loan) =>
        `${Math.round(((l.settled.currentPaid + l.settled.currentInterest) / l.totalPaid) * 1000) / 10}%`,
    },
    {
      label: 'Taux',
      className: 'text-right tabular-nums',
      render: (l: Loan) => `${l.interestRate} %`,
    },
    {
      label: 'Durée',
      className: 'text-right tabular-nums',
      render: (l: Loan) => `${l.durationMonths} mois`,
    },
    {
      label: 'Mensualité',
      className: 'text-right tabular-nums',
      render: (l: Loan) => formatBudget(l.monthlyPayment),
    },
    {
      label: 'Statut',
      render: (l: Loan) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${l.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
        >
          {l.status === 'active' ? 'En cours' : 'Remboursé'}
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Crédits</h1>
          <p className="text-sm text-muted-foreground">Gestion des crédits immobiliers</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total emprunté</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {formatBudget(globalSummary.totalBorrowed)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Déjà remboursé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {formatBudget(totalPaidSoFar)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reste à rembourser</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {formatBudget(remainingTotal)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Total remboursé (prévisionnel)</p>
              <p className="font-medium tabular-nums">{formatBudget(globalSummary.totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total intérêts (prévisionnel)</p>
              <p className="font-medium tabular-nums">{formatBudget(globalSummary.totalInterest)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Principal déjà remboursé</p>
              <p className="font-medium tabular-nums">{formatBudget(globalSummary.currentPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Intérêts déjà payés</p>
              <p className="font-medium tabular-nums">{formatBudget(globalSummary.currentInterest)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Progression</p>
              <p className="font-medium tabular-nums">{progressPct}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PageState
        empty={
          loans.length === 0
            ? { title: 'Aucun crédit', message: 'Ajoute ton premier crédit immobilier' }
            : null
        }
      >
        <DataTable
          data={loans}
          columns={columns}
          keyExtractor={(l) => l.id}
          onRowClick={(loan) => router.visit(`/credits/${loan.id}`)}
          onEdit={(loan) => setEditId(loan.id)}
          onDelete={(loan) => setDeleteLoan(loan)}
        />
      </PageState>

      <AddLoanDialog open={addOpen} onOpenChange={setAddOpen} />
      {editLoan && (
        <EditLoanDialog loan={editLoan} open onOpenChange={(o) => !o && setEditId(null)} />
      )}
      {deleteLoan && (
        <DeleteLoanDialog loan={deleteLoan} open onOpenChange={(o) => !o && setDeleteLoan(null)} />
      )}
    </div>
  )
}
