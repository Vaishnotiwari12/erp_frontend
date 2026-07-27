// ====================================================================
// Module: Settings
// Page: Role Permissions
//
// Purpose:
// Manage roles and their module-level permissions.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ShieldCheck, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
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
import { useRolePermissions } from '@/hooks/useSettings'
import { formatDate } from '@/utils/format'

const MODULE_KEYS = ['Students', 'Academics', 'Attendance', 'Fees', 'HR', 'Library', 'Transport', 'Hostel', 'Inventory', 'Settings']

const EXPORT_COLS = [
  { key: 'role_name', label: 'Role' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
]

export default function RolePermissionPage() {
  const { rows, isLoading, search, setSearch, saveRolePermission, deleteRolePermission } = useRolePermissions()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveRolePermission(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    { accessorKey: 'role_name', header: 'Role' },
    { accessorKey: 'description', header: 'Description', cell: ({ row }) => <span className="text-muted-foreground">{row.original.description || '—'}</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Role Permissions' }]} />
      <PageHeader
        title="Role Permissions"
        description="Define roles and the modules each role can access."
        icon={ShieldCheck}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Role</Button>}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search roles…" className="max-w-sm" />
        <ExportButtons rows={rows} columns={EXPORT_COLS} filename="role-permissions" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={3} />
      ) : rows.length === 0 ? (
        <NoData title="No roles found" description="Add a new role to get started." actionLabel="Add Role" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="role-permissions"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <RoleFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Role' : 'Add Role'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Role Details"
        description={viewRow?.role_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Role', value: viewRow.role_name },
                { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
                { label: 'Created', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{viewRow.description || '—'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {MODULE_KEYS.filter((m) => viewRow.permissions?.[m]).map((m) => (
                  <span key={m} className="rounded-full border bg-primary/5 px-2.5 py-0.5 text-xs font-medium">{m}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.role_name}
        onConfirm={() => deleteRolePermission(deleteRow._id)}
      />
    </div>
  )
}

function RoleFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    role_name: initial?.role_name || '',
    description: initial?.description || '',
    permissions: { ...(initial?.permissions || {}) },
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))
  const togglePermission = (mod) => setForm((f) => ({ ...f, permissions: { ...f.permissions, [mod]: !f.permissions[mod] } }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Role information and module permissions"
      width="sm:max-w-lg"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Role'}
          submitDisabled={!form.role_name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Role Name <span className="text-destructive">*</span></Label>
            <Input value={form.role_name} onChange={(e) => set('role_name', e.target.value)} placeholder="e.g. Admin" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Role description" rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </FormSection>

        <div className="space-y-2">
          <Label className="text-xs">Module Permissions</Label>
          <div className="grid grid-cols-2 gap-2 rounded-lg border p-3">
            {MODULE_KEYS.map((mod) => (
              <label key={mod} className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={!!form.permissions[mod]} onCheckedChange={() => togglePermission(mod)} />
                <span className="text-sm">{mod}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
