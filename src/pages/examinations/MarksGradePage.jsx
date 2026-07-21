import { useMemo, useState } from 'react'
import { BarChart3, Plus, Pencil, Trash2, Eye } from 'lucide-react'
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
import { useAsyncData } from '@/hooks/useAsyncData'
import { examinationService } from '@/services/examination.service'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'grade', label: 'Grade' },
  { key: 'min_marks', label: 'Min Marks' },
  { key: 'max_marks', label: 'Max Marks' },
  { key: 'grade_point', label: 'Grade Point' },
  { key: 'remarks', label: 'Remarks' },
]

export default function MarksGradePage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getMarksGrades(), [])
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => !search || r.grade.toLowerCase().includes(search.toLowerCase()) || r.remarks.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    passing: rows.filter((r) => r.grade_point >= 4).length,
    failing: rows.filter((r) => r.grade_point === 0).length,
    maxPoint: rows.length ? Math.max(...rows.map((r) => r.grade_point)) : 0,
  }), [rows])

  const columns = useMemo(() => [
    { accessorKey: 'grade', header: 'Grade', cell: ({ row }) => <Badge variant={row.original.grade_point === 0 ? 'destructive' : 'default'}>{row.original.grade}</Badge> },
    { accessorKey: 'min_marks', header: 'Min Marks' },
    { accessorKey: 'max_marks', header: 'Max Marks' },
    { accessorKey: 'grade_point', header: 'Grade Point' },
    { accessorKey: 'remarks', header: 'Remarks' },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Marks Grade' }]} />
      <PageHeader
        title="Marks Grade"
        description="Define grade bands, grade points, and remarks."
        icon={BarChart3}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Grade</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Grades" value={stats.total} icon={BarChart3} accent="primary" />
        <StatCard label="Passing Grades" value={stats.passing} icon={BarChart3} accent="success" />
        <StatCard label="Failing Grades" value={stats.failing} icon={BarChart3} accent="destructive" />
        <StatCard label="Max Grade Point" value={stats.maxPoint} icon={BarChart3} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search grade or remarks…" className="max-w-sm" />
        <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="marks-grades" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={5} />
      ) : filtered.length === 0 ? (
        <NoData title="No grades found" actionLabel="Add Grade" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable columns={columns} data={filtered} rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />
      )}

      <GradeDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Grade" onSubmit={async (p) => { await examinationService.createMarksGrade(p); toast({ title: 'Grade added', description: p.grade }); setAddOpen(false); refetch() }} />
      <GradeDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Grade" initial={editRow} onSubmit={async (p) => { await examinationService.updateMarksGrade(editRow._id, p); toast({ title: 'Grade updated', description: p.grade }); setEditRow(null); refetch() }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Grade Details" description={viewRow?.grade} width="sm:max-w-sm"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Grade', value: <Badge>{viewRow.grade}</Badge> },
              { label: 'Min Marks', value: viewRow.min_marks },
              { label: 'Max Marks', value: viewRow.max_marks },
              { label: 'Grade Point', value: viewRow.grade_point },
              { label: 'Remarks', value: viewRow.remarks },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.grade}
        onConfirm={async () => { await examinationService.removeMarksGrade(deleteRow._id); toast({ title: 'Grade deleted' }); setDeleteRow(null); refetch() }} />
    </div>
  )
}

function GradeDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    grade: initial?.grade || '',
    min_marks: initial?.min_marks ?? 0,
    max_marks: initial?.max_marks ?? 100,
    grade_point: initial?.grade_point ?? 0,
    remarks: initial?.remarks || '',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Grade band details" width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <div className="space-y-1.5">
            <Label className="text-xs">Grade <span className="text-destructive">*</span></Label>
            <Input value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} placeholder="e.g. A+" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Grade Point</Label>
            <Input type="number" value={form.grade_point} onChange={(e) => setForm((f) => ({ ...f, grade_point: Number(e.target.value) }))} placeholder="e.g. 10" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Min Marks</Label>
            <Input type="number" value={form.min_marks} onChange={(e) => setForm((f) => ({ ...f, min_marks: Number(e.target.value) }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Max Marks</Label>
            <Input type="number" value={form.max_marks} onChange={(e) => setForm((f) => ({ ...f, max_marks: Number(e.target.value) }))} />
          </div>
        </FormSection>
        <div className="space-y-1.5">
          <Label className="text-xs">Remarks</Label>
          <Input value={form.remarks} onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))} placeholder="e.g. Outstanding" />
        </div>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}
