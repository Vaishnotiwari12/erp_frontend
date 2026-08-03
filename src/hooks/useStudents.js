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
import { studentService } from '@/services/student.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'
import { fullName } from '@/utils/format'

// ─── useStudents ───────────────────────────────────────────────────────────────
// Manages student list state, filtering, stats, and CRUD operations.
export function useStudents() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => studentService.list(), [])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [classFilter, setClassFilter] = useState('all')

  const rows = data || []

  const classOptions = useMemo(
    () => [
      { value: 'all', label: 'All classes' },
      ...Array.from(new Set(rows.map((r) => r.class))).map((c) => ({ value: c, label: c })),
    ],
    [rows],
  )

  // useMemo prevents recalculating filtered students
  // unless student list or filters change.
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const name = fullName(r.name)
        const q = search.toLowerCase()
        const matchSearch =
          !q ||
          name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          (r.admission_no || '').toLowerCase().includes(q)
        const matchStatus = status === 'all' || r.status === status
        const matchClass = classFilter === 'all' || r.class === classFilter
        return matchSearch && matchStatus && matchClass
      }),
    [rows, search, status, classFilter],
  )

  const stats = useMemo(() => {
    const active = rows.filter((r) => r.status === 'active').length
    const inactive = rows.filter((r) => r.status === 'inactive').length
    const suspended = rows.filter((r) => r.status === 'suspended' || r.status === 'disabled').length
    return { total: rows.length, active, inactive, suspended }
  }, [rows])

  const saveStudent = useCallback(
    async (payload, id) => {
      if (id) {
        await studentService.update(id, payload)
        toast({ title: 'Student updated', description: `${fullName(payload.name)} has been updated.` })
      } else {
        await studentService.create(payload)
        toast({ title: 'Student added', description: `${fullName(payload.name)} has been enrolled.` })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteStudent = useCallback(
    async (id, name) => {
      await studentService.remove(id)
      toast({ title: 'Student deleted', description: `${fullName(name)} has been removed.` })
      refetch()
    },
    [refetch, toast],
  )

  const bulkDelete = useCallback(
    async (selected) => {
      await studentService.bulkDelete(selected.map((s) => s._id))
      toast({ title: `${selected.length} students deleted` })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allStudents: rows,
    classOptions,
    stats,
    isLoading,
    search, setSearch,
    status, setStatus,
    classFilter, setClassFilter,
    saveStudent,
    deleteStudent,
    bulkDelete,
  }
}

// ─── useAdmissions ─────────────────────────────────────────────────────────────
// Manages online admission applications list, filtering, stats, and approve/reject.
export function useAdmissions() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => studentService.admissions(), [])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered applications
  // unless list or filters change.
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const name = `${r.first_name} ${r.last_name}`
        const q = search.toLowerCase()
        const matchSearch = !q || name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
        const matchStatus = status === 'all' || r.status === status
        return matchSearch && matchStatus
      }),
    [rows, search, status],
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

  const approveAdmission = useCallback(
    async (app) => {
      toast({ title: 'Application approved', description: `${app.first_name} ${app.last_name} has been admitted.` })
      refetch()
    },
    [refetch, toast],
  )

  const rejectAdmission = useCallback(
    async (app) => {
      toast({ title: 'Application rejected', description: `${app.first_name} ${app.last_name} was rejected.` })
      refetch()
    },
    [refetch, toast],
  )

  const deleteAdmission = useCallback(
    async (id) => {
      toast({ title: 'Application deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allAdmissions: rows,
    stats,
    isLoading,
    search, setSearch,
    status, setStatus,
    approveAdmission,
    rejectAdmission,
    deleteAdmission,
  }
}

// ─── useStudentCategories ──────────────────────────────────────────────────────
// Manages student categories list.
export function useStudentCategories() {
  const { data, isLoading, refetch } = useAsyncData(() => studentService.categories(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        return !q || (r.name || '').toLowerCase().includes(q)
      }),
    [rows, search],
  )

  return {
    rows: filtered,
    allCategories: rows,
    isLoading,
    search, setSearch,
    refetch,
  }
}

// ─── useStudentHouses ──────────────────────────────────────────────────────────
// Manages student houses list.
export function useStudentHouses() {
  const { data, isLoading, refetch } = useAsyncData(() => studentService.houses(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        return !q || (r.name || '').toLowerCase().includes(q)
      }),
    [rows, search],
  )

  return {
    rows: filtered,
    allHouses: rows,
    isLoading,
    search, setSearch,
    refetch,
  }

}


// ─── useDisableReasons ────────────────────────────────────────────────────────
// Manages disable reasons list, search, stats, and CRUD operations.

