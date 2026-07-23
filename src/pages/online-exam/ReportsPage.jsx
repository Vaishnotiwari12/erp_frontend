// ====================================================================
// Module: Online Exam
// Page: Reports
//
// Purpose:
// Aggregated exam-wise statistics — attempts, average score, pass rate,
// highest and lowest scores.
//
// Data Source:
// onlineExam.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo } from 'react'
import { ChartBar as BarChart3, Users, Target, Trophy, MonitorPlay } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable } from '@/components/DataTable'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useOnlineExams, useStudentAttempts } from '@/hooks/useOnlineExam'

const EXPORT_COLS = [
  { key: 'exam_name', label: 'Exam' },
  { key: 'total_attempts', label: 'Total Attempts' },
  { key: 'avg_score', label: 'Avg Score (%)' },
  { key: 'pass_rate', label: 'Pass Rate (%)' },
  { key: 'highest', label: 'Highest (%)' },
  { key: 'lowest', label: 'Lowest (%)' },
]

export default function ReportsPage() {
  const { allExams, isLoading: examsLoading } = useOnlineExams()
  const { rows: attempts, isLoading: attemptsLoading } = useStudentAttempts()

  const isLoading = examsLoading || attemptsLoading

  // Aggregate per-exam statistics from the attempts list.
  const reportRows = useMemo(() => {
    return allExams
      .filter((e) => e.status === 'completed' || e.status === 'active')
      .map((exam) => {
        const examAttempts = attempts.filter((a) => a.exam_id === exam._id && a.status === 'completed')
        const total = examAttempts.length
        const passed = examAttempts.filter((a) => a.result === 'pass').length
        const avg = total ? Math.round(examAttempts.reduce((sum, a) => sum + a.percentage, 0) / total) : 0
        const passRate = total ? Math.round((passed / total) * 100) : 0
        const highest = total ? Math.max(...examAttempts.map((a) => a.percentage)) : 0
        const lowest = total ? Math.min(...examAttempts.map((a) => a.percentage)) : 0
        return {
          _id: exam._id,
          exam_name: exam.exam_name,
          total_attempts: total,
          avg_score: avg,
          pass_rate: passRate,
          highest,
          lowest,
        }
      })
      .filter((r) => r.total_attempts > 0)
  }, [allExams, attempts])

  const overallStats = useMemo(() => {
    const completed = attempts.filter((a) => a.status === 'completed')
    const passed = completed.filter((a) => a.result === 'pass').length
    return {
      total_exams: allExams.length,
      total_attempts: completed.length,
      avg_score: completed.length ? Math.round(completed.reduce((sum, a) => sum + a.percentage, 0) / completed.length) : 0,
      pass_rate: completed.length ? Math.round((passed / completed.length) * 100) : 0,
    }
  }, [allExams, attempts])

  const columns = useMemo(() => [
    {
      accessorKey: 'exam_name',
      header: 'Exam',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MonitorPlay className="h-4 w-4" />
          </div>
          <span className="font-medium">{row.original.exam_name}</span>
        </div>
      ),
    },
    { accessorKey: 'total_attempts', header: 'Total Attempts', cell: ({ row }) => <Badge variant="secondary">{row.original.total_attempts}</Badge> },
    { accessorKey: 'avg_score', header: 'Avg Score', cell: ({ row }) => <span className="font-medium">{row.original.avg_score}%</span> },
    { accessorKey: 'pass_rate', header: 'Pass Rate', cell: ({ row }) => <Badge variant={row.original.pass_rate >= 50 ? 'default' : 'destructive'}>{row.original.pass_rate}%</Badge> },
    { accessorKey: 'highest', header: 'Highest', cell: ({ row }) => <span className="font-medium text-success">{row.original.highest}%</span> },
    { accessorKey: 'lowest', header: 'Lowest', cell: ({ row }) => <span className="font-medium text-destructive">{row.original.lowest}%</span> },
  ], [])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Online Exam' }, { label: 'Reports' }]} />
      <PageHeader
        title="Online Exam Reports"
        description="Aggregated exam-wise statistics and performance metrics."
        icon={BarChart3}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Exams" value={overallStats.total_exams} icon={MonitorPlay} accent="primary" />
        <StatCard label="Total Attempts" value={overallStats.total_attempts} icon={Users} accent="chart2" />
        <StatCard label="Avg Score (%)" value={overallStats.avg_score} icon={Target} accent="warning" />
        <StatCard label="Pass Rate (%)" value={overallStats.pass_rate} icon={Trophy} accent="success" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ExportButtons rows={reportRows} columns={EXPORT_COLS} filename="online-exam-reports" />
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={6} />
      ) : reportRows.length === 0 ? (
        <NoData title="No report data" description="Reports will appear here once exams have attempts." />
      ) : (
        <DataTable
          columns={columns}
          data={reportRows}
          enableSelection
          enableExport
          exportFilename="online-exam-reports"
        />
      )}
    </div>
  )
}
