// ====================================================================
// Module: Settings
// Page: Language Settings
//
// Purpose:
// Manage supported languages for the system.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Languages, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
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
import { useLanguages } from '@/hooks/useSettings'

const EXPORT_COLS = [
  { key: 'language_name', label: 'Language' },
  { key: 'language_code', label: 'Code' },
  { key: 'is_default', label: 'Default' },
  { key: 'status', label: 'Status' },
]

export default function LanguageSettingsPage() {
  const { rows, isLoading, search, setSearch, saveLanguage, deleteLanguage } = useLanguages()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveLanguage(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    { accessorKey: 'language_name', header: 'Language' },
    { accessorKey: 'language_code', header: 'Code' },
    { accessorKey: 'is_default', header: 'Default', cell: ({ row }) => row.original.is_default ? <Badge>Default</Badge> : <span className="text-muted-foreground">—</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Languages' }]} />
      <PageHeader
        title="Language Settings"
        description="Manage supported languages for the system interface."
        icon={Languages}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Language</Button>}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search languages…" className="max-w-sm" />
        <ExportButtons rows={rows} columns={EXPORT_COLS} filename="languages" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
      ) : rows.length === 0 ? (
        <NoData title="No languages found" description="Add a new language to get started." actionLabel="Add Language" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="languages"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <LanguageFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Language' : 'Add Language'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Language Details"
        description={viewRow?.language_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Language', value: viewRow.language_name },
              { label: 'Code', value: viewRow.language_code },
              { label: 'Default', value: viewRow.is_default ? 'Yes' : 'No' },
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
        entityName={deleteRow?.language_name}
        onConfirm={() => deleteLanguage(deleteRow._id)}
      />
    </div>
  )
}

function LanguageFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    language_name: initial?.language_name || '',
    language_code: initial?.language_code || '',
    is_default: initial?.is_default || false,
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Language configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Language'}
          submitDisabled={!form.language_name.trim() || !form.language_code.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Language Name <span className="text-destructive">*</span></Label>
            <Input value={form.language_name} onChange={(e) => set('language_name', e.target.value)} placeholder="English" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Language Code <span className="text-destructive">*</span></Label>
            <Input value={form.language_code} onChange={(e) => set('language_code', e.target.value.toLowerCase())} placeholder="en" required />
          </div>
        </FormSection>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Default Language</p>
            <p className="text-xs text-muted-foreground">Use as the system default</p>
          </div>
          <input type="checkbox" checked={form.is_default} onChange={(e) => set('is_default', e.target.checked)} className="h-4 w-4" />
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
