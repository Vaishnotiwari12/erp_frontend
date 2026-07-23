// ====================================================================
// Module: Online Exam
// Page: Exam Schedule
//
// Purpose:
// View exams in a schedule view and update exam status (activate/cancel).
//
// Data Source:
// onlineExam.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  CalendarClock,
  Plus,
  Eye,
  Zap,
  Ban,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
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
  { key: 'scheduled_at', label: 'Scheduled At' },
  { key: 'duration', label: 'Duration (min)' },
  { key: 'total_marks', label: 'Total Marks' },
  { key: 'status', label: 'Status' },
]

const STATUS_STYLES = {
  scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

export default function ExamSchedulePage() {
  const {
    rows, classes, stats, isLoading,
    classFilter, setClassFilter, statusFilter, setStatusFilter, saveExam,
  } = useOnlineExams()

  const [addOpen, setAddOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)

  const handleActivate = async (exam) => {
    await saveExam({ ...exam, status: 'active' }, exam._id)
  }

  const handleCancel = async (exam) => {
    await saveExam({ ...exam, status: 'cancelled' }, exam._id)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'exam_name',
      header: 'Exam',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarClock className="h-4 w-4" />
          </div>
          <span className="font-medium hover:underline">{row.original.exam_name}</span>
        </button>
      ),
    },
    { accessorKey: 'class_name', header: 'Class', cell: ({ row }) => <Badge variant="secondary">{row.original.class_name}</Badge> },
    { accessorKey: 'subject_name', header: 'Subject', cell: ({ row }) => <span className="text-sm">{row.original.subject_name}</span> },
    { accessorKey: 'scheduled_at', header: 'Scheduled At', cell: ({ row }) => <span className="text-sm">{formatDate(row.original.scheduled_at)}</span> },
    { accessorKey: 'duration', header: 'Duration', cell: ({ row }) => <Badge variant="outline">{row.original.duration} min</Badge> },
    { accessorKey: 'total_marks', header: 'Marks', cell: ({ row }) => <span className="font-medium">{row.original.total_marks}</span> },
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

  const rowActions = (r) => {
    const actions = [{ label: 'View', icon: Eye, onClick: () => setViewRow(r) }]
    if (r.status === 'scheduled') {
      actions.push({ label: 'Activate', icon: Zap, onClick: () => handleActivate(r) })
    }
    if (r.status === 'scheduled' || r.status === 'active') {
      actions.push({ separator: true })
      actions.push({ label: 'Cancel', icon: Ban, variant: 'destructive', onClick: () => handleCancel(r) })
    }
    return actions
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Online Exam' }, { label: 'Exam Schedule' }]} />
      <PageHeader
        title="Exam Schedule"
        description="View scheduled exams and manage their status."
        icon={CalendarClock}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Schedule Exam</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Exams" value={stats.total} icon={CalendarClock} accent="primary" />
        <StatCard label="Scheduled" value={stats.scheduled} icon={CalendarClock} accent="warning" />
        <StatCard label="Active" value={stats.active} icon={Zap} accent="success" />
        <StatCard label="Completed" value={stats.completed} icon={CalendarClock} accent="chart2" />
      </div>

      <FilterBar>
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="exam-schedule" />
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
        <LoadingSkeleton variant="table" rows={5} cols={7} />
      ) : rows.length === 0 ? (
        <NoData title="No scheduled exams" description="Schedule a new exam to get started." actionLabel="Schedule Exam" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="exam-schedule"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <ScheduleFormDrawer
        open={addOpen}
        onOpenChange={(o) => !o && setAddOpen(false)}
        title="Schedule Exam"
        onSubmit={(payload) => { saveExam(payload); setAddOpen(false) }}
      />

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
                <CalendarClock className="h-5 w-5" />
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
                { label: 'Duration', value: `${viewRow.duration} min` },
                { label: 'Total Marks', value: viewRow.total_marks },
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
    </div>
  )
}

// ─── Schedule Form Drawer ────────────────────────────────────────────────────
function ScheduleFormDrawer({ open, onOpenChange, title, onSubmit }) {
  const [form, setForm] = useState({
    exam_name: '',
    class_id: '',
    class_name: '',
    subject_id: '',
    subject_name: '',
    duration: 60,
    total_marks: 100,
    pass_marks: 40,
    scheduled_at: '',
    status: 'scheduled',
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
      description="Schedule a new online exam"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Schedule Exam"
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
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
