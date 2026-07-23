// ====================================================================
// Module: Examinations
// Page: Print Marksheet
//
// Purpose:
// Bulk print, individual print, and export marksheets to PDF.
//
// Data Source:
// examination.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Printer, Download, Eye } from 'lucide-react'
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
import { FileBadge } from 'lucide-react'

const EXAM_GROUPS = ['Annual Examination', 'Pre-Board Examination', 'Half Yearly Examination', 'First Term Examination']

export default function PrintMarksheetPage() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => examinationService.getMarksheets(), [])
  const [search, setSearch] = useState('')
  const [examGroup, setExamGroup] = useState('all')
  const [viewRow, setViewRow] = useState(null)

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
    { accessorKey: 'exam_group', header: 'Exam Group' },
    { accessorKey: 'percentage', header: 'Percentage', cell: ({ row }) => `${row.original.percentage}%` },
    { accessorKey: 'grade', header: 'Grade', cell: ({ row }) => <Badge variant={row.original.grade === 'A+' ? 'default' : 'secondary'}>{row.original.grade}</Badge> },
    { accessorKey: 'division', header: 'Division' },
    { accessorKey: 'rank', header: 'Rank', cell: ({ row }) => `#${row.original.rank}` },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant={row.original.status === 'generated' ? 'default' : 'secondary'}>{row.original.status}</Badge> },
  ], [])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Print Marksheet' }]} />
      <PageHeader
        title="Print Marksheet"
        description="Bulk print, individual print, and export marksheets to PDF."
        icon={Printer}
        actions={
          <>
            <Button variant="outline" onClick={() => toast({ title: `Bulk printing ${filtered.length} marksheets…` })}><Printer className="mr-2 h-4 w-4" /> Bulk Print</Button>
            <Button variant="outline" onClick={() => toast({ title: 'Exporting all marksheets to PDF…' })}><Download className="mr-2 h-4 w-4" /> Export PDF</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Marksheets" value={stats.total} icon={FileBadge} accent="primary" />
        <StatCard label="Generated" value={stats.generated} icon={Printer} accent="success" />
        <StatCard label="Pending" value={stats.pending} icon={FileBadge} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student or admission no…" className="max-w-sm" />
        <select value={examGroup} onChange={(e) => setExamGroup(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="all">All exam groups</option>
          {EXAM_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={8} />
      ) : filtered.length === 0 ? (
        <NoData title="No marksheets found" />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          bulkActions={[
            { label: 'Bulk Print', icon: Printer, onClick: (sel) => toast({ title: `Printing ${sel.length} marksheets…` }) },
            { label: 'Export PDF', icon: Download, variant: 'outline', onClick: (sel) => toast({ title: `Exporting ${sel.length} marksheets…` }) },
          ]}
          rowActions={(r) => (
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewRow(r)}><Eye className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: 'Printing marksheet…', description: r.student })}><Printer className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: 'Exporting PDF…', description: r.student })}><Download className="h-4 w-4" /></Button>
            </div>
          )}
        />
      )}

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Marksheet Preview" description={viewRow?.student} width="sm:max-w-2xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>
            <Button onClick={() => toast({ title: 'Printing marksheet…', description: viewRow.student })}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </>
        }>
        {viewRow ? (
          <div className="mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileBadge className="h-5 w-5" /></div>
              <h2 className="flex-1 text-base font-bold">Scholaria ERP - Marksheet</h2>
            </div>
            <div className="my-3 h-px w-full bg-border" />
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{viewRow.student}</span></div>
              <div><span className="text-muted-foreground">Class:</span> <span className="font-medium">{viewRow.class}</span></div>
              <div><span className="text-muted-foreground">Exam:</span> <span className="font-medium">{viewRow.exam_group}</span></div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              <div className="rounded-lg border bg-muted/30 p-2"><p className="text-xs text-muted-foreground">Percentage</p><p className="text-sm font-bold">{viewRow.percentage}%</p></div>
              <div className="rounded-lg border bg-muted/30 p-2"><p className="text-xs text-muted-foreground">Grade</p><p className="text-sm font-bold">{viewRow.grade}</p></div>
              <div className="rounded-lg border bg-muted/30 p-2"><p className="text-xs text-muted-foreground">Division</p><p className="text-sm font-bold">{viewRow.division}</p></div>
              <div className="rounded-lg border bg-muted/30 p-2"><p className="text-xs text-muted-foreground">Rank</p><p className="text-sm font-bold">#{viewRow.rank}</p></div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
