// ====================================================================
// Module: Settings
// Page: Currency Settings
//
// Purpose:
// Manage supported currencies and exchange rates.
//
// Data Source:
// settings.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { DollarSign, Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { useCurrencies } from '@/hooks/useSettings'

const EXPORT_COLS = [
  { key: 'currency_code', label: 'Code' },
  { key: 'currency_name', label: 'Name' },
  { key: 'symbol', label: 'Symbol' },
  { key: 'exchange_rate', label: 'Exchange Rate' },
  { key: 'is_default', label: 'Default' },
  { key: 'status', label: 'Status' },
]

export default function CurrencySettingsPage() {
  const { rows, isLoading, search, setSearch, saveCurrency, deleteCurrency } = useCurrencies()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveCurrency(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    { accessorKey: 'currency_code', header: 'Code' },
    { accessorKey: 'currency_name', header: 'Name' },
    { accessorKey: 'symbol', header: 'Symbol' },
    { accessorKey: 'exchange_rate', header: 'Exchange Rate' },
    { accessorKey: 'is_default', header: 'Default', cell: ({ row }) => row.original.is_default ? <Badge>Default</Badge> : <span className="text-muted-foreground">—</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Settings' }, { label: 'Currencies' }]} />
      <PageHeader
        title="Currency Settings"
        description="Manage supported currencies and exchange rates."
        icon={DollarSign}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Currency</Button>}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search currencies…" className="max-w-sm" />
        <ExportButtons rows={rows} columns={EXPORT_COLS} filename="currencies" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No currencies found" description="Add a new currency to get started." actionLabel="Add Currency" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="currencies"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <CurrencyFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Currency' : 'Add Currency'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Currency Details"
        description={viewRow?.currency_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Code', value: viewRow.currency_code },
              { label: 'Name', value: viewRow.currency_name },
              { label: 'Symbol', value: viewRow.symbol },
              { label: 'Exchange Rate', value: viewRow.exchange_rate },
              { label: 'Default', value: viewRow.is_default ? 'Yes' : 'No' },
              { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
            ].map((f) => (
              <div key={f.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value || '—'}</dd>
              </div>
            ))}
          </dl>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.currency_code}
        onConfirm={() => deleteCurrency(deleteRow._id)}
      />
    </div>
  )
}

function CurrencyFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    currency_code: initial?.currency_code || '',
    currency_name: initial?.currency_name || '',
    symbol: initial?.symbol || '',
    exchange_rate: initial?.exchange_rate ?? 1,
    is_default: initial?.is_default || false,
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Currency configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Currency'}
          submitDisabled={!form.currency_code.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Currency Code <span className="text-destructive">*</span></Label>
            <Input value={form.currency_code} onChange={(e) => set('currency_code', e.target.value.toUpperCase())} placeholder="USD" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Symbol</Label>
            <Input value={form.symbol} onChange={(e) => set('symbol', e.target.value)} placeholder="$" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Currency Name</Label>
            <Input value={form.currency_name} onChange={(e) => set('currency_name', e.target.value)} placeholder="US Dollar" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Exchange Rate</Label>
            <Input type="number" step="0.01" value={form.exchange_rate} onChange={(e) => set('exchange_rate', parseFloat(e.target.value) || 0)} />
          </div>
        </FormSection>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Default Currency</p>
            <p className="text-xs text-muted-foreground">Use as the system default</p>
          </div>
          <input type="checkbox" checked={form.is_default} onChange={(e) => set('is_default', e.target.checked)} className="h-4 w-4" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <select value={form.status} onChange={(e) => set('status', e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
