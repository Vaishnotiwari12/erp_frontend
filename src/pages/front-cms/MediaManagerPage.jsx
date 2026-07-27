// ====================================================================
// Module: Front CMS
// Page: Media Manager
//
// Purpose:
// Manage uploaded media files — images, videos, and documents.
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
  FolderOpen,
  Plus,
  Eye,
  Trash2,
  Upload,
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
import { useMedia } from '@/hooks/useFrontCms'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'file_name', label: 'File Name' },
  { key: 'file_type', label: 'File Type' },
  { key: 'file_size', label: 'File Size' },
  { key: 'uploaded_by', label: 'Uploaded By' },
  { key: 'status', label: 'Status' },
]

const FILE_TYPES = ['image', 'video', 'document']

export default function MediaManagerPage() {
  const {
    rows, stats, isLoading,
    search, setSearch, typeFilter, setTypeFilter,
    saveMedia, deleteMedia,
  } = useMedia()

  const [addOpen, setAddOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload) => {
    await saveMedia(payload)
    setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'file_name',
      header: 'File Name',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderOpen className="h-4 w-4" />
          </div>
          <span className="font-medium hover:underline">{row.original.file_name}</span>
        </button>
      ),
    },
    { accessorKey: 'file_type', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.original.file_type}</Badge> },
    { accessorKey: 'file_size', header: 'Size', cell: ({ row }) => <span className="font-mono text-sm">{row.original.file_size}</span> },
    { accessorKey: 'uploaded_by', header: 'Uploaded By', cell: ({ row }) => <span className="text-sm">{row.original.uploaded_by}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={row.original.status === 'active' ? 'default' : 'outline'}>{row.original.status}</Badge> },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front CMS' }, { label: 'Media Manager' }]} />
      <PageHeader
        title="Media Manager"
        description="Manage uploaded media files — images, videos, and documents."
        icon={FolderOpen}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Media</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Media" value={stats.total} icon={FolderOpen} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={FolderOpen} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search media…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="media" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All types</option>
            {FILE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No media found" description="Upload a new file to get started." actionLabel="Add Media" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="media"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <MediaFormDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Media"
        onSubmit={handleSave}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Media Details"
        description={viewRow?.file_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.file_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.file_type} · {viewRow.file_size}</p>
              </div>
              <Badge variant={viewRow.status === 'active' ? 'default' : 'outline'}>{viewRow.status}</Badge>
            </div>

            {viewRow.file_type === 'image' && viewRow.file_url && (
              <img src={viewRow.file_url} alt={viewRow.file_name} className="w-full rounded-xl object-cover" />
            )}

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Uploaded By', value: viewRow.uploaded_by },
                { label: 'File Size', value: viewRow.file_size },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
                { label: 'File URL', value: viewRow.file_url },
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
        entityName={deleteRow?.file_name}
        onConfirm={() => deleteMedia(deleteRow._id)}
      />
    </div>
  )
}

// ─── Media Form Drawer (Add only) ──────────────────────────────────────────────
function MediaFormDrawer({ open, onOpenChange, title, onSubmit }) {
  const [form, setForm] = useState({
    file_name: '',
    file_type: 'image',
    file_url: '',
    uploaded_by: '',
    status: 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Upload a new media file"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Add Media"
          submitDisabled={!form.file_name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">File Name <span className="text-destructive">*</span></Label>
            <Input value={form.file_name} onChange={(e) => set('file_name', e.target.value)} placeholder="example.jpg" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">File Type</Label>
            <select value={form.file_type} onChange={(e) => set('file_type', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {FILE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">File URL</Label>
            <Input value={form.file_url} onChange={(e) => set('file_url', e.target.value)} placeholder="https://… (upload placeholder)" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Uploaded By</Label>
              <Input value={form.uploaded_by} onChange={(e) => set('uploaded_by', e.target.value)} placeholder="Uploader name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            <Upload className="mx-auto mb-2 h-6 w-6" />
            Drag and drop files here (upload placeholder)
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
