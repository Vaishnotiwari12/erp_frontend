// ====================================================================
// Module: Inventory
// Page: Add Item
//
// Purpose:
// Manage inventory items, their categories, units, and descriptions.
//
// Data Source:
// inventory.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Box,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
import { useItems } from '@/hooks/useInventory'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'item_name', label: 'Item Name' },
  { key: 'category_name', label: 'Category' },
  { key: 'unit', label: 'Unit' },
  { key: 'description', label: 'Description' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
]

export default function AddItemPage() {
  const {
    rows, categories, stats, isLoading,
    search, setSearch, categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    saveItem, deleteItem,
  } = useItems()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveItem(payload, id)
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
            <Box className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.item_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.unit}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'category_name', header: 'Category', cell: ({ row }) => <Badge variant="secondary">{row.original.category_name}</Badge> },
    { accessorKey: 'unit', header: 'Unit', cell: ({ row }) => <Badge variant="outline">{row.original.unit}</Badge> },
    { accessorKey: 'description', header: 'Description', cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.description || '—'}</span> },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Inventory' }, { label: 'Add Item' }]} />
      <PageHeader
        title="Items"
        description="Manage inventory items, their categories, units, and descriptions."
        icon={Box}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Items" value={stats.total} icon={Box} accent="primary" />
        <StatCard label="Active Items" value={stats.active} icon={Box} accent="success" />
        <StatCard label="Categories" value={stats.categories} icon={Box} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by item name or category…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="inventory-items" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.category_name}</option>)}
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
        <NoData title="No items found" description="Add a new item to get started." actionLabel="Add Item" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="inventory-items"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Item Form Drawer used for both Add and Edit. */}
      <ItemFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Item' : 'Add Item'}
        initial={editRow}
        categories={categories}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Item Details"
        description={viewRow?.item_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Box className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.item_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.category_name}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Category', value: viewRow.category_name },
                { label: 'Unit', value: viewRow.unit },
                { label: 'Description', value: viewRow.description || '—' },
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
        onConfirm={() => deleteItem(deleteRow._id)}
      />
    </div>
  )
}

// ─── Item Form Drawer (shared by Add and Edit) ────────────────────────────────
function ItemFormDrawer({ open, onOpenChange, title, initial, categories, onSubmit }) {
  const [form, setForm] = useState({
    item_name: initial?.item_name || '',
    category_id: initial?.category_id || '',
    unit: initial?.unit || 'pcs',
    description: initial?.description || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Item information and configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Item'}
          submitDisabled={!form.item_name.trim() || !form.category_id}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Item Name <span className="text-destructive">*</span></Label>
            <Input value={form.item_name} onChange={(e) => set('item_name', e.target.value)} placeholder="e.g. Office Chair" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Category <span className="text-destructive">*</span></Label>
              <select value={form.category_id} onChange={(e) => set('category_id', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Select category</option>
                {categories.filter((c) => c.status === 'active').map((c) => (
                  <option key={c._id} value={c._id}>{c.category_name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Unit</Label>
              <Input value={form.unit} onChange={(e) => set('unit', e.target.value)} placeholder="e.g. pcs, ream, litr" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief description of the item" rows={3} />
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
