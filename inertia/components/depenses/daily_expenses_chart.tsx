import { DateTime } from 'luxon'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { formatBudget } from '~/components/budget/constants'

type DailyTotal = {
  date: string
  total: number
}

type Props = {
  data: DailyTotal[]
  average: number
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
  const formattedDate = DateTime.fromISO(item.date).setLocale('fr').toFormat('dddd dd MMMM')
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="font-medium">{formattedDate}</div>
      <div className="text-muted-foreground">{formatBudget(item.total)}</div>
    </div>
  )
}

function AvgLabel({ x, y, value }: { x?: number; y?: number; value?: string | number }) {
  return (
    <g>
      <rect
        x={Number(x) - 4}
        y={Number(y) - 10}
        width={130}
        height={22}
        fill="white"
        rx={4}
      />
      <text x={Number(x)} y={Number(y)} fill="hsl(var(--destructive))" fontSize={12} dy={3}>
        {value}
      </text>
    </g>
  )
}

export default function DailyExpensesChart({ data, average }: Props) {
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
              <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              {average > 0 && (
                <ReferenceLine
                  y={average}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="3 3"
                  label={
                    <AvgLabel value={`Moyenne : ${formatBudget(average)}`} />
                  }
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
