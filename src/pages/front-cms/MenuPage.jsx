// ====================================================================
// Module: Front CMS
// Page: Menus
//
// Purpose:
// Manage website navigation menus — header, footer, and sidebar.
//
// Data Source:
// frontCms.service.js (via useMenus hook)
//
// Backend model: menu { menu_name, link, parent_id, order, menu_type }
//   - createMenu(payload) / updateMenu(id, payload) use JSON body
//
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Menu,
  Plus,
  Eye,
  Pencil,
  Trash2,
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
import { useMenus } from '@/hooks/useFrontCms'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'menu_name', label: 'Menu Name' },
  { key: 'menu_type', label: 'Menu Type' },
  { key: 'link', label: 'Link' },
  { key: 'order', label: 'Order' },
  { key: 'createdAt', label: 'Created At' },
]

const MENU_TYPES = ['Header', 'Footer', 'Sidebar']

export default function MenuPage() {
  const {
    rows, stats, isLoading,
    search, setSearch, typeFilter, setTypeFilter,
    saveMenu, deleteMenu,
  } = useMenus()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveMenu(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'menu_name',
      header: 'Menu Name',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Menu className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.menu_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.link}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'menu_type', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.original.menu_type}</Badge> },
    { accessorKey: 'link', header: 'Link', cell: ({ row }) => <span className="font-mono text-sm">{row.original.link}</span> },
    { accessorKey: 'order', header: 'Order', cell: ({ row }) => <span className="font-mono text-sm">{row.original.order}</span> },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front CMS' }, { label: 'Menus' }]} />
      <PageHeader
        title="Menus"
        description="Manage website navigation menus — header, footer, and sidebar."
        icon={Menu}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Menu</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Menus" value={stats.total} icon={Menu} accent="primary" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search menus…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="menus" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All types</option>
            {MENU_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No menus found" description="Add a new menu item to get started." actionLabel="Add Menu" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="menus"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <MenuFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Menu' : 'Add Menu'}
        initial={editRow}
        menus={rows}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Menu Details"
        description={viewRow?.menu_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Menu className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.menu_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.link}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Menu Type', value: viewRow.menu_type },
                { label: 'Order', value: viewRow.order },
                { label: 'Parent Menu', value: rows.find((m) => m._id === viewRow.parent_id)?.menu_name || 'None' },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.menu_name}
        onConfirm={() => deleteMenu(deleteRow._id)}
      />
    </div>
  )
}

// ─── Menu Form Drawer (shared by Add and Edit) ──────────────────────────────────
function MenuFormDrawer({ open, onOpenChange, title, initial, menus, onSubmit }) {
  const [form, setForm] = useState({
    menu_name: initial?.menu_name || '',
    menu_type: initial?.menu_type || 'Header',
    parent_id: initial?.parent_id || null,
    link: initial?.link || '/',
    order: initial?.order ?? 1,
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  // Parent menu options exclude the current item to prevent self-reference.
  const parentOptions = menus.filter((m) => m._id !== initial?._id)

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Menu item configuration"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Menu'}
          submitDisabled={!form.menu_name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Menu Name <span className="text-destructive">*</span></Label>
            <Input value={form.menu_name} onChange={(e) => set('menu_name', e.target.value)} placeholder="Home" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Menu Type</Label>
            <select value={form.menu_type} onChange={(e) => set('menu_type', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {MENU_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Parent Menu</Label>
            <select value={form.parent_id || ''} onChange={(e) => set('parent_id', e.target.value || null)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">None (top level)</option>
              {parentOptions.map((m) => <option key={m._id} value={m._id}>{m.menu_name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Link</Label>
            <Input value={form.link} onChange={(e) => set('link', e.target.value)} placeholder="/" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Order</Label>
            <Input type="number" min="0" value={form.order} onChange={(e) => set('order', parseInt(e.target.value) || 0)} />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
