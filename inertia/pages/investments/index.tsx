import { useState } from 'react'
import { router } from '@inertiajs/react'
import type { InertiaProps } from '~/types'
import PageState from '~/components/page_state'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Plus } from 'lucide-react'
import DataTable from '~/components/ui/data_table'
import { formatBudget } from '~/components/budget/constants'
import SupportPieChart from '~/components/investments/support_pie_chart'
import { Button } from '~/components/ui/button'
import type { InvestmentSupport, InvestmentsSummary } from '~/components/investments/constants'
import AddInvestmentsDialog from '~/components/investments/add_investments_dialog'
import EditInvestmentDialog from '~/components/investments/edit_investment_dialog'
import DeleteInvestmentDialog from '~/components/investments/delete_investment_dialog'

export default function Investissements({
  supports = [],
  summary = { totalValue: 0 },
}: InertiaProps<{ supports: InvestmentSupport[]; summary: InvestmentsSummary }>) {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedSupport, setSelectedSupport] = useState<InvestmentSupport | null>(null)

  const columns = [
    {
      label: 'Nom',
      className: 'font-medium min-h-[44px]',
      render: (s: InvestmentSupport) => (
        <span>
          {s.name}
          <span className="block text-xs text-muted-foreground">{s.symbol}</span>
        </span>
      ),
    },
    {
      label: 'Type',
      render: (s: InvestmentSupport) => (
        <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
          {s.type}
        </span>
      ),
    },
    {
      label: 'Lieu',
      className: 'text-muted-foreground',
      render: (s: InvestmentSupport) => s.storageLocation,
    },
    {
      label: 'Évolution',
      className: 'text-right tabular-nums',
      render: (s: InvestmentSupport) => `${s.evolutionPct}%`,
    },
    {
      label: 'Valeur',
      className: 'text-right tabular-nums',
      render: (s: InvestmentSupport) =>
        s.lastKnownPrice === null ? '—' : formatBudget(s.currentValue),
    },
    {
      label: '+/- Value',
      className: 'text-right tabular-nums',
      render: (s: InvestmentSupport) => formatBudget(s.plValue),
    },
    {
      label: 'Prix',
      render: (s: InvestmentSupport) =>
        s.stale ? (
          <span
            role="status"
            className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800"
          >
            Prix non mis à jour
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {s.lastKnownPrice === null ? '—' : formatBudget(s.lastKnownPrice)}
          </span>
        ),
    },
  ]

  const handleEdit = (support: InvestmentSupport) => {
    setSelectedSupport(support)
    setEditOpen(true)
  }

  const handleDelete = (support: InvestmentSupport) => {
    setSelectedSupport(support)
    setDeleteOpen(true)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1>Investissements</h1>
          <p className="text-sm text-muted-foreground">Suivi des supports d&apos;investissement</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="size-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valeur totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums text-primary">
              {formatBudget(summary.totalValue)}
            </p>
          </CardContent>
        </Card>
        <SupportPieChart supports={supports} />
      </div>

      <PageState
        empty={
          supports.length === 0
            ? {
                title: 'Aucun investissement',
                message: 'Ajoute ton premier support',
                action: {
                  label: 'Ajouter support',
                  onClick: () => setAddOpen(true),
                },
              }
            : null
        }
      >
        <DataTable
          data={supports}
          columns={columns}
          keyExtractor={(s) => s.id}
          onRowClick={(s) => router.visit(`/investissements/${s.id}`)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </PageState>
      {/* TODO 4.5: page détail /investissements/:id — navigation posée, écran complet en 4.5 */}
      {addOpen && <AddInvestmentsDialog open={addOpen} onOpenChange={setAddOpen} />}
      <EditInvestmentDialog
        support={selectedSupport}
        open={editOpen}
        onOpenChange={(v) => {
          setEditOpen(v)
          if (!v) setSelectedSupport(null)
        }}
      />
      <DeleteInvestmentDialog
        support={selectedSupport}
        open={deleteOpen}
        onOpenChange={(v) => {
          setDeleteOpen(v)
          if (!v) setSelectedSupport(null)
        }}
      />
    </div>
  )
}
