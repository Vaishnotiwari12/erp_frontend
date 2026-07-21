import { useMemo, useState } from 'react'
import { Plus, BookOpen, Pencil, Trash2, Eye, Layers, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { academicsService } from '@/services/academics.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Class' },
  { key: 'numeric', label: 'Numeric' },
  { key: 'sections_count', label: 'Sections' },
  { key: 'status', label: 'Status' },
]

export default function ClassesPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.classes(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const ms = !search || r.name.toLowerCase().includes(search.toLowerCase())
      const mst = status === 'all' || r.status === status
      return ms && mst
    }),
    [rows, search, status],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    sections: rows.reduce((s, r) => s + (r.sections_count || 0), 0),
    inactive: rows.filter((r) => r.status !== 'active').length,
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Class',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">Grade {row.original.numeric}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'numeric', header: 'Numeric Value' },
    {
      accessorKey: 'sections_count',
      header: 'Sections',
      cell: ({ row }) => <span className="font-medium">{row.original.sections_count}</span>,
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

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Academics', to: '/academics/classes' }, { label: 'Classes' }]} />
      <PageHeader
        title="Classes"
        description="Manage academic classes and grade levels."
        icon={BookOpen}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Class</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Classes" value={stats.total} icon={BookOpen} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Total Sections" value={stats.sections} icon={Layers} accent="chart2" />
        <StatCard label="Inactive" value={stats.inactive} icon={BookOpen} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search classes…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="classes" />
          <FilterSelect value={status} onChange={setStatus} />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={5} />
      ) : filtered.length === 0 ? (
        <NoData title="No classes found" actionLabel="Add Class" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="classes"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Classes deleted' }); refetch() } }]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <ClassDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Class" onSubmit={async (p) => { await academicsService.createClass(p); toast({ title: 'Class added', description: p.name }); setAddOpen(false); refetch() }} />
      <ClassDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Class" initial={editRow} onSubmit={async (p) => { await academicsService.update(editRow._id, p); toast({ title: 'Class updated', description: p.name }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Class Details" description={viewRow?.name} width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Class Name', value: viewRow.name },
              { label: 'Numeric Value', value: viewRow.numeric },
              { label: 'Sections Count', value: viewRow.sections_count },
              { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
              { label: 'Created', value: formatDate(viewRow.createdAt) },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.name}
        onConfirm={() => { toast({ title: 'Class deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function FilterSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
      <option value="all">All statuses</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  )
}

function ClassDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    numeric: initial?.numeric || '',
    sections_count: initial?.sections_count || 0,
    status: initial?.status || 'active',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Class details" width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Class Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Class 10" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Numeric Value <span className="text-destructive">*</span></Label>
            <Input type="number" value={form.numeric} onChange={(e) => setForm((f) => ({ ...f, numeric: Number(e.target.value) }))} placeholder="e.g. 10" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Sections Count</Label>
            <Input type="number" value={form.sections_count} onChange={(e) => setForm((f) => ({ ...f, sections_count: Number(e.target.value) }))} placeholder="e.g. 3" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
