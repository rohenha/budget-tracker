import { DateTime } from 'luxon'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { formatBudget } from '~/components/budget/constants'

type DailyTotal = {
  date: string
  total: number
}

type Props = {
  data: DailyTotal[]
  average?: number
}

function CustomTooltip({
  active,
  payload,
}: {
  active: boolean
  payload: Array<{ payload: DailyTotal }>
  label: string
}) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload as DailyTotal
  const formattedDate = DateTime.fromISO(item.date).setLocale('fr').toFormat('dd MMMM')
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="font-medium">{formattedDate}</div>
      <div className="text-muted-foreground">{formatBudget(item.total)}</div>
    </div>
  )
}

export default function DailyExpensesChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dépenses par jour</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucune dépense pour cette période
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dépenses par jour</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="h-72 md:h-64"
          role="img"
          aria-label="Graphique des dépenses par jour de la période"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => DateTime.fromISO(d).toFormat('dd/MM')}
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tickFormatter={(v: number) => formatBudget(v)} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
              <Bar dataKey="total" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
