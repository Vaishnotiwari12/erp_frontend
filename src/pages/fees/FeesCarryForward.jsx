// ====================================================================
// Module: Fees
// Page: Fees Carry Forward
//
// Purpose:
// Carry forward fee credits and debits across sessions.
//
// Data Source:
// fees.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ArrowLeftRight, Plus, Pencil, Trash2, Eye, CircleCheck as CheckCircle2 } from 'lucide-react'
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
import { FEE_SESSIONS } from '@/data/fees.mock'
import { formatCurrency, formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [{ key: 'student_name', label: 'Student' }, { key: 'admission_no', label: 'Admission No' }, { key: 'session', label: 'Session' }, { key: 'class', label: 'Class' }, { key: 'amount', label: 'Amount' }, { key: 'type', label: 'Type' }, { key: 'reason', label: 'Reason' }, { key: 'status', label: 'Status' }]
const CF_TYPES = ['Credit', 'Debit']

export default function FeesCarryForwardPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => feesService.getCarryForward(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [typeF, setTypeF] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(() => rows.filter((r) => [!search || r.student_name.toLowerCase().includes(search.toLowerCase()) || r.admission_no.toLowerCase().includes(search.toLowerCase()), status === 'all' || r.status === status, typeF === 'all' || r.type === typeF].every(Boolean)), [rows, search, status, typeF])
  const stats = useMemo(() => ({ total: rows.length, active: rows.filter((r) => r.status === 'active').length, credit: rows.filter((r) => r.type === 'Credit').reduce((a, b) => a + b.amount, 0), debit: rows.filter((r) => r.type === 'Debit').reduce((a, b) => a + b.amount, 0) }), [rows])

  const columns = useMemo(() => [
    { accessorKey: 'student_name', header: 'Student', cell: ({ row }) => <button className="text-left font-medium hover:underline" onClick={() => setViewRow(row.original)}>{row.original.student_name}</button> },
    { accessorKey: 'admission_no', header: 'Admission No' },
    { accessorKey: 'session', header: 'Session' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount) },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant={row.original.type === 'Credit' ? 'default' : 'destructive'}>{row.original.type}</Badge> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [{ label: 'View', icon: Eye, onClick: () => setViewRow(r) }, { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) }, { separator: true }, { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) }]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Fees Carry Forward' }]} />
      <PageHeader title="Fees Carry Forward" description="Carry forward fee credits and debits across sessions." icon={ArrowLeftRight} actions={<><ImportButton onImport={() => toast({ title: 'Import started' })} /><Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Record</Button></>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Records" value={stats.total} icon={ArrowLeftRight} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={CheckCircle2} accent="success" />
        <StatCard label="Total Credit" value={formatCurrency(stats.credit)} icon={ArrowLeftRight} accent="chart2" />
        <StatCard label="Total Debit" value={formatCurrency(stats.debit)} icon={ArrowLeftRight} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student or admission no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="fees-carry-forward" />
          <select value={typeF} onChange={(e) => setTypeF(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="all">All types</option>{CF_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
        </div>
      </FilterBar>

      {isLoading ? <LoadingSkeleton variant="table" rows={6} cols={7} /> : filtered.length === 0 ? <NoData title="No records found" actionLabel="Add Record" onAction={() => setAddOpen(true)} /> : <DataTable columns={columns} data={filtered} enableExport exportFilename="fees-carry-forward" rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />}

      <CFDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Record" onSubmit={async (p) => { await feesService.createCarryForward(p); toast({ title: 'Record added' }); setAddOpen(false); refetch() }} />
      <CFDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Record" initial={editRow} onSubmit={async (p) => { await feesService.update(editRow._id, p); toast({ title: 'Record updated' }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Carry Forward Details" description={viewRow?.student_name} width="sm:max-w-md" footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[{ label: 'Student', value: viewRow.student_name }, { label: 'Admission No', value: viewRow.admission_no }, { label: 'Session', value: viewRow.session }, { label: 'Class', value: viewRow.class }, { label: 'Amount', value: formatCurrency(viewRow.amount) }, { label: 'Type', value: <Badge variant={viewRow.type === 'Credit' ? 'default' : 'destructive'}>{viewRow.type}</Badge> }, { label: 'Reason', value: viewRow.reason }, { label: 'Status', value: <StatusBadge status={viewRow.status} /> }, { label: 'Created', value: formatDate(viewRow.createdAt) }].map((r) => (
              <div key={r.label} className="space-y-0.5"><dt className="text-xs font-medium text-muted-foreground">{r.label}</dt><dd className="text-sm font-medium">{r.value}</dd></div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.student_name} onConfirm={() => { toast({ title: 'Record deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function CFDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({ student_name: initial?.student_name || '', admission_no: initial?.admission_no || '', session: initial?.session || '2024-2025', class: initial?.class || '', amount: initial?.amount ?? '', type: initial?.type || 'Credit', reason: initial?.reason || '', status: initial?.status || 'active' })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Carry forward details" width="sm:max-w-md" footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5"><Label className="text-xs">Student Name <span className="text-destructive">*</span></Label><Input value={form.student_name} onChange={(e) => setForm((f) => ({ ...f, student_name: e.target.value }))} placeholder="e.g. Aarav Sharma" required /></div>
          <div className="space-y-1.5"><Label className="text-xs">Admission No <span className="text-destructive">*</span></Label><Input value={form.admission_no} onChange={(e) => setForm((f) => ({ ...f, admission_no: e.target.value }))} placeholder="e.g. ADM-1001" required /></div>
          <div className="space-y-1.5"><Label className="text-xs">Session</Label><select value={form.session} onChange={(e) => setForm((f) => ({ ...f, session: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">{FEE_SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          <div className="space-y-1.5"><Label className="text-xs">Class</Label><Input value={form.class} onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))} placeholder="e.g. Class 10" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Amount <span className="text-destructive">*</span></Label><Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} placeholder="e.g. 320" required /></div>
          <div className="space-y-1.5"><Label className="text-xs">Type</Label><select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">{CF_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Reason</Label><Input value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} placeholder="e.g. Overpayment refund carried forward" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Status</Label><select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
