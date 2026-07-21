import { useMemo, useState } from 'react'
import {
  CalendarDays, Printer, FileDown, Download, CheckCircle2, XCircle, CalendarPlus, Clock3,
  ChevronLeft, ChevronRight, Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { ExportButtons } from '@/components/ExportButtons'
import { useAsyncData } from '@/hooks/useAsyncData'
import { attendanceService } from '@/services/attendance.service'
import { academicClasses, academicSections, ATTENDANCE_STATUS } from '@/services/mockData'
import { exportToCsv } from '@/utils/export'
import { fullName, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const CLASS_OPTIONS = academicClasses.map((c) => c.name)
const SECTION_OPTIONS = Array.from(new Set(academicSections.map((s) => s.name)))

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const EXPORT_COLS = [
  { key: 'name', label: 'Student' },
  { key: 'admission_no', label: 'Admission No' },
  { key: 'class', label: 'Class' },
  { key: 'section', label: 'Section' },
  { key: 'status', label: 'Status' },
  { key: 'check_in', label: 'Check-in' },
  { key: 'remarks', label: 'Remarks' },
]

function StatusPill({ status }) {
  const s = ATTENDANCE_STATUS[status] || ATTENDANCE_STATUS.present
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize', s.bg, s.text, s.border)}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  )
}

function CalendarPicker({ selected, onSelect }) {
  const [view, setView] = useState(() => {
    const d = selected ? new Date(selected) : new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  const today = new Date()
  const firstDay = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const prevMonth = () => setView((v) => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 })
  const nextMonth = () => setView((v) => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 })

  const dateStr = (day) => `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
          <p className="text-sm font-semibold">{MONTHS[view.month]} {view.year}</p>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const ds = dateStr(day)
            const isSelected = ds === selected
            const isToday = ds === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(ds)}
                className={cn(
                  'flex h-8 items-center justify-center rounded-md text-xs transition-colors',
                  isSelected && 'bg-primary text-primary-foreground font-semibold',
                  !isSelected && isToday && 'ring-1 ring-primary text-primary',
                  !isSelected && !isToday && 'hover:bg-muted',
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AttendanceByDatePage() {
  const { toast } = useToast()
  const todayStr = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(todayStr)
  const [classFilter, setClassFilter] = useState(CLASS_OPTIONS[0])
  const [sectionFilter, setSectionFilter] = useState(SECTION_OPTIONS[0])

  const { data, isLoading } = useAsyncData(() => attendanceService.byDate(date), [date])

  const rows = useMemo(() => {
    const all = data || []
    return all.filter((r) => r.class === classFilter && r.section === sectionFilter)
  }, [data, classFilter, sectionFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    present: rows.filter((r) => r.status === 'present').length,
    absent: rows.filter((r) => r.status === 'absent').length,
    leave: rows.filter((r) => r.status === 'leave').length,
    late: rows.filter((r) => r.status === 'late').length,
  }), [rows])

  const handlePrint = () => window.print()
  const handleExportPdf = () => toast({ title: 'Exporting PDF', description: 'The attendance PDF will download shortly.' })
  const handleExportCsv = () => exportToCsv(rows, EXPORT_COLS, `attendance-${date}`)

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Attendance', to: '/attendance' }, { label: 'By Date' }]} />
      <PageHeader
        title="Attendance By Date"
        description="View attendance for any date with a calendar picker and class filters."
        icon={CalendarDays}
        actions={
          <>
            <Button variant="outline" onClick={handleExportPdf}><FileDown className="mr-2 h-4 w-4" /> Export PDF</Button>
            <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Students" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Present" value={stats.present} icon={CheckCircle2} accent="success" />
        <StatCard label="Absent" value={stats.absent} icon={XCircle} accent="destructive" />
        <StatCard label="Leave" value={stats.leave} icon={CalendarPlus} accent="warning" />
        <StatCard label="Late" value={stats.late} icon={Clock3} accent="chart2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left — selectors */}
        <div className="space-y-4">
          <CalendarPicker selected={date} onSelect={setDate} />
          <Card>
            <CardContent className="space-y-3 p-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Class</label>
                <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Section</label>
                <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  {SECTION_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="secondary" className="rounded-full">{classFilter}</Badge>
                <Badge variant="outline" className="rounded-full">Section {sectionFilter}</Badge>
                <Badge variant="outline" className="rounded-full">{date}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right — table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Attendance for {date}</h3>
            <ExportButtons rows={rows} columns={EXPORT_COLS} filename={`attendance-${date}`} />
          </div>

          {isLoading ? (
            <LoadingSkeleton variant="table" rows={8} cols={6} />
          ) : rows.length === 0 ? (
            <NoData title="No records found" description="No attendance records for the selected date and class." />
          ) : (
            <Card className="print:shadow-none print:border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full">
                    <thead className="border-b bg-muted/40">
                      <tr>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Student</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Admission No</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Check-in</th>
                        <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {initials(r.name)}
                              </div>
                              <span className="text-sm font-medium">{fullName(r.name)}</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">{r.admission_no}</td>
                          <td className="p-3"><StatusPill status={r.status} /></td>
                          <td className="p-3 text-sm">{r.check_in}</td>
                          <td className="p-3 text-sm text-muted-foreground">{r.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
