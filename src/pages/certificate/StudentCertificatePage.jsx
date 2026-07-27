// ====================================================================
// Module: Certificate
// Page: Student Certificate
//
// Purpose:
// Manage student certificates (Character, Transfer, Migration,
// Bonafide) with create, edit, view, and delete operations.
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
  Award,
  Plus,
  Eye,
  Pencil,
  Trash2,
  FileText,
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
import { useStudentCertificates } from '@/hooks/useCertificate'
import { formatDate } from '@/utils/format'

const CERTIFICATE_TYPES = [
  'Character Certificate',
  'Transfer Certificate',
  'Migration Certificate',
  'Bonafide Certificate',
]

const EXPORT_COLS = [
  { key: 'certificate_name', label: 'Certificate Name' },
  { key: 'certificate_type', label: 'Type' },
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class_name', label: 'Class' },
  { key: 'status', label: 'Status' },
  { key: 'issue_date', label: 'Issue Date' },
]

export default function StudentCertificatePage() {
  const {
    rows, stats, isLoading,
    search, setSearch, typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    saveStudentCertificate, deleteStudentCertificate,
  } = useStudentCertificates()

  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const handleSave = async (payload, id) => {
    await saveStudentCertificate(payload, id)
    if (id) setEditRow(null)
    else setAddOpen(false)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'certificate_name',
      header: 'Certificate',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.certificate_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.student_name} · {row.original.admission_no}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'certificate_type', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.original.certificate_type}</Badge> },
    { accessorKey: 'class_name', header: 'Class' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'issue_date', header: 'Issue Date', cell: ({ row }) => formatDate(row.original.issue_date) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Certificate' }, { label: 'Student Certificate' }]} />
      <PageHeader
        title="Student Certificates"
        description="Manage student certificates — Character, Transfer, Migration, and Bonafide."
        icon={Award}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Certificate</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Certificates" value={stats.total} icon={FileText} accent="primary" />
        <StatCard label="Issued" value={stats.issued} icon={Award} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, student, or admission no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="student-certificates" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All types</option>
            {CERTIFICATE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="issued">Issued</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No certificates found" description="Add a new student certificate to get started." actionLabel="Add Certificate" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="student-certificates"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Reusable Certificate Form Drawer used for both Add and Edit. */}
      <StudentCertificateFormDrawer
        open={addOpen || !!editRow}
        onOpenChange={(o) => { if (!o) { setAddOpen(false); setEditRow(null) } }}
        title={editRow ? 'Edit Certificate' : 'Add Certificate'}
        initial={editRow}
        onSubmit={(payload) => handleSave(payload, editRow?._id)}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Certificate Details"
        description={viewRow?.certificate_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.certificate_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.certificate_type}</p>
              </div>
              <StatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Student', value: viewRow.student_name },
                { label: 'Admission No', value: viewRow.admission_no },
                { label: 'Class', value: viewRow.class_name },
                { label: 'Issue Date', value: formatDate(viewRow.issue_date) },
                { label: 'Created By', value: viewRow.created_by },
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
        entityName={deleteRow?.certificate_name}
        onConfirm={() => deleteStudentCertificate(deleteRow._id)}
      />
    </div>
  )
}

// ─── Student Certificate Form Drawer (shared by Add and Edit) ──────────────────
function StudentCertificateFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    certificate_name: initial?.certificate_name || '',
    certificate_type: initial?.certificate_type || 'Character Certificate',
    student_name: initial?.student_name || '',
    admission_no: initial?.admission_no || '',
    class_name: initial?.class_name || '',
    status: initial?.status || 'draft',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Student certificate information"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel={initial ? 'Save Changes' : 'Add Certificate'}
          submitDisabled={!form.certificate_name.trim() || !form.student_name.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Certificate Name <span className="text-destructive">*</span></Label>
            <Input value={form.certificate_name} onChange={(e) => set('certificate_name', e.target.value)} placeholder="e.g. Character Certificate - Aarav" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Certificate Type</Label>
            <select value={form.certificate_type} onChange={(e) => set('certificate_type', e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {CERTIFICATE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Student Name <span className="text-destructive">*</span></Label>
              <Input value={form.student_name} onChange={(e) => set('student_name', e.target.value)} placeholder="e.g. Aarav Sharma" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Admission No</Label>
              <Input value={form.admission_no} onChange={(e) => set('admission_no', e.target.value)} placeholder="e.g. ADM-1001" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Class</Label>
              <Input value={form.class_name} onChange={(e) => set('class_name', e.target.value)} placeholder="e.g. 10-A" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="issued">Issued</option>
              </select>
            </div>
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
