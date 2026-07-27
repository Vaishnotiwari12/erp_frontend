// ====================================================================
// Module: Front CMS
// Page: Banners
//
// Purpose:
// Manage homepage banner images, display order, and publish status.
//
// Data Source:
// frontCms.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Image,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { StatusBadge } from '@/components/StatusBadge'
import { useBanners } from '@/hooks/useFrontCms'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'subtitle', label: 'Subtitle' },
  { key: 'link_url', label: 'Link URL' },
  { key: 'display_order', label: 'Display Order' },
  { key: 'status', label: 'Status' },
  { key: 'published_at', label: 'Published At' },
]

export default function BannerPage() {
  const {
    rows, stats, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    saveBanner, deleteBanner,
  } = useBanners()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveBanner(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Image className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.title}</span>
            <span className="text-xs text-muted-foreground">{row.original.subtitle}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'display_order', header: 'Order', cell: ({ row }) => <span className="font-mono text-sm">{row.original.display_order}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'published_at', header: 'Published', cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.published_at)}</span> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front CMS' }, { label: 'Banners' }]} />
      <PageHeader
        title="Banners"
        description="Manage homepage banner images, display order, and publish status."
        icon={Image}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Banner</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Banners" value={stats.total} icon={Image} accent="primary" />
        <StatCard label="Published" value={stats.published} icon={Image} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search banners…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="banners" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
      ) : rows.length === 0 ? (
        <NoData title="No banners found" description="Add a new banner to get started." actionLabel="Add Banner" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="banners"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <BannerFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Banner' : 'Add Banner'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Banner Details"
        description={viewRow?.title}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Image className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.title}</p>
                <p className="text-xs text-muted-foreground">{viewRow.subtitle}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Link URL', value: viewRow.link_url },
                { label: 'Display Order', value: viewRow.display_order },
                { label: 'Published At', value: formatDate(viewRow.published_at) },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.title}
        onConfirm={() => deleteBanner(deleteRow._id)}
      />
    </div>
  )
}

// ─── Banner Form Drawer (shared by Add and Edit) ─────────────────────────────
function BannerFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    subtitle: initial?.subtitle || '',
    image_url: initial?.image_url || '',
    link_url: initial?.link_url || '',
    display_order: initial?.display_order || 1,
    status: initial?.status || 'draft',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Banner information and configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Banner'}
          submitDisabled={!form.title.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Banner title" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Subtitle</Label>
            <Input value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Banner subtitle" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Image URL</Label>
            <Input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://… (upload placeholder)" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Link URL</Label>
            <Input value={form.link_url} onChange={(e) => set('link_url', e.target.value)} placeholder="/about" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Display Order</Label>
              <Input type="number" min="1" value={form.display_order} onChange={(e) => set('display_order', parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
