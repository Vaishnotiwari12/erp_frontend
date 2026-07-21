// Add Staff Member — assign library permissions to existing staff members.
// Staff are sourced from the HR module; this page lets the librarian search
// for staff, assign permissions (issue, return, manage books, manage staff),
// and toggle active/inactive status.

import { useMemo, useState } from 'react'
import {
  UserCog,
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  Pencil,
  Trash2,
  Eye,
  UserPlus,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { StatusBadge } from '@/components/StatusBadge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { libraryService } from '@/services/library.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// All available library permissions — maps to backend permission keys.
const ALL_PERMISSIONS = [
  { key: 'issue_books', label: 'Issue Books', description: 'Can lend books to members' },
  { key: 'return_books', label: 'Return Books', description: 'Can process book returns' },
  { key: 'manage_books', label: 'Manage Books', description: 'Can add, edit, and delete books' },
  { key: 'manage_staff', label: 'Manage Staff', description: 'Can assign library staff' },
]

const EXPORT_COLS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'status', label: 'Status' },
  { key: 'assigned_at', label: 'Assigned On' },
]

export default function AddStaffMemberPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => libraryService.getLibraryStaff(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.department.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    inactive: rows.filter((r) => r.status === 'inactive').length,
  }), [rows])

  const handleSave = async (payload, id) => {
    if (id) {
      await libraryService.updateLibraryStaff(id, payload)
      toast({ title: 'Staff member updated', description: payload.name })
      setEditRow(null)
    } else {
      await libraryService.addLibraryStaff(payload)
      toast({ title: 'Staff member added', description: payload.name })
      setAddOpen(false)
    }
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Staff Member',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {row.original.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'department', header: 'Department' },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.permissions.map((p) => (
            <Badge key={p} variant="outline" className="text-xs">
              {ALL_PERMISSIONS.find((ap) => ap.key === p)?.label || p}
            </Badge>
          ))}
        </div>
      ),
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'assigned_at', header: 'Assigned On', cell: ({ row }) => formatDate(row.original.assigned_at) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Remove', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Library' }, { label: 'Library Staff' }]} />
      <PageHeader
        title="Library Staff"
        description="Assign library permissions to staff members."
        icon={UserCog}
        actions={<Button onClick={() => setAddOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Add Staff Member</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Staff" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={ShieldCheck} accent="success" />
        <StatCard label="Inactive" value={stats.inactive} icon={ShieldX} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or department…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
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
      ) : filtered.length === 0 ? (
        <NoData title="No library staff found" description="Add a staff member to get started." actionLabel="Add Staff Member" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <StaffFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Library Staff' : 'Add Library Staff'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Staff Member Details"
        description={viewRow?.name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {viewRow.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.email}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Department', value: viewRow.department },
                { label: 'Assigned On', value: formatDate(viewRow.assigned_at) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            {/* Permissions list */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Assigned Permissions</p>
              <div className="space-y-2">
                {ALL_PERMISSIONS.map((p) => {
                  const has = viewRow.permissions.includes(p.key)
                  return (
                    <div key={p.key} className={cn('flex items-center gap-2 rounded-lg border p-2.5', has ? 'bg-success/5 border-success/20' : 'bg-muted/20')}>
                      {has ? <ShieldCheck className="h-4 w-4 text-success" /> : <ShieldX className="h-4 w-4 text-muted-foreground" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{p.label}</p>
                        <p className="text-xs text-muted-foreground">{p.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.name}
        onConfirm={async () => {
          await libraryService.deleteLibraryStaff(deleteRow._id)
          toast({ title: 'Staff member removed' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// ─── Form Drawer (shared by Add and Edit) ─────────────────────────────────────
// Staff search field + permission checkboxes + status toggle.
function StaffFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    staff_id: initial?.staff_id || '',
    department: initial?.department || '',
    permissions: initial?.permissions || ['issue_books'],
    status: initial?.status || 'active',
  })
  const [staffSearch, setStaffSearch] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Toggle a permission on or off — checkbox-driven permission assignment.
  const togglePermission = (key) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter((p) => p !== key)
        : [...f.permissions, key],
    }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Assign library permissions to a staff member"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Staff Member'}
          submitDisabled={!form.name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <div className="space-y-4">
        <FormSection columns={1}>
          {/* Staff search — type the name, fills the form fields */}
          <div className="space-y-1.5">
            <Label className="text-xs">Staff Member Name <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={staffSearch}
                onChange={(e) => {
                  setStaffSearch(e.target.value)
                  set('name', e.target.value)
                }}
                placeholder="Search existing staff by name…"
                className="pl-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@school.edu" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Input value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Department" />
            </div>
          </div>
        </FormSection>

        {/* Permission checkboxes — each one grants a specific library capability */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <Label className="text-sm font-medium">Library Permissions</Label>
          </div>
          <div className="space-y-2">
            {ALL_PERMISSIONS.map((p) => (
              <label
                key={p.key}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                  form.permissions.includes(p.key) ? 'border-primary/30 bg-primary/5' : 'hover:bg-muted/40',
                )}
              >
                <Checkbox
                  checked={form.permissions.includes(p.key)}
                  onCheckedChange={() => togglePermission(p.key)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </FormSection>
      </div>
    </Drawer>
  )
}
