// Teachers Rating — view and manage performance evaluations for teaching staff.
// Ratings cover teaching skills, punctuality, student engagement, and more.

import { useMemo, useState } from 'react'
import { Star, TrendingUp, Award, Users, Eye, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { StatCard } from '@/components/StatCard'
import { ActionDropdown } from '@/components/ActionDropdown'
import { DataTable } from '@/components/DataTable'
import { Drawer, DrawerFooter } from '@/components/Drawer'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { NoData } from '@/components/NoData'
import { FormSection } from '@/components/FormSection'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hrService } from '@/services/hr.service'
import { formatDate, initials } from '@/utils/format'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const EXPORT_COLS = [
  { key: 'teacher', label: 'Teacher' },
  { key: 'department', label: 'Department' },
  { key: 'overall_rating', label: 'Overall Rating' },
  { key: 'teaching_skills', label: 'Teaching Skills' },
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'student_engagement', label: 'Student Engagement' },
  { key: 'rated_by', label: 'Rated By' },
  { key: 'rated_on', label: 'Rated On' },
]

// Renders filled/empty stars for a numeric rating out of 5
function StarRating({ value, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={cn('h-3.5 w-3.5', i < Math.round(value) ? 'fill-warning text-warning' : 'text-muted-foreground/30')} />
      ))}
      <span className="ml-1 text-xs font-medium">{Number(value).toFixed(1)}</span>
    </div>
  )
}

// Color class based on rating score — green for high, yellow for medium, red for low
function ratingColor(val) {
  if (val >= 4) return 'text-success'
  if (val >= 3) return 'text-warning'
  return 'text-destructive'
}

export default function TeachersRatingPage() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => hrService.getTeachersRating(), [])
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [viewRow, setViewRow] = useState(null)
  const [editRow, setEditRow] = useState(null)

  const rows = data || []

  const departments = useMemo(() => Array.from(new Set(rows.map((r) => r.department))), [rows])

  const filtered = useMemo(() => rows.filter((r) => {
    const matchSearch = !search || r.teacher.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'all' || r.department === deptFilter
    return matchSearch && matchDept
  }), [rows, search, deptFilter])

  const stats = useMemo(() => {
    if (!rows.length) return { avg: 0, excellent: 0, total: 0 }
    const avg = rows.reduce((s, r) => s + Number(r.overall_rating), 0) / rows.length
    return {
      avg: avg.toFixed(2),
      excellent: rows.filter((r) => Number(r.overall_rating) >= 4).length,
      total: rows.length,
    }
  }, [rows])

  const columns = useMemo(() => [
    {
      accessorKey: 'teacher',
      header: 'Teacher',
      cell: ({ row }) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewRow(row.original)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(row.original.teacher)}
          </div>
          <div>
            <p className="font-medium hover:underline">{row.original.teacher}</p>
            <p className="text-xs text-muted-foreground">{row.original.department}</p>
          </div>
        </button>
      ),
    },
    { accessorKey: 'teaching_skills', header: 'Teaching', cell: ({ row }) => <StarRating value={row.original.teaching_skills} /> },
    { accessorKey: 'punctuality', header: 'Punctuality', cell: ({ row }) => <StarRating value={row.original.punctuality} /> },
    { accessorKey: 'student_engagement', header: 'Engagement', cell: ({ row }) => <StarRating value={row.original.student_engagement} /> },
    {
      accessorKey: 'overall_rating',
      header: 'Overall',
      cell: ({ row }) => (
        <span className={cn('text-base font-bold', ratingColor(Number(row.original.overall_rating)))}>
          {Number(row.original.overall_rating).toFixed(1)}
        </span>
      ),
    },
    { accessorKey: 'rated_by', header: 'Rated By', cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.rated_by}</span> },
    { accessorKey: 'rated_on', header: 'Rated On', cell: ({ row }) => formatDate(row.original.rated_on) },
  ], [])

  const rowActions = (r) => [
    { label: 'View Details', icon: Eye, onClick: () => setViewRow(r) },
    { label: 'Update Rating', icon: Pencil, onClick: () => setEditRow(r) },
  ]

  const handleUpdateRating = async (payload) => {
    await hrService.updateRating(editRow._id, payload)
    toast({ title: 'Rating updated', description: editRow.teacher })
    setEditRow(null)
    refetch()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Human Resources' }, { label: 'Teachers Rating' }]} />
      <PageHeader
        title="Teachers Rating"
        description="View and manage performance evaluations for teaching staff."
        icon={Star}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Rated" value={stats.total} icon={Users} accent="primary" />
        <StatCard label="Avg Overall Rating" value={stats.avg} icon={TrendingUp} accent="chart2" />
        <StatCard label="Excellent (≥ 4.0)" value={stats.excellent} icon={Award} accent="success" />
      </div>

      <FilterBar>
        <SearchBar value={search} onChange={setSearch} placeholder="Search teacher or department…" className="max-w-sm" />
        <div className="flex flex-wrap items-center gap-2">
          <ExportButtons rows={filtered} columns={EXPORT_COLS} filename="teachers-rating" />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </FilterBar>

      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} cols={7} />
      ) : filtered.length === 0 ? (
        <NoData title="No ratings found" />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          exportFilename="teachers-rating"
          rowActions={(r) => <ActionDropdown actions={rowActions(r)} />}
        />
      )}

      {/* Rating Detail Drawer */}
      <Drawer
        open={!!viewRow}
        onOpenChange={(o) => !o && setViewRow(null)}
        title="Rating Details"
        description={viewRow?.teacher}
        width="sm:max-w-lg"
        footer={<Button variant="outline" onClick={() => setViewRow(null)}>Close</Button>}
      >
        {viewRow && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {initials(viewRow.teacher)}
              </div>
              <div>
                <p className="font-semibold">{viewRow.teacher}</p>
                <p className="text-sm text-muted-foreground">{viewRow.department}</p>
              </div>
              <span className={cn('ml-auto text-3xl font-bold', ratingColor(Number(viewRow.overall_rating)))}>
                {Number(viewRow.overall_rating).toFixed(1)}
              </span>
            </div>

            {/* Criteria breakdown bars */}
            <div className="space-y-4">
              {[
                { label: 'Teaching Skills', key: 'teaching_skills' },
                { label: 'Punctuality', key: 'punctuality' },
                { label: 'Student Engagement', key: 'student_engagement' },
                { label: 'Classroom Management', key: 'classroom_management' },
                { label: 'Subject Knowledge', key: 'subject_knowledge' },
              ].map((c) => (
                <div key={c.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.label}</span>
                    <span className="text-muted-foreground">{Number(viewRow[c.key]).toFixed(1)} / 5</span>
                  </div>
                  <Progress value={Number(viewRow[c.key]) * 20} className="h-2" />
                </div>
              ))}
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div><dt className="text-xs text-muted-foreground">Rated By</dt><dd className="text-sm font-medium">{viewRow.rated_by}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Rated On</dt><dd className="text-sm font-medium">{formatDate(viewRow.rated_on)}</dd></div>
            </dl>

            {viewRow.comments && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Comments</p>
                <p className="rounded-lg border bg-muted/20 p-3 text-sm">{viewRow.comments}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Edit Rating Drawer */}
      {editRow && (
        <RatingEditDrawer
          open={!!editRow}
          onOpenChange={(o) => !o && setEditRow(null)}
          initial={editRow}
          onSubmit={handleUpdateRating}
        />
      )}
    </div>
  )
}

