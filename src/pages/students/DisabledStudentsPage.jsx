// ====================================================================
// Module: Students
// Page: Disabled Students
//
// Purpose:
// View and restore inactive, suspended, or disabled students.
//
// Data Source:
// student.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Ban, Eye, RotateCcw, Trash2, UserX, Power,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { studentService } from '@/services/student.service'
import { formatDate, fullName, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'name', label: 'Student' },
  { key: 'email', label: 'Email' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'school_name', label: 'Institution' },
  { key: 'status', label: 'Status' },
]

export default function DisabledStudentsPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => studentService.disabled(), [])
  const [search, setSearch] = useState('')
  const [viewStudent, setViewStudent] = useState(null)
  const [deleteStudent, setDeleteStudent] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const name = fullName(r.name)
      return !search || name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()) || (r.admission_no || '').toLowerCase().includes(search.toLowerCase())
    }),
    [rows, search],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    disabled: rows.filter((r) => r.status === 'disabled').length,
    inactive: rows.filter((r) => r.status === 'inactive').length,
    suspended: rows.filter((r) => r.status === 'suspended').length,
  }), [rows])

  const handleRestore = async (student) => {
    toast({ title: 'Student restored', description: `${fullName(student.name)} is now active.` })
    refetch()
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Student',
        cell: ({ row }) => (
          <button className="flex items-center gap-3 text-left" onClick={() => setViewStudent(row.original)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {initials(row.original.name)}
            </div>
            <div>
              <p className="font-medium hover:underline">{fullName(row.original.name)}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </button>
        ),
      },
      { accessorKey: 'admission_no', header: 'Admission No' },
      { accessorKey: 'class', header: 'Class' },
      { accessorKey: 'school_name', header: 'Institution' },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { accessorKey: 'admission_date', header: 'Admitted', cell: ({ row }) => formatDate(row.original.admission_date) },
    ],
    [],
  )

  const rowActions = (student) => [
    { label: 'View', icon: Eye, onClick: () => setViewStudent(student) },
    { label: 'Restore', icon: RotateCcw, onClick: () => handleRestore(student) },
    { separator: true },
    { label: 'Delete Permanently', icon: Trash2, variant: 'destructive', onClick: () => setDeleteStudent(student) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Students', to: '/students' }, { label: 'Disabled' }]} />
      <PageHeader
        title="Disabled Students"
        description="View and restore inactive, suspended, or disabled students."
        icon={Ban}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Disabled" value={stats.total} icon={Ban} accent="destructive" />
        <StatCard label="Disabled" value={stats.disabled} icon={Power} accent="destructive" />
        <StatCard label="Inactive" value={stats.inactive} icon={UserX} accent="warning" />
        <StatCard label="Suspended" value={stats.suspended} icon={Ban} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search disabled students…" className="max-w-sm" />
        <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="disabled-students" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No disabled students" description="All students are currently active." icon={Ban} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="disabled-students"
          bulkActions={[
            { label: 'Restore', icon: RotateCcw, onClick: () => { toast({ title: 'Students restored' }); refetch() } },
            { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Students deleted' }); refetch() } },
          ]}
          rowActions={(student) => <ActionDropdown actions={rowActions(student)} />}
        />
      )}

      <Drawer
        open={!!viewStudent}
        onOpenChange={(o) => !o && setViewStudent(null)}
        title="Student Details"
        description={viewStudent ? `Admission No. ${viewStudent.admission_no}` : ''}
        width="sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewStudent(null)}>Close</Button>
            <Button onClick={() => { handleRestore(viewStudent); setViewStudent(null) }}>
              <RotateCcw className="mr-2 h-4 w-4" /> Restore
            </Button>
          </>
        }
      >
        {viewStudent ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Full Name', value: fullName(viewStudent.name) },
              { label: 'Email', value: viewStudent.email },
              { label: 'Mobile', value: viewStudent.mobile || '—' },
              { label: 'Admission No.', value: viewStudent.admission_no },
              { label: 'Class', value: viewStudent.class },
              { label: 'Institution', value: viewStudent.school_name },
              { label: 'Guardian', value: viewStudent.guardian_name || '—' },
              { label: 'Status', value: viewStudent.status },
              { label: 'Admission Date', value: formatDate(viewStudent.admission_date) },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium capitalize">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog
        open={!!deleteStudent}
        onOpenChange={(o) => !o && setDeleteStudent(null)}
        entityName={deleteStudent ? fullName(deleteStudent.name) : ''}
        onConfirm={() => { toast({ title: 'Student permanently deleted' }); setDeleteStudent(null); refetch() }}
      />
    </div>
  )
}
