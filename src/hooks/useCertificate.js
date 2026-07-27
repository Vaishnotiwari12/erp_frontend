// useCertificate
//
// Keeps business logic separate from UI.
//
// Later backend APIs will automatically work without changing pages.
//
// This hook wraps certificateService calls and provides memoized
// filtering, statistics, and CRUD handlers so pages stay UI-only.

import { useMemo, useState, useCallback } from 'react'
import { certificateService } from '@/services/certificate.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'

// ─── useCertificateStats ────────────────────────────────────────────────────────
// Provides dashboard-level stats for the Certificate module.
export function useCertificateStats() {
  const { data, isLoading } = useAsyncData(() => certificateService.getStats(), [])
  return { stats: data, isLoading }
}

// ─── useStudentCertificates ──────────────────────────────────────────────────────
// Manages student certificate list state, filtering, stats, and CRUD.
export function useStudentCertificates() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => certificateService.getStudentCertificates(), [])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered certificates
  // unless certificate list or filters change.
  const filtered = useMemo(() => rows.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.certificate_name.toLowerCase().includes(q) ||
      c.student_name.toLowerCase().includes(q) ||
      c.admission_no.toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || c.certificate_type === typeFilter
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchType && matchStatus
  }), [rows, search, typeFilter, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    issued: rows.filter((c) => c.status === 'issued').length,
    pending: rows.filter((c) => c.status === 'pending').length,
    draft: rows.filter((c) => c.status === 'draft').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveStudentCertificate = useCallback(async (payload, id) => {
    if (id) {
      await certificateService.updateStudentCertificate(id, payload)
      toast({ title: 'Certificate updated', description: payload.certificate_name })
    } else {
      await certificateService.createStudentCertificate(payload)
      toast({ title: 'Certificate added', description: payload.certificate_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteStudentCertificate = useCallback(async (id) => {
    await certificateService.deleteStudentCertificate(id)
    toast({ title: 'Certificate deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    saveStudentCertificate,
    deleteStudentCertificate,
  }
}

// ─── useGeneratedCertificates ────────────────────────────────────────────────────
// Manages generated certificate list state, filtering, create, and delete.
export function useGeneratedCertificates() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => certificateService.getGeneratedCertificates(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered generated certificates
  // unless list or filters change.
  const filtered = useMemo(() => rows.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.certificate_name.toLowerCase().includes(q) ||
      c.student_name.toLowerCase().includes(q) ||
      c.admission_no.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const createGeneratedCertificate = useCallback(async (payload) => {
    await certificateService.createGeneratedCertificate(payload)
    toast({ title: 'Certificate generated', description: payload.certificate_name })
    refetch()
  }, [refetch, toast])

  const deleteGeneratedCertificate = useCallback(async (id) => {
    await certificateService.deleteGeneratedCertificate(id)
    toast({ title: 'Generated certificate deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    createGeneratedCertificate,
    deleteGeneratedCertificate,
  }
}

// ─── useStudentIdCards ────────────────────────────────────────────────────────────
// Manages student ID card list state, filtering, stats, and CRUD.
export function useStudentIdCards() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => certificateService.getStudentIdCards(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered ID cards
  // unless card list or filters change.
  const filtered = useMemo(() => rows.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.card_name.toLowerCase().includes(q) ||
      c.student_name.toLowerCase().includes(q) ||
      c.admission_no.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((c) => c.status === 'active').length,
    inactive: rows.filter((c) => c.status === 'inactive').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveStudentIdCard = useCallback(async (payload, id) => {
    if (id) {
      await certificateService.updateStudentIdCard(id, payload)
      toast({ title: 'ID card updated', description: payload.card_name })
    } else {
      await certificateService.createStudentIdCard(payload)
      toast({ title: 'ID card added', description: payload.card_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteStudentIdCard = useCallback(async (id) => {
    await certificateService.deleteStudentIdCard(id)
    toast({ title: 'ID card deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    saveStudentIdCard,
    deleteStudentIdCard,
  }
}

// ─── useGeneratedStudentIdCards ──────────────────────────────────────────────────
// Manages generated student ID card list state, filtering, create, and delete.
export function useGeneratedStudentIdCards() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => certificateService.getGeneratedStudentIdCards(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  // useMemo prevents recalculating filtered generated ID cards
  // unless list or search changes.
  const filtered = useMemo(() => rows.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.card_name.toLowerCase().includes(q) ||
      c.student_name.toLowerCase().includes(q) ||
      c.admission_no.toLowerCase().includes(q)
    return matchSearch
  }), [rows, search])

  const createGeneratedStudentIdCard = useCallback(async (payload) => {
    await certificateService.createGeneratedStudentIdCard(payload)
    toast({ title: 'Student ID card generated', description: payload.card_name })
    refetch()
  }, [refetch, toast])

  const deleteGeneratedStudentIdCard = useCallback(async (id) => {
    await certificateService.deleteGeneratedStudentIdCard(id)
    toast({ title: 'Generated student ID card deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    createGeneratedStudentIdCard,
    deleteGeneratedStudentIdCard,
  }
}

// ─── useStaffIdCards ──────────────────────────────────────────────────────────────
// Manages staff ID card list state, filtering, stats, and CRUD.
export function useStaffIdCards() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => certificateService.getStaffIdCards(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered staff ID cards
  // unless card list or filters change.
  const filtered = useMemo(() => rows.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.card_name.toLowerCase().includes(q) ||
      c.staff_name.toLowerCase().includes(q) ||
      c.staff_id.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((c) => c.status === 'active').length,
    inactive: rows.filter((c) => c.status === 'inactive').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveStaffIdCard = useCallback(async (payload, id) => {
    if (id) {
      await certificateService.updateStaffIdCard(id, payload)
      toast({ title: 'Staff ID card updated', description: payload.card_name })
    } else {
      await certificateService.createStaffIdCard(payload)
      toast({ title: 'Staff ID card added', description: payload.card_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteStaffIdCard = useCallback(async (id) => {
    await certificateService.deleteStaffIdCard(id)
    toast({ title: 'Staff ID card deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    saveStaffIdCard,
    deleteStaffIdCard,
  }
}

// ─── useGeneratedStaffIdCards ────────────────────────────────────────────────────
// Manages generated staff ID card list state, filtering, create, and delete.
export function useGeneratedStaffIdCards() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => certificateService.getGeneratedStaffIdCards(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  // useMemo prevents recalculating filtered generated staff ID cards
  // unless list or search changes.
  const filtered = useMemo(() => rows.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.card_name.toLowerCase().includes(q) ||
      c.staff_name.toLowerCase().includes(q)
    return matchSearch
  }), [rows, search])

  const createGeneratedStaffIdCard = useCallback(async (payload) => {
    await certificateService.createGeneratedStaffIdCard(payload)
    toast({ title: 'Staff ID card generated', description: payload.card_name })
    refetch()
  }, [refetch, toast])

  const deleteGeneratedStaffIdCard = useCallback(async (id) => {
    await certificateService.deleteGeneratedStaffIdCard(id)
    toast({ title: 'Generated staff ID card deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    createGeneratedStaffIdCard,
    deleteGeneratedStaffIdCard,
  }
}
