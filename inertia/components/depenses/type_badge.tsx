import { MoveUp, MoveDown } from 'lucide-react'
type Props = {
  type: 'entree' | 'sortie'
}

export default function TypeBadge({ type }: Props) {
  if (type === 'entree') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <MoveUp size="10" />+
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
      <MoveDown size="10" />-
    </span>
  )
}
