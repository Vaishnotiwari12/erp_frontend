// Complaint — tracks complaints raised by parents, students, or staff.
// Each complaint has a priority (high/medium/low), a status lifecycle
// (open → in-progress → resolved), and a follow-up timeline so the assigned
// staff member can log progress notes until resolution.

import { useMemo, useState } from 'react'
import { MessageSquarePlus, Eye, Pencil, Trash2, Send, MessageSquare, CircleAlert, Clock, CircleCheck as CheckCircle2, Paperclip, TriangleAlert as AlertTriangle } from 'lucide-react'
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
import { Timeline } from '@/components/Timeline'
import { PriorityBadge } from '@/components/PriorityBadge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { frontOfficeService } from '@/services/frontOffice.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'title', label: 'Title' },
  { key: 'complaint_type', label: 'Type' },
  { key: 'complainant_name', label: 'Complainant' },
  { key: 'complainant_type', label: 'Complainant Type' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'assigned_to', label: 'Assigned To' },
  { key: 'created_date', label: 'Created' },
  { key: 'resolved_date', label: 'Resolved' },
  { key: 'description', label: 'Description' },
]

// Status pill styles — reused in the table and the detail drawer.
const STATUS_STYLES = {
  open: 'bg-destructive/10 text-destructive border-destructive/20',
  'in-progress': 'bg-warning/10 text-warning border-warning/20',
  resolved: 'bg-success/10 text-success border-success/20',
}

function ComplaintStatusPill({ status }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_STYLES[status] || STATUS_STYLES.open)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status?.replace('-', ' ')}
    </span>
  )
}

