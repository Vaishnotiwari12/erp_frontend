// ====================================================================
// Module: Online Exam
// Page: Online Exams
//
// Purpose:
// Manage online exams — create, edit, view, and delete exams.
//
// Data Source:
// onlineExam.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { MonitorPlay, CalendarClock, Zap, CircleCheck as CheckCircle, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useOnlineExams } from '@/hooks/useOnlineExam'
import { academicClasses, subjects } from '@/data/academics.mock'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'exam_name', label: 'Exam Name' },
  { key: 'class_name', label: 'Class' },
  { key: 'subject_name', label: 'Subject' },
  { key: 'duration', label: 'Duration (min)' },
  { key: 'total_marks', label: 'Total Marks' },
  { key: 'scheduled_at', label: 'Scheduled At' },
  { key: 'status', label: 'Status' },
]

const STATUS_STYLES = {
  scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

export default function OnlineExamsPage() {
  const {
    rows, classes, stats, isLoading,
    search, setSearch, classFilter, setClassFilter,
    statusFilter, setStatusFilter, saveExam, deleteExam,
  } = useOnlineExams()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveExam(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'exam_name',
      header: 'Exam',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MonitorPlay className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.exam_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.class_name} · {row.original.subject_name}</span>
          </div>
        </button>
      ),
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: ({ row }) => <Badge variant="outline">{row.original.duration} min</Badge>,
    },
    { accessorKey: 'total_marks', header: 'Total Marks', cell: ({ row }) => <span className="font-medium">{row.original.total_marks}</span> },
    { accessorKey: 'scheduled_at', header: 'Scheduled At', cell: ({ row }) => <span className="text-sm">{formatDate(row.original.scheduled_at)}</span> },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[row.original.status] || ''}`}>
          {row.original.status}
        </span>
      ),
    },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Online Exam' }, { label: 'Exams' }]} />
      <PageHeader
        title="Online Exams"
        description="Create and manage online examinations across classes and subjects."
        icon={MonitorPlay}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Exam</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Exams" value={stats.total} icon={MonitorPlay} accent="primary" />
        <StatCard label="Scheduled" value={stats.scheduled} icon={CalendarClock} accent="warning" />
        <StatCard label="Active" value={stats.active} icon={Zap} accent="success" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by exam name, class, or subject…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="online-exams" />
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All classes</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No exams found" description="Add a new online exam to get started." actionLabel="Add Exam" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="online-exams"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Exam Form Drawer used for both Add and Edit. */}
      <ExamFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Exam' : 'Add Exam'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Exam Details"
        description={viewRow?.exam_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MonitorPlay className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.exam_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.class_name} · {viewRow.subject_name}</p>
              </div>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[viewRow.status] || ''}`}>
                {viewRow.status}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Category', value: viewRow.category_name },
                { label: 'Duration', value: `${viewRow.duration} min` },
                { label: 'Total Marks', value: viewRow.total_marks },
                { label: 'Pass Marks', value: viewRow.pass_marks },
                { label: 'Scheduled At', value: formatDate(viewRow.scheduled_at) },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.exam_name}
        onConfirm={() => deleteExam(deleteRow._id)}
      />
    </div>
  )
}

// ─── Exam Form Drawer (shared by Add and Edit) ──────────────────────────────
function ExamFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    exam_name: initial?.exam_name || '',
    class_id: initial?.class_id || '',
    class_name: initial?.class_name || '',
    subject_id: initial?.subject_id || '',
    subject_name: initial?.subject_name || '',
    category_id: initial?.category_id || '',
    category_name: initial?.category_name || '',
    duration: initial?.duration || 60,
    total_marks: initial?.total_marks || 100,
    pass_marks: initial?.pass_marks || 40,
    scheduled_at: initial?.scheduled_at ? initial.scheduled_at.slice(0, 16) : '',
    status: initial?.status || 'scheduled',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleClassChange = (id) => {
    const cls = academicClasses.find((c) => c._id === id)
    setForm((f) => ({ ...f, class_id: id, class_name: cls?.name || '' }))
  }

  const handleSubjectChange = (id) => {
    const subj = subjects.find((s) => s._id === id)
    setForm((f) => ({ ...f, subject_id: id, subject_name: subj?.name || '' }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Exam information and configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Exam'}
          submitDisabled={!form.exam_name.trim() || !form.class_id || !form.subject_id}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Exam Name <span className="text-destructive">*</span></Label>
            <Input value={form.exam_name} onChange={(e) => set('exam_name', e.target.value)} placeholder="e.g. Class 10 Math Mid Term" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Class <span className="text-destructive">*</span></Label>
              <select value={form.class_id} onChange={(e) => handleClassChange(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select class</option>
                {academicClasses.filter((c) => c.status === 'active').map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Subject <span className="text-destructive">*</span></Label>
              <select value={form.subject_id} onChange={(e) => handleSubjectChange(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select subject</option>
                {subjects.filter((s) => s.status === 'active').map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Duration (min)</Label>
              <Input type="number" min="1" value={form.duration} onChange={(e) => set('duration', parseInt(e.target.value) || 60)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Total Marks</Label>
              <Input type="number" min="1" value={form.total_marks} onChange={(e) => set('total_marks', parseInt(e.target.value) || 100)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Pass Marks</Label>
              <Input type="number" min="0" value={form.pass_marks} onChange={(e) => set('pass_marks', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Scheduled At</Label>
              <Input type="datetime-local" value={form.scheduled_at} onChange={(e) => set('scheduled_at', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
