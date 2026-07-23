import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
type Props = {
  type: 'up' | 'down' | 'neutral'
  reverse?: boolean
  text: string
}

export default function ProgressBadge({ type, text, reverse = false }: Props) {
  if (type === 'up') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        {reverse ? <TrendingDown size="10" /> : <TrendingUp size="10" />}
        {text}
      </span>
    )
  }

  if (type === 'neutral') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
        <Minus size="10" />
        {text}
      </span>
    )
  }

  return (
    <span
      className="inline-flex
       items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
    >
      {reverse ? <TrendingUp size="10" /> : <TrendingDown size="10" />}
      {text}
    </span>
  )
}
