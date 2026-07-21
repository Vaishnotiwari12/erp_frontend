import { useMemo, useState } from 'react'
import {
  CalendarCheck, Clock, CheckCircle2, XCircle, Check, X, Eye, FileText, Paperclip,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer } from '@/components/Drawer'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useAsyncData } from '@/hooks/useAsyncData'
import { attendanceService } from '@/services/attendance.service'
import { academicClasses, academicSections } from '@/services/mockData'
import { LEAVE_STATUS_OPTIONS } from '@/constants/navigation'
import { formatDate, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const CLASS_OPTIONS = academicClasses.map((c) => c.name)
const SECTION_OPTIONS = Array.from(new Set(academicSections.map((s) => s.name)))

const STAGE_STYLE = {
  pending: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', icon: Clock },
  approved: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', icon: CheckCircle2 },
  rejected: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20', icon: XCircle },
}

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'leave_type', label: 'Leave Type' },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'reason', label: 'Reason' },
  { key: 'applied_on', label: 'Applied On' },
  { key: 'status', label: 'Status' },
]

function LeaveStatusPill({ status }) {
  const s = STAGE_STYLE[status] || STAGE_STYLE.pending
  const Icon = s.icon
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', s.bg, s.text, s.border)}>
      <Icon className="h-3 w-3" />{status}
    </span>
  )
}

export default function ApproveLeavePage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => attendanceService.leaves(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [viewApp, setViewApp] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const ms = !search || r.student_name.toLowerCase().includes(search.toLowerCase()) || r.admission_no.toLowerCase().includes(search.toLowerCase())
      const mst = status === 'all' || r.status === status
      const msc = classFilter === 'all' || r.class === classFilter
      const mss = sectionFilter === 'all' || r.section === sectionFilter
      const mf = !fromDate || new Date(r.from) >= new Date(fromDate)
      const mt = !toDate || new Date(r.to) <= new Date(toDate)
      return ms && mst && msc && mss && mf && mt
    }),
    [rows, search, status, classFilter, sectionFilter, fromDate, toDate],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    approved: rows.filter((r) => r.status === 'approved').length,
    rejected: rows.filter((r) => r.status === 'rejected').length,
  }), [rows])

  const handleApprove = async (app) => {
    await attendanceService.updateLeave(app._id, 'approved')
    toast({ title: 'Leave approved', description: `${app.student_name}'s leave has been approved.` })
    refetch()
  }
  const handleReject = async (app) => {
    await attendanceService.updateLeave(app._id, 'rejected')
    toast({ title: 'Leave rejected', description: `${app.student_name}'s leave has been rejected.` })
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'student_name',
      header: 'Student',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewApp(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(row.original.student_name)}
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.student_name}</p>
            <p className="text-xs text-muted-foreground">{row.original.admission_no} · {row.original.class}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'leave_type', header: 'Leave Type', cell: ({ row }) => <Badge variant="outline" className="font-medium">{row.original.leave_type}</Badge> },
    { accessorKey: 'from', header: 'From', cell: ({ row }) => formatDate(row.original.from) },
    { accessorKey: 'to', header: 'To', cell: ({ row }) => formatDate(row.original.to) },
    { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">{row.original.reason}</span> },
    { accessorKey: 'applied_on', header: 'Applied On', cell: ({ row }) => formatDate(row.original.applied_on) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <LeaveStatusPill status={row.original.status} /> },
  ], [])

  const rowActions = (app) => [
    { label: 'View Application', icon: Eye, onClick: () => setViewApp(app) },
    { label: 'Approve', icon: Check, onClick: () => handleApprove(app), disabled: app.status === 'approved' },
    { label: 'Reject', icon: X, variant: 'destructive', onClick: () => handleReject(app), disabled: app.status === 'rejected' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Attendance', to: '/attendance' }, { label: 'Approve Leave' }]} />
      <PageHeader
        title="Approve Leave"
        description="Review and approve student leave applications."
        icon={CalendarCheck}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={stats.total} icon={FileText} accent="primary" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warning" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="success" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student or admission no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="leave-applications" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            {LEAVE_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All classes</option>
            {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All sections</option>
            {SECTION_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" aria-label="From date" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" aria-label="To date" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No leave applications found" description="Try adjusting your filters or date range." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="leave-applications"
          bulkActions={[
            { label: 'Approve', icon: Check, onClick: (sel) => { sel.forEach((a) => handleApprove(a)) } },
            { label: 'Reject', icon: X, variant: 'destructive', onClick: (sel) => { sel.forEach((a) => handleReject(a)) } },
          ]}
          rowActions={(app) => <ActionDropdown actions={rowActions(app)} />}
        />
      )}

      <Drawer
        open={!!viewApp}
        onOpenChange={(o) => !o && setViewApp(null)}
        title="Leave Application"
        description={viewApp ? `${viewApp.student_name} · ${viewApp.leave_type}` : ''}
        width="sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewApp(null)}>Close</Button>
            {viewApp?.status === 'pending' ? (
              <>
                <Button variant="outline" onClick={() => { handleReject(viewApp); setViewApp(null) }}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => { handleApprove(viewApp); setViewApp(null) }}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </>
            ) : null}
          </>
        }
      >
        {viewApp ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {initials(viewApp.student_name)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewApp.student_name}</p>
                <p className="text-xs text-muted-foreground">{viewApp.admission_no} · {viewApp.class} · Section {viewApp.section}</p>
              </div>
              <LeaveStatusPill status={viewApp.status} />
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                { label: 'Leave Type', value: <Badge variant="outline">{viewApp.leave_type}</Badge> },
                { label: 'From', value: formatDate(viewApp.from) },
                { label: 'To', value: formatDate(viewApp.to) },
                { label: 'Applied On', value: formatDate(viewApp.applied_on) },
                { label: 'Guardian', value: viewApp.guardian },
                { label: 'Status', value: <LeaveStatusPill status={viewApp.status} /> },
              ].map((r) => (
                <div key={r.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                  <dd className="text-sm font-medium">{r.value}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Reason</p>
              <p className="rounded-lg border bg-muted/20 p-3 text-sm">{viewApp.reason}</p>
            </div>

            {viewApp.attachment ? (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-3">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{viewApp.attachment}</span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toast({ title: 'Opening attachment' })}>View</Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
