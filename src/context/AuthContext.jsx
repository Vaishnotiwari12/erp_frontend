// ====================================================================
// AuthContext — Authentication + Tenant State
//
// Purpose:
// Provides the authenticated user session and tenant (school) info
// to the entire app via React Context.
//
// State stored:
//   - session: { token, user: { id, name, email, role } }
//   - tenant: { school_name, logo, theme } from /api/settings
//   - isLoading: true during login API call
//
// Consumed by:
//   - ProtectedRoute / PublicRoute (route guards)
//   - Navbar (user menu, role display)
//   - Sidebar (tenant logo + name display, role-based menu filtering)
// ====================================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '@/services/auth.service'
import { settingsService } from '@/services/settings.service'
import { STORAGE_KEYS } from '@/constants/navigation'

const AuthContext = createContext(null)

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function readStoredTenant() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TENANT)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession())
  const [tenant, setTenant] = useState(() => readStoredTenant())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH)
    }
  }, [session])

  useEffect(() => {
    if (tenant) {
      localStorage.setItem(STORAGE_KEYS.TENANT, JSON.stringify(tenant))
    } else {
      localStorage.removeItem(STORAGE_KEYS.TENANT)
    }
  }, [tenant])

  // Fetch tenant settings (school_name, logo) after login.
  const fetchTenant = useCallback(async (token) => {
    try {
      const settings = await settingsService.getGeneralSettings()
      if (settings) {
        setTenant({
          school_name: settings.school_name || '',
          logo: settings.logo || '',
          theme: settings.theme || '',
        })
      }
    } catch {
      // Settings may not be configured yet — tenant stays empty.
    }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true)
    try {
      const data = await authService.login({ email, password })
      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }
      setSession({ token: data.token, user })
      await fetchTenant(data.token)
      return { token: data.token, user }
    } finally {
      setIsLoading(false)
    }
  }, [fetchTenant])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Ignore — clear local state regardless.
    }
    setSession(null)
    setTenant(null)
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session),
      isLoading,
      tenant,
      login,
      logout,
    }),
    [session, tenant, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
