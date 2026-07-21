import { useMemo, useState } from 'react'
import {
  Plus, ClipboardList, Eye, Check, X, Trash2, FileText, Clock, CheckCircle2, XCircle,
} from 'lucide-react'
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
import { DeleteDialog } from '@/components/DeleteDialog'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useAsyncData } from '@/hooks/useAsyncData'
import { studentService } from '@/services/student.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const STAGES = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

const EXPORT_COLS = [
  { key: 'first_name', label: 'First Name' },
  { key: 'last_name', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'school_name', label: 'Institution' },
  { key: 'class', label: 'Class' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Submitted' },
]

const STAGE_ICON = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
}

export default function AdmissionsPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => studentService.admissions(), [])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [viewApp, setViewApp] = useState(null)
  const [deleteApp, setDeleteApp] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const name = `${r.first_name} ${r.last_name}`
        const ms = !search || name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase())
        const mst = status === 'all' || r.status === status
        return ms && mst
      }),
    [rows, search, status],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    approved: rows.filter((r) => r.status === 'approved').length,
    rejected: rows.filter((r) => r.status === 'rejected').length,
  }), [rows])

  const handleApprove = async (app) => {
    toast({ title: 'Application approved', description: `${app.first_name} ${app.last_name} has been admitted.` })
    refetch()
  }
  const handleReject = async (app) => {
    toast({ title: 'Application rejected', description: `${app.first_name} ${app.last_name} was rejected.` })
    refetch()
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'first_name',
        header: 'Applicant',
        cell: ({ row }) => (
          <button className="flex items-center gap-3 text-left" onClick={() => setViewApp(row.original)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium hover:underline">{row.original.first_name} {row.original.last_name}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </button>
        ),
      },
      { accessorKey: 'school_name', header: 'Institution' },
      { accessorKey: 'class', header: 'Class' },
      { accessorKey: 'guardian_name', header: 'Guardian' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const Icon = STAGE_ICON[row.original.status] || Clock
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize"
              style={row.original.status === 'approved' ? { color: 'hsl(142 71% 45%)', borderColor: 'hsl(142 71% 45% / 0.2)', background: 'hsl(142 71% 45% / 0.1)' } : row.original.status === 'rejected' ? { color: 'hsl(0 72% 51%)', borderColor: 'hsl(0 72% 51% / 0.2)', background: 'hsl(0 72% 51% / 0.1)' } : { color: 'hsl(38 92% 50%)', borderColor: 'hsl(38 92% 50% / 0.2)', background: 'hsl(38 92% 50% / 0.1)' }}>
              <Icon className="h-3 w-3" />{row.original.status}
            </span>
          )
        },
      },
      { accessorKey: 'created_at', header: 'Submitted', cell: ({ row }) => formatDate(row.original.created_at) },
    ],
    [],
  )

  const rowActions = (app) => [
    { label: 'View', icon: Eye, onClick: () => setViewApp(app) },
    { label: 'Approve', icon: Check, onClick: () => handleApprove(app), disabled: app.status === 'approved' },
    { label: 'Reject', icon: X, onClick: () => handleReject(app), disabled: app.status === 'rejected' },
    { separator: true },
    { label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => setDeleteApp(app) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Students', to: '/students' }, { label: 'Admissions' }]} />
      <PageHeader
        title="Online Admissions"
        description="Track and manage online admission applications."
        icon={FileText}
        actions={<Button onClick={() => toast({ title: 'New application form' })}><Plus className="mr-2 h-4 w-4" /> New Application</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={stats.total} icon={ClipboardList} accent="primary" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warning" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="success" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} accent="destructive" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search applicants…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="admissions" />
          <FilterSelect value={status} onChange={setStatus} />
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No applications found" description="Try adjusting your filters." actionLabel="New Application" onAction={() => toast({ title: 'New application form' })} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="admissions"
          bulkActions={[{ label: 'Delete', icon: Trash2, variant: 'destructive', onClick: () => { toast({ title: 'Applications deleted' }); refetch() } }]}
          rowActions={(app) => <ActionDropdown actions={rowActions(app)} />}
        />
      )}

      <Drawer
        open={!!viewApp}
        onOpenChange={(o) => !o && setViewApp(null)}
        title="Application Details"
        description={viewApp ? `${viewApp.first_name} ${viewApp.last_name}` : ''}
        width="sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewApp(null)}>Close</Button>
            {viewApp?.status === 'pending' ? (
              <>
                <Button variant="outline" onClick={() => { handleReject(viewApp); setViewApp(null) }}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => { handleApprove(viewApp); setViewApp(null) }}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </>
            ) : null}
          </>
        }
      >
        {viewApp ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'First Name', value: viewApp.first_name },
              { label: 'Last Name', value: viewApp.last_name },
              { label: 'Email', value: viewApp.email },
              { label: 'Mobile', value: viewApp.mobile || '—' },
              { label: 'Institution', value: viewApp.school_name },
              { label: 'Class', value: viewApp.class },
              { label: 'Guardian', value: viewApp.guardian_name || '—' },
              { label: 'Submitted', value: formatDate(viewApp.created_at) },
            ].map((r) => (
              <div key={r.label} className="space-y-0.5">
                <dt className="text-xs font-medium text-muted-foreground">{r.label}</dt>
                <dd className="text-sm font-medium">{r.value}</dd>
              </div>
            ))}
            <div className="sm:col-span-2 space-y-0.5">
              <dt className="text-xs font-medium text-muted-foreground">Notes</dt>
              <dd className="text-sm">{viewApp.notes || '—'}</dd>
            </div>
          </dl>
        ) : null}
      </Drawer>

      <DeleteDialog
        open={!!deleteApp}
        onOpenChange={(o) => !o && setDeleteApp(null)}
        entityName={deleteApp ? `${deleteApp.first_name} ${deleteApp.last_name}` : ''}
        onConfirm={() => { toast({ title: 'Application deleted' }); setDeleteApp(null); refetch() }}
      />
    </div>
  )
}

function FilterSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
      <option value="all">All statuses</option>
      {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  )
}
