import { formatBudget } from '~/components/budget/constants'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import type { SupportSummary } from '~/components/investments/constants'

interface SupportSummaryProps {
  summary: SupportSummary
  supportName: string
  supportSymbol: string
}

export default function SupportSummary({
  summary,
  supportName,
  supportSymbol,
}: SupportSummaryProps) {
  const { totalQuantity, pru, currentValue, plValue, currentPrice } = summary

  const plClassName = plValue >= 0 ? 'text-green-600' : 'text-red-600'
  const plPrefix = plValue >= 0 ? '+' : ''

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Quantité détenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">
            {totalQuantity.toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">PRU (€)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">{formatBudget(pru)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Prix actuel (€)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">{formatBudget(currentPrice)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Valorisation (€)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold tabular-nums">{formatBudget(currentValue)}</p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Plus/ moins-value latente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold tabular-nums ${plClassName}`}>
            {plPrefix}
            {formatBudget(plValue)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
