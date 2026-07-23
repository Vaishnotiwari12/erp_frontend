// ====================================================================
// Module: Fees
// Page: Offline Bank Payment
//
// Purpose:
// Review and approve offline bank transfer submissions.
//
// Data Source:
// fees.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { Landmark, Plus, Pencil, Trash2, Eye, Check, X, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/StatusBadge'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useOfflinePayments } from '@/hooks/useFees'
import { BANK_PAYMENT_STATUSES } from '@/data/fees.mock'
import { formatCurrency, formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'transaction_no', label: 'Transaction No' },
  { key: 'bank', label: 'Bank' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

export default function OfflineBankPaymentPage() {
  const { rows, stats, isLoading, search, setSearch, status: statusFilter, setStatus: setStatusFilter, createOfflinePayment, approvePayment, rejectPayment } = useOfflinePayments()
  const [addOpen, setAddOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [deleteRow, setDeleteRow] = useState(null)

  const columns = useMemo(
    () => [
      { accessorKey: 'student_name', header: 'Student' },
      { accessorKey: 'transaction_no', header: 'Transaction No' },
      { accessorKey: 'bank', header: 'Bank' },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => formatCurrency(row.original.amount),
      },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status.toLowerCase()} /> },
    ],
    [],
  )

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => setEditRow(r) },
    ...(r.status === 'Pending'
      ? [
          { separator: true },
          { label: 'Approve', icon: Check, onClick: () => approvePayment(r._id) },
          { label: 'Reject', icon: X, variant: 'destructive', onClick: () => rejectPayment(r._id) },
        ]
      : []),
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Fees', to: '/fees/collect' }, { label: 'Offline Bank Payment' }]} />
      <PageHeader
        title="Offline Bank Payment"
        description="Review and approve offline bank transfer submissions."
        icon={Landmark}
        actions={<Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Payment</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} icon={Landmark} accent="primary" />
        <StatCard label="Pending" value={stats.pending} icon={Eye} accent="warning" />
        <StatCard label="Approved" value={stats.approved} icon={Check} accent="success" />
        <StatCard label="Rejected" value={stats.rejected} icon={X} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student or transaction no…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="offline-payments" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            {BANK_PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={6} />
      ) : rows.length === 0 ? (
        <NoData title="No payments found" actionLabel="Add Payment" onAction={() => setAddOpen(true)} />
      ) : (
        <DataTable columns={columns} data={rows} enableExport exportFilename="offline-payments" rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />
      )}

      <PaymentFormDrawer open={addOpen} onOpenChange={setAddOpen} title="Add Offline Payment" onSubmit={async (p) => { await createOfflinePayment(p); setAddOpen(false) }} />
      <PaymentFormDrawer open={!!editRow} onOpenChange={(o) => !o && setEditRow(null)} title="Edit Payment" initial={editRow} onSubmit={async (p) => { await createOfflinePayment(p); setEditRow(null) }} />

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Payment Details" description={viewRow?.transaction_no} width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Student', value: viewRow.student_name },
              { label: 'Admission No', value: viewRow.admission_no },
              { label: 'Class', value: viewRow.class },
              { label: 'Transaction No', value: viewRow.transaction_no },
              { label: 'Bank', value: viewRow.bank },
              { label: 'Date', value: formatDate(viewRow.date) },
              { label: 'Amount', value: formatCurrency(viewRow.amount) },
              { label: 'Status', value: <StatusBadge status={viewRow.status.toLowerCase()} /> },
              { label: 'Remarks', value: viewRow.remarks },
              { label: 'Proof', value: <span className="inline-flex items-center gap-1 text-primary"><Paperclip className="h-3.5 w-3.5" />{viewRow.proof}</span> },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog open={!!deleteRow} onOpenChange={(o) => !o && setDeleteRow(null)} entityName={deleteRow?.transaction_no}
        onConfirm={() => setDeleteRow(null)} />
    </div>
  )
}

function PaymentFormDrawer({ open, onOpenChange, title, initial, onSubmit }) {
  const [form, setForm] = useState({
    student_name: initial?.student_name || '',
    admission_no: initial?.admission_no || '',
    class: initial?.class || '',
    transaction_no: initial?.transaction_no || '',
    bank: initial?.bank || '',
    date: initial?.date || new Date().toISOString().slice(0, 10),
    amount: initial?.amount ?? '',
    proof: initial?.proof || '',
    remarks: initial?.remarks || '',
    status: initial?.status || 'Pending',
  })
  return (
    <Drawer open={open} onOpenChange={onOpenChange} title={title} description="Offline bank payment details" width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel={initial ? 'Save' : 'Create'} onSubmit={() => onSubmit(form)} />}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }} className="space-y-4">
        <FormSection columns={2}>
          <Field label="Student Name" value={form.student_name} onChange={(v) => setForm((f) => ({ ...f, student_name: v }))} placeholder="e.g. Aarav Sharma" />
          <Field label="Admission No" value={form.admission_no} onChange={(v) => setForm((f) => ({ ...f, admission_no: v }))} placeholder="e.g. ADM-1001" />
          <Field label="Class" value={form.class} onChange={(v) => setForm((f) => ({ ...f, class: v }))} placeholder="e.g. 10-A" />
          <Field label="Transaction No" value={form.transaction_no} onChange={(v) => setForm((f) => ({ ...f, transaction_no: v }))} placeholder="e.g. TXN-880123" />
          <Field label="Bank" value={form.bank} onChange={(v) => setForm((f) => ({ ...f, bank: v }))} placeholder="e.g. Chase Bank" />
          <div className="space-y-1.5">
            <Label className="text-xs">Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Amount</Label>
            <Input type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))} placeholder="e.g. 1200" />
          </div>
          <Field label="Proof Upload" value={form.proof} onChange={(v) => setForm((f) => ({ ...f, proof: v }))} placeholder="receipt-file.pdf" />
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Remarks</Label>
            <Input value={form.remarks} onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))} placeholder="Optional notes" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Status</Label>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {BANK_PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </FormSection>
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </Drawer>
  )
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}
