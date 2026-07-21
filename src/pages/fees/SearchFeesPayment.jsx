import { useMemo, useState } from 'react'
import { Search, Eye, Download, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer } from '@/components/Drawer'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useAsyncData } from '@/hooks/useAsyncData'
import { feesService } from '@/services/fees.service'
import { PAYMENT_MODES, PAYMENT_STATUSES, FEE_SESSIONS, classOptions, sectionOptions } from '@/data/fees.mock'
import { formatCurrency, formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'receipt_no', label: 'Receipt No' },
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'session', label: 'Session' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'mode', label: 'Mode' },
  { key: 'status', label: 'Status' },
]

export default function SearchFeesPaymentPage() {
  const { data, isLoading } = useAsyncData(() => feesService.getFeesPayments(), [])
  const [search, setSearch] = useState('')
  const [session, setSession] = useState('all')
  const [classF, setClassF] = useState('all')
  const [section, setSection] = useState('all')
  const [mode, setMode] = useState('all')
  const [status, setStatus] = useState('all')
  const [viewRow, setViewRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const ms = !search || r.student_name.toLowerCase().includes(search.toLowerCase()) || r.receipt_no.toLowerCase().includes(search.toLowerCase())
        return [ms, session === 'all' || r.session === session, classF === 'all' || r.class === classF, section === 'all' || r.class.includes(section), mode === 'all' || r.mode === mode, status === 'all' || r.status === status].every(Boolean)
      }),
    [rows, search, session, classF, section, mode, status],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    paid: rows.filter((r) => r.status === 'Paid').length,
    partial: rows.filter((r) => r.status === 'Partial').length,
    collected: rows.reduce((a, b) => a + b.amount, 0),
  }), [rows])

  const columns = useMemo(
    () => [
      { accessorKey: 'receipt_no', header: 'Receipt No', cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.original.receipt_no}</span> },
      { accessorKey: 'student_name', header: 'Student' },
      { accessorKey: 'class', header: 'Class' },
      { accessorKey: 'session', header: 'Session' },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
      { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount) },
      { accessorKey: 'mode', header: 'Mode' },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase()} /> },
    ],
    [],
  )

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Print', icon: Printer, onClick: () => window.print() },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Search Fees Payment' }]} />
      <PageHeader title="Search Fees Payment" description="Find and filter all fee payment records." icon={Search} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Payments" value={stats.total} icon={Search} accent="primary" />
        <StatCard label="Fully Paid" value={stats.paid} icon={Search} accent="success" />
        <StatCard label="Partial" value={stats.partial} icon={Search} accent="warning" />
        <StatCard label="Total Collected" value={formatCurrency(stats.collected)} icon={Download} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search receipt or student…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="fees-payments" />
          <Select value={session} onChange={setSession} options={FEE_SESSIONS} all="All sessions" />
          <Select value={classF} onChange={setClassF} options={classOptions} all="All classes" />
          <Select value={section} onChange={setSection} options={sectionOptions} all="All sections" />
          <Select value={mode} onChange={setMode} options={PAYMENT_MODES} all="All modes" />
          <Select value={status} onChange={setStatus} options={PAYMENT_STATUSES} all="All statuses" />
        </div>
      </FilterBar>

      {isLoading ? <LoadingSkeleton variant="table" rows={6} cols={8} /> : filtered.length === 0 ? <NoData title="No payments found" /> : <DataTable columns={columns} data={filtered} enableExport exportFilename="fees-payments" rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />}

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Payment Details" description={viewRow?.receipt_no} width="sm:max-w-md" footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[{ label: 'Receipt No', value: viewRow.receipt_no }, { label: 'Student', value: viewRow.student_name }, { label: 'Admission No', value: viewRow.admission_no }, { label: 'Class', value: viewRow.class }, { label: 'Session', value: viewRow.session }, { label: 'Date', value: formatDate(viewRow.date) }, { label: 'Amount', value: formatCurrency(viewRow.amount) }, { label: 'Mode', value: viewRow.mode }, { label: 'Collected By', value: viewRow.collected_by }, { label: 'Status', value: <StatusBadge status={viewRow.status.toLowerCase()} /> }].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>
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
