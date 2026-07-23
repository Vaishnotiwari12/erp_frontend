// ====================================================================
// Module: Examinations
// Page: Print Admit Card
//
// Purpose:
// Search, preview, and bulk print admit cards.
//
// Data Source:
// examination.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { IdCard, Printer, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { DataTable } from '@/components/DataTable'
import { Drawer } from '@/components/Drawer'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useAsyncData } from '@/hooks/useAsyncData'
import { examinationService } from '@/services/examination.service'
import { useToast } from '@/hooks/use-toast'

const EXAM_GROUPS = ['Annual Examination', 'Pre-Board Examination', 'Unit Test 1', 'Board Mock Test']

export default function PrintAdmitCardPage() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => examinationService.getAdmitCards(), [])
  const [search, setSearch] = useState('')
  const [examGroup, setExamGroup] = useState('all')
  const [viewRow, setViewRow] = useState(null)
  const [selected, setSelected] = useState([])

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const ms = !search || r.student.toLowerCase().includes(search.toLowerCase()) || r.admission_no.toLowerCase().includes(search.toLowerCase())
      const me = examGroup === 'all' || r.exam_group === examGroup
      return ms && me
    }),
    [rows, search, examGroup],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    generated: rows.filter((r) => r.status === 'generated').length,
    pending: rows.filter((r) => r.status === 'pending').length,
  }), [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'student',
      header: 'Student',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.student}</span>
          <span className="text-xs text-muted-foreground">{row.original.admission_no}</span>
        </button>
      ),
    },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'roll_no', header: 'Roll No' },
    { accessorKey: 'exam_group', header: 'Exam Group' },
    { accessorKey: 'center', header: 'Center' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={row.original.status === 'generated' ? 'default' : 'secondary'}>{row.original.status}</Badge> },
  ], [])

  const rowActions = (r) => [
    { label: 'Preview', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Print', icon: Printer, onClick: () => toast({ title: 'Printing admit card…', description: r.student }) },
    { label: 'Export PDF', icon: Download, onClick: () => toast({ title: 'Exporting PDF…', description: r.student }) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Print Admit Card' }]} />
      <PageHeader
        title="Print Admit Card"
        description="Search, preview, and bulk print admit cards."
        icon={Printer}
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: `Bulk printing ${filtered.length} admit cards…` })}><Printer className="mr-2 h-4 w-4" /> Bulk Print</Button>
            <Button variant="outline" onClick={() => toast({ title: 'Exporting all admit cards to PDF…' })}><Download className="mr-2 h-4 w-4" /> Export PDF</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Cards" value={stats.total} icon={IdCard} accent="primary" />
        <StatCard label="Generated" value={stats.generated} icon={Printer} accent="success" />
        <StatCard label="Pending" value={stats.pending} icon={IdCard} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student or admission no…" className="max-w-sm" />
        <select value={examGroup} onChange={(e) => setExamGroup(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="all">All exam groups</option>
          {EXAM_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={6} />
      ) : filtered.length === 0 ? (
        <NoData title="No admit cards found" />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          bulkActions={[
            { label: 'Bulk Print', icon: Printer, onClick: (sel) => toast({ title: `Printing ${sel.length} admit cards…` }) },
            { label: 'Export PDF', icon: Download, variant: 'outline', onClick: (sel) => toast({ title: `Exporting ${sel.length} admit cards…` }) },
          ]}
          rowActions={(r) => (
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewRow(r)}><Eye className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: 'Printing…', description: r.student })}><Printer className="h-4 w-4" /></Button>
            </div>
          )}
        />
      )}

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Admit Card Preview" description={viewRow?.student} width="sm:max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>
            <Button onClick={() => toast({ title: 'Printing admit card…', description: viewRow.student })}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </>
        }>
        {viewRow ? (
          <div className="mx-auto max-w-sm rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><IdCard className="h-6 w-6" /></div>
              <h2 className="text-base font-bold">Scholaria ERP - Admit Card</h2>
              <div className="h-px w-full bg-border" />
              <dl className="grid w-full grid-cols-2 gap-y-2 text-xs text-left">
                <dt className="text-muted-foreground">Name:</dt><dd className="font-medium">{viewRow.student}</dd>
                <dt className="text-muted-foreground">Admission No:</dt><dd className="font-medium">{viewRow.admission_no}</dd>
                <dt className="text-muted-foreground">Class:</dt><dd className="font-medium">{viewRow.class} - {viewRow.section}</dd>
                <dt className="text-muted-foreground">Roll No:</dt><dd className="font-medium">{viewRow.roll_no}</dd>
                <dt className="text-muted-foreground">Exam:</dt><dd className="font-medium">{viewRow.exam_group}</dd>
                <dt className="text-muted-foreground">Center:</dt><dd className="font-medium">{viewRow.center}</dd>
              </dl>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
