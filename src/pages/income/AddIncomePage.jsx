// ====================================================================
// Module: Income
// Page: Add Income
//
// Purpose:
// Manage income records (amount, date, head, note).
//
// Data Source:
// income.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  TrendingUp,
  Plus,
  Eye,
  Pencil,
  Trash2,
  IndianRupee,
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
import { useIncomes } from '@/hooks/useIncome'
import { formatCurrency, formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'income_head_name', label: 'Income Head' },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' },
  { key: 'note', label: 'Note' },
  { key: 'status', label: 'Status' },
]

export default function AddIncomePage() {
  const {
    rows, incomeHeads, stats, isLoading,
    search, setSearch, headFilter, setHeadFilter,
    statusFilter, setStatusFilter, saveIncome, deleteIncome,
  } = useIncomes()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveIncome(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'income_head_name',
      header: 'Income Head',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="font-medium hover:underline">{row.original.income_head_name}</span>
        </button>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.amount)}</span>,
    },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.original.date)}</span> },
    { accessorKey: 'note', header: 'Note', cell: ({ row }) => <span className="text-muted-foreground">{row.original.note || '—'}</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Income' }, { label: 'Add Income' }]} />
      <PageHeader
        title="Add Income"
        description="Manage income records with amounts, dates, and notes."
        icon={TrendingUp}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Income</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Income" value={formatCurrency(stats.total)} icon={IndianRupee} accent="success" />
        <StatCard label="This Month" value={formatCurrency(stats.thisMonth)} icon={TrendingUp} accent="primary" />
        <StatCard label="Entries" value={stats.entries} icon={TrendingUp} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by head or note…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="incomes" />
          <select value={headFilter} onChange={(e) => setHeadFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All heads</option>
            {incomeHeads.map((h) => <option key={h._id} value={h._id}>{h.income_head_name}</option>)}
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
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No income records found" description="Add a new income record to get started." actionLabel="Add Income" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="incomes"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Income Form Drawer used for both Add and Edit. */}
      <IncomeFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Income' : 'Add Income'}
        initial={editRow}
        incomeHeads={incomeHeads}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Income Details"
        description={viewRow?.income_head_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.income_head_name}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(viewRow.amount)}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Amount', value: formatCurrency(viewRow.amount) },
                { label: 'Date', value: formatDate(viewRow.date) },
                { label: 'Note', value: viewRow.note || '—' },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
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
        entityName={deleteRow?.income_head_name}
        onConfirm={() => deleteIncome(deleteRow._id)}
      />
    </div>
  )
}

// ─── Income Form Drawer (shared by Add and Edit) ────────────────────────────
function IncomeFormDrawer({ open, onOpenChange, title, initial, incomeHeads, onSubmit }) {
  const [form, setForm] = useState({
    income_head_id: initial?.income_head_id || '',
    income_head_name: initial?.income_head_name || '',
    amount: initial?.amount || 0,
    date: initial?.date || new Date().toISOString().slice(0, 10),
    note: initial?.note || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // When an income head is selected, auto-fill the name for display.
  const handleHeadChange = (headId) => {
    const head = incomeHeads.find((h) => h._id === headId)
    setForm((f) => ({ ...f, income_head_id: headId, income_head_name: head?.income_head_name || '' }))
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Income record information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Income'}
          submitDisabled={!form.income_head_id || !form.amount}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Income Head <span className="text-destructive">*</span></Label>
            <select value={form.income_head_id} onChange={(e) => handleHeadChange(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select income head</option>
              {incomeHeads.filter((h) => h.status === 'active').map((h) => (
                <option key={h._id} value={h._id}>{h.income_head_name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Amount <span className="text-destructive">*</span></Label>
              <Input type="number" min="0" value={form.amount} onChange={(e) => set('amount', parseFloat(e.target.value) || 0)} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Note</Label>
            <Input value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="Optional note" />
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
