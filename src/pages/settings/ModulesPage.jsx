// ====================================================================
// Module: Settings
// Page: Modules
//
// Purpose:
// Enable or disable system modules and set display order.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { Boxes } from 'lucide-react'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useModules } from '@/hooks/useSettings'

export default function ModulesPage() {
  const { modules, isLoading, toggleModule } = useModules()

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Modules' }]} />
      <PageHeader
        title="Modules"
        description="Enable or disable system modules and configure display order."
        icon={Boxes}
      />

      {isLoading ? (
        <LoadingSkeleton variant="cards" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules
            .slice()
            .sort((a, b) => a.display_order - b.display_order)
            .map((mod) => (
              <Card key={mod._id} className={mod.is_enabled ? '' : 'opacity-60'}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Boxes className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{mod.display_name}</CardTitle>
                        <CardDescription className="text-xs">Order: {mod.display_order}</CardDescription>
                      </div>
                    </div>
                    <Switch checked={mod.is_enabled} onCheckedChange={() => toggleModule(mod)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{mod.description || '—'}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
