import { useState } from 'react'
import { router } from '@inertiajs/react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Plus, ArrowLeft } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { formatBudget } from '~/components/budget/constants'
import TransactionList from '~/components/investments/transaction_list'
import SupportSummary from '~/components/investments/support_summary'
import TransactionForm from '~/components/investments/transaction_form'
import type {
  InvestmentSupport,
  InvestmentTransaction,
  SupportSummary,
} from '~/components/investments/constants'

export default function InvestmentShow({
  support,
  transactions = [],
  summary,
  pagination,
}: InertiaProps<{
  support: InvestmentSupport
  transactions: InvestmentTransaction[]
  summary: SupportSummary
  pagination: { currentPage: number; lastPage: number; perPage: number; total: number }
}>) {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.visit('/investissements')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <h1>{support.name}</h1>
            <p className="text-sm text-muted-foreground">
              {support.symbol} • {support.type} • {support.storageLocation}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-4 mr-2" />
          Ajouter transaction
        </Button>
      </div>

      <SupportSummary summary={summary} supportName={support.name} supportSymbol={support.symbol} />

      <PageState
        empty={
          transactions.length === 0
            ? {
                title: 'Aucune transaction',
                message: "Ajoute ta première opération d'achat ou de vente",
                action: {
                  label: 'Ajouter transaction',
                  onClick: () => setAddOpen(true),
                },
              }
            : null
        }
      >
        <Card>
          <CardHeader>
            <CardTitle>Historique des transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList transactions={transactions} supportId={support.id} />
          </CardContent>
        </Card>
      </PageState>

      <TransactionForm supportId={support.id} open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
