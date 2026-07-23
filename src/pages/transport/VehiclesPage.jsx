// ====================================================================
// Module: Transport
// Page: Vehicles
//
// Purpose:
// Manage transport vehicles, drivers, capacity, and documentation.
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
  Bus,
  Plus,
  Eye,
  Pencil,
  Trash2,
  CalendarClock,
  ShieldCheck,
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
import { CapacityIndicator } from '@/components/CapacityIndicator'
import { useVehicles } from '@/hooks/useTransport'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'vehicle_number', label: 'Vehicle Number' },
  { key: 'registration_number', label: 'Registration' },
  { key: 'driver_name', label: 'Driver' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'occupied', label: 'Occupied' },
  { key: 'route_name', label: 'Route' },
  { key: 'insurance_expiry', label: 'Insurance Expiry' },
  { key: 'fitness_expiry', label: 'Fitness Expiry' },
  { key: 'status', label: 'Status' },
]

// Check if an expiry date is within 30 days — used to flag soon-to-expire docs.
function isExpiringSoon(dateStr) {
  if (!dateStr) return false
  const days = (new Date(dateStr) - new Date()) / 86400000
  return days >= 0 && days <= 30
}

function isExpired(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export default function VehiclesPage() {
  const { toast } = useToast()
  const {
    rows: filtered, drivers, routes, stats, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    saveVehicle, deleteVehicle,
  } = useVehicles()
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveVehicle(payload, id)
    if (id) {
      setEditRow(null)
    } else {
      setAddOpen(false)
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'vehicle_number',
      header: 'Vehicle',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bus className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.vehicle_number}</span>
            <span className="text-xs text-muted-foreground font-mono">{row.original.registration_number}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'driver_name', header: 'Driver', cell: ({ row }) => row.original.driver_name || <span className="text-muted-foreground">Unassigned</span> },
    { accessorKey: 'route_name', header: 'Route', cell: ({ row }) => row.original.route_name ? <Badge variant="secondary">{row.original.route_name}</Badge> : <span className="text-muted-foreground">—</span> },
    {
      accessorKey: 'capacity',
      header: 'Capacity',
      cell: ({ row }) => <CapacityIndicator occupied={row.original.occupied} capacity={row.original.capacity} className="w-28" />,
    },
    {
      accessorKey: 'insurance_expiry',
      header: 'Insurance',
      cell: ({ row }) => {
        const d = row.original.insurance_expiry
        return (
          <span className={cn('text-sm', isExpired(d) ? 'text-destructive font-medium' : isExpiringSoon(d) ? 'text-warning font-medium' : '')}>
            {formatDate(d)}
          </span>
        )
      },
    },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Transport' }, { label: 'Vehicles' }]} />
      <PageHeader
        title="Vehicles"
        description="Manage transport vehicles, drivers, capacity, and documentation."
        icon={Bus}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Vehicle</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Vehicles" value={stats.total} icon={Bus} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={Bus} accent="success" />
        <StatCard label="Total Capacity" value={stats.totalCapacity} icon={Bus} accent="chart2" />
        <StatCard label="Seats Occupied" value={stats.totalOccupied} icon={Bus} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by vehicle number, registration, or driver…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="transport-vehicles" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No vehicles found" description="Add a new vehicle to get started." actionLabel="Add Vehicle" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="transport-vehicles"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <VehicleFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Vehicle' : 'Add Vehicle'}
        initial={editRow}
        drivers={drivers}
        routes={routes}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Vehicle Details"
        description={viewRow?.vehicle_number}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bus className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.vehicle_number}</p>
                <p className="text-xs text-muted-foreground font-mono">{viewRow.registration_number}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Driver', value: viewRow.driver_name || 'Unassigned' },
                { label: 'Route', value: viewRow.route_name || 'Unassigned' },
                { label: 'Capacity', value: `${viewRow.capacity} seats` },
                { label: 'Occupied', value: `${viewRow.occupied} seats` },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <CapacityIndicator occupied={viewRow.occupied} capacity={viewRow.capacity} />

            {/* Expiry alerts — highlight insurance and fitness expiry dates. */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Documentation</p>
              <div className={cn('flex items-center justify-between rounded-lg border p-3', isExpired(viewRow.insurance_expiry) ? 'border-destructive/20 bg-destructive/5' : isExpiringSoon(viewRow.insurance_expiry) ? 'border-warning/20 bg-warning/5' : 'border-border')}>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Insurance Expiry</span>
                </div>
                <span className={cn('text-sm font-medium', isExpired(viewRow.insurance_expiry) ? 'text-destructive' : isExpiringSoon(viewRow.insurance_expiry) ? 'text-warning' : '')}>
                  {formatDate(viewRow.insurance_expiry)}
                </span>
              </div>
              <div className={cn('flex items-center justify-between rounded-lg border p-3', isExpired(viewRow.fitness_expiry) ? 'border-destructive/20 bg-destructive/5' : isExpiringSoon(viewRow.fitness_expiry) ? 'border-warning/20 bg-warning/5' : 'border-border')}>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Fitness Expiry</span>
                </div>
                <span className={cn('text-sm font-medium', isExpired(viewRow.fitness_expiry) ? 'text-destructive' : isExpiringSoon(viewRow.fitness_expiry) ? 'text-warning' : '')}>
                  {formatDate(viewRow.fitness_expiry)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.vehicle_number}
        onConfirm={async () => {
          await deleteVehicle(deleteRow._id)
          setDeleteRow(null)
        }}
      />
    </div>
  )
}

