// ====================================================================
// Module: Academics
// Page: Assign Class Teacher
//
// Purpose:
// Assign teachers to classes and sections for the academic year.
//
// Data Source:
// academics.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Plus, UserCog, Pencil, Trash2, Eye, CircleCheck as CheckCircle2, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { academicClasses, academicSections, teachers, ACADEMIC_YEARS } from '@/services/mockData'
import { formatDate, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'teacher', label: 'Teacher' },
  { key: 'class', label: 'Class' },
  { key: 'section', label: 'Section' },
  { key: 'academic_year', label: 'Academic Year' },
  { key: 'status', label: 'Status' },
]

const CLASS_OPTIONS = academicClasses.map((c) => c.name)
const SECTION_OPTIONS = Array.from(new Set(academicSections.map((s) => s.name)))
const TEACHER_OPTIONS = teachers

export default function AssignClassTeacherPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.classTeachers(), [])
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
      const ms = !search || r.teacher.toLowerCase().includes(search.toLowerCase()) || r.class.toLowerCase().includes(search.toLowerCase())
      const mst = status === 'all' || r.status === status
      const msc = classFilter === 'all' || r.class === classFilter
      return ms && mst && msc
    }),
    [rows, search, status, classFilter],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    teachers: new Set(rows.map((r) => r.teacher)).size,
    inactive: rows.filter((r) => r.status !== 'active').length,
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'teacher',
      header: 'Teacher',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(row.original.teacher)}
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.teacher}</p>
            <p className="text-xs text-muted-foreground">{TEACHER_OPTIONS.find((t) => t.name === row.original.teacher)?.department || '—'}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'class', header: 'Assigned Class' },
    { accessorKey: 'section', header: 'Section' },
    { accessorKey: 'academic_year', header: 'Academic Year' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'createdAt', header: 'Assigned On', cell: ({ row }) => formatDate(row.original.createdAt) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Remove', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Academics', to: '/academics/classes' }, { label: 'Assign Class Teacher' }]} />
      <PageHeader
        title="Assign Class Teacher"
        description="Assign teachers to classes and sections for the academic year."
        icon={UserCog}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Assign Teacher</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Assignments" value={stats.total} icon={UserCog} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Teachers Assigned" value={stats.teachers} icon={GraduationCap} accent="chart2" />
        <StatCard label="Inactive" value={stats.inactive} icon={UserCog} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by teacher or class…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="class-teachers" />
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
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No assignments found" actionLabel="Assign Teacher" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="class-teachers"
          bulkActions={[{ label: 'Remove', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Assignments removed' }); refetch() } }]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <AssignDrawer open={addOpen} onOpenChange={setAddOpen} title="Assign Class Teacher" onSubmit={async (p) => { await academicsService.createClassTeacher(p); toast({ title: 'Teacher assigned', description: `${p.teacher} → ${p.class} ${p.section}` }); setAddOpen(false); refetch() }} />
      <AssignDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Assignment" initial={editRow} onSubmit={async (p) => { await academicsService.update(editRow._id, p); toast({ title: 'Assignment updated' }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Assignment Details" description={viewRow?.teacher} width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Teacher', value: viewRow.teacher },
              { label: 'Department', value: TEACHER_OPTIONS.find((t) => t.name === viewRow.teacher)?.department || '—' },
              { label: 'Class', value: viewRow.class },
              { label: 'Section', value: viewRow.section },
              { label: 'Academic Year', value: viewRow.academic_year },
              { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
              { label: 'Assigned On', value: formatDate(viewRow.createdAt) },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow ? `${deleteRow.teacher} — ${deleteRow.class} ${deleteRow.section}` : ''}
        onConfirm={() => { toast({ title: 'Assignment removed' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function AssignDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    teacher: initial?.teacher || '',
    class: initial?.class || '',
    section: initial?.section || '',
    academic_year: initial?.academic_year || ACADEMIC_YEARS[0],
    status: initial?.status || 'active',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Assignment details" width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Assign'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Teacher <span className="text-destructive">*</span></Label>
            <select value={form.teacher} onChange={(e) => setForm((f) => ({ ...f, teacher: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" required>
              <option value="">Select teacher</option>
              {TEACHER_OPTIONS.map((t) => <option key={t._id} value={t.name}>{t.name} — {t.department}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Class <span className="text-destructive">*</span></Label>
              <select value={form.class} onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" required>
                <option value="">Select class</option>
                {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Section <span className="text-destructive">*</span></Label>
              <select value={form.section} onChange={(e) => setForm((f) => ({ ...f, section: e.target.value }))}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" required>
                <option value="">Select section</option>
                {SECTION_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Academic Year</Label>
            <select value={form.academic_year} onChange={(e) => setForm((f) => ({ ...f, academic_year: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
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
