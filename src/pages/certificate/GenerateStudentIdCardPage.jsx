// ====================================================================
// Module: Certificate
// Page: Generate Student ID Card
//
// Purpose:
// List generated student ID cards with print, download, and delete
// actions. New ID cards can be generated from existing student ID
// card records.
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
  User,
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
import { useGeneratedStudentIdCards, useStudentIdCards } from '@/hooks/useCertificate'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/utils/format'

export default function GenerateStudentIdCardPage() {
  const {
    rows, isLoading,
    search, setSearch,
    createGeneratedStudentIdCard, deleteGeneratedStudentIdCard,
  } = useGeneratedStudentIdCards()
  const { rows: studentCards } = useStudentIdCards()
  const { toast } = useToast()

  const [addOpen, setAddOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const columns = useMemo(() => [
    {
      accessorKey: 'card_name',
      header: 'Card',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <IdCard className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.card_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.student_name} · {row.original.admission_no}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'class_name', header: 'Class' },
    { accessorKey: 'template_name', header: 'Template' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.status}</Badge> },
    { accessorKey: 'generated_at', header: 'Generated At', cell: ({ row }) => formatDate(row.original.generated_at) },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Print', icon: Printer, onClick: () => toast({ title: 'Printing…', description: r.card_name }) },
    { label: 'Download', icon: Download, onClick: () => toast({ title: 'Downloading…', description: r.card_name }) },
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
        <SearchBar value={search} onChange={setSearch} placeholder="Search by card name or student…" className="max-w-sm" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
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
        studentCards={studentCards}
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
        description={viewRow?.card_name}
        width="sm:max-w-md"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: 'Printing…', description: viewRow.card_name })}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'Downloading…', description: viewRow.card_name })}>
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
                <p className="font-semibold">{viewRow.card_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.student_name}</p>
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
        entityName={deleteRow?.card_name}
        onConfirm={() => deleteGeneratedStudentIdCard(deleteRow._id)}
      />
    </div>
  )
}

// ─── Generate Student ID Card Form Drawer ────────────────────────────────────
function GenerateStudentIdCardFormDrawer({ open, onOpenChange, studentCards, onSubmit }) {
  const [form, setForm] = useState({
    card_id: '',
    card_name: '',
    student_name: '',
    admission_no: '',
    class_name: '',
    template_name: 'Standard Student ID Template',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSelectCard = (id) => {
    const card = studentCards.find((c) => c._id === id)
    if (card) {
      setForm((f) => ({
        ...f,
        card_id: id,
        card_name: card.card_name,
        student_name: card.student_name,
        admission_no: card.admission_no,
        class_name: card.class_name,
      }))
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Generate Student ID Card"
      description="Select a student ID card to generate"
      width="sm:max-w-md"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Generate"
          submitDisabled={!form.card_id}
          onSubmit={() => onSubmit(form)}
        />
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={1}>
          <div className="space-y-1.5">
            <Label className="text-xs">Student ID Card <span className="text-destructive">*</span></Label>
            <select value={form.card_id} onChange={(e) => handleSelectCard(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">Select ID card</option>
              {studentCards.map((c) => <option key={c._id} value={c._id}>{c.card_name} — {c.student_name}</option>)}
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
