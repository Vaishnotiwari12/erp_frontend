// ====================================================================
// Module: Online Exam
// Page: Student Attempts
//
// Purpose:
// View student attempt records, scores, and results.
//
// Data Source:
// onlineExam.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Users, CircleCheck as CheckCircle, Circle as XCircle, Target, Eye } from 'lucide-react'
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
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useStudentAttempts } from '@/hooks/useOnlineExam'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'exam_name', label: 'Exam' },
  { key: 'class_name', label: 'Class' },
  { key: 'obtained_marks', label: 'Obtained' },
  { key: 'total_marks', label: 'Total' },
  { key: 'percentage', label: 'Percentage' },
  { key: 'result', label: 'Result' },
  { key: 'time_taken', label: 'Time Taken (min)' },
  { key: 'status', label: 'Status' },
]

export default function StudentAttemptsPage() {
  const {
    rows, exams, stats, isLoading,
    search, setSearch, examFilter, setExamFilter,
    resultFilter, setResultFilter,
  } = useStudentAttempts()

  const [viewRow, setViewRow] = useState(null)

  const columns = useMemo(() => [
    {
      accessorKey: 'student_name',
      header: 'Student',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.student_name}</span>
            <span className="text-xs text-muted-foreground">{row.original.class_name}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'exam_name', header: 'Exam', cell: ({ row }) => <Badge variant="secondary">{row.original.exam_name}</Badge> },
    {
      accessorKey: 'obtained_marks',
      header: 'Score',
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.obtained_marks}/{row.original.total_marks}
        </span>
      ),
    },
    {
      accessorKey: 'percentage',
      header: 'Percentage',
      cell: ({ row }) => <span className="text-sm font-medium">{row.original.percentage}%</span>,
    },
    { accessorKey: 'time_taken', header: 'Time Taken', cell: ({ row }) => <Badge variant="outline">{row.original.time_taken} min</Badge> },
    {
      accessorKey: 'result',
      header: 'Result',
      cell: ({ row }) => (
        <Badge variant={row.original.result === 'pass' ? 'default' : 'destructive'} className="capitalize">
          {row.original.result}
        </Badge>
      ),
    },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <Badge variant="outline" className="capitalize">{row.original.status}</Badge> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Online Exam' }, { label: 'Student Attempts' }]} />
      <PageHeader
        title="Student Attempts"
        description="Track student exam attempts, scores, and results."
        icon={Users}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Attempts" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Pass" value={stats.pass} icon={CheckCircle} accent="success" />
        <StatCard label="Fail" value={stats.fail} icon={XCircle} accent="destructive" />
        <StatCard label="Avg Score (%)" value={stats.avg_percentage} icon={Target} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student or exam…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="student-attempts" />
          <select value={examFilter} onChange={(e) => setExamFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All exams</option>
            {exams.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
          <select value={resultFilter} onChange={(e) => setResultFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All results</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={7} />
      ) : rows.length === 0 ? (
        <NoData title="No attempts found" description="Student attempts will appear here once exams are taken." />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="student-attempts"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Attempt Details"
        description={viewRow?.student_name}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.student_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.class_name} · {viewRow.exam_name}</p>
              </div>
              <Badge variant={viewRow.result === 'pass' ? 'default' : 'destructive'} className="capitalize">{viewRow.result}</Badge>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Obtained Marks', value: `${viewRow.obtained_marks}/${viewRow.total_marks}` },
                { label: 'Percentage', value: `${viewRow.percentage}%` },
                { label: 'Time Taken', value: `${viewRow.time_taken} min` },
                { label: 'Status', value: viewRow.status },
                { label: 'Started At', value: formatDate(viewRow.started_at) },
                { label: 'Submitted At', value: viewRow.submitted_at ? formatDate(viewRow.submitted_at) : '—' },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium capitalize">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>
    </div>
  )
}
