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
import { useGeneratedCertificates } from '@/hooks/useCertificate'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/utils/format'

export default function GenerateCertificatePage() {
  const {
    rows, isLoading,
    search, setSearch,
    createGeneratedCertificate, deleteGeneratedCertificate,
  } = useGeneratedCertificates()
  const { toast } = useToast()

  const [addOpen, setAddOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const columns = useMemo(() => [
    {
      accessorKey: 'student_id',
      header: 'Student',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ScrollText className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.student_id}</span>
            <span className="text-xs text-muted-foreground">{row.original.issued_by}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'certificate_id', header: 'Certificate' },
    { accessorKey: 'generated_date', header: 'Generated Date', cell: ({ row }) => formatDate(row.original.generated_date) },
    { accessorKey: 'issued_by', header: 'Issued By' },
    { accessorKey: 'createdAt', header: 'Created At', cell: ({ row }) => formatDate(row.original.createdAt) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Print', icon: Printer, onClick: () => toast({ title: 'Printing…', description: r.issued_by }) },
    { label: 'Download', icon: Download, onClick: () => toast({ title: 'Downloading…', description: r.issued_by }) },
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search by issued by or generated date…" className="max-w-sm" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
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
        description={viewRow?.issued_by}
        width="sm:max-w-md"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: 'Printing…', description: viewRow.issued_by })}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'Downloading…', description: viewRow.issued_by })}>
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
                <p className="font-semibold">{viewRow.issued_by}</p>
                <p className="text-xs text-muted-foreground">{viewRow.student_id}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Student ID', value: viewRow.student_id },
                { label: 'Certificate ID', value: viewRow.certificate_id },
                { label: 'Generated Date', value: formatDate(viewRow.generated_date) },
                { label: 'Issued By', value: viewRow.issued_by },
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
        entityName={deleteRow?.issued_by}
        onConfirm={() => deleteGeneratedCertificate(deleteRow._id)}
      />
    </div>
  )
}

// ─── Generate Certificate Form Drawer ────────────────────────────────────────
function GenerateCertificateFormDrawer({ open, onOpenChange, onSubmit }) {
  const [form, setForm] = useState({
    student_id: '',
    certificate_id: '',
    generated_date: '',
    issued_by: '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Generate Certificate"
      description="Enter student and certificate details to generate"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Generate"
          submitDisabled={!form.student_id.trim() || !form.certificate_id.trim()}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Student ID <span className="text-destructive">*</span></Label>
            <Input value={form.student_id} onChange={(e) => set('student_id', e.target.value)} placeholder="Student ObjectId" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Certificate ID <span className="text-destructive">*</span></Label>
            <Input value={form.certificate_id} onChange={(e) => set('certificate_id', e.target.value)} placeholder="Certificate ObjectId" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Generated Date</Label>
            <Input type="date" value={form.generated_date ? form.generated_date.split('T')[0] : ''} onChange={(e) => set('generated_date', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Issued By</Label>
            <Input value={form.issued_by} onChange={(e) => set('issued_by', e.target.value)} placeholder="e.g. Principal" />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
