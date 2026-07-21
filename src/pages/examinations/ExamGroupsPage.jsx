import { useMemo, useState } from 'react'
import { Plus, FileText, CalendarRange, Users, CheckCircle2, Eye, Pencil, Trash2, CalendarDays } from 'lucide-react'
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
import { examinationService } from '@/services/examination.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Exam Name' },
  { key: 'session', label: 'Session' },
  { key: 'start_date', label: 'Start Date' },
  { key: 'end_date', label: 'End Date' },
  { key: 'students_count', label: 'Students' },
  { key: 'subjects_count', label: 'Subjects' },
  { key: 'status', label: 'Status' },
]

const SESSIONS = ['2024-2025', '2025-2026', '2026-2027']
const STATUSES = ['scheduled', 'active', 'completed']

export default function ExamGroupsPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getExamGroups(), [])
  const [search, setSearch] = useState('')
  const [session, setSession] = useState('all')
  const [status, setStatus] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const ms = !search || r.name.toLowerCase().includes(search.toLowerCase())
      const mss = session === 'all' || r.session === session
      const mst = status === 'all' || r.status === status
      return ms && mss && mst
    }),
    [rows, search, session, status],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    scheduled: rows.filter((r) => r.status === 'scheduled').length,
    completed: rows.filter((r) => r.status === 'completed').length,
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Exam Group',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.session}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'start_date', header: 'Start Date', cell: ({ row }) => formatDate(row.original.start_date) },
    { accessorKey: 'end_date', header: 'End Date', cell: ({ row }) => formatDate(row.original.end_date) },
    { accessorKey: 'students_count', header: 'Students' },
    { accessorKey: 'subjects_count', header: 'Subjects' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  const handleBulkDelete = async (selected) => {
    await examinationService.bulkDeleteExamGroups(selected.map((s) => s._id))
    toast({ title: `${selected.length} exam groups deleted` })
    refetch()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Exam Groups' }]} />
      <PageHeader
        title="Exam Groups"
        description="Create and manage examination groups across academic sessions."
        icon={FileText}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Exam Group</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Groups" value={stats.total} icon={FileText} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Scheduled" value={stats.scheduled} icon={CalendarRange} accent="warning" />
        <StatCard label="Completed" value={stats.completed} icon={CalendarDays} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search exam groups…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="exam-groups" />
          <select value={session} onChange={(e) => setSession(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All sessions</option>
            {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No exam groups found" actionLabel="Add Exam Group" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="exam-groups"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: handleBulkDelete }]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <ExamGroupDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Exam Group" onSubmit={async (p) => { await examinationService.createExamGroup(p); toast({ title: 'Exam group added', description: p.name }); setAddOpen(false); refetch() }} />
      <ExamGroupDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Exam Group" initial={editRow} onSubmit={async (p) => { await examinationService.updateExamGroup(editRow._id, p); toast({ title: 'Exam group updated', description: p.name }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Exam Group Details" description={viewRow?.name} width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Exam Name', value: viewRow.name },
              { label: 'Session', value: viewRow.session },
              { label: 'Start Date', value: formatDate(viewRow.start_date) },
              { label: 'End Date', value: formatDate(viewRow.end_date) },
              { label: 'Students', value: viewRow.students_count },
              { label: 'Subjects', value: viewRow.subjects_count },
              { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
              { label: 'Created', value: formatDate(viewRow.createdAt) },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
            <div className="space-y-0.5 sm:col-span-2">
              <dt className="text-xs font-medium text-muted-foreground">Description</dt>
              <dd className="text-sm">{viewRow.description || '—'}</dd>
            </div>
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.name}
        onConfirm={async () => { await examinationService.removeExamGroup(deleteRow._id); toast({ title: 'Exam group deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function ExamGroupDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    session: initial?.session || SESSIONS[0],
    start_date: initial?.start_date || '',
    end_date: initial?.end_date || '',
    description: initial?.description || '',
    status: initial?.status || 'scheduled',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Exam group details" width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Exam Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Annual Examination" required />
          </div>
        </FormSection>
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Session</Label>
            <select value={form.session} onChange={(e) => setForm((f) => ({ ...f, session: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Start Date</Label>
            <Input type="date" value={form.start_date} onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">End Date</Label>
            <Input type="date" value={form.end_date} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
          </div>
        </FormSection>
        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description…" rows={3} />
        </div>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
