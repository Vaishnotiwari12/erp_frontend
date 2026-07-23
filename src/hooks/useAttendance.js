// ====================================================================
// Custom Hook
//
// Purpose:
// Contains business logic for this module.
//
// Responsibilities:
// - Search
// - Filter
// - Sorting
// - CRUD orchestration
//
// Keeps page components focused on UI.
// ====================================================================

import { useMemo, useState, useCallback } from 'react'
import { attendanceService } from '@/services/attendance.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'
import { fullName } from '@/utils/format'

// ─── useStudentAttendance ──────────────────────────────────────────────────────
// Manages student attendance list, filtering, stats, and mark/bulk operations.
export function useStudentAttendance() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => attendanceService.list(), [])

  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  const rows = data || []

  // useMemo prevents recalculating filtered attendance
  // unless list or filters change.
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const name = fullName(r.name)
        const q = search.toLowerCase()
        const matchSearch = !q || name.toLowerCase().includes(q) || r.admission_no.toLowerCase().includes(q)
        const matchClass = classFilter === 'all' || r.class === classFilter
        const matchSection = sectionFilter === 'all' || r.section === sectionFilter
        const matchStatus = statusFilter === 'all' || r.status === statusFilter
        const matchDate = !dateFilter || r.date === dateFilter
        return matchSearch && matchClass && matchSection && matchStatus && matchDate
      }),
    [rows, search, classFilter, sectionFilter, statusFilter, dateFilter],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      present: rows.filter((r) => r.status === 'present').length,
      absent: rows.filter((r) => r.status === 'absent').length,
      leave: rows.filter((r) => r.status === 'leave').length,
      late: rows.filter((r) => r.status === 'late').length,
    }),
    [rows],
  )

  const markStatus = useCallback(
    async (row, status) => {
      await attendanceService.markAttendance(row._id, status)
      toast({ title: 'Attendance marked', description: `${fullName(row.name)} marked ${status}.` })
      refetch()
    },
    [refetch, toast],
  )

  const bulkMark = useCallback(
    async (selected, status) => {
      await attendanceService.bulkMark(selected.map((r) => r._id), status)
      toast({ title: `${selected.length} students marked ${status}` })
      refetch()
    },
    [refetch, toast],
  )

  const updateAttendance = useCallback(
    async (id, payload) => {
      await attendanceService.markAttendance(id, payload.status)
      toast({ title: 'Attendance updated' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allAttendance: rows,
    stats,
    isLoading,
    search, setSearch,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    markStatus,
    bulkMark,
    updateAttendance,
  }
}

// ─── useAttendanceByDate ────────────────────────────────────────────────────────
// Manages attendance records for a specific date.
export function useAttendanceByDate(date) {
  const { data, isLoading, refetch } = useAsyncData(
    () => attendanceService.byDate(date),
    [date],
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const name = fullName(r.name)
        const q = search.toLowerCase()
        const matchSearch = !q || name.toLowerCase().includes(q) || r.admission_no.toLowerCase().includes(q)
        const matchStatus = statusFilter === 'all' || r.status === statusFilter
        return matchSearch && matchStatus
      }),
    [rows, search, statusFilter],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      present: rows.filter((r) => r.status === 'present').length,
      absent: rows.filter((r) => r.status === 'absent').length,
      leave: rows.filter((r) => r.status === 'leave').length,
      late: rows.filter((r) => r.status === 'late').length,
    }),
    [rows],
  )

  return {
    rows: filtered,
    allAttendance: rows,
    stats,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    refetch,
  }
}

// ─── useLeaveApprovals ──────────────────────────────────────────────────────────
// Manages student leave applications list, filtering, stats, and approve/reject.
export function useLeaveApprovals() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => attendanceService.leaves(), [])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const rows = data || []

  // useMemo prevents recalculating filtered leave applications
  // unless list or filters change.
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || r.student_name.toLowerCase().includes(q) || r.admission_no.toLowerCase().includes(q)
        const matchStatus = status === 'all' || r.status === status
        const matchClass = classFilter === 'all' || r.class === classFilter
        const matchSection = sectionFilter === 'all' || r.section === sectionFilter
        const matchFrom = !fromDate || new Date(r.from) >= new Date(fromDate)
        const matchTo = !toDate || new Date(r.to) <= new Date(toDate)
        return matchSearch && matchStatus && matchClass && matchSection && matchFrom && matchTo
      }),
    [rows, search, status, classFilter, sectionFilter, fromDate, toDate],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((r) => r.status === 'pending').length,
      approved: rows.filter((r) => r.status === 'approved').length,
      rejected: rows.filter((r) => r.status === 'rejected').length,
    }),
    [rows],
  )

  const approveLeave = useCallback(
    async (app) => {
      await attendanceService.updateLeave(app._id, 'approved')
      toast({ title: 'Leave approved', description: `${app.student_name}'s leave has been approved.` })
      refetch()
    },
    [refetch, toast],
  )

  const rejectLeave = useCallback(
    async (app) => {
      await attendanceService.updateLeave(app._id, 'rejected')
      toast({ title: 'Leave rejected', description: `${app.student_name}'s leave has been rejected.` })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allLeaves: rows,
    stats,
    isLoading,
    search, setSearch,
    status, setStatus,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    fromDate, setFromDate,
    toDate, setToDate,
    approveLeave,
    rejectLeave,
  }
}
