import { Inbox, SearchX } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export function NoData({
  title = 'No data available',
  description = 'There are no records to display yet.',
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className,
}) {
  return (
    <EmptyState
      icon={Icon}
      title={title}
      description={description}
      action={
        actionLabel && onAction ? (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null
      }
      className={className}
    />
  )
}

export function NoResults({
  title = 'No results found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  onClear,
  clearLabel = 'Clear filters',
  className,
}) {
  return (
    <EmptyState
      icon={SearchX}
      title={title}
      description={description}
      action={
        onClear ? (
          <Button variant="outline" onClick={onClear}>
            {clearLabel}
          </Button>
        ) : null
      }
      className={className}
    />
  )
}

export default NoData
