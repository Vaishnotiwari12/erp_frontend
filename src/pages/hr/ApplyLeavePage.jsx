// Apply Leave — a staff member submits their own leave application.
// Shows current leave balances up top, a form to apply, and a
// history table of the logged-in user's past applications.

import { useMemo, useState } from 'react'
import { CalendarPlus, Paperclip, Send, Eye, Clock, CircleCheck as CheckCircle2, Circle as XCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hrService } from '@/services/hr.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Map leave-balance keys to human-readable names so the UI stays friendly.
const BALANCE_LABELS = {
  sick_leave: 'Sick Leave',
  casual_leave: 'Casual Leave',
  earned_leave: 'Earned Leave',
  emergency_leave: 'Emergency Leave',
}

// Reused by both the table and the detail drawer so status pills stay consistent.
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

export default function ApplyLeavePage() {
  const { toast } = useToast()
  // Leave balance and the full leave list are fetched once on mount.
  const { data: balanceData, isLoading: balanceLoading } = useAsyncData(() => hrService.getLeaveBalance(), [])
  const { data: leavesData, isLoading: leavesLoading, refetch } = useAsyncData(() => hrService.getLeaves(), [])
  const [viewApp, setViewApp] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const balance = balanceData || {}
  const allLeaves = leavesData || []

  // In a real app this would filter by the logged-in user's employee_id.
  // For the mock we show all applications so the page is demoable.
  const myLeaves = useMemo(() => allLeaves, [allLeaves])

  const stats = useMemo(() => ({
    total: myLeaves.length,
    pending: myLeaves.filter((l) => l.status === 'pending').length,
    approved: myLeaves.filter((l) => l.status === 'approved').length,
    rejected: myLeaves.filter((l) => l.status === 'rejected').length,
  }), [myLeaves])

  const columns = useMemo(() => [
    { accessorKey: 'leave_type', header: 'Leave Type', cell: ({ row }) => (
      <Badge variant="outline">{row.original.leave_type}</Badge>
    ) },
    { accessorKey: 'from', header: 'From', cell: ({ row }) => formatDate(row.original.from) },
    { accessorKey: 'to', header: 'To', cell: ({ row }) => formatDate(row.original.to) },
    { accessorKey: 'days', header: 'Days', cell: ({ row }) => (
      <span className="font-medium">{row.original.days} day{row.original.days > 1 ? 's' : ''}</span>
    ) },
    { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1 max-w-[220px]">{row.original.reason}</span>
    ) },
    { accessorKey: 'applied_on', header: 'Applied On', cell: ({ row }) => formatDate(row.original.applied_on) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <LeaveStatusPill status={row.original.status} /> },
  ], [])

  const rowActions = (app) => [
    { label: 'View Details', icon: Eye, onClick: () => setViewApp(app) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Apply Leave' }]} />
      <PageHeader
        title="Apply Leave"
        description="Submit a leave application and track its approval status."
        icon={CalendarPlus}
      />

      {/* Leave balance cards — the staff member sees what they have left. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {balanceLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl border bg-muted/20 animate-pulse" />
          ))
        ) : (
          Object.entries(balance).map(([key, val]) => (
            <StatCard
              key={key}
              label={BALANCE_LABELS[key] || key}
              value={val.remaining}
              suffix={`of ${val.total} days`}
              icon={CalendarPlus}
              accent="primary"
            />
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Application form — left column on large screens. */}
        <div className="lg:col-span-1">
          <ApplyLeaveForm
            balance={balance}
            submitting={submitting}
            onSubmit={async (payload) => {
              setSubmitting(true)
              try {
                await hrService.applyLeave(payload)
                toast({ title: 'Leave application submitted', description: 'Your request has been sent for approval.' })
                refetch()
              } catch {
                toast({ title: 'Submission failed', description: 'Please try again.', variant: 'destructive' })
              } finally {
                setSubmitting(false)
              }
            }}
          />
        </div>

        {/* History table — right column, wider. */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total" value={stats.total} icon={FileText} accent="primary" />
            <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warning" />
            <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="success" />
            <StatCard label="Rejected" value={stats.rejected} icon={XCircle} accent="destructive" />
          </div>

          {leavesLoading ? (
            <LoadingSkeleton variant="table" rows={5} cols={7} />
          ) : myLeaves.length === 0 ? (
            <NoData title="No applications yet" description="Your submitted leave applications will appear here." />
          ) : (
            <DataTable
              columns={columns}
              data={myLeaves}
              rowActions={(app) => <ActionDropdown actions={rowActions(app)} />}
            />
          )}
        </div>
      </div>

      {/* Detail drawer for viewing a past application. */}
      <Drawer
        open={!!viewApp}
        onOpenChange={(o) => !o && setViewApp(null)}
        title="Leave Application"
        description={viewApp ? `${viewApp.leave_type}` : ''}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewApp(null)}>Close</Button>}
      >
        {viewApp && (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Leave Type', value: <Badge variant="outline">{viewApp.leave_type}</Badge> },
              { label: 'Days', value: `${viewApp.days} day${viewApp.days > 1 ? 's' : ''}` },
              { label: 'From', value: formatDate(viewApp.from) },
              { label: 'To', value: formatDate(viewApp.to) },
              { label: 'Applied On', value: formatDate(viewApp.applied_on) },
              { label: 'Status', value: <LeaveStatusPill status={viewApp.status} /> },
              { label: 'Approved By', value: viewApp.approved_by || '—' },
              { label: 'Attachment', value: viewApp.attachment ? (
                <span className="inline-flex items-center gap-1.5 text-sm"><Paperclip className="h-3.5 w-3.5" />{viewApp.attachment}</span>
              ) : '—' },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {viewApp?.reason && (
          <div className="mt-4 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Reason</p>
            <p className="rounded-lg border bg-muted/20 p-3 text-sm">{viewApp.reason}</p>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// Self-contained form component. Keeps local state for the fields so the
// parent stays clean; calls onSubmit with a shaped payload on submit.
function ApplyLeaveForm({ balance, submitting, onSubmit }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    leave_type: 'Sick Leave',
    from: today,
    to: today,
    reason: '',
    attachment: '',
  })
  const [error, setError] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Compute the number of working days between from and to (inclusive).
  // Simple day diff + 1 — good enough for the mock UI; the backend will
  // do the real calculation accounting for holidays and weekends.
  const days = useMemo(() => {
    const a = new Date(form.from)
    const b = new Date(form.to)
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) return 0
    return Math.round((b - a) / 86400000) + 1
  }, [form.from, form.to])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.reason.trim()) {
      setError('Please provide a reason for your leave.')
      return
    }
    if (days <= 0) {
      setError('The "To" date must be on or after the "From" date.')
      return
    }
    setError('')
    onSubmit({
      leave_type: form.leave_type,
      from: form.from,
      to: form.to,
      days,
      reason: form.reason.trim(),
      attachment: form.attachment || null,
    })
    setForm({ leave_type: 'Sick Leave', from: today, to: today, reason: '', attachment: '' })
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CalendarPlus className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold">New Application</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Leave Type <span className="text-destructive">*</span></Label>
            <select
              value={form.leave_type}
              onChange={(e) => set('leave_type', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {Object.entries(balance).map(([key, val]) => (
                <option key={key} value={BALANCE_LABELS[key] || key}>
                  {BALANCE_LABELS[key] || key} ({val.remaining} days left)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">From <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.from} onChange={(e) => set('from', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.to} min={form.from} onChange={(e) => set('to', e.target.value)} required />
            </div>
          </div>

          {days > 0 && (
            <p className="text-xs text-muted-foreground">
              Duration: <span className="font-medium text-foreground">{days} day{days > 1 ? 's' : ''}</span>
            </p>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Reason <span className="text-destructive">*</span></Label>
            <Textarea
              value={form.reason}
              onChange={(e) => set('reason', e.target.value)}
              rows={3}
              placeholder="Briefly describe the reason for your leave…"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Attachment (optional)</Label>
            <Input
              value={form.attachment}
              onChange={(e) => set('attachment', e.target.value)}
              placeholder="e.g. medical-cert.pdf"
            />
          </div>
        </FormSection>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DrawerFooter
          onCancel={() => setForm({ leave_type: 'Sick Leave', from: today, to: today, reason: '', attachment: '' })}
          submitLabel={submitting ? 'Submitting…' : 'Submit Application'}
          onSubmit={handleSubmit}
          submitIcon={Send}
        />
      </form>
    </div>
  )
}
