// ====================================================================
// Module: Online Exam
// Page: Results
//
// Purpose:
// Result-focused view over completed attempts with pass-rate and score stats.
//
// Data Source:
// onlineExam.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ClipboardList, Trophy, Target, CircleCheck as CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { DataTable } from '@/components/DataTable'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useExamResults } from '@/hooks/useOnlineExam'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'exam_name', label: 'Exam' },
  { key: 'obtained_marks', label: 'Obtained' },
  { key: 'percentage', label: 'Percentage' },
  { key: 'result', label: 'Result' },
  { key: 'time_taken', label: 'Time Taken (min)' },
  { key: 'submitted_at', label: 'Submitted At' },
]

export default function ResultsPage() {
  const {
    rows, exams, stats, isLoading,
    search, setSearch, examFilter, setExamFilter,
  } = useExamResults()

  const columns = useMemo(() => [
    {
      accessorKey: 'student_name',
      header: 'Student',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ClipboardList className="h-4 w-4" />
          </div>
          <span className="font-medium">{row.original.student_name}</span>
        </div>
      ),
    },
    { accessorKey: 'exam_name', header: 'Exam', cell: ({ row }) => <Badge variant="secondary">{row.original.exam_name}</Badge> },
    { accessorKey: 'obtained_marks', header: 'Obtained', cell: ({ row }) => <span className="font-medium">{row.original.obtained_marks}/{row.original.total_marks}</span> },
    { accessorKey: 'percentage', header: 'Percentage', cell: ({ row }) => <span className="font-medium">{row.original.percentage}%</span> },
    {
      accessorKey: 'result',
      header: 'Result',
      cell: ({ row }) => (
        <Badge variant={row.original.result === 'pass' ? 'default' : 'destructive'} className="capitalize">
          {row.original.result}
        </Badge>
      ),
    },
    { accessorKey: 'time_taken', header: 'Time Taken', cell: ({ row }) => <Badge variant="outline">{row.original.time_taken} min</Badge> },
    { accessorKey: 'submitted_at', header: 'Submitted At', cell: ({ row }) => <span className="text-sm">{formatDate(row.original.submitted_at)}</span> },
  ], [])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Online Exam' }, { label: 'Results' }]} />
      <PageHeader
        title="Exam Results"
        description="View and analyze completed exam results."
        icon={ClipboardList}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Results" value={stats.total} icon={ClipboardList} accent="primary" />
        <StatCard label="Pass Rate (%)" value={stats.pass_rate} icon={CheckCircle} accent="success" />
        <StatCard label="Avg Score (%)" value={stats.avg_score} icon={Target} accent="chart2" />
        <StatCard label="Top Score (%)" value={stats.top_score} icon={Trophy} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student or exam…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="exam-results" />
          <select value={examFilter} onChange={(e) => setExamFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All exams</option>
            {exams.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={7} />
      ) : rows.length === 0 ? (
        <NoData title="No results found" description="Exam results will appear here once attempts are completed." />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="exam-results"
        />
      )}
    </div>
  )
}
