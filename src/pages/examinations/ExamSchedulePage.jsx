import { useMemo, useState } from 'react'
import { CalendarRange, Eye, Pencil, Printer, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer } from '@/components/Drawer'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { useAsyncData } from '@/hooks/useAsyncData'
import { examinationService } from '@/services/examination.service'
import { formatDate } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

const EXAM_GROUPS = ['Annual Examination', 'Pre-Board Examination', 'Unit Test 1', 'Board Mock Test', 'Half Yearly Examination', 'First Term Examination']
const CLASSES = ['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Year-1', 'Year-2']
const SECTIONS = ['A', 'B', 'C']
const TEACHERS = ['Hannah Kim', 'Marcus Johnson', 'Priya Patel', 'Diego Ramirez', 'Yuki Tanaka', 'Olivia Brooks']

export default function ExamSchedulePage() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => examinationService.getExamSchedule(), [])
  const [search, setSearch] = useState('')
  const [examGroup, setExamGroup] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [section, setSection] = useState('all')
  const [teacher, setTeacher] = useState('all')
  const [viewRow, setViewRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => {
      const ms = !search || r.subject.toLowerCase().includes(search.toLowerCase()) || r.invigilator.toLowerCase().includes(search.toLowerCase())
      const meg = examGroup === 'all' || r.exam_group === examGroup
      const mc = classFilter === 'all' || r.class === classFilter
      const msc = section === 'all' || r.section === section
      const mt = teacher === 'all' || r.teacher === teacher
      return ms && meg && mc && msc && mt
    }),
    [rows, search, examGroup, classFilter, section, teacher],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    groups: new Set(rows.map((r) => r.exam_group)).size,
    classes: new Set(rows.map((r) => r.class)).size,
    invigilators: new Set(rows.map((r) => r.invigilator)).size,
  }), [rows])

  const columns = useMemo(() => [
    { accessorKey: 'subject', header: 'Subject' },
    { accessorKey: 'exam_group', header: 'Exam Group' },
    { accessorKey: 'class', header: 'Class' },
    { accessorKey: 'section', header: 'Section' },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => formatDate(row.original.date) },
    { accessorKey: 'time', header: 'Time' },
    { accessorKey: 'duration', header: 'Duration' },
    { accessorKey: 'room', header: 'Room' },
    { accessorKey: 'invigilator', header: 'Invigilator' },
  ], [])

  const rowActions = (r) => [
    { label: 'View', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Edit', icon: Pencil, onClick: () => toast({ title: 'Edit schedule', description: r.subject }) },
    { separator: true },
    { label: 'Print', icon: Printer, onClick: () => toast({ title: 'Printing schedule…', description: r.subject }) },
    { label: 'Export PDF', icon: Download, onClick: () => toast({ title: 'Exporting PDF…', description: r.subject }) },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Exam Schedule' }]} />
      <PageHeader
        title="Exam Schedule"
        description="Weekly examination schedule across classes and sections."
        icon={CalendarRange}
        actions={<Button variant="outline" onClick={() => toast({ title: 'Exporting full schedule PDF…' })}><Download className="mr-2 h-4 w-4" /> Export PDF</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Exams" value={stats.total} icon={FileText} accent="primary" />
        <StatCard label="Exam Groups" value={stats.groups} icon={CalendarRange} accent="chart2" />
        <StatCard label="Classes" value={stats.classes} icon={FileText} accent="chart3" />
        <StatCard label="Invigilators" value={stats.invigilators} icon={Eye} accent="chart4" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search subject or invigilator…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <select value={examGroup} onChange={(e) => setExamGroup(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All exam groups</option>
            {EXAM_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All sections</option>
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={teacher} onChange={(e) => setTeacher(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All teachers</option>
            {TEACHERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={8} cols={9} />
      ) : filtered.length === 0 ? (
        <NoData title="No schedule entries found" />
      ) : (
        <DataTable columns={columns} data={filtered} rowActions={(r) => <ActionDropdown actions={rowActions(r)} />} />
      )}

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Schedule Entry" description={viewRow?.subject} width="sm:max-w-md"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            {[
              { label: 'Subject', value: viewRow.subject },
              { label: 'Exam Group', value: viewRow.exam_group },
              { label: 'Class', value: viewRow.class },
              { label: 'Section', value: viewRow.section },
              { label: 'Date', value: formatDate(viewRow.date) },
              { label: 'Time', value: viewRow.time },
              { label: 'Duration', value: viewRow.duration },
              { label: 'Room', value: viewRow.room },
              { label: 'Invigilator', value: viewRow.invigilator },
              { label: 'Teacher', value: viewRow.teacher },
            ].map((r) => (
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
