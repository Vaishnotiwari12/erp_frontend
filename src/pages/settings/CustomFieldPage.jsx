// ====================================================================
// Module: Settings
// Page: Custom Fields
//
// Purpose:
// Manage custom fields for students, staff, library, and transport.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Boxes, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { useCustomFields } from '@/hooks/useSettings'
import { formatDate } from '@/utils/format'

const FIELD_TYPES = ['text', 'textarea', 'number', 'date', 'select']
const MODULES = ['Student', 'Staff', 'Library', 'Transport']

const EXPORT_COLS = [
  { key: 'field_name', label: 'Field Name' },
  { key: 'field_label', label: 'Label' },
  { key: 'field_type', label: 'Type' },
  { key: 'module', label: 'Module' },
  { key: 'is_required', label: 'Required' },
  { key: 'status', label: 'Status' },
]

export default function CustomFieldPage() {
  const {
    rows, isLoading,
    search, setSearch, moduleFilter, setModuleFilter,
    saveCustomField, deleteCustomField,
  } = useCustomFields()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveCustomField(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    { accessorKey: 'field_name', header: 'Field Name' },
    { accessorKey: 'field_label', header: 'Label' },
    { accessorKey: 'field_type', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.original.field_type}</Badge> },
    { accessorKey: 'module', header: 'Module', cell: ({ row }) => <Badge variant="outline">{row.original.module}</Badge> },
    { accessorKey: 'is_required', header: 'Required', cell: ({ row }) => row.original.is_required ? <Badge>Required</Badge> : <span className="text-muted-foreground">Optional</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Custom Fields' }]} />
      <PageHeader
        title="Custom Fields"
        description="Manage custom fields for students, staff, library, and transport."
        icon={Boxes}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Field</Button>}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search fields…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="custom-fields" />
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All modules</option>
            {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No custom fields found" description="Add a new custom field to get started." actionLabel="Add Field" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="custom-fields"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <CustomFieldFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Custom Field' : 'Add Custom Field'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Custom Field Details"
        description={viewRow?.field_label}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Field Name', value: viewRow.field_name },
                { label: 'Label', value: viewRow.field_label },
                { label: 'Type', value: <Badge variant="secondary">{viewRow.field_type}</Badge> },
                { label: 'Module', value: <Badge variant="outline">{viewRow.module}</Badge> },
                { label: 'Required', value: viewRow.is_required ? 'Yes' : 'No' },
                { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
                { label: 'Created', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
            {viewRow.options?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Options</p>
                <div className="flex flex-wrap gap-2">
                  {viewRow.options.map((o) => <span key={o} className="rounded-full border bg-muted/30 px-2.5 py-0.5 text-xs">{o}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.field_label}
        onConfirm={() => deleteCustomField(deleteRow._id)}
      />
    </div>
  )
}

function CustomFieldFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    field_name: initial?.field_name || '',
    field_label: initial?.field_label || '',
    field_type: initial?.field_type || 'text',
    module: initial?.module || 'Student',
    is_required: initial?.is_required || false,
    options: initial?.options || [],
    status: initial?.status || 'active',
  })
  const [optionInput, setOptionInput] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const addOption = () => {
    const v = optionInput.trim()
    if (v && !form.options.includes(v)) {
      set('options', [...form.options, v])
      setOptionInput('')
    }
  }
  const removeOption = (opt) => set('options', form.options.filter((o) => o !== opt))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Custom field configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Field'}
          submitDisabled={!form.field_name.trim() || !form.field_label.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Field Name <span className="text-destructive">*</span></Label>
            <Input value={form.field_name} onChange={(e) => set('field_name', e.target.value.toLowerCase().replace(/\s+/g, '_'))} placeholder="blood_group" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Field Label <span className="text-destructive">*</span></Label>
            <Input value={form.field_label} onChange={(e) => set('field_label', e.target.value)} placeholder="Blood Group" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Field Type</Label>
            <select value={form.field_type} onChange={(e) => set('field_type', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Module</Label>
            <select value={form.module} onChange={(e) => set('module', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </FormSection>

        {form.field_type === 'select' && (
          <div className="space-y-2">
            <Label className="text-xs">Options</Label>
            <div className="flex gap-2">
              <Input value={optionInput} onChange={(e) => setOptionInput(e.target.value)} placeholder="Add an option" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption() } }} />
              <Button type="button" variant="outline" onClick={addOption}>Add</Button>
            </div>
            {form.options.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.options.map((o) => (
                  <button key={o} type="button" onClick={() => removeOption(o)} className="rounded-full border bg-muted/30 px-2.5 py-0.5 text-xs hover:bg-destructive/10 hover:text-destructive">
                    {o} ×
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Required Field</p>
            <p className="text-xs text-muted-foreground">Must be filled when creating a record</p>
          </div>
          <input type="checkbox" checked={form.is_required} onChange={(e) => set('is_required', e.target.checked)} className="h-4 w-4" />
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
