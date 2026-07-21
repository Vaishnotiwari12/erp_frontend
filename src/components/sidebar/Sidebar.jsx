import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/constants/navigation'
import { sidebarItems } from '@/config/sidebar'

const EXPANDED_KEY = 'scholaria.sidebar.expanded'

// Read persisted expanded section ids; falls back to first section expanded.
function readExpanded() {
  try {
    const raw = localStorage.getItem(EXPANDED_KEY)
    if (raw) return new Set(JSON.parse(raw))
  } catch {
    // ignore
  }
  return new Set(sidebarItems.length ? [sidebarItems[0].id] : [])
}

// Configuration-driven premium sidebar. Renders from src/config/sidebar.js.
// Features: nested dropdowns, animated accordion (grid-rows), chevron rotation,
// persisted expanded state, auto-expand active section, active pill indicator,
// rounded hover state, collapsed icon-only mode with tooltips, dark mode,
// keyboard accessible, responsive (mobile drawer handled by Navbar).
export function Sidebar({ collapsed, onNavigate }) {
  const location = useLocation()
  const [expanded, setExpanded] = useState(readExpanded)

  // Persist expanded state across reloads.
  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_KEY, JSON.stringify([...expanded]))
    } catch {
      // ignore
    }
  }, [expanded])

  // Auto-expand the section containing the active route.
  const activeSectionId = useMemo(() => {
    for (const item of sidebarItems) {
      if (item.path && location.pathname === item.path) return item.id
      if (item.children?.some((c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/'))) {
        return item.id
      }
    }
    return null
  }, [location.pathname])

  useEffect(() => {
    if (!activeSectionId) return
    setExpanded((prev) => (prev.has(activeSectionId) ? prev : new Set([...prev, activeSectionId])))
  }, [activeSectionId])

  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <aside
      className={cn(
        'group/sidebar flex h-full flex-col border-r border-border/60 bg-card transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]',
      )}
    >
      {/* Brand */}
      <div className={cn('flex h-16 items-center gap-3 border-b border-border/60', collapsed ? 'justify-center px-2' : 'px-5')}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] font-bold leading-tight tracking-tight">{APP_NAME}</p>
            <p className="truncate text-xs font-medium leading-tight text-muted-foreground">Admin Console</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
        <ul className={cn('space-y-1', collapsed && 'space-y-1.5')}>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isOpen = expanded.has(item.id)

            if (item.path && !item.children) {
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold leading-snug transition-all duration-200',
                        collapsed && 'justify-center px-0',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      )
                    }
                    title={collapsed ? item.title : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && !collapsed && (
                          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" aria-hidden="true" />
                        )}
                        <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            }

            const sectionActive = item.children?.some(
              (c) => location.pathname === c.path || location.pathname.startsWith(c.path + '/'),
            )

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={isOpen}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold leading-snug transition-all duration-200',
                    collapsed && 'justify-center px-0',
                    sectionActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.title}</span>
                      <ChevronDown
                        className={cn(
                          'ml-auto h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-300 ease-in-out',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </>
                  )}
                </button>
                {!collapsed && (
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-in-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <ul className="overflow-hidden space-y-0.5 pl-10 pr-1 pt-1">
                      {item.children.map((child) => (
                        <li key={child.path}>
                          <NavLink
                            to={child.path}
                            onClick={onNavigate}
                            className={({ isActive }) =>
                              cn(
                                'relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium leading-snug transition-all duration-200',
                                isActive
                                  ? 'bg-primary/10 text-primary'
                                  : 'text-muted-foreground/90 hover:bg-accent hover:text-foreground',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              )
                            }
                          >
                            {({ isActive }) => (
                              <>
                                {isActive && (
                                  <span className="absolute -left-[10px] top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-primary" aria-hidden="true" />
                                )}
                                <span
                                  className={cn(
                                    'h-1.5 w-1.5 shrink-0 rounded-full bg-current transition-opacity',
                                    isActive ? 'opacity-100' : 'opacity-30',
                                  )}
                                />
                                <span className="truncate">{child.title}</span>
                              </>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-border/60 p-3">
        <div className={cn('flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent', collapsed && 'justify-center px-0')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            AM
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight">Alex Morgan</p>
              <p className="truncate text-xs font-medium leading-tight text-muted-foreground">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
