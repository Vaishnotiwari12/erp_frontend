import { useMemo, useState } from 'react'
import { ScrollText, Award, TrendingUp, Trophy, Percent } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { Drawer } from '@/components/Drawer'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { Button } from '@/components/ui/button'
import { useAsyncData } from '@/hooks/useAsyncData'
import { examinationService } from '@/services/examination.service'
import { useToast } from '@/hooks/use-toast'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function ConsolidatedMarksheetPage() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => examinationService.getConsolidatedMarksheets(), [])
  const [search, setSearch] = useState('')
  const [viewRow, setViewRow] = useState(null)

  const rows = data || []
  const filtered = useMemo(
    () => rows.filter((r) => !search || r.student.toLowerCase().includes(search.toLowerCase()) || r.admission_no.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  )

  const stats = useMemo(() => ({
    total: rows.length,
    avgGpa: rows.length ? (rows.reduce((a, r) => a + Number(r.gpa), 0) / rows.length).toFixed(2) : 0,
    topRank: rows.length ? Math.min(...rows.map((r) => r.rank)) : 0,
    distinctions: rows.filter((r) => r.grade === 'A+').length,
  }), [rows])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Examinations', to: '/examinations/exam-groups' }, { label: 'Consolidated Marksheet' }]} />
      <PageHeader title="Consolidated Marksheet" description="Overall GPA, percentage, grade, rank, and performance per student." icon={ScrollText} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats.total} icon={ScrollText} accent="primary" />
        <StatCard label="Avg GPA" value={stats.avgGpa} icon={TrendingUp} accent="chart2" />
        <StatCard label="Top Rank" value={`#${stats.topRank}`} icon={Trophy} accent="warning" />
        <StatCard label="Distinctions" value={stats.distinctions} icon={Award} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student or admission no…" className="max-w-sm" />
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="cards" />
      ) : filtered.length === 0 ? (
        <NoData title="No consolidated marksheets found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Card key={r._id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setViewRow(r)}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{r.student}</p>
                    <p className="text-xs text-muted-foreground">{r.admission_no} · {r.class}</p>
                  </div>
                  <Badge variant={r.rank <= 3 ? 'default' : 'secondary'}>#{r.rank}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/40 p-2"><p className="text-xs text-muted-foreground">GPA</p><p className="text-sm font-bold">{r.gpa}</p></div>
                  <div className="rounded-lg bg-muted/40 p-2"><p className="text-xs text-muted-foreground">Percent</p><p className="text-sm font-bold">{r.percentage}%</p></div>
                  <div className="rounded-lg bg-muted/40 p-2"><p className="text-xs text-muted-foreground">Grade</p><p className="text-sm font-bold">{r.grade}</p></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Division: <span className="font-medium text-foreground">{r.division}</span></span>
                  <span className="text-muted-foreground">Attendance: <span className="font-medium text-foreground">{r.attendance}%</span></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Drawer open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)} title="Consolidated Marksheet" description={viewRow?.student} width="sm:max-w-xl"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}>
        {viewRow ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">GPA</p><p className="text-lg font-semibold">{viewRow.gpa}</p></div>
              <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Percentage</p><p className="text-lg font-semibold">{viewRow.percentage}%</p></div>
              <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Grade</p><p className="text-lg font-semibold">{viewRow.grade}</p></div>
              <div className="rounded-lg border bg-muted/30 p-3"><p className="text-xs text-muted-foreground">Rank</p><p className="text-lg font-semibold">#{viewRow.rank}</p></div>
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold">Performance Chart</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewRow.performance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="subject" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="marks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Subject-wise Marks</p>
              <div className="space-y-1.5">
                {viewRow.performance.map((p) => (
                  <div key={p.subject} className="flex items-center justify-between rounded-lg border px-3 py-1.5 text-sm">
                    <span className="font-medium">{p.subject}</span><Badge variant={p.marks >= 90 ? 'default' : 'secondary'}>{p.marks}/100</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  )
}
