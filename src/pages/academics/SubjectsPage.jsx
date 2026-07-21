import { useMemo, useState } from 'react'
import { Plus, Library, Pencil, Trash2, Eye, FlaskConical, BookText, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { academicsService } from '@/services/academics.service'
import { subjectGroups, SUBJECT_COLORS } from '@/services/mockData'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Subject' },
  { key: 'code', label: 'Code' },
  { key: 'theory', label: 'Theory Marks' },
  { key: 'practical', label: 'Practical Marks' },
  { key: 'type', label: 'Type' },
  { key: 'group', label: 'Group' },
  { key: 'status', label: 'Status' },
]

const GROUP_OPTIONS = subjectGroups.map((g) => g.name)
const TYPE_OPTIONS = ['Core', 'Elective']

export default function SubjectsPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.subjects(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const ms = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase())
      const mst = status === 'all' || r.status === status
      const mty = typeFilter === 'all' || r.type === typeFilter
      return ms && mst && mty
    }),
    [rows, search, status, typeFilter],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    core: rows.filter((r) => r.type === 'Core').length,
    elective: rows.filter((r) => r.type === 'Elective').length,
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Subject',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <span className="h-9 w-9 rounded-lg" style={{ backgroundColor: SUBJECT_COLORS[row.original.name] || '#64748b' }} aria-hidden="true" />
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.code}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'group', header: 'Group' },
    {
      accessorKey: 'theory',
      header: 'Theory',
      cell: ({ row }) => <span className="inline-flex items-center gap-1.5"><BookText className="h-3.5 w-3.5 text-muted-foreground" />{row.original.theory}</span>,
    },
    {
      accessorKey: 'practical',
      header: 'Practical',
      cell: ({ row }) => <span className="inline-flex items-center gap-1.5"><FlaskConical className="h-3.5 w-3.5 text-muted-foreground" />{row.original.practical}</span>,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant={row.original.type === 'Core' ? 'default' : 'secondary'} className="font-medium">
          {row.original.type}
        </Badge>
      ),
    },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Academics', to: '/academics/classes' }, { label: 'Subjects' }]} />
      <PageHeader
        title="Subjects"
        description="Manage subjects, marks distribution, and groups."
        icon={Library}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Subject</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Subjects" value={stats.total} icon={Library} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Core" value={stats.core} icon={BookText} accent="chart2" />
        <StatCard label="Elective" value={stats.elective} icon={FlaskConical} accent="chart3" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search subjects…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="subjects" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All types</option>
            {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
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
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No subjects found" actionLabel="Add Subject" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="subjects"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Subjects deleted' }); refetch() } }]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <SubjectDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Subject" onSubmit={async (p) => { await academicsService.createSubject(p); toast({ title: 'Subject added', description: p.name }); setAddOpen(false); refetch() }} />
      <SubjectDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Subject" initial={editRow} onSubmit={async (p) => { await academicsService.update(editRow._id, p); toast({ title: 'Subject updated', description: p.name }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Subject Details" description={viewRow?.name} width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Subject Name', value: viewRow.name },
              { label: 'Subject Code', value: viewRow.code },
              { label: 'Theory Marks', value: viewRow.theory },
              { label: 'Practical Marks', value: viewRow.practical },
              { label: 'Total Marks', value: viewRow.theory + viewRow.practical },
              { label: 'Type', value: viewRow.type },
              { label: 'Group', value: viewRow.group },
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
        onConfirm={() => { toast({ title: 'Subject deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function SubjectDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    code: initial?.code || '',
    theory: initial?.theory ?? 100,
    practical: initial?.practical ?? 0,
    type: initial?.type || 'Core',
    group: initial?.group || '',
    status: initial?.status || 'active',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Subject details" width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Subject Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Mathematics" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Subject Code <span className="text-destructive">*</span></Label>
            <Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. MATH" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Theory Marks</Label>
            <Input type="number" value={form.theory} onChange={(e) => setForm((f) => ({ ...f, theory: Number(e.target.value) }))} placeholder="e.g. 80" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Practical Marks</Label>
            <Input type="number" value={form.practical} onChange={(e) => setForm((f) => ({ ...f, practical: Number(e.target.value) }))} placeholder="e.g. 20" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Group</Label>
            <select value={form.group} onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select group</option>
              {GROUP_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
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
