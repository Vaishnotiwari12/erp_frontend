// ====================================================================
// Module: Examinations
// Page: Marks Division
//
// Purpose:
// Define division bands based on percentage ranges.
//
// Data Source:
// examination.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ScrollText, Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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
import { useAsyncData } from '@/hooks/useAsyncData'
import { examinationService } from '@/services/examination.service'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'division', label: 'Division' },
  { key: 'min_percentage', label: 'Min %' },
  { key: 'max_percentage', label: 'Max %' },
  { key: 'description', label: 'Description' },
]

export default function MarksDivisionPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getMarksDivisions(), [])
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => !search || r.division.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    passing: rows.filter((r) => r.min_percentage >= 33).length,
    failing: rows.filter((r) => r.max_percentage < 33).length,
  }), [rows])

  const columns = useMemo(() => [
    { accessorKey: 'division', header: 'Division', cell: ({ row }) => <Badge variant={row.original.min_percentage < 33 ? 'destructive' : 'default'}>{row.original.division}</Badge> },
    { accessorKey: 'min_percentage', header: 'Min %', cell: ({ row }) => `${row.original.min_percentage}%` },
    { accessorKey: 'max_percentage', header: 'Max %', cell: ({ row }) => `${row.original.max_percentage}%` },
    { accessorKey: 'description', header: 'Description' },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Marks Division' }]} />
      <PageHeader
        title="Marks Division"
        description="Define division bands based on percentage ranges."
        icon={ScrollText}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Division</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Divisions" value={stats.total} icon={ScrollText} accent="primary" />
        <StatCard label="Passing" value={stats.passing} icon={ScrollText} accent="success" />
        <StatCard label="Failing" value={stats.failing} icon={ScrollText} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search division or description…" className="max-w-sm" />
        <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="marks-divisions" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={4} cols={4} />
      ) : filtered.length === 0 ? (
        <NoData title="No divisions found" actionLabel="Add Division" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable columns={columns} data={filtered} rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />
      )}

      <DivisionDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Division" onSubmit={async (p) => { await examinationService.createMarksDivision(p); toast({ title: 'Division added', description: p.division }); setAddOpen(false); refetch() }} />
      <DivisionDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Division" initial={editRow} onSubmit={async (p) => { await examinationService.updateMarksDivision(editRow._id, p); toast({ title: 'Division updated', description: p.division }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Division Details" description={viewRow?.division} width="sm:max-w-sm"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Division', value: <Badge>{viewRow.division}</Badge> },
              { label: 'Min Percentage', value: `${viewRow.min_percentage}%` },
              { label: 'Max Percentage', value: `${viewRow.max_percentage}%` },
              { label: 'Description', value: viewRow.description },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.division}
        onConfirm={async () => { await examinationService.removeMarksDivision(deleteRow._id); toast({ title: 'Division deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function DivisionDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    division: initial?.division || '',
    min_percentage: initial?.min_percentage ?? 0,
    max_percentage: initial?.max_percentage ?? 100,
    description: initial?.description || '',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Division band details" width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Division <span className="text-destructive">*</span></Label>
            <Input value={form.division} onChange={(e) => setForm((f) => ({ ...f, division: e.target.value }))} placeholder="e.g. First" required />
          </div>
          <div className="space-y-1.5" />
          <div className="space-y-1.5">
            <Label className="text-xs">Min Percentage</Label>
            <Input type="number" value={form.min_percentage} onChange={(e) => setForm((f) => ({ ...f, min_percentage: Number(e.target.value) }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Max Percentage</Label>
            <Input type="number" value={form.max_percentage} onChange={(e) => setForm((f) => ({ ...f, max_percentage: Number(e.target.value) }))} />
          </div>
        </FormSection>
        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description…" rows={3} />
        </div>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
