// ====================================================================
// Module: Fees
// Page: Fees Discount
//
// Purpose:
// Manage scholarships, concessions, and discount rules.
//
// Data Source:
// fees.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { BadgePercent, Plus, Pencil, Trash2, Eye, CircleCheck as CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { DISCOUNT_TYPES } from '@/data/fees.mock'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [{ key: 'name', label: 'Discount' }, { key: 'code', label: 'Code' }, { key: 'type', label: 'Type' }, { key: 'value', label: 'Value' }, { key: 'description', label: 'Description' }, { key: 'status', label: 'Status' }]

export default function FeesDiscountPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => feesService.getFeesDiscounts(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [typeF, setTypeF] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(() => rows.filter((r) => [!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()), status === 'all' || r.status === status, typeF === 'all' || r.type === typeF].every(Boolean)), [rows, search, status, typeF])
  const stats = useMemo(() => ({ total: rows.length, active: rows.filter((r) => r.status === 'active').length, percentage: rows.filter((r) => r.type === 'Percentage').length, fixed: rows.filter((r) => r.type === 'Fixed').length }), [rows])

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Discount', cell: ({ row }) => <button className="text-left font-medium hover:underline" onClick={() => setViewRow(row.original)}>{row.original.name}</button> },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant={row.original.type === 'Percentage' ? 'default' : 'secondary'}>{row.original.type}</Badge> },
    { accessorKey: 'value', header: 'Value', cell: ({ row }) => <span className="font-medium">{row.original.type === 'Percentage' ? `${row.original.value}%` : `$${row.original.value}`}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [{ label: 'View', icon: Eye, onClick: () => setViewRow(r) }, { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) }, { separator: true }, { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) }]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Fees Discount' }]} />
      <PageHeader title="Fees Discount" description="Manage scholarships, concessions, and discount rules." icon={BadgePercent} actions={<><ImportButton onImport={() => toast({ title: 'Import started' })} /><Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Discount</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Discounts" value={stats.total} icon={BadgePercent} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Percentage" value={stats.percentage} icon={BadgePercent} accent="chart2" />
        <StatCard label="Fixed" value={stats.fixed} icon={BadgePercent} accent="chart3" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search discount or code…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="fees-discounts" />
          <select value={typeF} onChange={(e) => setTypeF(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="all">All types</option>{DISCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
        </div>
      </FilterBar>

      {isLoading ? <LoadingSkeleton variant="table" rows={6} cols={5} /> : filtered.length === 0 ? <NoData title="No discounts found" actionLabel="Add Discount" onAction={() => setAddOpen(true)} /> : <DataTable columns={columns} data={filtered} enableExport exportFilename="fees-discounts" rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />}

      <DiscountDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Discount" onSubmit={async (p) => { await feesService.createFeesDiscount(p); toast({ title: 'Discount added', description: p.name }); setAddOpen(false); refetch() }} />
      <DiscountDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Discount" initial={editRow} onSubmit={async (p) => { await feesService.update(editRow._id, p); toast({ title: 'Discount updated' }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Discount Details" description={viewRow?.name} width="sm:max-w-md" footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[{ label: 'Discount Name', value: viewRow.name }, { label: 'Code', value: viewRow.code }, { label: 'Type', value: viewRow.type }, { label: 'Value', value: viewRow.type === 'Percentage' ? `${viewRow.value}%` : `$${viewRow.value}` }, { label: 'Description', value: viewRow.description }, { label: 'Status', value: <StatusBadge status={viewRow.status} /> }, { label: 'Created', value: formatDate(viewRow.createdAt) }].map((r) => (
              <div key={r.label} className="space-y-0.5"><dt className="text-xs font-medium text-muted-foreground">{r.label}</dt><dd className="text-sm font-medium">{r.value}</dd></div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.name} onConfirm={() => { toast({ title: 'Discount deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function DiscountDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({ name: initial?.name || '', code: initial?.code || '', type: initial?.type || 'Percentage', value: initial?.value ?? '', description: initial?.description || '', status: initial?.status || 'active' })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Discount details" width="sm:max-w-md" footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5"><Label className="text-xs">Discount Name <span className="text-destructive">*</span></Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Sibling Concession" required /></div>
          <div className="space-y-1.5"><Label className="text-xs">Code <span className="text-destructive">*</span></Label><Input value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} placeholder="e.g. SIB" required /></div>
          <div className="space-y-1.5"><Label className="text-xs">Type</Label><select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">{DISCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div className="space-y-1.5"><Label className="text-xs">Value <span className="text-destructive">*</span></Label><Input type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))} placeholder={form.type === 'Percentage' ? 'e.g. 10' : 'e.g. 100'} required /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Description</Label><Input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Optional description" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Status</Label><select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
