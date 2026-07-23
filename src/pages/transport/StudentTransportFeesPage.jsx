// ====================================================================
// Module: Transport
// Page: Student Transport Fees
//
// Purpose:
// Track transport fee payments, dues, and payment history.
//
// Data Source:
// transport.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  DollarSign,
  Eye,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FeeStatusBadge } from '@/components/FeeStatusBadge'
import { useTransportFees } from '@/hooks/useTransport'
import { formatCurrency, formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'route_name', label: 'Route' },
  { key: 'vehicle_number', label: 'Vehicle' },
  { key: 'total_amount', label: 'Total Amount' },
  { key: 'paid_amount', label: 'Paid Amount' },
  { key: 'due_amount', label: 'Due Amount' },
  { key: 'fee_status', label: 'Status' },
]

export default function StudentTransportFeesPage() {
  const { toast } = useToast()
  const {
    rows: filtered, allFees: rows, stats, isLoading,
    search, setSearch, statusFilter, setStatusFilter,
    collectFee,
  } = useTransportFees()
  const [viewRow, setViewRow] = useState(null)
  const [collectRow, setCollectRow] = useState(null)

  const handleCollect = async (payload) => {
    await collectFee(collectRow._id, payload)
    setCollectRow(null)
  }

  const columns = useMemo(() => [
    {
      accessorKey: 'student_name',
      header: 'Student',
      cell: ({ row }) => (
        <button className="flex flex-col text-left" onClick={() => setViewRow(row.original)}>
          <span className="font-medium hover:underline">{row.original.student_name}</span>
          <span className="text-xs text-muted-foreground">{row.original.admission_no}</span>
        </button>
      ),
    },
    { accessorKey: 'class', header: 'Class', cell: ({ row }) => <Badge variant="outline">{row.original.class}</Badge> },
    { accessorKey: 'route_name', header: 'Route', cell: ({ row }) => <Badge variant="secondary">{row.original.route_name}</Badge> },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total_amount) },
    { accessorKey: 'paid_amount', header: 'Paid', cell: ({ row }) => <span className="text-success font-medium">{formatCurrency(row.original.paid_amount)}</span> },
    { accessorKey: 'due_amount', header: 'Due', cell: ({ row }) => row.original.due_amount > 0 ? <span className="text-destructive font-medium">{formatCurrency(row.original.due_amount)}</span> : <span className="text-muted-foreground">—</span> },
    { accessorKey: 'fee_status', header: 'Status', cell: ({ row }) => <FeeStatusBadge status={row.original.fee_status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View Details', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Collect Payment', icon: CreditCard, onClick: () => setCollectRow(r), disabled: r.fee_status === 'paid' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Transport' }, { label: 'Transport Fees' }]} />
      <PageHeader
        title="Student Transport Fees"
        description="Track transport fee payments, dues, and payment history."
        icon={DollarSign}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats.total} icon={Wallet} accent="primary" />
        <StatCard label="Total Collected" value={formatCurrency(stats.totalCollected)} icon={TrendingUp} accent="success" />
        <StatCard label="Total Due" value={formatCurrency(stats.totalDue)} icon={TrendingDown} accent="destructive" />
        <StatCard label="Pending Payments" value={stats.pending} icon={CreditCard} accent="warning" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student, admission no, or route…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="transport-fees" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No fee records found" description="Transport fee records will appear here." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="transport-fees"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Detail drawer with payment history */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Fee Details"
        description={viewRow?.student_name}
        width="sm:max-w-md"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>
            {viewRow && viewRow.fee_status !== 'paid' && (
              <Button onClick={() => { setCollectRow(viewRow); setViewRow(null) }}>
                <CreditCard className="mr-2 h-4 w-4" /> Collect Payment
              </Button>
            )}
          </>
        }
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.student_name}</p>
                <p className="text-xs text-muted-foreground">{viewRow.admission_no} · {viewRow.class}</p>
              </div>
              <FeeStatusBadge status={viewRow.fee_status} />
            </div>

            {/* Fee summary — total, paid, due */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border bg-muted/20 p-3 text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{formatCurrency(viewRow.total_amount)}</p>
              </div>
              <div className="rounded-lg border bg-success/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="text-lg font-bold text-success">{formatCurrency(viewRow.paid_amount)}</p>
              </div>
              <div className="rounded-lg border bg-destructive/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">Due</p>
                <p className="text-lg font-bold text-destructive">{formatCurrency(viewRow.due_amount)}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Route', value: viewRow.route_name },
                { label: 'Vehicle', value: viewRow.vehicle_number },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            {/* Payment history — list of all payments made so far. */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Payment History</p>
              {viewRow.payment_history.length === 0 ? (
                <div className="rounded-lg border bg-muted/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground">No payments recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {viewRow.payment_history.map((p) => (
                    <div key={p._id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 text-success">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{formatCurrency(p.amount)}</p>
                          <p className="text-xs text-muted-foreground">{p.method} · {formatDate(p.date)}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{p.remark}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Collect payment drawer */}
      <CollectPaymentDrawer
        open={!!collectRow}
        onOpenChange={(o) => !o && setCollectRow(null)}
        fee={collectRow}
        onSubmit={handleCollect}
      />
    </div>
  )
}

// ─── Collect Payment Drawer ──────────────────────────────────────────────────
// Quick payment form — amount, method, and remark.
function CollectPaymentDrawer({ open, onOpenChange, fee, onSubmit }) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('Cash')
  const [remark, setRemark] = useState('')

  // Reset form when the drawer opens for a new fee record.
  const dueAmount = fee?.due_amount || 0

  const handleSubmit = () => {
    const amt = parseFloat(amount) || 0
    if (amt <= 0) return
    onSubmit({
      amount: amt,
      method,
      remark: remark || 'Payment collected',
      date: new Date().toISOString().slice(0, 10),
    })
    setAmount('')
    setRemark('')
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Collect Payment"
      description={fee?.student_name}
      width="sm:max-w-sm"
      footer={
        <DrawerFooter
          onCancel={() => onOpenChange(false)}
          submitLabel="Collect"
          submitDisabled={!amount || parseFloat(amount) <= 0}
          onSubmit={handleSubmit}
        />
      }
    >
      <div className="space-y-4">
        {/* Show the due amount prominently so staff know what's outstanding. */}
        <div className="rounded-lg border bg-destructive/5 p-3">
          <p className="text-xs text-muted-foreground">Outstanding Due</p>
          <p className="text-xl font-bold text-destructive">{formatCurrency(dueAmount)}</p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Amount <span className="text-destructive">*</span></Label>
          <Input type="number" min="1" max={dueAmount} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Payment Method</Label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
            <option>Cheque</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Remark</Label>
          <Input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Optional note" />
        </div>
      </div>
    </Drawer>
  )
}
