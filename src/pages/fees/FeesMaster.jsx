import { useMemo, useState } from 'react'
import { Wallet, Plus, Pencil, Trash2, Eye, DollarSign, Repeat, CheckCircle2 } from 'lucide-react'
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
import { FEE_FREQUENCIES, FEE_SESSIONS, classOptions, feesGroups, feesTypes } from '@/data/fees.mock'
import { formatCurrency, formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Fee Name' },
  { key: 'amount', label: 'Amount' },
  { key: 'frequency', label: 'Frequency' },
  { key: 'group', label: 'Group' },
  { key: 'type', label: 'Type' },
  { key: 'class', label: 'Class' },
  { key: 'session', label: 'Session' },
  { key: 'status', label: 'Status' },
]
const GROUP_OPTIONS = feesGroups.map((g) => g.name)
const TYPE_OPTIONS = feesTypes.map((t) => t.name)

export default function FeesMasterPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => feesService.getFeesMaster(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => [!search || r.name.toLowerCase().includes(search.toLowerCase()), status === 'all' || r.status === status].every(Boolean)),
    [rows, search, status],
  )
  const stats = useMemo(() => ({ total: rows.length, active: rows.filter((r) => r.status === 'active').length, totalAmount: rows.reduce((a, b) => a + b.amount, 0), monthly: rows.filter((r) => r.frequency === 'Monthly').length }), [rows])

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Fee Name', cell: ({ row }) => <button className="text-left font-medium hover:underline" onClick={() => setViewRow(row.original)}>{row.original.name}</button> },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount) },
    { accessorKey: 'frequency', header: 'Frequency' },
    { accessorKey: 'group', header: 'Group' },
    { accessorKey: 'class', header: 'Class' },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Fees Master' }]} />
      <PageHeader title="Fees Master" description="Define fee structures with amount, frequency, and scope." icon={Wallet} actions={<><ImportButton onImport={() => toast({ title: 'Import started' })} /><Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Fee</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Fees" value={stats.total} icon={Wallet} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Total Amount" value={formatCurrency(stats.totalAmount)} icon={DollarSign} accent="chart2" />
        <StatCard label="Monthly" value={stats.monthly} icon={Repeat} accent="chart3" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search fee name…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="fees-master" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? <LoadingSkeleton variant="table" rows={6} cols={6} /> : filtered.length === 0 ? <NoData title="No fees found" actionLabel="Add Fee" onAction={() => setAddOpen(true)} /> : <DataTable columns={columns} data={filtered} enableExport exportFilename="fees-master" rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />}

      <FeesMasterDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Fee" onSubmit={async (p) => { await feesService.createFeesMaster(p); toast({ title: 'Fee added', description: p.name }); setAddOpen(false); refetch() }} />
      <FeesMasterDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Fee" initial={editRow} onSubmit={async (p) => { await feesService.update(editRow._id, p); toast({ title: 'Fee updated' }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Fee Details" description={viewRow?.name} width="sm:max-w-md" footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[{ label: 'Fee Name', value: viewRow.name }, { label: 'Amount', value: formatCurrency(viewRow.amount) }, { label: 'Frequency', value: viewRow.frequency }, { label: 'Group', value: viewRow.group }, { label: 'Type', value: viewRow.type }, { label: 'Class', value: viewRow.class }, { label: 'Session', value: viewRow.session }, { label: 'Description', value: viewRow.description }, { label: 'Status', value: <StatusBadge status={viewRow.status} /> }, { label: 'Created', value: formatDate(viewRow.createdAt) }].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.name} onConfirm={() => { toast({ title: 'Fee deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function FeesMasterDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '', amount: initial?.amount ?? '', frequency: initial?.frequency || 'Quarterly', group: initial?.group || '', type: initial?.type || '', class: initial?.class || 'All', session: initial?.session || '2025-2026', description: initial?.description || '', status: initial?.status || 'active',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Fee structure details" width="sm:max-w-md" footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Fee Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Class 10 Tuition" required />
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Amount <span className="text-destructive">*</span></Label><Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} placeholder="e.g. 1200" required /></div>
          <Select label="Frequency" value={form.frequency} onChange={(v) => setForm((f) => ({ ...f, frequency: v }))} options={FEE_FREQUENCIES} />
          <Select label="Group" value={form.group} onChange={(v) => setForm((f) => ({ ...f, group: v }))} options={GROUP_OPTIONS} all="Select group" />
          <Select label="Type" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} options={TYPE_OPTIONS} all="Select type" />
          <Select label="Class" value={form.class} onChange={(v) => setForm((f) => ({ ...f, class: v }))} options={classOptions} />
          <Select label="Session" value={form.session} onChange={(v) => setForm((f) => ({ ...f, session: v }))} options={FEE_SESSIONS} />
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Description</Label><Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional description" /></div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="active">Active</option><option value="inactive">Inactive</option></select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}

function Select({ label, value, onChange, options, all }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
        {all ? <option value="">{all}</option> : null}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}
