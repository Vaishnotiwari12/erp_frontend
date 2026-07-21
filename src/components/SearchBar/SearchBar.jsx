import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  autoFocus,
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-9 pr-9"
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search"
          onClick={() => onChange?.('')}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  )
}

export default SearchBar
