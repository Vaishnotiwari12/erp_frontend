// ====================================================================
// Module: Students
// Page: Student Houses
//
// Purpose:
// Organize students into houses for activities and events.
//
// Data Source:
// student.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Plus, Hop as Home, Pencil, Trash2, Eye, Users, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { studentService } from '@/services/student.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'House' },
  { key: 'motto', label: 'Motto' },
  { key: 'captain', label: 'Captain' },
  { key: 'students_count', label: 'Students' },
  { key: 'status', label: 'Status' },
]

const COLOR_PRESETS = ['#dc2626', '#2563eb', '#16a34a', '#ca8a04', '#9333ea', '#0891b2', '#c2410c']

export default function StudentHousesPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => studentService.houses(), [])
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editHouse, setEditHouse] = useState(null)
  const [deleteHouse, setDeleteHouse] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.captain.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    students: rows.reduce((sum, r) => sum + (r.students_count || 0), 0),
    inactive: rows.filter((r) => r.status !== 'active').length,
  }), [rows])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'House',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg" style={{ backgroundColor: row.original.color }} aria-hidden="true" />
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.motto}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'captain', header: 'Captain', cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5"><Crown className="h-3.5 w-3.5 text-warning" />{row.original.captain}</span>
      ) },
      {
        accessorKey: 'students_count',
        header: 'Students',
        cell: ({ row }) => <span className="font-medium">{row.original.students_count}</span>,
      },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => formatDate(row.original.createdAt) },
    ],
    [],
  )

  const rowActions = (house) => [
    { label: 'View', icon: Eye, onClick: () => toast({ title: house.name, description: house.motto }) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditHouse(house) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteHouse(house) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Students', to: '/students' }, { label: 'Houses' }]} />
      <PageHeader
        title="Student Houses"
        description="Organize students into houses for activities and events."
        icon={Home}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add House</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Houses" value={stats.total} icon={Home} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={Home} accent="success" />
        <StatCard label="House Members" value={stats.students} icon={Users} accent="chart2" />
        <StatCard label="Inactive" value={stats.inactive} icon={Home} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search houses or captains…" className="max-w-sm" />
        <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="student-houses" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <NoData title="No houses found" actionLabel="Add House" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="student-houses"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Houses deleted' }); refetch() } }]}
          rowActions={(house) => <ActionDropdown actions={rowActions(house)} />}
        />
      )}

      <HouseDrawer open={addOpen} onOpenChange={setAddOpen} title="Add House" onSubmit={async (p) => { toast({ title: 'House added', description: p.name }); setAddOpen(false); refetch() }} />
      <HouseDrawer open={!!editHouse} onOpenChange={(o) => !o && setEditHouse(null)} title="Edit House" initial={editHouse} onSubmit={async (p) => { toast({ title: 'House updated', description: p.name }); setEditHouse(null); refetch() }} />

      <DeleteDialog
        open={!!deleteHouse}
        onOpenChange={(o) => !o && setDeleteHouse(null)}
        entityName={deleteHouse?.name}
        onConfirm={() => { toast({ title: 'House deleted' }); setDeleteHouse(null); refetch() }}
      />
    </div>
  )
}

function HouseDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    color: initial?.color || COLOR_PRESETS[0],
    motto: initial?.motto || '',
    captain: initial?.captain || '',
    status: initial?.status || 'active',
  })
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="House details"
      width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Red House" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Motto</Label>
            <Input value={form.motto} onChange={(e) => setForm((f) => ({ ...f, motto: e.target.value }))} placeholder="House motto" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Captain</Label>
            <Input value={form.captain} onChange={(e) => setForm((f) => ({ ...f, captain: e.target.value }))} placeholder="House captain name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Color</Label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((c) => (
                <button key={c} type="button" aria-label={`Color ${c}`}
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className={`h-8 w-8 rounded-full ring-offset-2 transition ${form.color === c ? 'ring-2 ring-ring' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
