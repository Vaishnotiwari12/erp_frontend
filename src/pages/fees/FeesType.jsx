import { useMemo, useState } from 'react'
import { Tags, Plus, Pencil, Trash2, Eye, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ImportButton } from '@/components/ImportButton'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { feesService } from '@/services/fees.service'
import { feesGroups } from '@/data/fees.mock'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [{ key: 'name', label: 'Type' }, { key: 'code', label: 'Code' }, { key: 'group', label: 'Group' }, { key: 'description', label: 'Description' }, { key: 'status', label: 'Status' }]
const GROUP_OPTIONS = feesGroups.map((g) => g.name)

export default function FeesTypePage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => feesService.getFeesTypes(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [groupF, setGroupF] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(() => rows.filter((r) => [!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()), status === 'all' || r.status === status, groupF === 'all' || r.group === groupF].every(Boolean)), [rows, search, status, groupF])
  const stats = useMemo(() => ({ total: rows.length, active: rows.filter((r) => r.status === 'active').length, groups: new Set(rows.map((r) => r.group)).size }), [rows])

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Type', cell: ({ row }) => <button className="text-left font-medium hover:underline" onClick={() => setViewRow(row.original)}>{row.original.name}</button> },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'group', header: 'Group' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [{ label: 'View', icon: Eye, onClick: () => setViewRow(r) }, { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) }, { separator: true }, { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) }]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Fees Type' }]} />
      <PageHeader title="Fees Type" description="Define individual fee types within groups." icon={Tags} actions={<><ImportButton onImport={() => toast({ title: 'Import started' })} /><Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Type</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Types" value={stats.total} icon={Tags} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Groups" value={stats.groups} icon={Tags} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search type or code…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="fees-types" />
          <select value={groupF} onChange={(e) => setGroupF(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="all">All groups</option>{GROUP_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
        </div>
      </FilterBar>

      {isLoading ? <LoadingSkeleton variant="table" rows={6} cols={4} /> : filtered.length === 0 ? <NoData title="No types found" actionLabel="Add Type" onAction={() => setAddOpen(true)} /> : <DataTable columns={columns} data={filtered} enableExport exportFilename="fees-types" rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />}

      <TypeDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Type" onSubmit={async (p) => { await feesService.createFeesType(p); toast({ title: 'Type added', description: p.name }); setAddOpen(false); refetch() }} />
      <TypeDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Type" initial={editRow} onSubmit={async (p) => { await feesService.update(editRow._id, p); toast({ title: 'Type updated' }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Type Details" description={viewRow?.name} width="sm:max-w-md" footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[{ label: 'Type Name', value: viewRow.name }, { label: 'Code', value: viewRow.code }, { label: 'Group', value: viewRow.group }, { label: 'Description', value: viewRow.description }, { label: 'Status', value: <StatusBadge status={viewRow.status} /> }, { label: 'Created', value: formatDate(viewRow.createdAt) }].map((r) => (
              <div key={r.label} className="space-y-0.5"><dt className="text-xs font-medium text-muted-foreground">{r.label}</dt><dd className="text-sm font-medium">{r.value}</dd></div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.name} onConfirm={() => { toast({ title: 'Type deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function TypeDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({ name: initial?.name || '', code: initial?.code || '', group: initial?.group || '', description: initial?.description || '', status: initial?.status || 'active' })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Fee type details" width="sm:max-w-md" footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5"><Label className="text-xs">Type Name <span className="text-destructive">*</span></Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Tuition Fee" required /></div>
          <div className="space-y-1.5"><Label className="text-xs">Code <span className="text-destructive">*</span></Label><Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. TF" required /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Group</Label><select value={form.group} onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="">Select group</option>{GROUP_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Description</Label><Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional description" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Status</Label><select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
