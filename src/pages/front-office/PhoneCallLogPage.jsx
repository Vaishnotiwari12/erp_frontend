// Phone Call Log — records all incoming and outgoing calls at the front desk.
// Each call has a type (incoming/outgoing), purpose, and resolution status.

import { useMemo, useState } from 'react'
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Eye,
  Pencil,
  Trash2,
  Clock,
  CircleCheck as CheckCircle2,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { useAsyncData } from '@/hooks/useAsyncData'
import { frontOfficeService } from '@/services/frontOffice.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'caller_name', label: 'Caller' },
  { key: 'phone', label: 'Phone' },
  { key: 'call_type', label: 'Type' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'duration', label: 'Duration' },
  { key: 'call_date', label: 'Date' },
  { key: 'attended_by', label: 'Attended By' },
  { key: 'status', label: 'Status' },
  { key: 'notes', label: 'Notes' },
]

const STATUS_STYLES = {
  resolved: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
}

function CallStatusPill({ status }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_STYLES[status] || STATUS_STYLES.pending)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

// Small badge showing whether the call was incoming or outgoing, with an icon.
function CallTypeBadge({ type }) {
  const isIncoming = type === 'incoming'
  return (
    <Badge variant={isIncoming ? 'default' : 'secondary'} className="capitalize">
      {isIncoming ? <ArrowDownLeft className="mr-1 h-3 w-3" /> : <ArrowUpRight className="mr-1 h-3 w-3" />}
      {type}
    </Badge>
  )
}

export default function PhoneCallLogPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontOfficeService.getCallLogs(), [])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [purposeFilter, setPurposeFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.caller_name.toLowerCase().includes(q) || r.phone.includes(q) || r.attended_by.toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || r.call_type === typeFilter
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchPurpose = purposeFilter === 'all' || r.purpose === purposeFilter
    return matchSearch && matchType && matchStatus && matchPurpose
  }), [rows, search, typeFilter, statusFilter, purposeFilter])

  const purposeOptions = useMemo(() => [...new Set(rows.map((r) => r.purpose).filter(Boolean))], [rows])

  const stats = useMemo(() => ({
    total: rows.length,
    incoming: rows.filter((r) => r.call_type === 'incoming').length,
    outgoing: rows.filter((r) => r.call_type === 'outgoing').length,
    pending: rows.filter((r) => r.status === 'pending').length,
  }), [rows])

  const handleSave = async (payload, id) => {
    if (id) {
      await frontOfficeService.updateCallLog(id, payload)
      toast({ title: 'Call log updated' })
      setEditRow(null)
    } else {
      await frontOfficeService.createCallLog(payload)
      toast({ title: 'Call logged' })
      setAddOpen(false)
    }
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'caller_name',
      header: 'Caller',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.caller_name}</span>
          <span className="text-xs text-muted-foreground">{row.original.phone}</span>
        </button>
      ),
    },
    { accessorKey: 'call_type', header: 'Type', cell: ({ row }) => <CallTypeBadge type={row.original.call_type} /> },
    { accessorKey: 'purpose', header: 'Purpose', cell: ({ row }) => <Badge variant="outline">{row.original.purpose}</Badge> },
    { accessorKey: 'duration', header: 'Duration' },
    { accessorKey: 'call_date', header: 'Date', cell: ({ row }) => formatDate(row.original.call_date) },
    { accessorKey: 'attended_by', header: 'Attended By' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <CallStatusPill status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front Office' }, { label: 'Phone Call Log' }]} />
      <PageHeader
        title="Phone Call Log"
        description="Record incoming and outgoing calls at the front desk."
        icon={PhoneCall}
        actions={<Button onClick={() => setAddOpen(true)}><PhoneCall className="mr-2 h-4 w-4" /> Log Call</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Calls" value={stats.total} icon={PhoneCall} accent="primary" />
        <StatCard label="Incoming" value={stats.incoming} icon={PhoneIncoming} accent="chart2" />
        <StatCard label="Outgoing" value={stats.outgoing} icon={PhoneOutgoing} accent="chart3" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by caller, phone, or attended by…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="phone-call-log" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All types</option>
            <option value="incoming">Incoming</option>
            <option value="outgoing">Outgoing</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={purposeFilter} onChange={(e) => setPurposeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All purposes</option>
            {purposeOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No call logs found" description="Log a new call to get started." actionLabel="Log Call" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="phone-call-log"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <CallLogFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Call Log' : 'Log New Call'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Call Details"
        description={viewRow?.caller_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                {viewRow.call_type === 'incoming' ? <PhoneIncoming className="h-5 w-5" /> : <PhoneOutgoing className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.caller_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.phone}</p>
              </div>
              <CallStatusPill status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Call Type', value: <CallTypeBadge type={viewRow.call_type} /> },
                { label: 'Purpose', value: <Badge variant="outline">{viewRow.purpose}</Badge> },
                { label: 'Duration', value: viewRow.duration },
                { label: 'Date & Time', value: formatDate(viewRow.call_date) },
                { label: 'Attended By', value: viewRow.attended_by },
                { label: 'Status', value: <CallStatusPill status={viewRow.status} /> },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            {viewRow.notes && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Notes</p>
                <p className="rounded-lg border bg-muted/20 p-3 text-sm">{viewRow.notes}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.caller_name}
        onConfirm={async () => {
          await frontOfficeService.deleteCallLog(deleteRow._id)
          toast({ title: 'Call log deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// Shared form drawer for Create and Edit call logs.
function CallLogFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    caller_name: initial?.caller_name || '',
    phone: initial?.phone || '',
    call_type: initial?.call_type || 'incoming',
    purpose: initial?.purpose || 'Enquiry',
    duration: initial?.duration || '',
    attended_by: initial?.attended_by || '',
    status: initial?.status || 'pending',
    notes: initial?.notes || '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Phone call log entry"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Log Call'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Caller Name <span className="text-destructive">*</span></Label>
            <Input value={form.caller_name} onChange={(e) => set('caller_name', e.target.value)} placeholder="Name of caller" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Phone <span className="text-destructive">*</span></Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555-0000" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Duration</Label>
              <Input value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="e.g. 5 min" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Call Type</Label>
              <select value={form.call_type} onChange={(e) => set('call_type', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="incoming">Incoming</option>
                <option value="outgoing">Outgoing</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Purpose</Label>
              <select value={form.purpose} onChange={(e) => set('purpose', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option>Enquiry</option>
                <option>Complaint</option>
                <option>Follow-up</option>
                <option>Information</option>
                <option>Emergency</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Attended By</Label>
              <Input value={form.attended_by} onChange={(e) => set('attended_by', e.target.value)} placeholder="Staff member name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} placeholder="Call summary and action items…" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
