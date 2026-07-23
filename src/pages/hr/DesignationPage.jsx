// ====================================================================
// Module: Human Resources
// Page: Designation
//
// Purpose:
// Manage job titles and seniority levels for all staff.
//
// Data Source:
// hr.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Plus, Briefcase, Pencil, Trash2, Eye, CircleCheck as CheckCircle2, Layers } from 'lucide-react'
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
import { ImportButton } from '@/components/ImportButton'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hrService } from '@/services/hr.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Designation' },
  { key: 'code', label: 'Code' },
  { key: 'department', label: 'Department' },
  { key: 'level', label: 'Level' },
  { key: 'staff_count', label: 'Staff Count' },
  { key: 'status', label: 'Status' },
]

// Level badge colour — senior levels get a stronger visual weight
function LevelBadge({ level }) {
  const variant = level === 1 ? 'default' : level === 2 ? 'secondary' : 'outline'
  return <Badge variant={variant}>Level {level}</Badge>
}

export default function DesignationPage() {
  const { toast } = useToast()
  const { data: desigData, isLoading: desigLoading, refetch } = useAsyncData(() => hrService.getDesignations(), [])
  const { data: deptData } = useAsyncData(() => hrService.getDepartments(), [])

  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = desigData || []
  const departments = (deptData || []).map((d) => d.name)

  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'all' || r.department === deptFilter
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchDept && matchStatus
  }), [rows, search, deptFilter, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    depts: new Set(rows.map((r) => r.department)).size,
    inactive: rows.filter((r) => r.status !== 'active').length,
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Designation',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-4/10 text-chart-4">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.code}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'level', header: 'Level', cell: ({ row }) => <LevelBadge level={row.original.level} /> },
    {
      accessorKey: 'staff_count',
      header: 'Staff',
      cell: ({ row }) => <span className="font-medium">{row.original.staff_count}</span>,
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
      await hrService.updateDesignation(id, payload)
      toast({ title: 'Designation updated', description: payload.name })
      setEditRow(null)
    } else {
      await hrService.createDesignation(payload)
      toast({ title: 'Designation created', description: payload.name })
      setAddOpen(false)
    }
    refetch()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Designation' }]} />
      <PageHeader
        title="Designation"
        description="Manage job titles and seniority levels for all staff."
        icon={Briefcase}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Designation</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Designations" value={stats.total} icon={Briefcase} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Departments" value={stats.depts} icon={Layers} accent="chart2" />
        <StatCard label="Inactive" value={stats.inactive} icon={Briefcase} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search designations…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="designations" />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {desigLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No designations found" actionLabel="Add Designation" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="designations"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Designations deleted' }); refetch() } }]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <DesignationDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Designation"
        departments={departments}
        onSubmit={(p) => handleSave(p, null)}
      />

      <DesignationDrawer
        open={!!editRow}
        onOpenChange={(o) => !o && setEditRow(null)}
        title="Edit Designation"
        initial={editRow}
        departments={departments}
        onSubmit={(p) => handleSave(p, editRow?._id)}
      />

      {/* View Drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Designation Details"
        description={viewRow?.name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Designation', value: viewRow.name },
              { label: 'Code', value: viewRow.code },
              { label: 'Department', value: viewRow.department },
              { label: 'Level', value: <LevelBadge level={viewRow.level} /> },
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
          await hrService.deleteDesignation(deleteRow._id)
          toast({ title: 'Designation deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

function DesignationDrawer({ open, onOpenChange, title, initial, departments = [], onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    code: initial?.code || '',
    department: initial?.department || '',
    level: initial?.level ?? 3,
    description: initial?.description || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Designation details"
      width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Designation Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Senior Teacher" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Code <span className="text-destructive">*</span></Label>
            <Input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="e.g. SNR-TCH" required />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Department</Label>
            <select value={form.department} onChange={(e) => set('department', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Level (1 = Senior, higher = Junior)</Label>
            <Input type="number" min="1" max="10" value={form.level} onChange={(e) => set('level', Number(e.target.value))} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Role overview" />
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