export default function ComplaintPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontOfficeService.getComplaints(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.complainant_name.toLowerCase().includes(q) || r.assigned_to.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter
    const matchType = typeFilter === 'all' || r.complaint_type === typeFilter
    return matchSearch && matchStatus && matchPriority && matchType
  }), [rows, search, statusFilter, priorityFilter, typeFilter])

  const typeOptions = useMemo(() => [...new Set(rows.map((r) => r.complaint_type).filter(Boolean))], [rows])

  const stats = useMemo(() => ({
    total: rows.length,
    open: rows.filter((r) => r.status === 'open').length,
    inProgress: rows.filter((r) => r.status === 'in-progress').length,
    resolved: rows.filter((r) => r.status === 'resolved').length,
  }), [rows])

  const handleSave = async (payload, id) => {
    if (id) {
      await frontOfficeService.updateComplaint(id, payload)
      toast({ title: 'Complaint updated' })
      setEditRow(null)
    } else {
      await frontOfficeService.createComplaint(payload)
      toast({ title: 'Complaint registered' })
      setAddOpen(false)
    }
    refetch()
  }

  // Add a follow-up note — powers the timeline inside the detail drawer.
  const handleAddFollowUp = async (complaintId, note) => {
    await frontOfficeService.addComplaintFollowUp(complaintId, { note, by: 'Front Desk', date: new Date().toISOString() })
    toast({ title: 'Follow-up added' })
    refetch()
    // Refresh the view drawer so the new timeline entry appears immediately.
    const updated = (await frontOfficeService.getComplaints()).data
    const found = updated.find((c) => c._id === complaintId)
    if (found) setViewRow(found)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'title',
      header: 'Complaint',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.title}</span>
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[220px]">{row.original.description}</span>
        </button>
      ),
    },
    { accessorKey: 'complaint_type', header: 'Type', cell: ({ row }) => <Badge variant="outline">{row.original.complaint_type}</Badge> },
    { accessorKey: 'complainant_name', header: 'Complainant' },
    { accessorKey: 'priority', header: 'Priority', cell: ({ row }) => <PriorityBadge priority={row.original.priority} /> },
    { accessorKey: 'assigned_to', header: 'Assigned To' },
    { accessorKey: 'created_date', header: 'Created', cell: ({ row }) => formatDate(row.original.created_date) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <ComplaintStatusPill status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front Office' }, { label: 'Complaint' }]} />
      <PageHeader
        title="Complaints"
        description="Register, assign, and track complaints to resolution."
        icon={MessageSquare}
        actions={<Button onClick={() => setAddOpen(true)}><MessageSquarePlus className="mr-2 h-4 w-4" /> New Complaint</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={stats.total} icon={MessageSquare} accent="primary" />
        <StatCard label="Open" value={stats.open} icon={AlertTriangle} accent="destructive" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} accent="warning" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title, complainant, or assignee…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="complaints" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All types</option>
            {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No complaints found" description="Register a new complaint to get started." actionLabel="New Complaint" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="complaints"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <ComplaintFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Complaint' : 'New Complaint'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer with follow-up timeline */}
      <ComplaintDetailDrawer
        complaint={viewRow}
        onClose={() => setViewRow(null)}
        onAddFollowUp={(note) => viewRow && handleAddFollowUp(viewRow._id, note)}
      />

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.title}
        onConfirm={async () => {
          await frontOfficeService.deleteComplaint(deleteRow._id)
          toast({ title: 'Complaint deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// ─── Form Drawer (shared by Create and Edit) ──────────────────────────────────
function ComplaintFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    complaint_type: initial?.complaint_type || 'Infrastructure',
    description: initial?.description || '',
    complainant_name: initial?.complainant_name || '',
    complainant_type: initial?.complainant_type || 'Parent',
    phone: initial?.phone || '',
    priority: initial?.priority || 'medium',
    status: initial?.status || 'open',
    assigned_to: initial?.assigned_to || '',
    notes: initial?.notes || '',
    attachment: initial?.attachment || '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Complaint registration details"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Register Complaint'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Brief complaint title" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description <span className="text-destructive">*</span></Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} placeholder="Detailed description of the complaint…" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Complaint Type</Label>
              <select value={form.complaint_type} onChange={(e) => set('complaint_type', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option>Infrastructure</option>
                <option>Transport</option>
                <option>Library</option>
                <option>Facilities</option>
                <option>IT</option>
                <option>Staff Behavior</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Complainant Name <span className="text-destructive">*</span></Label>
              <Input value={form.complainant_name} onChange={(e) => set('complainant_name', e.target.value)} placeholder="Name" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Complainant Type</Label>
              <select value={form.complainant_type} onChange={(e) => set('complainant_type', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option>Parent</option>
                <option>Student</option>
                <option>Staff</option>
                <option>Visitor</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555-0000" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Assigned To</Label>
            <Input value={form.assigned_to} onChange={(e) => set('assigned_to', e.target.value)} placeholder="Staff member responsible" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} placeholder="Internal notes…" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Attachment (optional)</Label>
            <Input value={form.attachment} onChange={(e) => set('attachment', e.target.value)} placeholder="e.g. photo.jpg" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}

// ─── Detail Drawer with Timeline ───────────────────────────────────────────────
// Shows full complaint info plus a follow-up timeline. Staff can add new
// progress notes directly from this view, which is how complaints move
// from open to resolved.
function ComplaintDetailDrawer({ complaint, onClose, onAddFollowUp }) {
  const { toast } = useToast()
  const [followUpNote, setFollowUpNote] = useState('')

  const handleAdd = () => {
    if (!followUpNote.trim()) return
    onAddFollowUp(followUpNote.trim())
    setFollowUpNote('')
  }

  return (
    <Drawer
      open={!!complaint}
      onOpenChange={(o) => !o && onClose()}
      title="Complaint Details"
      description={complaint?.title}
      width="sm:max-w-lg"
      footer={<Button variant="outline" onClick={onClose}>Close</Button>}
    >
      {complaint && (
        <div className="space-y-6">
          {/* Summary header */}
          <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CircleAlert className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{complaint.title}</p>
              <p className="text-xs text-muted-foreground">{complaint.complainant_name} · {complaint.complainant_type}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <ComplaintStatusPill status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          {/* Key fields */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Type', value: <Badge variant="outline">{complaint.complaint_type}</Badge> },
              { label: 'Assigned To', value: complaint.assigned_to },
              { label: 'Created', value: formatDate(complaint.created_date) },
              { label: 'Resolved', value: complaint.resolved_date ? formatDate(complaint.resolved_date) : '—' },
              { label: 'Phone', value: complaint.phone },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value || '—'}</dd>
              </div>
            ))}
          </dl>

          {/* Description */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Description</p>
            <p className="rounded-lg border bg-muted/20 p-3 text-sm">{complaint.description}</p>
          </div>

          {/* Internal notes */}
          {complaint.notes && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Internal Notes</p>
              <p className="rounded-lg border bg-muted/20 p-3 text-sm">{complaint.notes}</p>
            </div>
          )}

          {/* Attachment */}
          {complaint.attachment && (
            <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-3">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{complaint.attachment}</span>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => toast({ title: 'Opening attachment' })}>View</Button>
            </div>
          )}

          {/* Follow-up timeline */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Progress Timeline</p>
            <Timeline items={complaint.follow_ups} emptyMessage="No progress notes yet. Add the first update below." />

            {/* Add follow-up — inline form so staff can log progress without leaving the drawer. */}
            <div className="flex gap-2 pt-2">
              <Input
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                placeholder="Add a progress note…"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() } }}
              />
              <Button onClick={handleAdd} disabled={!followUpNote.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  )
}
