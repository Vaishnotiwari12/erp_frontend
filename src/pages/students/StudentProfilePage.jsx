// ====================================================================
// Module: Students
// Page: Student Profile
//
// Purpose:
// View an individual student's profile, grades, and attendance trend.
//
// Data Source:
// student.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { Mail, Phone, MapPin, GraduationCap, Calendar, User, ArrowLeft, CreditCard as Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import StatusBadge from '@/components/StatusBadge'
import ChartCard from '@/components/charts/ChartCard'
import TrendAreaChart from '@/components/charts/TrendAreaChart'
import { useAsyncData } from '@/hooks/useAsyncData'
import { studentService } from '@/services/student.service'
// import { mockResponse } from '@/services/mockData'
import { formatDate, fullName, initials } from '@/utils/format'

// Placeholder profile — uses first mock student.
function fetchProfile() {
  return studentService.list().then((res) => {
    const s = res[0]
    return mockResponse({
      ...s,
      phone: '+1 (555) 014-2231',
      address: '1204 Cedar Lane, Austin, TX',
      dob: '2008-05-14',
      gpa: 3.8,
      attendance: 96,
      grades: [
        { label: 'Term 1', value: 78 }, { label: 'Term 2', value: 82 },
        { label: 'Term 3', value: 88 }, { label: 'Term 4', value: 91 },
        { label: 'Term 5', value: 86 }, { label: 'Term 6', value: 93 },
      ],
      subjects: [
        { name: 'Mathematics', grade: 'A', teacher: 'Hannah Kim' },
        { name: 'Physics', grade: 'A-', teacher: 'Hannah Kim' },
        { name: 'English', grade: 'B+', teacher: 'Marcus Johnson' },
        { name: 'History', grade: 'A', teacher: 'Priya Patel' },
      ],
    })
  })
}

export default function StudentProfilePage() {
  const { data, isLoading } = useAsyncData(fetchProfile, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Students', to: '/students' }, { label: 'Profile' }]} />
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <a href="/students"><ArrowLeft className="mr-2 h-4 w-4" /> Back to students</a>
        </Button>
        <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left — summary */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {data ? initials(data.name) : '—'}
            </div>
            <h2 className="mt-4 text-lg font-bold">{data ? fullName(data.name) : '—'}</h2>
            <p className="text-sm text-muted-foreground">{data?.email}</p>
            <div className="mt-3 flex justify-center gap-2">
              {data && <StatusBadge status={data.status} />}
              {data && <Badge variant="outline">{data.class}</Badge>}
            </div>
            <div className="mt-6 space-y-3 text-left text-sm">
              <div className="flex items-center gap-3 text-muted-foreground"><Mail className="h-4 w-4" /> {data?.email}</div>
              <div className="flex items-center gap-3 text-muted-foreground"><Phone className="h-4 w-4" /> {data?.mobile || data?.phone}</div>
              <div className="flex items-center gap-3 text-muted-foreground"><MapPin className="h-4 w-4" /> {data?.address}</div>
              <div className="flex items-center gap-3 text-muted-foreground"><Calendar className="h-4 w-4" /> DOB {formatDate(data?.dob)}</div>
              <div className="flex items-center gap-3 text-muted-foreground"><User className="h-4 w-4" /> Guardian: {data?.guardian_name}</div>
              <div className="flex items-center gap-3 text-muted-foreground"><GraduationCap className="h-4 w-4" /> {data?.school_name}</div>
            </div>
          </CardContent>
        </Card>

        {/* Right — stats + grades */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">GPA</p><p className="mt-1 text-2xl font-bold">{data?.gpa ?? '—'}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Attendance</p><p className="mt-1 text-2xl font-bold">{data?.attendance ? `${data.attendance}%` : '—'}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Admitted</p><p className="mt-1 text-2xl font-bold">{formatDate(data?.admission_date)}</p></CardContent></Card>
          </div>

          <ChartCard title="Grade Trend" description="Performance across terms">
            {isLoading ? <div className="h-[260px]" /> : <TrendAreaChart data={data?.grades || []} color="chart-1" />}
          </ChartCard>

          <Card>
            <CardHeader><CardTitle className="text-base">Enrolled Subjects</CardTitle><CardDescription>Current term subjects</CardDescription></CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {(data?.subjects || []).map((s) => (
                  <div key={s.name} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.teacher}</p>
                    </div>
                    <Badge variant="outline" className="font-semibold">{s.grade}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
