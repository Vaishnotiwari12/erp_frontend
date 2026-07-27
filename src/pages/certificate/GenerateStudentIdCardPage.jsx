// ====================================================================
// Module: Certificate
// Page: Generate Student ID Card
//
// Purpose:
// List generated student ID cards with print, download, and delete
// actions. New ID cards can be generated from existing student ID
// card designs.
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
  IdCard,
  Plus,
  Eye,
  Printer,
  Download,
  Trash2,
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
import { useGeneratedStudentIdCards } from '@/hooks/useCertificate'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/utils/format'

export default function GenerateStudentIdCardPage() {
  const {
    rows, isLoading,
    search, setSearch,
    createGeneratedStudentIdCard, deleteGeneratedStudentIdCard,
  } = useGeneratedStudentIdCards()
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
            <IdCard className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.student_id}</span>
            <span className="text-xs text-muted-foreground">{row.original.design_id}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'design_id', header: 'Design' },
    { accessorKey: 'generated_date', header: 'Generated Date', cell: ({ row }) => formatDate(row.original.generated_date) },
    { accessorKey: 'createdAt', header: 'Created At', cell: ({ row }) => formatDate(row.original.createdAt) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Print', icon: Printer, onClick: () => toast({ title: 'Printing…', description: r.student_id }) },
    { label: 'Download', icon: Download, onClick: () => toast({ title: 'Downloading…', description: r.student_id }) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Certificate' }, { label: 'Generate Student ID Card' }]} />
      <PageHeader
        title="Generate Student ID Cards"
        description="Generate, print, and download student ID cards."
        icon={IdCard}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Generate ID Card</Button>}
      />

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by generated date…" className="max-w-sm" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={4} />
      ) : rows.length === 0 ? (
        <NoData title="No generated ID cards" description="Generate a new student ID card to get started." actionLabel="Generate ID Card" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Generate new ID card drawer */}
      <GenerateStudentIdCardFormDrawer
        open={addOpen}
        onOpenChange={(o) => setAddOpen(o)}
        onSubmit={async (payload) => {
          await createGeneratedStudentIdCard(payload)
          setAddOpen(false)
        }}
      />

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Generated Student ID Card"
        description={viewRow?.student_id}
        width="sm:max-w-md"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: 'Printing…', description: viewRow.student_id })}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'Downloading…', description: viewRow.student_id })}>
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
                <IdCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.student_id}</p>
                <p className="text-xs text-muted-foreground">{viewRow.design_id}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Student ID', value: viewRow.student_id },
                { label: 'Design ID', value: viewRow.design_id },
                { label: 'Generated Date', value: formatDate(viewRow.generated_date) },
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
        entityName={deleteRow?.student_id}
        onConfirm={() => deleteGeneratedStudentIdCard(deleteRow._id)}
      />
    </div>
  )
}

// ─── Generate Student ID Card Form Drawer ────────────────────────────────────
function GenerateStudentIdCardFormDrawer({ open, onOpenChange, onSubmit }) {
  const [form, setForm] = useState({
    student_id: '',
    design_id: '',
    generated_date: '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Generate Student ID Card"
      description="Enter student and design details to generate"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Generate"
          submitDisabled={!form.student_id.trim() || !form.design_id.trim()}
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
            <Label className="text-xs">Design ID <span className="text-destructive">*</span></Label>
            <Input value={form.design_id} onChange={(e) => set('design_id', e.target.value)} placeholder="Design ObjectId" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Generated Date</Label>
            <Input type="date" value={form.generated_date ? form.generated_date.split('T')[0] : ''} onChange={(e) => set('generated_date', e.target.value)} />
          </div>
        </FormSection>
        <button type="submit" className="hidden" />
      </form>
    </Drawer>
  )
}
