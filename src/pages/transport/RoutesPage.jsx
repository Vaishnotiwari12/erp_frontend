// ====================================================================
// Module: Transport
// Page: Routes
//
// Purpose:
// Manage transport routes, stops, and driver assignments.
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
  Route as RouteIcon,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Ruler,
  User,
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
import { useTransportRoutes } from '@/hooks/useTransport'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Route Name' },
  { key: 'code', label: 'Code' },
  { key: 'distance', label: 'Distance (km)' },
  { key: 'driver_name', label: 'Driver' },
  { key: 'stops', label: 'Stops' },
  { key: 'status', label: 'Status' },
]

export default function RoutesPage() {
  const { toast } = useToast()
  const {
    rows: filtered, drivers, stats, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    saveRoute, deleteRoute,
  } = useTransportRoutes()
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveRoute(payload, id)
    if (id) {
      setEditRow(null)
    } else {
      setAddOpen(false)
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Route',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.name}</span>
          <span className="text-xs text-muted-foreground">{row.original.code}</span>
        </button>
      ),
    },
    { accessorKey: 'distance', header: 'Distance', cell: ({ row }) => `${row.original.distance} km` },
    { accessorKey: 'driver_name', header: 'Driver', cell: ({ row }) => row.original.driver_name || <span className="text-muted-foreground">Unassigned</span> },
    { accessorKey: 'stops', header: 'Stops', cell: ({ row }) => <Badge variant="outline">{row.original.stops.length} stops</Badge> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Transport' }, { label: 'Routes' }]} />
      <PageHeader
        title="Routes"
        description="Manage transport routes, stops, and driver assignments."
        icon={RouteIcon}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Route</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Routes" value={stats.total} icon={RouteIcon} accent="primary" />
        <StatCard label="Active Routes" value={stats.active} icon={RouteIcon} accent="success" />
        <StatCard label="With Driver" value={stats.withDriver} icon={User} accent="chart2" />
        <StatCard label="Total Distance" value={`${stats.totalDistance} km`} icon={Ruler} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by route name, code, or driver…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="transport-routes" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <NoData title="No routes found" description="Create a new route to get started." actionLabel="Add Route" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="transport-routes"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable dialog used for both Add and Edit. */}
      <RouteFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Route' : 'Add Route'}
        initial={editRow}
        drivers={drivers}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer showing route stops and driver info. */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Route Details"
        description={viewRow?.name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <RouteIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.code}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Distance', value: `${viewRow.distance} km` },
                { label: 'Driver', value: viewRow.driver_name || 'Unassigned' },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
                { label: 'Total Stops', value: `${viewRow.stops.length} stops` },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            {/* Ordered stops list — shows the pickup sequence along the route. */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Stops (Pickup Sequence)</p>
              <div className="space-y-2">
                {viewRow.stops.map((stopId, i) => (
                  <div key={stopId} className="flex items-center gap-3 rounded-lg border p-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{stopId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.name}
        onConfirm={async () => {
          await deleteRoute(deleteRow._id)
          setDeleteRow(null)
        }}
      />
    </div>
  )
}

// ─── Route Form Drawer (shared by Add and Edit) ──────────────────────────────
function RouteFormDrawer({ open, onOpenChange, title, initial, drivers, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    code: initial?.code || '',
    distance: initial?.distance || 0,
    driver_id: initial?.driver_id || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // When a driver is selected, store both the id and name for display.
  const handleDriverChange = (driverId) => {
    const driver = drivers.find((d) => d._id === driverId)
    setForm((f) => ({ ...f, driver_id: driverId, driver_name: driver?.name || '' }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Route information and driver assignment"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Create Route'}
          submitDisabled={!form.name.trim() || !form.code.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Route Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. North Campus Loop" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Route Code <span className="text-destructive">*</span></Label>
              <Input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="e.g. NCL-01" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Distance (km)</Label>
              <Input type="number" step="0.1" min="0" value={form.distance} onChange={(e) => set('distance', parseFloat(e.target.value) || 0)} />
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
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
