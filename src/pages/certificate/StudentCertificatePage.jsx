// ====================================================================
// Module: Certificate
// Page: Student Certificate
//
// Purpose:
// Manage student certificate templates with create, edit, view, and
// delete operations.
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
import { useStudentCertificates } from '@/hooks/useCertificate'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'certificate_name', label: 'Certificate Name' },
  { key: 'template', label: 'Template' },
  { key: 'header', label: 'Header' },
  { key: 'body_text', label: 'Body Text' },
  { key: 'createdAt', label: 'Created At' },
]

export default function StudentCertificatePage() {
  const {
    rows, stats, isLoading,
    search, setSearch,
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
            <span className="text-xs text-muted-foreground">{row.original.template}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'template', header: 'Template' },
    { accessorKey: 'header', header: 'Header' },
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
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Certificate' }, { label: 'Student Certificate' }]} />
      <PageHeader
        title="Student Certificates"
        description="Manage student certificate templates."
        icon={Award}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Certificate</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Certificates" value={stats.total} icon={FileText} accent="primary" />
        <StatCard label="Total" value={stats.total} icon={Award} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by certificate name…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="student-certificates" />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
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
                <p className="text-xs text-muted-foreground">{viewRow.template}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Header', value: viewRow.header },
                { label: 'Body Text', value: viewRow.body_text },
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
    template: initial?.template || '',
    header: initial?.header || '',
    body_text: initial?.body_text || '',
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
          submitDisabled={!form.certificate_name.trim()}
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
            <Label className="text-xs">Template</Label>
            <Textarea value={form.template} onChange={(e) => set('template', e.target.value)} placeholder="Template content" rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Header</Label>
            <Input value={form.header} onChange={(e) => set('header', e.target.value)} placeholder="e.g. This is to certify that" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Body Text</Label>
            <Textarea value={form.body_text} onChange={(e) => set('body_text', e.target.value)} placeholder="Body content" rows={3} />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
