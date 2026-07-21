// Staff Attendance — mark and review daily attendance for all staff.
// Mirrors the student attendance pattern: per-day marking, bulk actions, calendar picker.

import { useMemo, useState } from 'react'
import { ClipboardCheck, Users, CircleCheck as CheckCircle2, Circle as XCircle, Clock3, CalendarPlus, Check, X, Eye, Pencil, Download, Printer } from 'lucide-react'
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
import { useAsyncData } from '@/hooks/useAsyncData'
import { hrService } from '@/services/hr.service'
import { initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'employee_id', label: 'Employee ID' },
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'status', label: 'Status' },
  { key: 'check_in', label: 'Check-in' },
  { key: 'check_out', label: 'Check-out' },
  { key: 'working_hours', label: 'Working Hours' },
  { key: 'remarks', label: 'Remarks' },
]

// Map each attendance status to Tailwind styles for the pill
const STATUS_STYLES = {
  present: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
  absent: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
  leave: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  late: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
}

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.present
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', s.bg, s.text, s.border)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default function StaffAttendancePage() {
  const { toast } = useToast()
  const todayStr = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(todayStr)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)

  // Fetch attendance for the selected date
  const { data, isLoading, refetch } = useAsyncData(
    () => hrService.getAttendanceByDate(date),
    [date],
  )

  const rows = data || []

  const deptOptions = useMemo(() => [...new Set(rows.map((r) => r.department))], [rows])

  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.employee_id.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'all' || r.department === deptFilter
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchDept && matchStatus
  }), [rows, search, deptFilter, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    present: rows.filter((r) => r.status === 'present').length,
    absent: rows.filter((r) => r.status === 'absent').length,
    late: rows.filter((r) => r.status === 'late').length,
    leave: rows.filter((r) => r.status === 'leave').length,
  }), [rows])

  // Mark a single employee's attendance status
  const markStatus = async (row, status) => {
    await hrService.markAttendance(row._id, status)
    toast({ title: 'Attendance marked', description: `${row.name} marked ${status}.` })
    refetch()
  }

  // Bulk mark multiple employees at once
  const bulkMark = async (selected, status) => {
    await hrService.bulkMarkAttendance(selected.map((r) => r._id), status)
    toast({ title: `${selected.length} staff marked ${status}` })
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Staff Member',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {initials(row.original.name)}
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.employee_id}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'designation', header: 'Designation' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusPill status={row.original.status} /> },
    { accessorKey: 'check_in', header: 'Check-in', cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-sm"><Clock3 className="h-3.5 w-3.5 text-muted-foreground" />{row.original.check_in}</span>
    ) },
    { accessorKey: 'check_out', header: 'Check-out', cell: ({ row }) => (
      <span className="text-sm">{row.original.check_out || '—'}</span>
    ) },
    { accessorKey: 'working_hours', header: 'Hours', cell: ({ row }) => (
      <span className="text-sm">{row.original.working_hours || '—'}</span>
    ) },
    { accessorKey: 'remarks', header: 'Remarks', cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.remarks || '—'}</span>
    ) },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Staff Attendance' }]} />
      <PageHeader
        title="Staff Attendance"
        description="Mark and track daily staff attendance across all departments."
        icon={ClipboardCheck}
        actions={<Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>}
      />

      {/* Quick stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Staff" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Present" value={stats.present} icon={CheckCircle2} accent="success" />
        <StatCard label="Absent" value={stats.absent} icon={XCircle} accent="destructive" />
        <StatCard label="Leave" value={stats.leave} icon={CalendarPlus} accent="warning" />
        <StatCard label="Late" value={stats.late} icon={Clock3} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or employee ID…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename={`staff-attendance-${date}`} />
          {/* Date picker — changing date triggers re-fetch */}
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 w-auto" />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All departments</option>
            {deptOptions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="leave">Leave</option>
            <option value="late">Late</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={8} cols={8} />
      ) : filtered.length === 0 ? (
        <NoData title="No attendance records" description="No staff records found for the selected date and filters." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          bulkActions={[
            { label: 'Mark Present', icon: Check, onClick: (sel) => bulkMark(sel, 'present') },
            { label: 'Mark Absent', icon: X, variant: 'destructive', onClick: (sel) => bulkMark(sel, 'absent') },
          ]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Edit Attendance Drawer */}
      <Drawer
        open={!!editRow}
        onOpenChange={(o) => !o && setEditRow(null)}
        title="Edit Attendance"
        description={editRow?.name}
        width="sm:max-w-md"
        footer={<DrawerFooter onCancel={() => setEditRow(null)} submitLabel="Save" onSubmit={async () => {
          await hrService.markAttendance(editRow._id, editRow.status)
          toast({ title: 'Attendance updated' })
          setEditRow(null)
          refetch()
        }} />}
      >
        {editRow && (
          <form className="space-y-4">
            <FormSection columns={2}>
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <select value={editRow.status}
                  onChange={(e) => setEditRow((r) => ({ ...r, status: e.target.value }))}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="leave">Leave</option>
                  <option value="late">Late</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Check-in Time</Label>
                <Input type="time" value={editRow.check_in === '—' ? '' : editRow.check_in}
                  onChange={(e) => setEditRow((r) => ({ ...r, check_in: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Check-out Time</Label>
                <Input type="time" value={editRow.check_out || ''}
                  onChange={(e) => setEditRow((r) => ({ ...r, check_out: e.target.value }))} />
              </div>
            </FormSection>
            <div className="space-y-1.5">
              <Label className="text-xs">Remarks</Label>
              <Textarea value={editRow.remarks || ''}
                onChange={(e) => setEditRow((r) => ({ ...r, remarks: e.target.value }))}
                rows={2} placeholder="Optional remarks" />
            </div>
          </form>
        )}
      </Drawer>

      {/* View Details Drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Attendance Details"
        description={viewRow?.name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Employee', value: viewRow.name },
              { label: 'Employee ID', value: viewRow.employee_id },
              { label: 'Department', value: viewRow.department },
              { label: 'Designation', value: viewRow.designation },
              { label: 'Date', value: date },
              { label: 'Status', value: <StatusPill status={viewRow.status} /> },
              { label: 'Check-in', value: viewRow.check_in },
              { label: 'Check-out', value: viewRow.check_out || '—' },
              { label: 'Working Hours', value: viewRow.working_hours || '—' },
              { label: 'Remarks', value: viewRow.remarks || '—' },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Drawer>
    </div>
  )
}
