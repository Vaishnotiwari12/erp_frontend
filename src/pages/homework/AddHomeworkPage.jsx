// ====================================================================
// Module: Homework
// Page: Add Homework
//
// Purpose:
// Manage homework assignments across classes, subjects, and teachers.
//
// Data Source:
// homework.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  BookOpen,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CalendarClock,
  ClipboardList,
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
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { StatusBadge } from '@/components/StatusBadge'
import { useHomeworks } from '@/hooks/useHomework'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'class_name', label: 'Class' },
  { key: 'subject_name', label: 'Subject' },
  { key: 'teacher_name', label: 'Teacher' },
  { key: 'homework_date', label: 'Homework Date' },
  { key: 'submission_date', label: 'Submission Date' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
]

export default function AddHomeworkPage() {
  const {
    rows, classes, subjects, teachers, stats, isLoading,
    search, setSearch, classFilter, setClassFilter,
    subjectFilter, setSubjectFilter, statusFilter, setStatusFilter,
    saveHomework, deleteHomework,
  } = useHomeworks()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveHomework(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'class_name',
      header: 'Class',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.class_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.subject_name}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'subject_name', header: 'Subject', cell: ({ row }) => <Badge variant="secondary">{row.original.subject_name}</Badge> },
    { accessorKey: 'teacher_name', header: 'Teacher' },
    { accessorKey: 'homework_date', header: 'Homework Date', cell: ({ row }) => formatDate(row.original.homework_date) },
    { accessorKey: 'submission_date', header: 'Submission Date', cell: ({ row }) => formatDate(row.original.submission_date) },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Homework' }, { label: 'Add Homework' }]} />
      <PageHeader
        title="Add Homework"
        description="Create and manage homework assignments across classes and subjects."
        icon={BookOpen}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Homework</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Homework" value={stats.total} icon={BookOpen} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={ClipboardList} accent="success" />
        <StatCard label="Inactive" value={stats.inactive} icon={CalendarClock} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by class, subject, teacher, or description…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="homework" />
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No homework found" description="Add a new homework assignment to get started." actionLabel="Add Homework" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="homework"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Homework Form Drawer used for both Add and Edit. */}
      <HomeworkFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Homework' : 'Add Homework'}
        initial={editRow}
        classes={classes}
        subjects={subjects}
        teachers={teachers}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Homework Details"
        description={viewRow?.class_name}
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
                <p className="font-semibold">{viewRow.class_name} · {viewRow.subject_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.teacher_name}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Homework Date', value: formatDate(viewRow.homework_date) },
                { label: 'Submission Date', value: formatDate(viewRow.submission_date) },
                { label: 'Attachment', value: viewRow.attachment || '—' },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
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
        entityName={deleteRow ? `${deleteRow.class_name} · ${deleteRow.subject_name}` : ''}
        onConfirm={() => deleteHomework(deleteRow._id)}
      />
    </div>
  )
}

// ─── Homework Form Drawer (shared by Add and Edit) ──────────────────────────
function HomeworkFormDrawer({ open, onOpenChange, title, initial, classes, subjects, teachers, onSubmit }) {
  const [form, setForm] = useState({
    class_id: initial?.class_id || '',
    class_name: initial?.class_name || '',
    subject_id: initial?.subject_id || '',
    subject_name: initial?.subject_name || '',
    teacher_id: initial?.teacher_id || '',
    teacher_name: initial?.teacher_name || '',
    homework_date: initial?.homework_date || '',
    submission_date: initial?.submission_date || '',
    description: initial?.description || '',
    attachment: initial?.attachment || '',
    status: initial?.status || 'active',
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

  const handleTeacherChange = (id) => {
    const t = teachers.find((x) => x._id === id)
    setForm((f) => ({ ...f, teacher_id: id, teacher_name: t?.name || '' }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Homework assignment information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Homework'}
          submitDisabled={!form.class_id || !form.subject_id || !form.teacher_id || !form.homework_date || !form.submission_date}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
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
            <Label className="text-xs">Teacher <span className="text-destructive">*</span></Label>
            <select value={form.teacher_id} onChange={(e) => handleTeacherChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select teacher</option>
              {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Homework Date <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.homework_date} onChange={(e) => set('homework_date', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Submission Date <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.submission_date} onChange={(e) => set('submission_date', e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Describe the homework assignment…"
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Attachment</Label>
            <Input value={form.attachment} onChange={(e) => set('attachment', e.target.value)} placeholder="File name or URL (optional)" />
          </div>
          <div className="space-y-1.5">
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
