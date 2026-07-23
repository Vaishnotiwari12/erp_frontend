// ====================================================================
// Module: Hostel
// Page: Hostel Dashboard
//
// Purpose:
// Overview of hostel rooms, occupancy, allocations, and fee collection.
//
// Data Source:
// hostel.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BedDouble,
  DoorOpen,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Building2,
  ClipboardList,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/StatCard'
import ChartCard from '@/components/charts/ChartCard'
import BarChartCard from '@/components/charts/BarChartCard'
import DonutChart from '@/components/charts/DonutChart'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hostelService } from '@/services/hostel.service'
import { formatCurrency } from '@/utils/format'

const QUICK_ACTIONS = [
  { title: 'Manage Rooms', to: '/hostel/rooms', icon: BedDouble, desc: 'Add and edit hostel rooms' },
  { title: 'Room Types', to: '/hostel/room-types', icon: Building2, desc: 'Configure room categories' },
  { title: 'Allocate Room', to: '/hostel/allocation', icon: DoorOpen, desc: 'Assign students to rooms' },
  { title: 'Hostel Fees', to: '/hostel/fees', icon: DollarSign, desc: 'View fee status' },
]

export default function HostelDashboardPage() {
  // Fetch all dashboard data in parallel — stats, charts, and fee summary.
  const { data: stats, isLoading } = useAsyncData(() => hostelService.getStats(), [])
  const { data: occupancy } = useAsyncData(() => hostelService.getOccupancyByType(), [])
  const { data: statusBreakdown } = useAsyncData(() => hostelService.getRoomStatusBreakdown(), [])
  const { data: blockOcc } = useAsyncData(() => hostelService.getBlockOccupancy(), [])

  // Donut chart data for bed occupancy — occupied vs available beds.
  const bedOccupancyDonut = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'Occupied', value: stats.occupied_beds, color: 'chart-1' },
      { label: 'Available', value: stats.total_beds - stats.occupied_beds, color: 'chart-3' },
    ]
  }, [stats])

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Hostel' }]} />
      <PageHeader
        title="Hostel Dashboard"
        description="Overview of hostel rooms, occupancy, allocations, and fee collection."
        icon={BedDouble}
        actions={
          <Button asChild>
            <Link to="/hostel/rooms">
              <BedDouble className="mr-2 h-4 w-4" /> Manage Rooms
            </Link>
          </Button>
        }
      />

      {/* KPI cards — at-a-glance snapshot of the hostel operation. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Rooms" value={stats?.total_rooms ?? '—'} icon={BedDouble} accent="primary" />
        <StatCard label="Available Rooms" value={stats?.available_rooms ?? '—'} icon={DoorOpen} accent="success" />
        <StatCard label="Students in Hostel" value={stats?.total_students ?? '—'} icon={Users} accent="chart2" />
        <StatCard label="Pending Fees" value={stats?.pending_fees ?? '—'} icon={DollarSign} accent="destructive" />
      </div>

      {/* Charts row — block occupancy and room status distribution. */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Occupancy by Block"
          description="Number of occupied beds across hostel blocks"
          action={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        >
          {isLoading ? <div className="h-[260px]" /> : <BarChartCard data={blockOcc || []} color="chart-1" />}
        </ChartCard>

        <ChartCard
          title="Room Status"
          description="Distribution of room availability"
        >
          {isLoading ? <div className="h-[260px]" /> : <DonutChart data={statusBreakdown || []} />}
        </ChartCard>
      </div>

      {/* Fee collection summary and bed occupancy. */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Bed Occupancy"
          description="Occupied vs available beds"
        >
          {isLoading ? <div className="h-[240px]" /> : <DonutChart data={bedOccupancyDonut} />}
        </ChartCard>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Fee Collection Summary</CardTitle>
            <CardDescription>Total collected vs pending dues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border bg-success/5 p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                </div>
                <p className="mt-2 text-2xl font-bold text-success">{formatCurrency(stats?.total_collected || 0)}</p>
              </div>
              <div className="rounded-xl border bg-destructive/5 p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-medium text-muted-foreground">Pending Dues</p>
                </div>
                <p className="mt-2 text-2xl font-bold text-destructive">{formatCurrency(stats?.total_pending_amount || 0)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {stats?.pending_fees || 0} student(s) have pending or partial hostel fee payments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions — shortcuts to the most common hostel tasks. */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.title}
              to={action.to}
              className="group rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <action.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-3 text-sm font-medium">{action.title}</p>
              <p className="text-xs text-muted-foreground">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
