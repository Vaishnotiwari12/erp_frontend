// ====================================================================
// Module: Front CMS
// Page: Banners
//
// Purpose:
// Manage homepage banner images, links, and display order.
//
// Data Source:
// frontCms.service.js (via useBanners hook)
//
// Backend model: banner { image_url, title, link, order }
//   - createBanner(payload, file) uses FormData with 'image' field
//   - updateBanner(id, payload) uses JSON body
//
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
  Upload,
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
import { useBanners } from '@/hooks/useFrontCms'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'link', label: 'Link' },
  { key: 'order', label: 'Order' },
  { key: 'image_url', label: 'Image URL' },
  { key: 'createdAt', label: 'Created At' },
]

export default function BannerPage() {
  const {
    rows, stats, isLoading,
    search, setSearch,
    saveBanner, deleteBanner,
  } = useBanners()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, file, id) => {
    await saveBanner(payload, file, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          {row.original.image_url ? (
            <img src={row.original.image_url} alt={row.original.title} className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Image className="h-4 w-4" />
            </div>
          )}
          <span className="font-medium hover:underline">{row.original.title}</span>
        </button>
      ),
    },
    { accessorKey: 'link', header: 'Link', cell: ({ row }) => <span className="font-mono text-sm">{row.original.link || '—'}</span> },
    { accessorKey: 'order', header: 'Order', cell: ({ row }) => <span className="font-mono text-sm">{row.original.order}</span> },
    { accessorKey: 'image_url', header: 'Image', cell: ({ row }) => (
      <span className="text-xs text-muted-foreground break-all">{row.original.image_url || '—'}</span>
    ) },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span> },
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
        description="Manage homepage banner images, links, and display order."
        icon={Image}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Banner</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Banners" value={stats.total} icon={Image} accent="primary" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search banners…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="banners" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
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
        onSubmit={(payload, file) => handleSave(payload, file, editRow?._id)}
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
            {viewRow.image_url && (
              <img src={viewRow.image_url} alt={viewRow.title} className="w-full rounded-xl object-cover" />
            )}
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Image className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.title}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Link', value: viewRow.link },
                { label: 'Order', value: viewRow.order },
                { label: 'Image URL', value: viewRow.image_url },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium break-all">{f.value || '—'}</dd>
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
    link: initial?.link || '',
    order: initial?.order ?? 1,
  })
  const [file, setFile] = useState(null)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form, file)
  }

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
          onSubmit={() => onSubmit(form, file)}
        />
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Banner title" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Link</Label>
            <Input value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="/about" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Order</Label>
            <Input type="number" min="0" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Banner Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {initial?.image_url && !file && (
              <p className="text-xs text-muted-foreground">Current: {initial.image_url}</p>
            )}
            {file && (
              <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
            )}
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