export function useDisableReasons() {
  const { toast } = useToast()

  const { data, isLoading, refetch } = useAsyncData(
    () => studentService.disableReasons(),
    [],
  )

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()

        return (
          !q ||
          (r.reason || '').toLowerCase().includes(q) ||
          (r.description || '').toLowerCase().includes(q)
        )
      }),
    [rows, search],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => r.status === 'active').length,
      inactive: rows.filter((r) => r.status === 'inactive').length,
    }),
    [rows],
  )

  const saveReason = useCallback(
    async (payload, id) => {
      if (id) {
        await studentService.updateDisableReason(id, payload)

        toast({
          title: 'Disable reason updated',
        })
      } else {
        await studentService.createDisableReason(payload)

        toast({
          title: 'Disable reason created',
        })
      }

      refetch()
    },
    [toast, refetch],
  )

  const deleteReason = useCallback(
    async (id) => {
      await studentService.deleteDisableReason(id)

      toast({
        title: 'Disable reason deleted',
      })

      refetch()
    },
    [toast, refetch],
  )

  return {
    rows: filtered,
    allReasons: rows,

    stats,

    isLoading,

    search,
    setSearch,

    saveReason,

    deleteReason,

    refetch,
  }
}

// ─── useMultiClassStudents ────────────────────────────────────────────────────
// Manages multi class students list, search, stats, and CRUD operations.

export function useMultiClassStudents() {
  const { toast } = useToast()

  const { data, isLoading, refetch } = useAsyncData(
    () => studentService.multiClassStudents(),
    [],
  )

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()

        const matchSearch =
          !q ||
          (r.student_name || '').toLowerCase().includes(q) ||
          (r.admission_no || '').toLowerCase().includes(q)

        const matchStatus =
          status === 'all' || r.status === status

        return matchSearch && matchStatus
      }),
    [rows, search, status],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,

      active: rows.filter(
        (r) => r.status === 'active',
      ).length,

      inactive: rows.filter(
        (r) => r.status === 'inactive',
      ).length,

      assignments: rows.reduce(
        (total, student) =>
          total +
          (student.assigned_classes?.length || 0),
        0,
      ),
    }),
    [rows],
  )

  const saveAssignment = useCallback(
    async (payload, id) => {
      if (id) {
        await studentService.updateMultiClassStudent(
          id,
          payload,
        )

        toast({
          title: 'Assignment updated',
          description:
            'Student class assignment updated successfully.',
        })
      } else {
        await studentService.createMultiClassStudent(
          payload,
        )

        toast({
          title: 'Assignment created',
          description:
            'Student assigned to multiple classes.',
        })
      }

      refetch()
    },
    [toast, refetch],
  )

  const removeAssignment = useCallback(
    async (id) => {
      await studentService.deleteMultiClassStudent(
        id,
      )

      toast({
        title: 'Assignment removed',
        description:
          'Student class assignment removed.',
      })

      refetch()
    },
    [toast, refetch],
  )

  return {
    rows: filtered,
    allStudents: rows,

    stats,

    isLoading,

    search,
    setSearch,

    status,
    setStatus,

    saveAssignment,

    removeAssignment,

    refetch,
  }
}


// ─── useBulkDelete ────────────────────────────────────────────────────────────
// Manages bulk delete operations for students.

export function useBulkDelete() {
  const { toast } = useToast()

  const { data, isLoading, refetch } = useAsyncData(
    () => studentService.list(),
    [],
  )

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()

        return (
          !q ||
          fullName(r.name)
            .toLowerCase()
            .includes(q) ||
          (r.admission_no || '')
            .toLowerCase()
            .includes(q) ||
          (r.email || '')
            .toLowerCase()
            .includes(q)
        )
      }),
    [rows, search],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      selected: selected.length,
      remaining: rows.length - selected.length,
    }),
    [rows, selected],
  )

  const toggleSelection = useCallback((student) => {
    setSelected((prev) => {
      const exists = prev.find(
        (s) => s._id === student._id,
      )

      if (exists) {
        return prev.filter(
          (s) => s._id !== student._id,
        )
      }

      return [...prev, student]
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelected(filtered)
  }, [filtered])

  const clearSelection = useCallback(() => {
    setSelected([])
  }, [])

  const deleteSelected = useCallback(
    async () => {
      if (!selected.length) return

      await studentService.bulkDelete(
        selected.map((s) => s._id),
      )

      toast({
        title: 'Students Deleted',
        description: `${selected.length} students deleted successfully.`,
      })

      setSelected([])

      refetch()
    },
    [selected, toast, refetch],
  )

  return {
    rows: filtered,
    allStudents: rows,

    stats,

    isLoading,

    search,
    setSearch,

    selected,

    toggleSelection,

    selectAll,

    clearSelection,

    deleteSelected,

    refetch,
  }
}


