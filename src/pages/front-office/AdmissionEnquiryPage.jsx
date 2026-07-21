// Admission Enquiry — front desk staff log and track prospective student
// enquiries. Each enquiry has a lifecycle (pending → in-progress → converted
// or dropped) and a follow-up timeline so staff can see every interaction.

import { useMemo, useState } from 'react'
import {
  UserPlus,
  Phone,
  Mail,
  Eye,
  Pencil,
  Trash2,
  MessageSquarePlus,
  Send,
  ClipboardList,
  Clock,
  CircleCheck as CheckCircle2,
  TrendingUp,
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
import { Timeline } from '@/components/Timeline'
import { useAsyncData } from '@/hooks/useAsyncData'
import { frontOfficeService } from '@/services/frontOffice.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

// Column definitions for CSV export — kept separate from table columns
// because export may need different keys/labels than what's displayed.
const EXPORT_COLS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'class_applying', label: 'Class Applying' },
  { key: 'source', label: 'Source' },
  { key: 'assigned_to', label: 'Assigned To' },
  { key: 'enquiry_date', label: 'Enquiry Date' },
  { key: 'status', label: 'Status' },
  { key: 'notes', label: 'Notes' },
]

// Status pill styles — reused in the table and the detail drawer.
const STATUS_STYLES = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/20',
  converted: 'bg-success/10 text-success border-success/20',
  dropped: 'bg-destructive/10 text-destructive border-destructive/20',
}

