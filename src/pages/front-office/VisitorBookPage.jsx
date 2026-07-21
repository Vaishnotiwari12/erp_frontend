// Visitor Book — logs every visitor entering the campus for security and audit.
// Visitors check in on arrival and check out when they leave. The front desk
// can see who is currently on campus at a glance.

import { useMemo, useState } from 'react'
import {
  UserPlus,
  Phone,
  Mail,
  Eye,
  Pencil,
  Trash2,
  LogOut,
  DoorOpen,
  Users,
  Clock,
  CircleCheck as CheckCircle2,
  Paperclip,
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
import { formatDate, formatRelativeTime } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'name', label: 'Visitor Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'purpose', label: 'Purpose' },
  { key: 'person_to_meet', label: 'Person to Meet' },
  { key: 'department', label: 'Department' },
  { key: 'check_in', label: 'Check In' },
  { key: 'check_out', label: 'Check Out' },
  { key: 'status', label: 'Status' },
  { key: 'notes', label: 'Notes' },
]

// Status pill — checked-in (active) vs checked-out (done).
const STATUS_STYLES = {
  'checked-in': 'bg-success/10 text-success border-success/20',
  'checked-out': 'bg-muted text-muted-foreground border-border',
}

function VisitorStatusPill({ status }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_STYLES[status] || STATUS_STYLES['checked-out'])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status?.replace('-', ' ')}
    </span>
  )
}

export default function VisitorBookPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontOfficeService.getVisitors(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [purposeFilter, setPurposeFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.person_to_meet.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchPurpose = purposeFilter === 'all' || r.purpose === purposeFilter
    return matchSearch && matchStatus && matchPurpose
  }), [rows, search, statusFilter, purposeFilter])

  const purposeOptions = useMemo(() => [...new Set(rows.map((r) => r.purpose).filter(Boolean))], [rows])

  const stats = useMemo(() => ({
    total: rows.length,
    checkedIn: rows.filter((r) => r.status === 'checked-in').length,
    checkedOut: rows.filter((r) => r.status === 'checked-out').length,
  }), [rows])

  const handleSave = async (payload, id) => {
    if (id) {
      await frontOfficeService.updateVisitor(id, payload)
      toast({ title: 'Visitor updated', description: payload.name })
      setEditRow(null)
    } else {
      await frontOfficeService.createVisitor(payload)
      toast({ title: 'Visitor checked in', description: payload.name })
      setAddOpen(false)
    }
    refetch()
  }

  // Check-out action — only available for visitors currently on campus.
  const handleCheckOut = async (visitor) => {
    await frontOfficeService.checkOutVisitor(visitor._id)
    toast({ title: 'Visitor checked out', description: visitor.name })
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Visitor',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.phone}</span>
        </button>
      ),
    },
    { accessorKey: 'purpose', header: 'Purpose', cell: ({ row }) => <Badge variant="outline">{row.original.purpose}</Badge> },
    { accessorKey: 'person_to_meet', header: 'To Meet' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'check_in', header: 'Check In', cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{formatDate(row.original.check_in)}</span>
        <span className="text-xs text-muted-foreground">{formatRelativeTime(row.original.check_in)}</span>
      </div>
    ) },
    { accessorKey: 'check_out', header: 'Check Out', cell: ({ row }) => row.original.check_out ? formatDate(row.original.check_out) : '—' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <VisitorStatusPill status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { label: 'Check Out', icon: LogOut, onClick: () => handleCheckOut(r), disabled: r.status === 'checked-out' },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front Office' }, { label: 'Visitor Book' }]} />
      <PageHeader
        title="Visitor Book"
        description="Log and track all visitors entering the campus."
        icon={DoorOpen}
        actions={<Button onClick={() => setAddOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> New Visitor</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Visitors" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Currently On Campus" value={stats.checkedIn} icon={Clock} accent="success" />
        <StatCard label="Checked Out" value={stats.checkedOut} icon={CheckCircle2} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, phone, or person to meet…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="visitor-book" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="checked-in">Checked In</option>
            <option value="checked-out">Checked Out</option>
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
        <NoData title="No visitors found" description="Log a new visitor to get started." actionLabel="New Visitor" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="visitor-book"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <VisitorFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Visitor' : 'New Visitor'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Visitor Details"
        description={viewRow?.name}
        width="sm:max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>
            {viewRow?.status === 'checked-in' && (
              <Button onClick={() => { handleCheckOut(viewRow); setViewRow(null) }}>
                <LogOut className="mr-2 h-4 w-4" /> Check Out
              </Button>
            )}
          </>
        }
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {viewRow.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.name}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {viewRow.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{viewRow.phone}</span>}
                  {viewRow.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{viewRow.email}</span>}
                </div>
              </div>
              <VisitorStatusPill status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Purpose', value: viewRow.purpose },
                { label: 'Person to Meet', value: viewRow.person_to_meet },
                { label: 'Department', value: viewRow.department },
                { label: 'Check In', value: formatDate(viewRow.check_in) },
                { label: 'Check Out', value: viewRow.check_out ? formatDate(viewRow.check_out) : 'Still on campus' },
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

            {viewRow.attachment && (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-3">
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{viewRow.attachment}</span>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toast({ title: 'Opening attachment' })}>View</Button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.name}
        onConfirm={async () => {
          await frontOfficeService.deleteVisitor(deleteRow._id)
          toast({ title: 'Visitor record deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// Shared form drawer for Create and Edit visitor records.
function VisitorFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    purpose: initial?.purpose || 'Parent Meeting',
    person_to_meet: initial?.person_to_meet || '',
    department: initial?.department || '',
    notes: initial?.notes || '',
    attachment: initial?.attachment || '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Visitor entry details"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Check In Visitor'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Visitor Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Phone <span className="text-destructive">*</span></Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555-0000" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@example.com" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Purpose of Visit</Label>
            <select value={form.purpose} onChange={(e) => set('purpose', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option>Parent Meeting</option>
              <option>Vendor Visit</option>
              <option>Medical Checkup</option>
              <option>Admission Enquiry</option>
              <option>Guest Lecture</option>
              <option>Official Audit</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Person to Meet</Label>
              <Input value={form.person_to_meet} onChange={(e) => set('person_to_meet', e.target.value)} placeholder="Staff member name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Input value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Department" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} placeholder="Purpose details, identification, etc." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Attachment (optional)</Label>
            <Input value={form.attachment} onChange={(e) => set('attachment', e.target.value)} placeholder="e.g. id-proof.pdf" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
