// ====================================================================
// Module: Transport
// Page: Assign Vehicle
//
// Purpose:
// Assign students to vehicles with capacity validation.
//
// Data Source:
// transport.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { UserPlus, Eye, Trash2, Bus, Users, Search, CircleAlert as AlertCircle } from 'lucide-react'
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
import { CapacityIndicator } from '@/components/CapacityIndicator'
import { useVehicleAssignments } from '@/hooks/useTransport'
import { useAsyncData } from '@/hooks/useAsyncData'
import { transportService } from '@/services/transport.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'vehicle_number', label: 'Vehicle' },
  { key: 'route_name', label: 'Route' },
  { key: 'pickup_point_name', label: 'Pickup Point' },
  { key: 'pickup_time', label: 'Pickup Time' },
  { key: 'status', label: 'Status' },
]

export default function AssignVehiclePage() {
  const { toast } = useToast()
  const {
    rows: filtered, allAssignments: rows, stats, isLoading,
    search, setSearch, vehicleFilter, setVehicleFilter,
    assignVehicle, deleteAssignment,
  } = useVehicleAssignments()
  const { data: vehiclesData } = useAsyncData(() => transportService.getVehicles(), [])
  const { data: routesData } = useAsyncData(() => transportService.getRoutes(), [])
  const { data: pickupPointsData } = useAsyncData(() => transportService.getPickupPoints(), [])
  const [assignOpen, setAssignOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const vehicles = vehiclesData || []
  const routes = routesData || []
  const pickupPoints = pickupPointsData || []

  const handleAssign = async (payload) => {
    // Capacity validation before assigning students.
    const vehicle = vehicles.find((v) => v._id === payload.vehicle_id)
    if (vehicle && vehicle.occupied >= vehicle.capacity) {
      toast({ title: 'Vehicle is full', description: `${vehicle.vehicle_number} has no available seats.`, variant: 'destructive' })
      return
    }
    await assignVehicle(payload)
    setAssignOpen(false)
  }

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
    { accessorKey: 'vehicle_number', header: 'Vehicle', cell: ({ row }) => (
      <span className="flex items-center gap-1.5">
        <Bus className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original.vehicle_number}
      </span>
    ) },
    { accessorKey: 'route_name', header: 'Route', cell: ({ row }) => <Badge variant="secondary">{row.original.route_name}</Badge> },
    { accessorKey: 'pickup_point_name', header: 'Pickup Point' },
    { accessorKey: 'pickup_time', header: 'Time' },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { separator: true },
    { label: 'Remove', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Transport' }, { label: 'Assign Vehicle' }]} />
      <PageHeader
        title="Assign Vehicle"
        description="Assign students to vehicles with capacity validation."
        icon={UserPlus}
        actions={<Button onClick={() => setAssignOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Assign Student</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Assignments" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Vehicles in Use" value={stats.vehicles} icon={Bus} accent="chart2" />
        <StatCard label="Routes Covered" value={stats.routes} icon={Bus} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student, admission no, or vehicle…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="vehicle-assignments" />
          <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All vehicles</option>
            {vehicles.map((v) => <option key={v._id} value={v._id}>{v.vehicle_number}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No assignments found" description="Assign a student to a vehicle to get started." actionLabel="Assign Student" onAction={() => setAssignOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="vehicle-assignments"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <AssignVehicleDrawer
        open={assignOpen}
        onOpenChange={setAssignOpen}
        vehicles={vehicles}
        routes={routes}
        pickupPoints={pickupPoints}
        onSubmit={handleAssign}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Assignment Details"
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
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Vehicle', value: viewRow.vehicle_number },
                { label: 'Route', value: viewRow.route_name },
                { label: 'Pickup Point', value: viewRow.pickup_point_name },
                { label: 'Pickup Time', value: viewRow.pickup_time },
                { label: 'Assigned On', value: formatDate(viewRow.assigned_at) },
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

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.student_name}
        onConfirm={async () => {
          await deleteAssignment(deleteRow._id)
          setDeleteRow(null)
        }}
      />
    </div>
  )
}

// ─── Assign Vehicle Drawer ───────────────────────────────────────────────────
// Staff search for a student, pick a vehicle (with capacity check), and
// select a route + pickup point.
function AssignVehicleDrawer({ open, onOpenChange, vehicles, routes, pickupPoints, onSubmit }) {
  const [form, setForm] = useState({
    student_name: '',
    student_id: '',
    admission_no: '',
    class: '',
    vehicle_id: '',
    route_id: '',
    pickup_point_id: '',
  })
  const [studentSearch, setStudentSearch] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Selected vehicle — used for capacity validation display.
  const selectedVehicle = vehicles.find((v) => v._id === form.vehicle_id)
  const availableSeats = selectedVehicle ? selectedVehicle.capacity - selectedVehicle.occupied : 0
  const isFull = selectedVehicle && selectedVehicle.occupied >= selectedVehicle.capacity

  // Filter pickup points by selected route — cascading dropdown.
  const filteredPickupPoints = useMemo(() => {
    if (!form.route_id) return pickupPoints
    return pickupPoints.filter((p) => p.route_id === form.route_id)
  }, [pickupPoints, form.route_id])

  const handleSubmit = () => {
    if (!form.student_name.trim() || !form.vehicle_id) {
      return
    }
    const vehicle = vehicles.find((v) => v._id === form.vehicle_id)
    const route = routes.find((r) => r._id === form.route_id)
    const pickup = pickupPoints.find((p) => p._id === form.pickup_point_id)
    onSubmit({
      ...form,
      vehicle_number: vehicle?.vehicle_number || '',
      route_name: route?.name || '',
      pickup_point_name: pickup?.name || '',
      pickup_time: pickup?.time || '',
    })
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Student to Vehicle"
      description="Select a student, vehicle, route, and pickup point"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Assign"
          submitDisabled={!form.student_name.trim() || !form.vehicle_id}
          onSubmit={handleSubmit}
        />
      }
    >
      <div className="space-y-4">
        <FormSection columns={1}>
          {/* Student search — type the student name and admission number */}
          <div className="space-y-1.5">
            <Label className="text-xs">Student Name <span className="text-destructive">*</span></Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={studentSearch}
                onChange={(e) => { setStudentSearch(e.target.value); set('student_name', e.target.value) }}
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

        {/* Vehicle selection with capacity indicator */}
        <div className="space-y-2">
          <Label className="text-xs">Select Vehicle <span className="text-destructive">*</span></Label>
          <select value={form.vehicle_id} onChange={(e) => set('vehicle_id', e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="">Select a vehicle</option>
            {vehicles.filter((v) => v.status === 'active').map((v) => (
              <option key={v._id} value={v._id}>{v.vehicle_number} ({v.occupied}/{v.capacity} seats)</option>
            ))}
          </select>
          {/* Capacity validation — show warning if vehicle is full. */}
          {selectedVehicle && (
            <div className="rounded-lg border p-3">
              {isFull ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">This vehicle is at full capacity.</span>
                </div>
              ) : (
                <>
                  <CapacityIndicator occupied={selectedVehicle.occupied} capacity={selectedVehicle.capacity} />
                  <p className="mt-1.5 text-xs text-muted-foreground">{availableSeats} seat(s) available</p>
                </>
              )}
            </div>
          )}
        </div>

        <FormSection columns={1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Route</Label>
              <select value={form.route_id} onChange={(e) => { set('route_id', e.target.value); set('pickup_point_id', '') }}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select route</option>
                {routes.filter((r) => r.status === 'active').map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Pickup Point</Label>
              <select value={form.pickup_point_id} onChange={(e) => set('pickup_point_id', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                disabled={!form.route_id}>
                <option value="">Select pickup point</option>
                {filteredPickupPoints.map((p) => (
                  <option key={p._id} value={p._id}>{p.name} ({p.time})</option>
                ))}
              </select>
            </div>
          </div>
        </FormSection>
      </div>
    </Drawer>
  )
}
