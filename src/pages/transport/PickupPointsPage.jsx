// ====================================================================
// Module: Transport
// Page: Pickup Points
//
// Purpose:
// Manage pickup stops, route mapping, and pickup timings.
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
  Plus,
  Eye,
  Pencil,
  Trash2,
  Clock,
  Navigation,
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
import { usePickupPoints } from '@/hooks/useTransport'
import { useAsyncData } from '@/hooks/useAsyncData'
import { transportService } from '@/services/transport.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Pickup Point' },
  { key: 'route_name', label: 'Route' },
  { key: 'time', label: 'Pickup Time' },
  { key: 'gps_lat', label: 'Latitude' },
  { key: 'gps_lng', label: 'Longitude' },
  { key: 'status', label: 'Status' },
]

export default function PickupPointsPage() {
  const { toast } = useToast()
  const {
    rows: filtered, allPickupPoints: rows, isLoading,
    search, setSearch, routeFilter, setRouteFilter,
    savePickupPoint, deletePickupPoint,
  } = usePickupPoints()
  const { data: routesData } = useAsyncData(() => transportService.getRoutes(), [])
  const [statusFilter, setStatusFilter] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const routes = routesData || []

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((p) => p.status === 'active').length,
    routes: new Set(rows.map((p) => p.route_id)).size,
  }), [rows])

  // Re-filter by status since the hook only filters by search and route
  const filteredByStatus = useMemo(() => filtered.filter((p) => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchStatus
  }), [filtered, statusFilter])

  const handleSave = async (payload, id) => {
    await savePickupPoint(payload, id)
    if (id) {
      setEditRow(null)
    } else {
      setAddOpen(false)
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Pickup Point',
      cell: ({ row }) => (
        <button className="flex items-center gap-2 text-left" onClick={() => setViewRow(row.original)}>
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium hover:underline">{row.original.name}</span>
        </button>
      ),
    },
    { accessorKey: 'route_name', header: 'Route', cell: ({ row }) => row.original.route_name ? <Badge variant="secondary">{row.original.route_name}</Badge> : <span className="text-muted-foreground">—</span> },
    { accessorKey: 'time', header: 'Pickup Time', cell: ({ row }) => (
      <span className="flex items-center gap-1.5 text-sm">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original.time}
      </span>
    ) },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Transport' }, { label: 'Pickup Points' }]} />
      <PageHeader
        title="Pickup Points"
        description="Manage pickup stops, route mapping, and pickup timings."
        icon={MapPin}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Pickup Point</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Pickup Points" value={stats.total} icon={MapPin} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={MapPin} accent="success" />
        <StatCard label="Routes Covered" value={stats.routes} icon={Navigation} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or route…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filteredByStatus} columns={EXPORT_COLS} filename="pickup-points" />
          <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All routes</option>
            {routes.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
          </select>
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
      ) : filteredByStatus.length === 0 ? (
        <NoData title="No pickup points found" description="Create a new pickup point to get started." actionLabel="Add Pickup Point" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filteredByStatus}
          enableSelection
          enableExport
          exportFilename="pickup-points"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <PickupPointFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Pickup Point' : 'Add Pickup Point'}
        initial={editRow}
        routes={routes}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer with GPS placeholder */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Pickup Point Details"
        description={viewRow?.name}
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
                <p className="font-semibold">{viewRow.name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.route_name || 'Unassigned'}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Route', value: viewRow.route_name || 'Unassigned' },
                { label: 'Pickup Time', value: viewRow.time },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            {/* GPS placeholder — shows coordinates with a map icon. */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">GPS Coordinates</p>
              <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
                <Navigation className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-mono">{viewRow.gps_lat}, {viewRow.gps_lng}</p>
                  <p className="text-xs text-muted-foreground">Map integration placeholder</p>
                </div>
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
          await deletePickupPoint(deleteRow._id)
          setDeleteRow(null)
        }}
      />
    </div>
  )
}

// ─── Pickup Point Form Drawer (shared by Add and Edit) ───────────────────────
function PickupPointFormDrawer({ open, onOpenChange, title, initial, routes, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    route_id: initial?.route_id || '',
    time: initial?.time || '07:00',
    gps_lat: initial?.gps_lat || '',
    gps_lng: initial?.gps_lng || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleRouteChange = (routeId) => {
    const route = routes.find((r) => r._id === routeId)
    setForm((f) => ({ ...f, route_id: routeId, route_name: route?.name || '' }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Pickup point information and route mapping"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Pickup Point'}
          submitDisabled={!form.name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Pickup Point Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Main Gate" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1.5">
              <Label className="text-xs">Pickup Time</Label>
              <Input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">GPS Latitude</Label>
              <Input type="number" step="any" value={form.gps_lat} onChange={(e) => set('gps_lat', parseFloat(e.target.value) || '')} placeholder="40.7128" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">GPS Longitude</Label>
              <Input type="number" step="any" value={form.gps_lng} onChange={(e) => set('gps_lng', parseFloat(e.target.value) || '')} placeholder="-74.0060" />
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
