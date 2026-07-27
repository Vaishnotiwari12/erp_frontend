// ====================================================================
// Module: Certificate
// Page: Staff ID Card
//
// Purpose:
// Manage staff ID card records with create, edit, view, and delete
// operations. The view drawer renders a visual ID card preview.
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
  User,
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
import { StatusBadge } from '@/components/StatusBadge'
import { useStaffIdCards } from '@/hooks/useCertificate'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'card_name', label: 'Card Name' },
  { key: 'staff_name', label: 'Staff' },
  { key: 'designation', label: 'Designation' },
  { key: 'department', label: 'Department' },
  { key: 'status', label: 'Status' },
]

export default function StaffIdCardPage() {
  const {
    rows, stats, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
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
      accessorKey: 'card_name',
      header: 'Card',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.card_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.staff_name} · {row.original.designation}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'designation', header: 'Designation' },
    { accessorKey: 'department', header: 'Department' },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Certificate' }, { label: 'Staff ID Card' }]} />
      <PageHeader
        title="Staff ID Cards"
        description="Manage staff ID card records and preview card layouts."
        icon={CreditCard}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add ID Card</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total ID Cards" value={stats.total} icon={CreditCard} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={User} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by card name, staff, or staff ID…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="staff-id-cards" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
      ) : rows.length === 0 ? (
        <NoData title="No staff ID cards found" description="Add a new staff ID card to get started." actionLabel="Add ID Card" onAction={() => setAddOpen(true)} />
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

      {/* Detail drawer with ID card preview */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Staff ID Card Details"
        description={viewRow?.card_name}
        width="sm:max-w-lg"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            {/* Visual ID card preview */}
            <div className="mx-auto max-w-sm overflow-hidden rounded-xl border bg-gradient-to-br from-primary/5 to-muted shadow-sm">
              <div className="bg-primary px-4 py-3 text-primary-foreground">
                <p className="text-sm font-semibold">STAFF IDENTITY CARD</p>
                <p className="text-xs opacity-90">Academic Year 2024-25</p>
              </div>
              <div className="flex gap-4 p-4">
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {viewRow.photo_url ? (
                    <img src={viewRow.photo_url} alt={viewRow.staff_name} className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <User className="h-8 w-8" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{viewRow.staff_name}</p>
                  <p className="text-xs text-muted-foreground">{viewRow.designation}</p>
                  <p className="text-xs text-muted-foreground">Dept: {viewRow.department}</p>
                  <p className="text-xs text-muted-foreground">Blood: {viewRow.blood_group}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t bg-muted/30 px-4 py-3 text-xs">
                <div><span className="text-muted-foreground">Staff ID:</span> {viewRow.staff_id}</div>
                <div><span className="text-muted-foreground">Father:</span> {viewRow.father_name}</div>
                <div><span className="text-muted-foreground">DOB:</span> {formatDate(viewRow.dob)}</div>
                <div><span className="text-muted-foreground">Phone:</span> {viewRow.phone}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {viewRow.address}</div>
                <div><span className="text-muted-foreground">Valid till:</span> {formatDate(viewRow.validity)}</div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Status', value: viewRow.status },
                { label: 'Created On', value: formatDate(viewRow.createdAt) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium capitalize">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteRow}
        onOpenChange={(o) => !o && setDeleteRow(null)}
        entityName={deleteRow?.card_name}
        onConfirm={() => deleteStaffIdCard(deleteRow._id)}
      />
    </div>
  )
}

// ─── Staff ID Card Form Drawer (shared by Add and Edit) ───────────────────────
function StaffIdCardFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    card_name: initial?.card_name || '',
    staff_name: initial?.staff_name || '',
    staff_id: initial?.staff_id || '',
    designation: initial?.designation || '',
    department: initial?.department || '',
    father_name: initial?.father_name || '',
    dob: initial?.dob || '',
    address: initial?.address || '',
    phone: initial?.phone || '',
    blood_group: initial?.blood_group || '',
    photo_url: initial?.photo_url || '',
    status: initial?.status || 'active',
    validity: initial?.validity || '2025-12-31',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Staff ID card information"
      width="sm:max-w-lg"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add ID Card'}
          submitDisabled={!form.card_name.trim() || !form.staff_name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Card Name <span className="text-destructive">*</span></Label>
            <Input value={form.card_name} onChange={(e) => set('card_name', e.target.value)} placeholder="e.g. Staff ID - Dr. Priya Nair" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Staff Name <span className="text-destructive">*</span></Label>
              <Input value={form.staff_name} onChange={(e) => set('staff_name', e.target.value)} placeholder="e.g. Dr. Priya Nair" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Staff ID</Label>
              <Input value={form.staff_id} onChange={(e) => set('staff_id', e.target.value)} placeholder="e.g. stf-001" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Designation</Label>
              <Input value={form.designation} onChange={(e) => set('designation', e.target.value)} placeholder="e.g. Principal" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Input value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="e.g. Administration" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Father's Name</Label>
              <Input value={form.father_name} onChange={(e) => set('father_name', e.target.value)} placeholder="Father's name" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Blood Group</Label>
              <Input value={form.blood_group} onChange={(e) => set('blood_group', e.target.value)} placeholder="e.g. O+" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Date of Birth</Label>
              <Input type="date" value={form.dob ? form.dob.split('T')[0] : ''} onChange={(e) => set('dob', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="e.g. 9123456701" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Address</Label>
            <Textarea value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Home address" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Photo URL</Label>
              <Input value={form.photo_url} onChange={(e) => set('photo_url', e.target.value)} placeholder="/photos/staff.jpg" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Valid Until</Label>
              <Input type="date" value={form.validity ? form.validity.split('T')[0] : ''} onChange={(e) => set('validity', e.target.value)} />
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