// Slider-based rating editor for each criterion
function RatingEditDrawer({ open, onOpenChange, initial, onSubmit }) {
  const [form, setForm] = useState({
    teaching_skills: initial?.teaching_skills ?? 3,
    punctuality: initial?.punctuality ?? 3,
    student_engagement: initial?.student_engagement ?? 3,
    classroom_management: initial?.classroom_management ?? 3,
    subject_knowledge: initial?.subject_knowledge ?? 3,
    comments: initial?.comments || '',
  })

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const avgRating = () => {
    const fields = ['teaching_skills', 'punctuality', 'student_engagement', 'classroom_management', 'subject_knowledge']
    const sum = fields.reduce((s, k) => s + Number(form[k]), 0)
    return (sum / fields.length).toFixed(2)
  }

  const CRITERIA = [
    { label: 'Teaching Skills', key: 'teaching_skills' },
    { label: 'Punctuality', key: 'punctuality' },
    { label: 'Student Engagement', key: 'student_engagement' },
    { label: 'Classroom Management', key: 'classroom_management' },
    { label: 'Subject Knowledge', key: 'subject_knowledge' },
  ]

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Update Rating"
      description={initial.teacher}
      width="sm:max-w-md"
      footer={<DrawerFooter onCancel={() => onOpenChange(false)} submitLabel="Save Rating" onSubmit={() => onSubmit({ ...form, overall_rating: avgRating() })} />}
    >
      <div className="space-y-5">
        {CRITERIA.map((c) => (
          <div key={c.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">{c.label}</Label>
              <span className="text-sm font-semibold text-primary">{form[c.key]} / 5</span>
            </div>
            <input type="range" min="1" max="5" step="0.5" value={form[c.key]}
              onChange={(e) => set(c.key, Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span><span>Excellent</span>
            </div>
          </div>
        ))}
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">Calculated Overall Rating</p>
          <p className="text-2xl font-bold text-primary">{avgRating()}</p>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Comments</Label>
          <Textarea value={form.comments} onChange={(e) => set('comments', e.target.value)} rows={3} placeholder="Evaluator remarks…" />
        </div>
      </div>
    </Drawer>
  )
}
