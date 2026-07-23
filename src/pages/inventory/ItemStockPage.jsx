// ====================================================================
// Module: Inventory
// Page: Item Stock
//
// Purpose:
// Track item stock levels, value, suppliers, and low-stock alerts.
//
// Data Source:
// inventory.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ShoppingCart, Plus, Eye, Pencil, Trash2, TriangleAlert as AlertTriangle } from 'lucide-react'
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
import { useItemStock } from '@/hooks/useInventory'
import { formatCurrency, formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'item_name', label: 'Item' },
  { key: 'store_name', label: 'Store' },
  { key: 'supplier_name', label: 'Supplier' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'unit_price', label: 'Unit Price' },
  { key: 'total_value', label: 'Total Value' },
  { key: 'date', label: 'Date' },
  { key: 'invoice_number', label: 'Invoice No' },
  { key: 'status', label: 'Status' },
]

export default function ItemStockPage() {
  const {
    rows, items, stores, suppliers, stats, isLoading,
    search, setSearch, storeFilter, setStoreFilter,
    statusFilter, setStatusFilter,
    LOW_STOCK_THRESHOLD, saveItemStock, deleteItemStock,
  } = useItemStock()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveItemStock(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'item_name',
      header: 'Item',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShoppingCart className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.item_name}</span>
            {row.original.quantity < LOW_STOCK_THRESHOLD && (
              <Badge variant="destructive" className="mt-0.5 w-fit">Low Stock</Badge>
            )}
          </div>
        </button>
      ),
    },
    { accessorKey: 'store_name', header: 'Store', cell: ({ row }) => <Badge variant="secondary">{row.original.store_name}</Badge> },
    { accessorKey: 'supplier_name', header: 'Supplier', cell: ({ row }) => <span className="text-sm">{row.original.supplier_name || '—'}</span> },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => (
        <span className={row.original.quantity < LOW_STOCK_THRESHOLD ? 'font-medium text-destructive' : 'font-medium'}>
          {row.original.quantity}
        </span>
      ),
    },
    { accessorKey: 'unit_price', header: 'Unit Price', cell: ({ row }) => formatCurrency(row.original.unit_price) },
    { accessorKey: 'total_value', header: 'Total Value', cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.total_value)}</span> },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: 'invoice_number', header: 'Invoice', cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.invoice_number || '—'}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [LOW_STOCK_THRESHOLD])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Inventory' }, { label: 'Item Stock' }]} />
      <PageHeader
        title="Item Stock"
        description="Track item stock levels, value, suppliers, and low-stock alerts."
        icon={ShoppingCart}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Stock</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Stock Value" value={formatCurrency(stats.total_value)} icon={ShoppingCart} accent="success" />
        <StatCard label="Low Stock Items" value={stats.low_stock_count} icon={AlertTriangle} accent="destructive" />
        <StatCard label="Total Entries" value={stats.total} icon={ShoppingCart} accent="primary" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by item, store, or supplier…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="inventory-stock" />
          <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All stores</option>
            {stores.map((s) => <option key={s._id} value={s._id}>{s.store_name}</option>)}
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
        <LoadingSkeleton variant="table" rows={5} cols={7} />
      ) : rows.length === 0 ? (
        <NoData title="No stock entries found" description="Add a new stock entry to get started." actionLabel="Add Stock" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="inventory-stock"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Stock Form Drawer used for both Add and Edit. */}
      <StockFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Stock' : 'Add Stock'}
        initial={editRow}
        items={items}
        stores={stores}
        suppliers={suppliers}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Stock Details"
        description={viewRow?.item_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.item_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.store_name}</p>
              </div>
              {viewRow.quantity < LOW_STOCK_THRESHOLD && <Badge variant="destructive">Low Stock</Badge>}
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Store', value: viewRow.store_name },
                { label: 'Supplier', value: viewRow.supplier_name || '—' },
                { label: 'Quantity', value: viewRow.quantity },
                { label: 'Unit Price', value: formatCurrency(viewRow.unit_price) },
                { label: 'Total Value', value: formatCurrency(viewRow.total_value) },
                { label: 'Date', value: formatDate(viewRow.date) },
                { label: 'Invoice No', value: viewRow.invoice_number || '—' },
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
        entityName={deleteRow?.item_name}
        onConfirm={() => deleteItemStock(deleteRow._id)}
      />
    </div>
  )
}

// ─── Stock Form Drawer (shared by Add and Edit) ───────────────────────────────
function StockFormDrawer({ open, onOpenChange, title, initial, items, stores, suppliers, onSubmit }) {
  const [form, setForm] = useState({
    item_id: initial?.item_id || '',
    store_id: initial?.store_id || '',
    supplier_id: initial?.supplier_id || '',
    quantity: initial?.quantity ?? 0,
    unit_price: initial?.unit_price ?? 0,
    date: initial?.date || new Date().toISOString().slice(0, 10),
    invoice_number: initial?.invoice_number || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Stock entry information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Stock'}
          submitDisabled={!form.item_id || !form.store_id}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Item <span className="text-destructive">*</span></Label>
            <select value={form.item_id} onChange={(e) => set('item_id', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select item</option>
              {items.filter((i) => i.status === 'active').map((i) => (
                <option key={i._id} value={i._id}>{i.item_name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Store <span className="text-destructive">*</span></Label>
              <select value={form.store_id} onChange={(e) => set('store_id', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select store</option>
                {stores.filter((s) => s.status === 'active').map((s) => (
                  <option key={s._id} value={s._id}>{s.store_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Supplier</Label>
              <select value={form.supplier_id} onChange={(e) => set('supplier_id', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select supplier</option>
                {suppliers.filter((s) => s.status === 'active').map((s) => (
                  <option key={s._id} value={s._id}>{s.supplier_name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Quantity</Label>
              <Input type="number" min="0" value={form.quantity} onChange={(e) => set('quantity', parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Unit Price</Label>
              <Input type="number" min="0" step="0.01" value={form.unit_price} onChange={(e) => set('unit_price', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Invoice No</Label>
              <Input value={form.invoice_number} onChange={(e) => set('invoice_number', e.target.value)} placeholder="INV-2024-000" />
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
