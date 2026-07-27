// ====================================================================
// Module: Certificate
// Page: Generate Certificate
//
// Purpose:
// List generated certificates with preview, print, download, and
// delete actions. New certificates can be generated from existing
// student certificate records.
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
  FileBadge,
  Plus,
  Eye,
  Printer,
  Download,
  Trash2,
  ScrollText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useGeneratedCertificates, useStudentCertificates } from '@/hooks/useCertificate'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/utils/format'

export default function GenerateCertificatePage() {
  const {
    rows, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    createGeneratedCertificate, deleteGeneratedCertificate,
  } = useGeneratedCertificates()
  const { toast } = useToast()
  const { data: studentCerts } = useAsyncData(() => import('@/services/certificate.service').then((m) => m.certificateService.getStudentCertificates()), [])

  const [addOpen, setAddOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const columns = useMemo(() => [
    {
      accessorKey: 'certificate_name',
      header: 'Certificate',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ScrollText className="h-4 w-4" />
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
    { accessorKey: 'template_name', header: 'Template' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.status}</Badge> },
    { accessorKey: 'generated_at', header: 'Generated At', cell: ({ row }) => formatDate(row.original.generated_at) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Print', icon: Printer, onClick: () => toast({ title: 'Printing…', description: r.certificate_name }) },
    { label: 'Download', icon: Download, onClick: () => toast({ title: 'Downloading…', description: r.certificate_name }) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Certificate' }, { label: 'Generate Certificate' }]} />
      <PageHeader
        title="Generate Certificates"
        description="Generate, preview, print, and download student certificates."
        icon={FileBadge}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Generate Certificate</Button>}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, student, or admission no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="generated">Generated</option>
            <option value="printed">Printed</option>
            <option value="downloaded">Downloaded</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No generated certificates" description="Generate a new certificate to get started." actionLabel="Generate Certificate" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Generate new certificate drawer */}
      <GenerateCertificateFormDrawer
        open={addOpen}
        onOpenChange={(o) => setAddOpen(o)}
        studentCerts={studentCerts || []}
        onSubmit={async (payload) => {
          await createGeneratedCertificate(payload)
          setAddOpen(false)
        }}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Generated Certificate"
        description={viewRow?.certificate_name}
        width="sm:max-w-md"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: 'Printing…', description: viewRow.certificate_name })}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'Downloading…', description: viewRow.certificate_name })}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button onClick={() => setViewRow(null)}>Close</Button>
          </div>
        }
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ScrollText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.certificate_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.certificate_type}</p>
              </div>
              <Badge variant="outline" className="capitalize">{viewRow.status}</Badge>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Student', value: viewRow.student_name },
                { label: 'Admission No', value: viewRow.admission_no },
                { label: 'Class', value: viewRow.class_name },
                { label: 'Template', value: viewRow.template_name },
                { label: 'Generated At', value: formatDate(viewRow.generated_at) },
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
        onConfirm={() => deleteGeneratedCertificate(deleteRow._id)}
      />
    </div>
  )
}

// ─── Generate Certificate Form Drawer ────────────────────────────────────────
function GenerateCertificateFormDrawer({ open, onOpenChange, studentCerts, onSubmit }) {
  const [form, setForm] = useState({
    certificate_id: '',
    certificate_name: '',
    certificate_type: '',
    student_name: '',
    admission_no: '',
    class_name: '',
    template_name: 'Standard Character Template',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSelectCert = (id) => {
    const cert = studentCerts.find((c) => c._id === id)
    if (cert) {
      setForm((f) => ({
        ...f,
        certificate_id: id,
        certificate_name: cert.certificate_name,
        certificate_type: cert.certificate_type,
        student_name: cert.student_name,
        admission_no: cert.admission_no,
        class_name: cert.class_name,
      }))
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Generate Certificate"
      description="Select a student certificate to generate"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Generate"
          submitDisabled={!form.certificate_id}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Student Certificate <span className="text-destructive">*</span></Label>
            <select value={form.certificate_id} onChange={(e) => handleSelectCert(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select certificate</option>
              {studentCerts.map((c) => <option key={c._id} value={c._id}>{c.certificate_name} — {c.student_name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Template</Label>
            <Input value={form.template_name} onChange={(e) => set('template_name', e.target.value)} placeholder="Template name" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
