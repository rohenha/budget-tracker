import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { getIcon, formatBudget } from '~/components/budget/constants'
import ProgressBadge from '~/components/depenses/progress_badge'

export type CategorySpending = {
  categorieId: number
  label: string
  icon: string
  color: string
  slug: string
  type: 'entree' | 'sortie'
  budget: number | null
  spent: number
}

type Props = {
  data: CategorySpending[]
  title: string
  description?: string
  label: string
  spending: boolean
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active: boolean
  payload: Array<{ payload: CategorySpending }>
  label: string
}) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload as CategorySpending
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <div className="flex items-center gap-2 font-medium">
        {React.createElement(getIcon(item.icon), {
          className: 'size-4',
          style: { color: item.color },
        })}
        {item.label}
      </div>
      <div className="text-muted-foreground">
        {label} : {formatBudget(item.spent)}
      </div>
      <div className="text-muted-foreground">Budgété : {formatBudget(item.budget)}</div>
    </div>
  )
}

export default function CategoryPieChart({
  data,
  title,
  description,
  label,
  spending = true,
}: Props) {
  const hasSpending = data.some((d) => d.spent > 0)
  const totalSpent = data.reduce((sum, d) => sum + d.spent, 0)
  const totalBudget = data.reduce((sum, d) => sum + (d.budget ?? 0), 0)

  if (!hasSpending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        {description && (
          <CardContent>
            <p className="py-8 text-center text-sm text-muted-foreground">{description}</p>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Budgété :{' '}
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground">
            {formatBudget(totalBudget)}
          </span>{' '}
          — Réel :{' '}
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground">
            {formatBudget(totalSpent)}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Balance :{' '}
          {spending ? (
            <ProgressBadge
              text={formatBudget(totalBudget - totalSpent)}
              type={
                totalBudget === totalSpent ? 'neutral' : totalBudget <= totalSpent ? 'up' : 'down'
              }
              reverse={false}
            />
          ) : (
            <ProgressBadge
              text={formatBudget(totalSpent - totalBudget)}
              type={
                totalBudget === totalSpent ? 'neutral' : totalBudget <= totalSpent ? 'up' : 'down'
              }
              reverse={false}
            />
          )}
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
              >
                {data.map((entry) => (
                  <Cell key={entry.categorieId} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={(props: any) => <CustomTooltip {...props} label={label} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
