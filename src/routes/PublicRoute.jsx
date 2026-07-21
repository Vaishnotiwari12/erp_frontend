import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Redirects authenticated users away from auth screens (e.g. login).
export function PublicRoute({ children, redirectTo = '/dashboard' }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to={redirectTo} replace />
  return children
}

export default PublicRoute
