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
import { academicsService } from '@/services/academics.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'

// ─── useClasses ────────────────────────────────────────────────────────────────
// Manages academic classes list, filtering, stats, and CRUD operations.
export function useClasses() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.classes(), [])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered classes
  // unless class list or filters change.
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || r.name.toLowerCase().includes(q)
        const matchStatus = status === 'all' || r.status === status
        return matchSearch && matchStatus
      }),
    [rows, search, status],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => r.status === 'active').length,
      sections: rows.reduce((s, r) => s + (r.sections_count || 0), 0),
      inactive: rows.filter((r) => r.status !== 'active').length,
    }),
    [rows],
  )

  const saveClass = useCallback(
    async (payload, id) => {
      if (id) {
        await academicsService.update(id, payload)
        toast({ title: 'Class updated', description: payload.name })
      } else {
        await academicsService.createClass(payload)
        toast({ title: 'Class added', description: payload.name })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteClass = useCallback(
    async (id) => {
      await academicsService.remove(id)
      toast({ title: 'Class deleted' })
      refetch()
    },
    [refetch, toast],
  )

  const bulkDelete = useCallback(
    async (ids) => {
      await academicsService.bulkDelete(ids)
      toast({ title: 'Classes deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allClasses: rows,
    stats,
    isLoading,
    search, setSearch,
    status, setStatus,
    saveClass,
    deleteClass,
    bulkDelete,
  }
}

// ─── useSections ───────────────────────────────────────────────────────────────
// Manages academic sections list, filtering, and CRUD operations.
export function useSections() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.sections(), [])

  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || (r.name || '').toLowerCase().includes(q)
        const matchClass = classFilter === 'all' || r.class === classFilter
        return matchSearch && matchClass
      }),
    [rows, search, classFilter],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      classes: new Set(rows.map((r) => r.class)).size,
    }),
    [rows],
  )

  const saveSection = useCallback(
    async (payload, id) => {
      if (id) {
        await academicsService.update(id, payload)
        toast({ title: 'Section updated', description: payload.name })
      } else {
        await academicsService.createSection(payload)
        toast({ title: 'Section added', description: payload.name })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteSection = useCallback(
    async (id) => {
      await academicsService.remove(id)
      toast({ title: 'Section deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allSections: rows,
    stats,
    isLoading,
    search, setSearch,
    classFilter, setClassFilter,
    saveSection,
    deleteSection,
  }
}

// ─── useSubjects ────────────────────────────────────────────────────────────────
// Manages subjects list, filtering, stats, and CRUD operations.
export function useSubjects() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.subjects(), [])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered subjects
  // unless subject list or filters change.
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)
        const matchStatus = status === 'all' || r.status === status
        const matchType = typeFilter === 'all' || r.type === typeFilter
        return matchSearch && matchStatus && matchType
      }),
    [rows, search, status, typeFilter],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => r.status === 'active').length,
      core: rows.filter((r) => r.type === 'Core').length,
      elective: rows.filter((r) => r.type === 'Elective').length,
    }),
    [rows],
  )

  const saveSubject = useCallback(
    async (payload, id) => {
      if (id) {
        await academicsService.update(id, payload)
        toast({ title: 'Subject updated', description: payload.name })
      } else {
        await academicsService.createSubject(payload)
        toast({ title: 'Subject added', description: payload.name })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteSubject = useCallback(
    async (id) => {
      await academicsService.remove(id)
      toast({ title: 'Subject deleted' })
      refetch()
    },
    [refetch, toast],
  )

  const bulkDelete = useCallback(
    async (ids) => {
      await academicsService.bulkDelete(ids)
      toast({ title: 'Subjects deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allSubjects: rows,
    stats,
    isLoading,
    search, setSearch,
    status, setStatus,
    typeFilter, setTypeFilter,
    saveSubject,
    deleteSubject,
    bulkDelete,
  }
}

// ─── useSubjectGroups ──────────────────────────────────────────────────────────
// Manages subject groups list, filtering, and CRUD operations.
export function useSubjectGroups() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.subjectGroups(), [])

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

  const saveSubjectGroup = useCallback(
    async (payload, id) => {
      if (id) {
        await academicsService.update(id, payload)
        toast({ title: 'Subject group updated', description: payload.name })
      } else {
        await academicsService.createSubjectGroup(payload)
        toast({ title: 'Subject group added', description: payload.name })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteSubjectGroup = useCallback(
    async (id) => {
      await academicsService.remove(id)
      toast({ title: 'Subject group deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allSubjectGroups: rows,
    isLoading,
    search, setSearch,
    saveSubjectGroup,
    deleteSubjectGroup,
  }
}

// ─── useClassTeachers ──────────────────────────────────────────────────────────
// Manages class teachers list, filtering, and CRUD operations.
export function useClassTeachers() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => academicsService.classTeachers(), [])

  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || (r.teacher_name || '').toLowerCase().includes(q) || (r.class || '').toLowerCase().includes(q)
        const matchClass = classFilter === 'all' || r.class === classFilter
        return matchSearch && matchClass
      }),
    [rows, search, classFilter],
  )

  const saveClassTeacher = useCallback(
    async (payload, id) => {
      if (id) {
        await academicsService.update(id, payload)
        toast({ title: 'Class teacher updated' })
      } else {
        await academicsService.createClassTeacher(payload)
        toast({ title: 'Class teacher assigned' })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteClassTeacher = useCallback(
    async (id) => {
      await academicsService.remove(id)
      toast({ title: 'Class teacher removed' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allClassTeachers: rows,
    isLoading,
    search, setSearch,
    classFilter, setClassFilter,
    saveClassTeacher,
    deleteClassTeacher,
  }
}

// ─── useClassTimetable ──────────────────────────────────────────────────────────
// Manages class timetable grid, filter state, and stats.
export function useClassTimetable() {
  const { toast } = useToast()
  const { data, isLoading } = useAsyncData(() => academicsService.classTimetable(), [])

  const [classFilter, setClassFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [year, setYear] = useState('')

  const grid = data || {}

  const stats = useMemo(() => {
    const entries = Object.values(grid).filter((e) => !e.isBreak && !e.isFree)
    return {
      total: entries.length,
      subjects: new Set(entries.map((e) => e.subject)).size,
      teachers: new Set(entries.map((e) => e.teacher)).size,
    }
  }, [grid])

  const exportPdf = useCallback(() => {
    toast({ title: 'Exporting PDF', description: 'The timetable PDF will download shortly.' })
  }, [toast])

  return {
    grid,
    stats,
    isLoading,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    year, setYear,
    exportPdf,
  }
}

// ─── useTeacherTimetable ────────────────────────────────────────────────────────
// Manages teacher timetable grid for a given teacher name.
export function useTeacherTimetable(teacherName) {
  const { data, isLoading } = useAsyncData(
    () => academicsService.teacherTimetable(teacherName),
    [teacherName],
  )

  const grid = data || {}

  const stats = useMemo(() => {
    const entries = Object.values(grid).filter((e) => !e.isBreak && !e.isFree)
    return {
      total: entries.length,
      subjects: new Set(entries.map((e) => e.subject)).size,
      classes: new Set(entries.map((e) => e.class)).size,
    }
  }, [grid])

  return {
    grid,
    stats,
    isLoading,
  }
}
