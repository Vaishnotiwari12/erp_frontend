// ====================================================================
// Module: Human Resources
// Page: Payroll
//
// Purpose:
// Generate, review, and process monthly staff payroll.
//
// Data Source:
// hr.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, Wallet, Printer, Eye, CircleCheck as CheckCircle2, Download, Clock, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
import { usePayroll } from '@/hooks/useHR'
import { payrollMonths } from '@/data/hr.mock'
import { formatCurrency, formatDate, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'employee_id', label: 'Employee ID' },
  { key: 'name', label: 'Name' },
  { key: 'department', label: 'Department' },
  { key: 'basic_salary', label: 'Basic Salary' },
  { key: 'total_allowances', label: 'Total Allowances' },
  { key: 'total_deductions', label: 'Total Deductions' },
  { key: 'net_salary', label: 'Net Salary' },
  { key: 'status', label: 'Status' },
]

export default function PayrollPage() {
  const { toast } = useToast()
  const [month, setMonth] = useState(payrollMonths[0])
  const [viewRow, setViewRow] = useState(null)

  const {
    rows: filtered, summary, deptOptions, isLoading,
    search, setSearch, deptFilter, setDeptFilter, statusFilter, setStatusFilter,
    processPayment, bulkProcess, generate,
  } = usePayroll(month)

  const handleProcessPayment = async (row) => {
    await processPayment(row)
  }

  const handleBulkProcess = async (selected) => {
    await bulkProcess(selected)
  }

  const handleGenerate = async () => {
    await generate()
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Staff Member',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {initials(row.original.name)}
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.employee_id}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'basic_salary', header: 'Basic', cell: ({ row }) => formatCurrency(row.original.basic_salary) },
    { accessorKey: 'total_allowances', header: 'Allowances', cell: ({ row }) => (
      <span className="font-medium text-success">+{formatCurrency(row.original.total_allowances)}</span>
    ) },
    { accessorKey: 'total_deductions', header: 'Deductions', cell: ({ row }) => (
      <span className="font-medium text-destructive">-{formatCurrency(row.original.total_deductions)}</span>
    ) },
    { accessorKey: 'net_salary', header: 'Net Salary', cell: ({ row }) => (
      <span className="text-base font-bold">{formatCurrency(row.original.net_salary)}</span>
    ) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => (
      <Badge variant={row.original.status === 'paid' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    ) },
  ], [])

  const rowActions = (r) => [
    { label: 'View Payslip', icon: Eye, onClick: () => setViewRow(r) },
    ...(r.status === 'pending' ? [
      { label: 'Process Payment', icon: BadgeCheck, onClick: () => handleProcessPayment(r) },
    ] : []),
    { separator: true },
    { label: 'Print Payslip', icon: Printer, onClick: () => window.print() },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Payroll' }]} />
      <PageHeader
        title="Payroll Management"
        description="Generate, review, and process monthly staff payroll."
        icon={DollarSign}
        actions={
          <>
            <Button variant="outline" onClick={handleGenerate}>
              <TrendingUp className="mr-2 h-4 w-4" /> Generate Payroll
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" /> Print All
            </Button>
          </>
        }
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Gross" value={formatCurrency(summary.totalGross)} icon={Wallet} accent="primary" />
        <StatCard label="Total Net Pay" value={formatCurrency(summary.totalNet)} icon={DollarSign} accent="success" />
        <StatCard label="Total Deductions" value={formatCurrency(summary.totalDeductions)} icon={TrendingDown} accent="destructive" />
        <StatCard label="Paid" value={summary.paid} icon={CheckCircle2} accent="success" />
        <StatCard label="Pending" value={summary.pending} icon={Clock} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search staff or employee ID…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename={`payroll-${month}`} />
          {/* Month selector — changes trigger a refetch via useAsyncData dep */}
          <select value={month} onChange={(e) => setMonth(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            {payrollMonths.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All departments</option>
            {deptOptions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={8} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No payroll data" description="Generate payroll for this month to see records." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename={`payroll-${month}`}
          bulkActions={[
            { label: 'Process Payments', icon: BadgeCheck, onClick: handleBulkProcess },
          ]}
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Payslip Detail Drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Payslip"
        description={`${viewRow?.name} — ${month}`}
        width="sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>
            <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </>
        }
      >
        {viewRow && (
          <div className="space-y-5">
            {/* Employee summary header */}
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {initials(viewRow.name)}
              </div>
              <div>
                <p className="font-semibold">{viewRow.name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.employee_id} · {viewRow.department}</p>
              </div>
              <Badge variant={viewRow.status === 'paid' ? 'default' : 'secondary'} className="ml-auto">
                {viewRow.status}
              </Badge>
            </div>

            {/* Earnings section */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Earnings</p>
              <div className="space-y-1.5 rounded-lg border p-4 text-sm">
                <SalaryLine label="Basic Salary" value={viewRow.basic_salary} />
                <SalaryLine label="HRA" value={viewRow.hra} />
                <SalaryLine label="Transport Allowance" value={viewRow.transport_allowance} />
                <SalaryLine label="Medical Allowance" value={viewRow.medical_allowance} />
                <div className="my-2 border-t" />
                <SalaryLine label="Gross Earnings" value={viewRow.basic_salary + viewRow.total_allowances} bold />
              </div>
            </div>

            {/* Deductions section */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Deductions</p>
              <div className="space-y-1.5 rounded-lg border p-4 text-sm">
                <SalaryLine label="Provident Fund (12%)" value={viewRow.pf_deduction} negative />
                <SalaryLine label="Tax Deduction (5%)" value={viewRow.tax_deduction} negative />
                <div className="my-2 border-t" />
                <SalaryLine label="Total Deductions" value={viewRow.total_deductions} bold negative />
              </div>
            </div>

            {/* Net pay summary */}
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground">Net Salary (Take Home)</p>
              <p className="mt-1 text-2xl font-bold text-primary">{formatCurrency(viewRow.net_salary)}</p>
              {viewRow.payment_date && (
                <p className="mt-1 text-xs text-muted-foreground">Paid on {formatDate(viewRow.payment_date)}</p>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Bank Account</dt><dd className="font-medium">{viewRow.bank_account}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Pay Month</dt><dd className="font-medium">{month}</dd></div>
            </dl>
          </div>
        )}
      </Drawer>
    </div>
  )
}

// Small helper to render a labeled salary line item
function SalaryLine({ label, value, bold, negative }) {
  return (
    <div className={`flex items-center justify-between ${bold ? 'font-semibold' : ''}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={negative ? 'text-destructive' : ''}>
        {negative ? '-' : ''}{formatCurrency(value)}
      </span>
    </div>
  )
}
