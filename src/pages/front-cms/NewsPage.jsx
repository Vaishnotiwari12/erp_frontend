// ====================================================================
// Module: Front CMS
// Page: News
//
// Purpose:
// Manage news articles, authors, and publish dates.
//
// Data Source:
// frontCms.service.js (via useNews hook)
//
// Backend model: news { title, content, publish_date, image, author }
//   - createNews(payload, file) uses FormData with 'image' field
//   - updateNews(id, payload) uses JSON body
//
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Newspaper,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { useNews } from '@/hooks/useFrontCms'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'publish_date', label: 'Publish Date' },
  { key: 'createdAt', label: 'Created At' },
]

export default function NewsPage() {
  const {
    rows, stats, isLoading,
    search, setSearch,
    saveNews, deleteNews,
  } = useNews()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, file, id) => {
    await saveNews(payload, file, id)
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
            <Newspaper className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.title}</span>
            <span className="text-xs text-muted-foreground">{row.original.author}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'author', header: 'Author', cell: ({ row }) => <span className="text-sm">{row.original.author || '—'}</span> },
    { accessorKey: 'publish_date', header: 'Publish Date', cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.publish_date)}</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front CMS' }, { label: 'News' }]} />
      <PageHeader
        title="News"
        description="Manage news articles, authors, and publish dates."
        icon={Newspaper}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add News</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total News" value={stats.total} icon={Newspaper} accent="primary" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search news…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="news" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
      ) : rows.length === 0 ? (
        <NoData title="No news found" description="Add a new news article to get started." actionLabel="Add News" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="news"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <NewsFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit News' : 'Add News'}
        initial={editRow}
        onSubmit={(payload, file) => handleSave(payload, file, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="News Details"
        description={viewRow?.title}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Newspaper className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.title}</p>
                <p className="text-xs text-muted-foreground">{viewRow.author}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Author', value: viewRow.author },
                { label: 'Publish Date', value: formatDate(viewRow.publish_date) },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

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
        entityName={deleteRow?.title}
        onConfirm={() => deleteNews(deleteRow._id)}
      />
    </div>
  )
}

// ─── News Form Drawer (shared by Add and Edit) ────────────────────────────────
function NewsFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    content: initial?.content || '',
    publish_date: initial?.publish_date ? initial.publish_date.slice(0, 10) : '',
    author: initial?.author || '',
  })
  const [file, setFile] = useState(null)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="News article information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add News'}
          submitDisabled={!form.title.trim()}
          onSubmit={() => onSubmit(form, file)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form, file) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="News title" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Content</Label>
            <Textarea value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Full article content" rows={4} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Publish Date</Label>
            <Input type="date" value={form.publish_date} onChange={(e) => set('publish_date', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Author</Label>
            <Input value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="Author name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            {initial?.image && !file && (
              <p className="text-xs text-muted-foreground">Current: {initial.image}</p>
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
