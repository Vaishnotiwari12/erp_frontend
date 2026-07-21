// Setup Front Office — admins configure the dropdown options used across the
// Front Office module: visit purposes, complaint types, enquiry sources, call
// purposes, and postal types. Each category is a small CRUD list.
//
// Rather than building five separate pages, we render all categories in a
// tabbed interface. Each tab reuses the same SetupList component, so adding
// a new category later is just adding a new tab config.

import { useMemo, useState } from 'react'
import {
  Settings,
  Plus,
  Pencil,
  Trash2,
  Eye,
  DoorOpen,
  MessageSquare,
  Users,
  PhoneCall,
  Mail,
  Tags,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { StatusBadge } from '@/components/StatusBadge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { frontOfficeService } from '@/services/frontOffice.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

// Tab configuration — each entry maps a setup category to its display metadata.
// `key` matches the field name in the setup object returned by the service.
const CATEGORIES = [
  { key: 'visitPurposes', label: 'Visit Purposes', singular: 'Visit Purpose', icon: DoorOpen, accent: 'primary' },
  { key: 'complaintTypes', label: 'Complaint Types', singular: 'Complaint Type', icon: MessageSquare, accent: 'destructive' },
  { key: 'enquirySources', label: 'Enquiry Sources', singular: 'Enquiry Source', icon: Users, accent: 'chart2' },
  { key: 'callPurposes', label: 'Call Purposes', singular: 'Call Purpose', icon: PhoneCall, accent: 'chart3' },
  { key: 'postalTypes', label: 'Postal Types', singular: 'Postal Type', icon: Mail, accent: 'chart4' },
]

export default function SetupFrontOfficePage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontOfficeService.getSetup(), [])
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].key)
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const setup = data || {}

  // Current category's items — derived from the active tab so we don't
  // need a separate state variable that could drift out of sync.
  const currentItems = useMemo(() => setup[activeTab] || [], [setup, activeTab])
  const currentConfig = CATEGORIES.find((c) => c.key === activeTab)

  const stats = useMemo(() => ({
    total: CATEGORIES.reduce((sum, c) => sum + (setup[c.key]?.length || 0), 0),
    active: CATEGORIES.reduce((sum, c) => sum + (setup[c.key]?.filter((i) => i.status === 'active').length || 0), 0),
    inactive: CATEGORIES.reduce((sum, c) => sum + (setup[c.key]?.filter((i) => i.status === 'inactive').length || 0), 0),
    categories: CATEGORIES.length,
  }), [setup])

  const handleSave = async (payload, id) => {
    if (id) {
      await frontOfficeService.updateSetupItem(activeTab, id, payload)
      toast({ title: `${currentConfig.singular} updated` })
      setEditRow(null)
    } else {
      await frontOfficeService.createSetupItem(activeTab, payload)
      toast({ title: `${currentConfig.singular} created` })
      setAddOpen(false)
    }
    refetch()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Tags className="h-4 w-4" />
          </div>
          <span className="font-medium hover:underline">{row.original.name}</span>
        </button>
      ),
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'createdAt', header: 'Created', cell: ({ row }) => formatDate(row.original.createdAt) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Front Office' }, { label: 'Setup' }]} />
      <PageHeader
        title="Setup Front Office"
        description="Configure dropdown options used across the Front Office module."
        icon={Settings}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add {currentConfig.singular}</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Items" value={stats.total} icon={Tags} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={Settings} accent="success" />
        <StatCard label="Inactive" value={stats.inactive} icon={Settings} accent="warning" />
        <StatCard label="Categories" value={stats.categories} icon={Settings} accent="chart2" />
      </div>

      {/* Tab bar — one tab per setup category */}
      <div className="flex flex-wrap gap-1 rounded-xl border bg-muted/30 p-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeTab === cat.key
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={isActive
                ? 'inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium shadow-sm'
                : 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              }
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={3} />
      ) : currentItems.length === 0 ? (
        <NoData title={`No ${currentConfig.label.toLowerCase()} found`} description={`Add a ${currentConfig.singular.toLowerCase()} to get started.`} actionLabel={`Add ${currentConfig.singular}`} onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={currentItems}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      <SetupItemFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? `Edit ${currentConfig.singular}` : `New ${currentConfig.singular}`}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* View drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title={`${currentConfig.singular} Details`}
        description={viewRow?.name}
        width="sm:max-w-sm"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Name', value: viewRow.name },
              { label: 'Status', value: <StatusBadge status={viewRow.status} /> },
              { label: 'Created', value: formatDate(viewRow.createdAt) },
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
        entityName={deleteRow?.name}
        onConfirm={async () => {
          await frontOfficeService.deleteSetupItem(activeTab, deleteRow._id)
          toast({ title: `${currentConfig.singular} deleted` })
          setDeleteRow(null)
          refetch()
        }}
      />
    </div>
  )
}

// Shared form drawer for Create and Edit setup items.
// Every setup item has the same shape (name + status), so one form serves all.
function SetupItemFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Setup item configuration"
      width="sm:max-w-sm"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Create'}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Item name" required />
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
