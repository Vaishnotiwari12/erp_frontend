// ====================================================================
// Module: Settings
// Page: System Fields
//
// Purpose:
// Configure visibility and required status of built-in system fields.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { FileCog, Pencil, Eye } from 'lucide-react'
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
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { useSystemFields } from '@/hooks/useSettings'

const EXPORT_COLS = [
  { key: 'field_name', label: 'Field Name' },
  { key: 'field_label', label: 'Label' },
  { key: 'module', label: 'Module' },
  { key: 'is_required', label: 'Required' },
  { key: 'is_visible', label: 'Visible' },
  { key: 'display_order', label: 'Order' },
  { key: 'status', label: 'Status' },
]

export default function SystemFieldPage() {
  const { rows, isLoading, search, setSearch, updateSystemField } = useSystemFields()

  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)

  const columns = useMemo(() => [
    { accessorKey: 'field_name', header: 'Field Name' },
    { accessorKey: 'field_label', header: 'Label' },
    { accessorKey: 'module', header: 'Module', cell: ({ row }) => <Badge variant="outline">{row.original.module}</Badge> },
    { accessorKey: 'is_required', header: 'Required', cell: ({ row }) => row.original.is_required ? <Badge>Required</Badge> : <span className="text-muted-foreground">Optional</span> },
    { accessorKey: 'is_visible', header: 'Visible', cell: ({ row }) => row.original.is_visible ? <Badge variant="secondary">Visible</Badge> : <span className="text-muted-foreground">Hidden</span> },
    { accessorKey: 'display_order', header: 'Order' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'System Fields' }]} />
      <PageHeader
        title="System Fields"
        description="Configure built-in system fields visibility and required status."
        icon={FileCog}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search system fields…" className="max-w-sm" />
        <ExportButtons rows={rows} columns={EXPORT_COLS} filename="system-fields" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={7} />
      ) : rows.length === 0 ? (
        <NoData title="No system fields found" description="System fields will appear here." />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableExport
          exportFilename="system-fields"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <SystemFieldFormDrawer
        open={!!editRow}
        onOpenChange={(o) => !o && setEditRow(null)}
        title="Edit System Field"
        initial={editRow}
        onSubmit={(payload) => { updateSystemField(editRow._id, payload); setEditRow(null) }}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="System Field Details"
        description={viewRow?.field_label}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Field Name', value: viewRow.field_name },
              { label: 'Label', value: viewRow.field_label },
              { label: 'Module', value: <Badge variant="outline">{viewRow.module}</Badge> },
              { label: 'Required', value: viewRow.is_required ? 'Yes' : 'No' },
              { label: 'Visible', value: viewRow.is_visible ? 'Yes' : 'No' },
              { label: 'Display Order', value: viewRow.display_order },
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
    </div>
  )
}

function SystemFieldFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    field_name: initial?.field_name || '',
    field_label: initial?.field_label || '',
    module: initial?.module || 'Student',
    is_required: initial?.is_required || false,
    is_visible: initial?.is_visible ?? true,
    display_order: initial?.display_order ?? 1,
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="System field configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Save Changes"
          submitDisabled={!form.field_name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Field Name</Label>
            <Input value={form.field_name} disabled className="bg-muted/30" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Field Label</Label>
            <Input value={form.field_label} onChange={(e) => set('field_label', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Display Order</Label>
            <Input type="number" min="1" value={form.display_order} onChange={(e) => set('display_order', parseInt(e.target.value) || 1)} />
          </div>
        </FormSection>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Required</p>
            <p className="text-xs text-muted-foreground">Field must be filled</p>
          </div>
          <input type="checkbox" checked={form.is_required} onChange={(e) => set('is_required', e.target.checked)} className="h-4 w-4" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Visible</p>
            <p className="text-xs text-muted-foreground">Show field on forms</p>
          </div>
          <input type="checkbox" checked={form.is_visible} onChange={(e) => set('is_visible', e.target.checked)} className="h-4 w-4" />
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
