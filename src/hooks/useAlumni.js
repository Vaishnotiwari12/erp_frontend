// useAlumni
//
// Keeps business logic separate from UI.
//
// Later backend APIs will automatically work without changing pages.
//
// This hook wraps alumniService calls and provides memoized filtering,
// statistics, and CRUD handlers so pages stay UI-only.

import { useMemo, useState, useCallback } from 'react'
import { alumniService } from '@/services/alumni.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'

// ─── useAlumni ────────────────────────────────────────────────────────────────
// Manages alumni list state, filtering, stats, and CRUD operations.
export function useAlumni() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => alumniService.getAlumni(), [])
  const { data: statsData } = useAsyncData(() => alumniService.getStats(), [])

  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []
  const stats = statsData || {}

  // useMemo prevents recalculating filtered alumni
  // unless alumni list or filters change.
  const filtered = useMemo(() => rows.filter((a) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.current_occupation || '').toLowerCase().includes(q)
    const matchYear = yearFilter === 'all' || String(a.passing_year) === yearFilter
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchYear && matchStatus
  }), [rows, search, yearFilter, statusFilter])

  const years = useMemo(() => [...new Set(rows.map((a) => a.passing_year))].sort((a, b) => b - a), [rows])

  // Prevent unnecessary child re-renders.
  const saveAlumni = useCallback(async (payload, id) => {
    if (id) {
      await alumniService.updateAlumni(id, payload)
      toast({ title: 'Alumni updated', description: payload.name })
    } else {
      await alumniService.createAlumni(payload)
      toast({ title: 'Alumni added', description: payload.name })
    }
    refetch()
  }, [refetch, toast])

  const deleteAlumni = useCallback(async (id) => {
    await alumniService.deleteAlumni(id)
    toast({ title: 'Alumni deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    yearFilter, setYearFilter,
    statusFilter, setStatusFilter,
    years,
    saveAlumni,
    deleteAlumni,
  }
}

// ─── useAlumniEvents ───────────────────────────────────────────────────────────
// Manages alumni events list state, filtering, stats, and CRUD operations.
export function useAlumniEvents() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => alumniService.getEvents(), [])
  const { data: statsData } = useAsyncData(() => alumniService.getStats(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []
  const stats = statsData || {}

  // useMemo prevents recalculating filtered events
  // unless event list or filters change.
  const filtered = useMemo(() => rows.filter((e) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      e.event_name.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  // Prevent unnecessary child re-renders.
  const saveEvent = useCallback(async (payload, id) => {
    if (id) {
      await alumniService.updateEvent(id, payload)
      toast({ title: 'Event updated', description: payload.event_name })
    } else {
      await alumniService.createEvent(payload)
      toast({ title: 'Event added', description: payload.event_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteEvent = useCallback(async (id) => {
    await alumniService.deleteEvent(id)
    toast({ title: 'Event deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    saveEvent,
    deleteEvent,
  }
}
