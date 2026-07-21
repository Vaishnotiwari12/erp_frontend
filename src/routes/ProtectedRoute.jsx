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
