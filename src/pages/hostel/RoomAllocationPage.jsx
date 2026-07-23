// ====================================================================
// Module: Hostel
// Page: Room Allocation
//
// Purpose:
// Allocate students to hostel rooms with capacity validation.
//
// Data Source:
// hostel.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { DoorOpen, Plus, Eye, LogOut, Users, Search, CircleAlert as AlertCircle } from 'lucide-react'
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
import { OccupancyIndicator } from '@/components/OccupancyIndicator'
import { AllocationStatusBadge } from '@/components/AllocationStatusBadge'
import { useHostelAllocations } from '@/hooks/useHostel'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'room_number', label: 'Room' },
  { key: 'room_type_name', label: 'Room Type' },
  { key: 'block', label: 'Block' },
  { key: 'floor', label: 'Floor' },
  { key: 'check_in', label: 'Check In' },
  { key: 'check_out', label: 'Check Out' },
  { key: 'allocation_status', label: 'Status' },
]

export default function RoomAllocationPage() {
  const {
    rows, rooms, stats, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    roomFilter, setRoomFilter, allocateRoom, vacateAllocation,
  } = useHostelAllocations()

  const [allocateOpen, setAllocateOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [vacateRow, setVacateRow] = useState(null)

  const columns = useMemo(() => [
    {
      accessorKey: 'student_name',
      header: 'Student',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.student_name}</span>
          <span className="text-xs text-muted-foreground">{row.original.admission_no}</span>
        </button>
      ),
    },
    { accessorKey: 'class', header: 'Class', cell: ({ row }) => <Badge variant="outline">{row.original.class}</Badge> },
    { accessorKey: 'room_number', header: 'Room', cell: ({ row }) => (
      <span className="flex items-center gap-1.5">
        <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original.room_number}
      </span>
    ) },
    { accessorKey: 'block', header: 'Block', cell: ({ row }) => <Badge variant="secondary">{row.original.block}</Badge> },
    { accessorKey: 'check_in', header: 'Check In', cell: ({ row }) => formatDate(row.original.check_in) },
    { accessorKey: 'allocation_status', header: 'Status', cell: ({ row }) => <AllocationStatusBadge status={row.original.allocation_status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Vacate', icon: LogOut, variant: 'destructive', onClick: () => setVacateRow(r), disabled: r.allocation_status !== 'active' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Hostel' }, { label: 'Room Allocation' }]} />
      <PageHeader
        title="Room Allocation"
        description="Allocate students to hostel rooms with capacity validation."
        icon={DoorOpen}
        actions={<Button onClick={() => setAllocateOpen(true)}><Plus className="mr-2 h-4 w-4" /> Allocate Room</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Allocations" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={Users} accent="success" />
        <StatCard label="Vacated" value={stats.vacated} icon={Users} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student, admission no, or room…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="hostel-allocations" />
          <select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All rooms</option>
            {rooms.map((r) => <option key={r._id} value={r._id}>{r.room_number}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="vacated">Vacated</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No allocations found" description="Allocate a student to a room to get started." actionLabel="Allocate Room" onAction={() => setAllocateOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="hostel-allocations"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Allocation Dialog used for both Add and Edit Allocation. */}
      <AllocateRoomDrawer
        open={allocateOpen}
        onOpenChange={setAllocateOpen}
        rooms={rooms}
        onSubmit={allocateRoom}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Allocation Details"
        description={viewRow?.student_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.student_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.admission_no} · {viewRow.class}</p>
              </div>
              <AllocationStatusBadge status={viewRow.allocation_status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Room', value: viewRow.room_number },
                { label: 'Room Type', value: viewRow.room_type_name },
                { label: 'Block', value: viewRow.block },
                { label: 'Floor', value: viewRow.floor },
                { label: 'Check In', value: formatDate(viewRow.check_in) },
                { label: 'Check Out', value: viewRow.check_out ? formatDate(viewRow.check_out) : '—' },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>

      {/* Vacate confirmation */}
      <DeleteDialog
        open={!!vacateRow}
        onOpenChange={(o) => !o && setVacateRow(null)}
        title="Vacate Room"
        entityName={vacateRow?.student_name}
        description={`This will vacate ${vacateRow?.student_name} from room ${vacateRow?.room_number}.`}
        confirmLabel="Vacate"
        onConfirm={() => vacateAllocation(vacateRow._id, vacateRow.student_name)}
      />
    </div>
  )
}

// ─── Allocate Room Drawer ─────────────────────────────────────────────────────
// Staff search for a student, pick a room (with capacity check).
function AllocateRoomDrawer({ open, onOpenChange, rooms, onSubmit }) {
  const [form, setForm] = useState({
    student_name: '',
    student_id: '',
    admission_no: '',
    class: '',
    room_id: '',
    check_in: new Date().toISOString().slice(0, 10),
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Selected room — used for capacity validation display.
  const selectedRoom = rooms.find((r) => r._id === form.room_id)
  const availableBeds = selectedRoom ? selectedRoom.capacity - selectedRoom.occupied : 0
  const isFull = selectedRoom && selectedRoom.occupied >= selectedRoom.capacity

  const handleSubmit = () => {
    if (!form.student_name.trim() || !form.room_id) return
    const room = rooms.find((r) => r._id === form.room_id)
    onSubmit({
      ...form,
      room_number: room?.room_number || '',
      room_type_name: room?.room_type_name || '',
      block: room?.block || '',
      floor: room?.floor || '',
    })
    setAllocateOpen(false)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Allocate Student to Room"
      description="Select a student and an available room"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Allocate"
          submitDisabled={!form.student_name.trim() || !form.room_id}
          onSubmit={handleSubmit}
        />
      }
    >
      <div className="space-y-4">
        <FormSection columns={1}>
          {/* Student search */}
          <div className="space-y-1.5">
            <Label className="text-xs">Student Name <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={form.student_name}
                onChange={(e) => set('student_name', e.target.value)}
                placeholder="Search student name…"
                className="pl-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Admission No</Label>
              <Input value={form.admission_no} onChange={(e) => set('admission_no', e.target.value)} placeholder="ADM-1001" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Class</Label>
              <Input value={form.class} onChange={(e) => set('class', e.target.value)} placeholder="10-A" />
            </div>
          </div>
        </FormSection>

        {/* Room selection with capacity indicator */}
        <div className="space-y-2">
          <Label className="text-xs">Select Room <span className="text-destructive">*</span></Label>
          <select value={form.room_id} onChange={(e) => set('room_id', e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="">Select a room</option>
            {rooms.filter((r) => r.status === 'active' && r.room_status !== 'maintenance').map((r) => (
              <option key={r._id} value={r._id}>{r.room_number} ({r.occupied}/{r.capacity} beds) — {r.block}</option>
            ))}
          </select>
          {/* Capacity validation — show warning if room is full. */}
          {selectedRoom && (
            <div className="rounded-lg border p-3">
              {isFull ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">This room is at full capacity.</span>
                </div>
              ) : (
                <>
                  <OccupancyIndicator occupied={selectedRoom.occupied} capacity={selectedRoom.capacity} />
                  <p className="mt-1.5 text-xs text-muted-foreground">{availableBeds} bed(s) available</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Check In Date</Label>
          <Input type="date" value={form.check_in} onChange={(e) => set('check_in', e.target.value)} />
        </div>
      </div>
    </Drawer>
  )
}
