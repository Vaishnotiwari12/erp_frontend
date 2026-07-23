// ====================================================================
// AuthContext — Authentication State
//
// Purpose:
// Provides the authenticated user session to the entire app via React
// Context so any component can read the current user/role without prop-drilling.
//
// State stored:
//   - session: { token, user: { id, name, email, role } }
//   - isLoading: true during login API call
//
// Consumed by:
//   - ProtectedRoute / PublicRoute (route guards)
//   - Navbar (user menu, role display)
//   - Sidebar (role-based menu filtering)
//   - Any page that needs the current user's role for conditional rendering
//
// INTEGRATION: swap the dev login/logout for real JWT calls in auth.service.js.
// The backend returns { id, name, email, role, token }; we store that as the session.
// ====================================================================

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '@/services/auth.service'
import { STORAGE_KEYS } from '@/constants/navigation'

// Single context instance — created once at module scope so consumers share the same provider.
const AuthContext = createContext(null)

// Reads the persisted session from localStorage on initial mount so a page refresh keeps the user logged in.
function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  // The session object (token + user) or null when logged out.
  const [session, setSession] = useState(() => readStoredSession())
  // True only while the login request is in-flight; used to disable the submit button.
  const [isLoading, setIsLoading] = useState(false)

  // Persist the session to localStorage on every change so refreshes don't lose auth state.
  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH)
    }
  }, [session])

  // Calls authService.login, normalizes the response into { token, user }, and stores it.
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

  // Clears the session and notifies the backend to invalidate the token.
  const logout = useCallback(async () => {
    await authService.logout()
    setSession(null)
  }, [])

  // Memoized value so consumers only re-render when session/loading actually change.
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

// Convenience hook — throws if used outside AuthProvider to catch wiring mistakes early.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
