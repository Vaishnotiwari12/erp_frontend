// ====================================================================
// Module: Homework
// Page: Daily Assignment
//
// Purpose:
// Manage daily student assignments tracked per teacher and class.
//
// Data Source:
// homework.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ClipboardList, Plus, Eye, Pencil, Trash2, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle } from 'lucide-react'
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
import { useDailyAssignments } from '@/hooks/useHomework'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'teacher_name', label: 'Teacher' },
  { key: 'class_name', label: 'Class' },
  { key: 'section', label: 'Section' },
  { key: 'date', label: 'Date' },
  { key: 'task', label: 'Task' },
  { key: 'status', label: 'Status' },
]

// Maps assignment status to a StatusBadge-compatible value.
function AssignmentStatusBadge({ status }) {
  const map = { pending: 'pending', completed: 'active', overdue: 'suspended' }
  return <StatusBadge status={map[status] || status} />
}

export default function DailyAssignmentPage() {
  const {
    rows, stats, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    saveAssignment, deleteAssignment,
  } = useDailyAssignments()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveAssignment(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'student_name',
      header: 'Student',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.student_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.class_name} · {row.original.section}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'teacher_name', header: 'Teacher' },
    { accessorKey: 'class_name', header: 'Class', cell: ({ row }) => <Badge variant="secondary">{row.original.class_name}</Badge> },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: 'task', header: 'Task', cell: ({ row }) => <span className="line-clamp-1 max-w-xs">{row.original.task}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <AssignmentStatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Homework' }, { label: 'Daily Assignment' }]} />
      <PageHeader
        title="Daily Assignment"
        description="Track daily student assignments and their completion status."
        icon={ClipboardList}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Assignment</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Assignments" value={stats.total} icon={ClipboardList} accent="primary" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warning" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} accent="success" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertCircle} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student, teacher, task, or class…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="daily-assignments" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No assignments found" description="Add a new daily assignment to get started." actionLabel="Add Assignment" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="daily-assignments"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Assignment Form Drawer used for both Add and Edit. */}
      <AssignmentFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Assignment' : 'Add Assignment'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Assignment Details"
        description={viewRow?.student_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.student_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.class_name} · Section {viewRow.section}</p>
              </div>
              <AssignmentStatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Teacher', value: viewRow.teacher_name },
                { label: 'Date', value: formatDate(viewRow.date) },
                { label: 'Section', value: viewRow.section },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">Task</dt>
              <dd className="text-sm">{viewRow.task || '—'}</dd>
            </div>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.student_name}
        onConfirm={() => deleteAssignment(deleteRow._id)}
      />
    </div>
  )
}

// ─── Assignment Form Drawer (shared by Add and Edit) ────────────────────────
function AssignmentFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    student_name: initial?.student_name || '',
    teacher_name: initial?.teacher_name || '',
    class_name: initial?.class_name || '',
    section: initial?.section || '',
    date: initial?.date || '',
    task: initial?.task || '',
    status: initial?.status || 'pending',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Daily assignment information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Assignment'}
          submitDisabled={!form.student_name.trim() || !form.task.trim() || !form.date}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Student Name <span className="text-destructive">*</span></Label>
              <Input value={form.student_name} onChange={(e) => set('student_name', e.target.value)} placeholder="e.g. Aarav Sharma" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Teacher Name</Label>
              <Input value={form.teacher_name} onChange={(e) => set('teacher_name', e.target.value)} placeholder="e.g. Hannah Kim" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Class</Label>
              <Input value={form.class_name} onChange={(e) => set('class_name', e.target.value)} placeholder="e.g. Class 10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Section</Label>
              <Input value={form.section} onChange={(e) => set('section', e.target.value)} placeholder="e.g. A" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Date <span className="text-destructive">*</span></Label>
            <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Task <span className="text-destructive">*</span></Label>
            <textarea value={form.task} onChange={(e) => set('task', e.target.value)}
              placeholder="Describe the assignment task…"
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
