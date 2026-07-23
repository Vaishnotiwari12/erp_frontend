// ====================================================================
// Module: Academics
// Page: Class Timetable
//
// Purpose:
// View and manage weekly class schedules with color-coded subjects.
//
// Data Source:
// academics.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import {
  CalendarClock, Printer, FileDown, BookOpen, Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useAsyncData } from '@/hooks/useAsyncData'
import { academicsService } from '@/services/academics.service'
import {
  academicClasses, academicSections, TIME_SLOTS, WEEK_DAYS,
  SUBJECT_COLORS, ACADEMIC_YEARS, classTimetable,
} from '@/services/mockData'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const CLASS_OPTIONS = academicClasses.map((c) => c.name)

export default function ClassTimetablePage() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => academicsService.classTimetable(), [])
  const [classFilter, setClassFilter] = useState(CLASS_OPTIONS[0])
  const [sectionFilter, setSectionFilter] = useState('A')
  const [year, setYear] = useState(ACADEMIC_YEARS[0])

  const sectionOptions = useMemo(
    () => academicSections.filter((s) => s.class === classFilter).map((s) => s.name),
    [classFilter],
  )

  const grid = data || classTimetable

  const stats = useMemo(() => {
    const entries = Object.values(grid).filter((e) => !e.isBreak && !e.isFree)
    return {
      total: entries.length,
      subjects: new Set(entries.map((e) => e.subject)).size,
      teachers: new Set(entries.map((e) => e.teacher)).size,
      periods: TIME_SLOTS.length * WEEK_DAYS.length,
    }
  }, [grid])

  const handlePrint = () => {
    window.print()
  }

  const handleExportPdf = () => {
    toast({ title: 'Exporting PDF', description: 'The timetable PDF will download shortly.' })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Academics', to: '/academics/classes' }, { label: 'Class Timetable' }]} />
      <PageHeader
        title="Class Timetable"
        description="View and manage weekly class schedules with color-coded subjects."
        icon={CalendarClock}
        actions={
          <>
            <Button variant="outline" onClick={handleExportPdf}><FileDown className="mr-2 h-4 w-4" /> Export PDF</Button>
            <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Periods" value={stats.periods} icon={Clock} accent="primary" />
        <StatCard label="Scheduled" value={stats.total} icon={CalendarClock} accent="success" />
        <StatCard label="Subjects" value={stats.subjects} icon={BookOpen} accent="chart2" />
        <StatCard label="Teachers" value={stats.teachers} icon={CalendarClock} accent="chart3" />
      </div>

      {/* Selectors */}
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Class</label>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Section</label>
            <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {sectionOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Academic Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {ACADEMIC_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">{classFilter} · {sectionFilter}</Badge>
            <Badge variant="outline" className="rounded-full">{year}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Timetable grid */}
      {isLoading ? (
        <LoadingSkeleton variant="table" rows={8} cols={6} />
      ) : (
        <Card className="print:shadow-none print:border-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="sticky left-0 z-10 bg-muted/40 p-3 text-left text-xs font-semibold text-muted-foreground">
                      Time / Day
                    </th>
                    {WEEK_DAYS.map((day) => (
                      <th key={day} className="min-w-[140px] p-3 text-center text-xs font-semibold text-foreground">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((slot) => (
                    <tr key={slot.id} className="border-b last:border-0">
                      <td className="sticky left-0 z-10 bg-card p-3">
                        <p className="text-xs font-semibold">{slot.label}</p>
                        <p className="text-[11px] text-muted-foreground">{slot.start}–{slot.end}</p>
                      </td>
                      {WEEK_DAYS.map((day) => {
                        const entry = grid[`${day}-${slot.id}`]
                        if (!entry) return <td key={day} className="p-2" />
                        if (entry.isBreak) {
                          return (
                            <td key={day} className="p-2">
                              <div className="flex h-full min-h-[64px] items-center justify-center rounded-lg bg-muted/50 text-xs font-medium text-muted-foreground">
                                Break
                              </div>
                            </td>
                          )
                        }
                        const color = SUBJECT_COLORS[entry.subject] || '#64748b'
                        return (
                          <td key={day} className="p-2">
                            <div
                              className="min-h-[64px] cursor-pointer rounded-lg border p-2 transition-shadow hover:shadow-md"
                              style={{ borderColor: `${color}30`, backgroundColor: `${color}08` }}
                              onClick={() => toast({ title: entry.subject, description: `${entry.teacher} · Room ${entry.room}` })}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                                <p className="text-xs font-semibold" style={{ color }}>{entry.subject}</p>
                              </div>
                              <p className="mt-1 text-[11px] text-muted-foreground">{entry.teacher}</p>
                              <p className="text-[11px] text-muted-foreground">Room {entry.room}</p>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardContent className="p-5">
          <p className="mb-3 text-xs font-semibold text-muted-foreground">Subject Legend</p>
          <div className="flex flex-wrap gap-3">
            {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
              <div key={subject} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-medium">{subject}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
