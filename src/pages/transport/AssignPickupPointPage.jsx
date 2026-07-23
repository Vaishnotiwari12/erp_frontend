// ====================================================================
// Module: Transport
// Page: Assign Pickup Point
//
// Purpose:
// Assign pickup points and timings to students along routes.
//
// Data Source:
// transport.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  MapPin,
  Eye,
  Trash2,
  Clock,
  Search,
  UserCheck,
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
import { useAsyncData } from '@/hooks/useAsyncData'
import { transportService } from '@/services/transport.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'pickup_point_name', label: 'Pickup Point' },
  { key: 'route_name', label: 'Route' },
  { key: 'pickup_time', label: 'Pickup Time' },
  { key: 'status', label: 'Status' },
]

export default function AssignPickupPointPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => transportService.getVehicleAssignments(), [])
  const { data: routesData } = useAsyncData(() => transportService.getRoutes(), [])
  const { data: pickupPointsData } = useAsyncData(() => transportService.getPickupPoints(), [])
  const [search, setSearch] = useState('')
  const [routeFilter, setRouteFilter] = useState('all')
  const [assignOpen, setAssignOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const routes = routesData || []
  const pickupPoints = pickupPointsData || []

  const filtered = useMemo(() => rows.filter((a) => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.student_name.toLowerCase().includes(q) || a.admission_no.toLowerCase().includes(q) || (a.pickup_point_name || '').toLowerCase().includes(q)
    const matchRoute = routeFilter === 'all' || a.route_id === routeFilter
    return matchSearch && matchRoute
  }), [rows, search, routeFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    withPickup: rows.filter((a) => a.pickup_point_id).length,
    routes: new Set(rows.map((a) => a.route_id)).size,
  }), [rows])

  const handleAssign = async (payload) => {
    await transportService.updateAssignment(payload._id || `vas-${Date.now()}`, payload)
    toast({ title: 'Pickup point assigned', description: payload.student_name })
    setAssignOpen(false)
    refetch()
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
    { accessorKey: 'pickup_point_name', header: 'Pickup Point', cell: ({ row }) => (
      <span className="flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original.pickup_point_name || '—'}
      </span>
    ) },
    { accessorKey: 'route_name', header: 'Route', cell: ({ row }) => <Badge variant="secondary">{row.original.route_name}</Badge> },
    { accessorKey: 'pickup_time', header: 'Time', cell: ({ row }) => (
      <span className="flex items-center gap-1.5 text-sm">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original.pickup_time || '—'}
      </span>
    ) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { separator: true },
    { label: 'Remove', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Transport' }, { label: 'Assign Pickup Point' }]} />
      <PageHeader
        title="Assign Pickup Point"
        description="Assign pickup points and timing to students along routes."
        icon={MapPin}
        actions={<Button onClick={() => setAssignOpen(true)}><UserCheck className="mr-2 h-4 w-4" /> Assign Pickup Point</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Assignments" value={stats.total} icon={UserCheck} accent="primary" />
        <StatCard label="With Pickup Point" value={stats.withPickup} icon={MapPin} accent="success" />
        <StatCard label="Routes Covered" value={stats.routes} icon={MapPin} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student, admission no, or pickup point…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="pickup-assignments" />
          <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All routes</option>
            {routes.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <NoData title="No assignments found" description="Assign a pickup point to a student to get started." actionLabel="Assign Pickup Point" onAction={() => setAssignOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="pickup-assignments"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <AssignPickupPointDrawer
        open={assignOpen}
        onOpenChange={setAssignOpen}
        routes={routes}
        pickupPoints={pickupPoints}
        onSubmit={handleAssign}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Pickup Assignment Details"
        description={viewRow?.student_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.student_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.admission_no} · {viewRow.class}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Pickup Point', value: viewRow.pickup_point_name || '—' },
                { label: 'Route', value: viewRow.route_name || '—' },
                { label: 'Pickup Time', value: viewRow.pickup_time || '—' },
                { label: 'Vehicle', value: viewRow.vehicle_number || '—' },
                { label: 'Assigned On', value: formatDate(viewRow.assigned_at) },
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
        entityName={deleteRow?.student_name}
        onConfirm={async () => {
          await transportService.deleteAssignment(deleteRow._id)
          toast({ title: 'Assignment removed' })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// ─── Assign Pickup Point Drawer ──────────────────────────────────────────────
// Student selection → route selection → pickup point (filtered by route).
function AssignPickupPointDrawer({ open, onOpenChange, routes, pickupPoints, onSubmit }) {
  const [form, setForm] = useState({
    student_name: '',
    student_id: '',
    admission_no: '',
    class: '',
    route_id: '',
    pickup_point_id: '',
  })
  const [studentSearch, setStudentSearch] = useState('')

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Filter pickup points by selected route — cascading dropdown.
  const filteredPickupPoints = useMemo(() => {
    if (!form.route_id) return []
    return pickupPoints.filter((p) => p.route_id === form.route_id && p.status === 'active')
  }, [pickupPoints, form.route_id])

  const selectedPickup = pickupPoints.find((p) => p._id === form.pickup_point_id)
  const selectedRoute = routes.find((r) => r._id === form.route_id)

  const handleSubmit = () => {
    if (!form.student_name.trim() || !form.route_id || !form.pickup_point_id) return
    onSubmit({
      ...form,
      route_name: selectedRoute?.name || '',
      pickup_point_name: selectedPickup?.name || '',
      pickup_time: selectedPickup?.time || '',
    })
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Assign Pickup Point"
      description="Select a student, route, and pickup point"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Assign"
          submitDisabled={!form.student_name.trim() || !form.route_id || !form.pickup_point_id}
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

        {/* Route selection */}
        <div className="space-y-1.5">
          <Label className="text-xs">Route <span className="text-destructive">*</span></Label>
          <select value={form.route_id} onChange={(e) => { set('route_id', e.target.value); set('pickup_point_id', '') }}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="">Select route</option>
            {routes.filter((r) => r.status === 'active').map((r) => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Pickup point selection — filtered by route, shows pickup time. */}
        <div className="space-y-2">
          <Label className="text-xs">Pickup Point <span className="text-destructive">*</span></Label>
          <select value={form.pickup_point_id} onChange={(e) => set('pickup_point_id', e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            disabled={!form.route_id}>
            <option value="">Select pickup point</option>
            {filteredPickupPoints.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({p.time})</option>
            ))}
          </select>
          {/* Show pickup time when a point is selected */}
          {selectedPickup && (
            <div className="flex items-center gap-2 rounded-lg border bg-muted/20 p-2.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Pickup time: <span className="font-medium">{selectedPickup.time}</span></span>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  )
}
