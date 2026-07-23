// ====================================================================
// Module: Hostel
// Page: Student Hostel List
//
// Purpose:
// View all students currently residing in hostel rooms.
//
// Data Source:
// hostel.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  Users,
  DoorOpen,
  BedDouble,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { DataTable } from '@/components/DataTable'
import { Drawer } from '@/components/Drawer'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { AllocationStatusBadge } from '@/components/AllocationStatusBadge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hostelService } from '@/services/hostel.service'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'student_name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'room_number', label: 'Room' },
  { key: 'room_type_name', label: 'Room Type' },
  { key: 'block', label: 'Block' },
  { key: 'floor', label: 'Floor' },
  { key: 'check_in', label: 'Check In' },
  { key: 'allocation_status', label: 'Status' },
]

export default function StudentHostelListPage() {
  const { data, isLoading } = useAsyncData(() => hostelService.getAllocations(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')
  const [blockFilter, setBlockFilter] = useState('all')
  const [viewRow, setViewRow] = useState(null)

  const rows = data || []

  // Only show active allocations by default — this is the "current" hostel list.
  const filtered = useMemo(() => rows.filter((a) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      a.student_name.toLowerCase().includes(q) ||
      a.admission_no.toLowerCase().includes(q) ||
      a.room_number.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || a.allocation_status === statusFilter
    const matchBlock = blockFilter === 'all' || a.block === blockFilter
    return matchSearch && matchStatus && matchBlock
  }), [rows, search, statusFilter, blockFilter])

  const stats = useMemo(() => ({
    total: rows.filter((a) => a.allocation_status === 'active').length,
    blocks: new Set(rows.filter((a) => a.allocation_status === 'active').map((a) => a.block)).size,
    rooms: new Set(rows.filter((a) => a.allocation_status === 'active').map((a) => a.room_id)).size,
  }), [rows])

  const blocks = useMemo(() => [...new Set(rows.map((a) => a.block))], [rows])

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
    { accessorKey: 'room_number', header: 'Room', cell: ({ row }) => (
      <span className="flex items-center gap-1.5">
        <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
        {row.original.room_number}
      </span>
    ) },
    { accessorKey: 'room_type_name', header: 'Type', cell: ({ row }) => <Badge variant="secondary">{row.original.room_type_name}</Badge> },
    { accessorKey: 'block', header: 'Block' },
    { accessorKey: 'check_in', header: 'Check In', cell: ({ row }) => formatDate(row.original.check_in) },
    { accessorKey: 'allocation_status', header: 'Status', cell: ({ row }) => <AllocationStatusBadge status={row.original.allocation_status} /> },
  ], [])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Hostel' }, { label: 'Student Hostel List' }]} />
      <PageHeader
        title="Student Hostel List"
        description="View all students currently residing in hostel rooms."
        icon={Users}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Students in Hostel" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Blocks Occupied" value={stats.blocks} icon={DoorOpen} accent="chart2" />
        <StatCard label="Rooms in Use" value={stats.rooms} icon={BedDouble} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by student, admission no, or room…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="student-hostel-list" />
          <select value={blockFilter} onChange={(e) => setBlockFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All blocks</option>
            {blocks.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="active">Active</option>
            <option value="vacated">Vacated</option>
            <option value="pending">Pending</option>
            <option value="all">All statuses</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No students found" description="No students match the current filters." />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          enableSelection
          enableExport
          exportFilename="student-hostel-list"
        />
      )}

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Student Hostel Details"
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
                <p className="text-xs text-muted-foreground">{viewRow.admission_no} · {viewRow.class}</p>
              </div>
              <AllocationStatusBadge status={viewRow.allocation_status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Room', value: viewRow.room_number },
                { label: 'Room Type', value: viewRow.room_type_name },
                { label: 'Block', value: viewRow.block },
                { label: 'Floor', value: viewRow.floor },
                { label: 'Check In', value: formatDate(viewRow.check_in) },
                { label: 'Check Out', value: viewRow.check_out ? formatDate(viewRow.check_out) : '—' },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Drawer>
    </div>
  )
}
