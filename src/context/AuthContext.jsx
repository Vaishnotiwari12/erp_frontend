// AuthContext — temporary development authentication.
// INTEGRATION: swap the dev login/logout for real JWT calls in auth.service.js.
// The backend returns { id, name, email, role, token }; we store that as the session.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '@/services/auth.service'
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

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH)
    }
  }, [session])

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true)
    try {
      const res = await authService.login({ email, password })
      // Unwrap the { success, data, message } envelope returned by services.
      const data = res?.data !== undefined ? res.data : res
      // Backend returns { id, name, email, role, token }.
      const user = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }
      setSession({ token: data.token, user })
      return { token: data.token, user }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session),
      isLoading,
      login,
      logout,
    }),
    [session, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
