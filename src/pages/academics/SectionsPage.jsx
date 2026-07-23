// ====================================================================
// Module: Academics
// Page: Sections
//
// Purpose:
// Manage class sections, rooms, and capacities.
//
// Data Source:
// academics.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Plus, Layers, Pencil, Trash2, Eye, DoorOpen, CircleCheck as CheckCircle2 } from 'lucide-react'
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
import { academicClasses } from '@/services/mockData'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Section' },
  { key: 'class', label: 'Class' },
  { key: 'room', label: 'Room' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'status', label: 'Status' },
]

const CLASS_OPTIONS = academicClasses.map((c) => c.name)

export default function SectionsPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.sections(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const ms = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.class.toLowerCase().includes(search.toLowerCase())
      const mst = status === 'all' || r.status === status
      const msc = classFilter === 'all' || r.class === classFilter
      return ms && mst && msc
    }),
    [rows, search, status, classFilter],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    capacity: rows.reduce((s, r) => s + (r.capacity || 0), 0),
    inactive: rows.filter((r) => r.status !== 'active').length,
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Section',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium hover:underline">Section {row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.class}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'room', header: 'Room', cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5"><DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />{row.original.room}</span>
    ) },
    { accessorKey: 'capacity', header: 'Capacity', cell: ({ row }) => <span className="font-medium">{row.original.capacity}</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Academics', to: '/academics/classes' }, { label: 'Sections' }]} />
      <PageHeader
        title="Sections"
        description="Manage class sections, rooms, and capacities."
        icon={Layers}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Section</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sections" value={stats.total} icon={Layers} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Total Capacity" value={stats.capacity} icon={DoorOpen} accent="chart2" />
        <StatCard label="Inactive" value={stats.inactive} icon={Layers} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search sections…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="sections" />
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All classes</option>
            {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
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
        <NoData title="No sections found" actionLabel="Add Section" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="sections"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Sections deleted' }); refetch() } }]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <SectionDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Section" onSubmit={async (p) => { await academicsService.createSection(p); toast({ title: 'Section added', description: `Section ${p.name}` }); setAddOpen(false); refetch() }} />
      <SectionDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Section" initial={editRow} onSubmit={async (p) => { await academicsService.update(editRow._id, p); toast({ title: 'Section updated', description: `Section ${p.name}` }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Section Details" description={viewRow ? `Section ${viewRow.name} · ${viewRow.class}` : ''} width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Section Name', value: viewRow.name },
              { label: 'Class', value: viewRow.class },
              { label: 'Room', value: viewRow.room },
              { label: 'Capacity', value: viewRow.capacity },
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

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow ? `Section ${deleteRow.name}` : ''}
        onConfirm={() => { toast({ title: 'Section deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function SectionDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    class: initial?.class || '',
    room: initial?.room || '',
    capacity: initial?.capacity || 0,
    status: initial?.status || 'active',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Section details" width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Section Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. A" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Class <span className="text-destructive">*</span></Label>
            <select value={form.class} onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" required>
              <option value="">Select class</option>
              {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Room</Label>
            <Input value={form.room} onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))} placeholder="e.g. 101" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Capacity</Label>
            <Input type="number" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))} placeholder="e.g. 40" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
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
