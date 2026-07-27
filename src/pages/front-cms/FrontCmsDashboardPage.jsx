// ====================================================================
// Module: Front CMS
// Page: Front CMS Dashboard
//
// Purpose:
// Overview of all front CMS content — banners, news, events, gallery,
// pages, media, and menus — with quick stats.
//
// Data Source:
// frontCms.service.js (via useFrontCmsStats hook)
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo } from 'react'
import {
  LayoutTemplate,
  Image,
  Newspaper,
  CalendarDays,
  Images,
  FileText,
  FolderOpen,
  Menu,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useFrontCmsStats } from '@/hooks/useFrontCms'

export default function FrontCmsDashboardPage() {
  const { stats, isLoading } = useFrontCmsStats()

  const recentItems = useMemo(() => [
    { label: 'Banners', count: stats.total_banners, icon: Image, color: 'primary' },
    { label: 'News', count: stats.total_news, icon: Newspaper, color: 'chart2' },
    { label: 'Events', count: stats.total_events, icon: CalendarDays, color: 'chart3' },
    { label: 'Gallery', count: stats.total_gallery, icon: Images, color: 'chart4' },
    { label: 'Pages', count: stats.total_pages, icon: FileText, color: 'primary' },
    { label: 'Media', count: stats.total_media, icon: FolderOpen, color: 'chart2' },
    { label: 'Menus', count: stats.total_menus, icon: Menu, color: 'chart3' },
  ], [stats])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front CMS' }, { label: 'Dashboard' }]} />
      <PageHeader
        title="Front CMS Dashboard"
        description="Overview of website content, banners, news, events, and media."
        icon={LayoutTemplate}
        actions={<Button><Plus className="mr-2 h-4 w-4" /> Add Content</Button>}
      />

      {isLoading ? (
        <LoadingSkeleton variant="card" rows={7} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Banners" value={stats.total_banners || 0} icon={Image} accent="primary" />
          <StatCard label="News" value={stats.total_news || 0} icon={Newspaper} accent="chart2" />
          <StatCard label="Events" value={stats.total_events || 0} icon={CalendarDays} accent="chart3" />
          <StatCard label="Gallery" value={stats.total_gallery || 0} icon={Images} accent="chart4" />
          <StatCard label="Pages" value={stats.total_pages || 0} icon={FileText} accent="primary" />
          <StatCard label="Media" value={stats.total_media || 0} icon={FolderOpen} accent="chart2" />
          <StatCard label="Menus" value={stats.total_menus || 0} icon={Menu} accent="chart3" />
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">Content Overview</h3>
        {isLoading ? (
          <LoadingSkeleton variant="table" rows={4} cols={3} />
        ) : recentItems.length === 0 ? (
          <NoData title="No content found" description="Add content to get started." />
        ) : (
          <div className="divide-y">
            {recentItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">Total items</p>
                  </div>
                </div>
                <Badge variant="secondary">{item.count} total</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
