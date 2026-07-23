// ====================================================================
// Module: Hostel
// Page: Hostel Rooms
//
// Purpose:
// Manage hostel rooms, blocks, floors, and occupancy.
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
  BedDouble,
  Plus,
  Eye,
  Pencil,
  Trash2,
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
import { RoomStatusBadge } from '@/components/RoomStatusBadge'
import { OccupancyIndicator } from '@/components/OccupancyIndicator'
import { useHostelRooms } from '@/hooks/useHostel'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'room_number', label: 'Room Number' },
  { key: 'block', label: 'Block' },
  { key: 'floor', label: 'Floor' },
  { key: 'room_type_name', label: 'Room Type' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'room_status', label: 'Room Status' },
  { key: 'status', label: 'Status' },
]

export default function HostelRoomsPage() {
  const {
    rows, roomTypes, blocks, stats, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    blockFilter, setBlockFilter, saveRoom, deleteRoom,
  } = useHostelRooms()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveRoom(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'room_number',
      header: 'Room',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BedDouble className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.room_number}</span>
            <span className="text-xs text-muted-foreground">{row.original.block} · {row.original.floor}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'room_type_name', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.original.room_type_name}</Badge> },
    {
      accessorKey: 'capacity',
      header: 'Occupancy',
      cell: ({ row }) => <OccupancyIndicator occupied={row.original.occupied} capacity={row.original.capacity} className="w-28" />,
    },
    { accessorKey: 'room_status', header: 'Room Status', cell: ({ row }) => <RoomStatusBadge status={row.original.room_status} /> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Hostel' }, { label: 'Rooms' }]} />
      <PageHeader
        title="Hostel Rooms"
        description="Manage hostel rooms, blocks, floors, and occupancy."
        icon={BedDouble}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Room</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Rooms" value={stats.total} icon={BedDouble} accent="primary" />
        <StatCard label="Available" value={stats.available} icon={BedDouble} accent="success" />
        <StatCard label="Occupied" value={stats.occupied} icon={BedDouble} accent="chart2" />
        <StatCard label="Maintenance" value={stats.maintenance} icon={BedDouble} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by room number, block, or type…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="hostel-rooms" />
          <select value={blockFilter} onChange={(e) => setBlockFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All blocks</option>
            {blocks.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="partial">Partial</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No rooms found" description="Add a new room to get started." actionLabel="Add Room" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="hostel-rooms"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Room Form Drawer used for both Add and Edit. */}
      <RoomFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Room' : 'Add Room'}
        initial={editRow}
        roomTypes={roomTypes}
        blocks={blocks}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Room Details"
        description={viewRow?.room_number}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BedDouble className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.room_number}</p>
                <p className="text-xs text-muted-foreground">{viewRow.block} · {viewRow.floor}</p>
              </div>
              <RoomStatusBadge status={viewRow.room_status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Room Type', value: viewRow.room_type_name },
                { label: 'Block', value: viewRow.block },
                { label: 'Floor', value: viewRow.floor },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            <OccupancyIndicator occupied={viewRow.occupied} capacity={viewRow.capacity} />
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.room_number}
        onConfirm={() => deleteRoom(deleteRow._id)}
      />
    </div>
  )
}

// ─── Room Form Drawer (shared by Add and Edit) ──────────────────────────────
function RoomFormDrawer({ open, onOpenChange, title, initial, roomTypes, blocks, onSubmit }) {
  const [form, setForm] = useState({
    room_number: initial?.room_number || '',
    block: initial?.block || '',
    floor: initial?.floor || '',
    room_type_id: initial?.room_type_id || '',
    capacity: initial?.capacity || 1,
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // When a room type is selected, auto-fill capacity from the room type.
  const handleRoomTypeChange = (typeId) => {
    const rt = roomTypes.find((t) => t._id === typeId)
    setForm((f) => ({ ...f, room_type_id: typeId, room_type_name: rt?.name || '', capacity: rt?.capacity || 1 }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Room information and configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Room'}
          submitDisabled={!form.room_number.trim() || !form.room_type_id}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Room Number <span className="text-destructive">*</span></Label>
              <Input value={form.room_number} onChange={(e) => set('room_number', e.target.value)} placeholder="e.g. A-101" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Block</Label>
              <Input value={form.block} onChange={(e) => set('block', e.target.value)} placeholder="e.g. Block A" list="block-list" />
              <datalist id="block-list">
                {blocks.map((b) => <option key={b} value={b} />)}
              </datalist>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Floor</Label>
              <Input value={form.floor} onChange={(e) => set('floor', e.target.value)} placeholder="e.g. 1st Floor" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Capacity</Label>
              <Input type="number" min="1" value={form.capacity} onChange={(e) => set('capacity', parseInt(e.target.value) || 1)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Room Type <span className="text-destructive">*</span></Label>
            <select value={form.room_type_id} onChange={(e) => handleRoomTypeChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select room type</option>
              {roomTypes.filter((t) => t.status === 'active').map((t) => (
                <option key={t._id} value={t._id}>{t.name} (cap: {t.capacity})</option>
              ))}
            </select>
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
