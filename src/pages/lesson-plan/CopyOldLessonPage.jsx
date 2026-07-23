// ====================================================================
// Module: Lesson Plan
// Page: Copy Old Lesson
//
// Purpose:
// List existing lesson plans and copy one to a new class/subject target.
//
// Data Source:
// lessonPlan.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  BookOpen,
  Copy,
  Eye,
  Search,
  FileText,
} from 'lucide-react'
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
  { key: 'status', label: 'Status' },
]

function LessonStatusBadge({ status }) {
  const map = { 'in-progress': 'pending', completed: 'active', pending: 'inactive' }
  return <StatusBadge status={map[status] || status} />
}

export default function CopyOldLessonPage() {
  const {
    rows, classes, subjects, stats, isLoading,
    search, setSearch, classFilter, setClassFilter,
    subjectFilter, setSubjectFilter, statusFilter, setStatusFilter,
    copyLesson,
  } = useLessonPlans()

  const [copyRow, setCopyRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)

  const handleCopy = async (payload) => {
    await copyLesson(copyRow._id, payload)
    setCopyRow(null)
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
    { label: 'Copy', icon: Copy, onClick: () => setCopyRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Lesson Plan' }, { label: 'Copy Old Lesson' }]} />
      <PageHeader
        title="Copy Old Lesson"
        description="Reuse an existing lesson plan by copying it to a new class or subject."
        icon={Copy}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Lessons" value={stats.total} icon={BookOpen} accent="primary" />
        <StatCard label="Completed" value={stats.completed} icon={FileText} accent="success" />
        <StatCard label="In Progress" value={stats.in_progress} icon={FileText} accent="warning" />
        <StatCard label="Pending" value={stats.pending} icon={FileText} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search lessons to copy…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="lesson-plans-copy" />
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
        <NoData title="No lessons found" description="No lesson plans are available to copy yet." />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="lesson-plans-copy"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Copy target drawer */}
      <CopyLessonDrawer
        open={!!copyRow}
        onOpenChange={(o) => !o && setCopyRow(null)}
        initial={copyRow}
        classes={classes}
        subjects={subjects}
        onSubmit={handleCopy}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Lesson Details"
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
    </div>
  )
}

// ─── Copy Lesson Drawer ────────────────────────────────────────────────────
function CopyLessonDrawer({ open, onOpenChange, initial, classes, subjects, onSubmit }) {
  const [form, setForm] = useState({
    class_id: '',
    class_name: '',
    subject_id: '',
    subject_name: '',
    lesson_name: initial?.lesson_name || '',
    topic: initial?.topic || '',
    description: initial?.description || '',
    status: 'pending',
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
      title="Copy Lesson"
      description={initial ? `Copying "${initial.lesson_name}"` : 'Copy lesson to a new target'}
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Copy Lesson"
          submitDisabled={!form.class_id || !form.subject_id || !form.lesson_name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Lesson Name <span className="text-destructive">*</span></Label>
            <Input value={form.lesson_name} onChange={(e) => set('lesson_name', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Target Class <span className="text-destructive">*</span></Label>
            <select value={form.class_id} onChange={(e) => handleClassChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select target class</option>
              {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Target Subject <span className="text-destructive">*</span></Label>
            <select value={form.subject_id} onChange={(e) => handleSubjectChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select target subject</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Topic</Label>
            <Input value={form.topic} onChange={(e) => set('topic', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
