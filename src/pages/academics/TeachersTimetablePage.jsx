// ====================================================================
// Module: Academics
// Page: Teachers Timetable
//
// Purpose:
// View weekly teaching schedules and free periods for each teacher.
//
// Data Source:
// academics.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState, useEffect } from 'react'
import {
  CalendarClock, Printer, FileDown, BookOpen, Clock, Coffee,
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
import { TIME_SLOTS, WEEK_DAYS, SUBJECT_COLORS } from '@/constants/academics'
import apiClient from '@/services/api'
import { initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'

export default function TeachersTimetablePage() {
  const { toast } = useToast()
  const [teacherOptions, setTeacherOptions] = useState([])
  const [selectedTeacherId, setSelectedTeacherId] = useState('')

  useEffect(() => {
    apiClient.get('/hr/staff-directory').then((res) => {
      const teachers = res || []
      setTeacherOptions(teachers)
      if (teachers.length && !selectedTeacherId) setSelectedTeacherId(teachers[0]?._id || '')
    }).catch((err) => {
      console.error('Failed to load teachers:', err)
    })
  }, [])

  const { data, isLoading } = useAsyncData(
    () => selectedTeacherId ? academicsService.teacherTimetable(selectedTeacherId) : Promise.resolve([]),
    [selectedTeacherId],
  )

  const grid = data || {}
  const timetableData = Array.isArray(data) ? data : Object.values(data || {})

  const stats = useMemo(() => {
    const entries = timetableData
    const scheduled = entries.filter((e) => !e.isBreak && !e.isFree)
    const free = entries.filter((e) => e.isFree)
    return {
      total: TIME_SLOTS.length * WEEK_DAYS.length,
      scheduled: scheduled.length,
      free: free.length,
      subjects: new Set(scheduled.map((e) => e.subject)).size,
    }
  }, [timetableData])

  const handlePrint = () => window.print()
  const handleExportPdf = () => {
    toast({ title: 'Exporting PDF', description: 'The teacher timetable will download shortly.' })
  }

  const teacher = teacherOptions.find((t) => t._id === selectedTeacherId)

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Academics', to: '/academics/classes' }, { label: 'Teachers Timetable' }]} />
      <PageHeader
        title="Teachers Timetable"
        description="View weekly teaching schedules and free periods for each teacher."
        icon={CalendarClock}
        actions={
          <>
            <Button variant="outline" onClick={handleExportPdf}><FileDown className="mr-2 h-4 w-4" /> Export PDF</Button>
            <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Periods" value={stats.total} icon={Clock} accent="primary" />
        <StatCard label="Scheduled" value={stats.scheduled} icon={CalendarClock} accent="success" />
        <StatCard label="Free Periods" value={stats.free} icon={Coffee} accent="warning" />
        <StatCard label="Subjects" value={stats.subjects} icon={BookOpen} accent="chart2" />
      </div>

      {/* Teacher selector */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials(teacher?.name || 'Teacher')}
            </div>
            <div>
              <p className="text-sm font-semibold">{teacher?.name || 'Select a teacher'}</p>
              <p className="text-xs text-muted-foreground">{teacher?.department || ''} · {teacher?.designation || ''}</p>
            </div>
          </div>
          <div className="ml-auto space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Select Teacher</label>
            <select value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
              {teacherOptions.map((t) => <option key={t._id} value={t._id}>{t.name} — {t.department || ''}</option>)}
            </select>
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
                        const entry = timetableData.find(e => e.day === day && e.slot_id === slot.id)
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
                        if (entry.isFree) {
                          return (
                            <td key={day} className="p-2">
                              <div className="flex h-full min-h-[64px] items-center justify-center rounded-lg border border-dashed bg-muted/20 text-xs font-medium text-muted-foreground/60">
                                Free
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
                              onClick={() => toast({ title: entry.subject, description: `Room ${entry.room}` })}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                                <p className="text-xs font-semibold" style={{ color }}>{entry.subject}</p>
                              </div>
                              <p className="mt-1 text-[11px] text-muted-foreground">Room {entry.room}</p>
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold text-muted-foreground">Subject Legend</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
                  <div key={subject} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-xs font-medium">{subject}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold text-muted-foreground">Status Legend</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded border-2 border-solid border-primary" />
                  <span className="text-xs font-medium">Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded border-2 border-dashed border-muted-foreground/40" />
                  <span className="text-xs font-medium">Free Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-muted" />
                  <span className="text-xs font-medium">Break</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
