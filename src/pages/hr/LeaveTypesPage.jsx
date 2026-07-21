// Leave Types — admin configures the types of leave available (Sick, Casual, etc.)
// and sets annual limits, carryover rules, and active/inactive status.

import { useMemo, useState } from 'react'
import { Plus, Tags, Pencil, Trash2, Eye, CircleCheck as CheckCircle2, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hrService } from '@/services/hr.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Leave Type' },
  { key: 'days_allowed', label: 'Days Allowed' },
  { key: 'carry_forward', label: 'Carry Forward' },
  { key: 'requires_approval', label: 'Requires Approval' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
]

export default function LeaveTypesPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => hrService.getLeaveTypes(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    withCarryForward: rows.filter((r) => r.carry_forward).length,
    totalDays: rows.filter((r) => r.status === 'active').reduce((s, r) => s + r.days_allowed, 0),
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Leave Type',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.description || '—'}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'days_allowed', header: 'Days / Year', cell: ({ row }) => (
      <span className="font-semibold">{row.original.days_allowed} days</span>
    ) },
    { accessorKey: 'carry_forward', header: 'Carry Forward', cell: ({ row }) => (
      <Badge variant={row.original.carry_forward ? 'default' : 'secondary'}>
        {row.original.carry_forward ? 'Yes' : 'No'}
      </Badge>
    ) },
    { accessorKey: 'requires_approval', header: 'Needs Approval', cell: ({ row }) => (
      <Badge variant={row.original.requires_approval ? 'default' : 'outline'}>
        {row.original.requires_approval ? 'Yes' : 'No'}
      </Badge>
    ) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => formatDate(row.original.createdAt) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  const handleSave = async (payload, id) => {
    if (id) {
      await hrService.updateLeaveType(id, payload)
      toast({ title: 'Leave type updated', description: payload.name })
      setEditRow(null)
    } else {
      await hrService.createLeaveType(payload)
      toast({ title: 'Leave type created', description: payload.name })
      setAddOpen(false)
    }
    refetch()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Leave Types' }]} />
      <PageHeader
        title="Leave Types"
        description="Configure leave categories, annual limits, and approval settings."
        icon={Tags}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Leave Type</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Types" value={stats.total} icon={Tags} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Carry Forward" value={stats.withCarryForward} icon={CalendarDays} accent="chart2" />
        <StatCard label="Active Days Total" value={stats.totalDays} icon={CalendarDays} accent="chart3" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search leave types…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="leave-types" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No leave types found" actionLabel="Add Leave Type" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="leave-types"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Leave types deleted' }); refetch() } }]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Add / Edit Drawer */}
      <LeaveTypeDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Leave Type' : 'Add Leave Type'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* View Drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Leave Type Details"
        description={viewRow?.name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Name', value: viewRow.name },
              { label: 'Days Allowed / Year', value: `${viewRow.days_allowed} days` },
              { label: 'Carry Forward', value: viewRow.carry_forward ? 'Yes' : 'No' },
              { label: 'Requires Approval', value: viewRow.requires_approval ? 'Yes' : 'No' },
              { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
              { label: 'Created', value: formatDate(viewRow.createdAt) },
              { label: 'Description', value: viewRow.description || '—' },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.name}
        onConfirm={async () => {
          await hrService.deleteLeaveType(deleteRow._id)
          toast({ title: 'Leave type deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// Reusable form drawer for add / edit leave types
function LeaveTypeDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    days_allowed: initial?.days_allowed ?? 12,
    carry_forward: initial?.carry_forward ?? false,
    requires_approval: initial?.requires_approval ?? true,
    description: initial?.description || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Leave type configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Create'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Sick Leave" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Days Allowed per Year</Label>
            <Input type="number" min="1" value={form.days_allowed} onChange={(e) => set('days_allowed', Number(e.target.value))} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm font-medium">Carry Forward</Label>
              <p className="text-xs text-muted-foreground">Unused days roll over to next year</p>
            </div>
            <button type="button" onClick={() => set('carry_forward', !form.carry_forward)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.carry_forward ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
              <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${form.carry_forward ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label className="text-sm font-medium">Requires Approval</Label>
              <p className="text-xs text-muted-foreground">Applications need admin approval</p>
            </div>
            <button type="button" onClick={() => set('requires_approval', !form.requires_approval)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${form.requires_approval ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
              <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${form.requires_approval ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Brief description" />
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
