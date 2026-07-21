// Approve Leave — admins review and act on pending staff leave applications.
// Shows a filterable table of all applications; admins can approve or reject inline.

import { useMemo, useState } from 'react'
import { CalendarCheck, Clock, CircleCheck as CheckCircle2, Circle as XCircle, Check, X, Eye, FileText, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { hrService } from '@/services/hr.service'
import { formatDate, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'staff_name', label: 'Staff Name' },
  { key: 'department', label: 'Department' },
  { key: 'leave_type', label: 'Leave Type' },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'days', label: 'Days' },
  { key: 'reason', label: 'Reason' },
  { key: 'status', label: 'Status' },
]

const STATUS_PILL = {
  pending: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', icon: Clock },
  approved: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', icon: CheckCircle2 },
  rejected: { bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20', icon: XCircle },
}

function LeaveStatusPill({ status }) {
  const s = STATUS_PILL[status] || STATUS_PILL.pending
  const Icon = s.icon
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', s.bg, s.text, s.border)}>
      <Icon className="h-3 w-3" />{status}
    </span>
  )
}

export default function ApproveLeaveHRPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => hrService.getLeaves(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('all')
  const [viewApp, setViewApp] = useState(null)

  const rows = data || []
  const deptOptions = useMemo(() => [...new Set(rows.map((r) => r.department).filter(Boolean))], [rows])

  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = !search ||
      r.staff_name.toLowerCase().includes(search.toLowerCase()) ||
      r.employee_id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchDept = deptFilter === 'all' || r.department === deptFilter
    return matchSearch && matchStatus && matchDept
  }), [rows, search, statusFilter, deptFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    approved: rows.filter((r) => r.status === 'approved').length,
    rejected: rows.filter((r) => r.status === 'rejected').length,
  }), [rows])

  const handleApprove = async (app) => {
    await hrService.approveLeave(app._id)
    toast({ title: 'Leave approved', description: `${app.staff_name}'s leave has been approved.` })
    refetch()
  }

  const handleReject = async (app) => {
    await hrService.rejectLeave(app._id)
    toast({ title: 'Leave rejected', description: `${app.staff_name}'s leave has been rejected.` })
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'staff_name',
      header: 'Staff Member',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewApp(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {initials(row.original.staff_name)}
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.staff_name}</p>
            <p className="text-xs text-muted-foreground">{row.original.department}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'leave_type', header: 'Leave Type', cell: ({ row }) => (
      <Badge variant="outline">{row.original.leave_type}</Badge>
    ) },
    { accessorKey: 'from', header: 'From', cell: ({ row }) => formatDate(row.original.from) },
    { accessorKey: 'to', header: 'To', cell: ({ row }) => formatDate(row.original.to) },
    { accessorKey: 'days', header: 'Days', cell: ({ row }) => (
      <span className="font-medium">{row.original.days} day{row.original.days > 1 ? 's' : ''}</span>
    ) },
    { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1 max-w-[180px]">{row.original.reason}</span>
    ) },
    { accessorKey: 'applied_on', header: 'Applied On', cell: ({ row }) => formatDate(row.original.applied_on) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <LeaveStatusPill status={row.original.status} /> },
  ], [])

  const rowActions = (app) => [
    { label: 'View Details', icon: Eye, onClick: () => setViewApp(app) },
    { label: 'Approve', icon: Check, onClick: () => handleApprove(app), disabled: app.status === 'approved' },
    { label: 'Reject', icon: X, variant: 'destructive', onClick: () => handleReject(app), disabled: app.status === 'rejected' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Approve Leave' }]} />
      <PageHeader
        title="Approve Leave"
        description="Review and approve or reject staff leave applications."
        icon={CalendarCheck}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={stats.total} icon={FileText} accent="primary" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warning" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="success" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or employee ID…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="leave-applications" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All departments</option>
            {deptOptions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={8} />
      ) : filtered.length === 0 ? (
        <NoData title="No leave applications" description="No pending or past leave applications found." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="leave-applications"
          bulkActions={[
            { label: 'Approve All', icon: Check, onClick: (sel) => sel.forEach((a) => handleApprove(a)) },
            { label: 'Reject All', icon: X, variant: 'destructive', onClick: (sel) => sel.forEach((a) => handleReject(a)) },
          ]}
          rowActions={(app) => <ActionDropdown actions={rowActions(app)} />}
        />
      )}

      {/* Leave Application Detail Drawer */}
      <Drawer
        open={!!viewApp}
        onOpenChange={(o) => !o && setViewApp(null)}
        title="Leave Application"
        description={viewApp ? `${viewApp.staff_name} · ${viewApp.leave_type}` : ''}
        width="sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewApp(null)}>Close</Button>
            {viewApp?.status === 'pending' && (
              <>
                <Button variant="outline" onClick={() => { handleReject(viewApp); setViewApp(null) }}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => { handleApprove(viewApp); setViewApp(null) }}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </>
            )}
          </>
        }
      >
        {viewApp && (
          <div className="space-y-6">
            {/* Applicant header */}
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {initials(viewApp.staff_name)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewApp.staff_name}</p>
                <p className="text-xs text-muted-foreground">{viewApp.employee_id} · {viewApp.department}</p>
              </div>
              <LeaveStatusPill status={viewApp.status} />
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                { label: 'Leave Type', value: <Badge variant="outline">{viewApp.leave_type}</Badge> },
                { label: 'Days Requested', value: `${viewApp.days} day${viewApp.days > 1 ? 's' : ''}` },
                { label: 'From', value: formatDate(viewApp.from) },
                { label: 'To', value: formatDate(viewApp.to) },
                { label: 'Applied On', value: formatDate(viewApp.applied_on) },
                { label: 'Status', value: <LeaveStatusPill status={viewApp.status} /> },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Reason</p>
              <p className="rounded-lg border bg-muted/20 p-3 text-sm">{viewApp.reason}</p>
            </div>

            {viewApp.attachment && (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-3">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{viewApp.attachment}</span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toast({ title: 'Opening attachment' })}>
                  View
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}
