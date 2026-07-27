// useFrontCms
//
// Keeps business logic separate from UI.
//
// Later backend APIs will automatically work without changing pages.
//
// This hook wraps frontCmsService calls and provides memoized filtering,
// statistics, and CRUD handlers so pages stay UI-only.

import { useMemo, useState, useCallback } from 'react'
import { frontCmsService } from '@/services/frontCms.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'

// ─── useFrontCmsStats ──────────────────────────────────────────────────────────
// Provides dashboard stats for the Front CMS module.
export function useFrontCmsStats() {
  const { data, isLoading } = useAsyncData(() => frontCmsService.getStats(), [])
  const stats = data || {}
  return { stats, isLoading }
}

// ─── useBanners ────────────────────────────────────────────────────────────────
// Manages banner list state, filtering, stats, and CRUD operations.
export function useBanners() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontCmsService.getBanners(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered banners
  // unless banner list or filters change.
  const filtered = useMemo(() => rows.filter((b) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (b.title || '').toLowerCase().includes(q) ||
      (b.subtitle || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || b.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    published: rows.filter((b) => b.status === 'published').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveBanner = useCallback(async (payload, id) => {
    if (id) {
      await frontCmsService.updateBanner(id, payload)
      toast({ title: 'Banner updated', description: payload.title })
    } else {
      await frontCmsService.createBanner(payload)
      toast({ title: 'Banner added', description: payload.title })
    }
    refetch()
  }, [refetch, toast])

  const deleteBanner = useCallback(async (id) => {
    await frontCmsService.deleteBanner(id)
    toast({ title: 'Banner deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    saveBanner,
    deleteBanner,
  }
}

// ─── useNews ────────────────────────────────────────────────────────────────────
// Manages news list state, filtering, stats, and CRUD operations.
export function useNews() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontCmsService.getNews(), [])

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered news
  // unless news list or filters change.
  const filtered = useMemo(() => rows.filter((n) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (n.title || '').toLowerCase().includes(q) ||
      (n.author || '').toLowerCase().includes(q) ||
      (n.slug || '').toLowerCase().includes(q)
    const matchCategory = categoryFilter === 'all' || n.category === categoryFilter
    const matchStatus = statusFilter === 'all' || n.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  }), [rows, search, categoryFilter, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    published: rows.filter((n) => n.status === 'published').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveNews = useCallback(async (payload, id) => {
    if (id) {
      await frontCmsService.updateNews(id, payload)
      toast({ title: 'News updated', description: payload.title })
    } else {
      await frontCmsService.createNews(payload)
      toast({ title: 'News added', description: payload.title })
    }
    refetch()
  }, [refetch, toast])

  const deleteNews = useCallback(async (id) => {
    await frontCmsService.deleteNews(id)
    toast({ title: 'News deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    saveNews,
    deleteNews,
  }
}

// ─── useEvents ──────────────────────────────────────────────────────────────────
// Manages event list state, filtering, stats, and CRUD operations.
export function useEvents() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontCmsService.getEvents(), [])

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered events
  // unless event list or filters change.
  const filtered = useMemo(() => rows.filter((e) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (e.title || '').toLowerCase().includes(q) ||
      (e.location || '').toLowerCase().includes(q)
    const matchCategory = categoryFilter === 'all' || e.category === categoryFilter
    const matchStatus = statusFilter === 'all' || e.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  }), [rows, search, categoryFilter, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    published: rows.filter((e) => e.status === 'published').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveEvent = useCallback(async (payload, id) => {
    if (id) {
      await frontCmsService.updateEvent(id, payload)
      toast({ title: 'Event updated', description: payload.title })
    } else {
      await frontCmsService.createEvent(payload)
      toast({ title: 'Event added', description: payload.title })
    }
    refetch()
  }, [refetch, toast])

  const deleteEvent = useCallback(async (id) => {
    await frontCmsService.deleteEvent(id)
    toast({ title: 'Event deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    saveEvent,
    deleteEvent,
  }
}

// ─── useGallery ──────────────────────────────────────────────────────────────────
// Manages gallery list state, filtering, stats, and CRUD operations.
export function useGallery() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontCmsService.getGallery(), [])

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered gallery items
  // unless gallery list or filters change.
  const filtered = useMemo(() => rows.filter((g) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (g.title || '').toLowerCase().includes(q)
    const matchCategory = categoryFilter === 'all' || g.category === categoryFilter
    const matchStatus = statusFilter === 'all' || g.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  }), [rows, search, categoryFilter, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    published: rows.filter((g) => g.status === 'published').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveGallery = useCallback(async (payload, id) => {
    if (id) {
      await frontCmsService.updateGallery(id, payload)
      toast({ title: 'Gallery item updated', description: payload.title })
    } else {
      await frontCmsService.createGallery(payload)
      toast({ title: 'Gallery item added', description: payload.title })
    }
    refetch()
  }, [refetch, toast])

  const deleteGallery = useCallback(async (id) => {
    await frontCmsService.deleteGallery(id)
    toast({ title: 'Gallery item deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    saveGallery,
    deleteGallery,
  }
}

// ─── useMedia ────────────────────────────────────────────────────────────────────
// Manages media list state, filtering, stats, and CRUD operations.
export function useMedia() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontCmsService.getMedia(), [])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered media
  // unless media list or filters change.
  const filtered = useMemo(() => rows.filter((m) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (m.file_name || '').toLowerCase().includes(q) ||
      (m.uploaded_by || '').toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || m.file_type === typeFilter
    return matchSearch && matchType
  }), [rows, search, typeFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((m) => m.status === 'active').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveMedia = useCallback(async (payload, id) => {
    if (id) {
      await frontCmsService.createMedia(payload)
      toast({ title: 'Media updated', description: payload.file_name })
    } else {
      await frontCmsService.createMedia(payload)
      toast({ title: 'Media added', description: payload.file_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteMedia = useCallback(async (id) => {
    await frontCmsService.deleteMedia(id)
    toast({ title: 'Media deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    typeFilter, setTypeFilter,
    saveMedia,
    deleteMedia,
  }
}

// ─── useCmsPages ──────────────────────────────────────────────────────────────────
// Manages CMS pages list state, filtering, stats, and CRUD operations.
export function useCmsPages() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontCmsService.getPages(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered pages
  // unless page list or filters change.
  const filtered = useMemo(() => rows.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (p.page_title || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    published: rows.filter((p) => p.status === 'published').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const savePage = useCallback(async (payload, id) => {
    if (id) {
      await frontCmsService.updatePage(id, payload)
      toast({ title: 'Page updated', description: payload.page_title })
    } else {
      await frontCmsService.createPage(payload)
      toast({ title: 'Page added', description: payload.page_title })
    }
    refetch()
  }, [refetch, toast])

  const deletePage = useCallback(async (id) => {
    await frontCmsService.deletePage(id)
    toast({ title: 'Page deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    savePage,
    deletePage,
  }
}

// ─── useMenus ────────────────────────────────────────────────────────────────────
// Manages menu list state, filtering, stats, and CRUD operations.
export function useMenus() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => frontCmsService.getMenus(), [])

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered menus
  // unless menu list or filters change.
  const filtered = useMemo(() => rows.filter((m) => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (m.menu_name || '').toLowerCase().includes(q) ||
      (m.link_url || '').toLowerCase().includes(q)
    const matchType = typeFilter === 'all' || m.menu_type === typeFilter
    return matchSearch && matchType
  }), [rows, search, typeFilter])

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((m) => m.status === 'active').length,
  }), [rows])

  // Prevent unnecessary child re-renders.
  const saveMenu = useCallback(async (payload, id) => {
    if (id) {
      await frontCmsService.updateMenu(id, payload)
      toast({ title: 'Menu updated', description: payload.menu_name })
    } else {
      await frontCmsService.createMenu(payload)
      toast({ title: 'Menu added', description: payload.menu_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteMenu = useCallback(async (id) => {
    await frontCmsService.deleteMenu(id)
    toast({ title: 'Menu deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    stats,
    isLoading,
    search, setSearch,
    typeFilter, setTypeFilter,
    saveMenu,
    deleteMenu,
  }
}
