// Postal Dispatch — tracks letters and parcels sent out from the institution.
// Each dispatch has a reference number, recipient, courier, and an optional
// attachment (e.g. delivery receipt or invoice).

import { useMemo, useState } from 'react'
import {
  Send,
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
  { key: 'to_title', label: 'Recipient' },
  { key: 'to_address', label: 'Address' },
  { key: 'reference_no', label: 'Reference No' },
  { key: 'dispatch_type', label: 'Type' },
  { key: 'dispatch_date', label: 'Dispatch Date' },
  { key: 'dispatched_by', label: 'Dispatched By' },
  { key: 'received_by', label: 'Courier' },
  { key: 'notes', label: 'Notes' },
]

export default function PostalDispatchPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontOfficeService.getDispatches(), [])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.to_title.toLowerCase().includes(q) || r.reference_no.toLowerCase().includes(q) || r.dispatched_by.toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || r.dispatch_type === typeFilter
    return matchSearch && matchType
  }), [rows, search, typeFilter])

  const typeOptions = useMemo(() => [...new Set(rows.map((r) => r.dispatch_type).filter(Boolean))], [rows])

  const stats = useMemo(() => ({
    total: rows.length,
    letters: rows.filter((r) => r.dispatch_type === 'Letter').length,
    parcels: rows.filter((r) => r.dispatch_type === 'Parcel').length,
    documents: rows.filter((r) => r.dispatch_type === 'Official Document').length,
  }), [rows])

  const handleSave = async (payload, id) => {
    if (id) {
      await frontOfficeService.updateDispatch(id, payload)
      toast({ title: 'Dispatch updated' })
      setEditRow(null)
    } else {
      await frontOfficeService.createDispatch(payload)
      toast({ title: 'Dispatch recorded' })
      setAddOpen(false)
    }
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'to_title',
      header: 'Recipient',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.to_title}</span>
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{row.original.to_address}</span>
        </button>
      ),
    },
    { accessorKey: 'reference_no', header: 'Reference No', cell: ({ row }) => <Badge variant="outline">{row.original.reference_no}</Badge> },
    { accessorKey: 'dispatch_type', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.original.dispatch_type}</Badge> },
    { accessorKey: 'dispatch_date', header: 'Date', cell: ({ row }) => formatDate(row.original.dispatch_date) },
    { accessorKey: 'dispatched_by', header: 'Dispatched By' },
    { accessorKey: 'received_by', header: 'Courier' },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front Office' }, { label: 'Postal Dispatch' }]} />
      <PageHeader
        title="Postal Dispatch"
        description="Track letters and parcels sent out from the institution."
        icon={Send}
        actions={<Button onClick={() => setAddOpen(true)}><Send className="mr-2 h-4 w-4" /> New Dispatch</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Dispatches" value={stats.total} icon={Send} accent="primary" />
        <StatCard label="Letters" value={stats.letters} icon={Mail} accent="chart2" />
        <StatCard label="Parcels" value={stats.parcels} icon={Package} accent="chart3" />
        <StatCard label="Official Docs" value={stats.documents} icon={FileText} accent="chart4" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by recipient, reference, or sender…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="postal-dispatch" />
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
        <NoData title="No dispatches found" description="Record a new dispatch to get started." actionLabel="New Dispatch" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="postal-dispatch"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <DispatchFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Dispatch' : 'New Dispatch'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Dispatch Details"
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
                <p className="font-semibold">{viewRow.to_title}</p>
                <p className="text-xs text-muted-foreground">{viewRow.to_address}</p>
              </div>
              <Badge variant="secondary">{viewRow.dispatch_type}</Badge>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Reference No', value: viewRow.reference_no },
                { label: 'Dispatch Type', value: viewRow.dispatch_type },
                { label: 'Dispatch Date', value: formatDate(viewRow.dispatch_date) },
                { label: 'Dispatched By', value: viewRow.dispatched_by },
                { label: 'Courier', value: viewRow.received_by },
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
        entityName={deleteRow?.to_title}
        onConfirm={async () => {
          await frontOfficeService.deleteDispatch(deleteRow._id)
          toast({ title: 'Dispatch record deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// Shared form drawer for Create and Edit dispatch records.
function DispatchFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    to_title: initial?.to_title || '',
    to_address: initial?.to_address || '',
    reference_no: initial?.reference_no || '',
    dispatch_type: initial?.dispatch_type || 'Letter',
    dispatch_date: initial?.dispatch_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    dispatched_by: initial?.dispatched_by || '',
    received_by: initial?.received_by || '',
    notes: initial?.notes || '',
    attachment: initial?.attachment || '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Outgoing postal record"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Record Dispatch'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Recipient Name/Title <span className="text-destructive">*</span></Label>
            <Input value={form.to_title} onChange={(e) => set('to_title', e.target.value)} placeholder="e.g. Mr. John Smith" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Recipient Address</Label>
            <Textarea value={form.to_address} onChange={(e) => set('to_address', e.target.value)} rows={2} placeholder="Full postal address" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Reference No</Label>
              <Input value={form.reference_no} onChange={(e) => set('reference_no', e.target.value)} placeholder="REF-2025-001" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Dispatch Type</Label>
              <select value={form.dispatch_type} onChange={(e) => set('dispatch_type', e.target.value)}
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
              <Label className="text-xs">Dispatch Date</Label>
              <Input type="date" value={form.dispatch_date} onChange={(e) => set('dispatch_date', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Courier / Carrier</Label>
              <Input value={form.received_by} onChange={(e) => set('received_by', e.target.value)} placeholder="e.g. FedEx, USPS" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Dispatched By</Label>
            <Input value={form.dispatched_by} onChange={(e) => set('dispatched_by', e.target.value)} placeholder="Staff member name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={3} placeholder="Contents, purpose, etc." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Attachment (optional)</Label>
            <Input value={form.attachment} onChange={(e) => set('attachment', e.target.value)} placeholder="e.g. delivery-receipt.pdf" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