// ─── Vehicle Form Drawer (shared by Add and Edit) ────────────────────────────
function VehicleFormDrawer({ open, onOpenChange, title, initial, drivers, routes, onSubmit }) {
  const [form, setForm] = useState({
    vehicle_number: initial?.vehicle_number || '',
    registration_number: initial?.registration_number || '',
    driver_id: initial?.driver_id || '',
    route_id: initial?.route_id || '',
    capacity: initial?.capacity || 42,
    insurance_expiry: initial?.insurance_expiry || '',
    fitness_expiry: initial?.fitness_expiry || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleDriverChange = (driverId) => {
    const driver = drivers.find((d) => d._id === driverId)
    setForm((f) => ({ ...f, driver_id: driverId, driver_name: driver?.name || '' }))
  }

  const handleRouteChange = (routeId) => {
    const route = routes.find((r) => r._id === routeId)
    setForm((f) => ({ ...f, route_id: routeId, route_name: route?.name || '' }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Vehicle information and documentation"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Vehicle'}
          submitDisabled={!form.vehicle_number.trim() || !form.registration_number.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Vehicle Number <span className="text-destructive">*</span></Label>
              <Input value={form.vehicle_number} onChange={(e) => set('vehicle_number', e.target.value)} placeholder="e.g. BUS-001" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Registration Number <span className="text-destructive">*</span></Label>
              <Input value={form.registration_number} onChange={(e) => set('registration_number', e.target.value)} placeholder="e.g. REG-2021-001" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Driver</Label>
              <select value={form.driver_id} onChange={(e) => handleDriverChange(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Unassigned</option>
                {drivers.filter((d) => d.status === 'active').map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Route</Label>
              <select value={form.route_id} onChange={(e) => handleRouteChange(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Unassigned</option>
                {routes.filter((r) => r.status === 'active').map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Capacity</Label>
              <Input type="number" min="1" value={form.capacity} onChange={(e) => set('capacity', parseInt(e.target.value) || 1)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Insurance Expiry</Label>
              <Input type="date" value={form.insurance_expiry} onChange={(e) => set('insurance_expiry', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Fitness Expiry</Label>
              <Input type="date" value={form.fitness_expiry} onChange={(e) => set('fitness_expiry', e.target.value)} />
            </div>
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
