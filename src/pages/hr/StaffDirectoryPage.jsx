// ====================================================================
// Module: Human Resources
// Page: Staff Directory
//
// Purpose:
// Manage all teaching and non-teaching staff across departments.
//
// Data Source:
// hr.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Plus, Users, UserCheck, UserX, Briefcase, Eye, Pencil, Trash2,
  Phone, Mail, Building2, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useStaff } from '@/hooks/useHR'
import { formatDate, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

// These options power dropdowns in the Add/Edit drawer.
// In a real app they'd come from the departments/designations endpoints.
import { departments, designations } from '@/data/hr.mock'

const EXPORT_COLS = [
  { key: 'employee_id', label: 'Employee ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'department', label: 'Department' },
  { key: 'designation', label: 'Designation' },
  { key: 'joining_date', label: 'Joining Date' },
  { key: 'status', label: 'Status' },
]

const GENDER_OPTIONS = ['Male', 'Female', 'Other']
const BLOOD_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function StaffDirectoryPage() {
  const { toast } = useToast()
  const {
    rows: filtered, stats, deptOptions, isLoading,
    search, setSearch, deptFilter, setDeptFilter, statusFilter, setStatusFilter,
    saveStaff, deleteStaff: removeStaff,
  } = useStaff()

  const [addOpen, setAddOpen] = useState(false)
  const [editStaff, setEditStaff] = useState(null)
  const [viewStaff, setViewStaff] = useState(null)
  const [deleteStaff, setDeleteStaff] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await removeStaff(deleteStaff._id, deleteStaff.name)
      setDeleteStaff(null)
    } finally {
      setDeleting(false)
    }
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Staff Member',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewStaff(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {initials(row.original.name)}
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'employee_id', header: 'Employee ID' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'designation', header: 'Designation' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'joining_date', header: 'Joined', cell: ({ row }) => formatDate(row.original.joining_date) },
  ], [])

  const rowActions = (s) => [
    { label: 'View Details', icon: Eye, onClick: () => setViewStaff(s) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditStaff(s) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteStaff(s) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Staff Directory' }]} />
      <PageHeader
        title="Staff Directory"
        description="Manage all teaching and non-teaching staff across departments."
        icon={Users}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Staff</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Staff" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={UserCheck} accent="success" />
        <StatCard label="Inactive" value={stats.inactive} icon={UserX} accent="warning" />
        <StatCard label="Departments" value={stats.departments} icon={Building2} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or employee ID…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="staff-directory" />
          <SelectFilter value={deptFilter} onChange={setDeptFilter} options={deptOptions} placeholder="All departments" />
          <SelectFilter value={statusFilter} onChange={setStatusFilter} options={['active', 'inactive']} placeholder="All statuses" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={8} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No staff found" actionLabel="Add Staff" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="staff-directory"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => toast({ title: 'Bulk delete triggered' }) }]}
          rowActions={(s) => <ActionDropdown actions={rowActions(s)} />}
        />
      )}

      {/* Add Staff Drawer */}
      <StaffDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Staff Member"
        onSubmit={async (p) => {
          await saveStaff(p)
          setAddOpen(false)
        }}
      />

      {/* Edit Staff Drawer */}
      <StaffDrawer
        open={!!editStaff}
        onOpenChange={(o) => !o && setEditStaff(null)}
        title="Edit Staff Member"
        initial={editStaff}
        onSubmit={async (p) => {
          await saveStaff(p, editStaff._id)
          setEditStaff(null)
        }}
      />

      {/* View Details Drawer */}
      <Drawer
        open={!!viewStaff}
        onOpenChange={(o) => !o && setViewStaff(null)}
        title="Staff Details"
        description={viewStaff?.employee_id}
        width="sm:max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewStaff(null)}>Close</Button>
            <Button onClick={() => { setEditStaff(viewStaff); setViewStaff(null) }}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </>
        }
      >
        {viewStaff && <StaffDetails staff={viewStaff} />}
      </Drawer>

      <DeleteDialog
        open={!!deleteStaff}
        onOpenChange={(o) => !o && setDeleteStaff(null)}
        entityName={deleteStaff?.name}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}

