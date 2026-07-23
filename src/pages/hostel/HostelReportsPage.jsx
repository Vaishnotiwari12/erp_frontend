// ====================================================================
// Module: Hostel
// Page: Hostel Reports
//
// Purpose:
// Student-wise, room-wise, fee collection, and occupancy reports.
//
// Data Source:
// hostel.service.js
//
// Backend:
// APIs should always be called through the service layer.
// Never call Axios directly from this page.
// ====================================================================

import { useMemo, useState } from 'react'
import { ChartBar as FileBarChart, Users, BedDouble, DollarSign, Gauge, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs'
import { PageHeader } from '@/components/PageHeader'
import { DataTable } from '@/components/DataTable'
import { ExportButtons } from '@/components/ExportButtons'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { OccupancyIndicator } from '@/components/OccupancyIndicator'
import { FeeStatusBadge } from '@/components/FeeStatusBadge'
import { RoomStatusBadge } from '@/components/RoomStatusBadge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { hostelService } from '@/services/hostel.service'
import { formatCurrency, formatDate } from '@/utils/format'

export default function HostelReportsPage() {
  const [activeTab, setActiveTab] = useState('student')

  // Fetch all report data — each tab uses a different dataset.
  const { data: studentData, isLoading: studentLoading } = useAsyncData(() => hostelService.getStudentReport(), [])
  const { data: roomData, isLoading: roomLoading } = useAsyncData(() => hostelService.getRoomReport(), [])
  const { data: feeData, isLoading: feeLoading } = useAsyncData(() => hostelService.getFeeCollectionReport(), [])
  const { data: occupancyData, isLoading: occupancyLoading } = useAsyncData(() => hostelService.getOccupancyReport(), [])

  const handlePrint = () => {
    window.print()
  }

  // ─── Student-wise report columns ────────────────────────────────────────────
  const studentColumns = useMemo(() => [
    { accessorKey: 'student_name', header: 'Student' },
    { accessorKey: 'admission_no', header: 'Admission No' },
    { accessorKey: 'class', header: 'Class', cell: ({ row }) => <Badge variant="outline">{row.original.class}</Badge> },
    { accessorKey: 'room_number', header: 'Room' },
    { accessorKey: 'room_type_name', header: 'Room Type', cell: ({ row }) => <Badge variant="secondary">{row.original.room_type_name}</Badge> },
    { accessorKey: 'block', header: 'Block' },
    { accessorKey: 'check_in', header: 'Check In', cell: ({ row }) => formatDate(row.original.check_in) },
    { accessorKey: 'allocation_status', header: 'Status', cell: ({ row }) => <span className="capitalize text-sm font-medium">{row.original.allocation_status}</span> },
  ], [])

  const studentExportCols = [
    { key: 'student_name', label: 'Student' },
    { key: 'admission_no', label: 'Admission No' },
    { key: 'class', label: 'Class' },
    { key: 'room_number', label: 'Room' },
    { key: 'room_type_name', label: 'Room Type' },
    { key: 'block', label: 'Block' },
    { key: 'check_in', label: 'Check In' },
    { key: 'allocation_status', label: 'Status' },
  ]

  // ─── Room-wise report columns ────────────────────────────────────────────────
  const roomColumns = useMemo(() => [
    { accessorKey: 'room_number', header: 'Room' },
    { accessorKey: 'block', header: 'Block', cell: ({ row }) => <Badge variant="secondary">{row.original.block}</Badge> },
    { accessorKey: 'floor', header: 'Floor' },
    { accessorKey: 'room_type_name', header: 'Type', cell: ({ row }) => <Badge variant="outline">{row.original.room_type_name}</Badge> },
    { accessorKey: 'capacity', header: 'Occupancy', cell: ({ row }) => <OccupancyIndicator occupied={row.original.occupied} capacity={row.original.capacity} className="w-28" /> },
    { accessorKey: 'room_status', header: 'Status', cell: ({ row }) => <RoomStatusBadge status={row.original.room_status} /> },
  ], [])

  const roomExportCols = [
    { key: 'room_number', label: 'Room' },
    { key: 'block', label: 'Block' },
    { key: 'floor', label: 'Floor' },
    { key: 'room_type_name', label: 'Room Type' },
    { key: 'occupied', label: 'Occupied' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'room_status', label: 'Room Status' },
  ]

  // ─── Fee collection report columns ───────────────────────────────────────────
  const feeColumns = useMemo(() => [
    { accessorKey: 'student_name', header: 'Student' },
    { accessorKey: 'admission_no', header: 'Admission No' },
    { accessorKey: 'room_number', header: 'Room', cell: ({ row }) => <Badge variant="secondary">{row.original.room_number}</Badge> },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total_amount) },
    { accessorKey: 'paid_amount', header: 'Paid', cell: ({ row }) => <span className="text-success font-medium">{formatCurrency(row.original.paid_amount)}</span> },
    { accessorKey: 'due_amount', header: 'Due', cell: ({ row }) => row.original.due_amount > 0 ? <span className="text-destructive font-medium">{formatCurrency(row.original.due_amount)}</span> : '—' },
    { accessorKey: 'fee_status', header: 'Status', cell: ({ row }) => <FeeStatusBadge status={row.original.fee_status} /> },
  ], [])

  const feeExportCols = [
    { key: 'student_name', label: 'Student' },
    { key: 'admission_no', label: 'Admission No' },
    { key: 'room_number', label: 'Room' },
    { key: 'total_amount', label: 'Total' },
    { key: 'paid_amount', label: 'Paid' },
    { key: 'due_amount', label: 'Due' },
    { key: 'fee_status', label: 'Status' },
  ]

  // ─── Occupancy report columns ─────────────────────────────────────────────────
  const occupancyColumns = useMemo(() => [
    { accessorKey: 'room_number', header: 'Room' },
    { accessorKey: 'block', header: 'Block', cell: ({ row }) => <Badge variant="secondary">{row.original.block}</Badge> },
    { accessorKey: 'room_type_name', header: 'Type' },
    { accessorKey: 'capacity', header: 'Capacity' },
    { accessorKey: 'occupied', header: 'Occupied' },
    { accessorKey: 'occupancy', header: 'Occupancy %', cell: ({ row }) => <OccupancyIndicator occupied={row.original.occupied} capacity={row.original.capacity} className="w-28" /> },
  ], [])

  const occupancyExportCols = [
    { key: 'room_number', label: 'Room' },
    { key: 'block', label: 'Block' },
    { key: 'room_type_name', label: 'Room Type' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'occupied', label: 'Occupied' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Hostel' }, { label: 'Reports' }]} />
      <PageHeader
        title="Hostel Reports"
        description="Student-wise, room-wise, fee collection, and occupancy reports."
        icon={FileBarChart}
        actions={<Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print</Button>}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="student"><Users className="mr-1.5 h-3.5 w-3.5" /> Student-wise</TabsTrigger>
          <TabsTrigger value="room"><BedDouble className="mr-1.5 h-3.5 w-3.5" /> Room-wise</TabsTrigger>
          <TabsTrigger value="fee"><DollarSign className="mr-1.5 h-3.5 w-3.5" /> Fee Collection</TabsTrigger>
          <TabsTrigger value="occupancy"><Gauge className="mr-1.5 h-3.5 w-3.5" /> Occupancy</TabsTrigger>
        </TabsList>

        {/* Student-wise report */}
        <TabsContent value="student" className="space-y-4">
          <div className="flex justify-end">
            <ExportButtons rows={studentData || []} columns={studentExportCols} filename="hostel-student-report" />
          </div>
          {studentLoading ? (
            <LoadingSkeleton variant="table" rows={5} cols={8} />
          ) : (
            <DataTable columns={studentColumns} data={studentData || []} enableExport={false} />
          )}
        </TabsContent>

        {/* Room-wise report */}
        <TabsContent value="room" className="space-y-4">
          <div className="flex justify-end">
            <ExportButtons rows={roomData || []} columns={roomExportCols} filename="hostel-room-report" />
          </div>
          {roomLoading ? (
            <LoadingSkeleton variant="table" rows={5} cols={6} />
          ) : (
            <DataTable columns={roomColumns} data={roomData || []} enableExport={false} />
          )}
        </TabsContent>

        {/* Fee collection report */}
        <TabsContent value="fee" className="space-y-4">
          <div className="flex justify-end">
            <ExportButtons rows={feeData || []} columns={feeExportCols} filename="hostel-fee-report" />
          </div>
          {feeLoading ? (
            <LoadingSkeleton variant="table" rows={5} cols={7} />
          ) : (
            <DataTable columns={feeColumns} data={feeData || []} enableExport={false} />
          )}
        </TabsContent>

        {/* Occupancy report */}
        <TabsContent value="occupancy" className="space-y-4">
          <div className="flex justify-end">
            <ExportButtons rows={occupancyData || []} columns={occupancyExportCols} filename="hostel-occupancy-report" />
          </div>
          {occupancyLoading ? (
            <LoadingSkeleton variant="table" rows={5} cols={6} />
          ) : (
            <DataTable columns={occupancyColumns} data={occupancyData || []} enableExport={false} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
