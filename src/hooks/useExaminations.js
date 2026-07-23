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
import { examinationService } from '@/services/examination.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'

const SESSIONS = ['2024-2025', '2025-2026', '2026-2027']
const STATUSES = ['scheduled', 'active', 'completed']

// ─── useExamGroups ──────────────────────────────────────────────────────────────
// Manages exam groups list, filtering, stats, and CRUD operations.
export function useExamGroups() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getExamGroups(), [])

  const [search, setSearch] = useState('')
  const [session, setSession] = useState('all')
  const [status, setStatus] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered exam groups
  // unless list or filters change.
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase())
        const matchSession = session === 'all' || r.session === session
        const matchStatus = status === 'all' || r.status === status
        return matchSearch && matchSession && matchStatus
      }),
    [rows, search, session, status],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => r.status === 'active').length,
      scheduled: rows.filter((r) => r.status === 'scheduled').length,
      completed: rows.filter((r) => r.status === 'completed').length,
    }),
    [rows],
  )

  const saveExamGroup = useCallback(
    async (payload, id) => {
      if (id) {
        await examinationService.updateExamGroup(id, payload)
        toast({ title: 'Exam group updated', description: payload.name })
      } else {
        await examinationService.createExamGroup(payload)
        toast({ title: 'Exam group added', description: payload.name })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteExamGroup = useCallback(
    async (id) => {
      await examinationService.removeExamGroup(id)
      toast({ title: 'Exam group deleted' })
      refetch()
    },
    [refetch, toast],
  )

  const bulkDelete = useCallback(
    async (selected) => {
      await examinationService.bulkDeleteExamGroups(selected.map((s) => s._id))
      toast({ title: `${selected.length} exam groups deleted` })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allExamGroups: rows,
    stats,
    isLoading,
    search, setSearch,
    session, setSession,
    status, setStatus,
    sessions: SESSIONS,
    statuses: STATUSES,
    saveExamGroup,
    deleteExamGroup,
    bulkDelete,
  }
}

// ─── useExamSchedule ────────────────────────────────────────────────────────────
// Manages exam schedule list, filtering, stats, and CRUD operations.
export function useExamSchedule() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getExamSchedule(), [])

  const [search, setSearch] = useState('')
  const [examGroup, setExamGroup] = useState('all')
  const [classFilter, setClassFilter] = useState('all')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || r.subject.toLowerCase().includes(q) || (r.exam_group || '').toLowerCase().includes(q)
        const matchGroup = examGroup === 'all' || r.exam_group === examGroup
        const matchClass = classFilter === 'all' || r.class === classFilter
        return matchSearch && matchGroup && matchClass
      }),
    [rows, search, examGroup, classFilter],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      scheduled: rows.filter((r) => r.status === 'scheduled').length,
      completed: rows.filter((r) => r.status === 'completed').length,
    }),
    [rows],
  )

  const saveSchedule = useCallback(
    async (payload, id) => {
      if (id) {
        await examinationService.updateSchedule(id, payload)
        toast({ title: 'Schedule updated', description: payload.subject })
      } else {
        await examinationService.createSchedule(payload)
        toast({ title: 'Schedule added', description: payload.subject })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteSchedule = useCallback(
    async (id) => {
      await examinationService.removeSchedule(id)
      toast({ title: 'Schedule deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allSchedule: rows,
    stats,
    isLoading,
    search, setSearch,
    examGroup, setExamGroup,
    classFilter, setClassFilter,
    saveSchedule,
    deleteSchedule,
  }
}

// ─── useExamResults ─────────────────────────────────────────────────────────────
// Manages exam results list, filtering, stats, and CRUD operations.
export function useExamResults() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getExamResults(), [])

  const [search, setSearch] = useState('')
  const [exam, setExam] = useState('all')
  const [classFilter, setClassFilter] = useState('all')
  const [section, setSection] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered results
  // unless list or filters change.
  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const matchSearch = !search || r.student.toLowerCase().includes(search.toLowerCase()) || r.admission_no.toLowerCase().includes(search.toLowerCase())
        const matchExam = exam === 'all' || r.exam === exam
        const matchClass = classFilter === 'all' || r.class === classFilter
        const matchSection = section === 'all' || r.section === section
        return matchSearch && matchExam && matchClass && matchSection
      }),
    [rows, search, exam, classFilter, section],
  )

  const stats = useMemo(
    () => ({
      total: rows.length,
      avg: rows.length ? (rows.reduce((a, r) => a + r.percentage, 0) / rows.length).toFixed(1) : 0,
      topRank: rows.length ? Math.min(...rows.map((r) => r.rank)) : 0,
      distinctions: rows.filter((r) => r.grade === 'A+').length,
    }),
    [rows],
  )

  const saveResult = useCallback(
    async (payload, id) => {
      if (id) {
        await examinationService.updateResult(id, payload)
        toast({ title: 'Result updated', description: payload.student })
      } else {
        await examinationService.createResult(payload)
        toast({ title: 'Result added', description: payload.student })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteResult = useCallback(
    async (id) => {
      await examinationService.removeResult(id)
      toast({ title: 'Result deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allResults: rows,
    stats,
    isLoading,
    search, setSearch,
    exam, setExam,
    classFilter, setClassFilter,
    section, setSection,
    saveResult,
    deleteResult,
  }
}

// ─── useMarksGrades ──────────────────────────────────────────────────────────────
// Manages marks grades list, filtering, and CRUD operations.
export function useMarksGrades() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getMarksGrades(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        return !q || (r.grade || '').toLowerCase().includes(q)
      }),
    [rows, search],
  )

  const saveGrade = useCallback(
    async (payload, id) => {
      if (id) {
        await examinationService.updateMarksGrade(id, payload)
        toast({ title: 'Grade updated', description: payload.grade })
      } else {
        await examinationService.createMarksGrade(payload)
        toast({ title: 'Grade added', description: payload.grade })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteGrade = useCallback(
    async (id) => {
      await examinationService.removeMarksGrade(id)
      toast({ title: 'Grade deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allGrades: rows,
    isLoading,
    search, setSearch,
    saveGrade,
    deleteGrade,
  }
}

// ─── useMarksDivisions ──────────────────────────────────────────────────────────
// Manages marks divisions list, filtering, and CRUD operations.
export function useMarksDivisions() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getMarksDivisions(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        return !q || (r.division || '').toLowerCase().includes(q)
      }),
    [rows, search],
  )

  const saveDivision = useCallback(
    async (payload, id) => {
      if (id) {
        await examinationService.updateMarksDivision(id, payload)
        toast({ title: 'Division updated', description: payload.division })
      } else {
        await examinationService.createMarksDivision(payload)
        toast({ title: 'Division added', description: payload.division })
      }
      refetch()
    },
    [refetch, toast],
  )

  const deleteDivision = useCallback(
    async (id) => {
      await examinationService.removeMarksDivision(id)
      toast({ title: 'Division deleted' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allDivisions: rows,
    isLoading,
    search, setSearch,
    saveDivision,
    deleteDivision,
  }
}

// ─── useAdmitCards ───────────────────────────────────────────────────────────────
// Manages admit cards list, filtering, and template updates.
export function useAdmitCards() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getAdmitCards(), [])

  const [search, setSearch] = useState('')
  const [examGroup, setExamGroup] = useState('all')
  const [classFilter, setClassFilter] = useState('all')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || r.student_name.toLowerCase().includes(q) || r.admission_no.toLowerCase().includes(q)
        const matchGroup = examGroup === 'all' || r.exam_group === examGroup
        const matchClass = classFilter === 'all' || r.class === classFilter
        return matchSearch && matchGroup && matchClass
      }),
    [rows, search, examGroup, classFilter],
  )

  const updateTemplate = useCallback(
    async (payload) => {
      await examinationService.updateAdmitCardTemplate(payload)
      toast({ title: 'Admit card template updated' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allAdmitCards: rows,
    isLoading,
    search, setSearch,
    examGroup, setExamGroup,
    classFilter, setClassFilter,
    updateTemplate,
  }
}

// ─── useMarksheets ───────────────────────────────────────────────────────────────
// Manages marksheets list, filtering, and template updates.
export function useMarksheets() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => examinationService.getMarksheets(), [])

  const [search, setSearch] = useState('')
  const [examGroup, setExamGroup] = useState('all')
  const [classFilter, setClassFilter] = useState('all')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || r.student_name.toLowerCase().includes(q) || r.admission_no.toLowerCase().includes(q)
        const matchGroup = examGroup === 'all' || r.exam_group === examGroup
        const matchClass = classFilter === 'all' || r.class === classFilter
        return matchSearch && matchGroup && matchClass
      }),
    [rows, search, examGroup, classFilter],
  )

  const updateTemplate = useCallback(
    async (payload) => {
      await examinationService.updateMarksheetTemplate(payload)
      toast({ title: 'Marksheet template updated' })
      refetch()
    },
    [refetch, toast],
  )

  return {
    rows: filtered,
    allMarksheets: rows,
    isLoading,
    search, setSearch,
    examGroup, setExamGroup,
    classFilter, setClassFilter,
    updateTemplate,
  }
}

// ─── useConsolidatedMarksheets ───────────────────────────────────────────────────
// Manages consolidated marksheets list and filtering.
export function useConsolidatedMarksheets() {
  const { data, isLoading } = useAsyncData(() => examinationService.getConsolidatedMarksheets(), [])

  const [search, setSearch] = useState('')
  const [session, setSession] = useState('all')

  const rows = data || []

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase()
        const matchSearch = !q || r.student_name.toLowerCase().includes(q) || r.admission_no.toLowerCase().includes(q)
        const matchSession = session === 'all' || r.session === session
        return matchSearch && matchSession
      }),
    [rows, search, session],
  )

  return {
    rows: filtered,
    allConsolidated: rows,
    isLoading,
    search, setSearch,
    session, setSession,
  }
}
