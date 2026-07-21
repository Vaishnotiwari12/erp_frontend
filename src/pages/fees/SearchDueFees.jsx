import { useMemo, useState } from 'react'
import { AlertCircle, Bell, Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useAsyncData } from '@/hooks/useAsyncData'
import { feesService } from '@/services/fees.service'
import { FEE_SESSIONS, classOptions } from '@/data/fees.mock'
import { formatCurrency, formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'fee_name', label: 'Fee' },
  { key: 'total', label: 'Total' },
  { key: 'paid', label: 'Paid' },
  { key: 'due', label: 'Due' },
  { key: 'due_date', label: 'Due Date' },
  { key: 'status', label: 'Status' },
]

export default function SearchDueFeesPage() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => feesService.getDueFees(), [])
  const [search, setSearch] = useState('')
  const [session, setSession] = useState('all')
  const [classF, setClassF] = useState('all')
  const [status, setStatus] = useState('all')

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => [!search || r.student_name.toLowerCase().includes(search.toLowerCase()) || r.admission_no.toLowerCase().includes(search.toLowerCase()), session === 'all' || r.session === session, classF === 'all' || r.class === classF, status === 'all' || r.status === status].every(Boolean)),
    [rows, search, session, classF, status],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    due: rows.reduce((a, b) => a + b.due, 0),
    overdue: rows.filter((r) => r.status === 'Overdue').length,
    partial: rows.filter((r) => r.status === 'Partial').length,
  }), [rows])

  const columns = useMemo(
    () => [
      { accessorKey: 'student_name', header: 'Student' },
      { accessorKey: 'admission_no', header: 'Admission No' },
      { accessorKey: 'class', header: 'Class' },
      { accessorKey: 'fee_name', header: 'Fee' },
      { accessorKey: 'total', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total) },
      { accessorKey: 'paid', header: 'Paid', cell: ({ row }) => formatCurrency(row.original.paid) },
      { accessorKey: 'due', header: 'Due', cell: ({ row }) => <span className="font-semibold text-destructive">{formatCurrency(row.original.due)}</span> },
      { accessorKey: 'due_date', header: 'Due Date', cell: ({ row }) => formatDate(row.original.due_date) },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase()} /> },
    ],
    [],
  )

  const rowActions = (r) => [
    { label: 'Send Reminder', icon: Bell, onClick: async () => { await feesService.sendReminder(r._id); toast({ title: 'Reminder sent', description: `To ${r.student_name}` }) } },
    { label: 'Print', icon: Printer, onClick: () => window.print() },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Search Due Fees' }]} />
      <PageHeader title="Search Due Fees" description="Track pending dues and send payment reminders." icon={AlertCircle} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Dues" value={stats.total} icon={AlertCircle} accent="warning" />
        <StatCard label="Amount Due" value={formatCurrency(stats.due)} icon={Download} accent="destructive" />
        <StatCard label="Overdue" value={stats.overdue} icon={AlertCircle} accent="destructive" />
        <StatCard label="Partial" value={stats.partial} icon={AlertCircle} accent="primary" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student or admission no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="due-fees" />
          <Select value={session} onChange={setSession} options={FEE_SESSIONS} all="All sessions" />
          <Select value={classF} onChange={setClassF} options={classOptions} all="All classes" />
          <Select value={status} onChange={setStatus} options={['Pending', 'Partial', 'Overdue']} all="All statuses" />
        </div>
      </FilterBar>

      {isLoading ? <LoadingSkeleton variant="table" rows={6} cols={9} /> : filtered.length === 0 ? <NoData title="No due fees found" /> : <DataTable columns={columns} data={filtered} enableExport exportFilename="due-fees" rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />}
    </div>
  )
}

function Select({ value, onChange, options, all }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
      <option value="all">{all}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}
