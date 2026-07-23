// ====================================================================
// Module: Front Office
// Page: Postal Receive
//
// Purpose:
// Track letters and parcels received by the institution.
//
// Data Source:
// frontOffice.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Inbox,
  Eye,
  Pencil,
  Trash2,
  Paperclip,
  Mail,
  Package,
  FileText,
  Building2,
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

const EXPORT_COLS = [
  { key: 'from_title', label: 'Sender' },
  { key: 'from_address', label: 'Address' },
  { key: 'reference_no', label: 'Reference No' },
  { key: 'receive_type', label: 'Type' },
  { key: 'receive_date', label: 'Receive Date' },
  { key: 'received_by', label: 'Received By' },
  { key: 'delivered_to', label: 'Delivered To' },
  { key: 'notes', label: 'Notes' },
]

export default function PostalReceivePage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontOfficeService.getReceives(), [])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.from_title.toLowerCase().includes(q) || r.reference_no.toLowerCase().includes(q) || r.received_by.toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || r.receive_type === typeFilter
    return matchSearch && matchType
  }), [rows, search, typeFilter])

  const typeOptions = useMemo(() => [...new Set(rows.map((r) => r.receive_type).filter(Boolean))], [rows])

  const stats = useMemo(() => ({
    total: rows.length,
    letters: rows.filter((r) => r.receive_type === 'Letter').length,
    parcels: rows.filter((r) => r.receive_type === 'Parcel').length,
    documents: rows.filter((r) => r.receive_type === 'Official Document').length,
  }), [rows])

  const handleSave = async (payload, id) => {
    if (id) {
      await frontOfficeService.updateReceive(id, payload)
      toast({ title: 'Receive record updated' })
      setEditRow(null)
    } else {
      await frontOfficeService.createReceive(payload)
      toast({ title: 'Receive record created' })
      setAddOpen(false)
    }
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'from_title',
      header: 'Sender',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.from_title}</span>
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{row.original.from_address}</span>
        </button>
      ),
    },
    { accessorKey: 'reference_no', header: 'Reference No', cell: ({ row }) => <Badge variant="outline">{row.original.reference_no}</Badge> },
    { accessorKey: 'receive_type', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.original.receive_type}</Badge> },
    { accessorKey: 'receive_date', header: 'Date', cell: ({ row }) => formatDate(row.original.receive_date) },
    { accessorKey: 'received_by', header: 'Received By' },
    { accessorKey: 'delivered_to', header: 'Delivered To' },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front Office' }, { label: 'Postal Receive' }]} />
      <PageHeader
        title="Postal Receive"
        description="Track letters and parcels received by the institution."
        icon={Inbox}
        actions={<Button onClick={() => setAddOpen(true)}><Inbox className="mr-2 h-4 w-4" /> New Receive</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Received" value={stats.total} icon={Inbox} accent="primary" />
        <StatCard label="Letters" value={stats.letters} icon={Mail} accent="chart2" />
        <StatCard label="Parcels" value={stats.parcels} icon={Package} accent="chart3" />
        <StatCard label="Official Docs" value={stats.documents} icon={FileText} accent="chart4" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by sender, reference, or receiver…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="postal-receive" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All types</option>
            {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No receive records found" description="Record a new received item to get started." actionLabel="New Receive" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="postal-receive"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <ReceiveFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Receive Record' : 'New Receive Record'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Receive Details"
        description={viewRow?.reference_no}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.from_title}</p>
                <p className="text-xs text-muted-foreground">{viewRow.from_address}</p>
              </div>
              <Badge variant="secondary">{viewRow.receive_type}</Badge>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Reference No', value: viewRow.reference_no },
                { label: 'Receive Type', value: viewRow.receive_type },
                { label: 'Receive Date', value: formatDate(viewRow.receive_date) },
                { label: 'Received By', value: viewRow.received_by },
                { label: 'Delivered To', value: viewRow.delivered_to },
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
        entityName={deleteRow?.from_title}
        onConfirm={async () => {
          await frontOfficeService.deleteReceive(deleteRow._id)
          toast({ title: 'Receive record deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// Shared form drawer for Create and Edit receive records.
function ReceiveFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    from_title: initial?.from_title || '',
    from_address: initial?.from_address || '',
    reference_no: initial?.reference_no || '',
    receive_type: initial?.receive_type || 'Letter',
    receive_date: initial?.receive_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    received_by: initial?.received_by || '',
    delivered_to: initial?.delivered_to || '',
    notes: initial?.notes || '',
    attachment: initial?.attachment || '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Incoming postal record"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Record Receive'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Sender Name/Title <span className="text-destructive">*</span></Label>
            <Input value={form.from_title} onChange={(e) => set('from_title', e.target.value)} placeholder="e.g. State Education Dept" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Sender Address</Label>
            <Textarea value={form.from_address} onChange={(e) => set('from_address', e.target.value)} rows={2} placeholder="Full postal address" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Reference No</Label>
              <Input value={form.reference_no} onChange={(e) => set('reference_no', e.target.value)} placeholder="IN-2025-001" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Receive Type</Label>
              <select value={form.receive_type} onChange={(e) => set('receive_type', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option>Letter</option>
                <option>Parcel</option>
                <option>Official Document</option>
                <option>Courier</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Receive Date</Label>
              <Input type="date" value={form.receive_date} onChange={(e) => set('receive_date', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Received By</Label>
              <Input value={form.received_by} onChange={(e) => set('received_by', e.target.value)} placeholder="Front desk staff" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Delivered To (internal)</Label>
            <Input value={form.delivered_to} onChange={(e) => set('delivered_to', e.target.value)} placeholder="Staff member or department" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} placeholder="Contents, purpose, etc." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Attachment (optional)</Label>
            <Input value={form.attachment} onChange={(e) => set('attachment', e.target.value)} placeholder="e.g. delivery-note.pdf" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
