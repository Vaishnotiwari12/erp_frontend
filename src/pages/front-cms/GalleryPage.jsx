// ====================================================================
// Module: Front CMS
// Page: Gallery
//
// Purpose:
// Manage image gallery items, categories, and display order.
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
  Images,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { useGallery } from '@/hooks/useFrontCms'

const EXPORT_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'category', label: 'Category' },
  { key: 'display_order', label: 'Display Order' },
  { key: 'status', label: 'Status' },
]

const CATEGORIES = ['Campus', 'Sports', 'Cultural', 'Academic']

export default function GalleryPage() {
  const {
    rows, stats, isLoading,
    search, setSearch, categoryFilter, setCategoryFilter, statusFilter, setStatusFilter,
    saveGallery, deleteGallery,
  } = useGallery()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveGallery(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <img src={row.original.image_url} alt={row.original.title} className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-medium hover:underline">{row.original.title}</span>
        </button>
      ),
    },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge> },
    { accessorKey: 'display_order', header: 'Order', cell: ({ row }) => <span className="font-mono text-sm">{row.original.display_order}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front CMS' }, { label: 'Gallery' }]} />
      <PageHeader
        title="Gallery"
        description="Manage image gallery items, categories, and display order."
        icon={Images}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Image</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Images" value={stats.total} icon={Images} accent="primary" />
        <StatCard label="Published" value={stats.published} icon={Images} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search gallery…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="gallery" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
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
        <NoData title="No gallery items found" description="Add a new image to get started." actionLabel="Add Image" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="gallery"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <GalleryFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Gallery Item' : 'Add Gallery Item'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Gallery Item Details"
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
                <Images className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.title}</p>
                <p className="text-xs text-muted-foreground">{viewRow.category}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Display Order', value: viewRow.display_order },
                { label: 'Created On', value: viewRow.createdAt ? new Date(viewRow.createdAt).toLocaleDateString() : '—' },
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
        onConfirm={() => deleteGallery(deleteRow._id)}
      />
    </div>
  )
}

// ─── Gallery Form Drawer (shared by Add and Edit) ──────────────────────────────
function GalleryFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    image_url: initial?.image_url || '',
    category: initial?.category || 'Campus',
    display_order: initial?.display_order || 1,
    status: initial?.status || 'draft',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Gallery image information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Image'}
          submitDisabled={!form.title.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Image title" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Image URL</Label>
            <Input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://… (upload placeholder)" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
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
