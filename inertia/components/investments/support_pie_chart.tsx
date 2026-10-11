import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { formatBudget } from '~/components/budget/constants'
import type { InvestmentSupport } from '~/components/investments/constants'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
  'var(--chart-9)',
  'var(--chart-10)',
]

const FALLBACK_COLORS = [
  '#3b82f6', // blue-500
  '#22c55e', // green-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f43f5e', // rose-500
  '#6366f1', // indigo-500
]

function getColor(index: number): string {
  const cssVar = COLORS[index % COLORS.length]
  const fallback = FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  return `var(${cssVar.replace('var(--', '').replace(')', '')}, ${fallback})`
}

type Props = {
  supports: InvestmentSupport[]
  title?: string
}

export default function SupportPieChart({ supports, title = 'Répartition par support' }: Props) {
  const validSupports = supports.filter(
    (s) =>
      typeof s.currentValue === 'number' && Number.isFinite(s.currentValue) && s.currentValue > 0
  )
  const total = validSupports.reduce((sum, s) => sum + s.currentValue, 0)

  if (total <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucune valeur à répartir pour le moment
          </p>
        </CardContent>
      </Card>
    )
  }

  const data = validSupports.map((s, i) => ({
    name: s.name,
    value: s.currentValue,
    fill: getColor(i),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total :{' '}
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground">
            {formatBudget(total)}
          </span>
        </p>
      </CardHeader>
      <CardContent>
        <div
          className="h-72"
          role="img"
          aria-label={`Répartition du portefeuille: ${data.map((d) => `${d.name} ${formatBudget(d.value)}`).join(', ')}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              accessibilityLayer={true}
              aria-label={`Répartition du portefeuille, total ${formatBudget(total)}`}
            >
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatBudget(Number(value) || 0)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
