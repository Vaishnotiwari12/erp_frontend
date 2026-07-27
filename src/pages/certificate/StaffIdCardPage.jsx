// ====================================================================
// Module: Certificate
// Page: Staff ID Card
//
// Purpose:
// Manage staff ID card designs with create, edit, view, and delete
// operations.
//
// Data Source:
// certificate.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  CreditCard,
  Plus,
  Eye,
  Pencil,
  Trash2,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { useStaffIdCards } from '@/hooks/useCertificate'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'layout', label: 'Layout' },
  { key: 'fields_to_show', label: 'Fields To Show' },
  { key: 'createdAt', label: 'Created At' },
]

export default function StaffIdCardPage() {
  const {
    rows, stats, isLoading,
    search, setSearch,
    saveStaffIdCard, deleteStaffIdCard,
  } = useStaffIdCards()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveStaffIdCard(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'layout',
      header: 'Layout',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.layout}</span>
            <span className="text-xs text-muted-foreground">{(row.original.fields_to_show || []).join(', ')}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'fields_to_show', header: 'Fields To Show', cell: ({ row }) => (row.original.fields_to_show || []).join(', ') },
    { accessorKey: 'createdAt', header: 'Created At', cell: ({ row }) => formatDate(row.original.createdAt) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Certificate' }, { label: 'Staff ID Card' }]} />
      <PageHeader
        title="Staff ID Cards"
        description="Manage staff ID card designs and layouts."
        icon={CreditCard}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add ID Card</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total ID Cards" value={stats.total} icon={CreditCard} accent="primary" />
        <StatCard label="Total" value={stats.total} icon={FileText} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by layout…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="staff-id-cards" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={3} />
      ) : rows.length === 0 ? (
        <NoData title="No staff ID cards found" description="Add a new staff ID card design to get started." actionLabel="Add ID Card" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="staff-id-cards"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Staff ID Card Form Drawer used for both Add and Edit. */}
      <StaffIdCardFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit ID Card' : 'Add ID Card'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Staff ID Card Details"
        description={viewRow?.layout}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.layout}</p>
                <p className="text-xs text-muted-foreground">{(viewRow.fields_to_show || []).join(', ')}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Layout', value: viewRow.layout },
                { label: 'Fields To Show', value: (viewRow.fields_to_show || []).join(', ') },
                { label: 'Template Config', value: typeof viewRow.template_config === 'object' ? JSON.stringify(viewRow.template_config) : viewRow.template_config },
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
        entityName={deleteRow?.layout}
        onConfirm={() => deleteStaffIdCard(deleteRow._id)}
      />
    </div>
  )
}

// ─── Staff ID Card Form Drawer (shared by Add and Edit) ──────────────────────
function StaffIdCardFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    layout: initial?.layout || '',
    fields_to_show: Array.isArray(initial?.fields_to_show) ? initial.fields_to_show.join(', ') : (initial?.fields_to_show || ''),
    template_config: initial?.template_config ? (typeof initial.template_config === 'object' ? JSON.stringify(initial.template_config, null, 2) : initial.template_config) : '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const buildPayload = () => {
    const fields = form.fields_to_show
      ? form.fields_to_show.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    let templateConfig = form.template_config
    if (form.template_config && form.template_config.trim()) {
      try {
        templateConfig = JSON.parse(form.template_config)
      } catch {
        // keep as string if invalid JSON
        templateConfig = form.template_config
      }
    }
    return {
      layout: form.layout,
      fields_to_show: fields,
      template_config: templateConfig,
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Staff ID card design information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add ID Card'}
          submitDisabled={!form.layout.trim()}
          onSubmit={() => onSubmit(buildPayload())}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(buildPayload()) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Layout <span className="text-destructive">*</span></Label>
            <Input value={form.layout} onChange={(e) => set('layout', e.target.value)} placeholder="e.g. Standard Staff Vertical" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Fields To Show</Label>
            <Input value={form.fields_to_show} onChange={(e) => set('fields_to_show', e.target.value)} placeholder="e.g. name, designation, department, photo" />
            <p className="text-xs text-muted-foreground">Comma-separated list of fields to display on the card.</p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Template Config</Label>
            <Textarea value={form.template_config} onChange={(e) => set('template_config', e.target.value)} placeholder='{"theme":"blue","size":"standard"}' rows={4} />
            <p className="text-xs text-muted-foreground">JSON object for template configuration.</p>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
