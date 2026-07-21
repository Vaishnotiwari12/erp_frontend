import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export function ActionDropdown({ actions = [], trigger, align = 'end', className }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn('w-44', className)}>
        {actions.map((action, i) =>
          action.separator ? (
            <DropdownMenuSeparator key={`sep-${i}`} />
          ) : (
            <DropdownMenuItem
              key={action.label}
              onClick={() => action.onClick?.()}
              disabled={action.disabled}
              className={cn(
                'cursor-pointer gap-2',
                action.variant === 'destructive' && 'text-destructive focus:text-destructive',
              )}
            >
              {action.icon ? <action.icon className="h-4 w-4" /> : null}
              {action.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionDropdown
