// ====================================================================
// Module: Inventory
// Page: Issue Item
//
// Purpose:
// Issue inventory items to students and staff, and track returns.
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
  ClipboardList,
  Plus,
  Eye,
  Trash2,
  RotateCcw,
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
import { useIssueItems } from '@/hooks/useInventory'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'item_name', label: 'Item' },
  { key: 'issued_to_name', label: 'Issued To' },
  { key: 'issued_to_type', label: 'Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'issue_date', label: 'Issue Date' },
  { key: 'return_date', label: 'Return Date' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created At' },
]

export default function IssueItemPage() {
  const {
    rows, items, stats, isLoading,
    search, setSearch, typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    createIssueItem, returnItem, deleteIssueItem,
  } = useIssueItems()

  const [addOpen, setAddOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [returnRow, setReturnRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleAdd = async (payload) => {
    await createIssueItem(payload)
    setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'item_name',
      header: 'Item',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-4 w-4" />
          </div>
          <span className="font-medium hover:underline">{row.original.item_name}</span>
        </button>
      ),
    },
    {
      accessorKey: 'issued_to_name',
      header: 'Issued To',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.issued_to_name}</span>
          <Badge variant={row.original.issued_to_type === 'student' ? 'default' : 'secondary'} className={row.original.issued_to_type === 'staff' ? 'mt-0.5 w-fit bg-orange-100 text-orange-700 hover:bg-orange-100' : 'mt-0.5 w-fit'}>
            {row.original.issued_to_type}
          </Badge>
        </div>
      ),
    },
    { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => <span className="font-medium">{row.original.quantity}</span> },
    { accessorKey: 'issue_date', header: 'Issue Date', cell: ({ row }) => formatDate(row.original.issue_date) },
    { accessorKey: 'return_date', header: 'Return Date', cell: ({ row }) => row.original.return_date ? formatDate(row.original.return_date) : <span className="text-muted-foreground">Not Returned</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Return Item', icon: RotateCcw, onClick: () => setReturnRow(r), disabled: r.status !== 'issued' },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Inventory' }, { label: 'Issue Item' }]} />
      <PageHeader
        title="Issue Items"
        description="Issue inventory items to students and staff, and track returns."
        icon={ClipboardList}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Issue Item</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Issues" value={stats.total} icon={ClipboardList} accent="primary" />
        <StatCard label="Currently Issued" value={stats.issued} icon={ClipboardList} accent="chart2" />
        <StatCard label="Returned" value={stats.returned} icon={ClipboardList} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by item or issued to…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="inventory-issues" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All types</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="issued">Issued</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No issues found" description="Issue an item to get started." actionLabel="Issue Item" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="inventory-issues"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Issue Form Drawer. */}
      <IssueFormDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        items={items}
        onSubmit={handleAdd}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Issue Details"
        description={viewRow?.item_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.item_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.issued_to_name}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Issued To', value: viewRow.issued_to_name },
                { label: 'Type', value: viewRow.issued_to_type },
                { label: 'Quantity', value: viewRow.quantity },
                { label: 'Issue Date', value: formatDate(viewRow.issue_date) },
                { label: 'Return Date', value: viewRow.return_date ? formatDate(viewRow.return_date) : 'Not Returned' },
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

      {/* Return confirmation */}
      <DeleteDialog
        open={!!returnRow}
        onOpenChange={(o) => !o && setReturnRow(null)}
        title="Return Item"
        entityName={returnRow?.item_name}
        description={`This will mark ${returnRow?.item_name} issued to ${returnRow?.issued_to_name} as returned.`}
        confirmLabel="Return"
        onConfirm={() => returnItem(returnRow._id, returnRow.issued_to_name)}
      />

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.item_name}
        onConfirm={() => deleteIssueItem(deleteRow._id)}
      />
    </div>
  )
}

// ─── Issue Form Drawer ────────────────────────────────────────────────────────
function IssueFormDrawer({ open, onOpenChange, items, onSubmit }) {
  const [form, setForm] = useState({
    item_id: '',
    issued_to_type: 'student',
    issued_to_name: '',
    quantity: 1,
    issue_date: new Date().toISOString().slice(0, 10),
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Issue Item"
      description="Issue an inventory item to a student or staff member"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Issue"
          submitDisabled={!form.item_id || !form.issued_to_name.trim()}
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
              <Label className="text-xs">Issued To Type</Label>
              <select value={form.issued_to_type} onChange={(e) => set('issued_to_type', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Quantity</Label>
              <Input type="number" min="1" value={form.quantity} onChange={(e) => set('quantity', parseInt(e.target.value) || 1)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Issued To Name <span className="text-destructive">*</span></Label>
            <Input value={form.issued_to_name} onChange={(e) => set('issued_to_name', e.target.value)} placeholder="e.g. Aarav Sharma" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Issue Date</Label>
            <Input type="date" value={form.issue_date} onChange={(e) => set('issue_date', e.target.value)} />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
