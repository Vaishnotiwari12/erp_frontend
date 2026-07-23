// ====================================================================
// Module: Students
// Page: Students
//
// Purpose:
// Browse and manage all students across tenant institutions.
//
// Data Source:
// student.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, GraduationCap, Users, UserCheck, UserX, Eye, Pencil, Trash2, Download, Upload, Ban, MoveHorizontal as MoreHorizontal } from 'lucide-react'
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
import { StudentForm } from '@/components/StudentForm'
import { useStudents } from '@/hooks/useStudents'
import { STATUS_OPTIONS } from '@/constants/navigation'
import { formatDate, fullName, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const FILTER_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'school_name', label: 'Institution' },
  { key: 'guardian_name', label: 'Guardian' },
  { key: 'status', label: 'Status' },
  { key: 'admission_date', label: 'Admitted' },
]

export default function StudentsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const {
    rows: filtered,
    classOptions,
    stats,
    isLoading,
    search, setSearch,
    status, setStatus,
    classFilter, setClassFilter,
    saveStudent,
    deleteStudent: removeStudent,
    bulkDelete,
  } = useStudents()

  const [addOpen, setAddOpen] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [viewStudent, setViewStudent] = useState(null)
  const [deleteStudent, setDeleteStudent] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await removeStudent(deleteStudent._id, deleteStudent.name)
      setDeleteStudent(null)
    } finally {
      setDeleting(false)
    }
  }

  const handleBulkDelete = async (selected) => {
    await bulkDelete(selected)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Student',
        cell: ({ row }) => (
          <button className="flex items-center gap-3 text-left" onClick={() => setViewStudent(row.original)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
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
      { accessorKey: 'guardian_name', header: 'Guardian' },
      { accessorKey: 'category', header: 'Category' },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { accessorKey: 'admission_date', header: 'Admitted', cell: ({ row }) => formatDate(row.original.admission_date) },
    ],
    [],
  )

  const rowActions = (student) => [
    { label: 'View Details', icon: Eye, onClick: () => setViewStudent(student) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditStudent(student) },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteStudent(student) },
  ]

  const bulkActions = [
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: handleBulkDelete },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Students' }]} />
      <PageHeader
        title="Students"
        description="Browse and manage all students across tenant institutions."
        icon={GraduationCap}
        actions={
          <>
            <ImportButton onImport={() => toast({ title: 'Import started' })} />
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Active" value={stats.active} icon={UserCheck} accent="success" trend={12} trendLabel="this term" />
        <StatCard label="Inactive" value={stats.inactive} icon={UserX} accent="warning" />
        <StatCard label="Suspended / Disabled" value={stats.suspended} icon={Ban} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, or admission no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={FILTER_COLUMNS} filename="students" />
          <FilterSelect value={status} onChange={setStatus} options={[{ value: 'all', label: 'All statuses' }, ...STATUS_OPTIONS]} />
          <FilterSelect value={classFilter} onChange={setClassFilter} options={classOptions} />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={8} cols={8} />
      ) : filtered.length === 0 ? (
        <NoData
          title="No students found"
          description="Try adjusting your filters or add a new student."
          actionLabel="Add Student"
          onAction={() => setAddOpen(true)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="students"
          bulkActions={bulkActions}
          rowActions={(student) => <ActionDropdown actions={rowActions(student)} />}
        />
      )}

      {/* Add drawer */}
      <Drawer
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add New Student"
        description="Create a new student record"
        width="sm:max-w-2xl"
        footer={
          <DrawerFooter
            onCancel={() => setAddOpen(false)}
            submitLabel="Create Student"
            submitDisabled={false}
          />
        }
      >
        <StudentForm
          onSubmit={async (payload) => {
            await saveStudent(payload)
            setAddOpen(false)
          }}
          submitLabel="Create Student"
        />
      </Drawer>

      {/* Edit drawer */}
      <Drawer
        open={!!editStudent}
        onOpenChange={(o) => !o && setEditStudent(null)}
        title="Edit Student"
        description={editStudent ? fullName(editStudent.name) : ''}
        width="sm:max-w-2xl"
        footer={<DrawerFooter onCancel={() => setEditStudent(null)} submitLabel="Save Changes" />}
      >
        {editStudent ? (
          <StudentForm
            initial={editStudent}
            onSubmit={async (payload) => {
              await saveStudent(payload, editStudent._id)
              setEditStudent(null)
            }}
            submitLabel="Save Changes"
          />
        ) : null}
      </Drawer>

      {/* View drawer */}
      <Drawer
        open={!!viewStudent}
        onOpenChange={(o) => !o && setViewStudent(null)}
        title="Student Details"
        description={viewStudent ? `Admission No. ${viewStudent.admission_no}` : ''}
        width="sm:max-w-xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewStudent(null)}>Close</Button>
            <Button onClick={() => { setEditStudent(viewStudent); setViewStudent(null) }}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </>
        }
      >
        {viewStudent ? <StudentDetails student={viewStudent} /> : null}
      </Drawer>

      <DeleteDialog
        open={!!deleteStudent}
        onOpenChange={(o) => !o && setDeleteStudent(null)}
        entityName={deleteStudent ? fullName(deleteStudent.name) : ''}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function StudentDetails({ student }) {
  const rows = [
    { label: 'Full Name', value: fullName(student.name) },
    { label: 'Email', value: student.email },
    { label: 'Mobile', value: student.mobile || '—' },
    { label: 'Admission No.', value: student.admission_no },
    { label: 'Class', value: `${student.class} · Section ${student.section || '—'}` },
    { label: 'Institution', value: student.school_name },
    { label: 'Guardian', value: student.guardian_name || '—' },
    { label: 'Gender', value: student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : '—' },
    { label: 'Date of Birth', value: formatDate(student.dob) },
    { label: 'Category', value: student.category || '—' },
    { label: 'House', value: student.house || '—' },
    { label: 'Blood Group', value: student.blood_group || '—' },
    { label: 'Nationality', value: student.nationality || '—' },
    { label: 'Admission Date', value: formatDate(student.admission_date) },
  ]
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {initials(student.name)}
        </div>
        <div>
          <p className="text-base font-semibold">{fullName(student.name)}</p>
          <p className="text-sm text-muted-foreground">{student.email}</p>
        </div>
        <div className="ml-auto"><StatusBadge status={student.status} /></div>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="space-y-0.5">
            <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
            <dd className="text-sm font-medium text-foreground">{r.value}</dd>
          </div>
        ))}
      </dl>
      {student.address ? (
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-muted-foreground">Address</p>
          <p className="text-sm text-foreground">{student.address}</p>
        </div>
      ) : null}
    </div>
  )
}
