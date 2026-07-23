// ====================================================================
// Module: Lesson Plan
// Page: Manage Lesson Plan
//
// Purpose:
// Create, edit, and delete lesson plans across classes and subjects.
//
// Data Source:
// lessonPlan.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { BookOpen, Plus, Eye, Pencil, Trash2, CircleCheck as CheckCircle, Clock, FileText } from 'lucide-react'
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
import { StatusBadge } from '@/components/StatusBadge'
import { useLessonPlans } from '@/hooks/useLessonPlan'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'lesson_name', label: 'Lesson' },
  { key: 'class_name', label: 'Class' },
  { key: 'subject_name', label: 'Subject' },
  { key: 'topic', label: 'Topic' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
]

// Maps lesson-plan status to a StatusBadge-compatible value.
function LessonStatusBadge({ status }) {
  const map = { 'in-progress': 'pending', completed: 'active', pending: 'inactive' }
  return <StatusBadge status={map[status] || status} />
}

export default function ManageLessonPlanPage() {
  const {
    rows, classes, subjects, stats, isLoading,
    search, setSearch, classFilter, setClassFilter,
    subjectFilter, setSubjectFilter, statusFilter, setStatusFilter,
    saveLessonPlan, deleteLessonPlan,
  } = useLessonPlans()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveLessonPlan(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'lesson_name',
      header: 'Lesson',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.lesson_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.topic}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'class_name', header: 'Class', cell: ({ row }) => <Badge variant="secondary">{row.original.class_name}</Badge> },
    { accessorKey: 'subject_name', header: 'Subject' },
    { accessorKey: 'topic', header: 'Topic', cell: ({ row }) => <span className="line-clamp-1 max-w-xs">{row.original.topic}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <LessonStatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Lesson Plan' }, { label: 'Manage Lesson Plan' }]} />
      <PageHeader
        title="Manage Lesson Plan"
        description="Create and manage lesson plans across classes and subjects."
        icon={BookOpen}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Lesson Plan</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Lessons" value={stats.total} icon={BookOpen} accent="primary" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} accent="success" />
        <StatCard label="In Progress" value={stats.in_progress} icon={Clock} accent="warning" />
        <StatCard label="Pending" value={stats.pending} icon={FileText} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by lesson, topic, class, or subject…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="lesson-plans" />
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All classes</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All subjects</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No lesson plans found" description="Add a new lesson plan to get started." actionLabel="Add Lesson Plan" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="lesson-plans"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Lesson Plan Form Drawer used for both Add and Edit. */}
      <LessonPlanFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Lesson Plan' : 'Add Lesson Plan'}
        initial={editRow}
        classes={classes}
        subjects={subjects}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Lesson Plan Details"
        description={viewRow?.lesson_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.lesson_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.class_name} · {viewRow.subject_name}</p>
              </div>
              <LessonStatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Topic', value: viewRow.topic },
                { label: 'Created On', value: formatDate(viewRow.created_at) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">Description</dt>
              <dd className="text-sm">{viewRow.description || '—'}</dd>
            </div>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.lesson_name}
        onConfirm={() => deleteLessonPlan(deleteRow._id)}
      />
    </div>
  )
}

// ─── Lesson Plan Form Drawer (shared by Add and Edit) ──────────────────────
function LessonPlanFormDrawer({ open, onOpenChange, title, initial, classes, subjects, onSubmit }) {
  const [form, setForm] = useState({
    class_id: initial?.class_id || '',
    class_name: initial?.class_name || '',
    subject_id: initial?.subject_id || '',
    subject_name: initial?.subject_name || '',
    lesson_name: initial?.lesson_name || '',
    topic: initial?.topic || '',
    description: initial?.description || '',
    status: initial?.status || 'pending',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleClassChange = (id) => {
    const c = classes.find((x) => x._id === id)
    setForm((f) => ({ ...f, class_id: id, class_name: c?.name || '' }))
  }

  const handleSubjectChange = (id) => {
    const s = subjects.find((x) => x._id === id)
    setForm((f) => ({ ...f, subject_id: id, subject_name: s?.name || '' }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Lesson plan information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Lesson Plan'}
          submitDisabled={!form.lesson_name.trim() || !form.class_id || !form.subject_id}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Lesson Name <span className="text-destructive">*</span></Label>
            <Input value={form.lesson_name} onChange={(e) => set('lesson_name', e.target.value)} placeholder="e.g. Algebra Basics" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Class <span className="text-destructive">*</span></Label>
            <select value={form.class_id} onChange={(e) => handleClassChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select class</option>
              {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Subject <span className="text-destructive">*</span></Label>
            <select value={form.subject_id} onChange={(e) => handleSubjectChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select subject</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Topic</Label>
            <Input value={form.topic} onChange={(e) => set('topic', e.target.value)} placeholder="e.g. Linear Equations" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the lesson plan…"
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