// ─── Small reusable select dropdown used just in this page ────────────────────
function SelectFilter({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
      <option value="all">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

// ─── Staff details view inside the drawer ────────────────────────────────────
function StaffDetails({ staff }) {
  const fields = [
    { label: 'Full Name', value: staff.name },
    { label: 'Employee ID', value: staff.employee_id },
    { label: 'Email', value: staff.email },
    { label: 'Phone', value: staff.phone },
    { label: 'Department', value: staff.department },
    { label: 'Designation', value: staff.designation },
    { label: 'Gender', value: staff.gender },
    { label: 'Date of Birth', value: formatDate(staff.dob) },
    { label: 'Joining Date', value: formatDate(staff.joining_date) },
    { label: 'Salary', value: `$${staff.salary?.toLocaleString()}` },
    { label: 'Blood Group', value: staff.blood_group },
    { label: 'Qualification', value: staff.qualification },
    { label: 'Experience', value: staff.experience },
    { label: 'Institution', value: staff.school_name },
    { label: 'Status', value: <StatusBadge status={staff.status} /> },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {initials(staff.name)}
        </div>
        <div className="flex-1">
          <p className="text-base font-semibold">{staff.name}</p>
          <p className="text-sm text-muted-foreground">{staff.email}</p>
        </div>
        <StatusBadge status={staff.status} />
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.label} className="space-y-0.5">
            <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
            <dd className="text-sm font-medium">{f.value || '—'}</dd>
          </div>
        ))}
      </dl>
      {staff.address && (
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">Address</p>
          <p className="text-sm">{staff.address}</p>
        </div>
      )}
    </div>
  )
}

// ─── Add / Edit staff drawer form ────────────────────────────────────────────
function StaffDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    department: initial?.department || '',
    department_id: initial?.department_id || '',
    designation: initial?.designation || '',
    designation_id: initial?.designation_id || '',
    gender: initial?.gender || 'Male',
    dob: initial?.dob || '',
    joining_date: initial?.joining_date || '',
    salary: initial?.salary ?? '',
    blood_group: initial?.blood_group || '',
    qualification: initial?.qualification || '',
    experience: initial?.experience || '',
    school_name: initial?.school_name || '',
    address: initial?.address || '',
    status: initial?.status || 'active',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title}
      description="Complete staff member details"
      width="sm:max-w-2xl"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save Changes' : 'Add Staff'} onSubmit={() => onSubmit(form)} />}
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-6">
        <FormSection title="Personal Information" columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Full Name <span className="text-destructive">*</span></Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Hannah Kim" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email <span className="text-destructive">*</span></Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="staff@school.edu" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Phone</Label>
            <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555-0000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Gender</Label>
            <SelectInForm value={form.gender} onChange={(v) => set('gender', v)} options={GENDER_OPTIONS} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Date of Birth</Label>
            <Input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Blood Group</Label>
            <SelectInForm value={form.blood_group} onChange={(v) => set('blood_group', v)} options={BLOOD_OPTIONS} placeholder="Select" />
          </div>
        </FormSection>

        <FormSection title="Professional Details" columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Department</Label>
            <SelectInForm
              value={form.department}
              onChange={(v) => {
                const dept = departments.find((d) => d.name === v)
                set('department', v)
                set('department_id', dept?._id || '')
              }}
              options={departments.map((d) => d.name)}
              placeholder="Select department"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Designation</Label>
            <SelectInForm
              value={form.designation}
              onChange={(v) => {
                const desig = designations.find((d) => d.name === v)
                set('designation', v)
                set('designation_id', desig?._id || '')
              }}
              options={designations.map((d) => d.name)}
              placeholder="Select designation"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Joining Date</Label>
            <Input type="date" value={form.joining_date} onChange={(e) => set('joining_date', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Salary (USD)</Label>
            <Input type="number" value={form.salary} onChange={(e) => set('salary', Number(e.target.value))} placeholder="e.g. 55000" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Qualification</Label>
            <Input value={form.qualification} onChange={(e) => set('qualification', e.target.value)} placeholder="e.g. M.Sc Physics" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Experience</Label>
            <Input value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="e.g. 5 years" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Institution</Label>
            <Input value={form.school_name} onChange={(e) => set('school_name', e.target.value)} placeholder="School / College name" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <SelectInForm value={form.status} onChange={(v) => set('status', v)} options={['active', 'inactive']} />
          </div>
        </FormSection>

        <div className="space-y-1.5">
          <Label className="text-xs">Address</Label>
          <Textarea value={form.address} onChange={(e) => set('address', e.target.value)} rows={2} placeholder="Residential address" />
        </div>

        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}

// Inline select reused inside the form
function SelectInForm({ value, onChange, options, placeholder = 'Select' }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}
