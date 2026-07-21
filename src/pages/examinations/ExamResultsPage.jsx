import { useMemo, useState } from 'react'
import { Award, Eye, Printer, Download, TrendingUp, Percent, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer } from '@/components/Drawer'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useAsyncData } from '@/hooks/useAsyncData'
import { examinationService } from '@/services/examination.service'
import { useToast } from '@/hooks/use-toast'

const EXAMS = ['Annual Examination', 'Pre-Board Examination', 'Half Yearly Examination', 'First Term Examination']
const CLASSES = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Year-1', 'Year-2']
const SECTIONS = ['A', 'B', 'C']

function gradeColor(grade) {
  return { 'A+': 'default', A: 'default', 'B+': 'secondary', B: 'secondary', 'C+': 'outline', C: 'outline', D: 'outline', F: 'destructive' }[grade] || 'secondary'
}

export default function ExamResultsPage() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => examinationService.getExamResults(), [])
  const [search, setSearch] = useState('')
  const [exam, setExam] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [section, setSection] = useState('all')
  const [viewRow, setViewRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const ms = !search || r.student.toLowerCase().includes(search.toLowerCase()) || r.admission_no.toLowerCase().includes(search.toLowerCase())
      const me = exam === 'all' || r.exam === exam
      const mc = classFilter === 'all' || r.class === classFilter
      const msc = section === 'all' || r.section === section
      return ms && me && mc && msc
    }),
    [rows, search, exam, classFilter, section],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    avg: rows.length ? (rows.reduce((a, r) => a + r.percentage, 0) / rows.length).toFixed(1) : 0,
    topRank: rows.length ? Math.min(...rows.map((r) => r.rank)) : 0,
    distinctions: rows.filter((r) => r.grade === 'A+').length,
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
    { accessorKey: 'exam', header: 'Exam' },
    { accessorKey: 'total', header: 'Total', cell: ({ row }) => `${row.original.total}/${row.original.max_total}` },
    {
      accessorKey: 'percentage',
      header: 'Percentage',
      cell: ({ row }) => <span className="font-medium">{row.original.percentage}%</span>,
    },
    { accessorKey: 'grade', header: 'Grade', cell: ({ row }) => <Badge variant={gradeColor(row.original.grade)}>{row.original.grade}</Badge> },
    { accessorKey: 'division', header: 'Division' },
    { accessorKey: 'rank', header: 'Rank', cell: ({ row }) => <Badge variant={row.original.rank <= 3 ? 'default' : 'secondary'}>#{row.original.rank}</Badge> },
    { accessorKey: 'attendance', header: 'Attendance', cell: ({ row }) => `${row.original.attendance}%` },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { separator: true },
    { label: 'Print', icon: Printer, onClick: () => toast({ title: 'Printing result…', description: r.student }) },
    { label: 'Download PDF', icon: Download, onClick: () => toast({ title: 'Downloading PDF…', description: r.student }) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Exam Results' }]} />
      <PageHeader title="Exam Results" description="Subject-wise marks, totals, grades, divisions, and ranks." icon={Award} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Results" value={stats.total} icon={Award} accent="primary" />
        <StatCard label="Avg Percentage" value={`${stats.avg}%`} icon={Percent} accent="chart2" />
        <StatCard label="Top Rank" value={`#${stats.topRank}`} icon={Trophy} accent="warning" />
        <StatCard label="Distinctions" value={stats.distinctions} icon={TrendingUp} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student or admission no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <select value={exam} onChange={(e) => setExam(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All exams</option>
            {EXAMS.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All sections</option>
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={8} cols={9} />
      ) : filtered.length === 0 ? (
        <NoData title="No results found" />
      ) : (
        <DataTable columns={columns} data={filtered} rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />
      )}

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Result Details" description={viewRow?.student} width="sm:max-w-lg"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-semibold">{viewRow.total}/{viewRow.max_total}</p></div>
              <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Percentage</p><p className="text-lg font-semibold">{viewRow.percentage}%</p></div>
              <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Grade</p><p className="text-lg font-semibold">{viewRow.grade}</p></div>
              <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Rank</p><p className="text-lg font-semibold">#{viewRow.rank}</p></div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">Subject-wise Marks</p>
              <div className="space-y-2">
                {Object.entries(viewRow.marks).map(([subj, mark]) => (
                  <div key={subj} className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <span className="text-sm font-medium">{subj}</span>
                    <Badge variant={mark >= 90 ? 'default' : mark >= 75 ? 'secondary' : 'outline'}>{mark}/100</Badge>
                  </div>
                ))}
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div><dt className="text-xs text-muted-foreground">Division</dt><dd className="text-sm font-medium">{viewRow.division}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Attendance</dt><dd className="text-sm font-medium">{viewRow.attendance}%</dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted-foreground">Remarks</dt><dd className="text-sm">{viewRow.remarks}</dd></div>
            </dl>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
