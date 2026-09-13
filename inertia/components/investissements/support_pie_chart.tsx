import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { formatBudget } from '~/components/budget/constants'
import type { InvestmentSupport } from '~/components/investissements/constants'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

type Props = {
  supports: InvestmentSupport[]
  title?: string
}

export default function SupportPieChart({ supports, title = 'Répartition par support' }: Props) {
  const total = supports.reduce((sum, s) => sum + s.currentValue, 0)

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

  const data = supports
    .filter((s) => s.currentValue > 0)
    .map((s, i) => ({
      name: s.name,
      value: s.currentValue,
      fill: COLORS[i % COLORS.length],
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
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer={true}>
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
