// ====================================================================
// Module: Front CMS
// Page: CMS Pages
//
// Purpose:
// Manage static CMS pages — titles, slugs, content, and meta info.
//
// Data Source:
// frontCms.service.js (via useCmsPages hook)
//
// Backend model: page { page_title, slug, content, meta_title, meta_description }
//   - createPage(payload) / updatePage(id, payload) use JSON body
//
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  FileText,
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
import { useCmsPages } from '@/hooks/useFrontCms'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'page_title', label: 'Page Title' },
  { key: 'slug', label: 'Slug' },
  { key: 'meta_title', label: 'Meta Title' },
  { key: 'createdAt', label: 'Created At' },
]

export default function PagePage() {
  const {
    rows, stats, isLoading,
    search, setSearch,
    savePage, deletePage,
  } = useCmsPages()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await savePage(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'page_title',
      header: 'Page Title',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.page_title}</span>
            <span className="text-xs text-muted-foreground">/{row.original.slug}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'slug', header: 'Slug', cell: ({ row }) => <span className="font-mono text-sm">/{row.original.slug}</span> },
    { accessorKey: 'meta_title', header: 'Meta Title', cell: ({ row }) => <span className="text-sm">{row.original.meta_title || '—'}</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front CMS' }, { label: 'Pages' }]} />
      <PageHeader
        title="CMS Pages"
        description="Manage static website pages, content, and SEO meta information."
        icon={FileText}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Page</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pages" value={stats.total} icon={FileText} accent="primary" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search pages…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="cms-pages" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
      ) : rows.length === 0 ? (
        <NoData title="No pages found" description="Add a new page to get started." actionLabel="Add Page" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="cms-pages"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <PageFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Page' : 'Add Page'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Page Details"
        description={viewRow?.page_title}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.page_title}</p>
                <p className="text-xs text-muted-foreground">/{viewRow.slug}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Meta Title', value: viewRow.meta_title },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            {viewRow.meta_description && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Meta Description</p>
                <p className="text-sm">{viewRow.meta_description}</p>
              </div>
            )}

            {viewRow.content && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Content</p>
                <p className="text-sm whitespace-pre-wrap">{viewRow.content}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.page_title}
        onConfirm={() => deletePage(deleteRow._id)}
      />
    </div>
  )
}

// ─── Page Form Drawer (shared by Add and Edit) ──────────────────────────────────
function PageFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    page_title: initial?.page_title || '',
    slug: initial?.slug || '',
    content: initial?.content || '',
    meta_title: initial?.meta_title || '',
    meta_description: initial?.meta_description || '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Page information and SEO settings"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Page'}
          submitDisabled={!form.page_title.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Page Title <span className="text-destructive">*</span></Label>
            <Input value={form.page_title} onChange={(e) => set('page_title', e.target.value)} placeholder="About Us" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Slug</Label>
            <Input value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="about-us" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Content</Label>
            <Textarea value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Page content" rows={4} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Meta Title</Label>
            <Input value={form.meta_title} onChange={(e) => set('meta_title', e.target.value)} placeholder="SEO meta title" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Meta Description</Label>
            <Textarea value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)} placeholder="SEO meta description" rows={2} />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
