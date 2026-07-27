// ====================================================================
// Module: Settings
// Page: File Type Settings
//
// Purpose:
// Manage allowed file types, mime types, and size limits.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { FileType, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { useFileTypes } from '@/hooks/useSettings'

const CATEGORIES = ['image', 'document', 'video']

const EXPORT_COLS = [
  { key: 'extension', label: 'Extension' },
  { key: 'mime_type', label: 'MIME Type' },
  { key: 'max_size', label: 'Max Size (MB)' },
  { key: 'category', label: 'Category' },
  { key: 'is_allowed', label: 'Allowed' },
  { key: 'status', label: 'Status' },
]

export default function FileTypePage() {
  const { rows, isLoading, search, setSearch, saveFileType, deleteFileType } = useFileTypes()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveFileType(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    { accessorKey: 'extension', header: 'Extension' },
    { accessorKey: 'mime_type', header: 'MIME Type', cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.mime_type}</span> },
    { accessorKey: 'max_size', header: 'Max Size (MB)' },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge> },
    { accessorKey: 'is_allowed', header: 'Allowed', cell: ({ row }) => row.original.is_allowed ? <Badge>Allowed</Badge> : <span className="text-muted-foreground">Blocked</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'File Types' }]} />
      <PageHeader
        title="File Type Settings"
        description="Manage allowed file extensions, MIME types, and size limits."
        icon={FileType}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add File Type</Button>}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search file types…" className="max-w-sm" />
        <ExportButtons rows={rows} columns={EXPORT_COLS} filename="file-types" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No file types found" description="Add a new file type to get started." actionLabel="Add File Type" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="file-types"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <FileTypeFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit File Type' : 'Add File Type'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="File Type Details"
        description={viewRow?.extension}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Extension', value: viewRow.extension },
              { label: 'MIME Type', value: viewRow.mime_type },
              { label: 'Max Size', value: `${viewRow.max_size} MB` },
              { label: 'Category', value: <Badge variant="outline">{viewRow.category}</Badge> },
              { label: 'Allowed', value: viewRow.is_allowed ? 'Yes' : 'No' },
              { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value || '—'}</dd>
              </div>
            ))}
          </dl>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.extension}
        onConfirm={() => deleteFileType(deleteRow._id)}
      />
    </div>
  )
}

function FileTypeFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    extension: initial?.extension || '',
    mime_type: initial?.mime_type || '',
    max_size: initial?.max_size ?? 5,
    is_allowed: initial?.is_allowed ?? true,
    category: initial?.category || 'image',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="File type configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add File Type'}
          submitDisabled={!form.extension.trim() || !form.mime_type.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Extension <span className="text-destructive">*</span></Label>
            <Input value={form.extension} onChange={(e) => set('extension', e.target.value)} placeholder=".jpg" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </FormSection>
        <div className="space-y-1.5">
          <Label className="text-xs">MIME Type <span className="text-destructive">*</span></Label>
          <Input value={form.mime_type} onChange={(e) => set('mime_type', e.target.value)} placeholder="image/jpeg" required />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Max Size (MB)</Label>
          <Input type="number" min="1" value={form.max_size} onChange={(e) => set('max_size', parseInt(e.target.value) || 1)} />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Allowed</p>
            <p className="text-xs text-muted-foreground">Permit uploads of this file type</p>
          </div>
          <input type="checkbox" checked={form.is_allowed} onChange={(e) => set('is_allowed', e.target.checked)} className="h-4 w-4" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
