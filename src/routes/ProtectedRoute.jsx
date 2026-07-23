// ====================================================================
// ProtectedRoute — Auth Guard for Protected Pages
//
// Purpose:
// Wraps any route that requires an authenticated session. If the user is
// not logged in, they are redirected to /login with the attempted location
// preserved in `state.from` so the login page can redirect back after success.
//
// Role-based access:
// This component currently checks authentication only. Role-based gating
// (e.g. restricting /users to admins) is handled at the page level via the
// user's role from AuthContext. Extend this guard with an `allowedRoles`
// prop to centralize role checks if needed.
// ====================================================================

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Guards routes that require an authenticated session.
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default ProtectedRoute
