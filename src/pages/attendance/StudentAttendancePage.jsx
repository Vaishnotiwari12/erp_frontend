// ====================================================================
// Module: Attendance
// Page: Student Attendance
//
// Purpose:
// Mark and track daily student attendance across classes.
//
// Data Source:
// attendance.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ClipboardCheck, Users, CircleCheck as CheckCircle2, Circle as XCircle, Clock3, CalendarClock, Check, X, CalendarPlus, Eye, Pencil, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { useStudentAttendance } from '@/hooks/useAttendance'
import { academicClasses, academicSections, ATTENDANCE_STATUS } from '@/services/mockData'
import { fullName, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const CLASS_OPTIONS = academicClasses.map((c) => c.name)
const SECTION_OPTIONS = Array.from(new Set(academicSections.map((s) => s.name)))
const STATUS_OPTIONS = Object.entries(ATTENDANCE_STATUS).map(([value, s]) => ({ value, label: s.label }))

const EXPORT_COLS = [
  { key: 'name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'section', label: 'Section' },
  { key: 'status', label: 'Status' },
  { key: 'check_in', label: 'Check-in' },
  { key: 'remarks', label: 'Remarks' },
]

function StatusPill({ status }) {
  const s = ATTENDANCE_STATUS[status] || ATTENDANCE_STATUS.present
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', s.bg, s.text, s.border)}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  )
}

export default function StudentAttendancePage() {
  const { toast } = useToast()
  const {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    markStatus,
    bulkMark,
    updateAttendance,
  } = useStudentAttendance()
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Student',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(row.original.name)}
          </div>
          <div>
            <p className="font-medium hover:underline">{fullName(row.original.name)}</p>
            <p className="text-xs text-muted-foreground">{row.original.admission_no}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'section', header: 'Section' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusPill status={row.original.status} /> },
    { accessorKey: 'check_in', header: 'Check-in', cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-sm"><Clock3 className="h-3.5 w-3.5 text-muted-foreground" />{row.original.check_in}</span>
    ) },
    { accessorKey: 'remarks', header: 'Remarks', cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.remarks || '—'}</span> },
  ], [])

  const rowActions = (r) => [
    { label: 'Mark Present', icon: Check, onClick: () => markStatus(r, 'present') },
    { label: 'Mark Absent', icon: X, onClick: () => markStatus(r, 'absent') },
    { label: 'Mark Leave', icon: CalendarPlus, onClick: () => markStatus(r, 'leave') },
    { label: 'Mark Late', icon: Clock3, onClick: () => markStatus(r, 'late') },
    { separator: true },
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Attendance' }]} />
      <PageHeader
        title="Student Attendance"
        description="Mark and track daily student attendance across classes."
        icon={ClipboardCheck}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Students" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Present" value={stats.present} icon={CheckCircle2} accent="success" />
        <StatCard label="Absent" value={stats.absent} icon={XCircle} accent="destructive" />
        <StatCard label="Leave" value={stats.leave} icon={CalendarPlus} accent="warning" />
        <StatCard label="Late" value={stats.late} icon={Clock3} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or admission no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="student-attendance" />
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All classes</option>
            {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All sections</option>
            {SECTION_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-9 w-auto rounded-md border border-input bg-background px-3 text-sm shadow-sm" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={8} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No attendance records found" description="Try adjusting your filters or date." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="student-attendance"
          bulkActions={[
            { label: 'Mark Present', icon: Check, onClick: (sel) => bulkMark(sel, 'present') },
            { label: 'Mark Absent', icon: X, variant: 'destructive', onClick: (sel) => bulkMark(sel, 'absent') },
          ]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <EditDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} initial={editRow} onSubmit={async (p) => { await updateAttendance(editRow._id, p); setEditRow(null) }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Attendance Details" description={viewRow ? fullName(viewRow.name) : ''} width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Student', value: fullName(viewRow.name) },
              { label: 'Admission No', value: viewRow.admission_no },
              { label: 'Class', value: viewRow.class },
              { label: 'Section', value: viewRow.section },
              { label: 'Status', value: <StatusPill status={viewRow.status} /> },
              { label: 'Check-in Time', value: viewRow.check_in },
              { label: 'Date', value: viewRow.date },
              { label: 'Marked By', value: viewRow.marked_by },
              { label: 'Remarks', value: viewRow.remarks || '—' },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>
    </div>
  )
}

function EditDrawer({ open, onOpenChange, initial, onSubmit }) {
  const [form, setForm] = useState({
    status: initial?.status || 'present',
    check_in: initial?.check_in || '',
    remarks: initial?.remarks || '',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Edit Attendance" description={initial ? fullName(initial.name) : ''} width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel="Save" onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Attendance Status</Label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Check-in Time</Label>
            <Input type="time" value={form.check_in === '—' ? '' : form.check_in} onChange={(e) => setForm((f) => ({ ...f, check_in: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Remarks</Label>
            <Textarea value={form.remarks} onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))} rows={3} placeholder="Optional remarks" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
