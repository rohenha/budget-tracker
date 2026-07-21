import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { getIcon, formatBudget } from '~/components/budget/constants'

export type CategorySpending = {
  categorieId: number
  label: string
  icon: string
  color: string
  budget: number | null
  spent: number
}

type Props = {
  data: CategorySpending[]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload as CategorySpending
  const Icon = getIcon(item.icon)
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="flex items-center gap-2 font-medium">
        <Icon className="size-4" style={{ color: item.color }} />
        {item.label}
      </div>
      <div className="text-muted-foreground">Dépensé : {formatBudget(item.spent)}</div>
      <div className="text-muted-foreground">Budgété : {formatBudget(item.budget)}</div>
    </div>
  )
}

export default function CategoryPieChart({ data }: Props) {
  const hasSpending = data.some((d) => d.spent > 0)
  console.log(data)
  const totalSpent = data.reduce((sum, d) => sum + d.spent, 0)
  const totalBudget = data.reduce((sum, d) => sum + (d.budget ?? 0), 0)

  if (!hasSpending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition des dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-sm text-muted-foreground">
            Aucune dépense ce mois-ci
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des dépenses</CardTitle>
        <p className="text-sm text-muted-foreground">
          Budgété : {formatBudget(totalBudget)} — Réel : {formatBudget(totalSpent)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="spent"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={2}
                accessibilityLayer
              >
                {data.map((entry) => (
                  <Cell key={entry.categorieId} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
