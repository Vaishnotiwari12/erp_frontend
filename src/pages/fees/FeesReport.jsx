// ====================================================================
// Module: Fees
// Page: Fees Report
//
// Purpose:
// Class-wise fee collection summary and performance.
//
// Data Source:
// fees.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo } from 'react'
import { ChartBar as BarChart3, Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { DataTable } from '@/components/DataTable'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { Progress } from '@/components/ui/progress'
import { useFeesReport } from '@/hooks/useFees'
import { formatCurrency } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'session', label: 'Session' },
  { key: 'class', label: 'Class' },
  { key: 'total_students', label: 'Students' },
  { key: 'total_fees', label: 'Total Fees' },
  { key: 'collected', label: 'Collected' },
  { key: 'due', label: 'Due' },
  { key: 'collection_rate', label: 'Collection Rate (%)' },
]

export default function FeesReportPage() {
  const { rows, stats, isLoading } = useFeesReport()

  const columns = useMemo(
    () => [
      { accessorKey: 'class', header: 'Class' },
      { accessorKey: 'total_students', header: 'Students' },
      { accessorKey: 'total_fees', header: 'Total Fees', cell: ({ row }) => formatCurrency(row.original.total_fees) },
      { accessorKey: 'collected', header: 'Collected', cell: ({ row }) => <span className="font-medium text-success">{formatCurrency(row.original.collected)}</span> },
      { accessorKey: 'due', header: 'Due', cell: ({ row }) => <span className="font-medium text-destructive">{formatCurrency(row.original.due)}</span> },
      {
        accessorKey: 'collection_rate',
        header: 'Collection Rate',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Progress value={row.original.collection_rate} className="h-2 w-24" />
            <span className="text-sm font-medium">{row.original.collection_rate}%</span>
          </div>
        ),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Fees Report' }]} />
      <PageHeader title="Fees Report" description="Class-wise fee collection summary and performance." icon={BarChart3} actions={<Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Fees" value={formatCurrency(stats.totalFees)} icon={BarChart3} accent="primary" />
        <StatCard label="Collected" value={formatCurrency(stats.collected)} icon={BarChart3} accent="success" />
        <StatCard label="Outstanding" value={formatCurrency(stats.due)} icon={BarChart3} accent="destructive" />
        <StatCard label="Avg Collection Rate" value={`${stats.avgRate}%`} icon={BarChart3} accent="chart2" />
      </div>

      <div className="flex justify-end">
        <ExportButtons rows={rows} columns={EXPORT_COLS} filename="fees-report" />
      </div>

      {isLoading ? <LoadingSkeleton variant="table" rows={6} cols={6} /> : rows.length === 0 ? <NoData title="No report data found" /> : <DataTable columns={columns} data={rows} exportFilename="fees-report" />}
    </div>
  )
}
