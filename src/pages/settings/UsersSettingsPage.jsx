// ====================================================================
// Module: Settings
// Page: Users Settings
//
// Purpose:
// Manage system users and their access.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Users, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
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
import { useUsers } from '@/hooks/useSettings'
import { formatDate, formatRelativeTime } from '@/utils/format'

const ROLES = ['Admin', 'Teacher', 'Accountant', 'Librarian', 'Receptionist', 'Super Admin']

const EXPORT_COLS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'last_login', label: 'Last Login' },
]

export default function UsersSettingsPage() {
  const {
    rows, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    saveUser, deleteUser,
  } = useUsers()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveUser(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role', cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'last_login', header: 'Last Login', cell: ({ row }) => <span className="text-muted-foreground">{row.original.last_login ? formatRelativeTime(row.original.last_login) : 'Never'}</span> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Users' }]} />
      <PageHeader
        title="Users"
        description="Manage system users and their access roles."
        icon={Users}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add User</Button>}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search users…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="users" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No users found" description="Add a new user to get started." actionLabel="Add User" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="users"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <UserFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit User' : 'Add User'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="User Details"
        description={viewRow?.name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Name', value: viewRow.name },
              { label: 'Email', value: viewRow.email },
              { label: 'Role', value: viewRow.role },
              { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
              { label: 'Last Login', value: viewRow.last_login ? formatRelativeTime(viewRow.last_login) : 'Never' },
              { label: 'Created', value: formatDate(viewRow.created_at) },
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
        entityName={deleteRow?.name}
        onConfirm={() => deleteUser(deleteRow._id)}
      />
    </div>
  )
}

function UserFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    role: initial?.role || 'Teacher',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="User account information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add User'}
          submitDisabled={!form.name.trim() || !form.email.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email <span className="text-destructive">*</span></Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="user@school.edu" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Role</Label>
            <select value={form.role} onChange={(e) => set('role', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
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
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