function EnquiryStatusPill({ status }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', STATUS_STYLES[status] || STATUS_STYLES.pending)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

export default function AdmissionEnquiryPage() {
  const { toast } = useToast()
  // Fetch enquiries on mount; refetch after any mutation so the table stays fresh.
  const { data, isLoading, refetch } = useAsyncData(() => frontOfficeService.getEnquiries(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  // Memoize filtered records to avoid re-filtering on every render.
  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.phone.includes(q)
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    const matchSource = sourceFilter === 'all' || r.source === sourceFilter
    return matchSearch && matchStatus && matchSource
  }), [rows, search, statusFilter, sourceFilter])

  const sourceOptions = useMemo(() => [...new Set(rows.map((r) => r.source).filter(Boolean))], [rows])

  const stats = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    converted: rows.filter((r) => r.status === 'converted').length,
    inProgress: rows.filter((r) => r.status === 'in-progress').length,
  }), [rows])

  // Shared save handler for create and edit — the service call differs by id.
  const handleSave = async (payload, id) => {
    if (id) {
      await frontOfficeService.updateEnquiry(id, payload)
      toast({ title: 'Enquiry updated', description: payload.name })
      setEditRow(null)
    } else {
      await frontOfficeService.createEnquiry(payload)
      toast({ title: 'Enquiry created', description: payload.name })
      setAddOpen(false)
    }
    refetch()
  }

  const handleAddFollowUp = async (enquiryId, note) => {
    await frontOfficeService.addEnquiryFollowUp(enquiryId, { note, by: 'Front Desk', date: new Date().toISOString() })
    toast({ title: 'Follow-up added' })
    refetch()
    // Refresh the view drawer so the new timeline entry appears immediately.
    const updated = (await frontOfficeService.getEnquiries()).data
    const found = updated.find((e) => e._id === enquiryId)
    if (found) setViewRow(found)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </button>
      ),
    },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'class_applying', header: 'Class', cell: ({ row }) => <Badge variant="outline">{row.original.class_applying}</Badge> },
    { accessorKey: 'source', header: 'Source' },
    { accessorKey: 'assigned_to', header: 'Assigned To' },
    { accessorKey: 'enquiry_date', header: 'Enquiry Date', cell: ({ row }) => formatDate(row.original.enquiry_date) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <EnquiryStatusPill status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front Office' }, { label: 'Admission Enquiry' }]} />
      <PageHeader
        title="Admission Enquiry"
        description="Track prospective student enquiries from first contact to admission."
        icon={ClipboardList}
        actions={<Button onClick={() => setAddOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> New Enquiry</Button>}
      />

      {/* KPI cards — give staff an at-a-glance snapshot of the enquiry pipeline. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Enquiries" value={stats.total} icon={ClipboardList} accent="primary" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warning" />
        <StatCard label="In Progress" value={stats.inProgress} icon={TrendingUp} accent="chart2" />
        <StatCard label="Converted" value={stats.converted} icon={CheckCircle2} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or phone…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="admission-enquiries" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="converted">Converted</option>
            <option value="dropped">Dropped</option>
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All sources</option>
            {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No enquiries found" description="Create a new enquiry to get started." actionLabel="New Enquiry" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="admission-enquiries"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Shared dialog for Create and Edit — the same form, different initial data. */}
      <EnquiryFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Enquiry' : 'New Enquiry'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer with follow-up timeline. */}
      <EnquiryDetailDrawer
        enquiry={viewRow}
        onClose={() => setViewRow(null)}
        onAddFollowUp={(note) => viewRow && handleAddFollowUp(viewRow._id, note)}
      />

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.name}
        onConfirm={async () => {
          await frontOfficeService.deleteEnquiry(deleteRow._id)
          toast({ title: 'Enquiry deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// ─── Form Drawer (shared by Create and Edit) ──────────────────────────────────
// Keeping the form in one component avoids duplicating field definitions.
// The `initial` prop decides whether we're creating or editing.
function EnquiryFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    class_applying: initial?.class_applying || '',
    source: initial?.source || 'Walk-in',
    assigned_to: initial?.assigned_to || '',
    status: initial?.status || 'pending',
    notes: initial?.notes || '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Prospective student enquiry details"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Create Enquiry'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Student or parent name" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Phone <span className="text-destructive">*</span></Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555-0000" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Class Applying</Label>
              <Input value={form.class_applying} onChange={(e) => set('class_applying', e.target.value)} placeholder="e.g. Class 5" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Source</Label>
              <select value={form.source} onChange={(e) => set('source', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option>Walk-in</option>
                <option>Phone</option>
                <option>Website</option>
                <option>Referral</option>
                <option>Social Media</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Assigned To</Label>
              <Input value={form.assigned_to} onChange={(e) => set('assigned_to', e.target.value)} placeholder="Staff member name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="converted">Converted</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} placeholder="Additional details about the enquiry…" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}

// ─── Detail Drawer with Timeline ───────────────────────────────────────────────
// Shows full enquiry info plus a follow-up timeline. Staff can add new
// follow-up notes directly from this view.
function EnquiryDetailDrawer({ enquiry, onClose, onAddFollowUp }) {
  const [followUpNote, setFollowUpNote] = useState('')

  const handleAdd = () => {
    if (!followUpNote.trim()) return
    onAddFollowUp(followUpNote.trim())
    setFollowUpNote('')
  }

  return (
    <Drawer
      open={!!enquiry}
      onOpenChange={(o) => !o && onClose()}
      title="Enquiry Details"
      description={enquiry?.name}
      width="sm:max-w-lg"
      footer={<Button variant="outline" onClick={onClose}>Close</Button>}
    >
      {enquiry && (
        <div className="space-y-6">
          {/* Contact summary */}
          <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {enquiry.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{enquiry.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {enquiry.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{enquiry.phone}</span>}
                {enquiry.email && <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{enquiry.email}</span>}
              </div>
            </div>
            <EnquiryStatusPill status={enquiry.status} />
          </div>

          {/* Key fields */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Class Applying', value: enquiry.class_applying },
              { label: 'Source', value: enquiry.source },
              { label: 'Assigned To', value: enquiry.assigned_to },
              { label: 'Enquiry Date', value: formatDate(enquiry.enquiry_date) },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value || '—'}</dd>
              </div>
            ))}
          </dl>

          {enquiry.notes && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Notes</p>
              <p className="rounded-lg border bg-muted/20 p-3 text-sm">{enquiry.notes}</p>
            </div>
          )}

          {/* Follow-up timeline */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Follow-up History</p>
            <Timeline items={enquiry.follow_ups} emptyMessage="No follow-ups yet. Add the first one below." />

            {/* Add follow-up — inline form so staff can log a note without leaving the drawer. */}
            <div className="flex gap-2 pt-2">
              <Input
                value={followUpNote}
                onChange={(e) => setFollowUpNote(e.target.value)}
                placeholder="Add a follow-up note…"
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
