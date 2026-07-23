// useDownloadCenter
//
// Keeps business logic separate from UI.
//
// Later backend APIs will automatically work without changing pages.
//
// This hook wraps downloadCenterService calls and provides memoized filtering,
// statistics, and CRUD handlers so pages stay UI-only.

import { useMemo, useState, useCallback } from 'react'
import { downloadCenterService } from '@/services/downloadCenter.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'

// ─── useContentTypes ───────────────────────────────────────────────────────────
// Manages content types list state, filtering, stats, and CRUD operations.
export function useContentTypes() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => downloadCenterService.getContentTypes(), [])
  const { data: statsData } = useAsyncData(() => downloadCenterService.getStats(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []
  const stats = statsData || {}

  // useMemo prevents recalculating filtered content types
  // unless content type list or filters change.
  const filtered = useMemo(() => rows.filter((t) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      t.content_type_name.toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  // Prevent unnecessary child re-renders.
  const saveContentType = useCallback(async (payload, id) => {
    if (id) {
      await downloadCenterService.updateContentType(id, payload)
      toast({ title: 'Content type updated', description: payload.content_type_name })
    } else {
      await downloadCenterService.createContentType(payload)
      toast({ title: 'Content type added', description: payload.content_type_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteContentType = useCallback(async (id) => {
    await downloadCenterService.deleteContentType(id)
    toast({ title: 'Content type deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    saveContentType,
    deleteContentType,
  }
}

// ─── useContents ───────────────────────────────────────────────────────────────
// Manages upload share content list state, filtering, stats, and CRUD operations.
export function useContents() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => downloadCenterService.getContents(), [])
  const { data: typesData } = useAsyncData(() => downloadCenterService.getContentTypes(), [])
  const { data: statsData } = useAsyncData(() => downloadCenterService.getStats(), [])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []
  const contentTypes = typesData || []
  const stats = statsData || {}

  // useMemo prevents recalculating filtered contents
  // unless content list or filters change.
  const filtered = useMemo(() => rows.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.title.toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.uploaded_by || '').toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || c.content_type_id === typeFilter
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchType && matchStatus
  }), [rows, search, typeFilter, statusFilter])

  // Prevent unnecessary child re-renders.
  const saveContent = useCallback(async (payload, id) => {
    if (id) {
      await downloadCenterService.updateContent(id, payload)
      toast({ title: 'Content updated', description: payload.title })
    } else {
      await downloadCenterService.createContent(payload)
      toast({ title: 'Content uploaded', description: payload.title })
    }
    refetch()
  }, [refetch, toast])

  const deleteContent = useCallback(async (id) => {
    await downloadCenterService.deleteContent(id)
    toast({ title: 'Content deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    contentTypes,
    stats,
    isLoading,
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    saveContent,
    deleteContent,
  }
}

// ─── useShareLists ─────────────────────────────────────────────────────────────
// Manages content share list state, filtering, stats, and CRUD operations.
export function useShareLists() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => downloadCenterService.getShareLists(), [])
  const { data: contentsData } = useAsyncData(() => downloadCenterService.getContents(), [])
  const { data: statsData } = useAsyncData(() => downloadCenterService.getStats(), [])

  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')

  const rows = data || []
  const contents = contentsData || []
  const stats = statsData || {}

  // useMemo prevents recalculating filtered share lists
  // unless share list or filters change.
  const filtered = useMemo(() => rows.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      s.content_title.toLowerCase().includes(q) ||
      (s.note || '').toLowerCase().includes(q)
    const matchClass = classFilter === 'all' || s.class_id === classFilter
    return matchSearch && matchClass
  }), [rows, search, classFilter])

  const classes = useMemo(() => [...new Set(rows.map((s) => s.class_id))]
    .map((id) => {
      const item = rows.find((r) => r.class_id === id)
      return { id, name: item?.class_name || id }
    }), [rows])

  // Prevent unnecessary child re-renders.
  const createShareList = useCallback(async (payload) => {
    await downloadCenterService.createShareList(payload)
    toast({ title: 'Content shared', description: payload.content_title || 'Shared' })
    refetch()
  }, [refetch, toast])

  const deleteShareList = useCallback(async (id) => {
    await downloadCenterService.deleteShareList(id)
    toast({ title: 'Share list deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    contents,
    classes,
    stats,
    isLoading,
    search, setSearch,
    classFilter, setClassFilter,
    createShareList,
    deleteShareList,
  }
}

// ─── useVideoTutorials ─────────────────────────────────────────────────────────
// Manages video tutorials list state, filtering, stats, and CRUD operations.
export function useVideoTutorials() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => downloadCenterService.getVideoTutorials(), [])
  const { data: statsData } = useAsyncData(() => downloadCenterService.getStats(), [])

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const rows = data || []
  const stats = statsData || {}

  // useMemo prevents recalculating filtered video tutorials
  // unless video list or filters change.
  const filtered = useMemo(() => rows.filter((v) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      v.title.toLowerCase().includes(q) ||
      (v.description || '').toLowerCase().includes(q) ||
      (v.uploaded_by || '').toLowerCase().includes(q)
    const matchCategory = categoryFilter === 'all' || v.category === categoryFilter
    return matchSearch && matchCategory
  }), [rows, search, categoryFilter])

  const categories = useMemo(() => [...new Set(rows.map((v) => v.category))], [rows])

  // Prevent unnecessary child re-renders.
  const saveVideo = useCallback(async (payload, id) => {
    if (id) {
      await downloadCenterService.updateVideoTutorial(id, payload)
      toast({ title: 'Video tutorial updated', description: payload.title })
    } else {
      await downloadCenterService.createVideoTutorial(payload)
      toast({ title: 'Video tutorial added', description: payload.title })
    }
    refetch()
  }, [refetch, toast])

  const deleteVideo = useCallback(async (id) => {
    await downloadCenterService.deleteVideoTutorial(id)
    toast({ title: 'Video tutorial deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    categories,
    saveVideo,
    deleteVideo,
  }
}
