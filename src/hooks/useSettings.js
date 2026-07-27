// useSettings
//
// Keeps business logic separate from UI.
//
// Later backend APIs will automatically work without changing pages.
//
// This hook wraps settingsService calls and provides memoized filtering,
// statistics, and CRUD handlers so pages stay UI-only.

import { useMemo, useState, useCallback } from 'react'
import { settingsService } from '@/services/settings.service'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/hooks/use-toast'

// ─── useSettingsStats ──────────────────────────────────────────────────────────
// Dashboard stats for the settings module.
export function useSettingsStats() {
  const { data, isLoading } = useAsyncData(() => settingsService.getStats(), [])
  return { stats: data || {}, isLoading }
}

// ─── useGeneralSettings ────────────────────────────────────────────────────────
// General school info form (single object, no list).
export function useGeneralSettings() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getGeneralSettings(), [])

  const updateSettings = useCallback(async (payload) => {
    await settingsService.updateGeneralSettings(payload)
    toast({ title: 'Settings saved', description: 'General settings updated successfully' })
    refetch()
  }, [refetch, toast])

  return { settings: data || {}, isLoading, updateSettings }
}

// ─── useSessions ────────────────────────────────────────────────────────────────
// Session CRUD with search + status filter.
export function useSessions() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getSessions(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  // useMemo prevents recalculating filtered sessions
  // unless session list or filters change.
  const filtered = useMemo(() => rows.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.session_name.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const saveSession = useCallback(async (payload, id) => {
    if (id) {
      await settingsService.updateSession(id, payload)
      toast({ title: 'Session updated', description: payload.session_name })
    } else {
      await settingsService.createSession(payload)
      toast({ title: 'Session added', description: payload.session_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteSession = useCallback(async (id) => {
    await settingsService.deleteSession(id)
    toast({ title: 'Session deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    saveSession,
    deleteSession,
  }
}

// ─── useRolePermissions ────────────────────────────────────────────────────────
// Role permission CRUD with search.
export function useRolePermissions() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getRolePermissions(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(() => rows.filter((r) => {
    const q = search.toLowerCase()
    return !q || r.role_name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q)
  }), [rows, search])

  const saveRolePermission = useCallback(async (payload, id) => {
    if (id) {
      await settingsService.updateRolePermission(id, payload)
      toast({ title: 'Role updated', description: payload.role_name })
    } else {
      await settingsService.createRolePermission(payload)
      toast({ title: 'Role added', description: payload.role_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteRolePermission = useCallback(async (id) => {
    await settingsService.deleteRolePermission(id)
    toast({ title: 'Role deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    saveRolePermission,
    deleteRolePermission,
  }
}

// ─── useUsers ──────────────────────────────────────────────────────────────────
// User CRUD with search + status filter.
export function useUsers() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getUsers(), [])

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const rows = data || []

  const filtered = useMemo(() => rows.filter((u) => {
    const q = search.toLowerCase()
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchStatus
  }), [rows, search, statusFilter])

  const saveUser = useCallback(async (payload, id) => {
    if (id) {
      await settingsService.updateUser(id, payload)
      toast({ title: 'User updated', description: payload.name })
    } else {
      await settingsService.createUser(payload)
      toast({ title: 'User added', description: payload.name })
    }
    refetch()
  }, [refetch, toast])

  const deleteUser = useCallback(async (id) => {
    await settingsService.deleteUser(id)
    toast({ title: 'User deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    statusFilter, setStatusFilter,
    saveUser,
    deleteUser,
  }
}

// ─── useNotificationSettings ───────────────────────────────────────────────────
// Notification settings form (single object).
export function useNotificationSettings() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getNotificationSettings(), [])

  const updateSettings = useCallback(async (payload) => {
    await settingsService.updateNotificationSettings(payload)
    toast({ title: 'Settings saved', description: 'Notification preferences updated' })
    refetch()
  }, [refetch, toast])

  return { settings: data || {}, isLoading, updateSettings }
}

// ─── useSmsSettings ────────────────────────────────────────────────────────────
// SMS settings form (single object).
export function useSmsSettings() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getSmsSettings(), [])

  const updateSettings = useCallback(async (payload) => {
    await settingsService.updateSmsSettings(payload)
    toast({ title: 'Settings saved', description: 'SMS settings updated' })
    refetch()
  }, [refetch, toast])

  return { settings: data || {}, isLoading, updateSettings }
}

// ─── usePaymentSettings ─────────────────────────────────────────────────────────
// Payment settings form (single object).
export function usePaymentSettings() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getPaymentSettings(), [])

  const updateSettings = useCallback(async (payload) => {
    await settingsService.updatePaymentSettings(payload)
    toast({ title: 'Settings saved', description: 'Payment settings updated' })
    refetch()
  }, [refetch, toast])

  return { settings: data || {}, isLoading, updateSettings }
}

// ─── useCurrencies ──────────────────────────────────────────────────────────────
// Currency CRUD with search.
export function useCurrencies() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getCurrencies(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(() => rows.filter((c) => {
    const q = search.toLowerCase()
    return !q || c.currency_code.toLowerCase().includes(q) || c.currency_name.toLowerCase().includes(q)
  }), [rows, search])

  const saveCurrency = useCallback(async (payload, id) => {
    if (id) {
      await settingsService.updateCurrency(id, payload)
      toast({ title: 'Currency updated', description: payload.currency_code })
    } else {
      await settingsService.createCurrency(payload)
      toast({ title: 'Currency added', description: payload.currency_code })
    }
    refetch()
  }, [refetch, toast])

  const deleteCurrency = useCallback(async (id) => {
    await settingsService.deleteCurrency(id)
    toast({ title: 'Currency deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    saveCurrency,
    deleteCurrency,
  }
}

// ─── useLanguages ──────────────────────────────────────────────────────────────
// Language CRUD with search.
export function useLanguages() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getLanguages(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(() => rows.filter((l) => {
    const q = search.toLowerCase()
    return !q || l.language_name.toLowerCase().includes(q) || l.language_code.toLowerCase().includes(q)
  }), [rows, search])

  const saveLanguage = useCallback(async (payload, id) => {
    if (id) {
      await settingsService.updateLanguage(id, payload)
      toast({ title: 'Language updated', description: payload.language_name })
    } else {
      await settingsService.createLanguage(payload)
      toast({ title: 'Language added', description: payload.language_name })
    }
    refetch()
  }, [refetch, toast])

  const deleteLanguage = useCallback(async (id) => {
    await settingsService.deleteLanguage(id)
    toast({ title: 'Language deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    saveLanguage,
    deleteLanguage,
  }
}

// ─── useCaptchaSettings ─────────────────────────────────────────────────────────
// Captcha settings form (single object).
export function useCaptchaSettings() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getCaptchaSettings(), [])

  const updateSettings = useCallback(async (payload) => {
    await settingsService.updateCaptchaSettings(payload)
    toast({ title: 'Settings saved', description: 'Captcha settings updated' })
    refetch()
  }, [refetch, toast])

  return { settings: data || {}, isLoading, updateSettings }
}

// ─── useModules ─────────────────────────────────────────────────────────────────
// Module list with enable/disable toggle.
export function useModules() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getModules(), [])

  const toggleModule = useCallback(async (mod) => {
    await settingsService.updateModule(mod._id, { is_enabled: !mod.is_enabled })
    toast({ title: mod.is_enabled ? 'Module disabled' : 'Module enabled', description: mod.display_name })
    refetch()
  }, [refetch, toast])

  return { modules: data || [], isLoading, toggleModule }
}

// ─── useFrontCmsSettings ────────────────────────────────────────────────────────
// Front CMS settings form (single object).
export function useFrontCmsSettings() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getFrontCmsSettings(), [])

  const updateSettings = useCallback(async (payload) => {
    await settingsService.updateFrontCmsSettings(payload)
    toast({ title: 'Settings saved', description: 'Front CMS settings updated' })
    refetch()
  }, [refetch, toast])

  return { settings: data || {}, isLoading, updateSettings }
}

// ─── useCustomFields ─────────────────────────────────────────────────────────────
// Custom field CRUD with search + module filter.
export function useCustomFields() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getCustomFields(), [])

  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')

  const rows = data || []

  const filtered = useMemo(() => rows.filter((f) => {
    const q = search.toLowerCase()
    const matchSearch = !q || f.field_name.toLowerCase().includes(q) || f.field_label.toLowerCase().includes(q)
    const matchModule = moduleFilter === 'all' || f.module === moduleFilter
    return matchSearch && matchModule
  }), [rows, search, moduleFilter])

  const saveCustomField = useCallback(async (payload, id) => {
    if (id) {
      await settingsService.updateCustomField(id, payload)
      toast({ title: 'Field updated', description: payload.field_label })
    } else {
      await settingsService.createCustomField(payload)
      toast({ title: 'Field added', description: payload.field_label })
    }
    refetch()
  }, [refetch, toast])

  const deleteCustomField = useCallback(async (id) => {
    await settingsService.deleteCustomField(id)
    toast({ title: 'Field deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    moduleFilter, setModuleFilter,
    saveCustomField,
    deleteCustomField,
  }
}

// ─── useSystemFields ────────────────────────────────────────────────────────────
// System field list with search + update.
export function useSystemFields() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getSystemFields(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(() => rows.filter((f) => {
    const q = search.toLowerCase()
    return !q || f.field_name.toLowerCase().includes(q) || f.field_label.toLowerCase().includes(q) || f.module.toLowerCase().includes(q)
  }), [rows, search])

  const updateSystemField = useCallback(async (id, payload) => {
    await settingsService.updateSystemField(id, payload)
    toast({ title: 'Field updated' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    updateSystemField,
  }
}

// ─── useFileTypes ───────────────────────────────────────────────────────────────
// File type CRUD with search.
export function useFileTypes() {
  const { toast } = useToast()
  const { data, isLoading, refetch } = useAsyncData(() => settingsService.getFileTypes(), [])

  const [search, setSearch] = useState('')

  const rows = data || []

  const filtered = useMemo(() => rows.filter((f) => {
    const q = search.toLowerCase()
    return !q || f.extension.toLowerCase().includes(q) || f.mime_type.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  }), [rows, search])

  const saveFileType = useCallback(async (payload, id) => {
    if (id) {
      await settingsService.updateFileType(id, payload)
      toast({ title: 'File type updated', description: payload.extension })
    } else {
      await settingsService.createFileType(payload)
      toast({ title: 'File type added', description: payload.extension })
    }
    refetch()
  }, [refetch, toast])

  const deleteFileType = useCallback(async (id) => {
    await settingsService.deleteFileType(id)
    toast({ title: 'File type deleted' })
    refetch()
  }, [refetch, toast])

  return {
    rows: filtered,
    isLoading,
    search, setSearch,
    saveFileType,
    deleteFileType,
  }
}
