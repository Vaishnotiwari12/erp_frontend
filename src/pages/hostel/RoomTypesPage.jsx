// ====================================================================
// Module: Hostel
// Page: Room Types
//
// Purpose:
// Manage hostel room categories, capacity, and base fees.
//
// Data Source:
// hostel.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Building2,
  Plus,
  Eye,
  Pencil,
  Trash2,
  BedDouble,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { StatusBadge } from '@/components/StatusBadge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hostelService } from '@/services/hostel.service'
import { formatCurrency, formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Room Type' },
  { key: 'code', label: 'Code' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'base_fee', label: 'Base Fee' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
]

export default function RoomTypesPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => hostelService.getRoomTypes(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []

  // useMemo prevents recalculating filtered room types
  // unless room type list or search changes.
  const filtered = useMemo(() => rows.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((t) => t.status === 'active').length,
    totalCapacity: rows.reduce((max, t) => Math.max(max, t.capacity), 0),
  }), [rows])

  const handleSave = async (payload, id) => {
    if (id) {
      await hostelService.updateRoomType(id, payload)
      toast({ title: 'Room type updated', description: payload.name })
      setEditRow(null)
    } else {
      await hostelService.createRoomType(payload)
      toast({ title: 'Room type created', description: payload.name })
      setAddOpen(false)
    }
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Room Type',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.name}</span>
            <span className="text-xs text-muted-foreground">{row.original.code}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'capacity', header: 'Capacity', cell: ({ row }) => <Badge variant="outline">{row.original.capacity} beds</Badge> },
    { accessorKey: 'base_fee', header: 'Base Fee', cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.base_fee)}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Hostel' }, { label: 'Room Types' }]} />
      <PageHeader
        title="Room Types"
        description="Manage hostel room categories, capacity, and base fees."
        icon={Building2}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Room Type</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Room Types" value={stats.total} icon={Building2} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={Building2} accent="success" />
        <StatCard label="Max Capacity" value={`${stats.totalCapacity} beds`} icon={BedDouble} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or code…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="hostel-room-types" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
      ) : filtered.length === 0 ? (
        <NoData title="No room types found" description="Create a new room type to get started." actionLabel="Add Room Type" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="hostel-room-types"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <RoomTypeFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Room Type' : 'Add Room Type'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Room Type Details"
        description={viewRow?.name}
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
                <p className="font-semibold">{viewRow.name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.code}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Capacity', value: `${viewRow.capacity} beds` },
                { label: 'Base Fee', value: formatCurrency(viewRow.base_fee) },
                { label: 'Description', value: viewRow.description || '—' },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.name}
        onConfirm={async () => {
          await hostelService.deleteRoomType(deleteRow._id)
          toast({ title: 'Room type deleted' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// ─── Room Type Form Drawer (shared by Add and Edit) ──────────────────────────
function RoomTypeFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    code: initial?.code || '',
    capacity: initial?.capacity || 1,
    base_fee: initial?.base_fee || 0,
    description: initial?.description || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Room type configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Room Type'}
          submitDisabled={!form.name.trim() || !form.code.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Single AC" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Code <span className="text-destructive">*</span></Label>
              <Input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="e.g. SAC" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Capacity (beds)</Label>
              <Input type="number" min="1" value={form.capacity} onChange={(e) => set('capacity', parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Base Fee</Label>
              <Input type="number" min="0" value={form.base_fee} onChange={(e) => set('base_fee', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Input value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief description" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
