// ====================================================================
// Module: Human Resources
// Page: Disabled Staff
//
// Purpose:
// View, restore, or permanently delete disabled staff members.
//
// Data Source:
// hr.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Ban, Eye, RotateCcw, Trash2, UserX, Power } from 'lucide-react'
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
import { Drawer } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hrService } from '@/services/hr.service'
import { formatDate, initials, formatCurrency } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'employee_id', label: 'Employee ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'department', label: 'Department' },
  { key: 'designation', label: 'Designation' },
  { key: 'status', label: 'Status' },
  { key: 'joining_date', label: 'Joining Date' },
]

export default function DisabledStaffPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => hrService.getDisabledStaff(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewStaff, setViewStaff] = useState(null)
  const [deleteStaff, setDeleteStaff] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.employee_id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    disabled: rows.filter((r) => r.status === 'disabled').length,
    inactive: rows.filter((r) => r.status === 'inactive').length,
    departments: new Set(rows.map((r) => r.department)).size,
  }), [rows])

  const handleRestore = async (member) => {
    await hrService.restoreStaff(member._id)
    toast({ title: 'Staff restored', description: `${member.name} is now active.` })
    refetch()
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await hrService.deleteStaff(deleteStaff._id)
      toast({ title: 'Staff permanently deleted', description: deleteStaff.name })
      setDeleteStaff(null)
      refetch()
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
          {/* Avatar from initials — same pattern as StaffDirectoryPage */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
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
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: 'joining_date', header: 'Joined', cell: ({ row }) => formatDate(row.original.joining_date) },
  ], [])

  const rowActions = (member) => [
    { label: 'View Details', icon: Eye, onClick: () => setViewStaff(member) },
    { label: 'Restore', icon: RotateCcw, onClick: () => handleRestore(member) },
    { separator: true },
    { label: 'Delete Permanently', icon: Trash2, variant: 'destructive', onClick: () => setDeleteStaff(member) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Disabled Staff' }]} />
      <PageHeader
        title="Disabled Staff"
        description="View and restore disabled or inactive staff members."
        icon={Ban}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Disabled" value={stats.total} icon={Ban} accent="destructive" />
        <StatCard label="Disabled" value={stats.disabled} icon={Power} accent="destructive" />
        <StatCard label="Inactive" value={stats.inactive} icon={UserX} accent="warning" />
        <StatCard label="Departments" value={stats.departments} icon={UserX} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or employee ID…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="disabled-staff" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="disabled">Disabled</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData
          title="No disabled staff"
          description="All staff members are currently active."
          icon={Ban}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="disabled-staff"
          bulkActions={[
            {
              label: 'Restore Selected',
              icon: RotateCcw,
              onClick: async (selected) => {
                // Restore each selected staff in sequence
                for (const m of selected) await hrService.restoreStaff(m._id)
                toast({ title: `${selected.length} staff members restored` })
                refetch()
              },
            },
            {
              label: 'Delete Selected',
              icon: Trash2,
              variant: 'destructive',
              onClick: async (selected) => {
                for (const m of selected) await hrService.deleteStaff(m._id)
                toast({ title: `${selected.length} staff members deleted` })
                refetch()
              },
            },
          ]}
          rowActions={(member) => <ActionDropdown actions={rowActions(member)} />}
        />
      )}

      {/* View Staff Details Drawer */}
      <Drawer
        open={!!viewStaff}
        onOpenChange={(o) => !o && setViewStaff(null)}
        title="Staff Details"
        description={viewStaff ? `${viewStaff.employee_id} — ${viewStaff.designation}` : ''}
        width="sm:max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewStaff(null)}>Close</Button>
            <Button
              onClick={() => {
                handleRestore(viewStaff)
                setViewStaff(null)
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Restore
            </Button>
          </>
        }
      >
        {viewStaff && (
          <div className="space-y-6">
            {/* Staff summary header */}
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
                {initials(viewStaff.name)}
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold">{viewStaff.name}</p>
                <p className="text-sm text-muted-foreground">{viewStaff.email}</p>
                <p className="text-xs text-muted-foreground">{viewStaff.designation} · {viewStaff.department}</p>
              </div>
              <StatusBadge status={viewStaff.status} />
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                { label: 'Employee ID', value: viewStaff.employee_id },
                { label: 'Phone', value: viewStaff.phone || '—' },
                { label: 'Department', value: viewStaff.department },
                { label: 'Designation', value: viewStaff.designation },
                { label: 'Gender', value: viewStaff.gender ? viewStaff.gender.charAt(0).toUpperCase() + viewStaff.gender.slice(1) : '—' },
                { label: 'Date of Birth', value: formatDate(viewStaff.dob) },
                { label: 'Joining Date', value: formatDate(viewStaff.joining_date) },
                { label: 'Qualification', value: viewStaff.qualification || '—' },
                { label: 'Experience', value: viewStaff.experience || '—' },
                { label: 'Blood Group', value: viewStaff.blood_group || '—' },
                { label: 'School / Branch', value: viewStaff.school_name || '—' },
                { label: 'Basic Salary', value: formatCurrency(viewStaff.salary) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value}</dd>
                </div>
              ))}
              {viewStaff.address && (
                <div className="space-y-0.5 sm:col-span-2">
                  <dt className="text-xs font-medium text-muted-foreground">Address</dt>
                  <dd className="text-sm">{viewStaff.address}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </Drawer>

      <DeleteDialog
        open={!!deleteStaff}
        onOpenChange={(o) => !o && setDeleteStaff(null)}
        title="Permanently Delete Staff?"
        description="This action is irreversible. All records for this staff member will be removed."
        entityName={deleteStaff?.name}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
