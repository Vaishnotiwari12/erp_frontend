// ====================================================================
// Module: Lesson Plan
// Page: Topic
//
// Purpose:
// List all topics covered across lesson plans with class and subject context.
//
// Data Source:
// lessonPlan.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { FileText, Eye, BookOpen, CircleCheck as CheckCircle, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer } from '@/components/Drawer'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { StatusBadge } from '@/components/StatusBadge'
import { useLessonPlans } from '@/hooks/useLessonPlan'
import { formatDate } from '@/utils/format'

const EXPORT_COLS = [
  { key: 'topic', label: 'Topic' },
  { key: 'lesson_name', label: 'Lesson' },
  { key: 'class_name', label: 'Class' },
  { key: 'subject_name', label: 'Subject' },
  { key: 'status', label: 'Status' },
]

function LessonStatusBadge({ status }) {
  const map = { 'in-progress': 'pending', completed: 'active', pending: 'inactive' }
  return <StatusBadge status={map[status] || status} />
}

export default function TopicPage() {
  const {
    rows, classes, subjects, stats, isLoading,
    search, setSearch, classFilter, setClassFilter,
    subjectFilter, setSubjectFilter, statusFilter, setStatusFilter,
  } = useLessonPlans()

  const [viewRow, setViewRow] = useState(null)

  const columns = useMemo(() => [
    {
      accessorKey: 'topic',
      header: 'Topic',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium hover:underline">{row.original.topic}</span>
            <span className="text-xs text-muted-foreground">{row.original.lesson_name}</span>
          </div>
        </button>
      ),
    },
    { accessorKey: 'lesson_name', header: 'Lesson' },
    { accessorKey: 'class_name', header: 'Class', cell: ({ row }) => <Badge variant="secondary">{row.original.class_name}</Badge> },
    { accessorKey: 'subject_name', header: 'Subject' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <LessonStatusBadge status={row.original.status} /> },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Lesson Plan' }, { label: 'Topic' }]} />
      <PageHeader
        title="Topics"
        description="Browse all topics covered across lesson plans."
        icon={FileText}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Topics" value={stats.total} icon={FileText} accent="primary" />
        <StatCard label="Completed" value={stats.completed} icon={CheckCircle} accent="success" />
        <StatCard label="In Progress" value={stats.in_progress} icon={Clock} accent="warning" />
        <StatCard label="Pending" value={stats.pending} icon={BookOpen} accent="chart2" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by topic name…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={rows} columns={EXPORT_COLS} filename="topics" />
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All classes</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All subjects</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={5} cols={5} />
      ) : rows.length === 0 ? (
        <NoData title="No topics found" description="No topics match the current filters." />
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          enableSelection
          enableExport
          exportFilename="topics"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Detail drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Topic Details"
        description={viewRow?.topic}
        width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{viewRow.topic}</p>
                <p className="text-xs text-muted-foreground">{viewRow.lesson_name} · {viewRow.class_name}</p>
              </div>
              <LessonStatusBadge status={viewRow.status} />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {[
                { label: 'Lesson', value: viewRow.lesson_name },
                { label: 'Subject', value: viewRow.subject_name },
                { label: 'Class', value: viewRow.class_name },
                { label: 'Created On', value: formatDate(viewRow.created_at) },
              ].map((f) => (
                <div key={f.label} className="space-y-0.5">
                  <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
                  <dd className="text-sm font-medium">{f.value || '—'}</dd>
                </div>
              ))}
            </dl>

            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">Description</dt>
              <dd className="text-sm">{viewRow.description || '—'}</dd>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
