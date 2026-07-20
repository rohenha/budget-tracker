import { type ReactNode } from 'react'
import { Skeleton } from '~/components/ui/skeleton'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type LoadingProps = {
  count?: number
  className?: string
}

function PageLoading({ count = 3, className }: LoadingProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)} aria-busy="true" role="status">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-7 w-full" />
      ))}
    </div>
  )
}

type EmptyProps = {
  title: string
  message?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

function PageEmpty({ title, message, action, className }: EmptyProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2 py-12 text-center', className)}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
      {action && (
        <Button variant="default" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

type ErrorProps = {
  message: string
  action?: { label: string; onClick: () => void }
  className?: string
}

function PageError({ message, action, className }: ErrorProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2 py-12 text-center', className)}
      role="alert"
    >
      <p className="text-sm font-medium text-destructive">{message}</p>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

type PageStateProps = {
  loading?: boolean | LoadingProps
  empty?: EmptyProps | null
  error?: ErrorProps | null
  children: ReactNode
  className?: string
}

export default function PageState({ loading, empty, error, children, className }: PageStateProps) {
  if (error) {
    return <PageError {...error} className={className} />
  }

  if (empty) {
    return <PageEmpty {...empty} className={className} />
  }

  if (loading) {
    const loadingProps: LoadingProps = typeof loading === 'boolean' ? {} : loading
    return <PageLoading {...loadingProps} className={className} />
  }

  return <div className={className}>{children}</div>
}

export { PageLoading, PageEmpty, PageError }
