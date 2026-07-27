import { useState } from 'react'
import { router } from '@inertiajs/react'
import { ArrowLeft, SquarePen, Trash2 } from 'lucide-react'
import type { InertiaProps } from '~/types'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import DataTable from '~/components/ui/data_table'
import { formatBudget } from '~/components/budget/constants'
import EditLoanDialog from '~/components/credits/edit_loan_dialog'
import DeleteLoanDialog from '~/components/credits/delete_loan_dialog'
import type { Loan, InstallmentRow } from '~/components/credits/constants'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR')
}

export default function CreditsShow({
  loan,
}: InertiaProps<{
  loan: Loan
}>) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const scheduleColumns: {
    label: string
    className?: string
    render: (r: InstallmentRow) => React.ReactNode
  }[] = [
    { label: 'N°', className: 'text-muted-foreground', render: (r) => `#${r.installmentNumber}` },
    { label: 'Date', className: 'text-muted-foreground', render: (r) => formatDate(r.dueDate) },
    {
      label: 'Principal',
      className: 'text-right tabular-nums',
      render: (r) => formatBudget(r.principalAmount),
    },
    {
      label: 'Intérêts',
      className: 'text-right tabular-nums',
      render: (r) => formatBudget(r.interest),
    },
    {
      label: 'Total',
      className: 'text-right tabular-nums',
      render: (r) => formatBudget(r.totalPayment),
    },
    {
      label: 'Restant dû',
      className: 'text-right tabular-nums',
      render: (r) => formatBudget(r.remainingBalance),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={() => router.visit('/credits')}>
            <ArrowLeft />
            <span className="sr-only">Retour</span>
          </Button>
          <div>
            <h1>{loan.name}</h1>
            <p className="text-sm text-muted-foreground">Détail du crédit immobilier</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <SquarePen />
            Modifier
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Restant dû</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {formatBudget(loan.remainingBalance - loan.settled.currentPaid)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mensualité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {formatBudget(loan.monthlyPayment)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Déjà remboursé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {formatBudget(loan.settled.currentPaid + loan.settled.currentInterest)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pourcentage de remboursement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {Math.round(
                ((loan.settled.currentPaid + loan.settled.currentInterest) / loan.totalPaid) * 1000
              ) / 10}
              %
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres du crédit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Montant emprunté</p>
              <p className="font-medium tabular-nums">{formatBudget(loan.borrowedAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Apport initial</p>
              <p className="font-medium tabular-nums">{formatBudget(loan.downPayment)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Taux annuel</p>
              <p className="font-medium tabular-nums">{loan.interestRate} %</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Durée</p>
              <p className="font-medium tabular-nums">{loan.durationMonths} mois</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date de début</p>
              <p className="font-medium tabular-nums">{formatDate(loan.startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total intérêts (prévisionnel)</p>
              <p className="font-medium tabular-nums">{formatBudget(loan.totalInterest)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total remboursé (prévisionnel)</p>
              <p className="font-medium tabular-nums">{formatBudget(loan.totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Principal déjà remboursé</p>
              <p className="font-medium tabular-nums">{formatBudget(loan.settled.currentPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Intérêts déjà payés</p>
              <p className="font-medium tabular-nums">
                {formatBudget(loan.settled.currentInterest)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Échéancier</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={loan.schedule ?? []}
            columns={scheduleColumns}
            keyExtractor={(r) => r.installmentNumber}
          />
        </CardContent>
      </Card>

      <EditLoanDialog open={editOpen} onOpenChange={setEditOpen} loan={loan} />
      <DeleteLoanDialog open={deleteOpen} onOpenChange={setDeleteOpen} loan={loan} />
    </div>
  )
}
