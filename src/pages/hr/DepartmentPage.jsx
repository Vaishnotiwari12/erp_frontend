// Departments — manage organisational units (e.g. Mathematics, Science, Admin).
// Each department has a head, a staff count, and an active/inactive status.

import { useMemo, useState } from 'react'
import { Plus, Building2, Pencil, Trash2, Eye, Users, CircleCheck as CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { ImportButton } from '@/components/ImportButton'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hrService } from '@/services/hr.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Department' },
  { key: 'code', label: 'Code' },
  { key: 'head', label: 'Head' },
  { key: 'staff_count', label: 'Staff Count' },
  { key: 'status', label: 'Status' },
]

export default function DepartmentPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => hrService.getDepartments(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    totalStaff: rows.reduce((s, r) => s + (r.staff_count || 0), 0),
    inactive: rows.filter((r) => r.status !== 'active').length,
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Department',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.code}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'head', header: 'Department Head' },
    {
      accessorKey: 'staff_count',
      header: 'Staff Count',
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          {row.original.staff_count}
        </span>
      ),
    },
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
      await hrService.updateDepartment(id, payload)
      toast({ title: 'Department updated', description: payload.name })
      setEditRow(null)
    } else {
      await hrService.createDepartment(payload)
      toast({ title: 'Department created', description: payload.name })
      setAddOpen(false)
    }
    refetch()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Department' }]} />
      <PageHeader
        title="Department"
        description="Manage academic and administrative departments."
        icon={Building2}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Department</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Departments" value={stats.total} icon={Building2} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Total Staff" value={stats.totalStaff} icon={Users} accent="chart2" />
        <StatCard label="Inactive" value={stats.inactive} icon={Building2} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search departments…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="departments" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={5} />
      ) : filtered.length === 0 ? (
        <NoData title="No departments found" actionLabel="Add Department" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="departments"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Departments deleted' }); refetch() } }]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Add Drawer */}
      <DepartmentDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Department"
        onSubmit={(p) => handleSave(p, null)}
      />

      {/* Edit Drawer */}
      <DepartmentDrawer
        open={!!editRow}
        onOpenChange={(o) => !o && setEditRow(null)}
        title="Edit Department"
        initial={editRow}
        onSubmit={(p) => handleSave(p, editRow?._id)}
      />

      {/* View Drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Department Details"
        description={viewRow?.name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Department Name', value: viewRow.name },
              { label: 'Code', value: viewRow.code },
              { label: 'Department Head', value: viewRow.head || '—' },
              { label: 'Staff Count', value: viewRow.staff_count },
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
          await hrService.deleteDepartment(deleteRow._id)
          toast({ title: 'Department deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

function DepartmentDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    code: initial?.code || '',
    head: initial?.head || '',
    description: initial?.description || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Department details"
      width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Department Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Mathematics" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Code <span className="text-destructive">*</span></Label>
            <Input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="e.g. MATH" required />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Department Head</Label>
            <Input value={form.head} onChange={(e) => set('head', e.target.value)} placeholder="Head's name" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Department overview" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
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
