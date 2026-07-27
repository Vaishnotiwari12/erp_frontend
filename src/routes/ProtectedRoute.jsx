// ====================================================================
// ProtectedRoute — Auth + Module + Role Guard
//
// Purpose:
// Wraps any route that requires an authenticated session. If the user
// is not logged in, redirects to /login. Also blocks access to routes
// whose module has been disabled by the super admin or whose role
// permissions deny access.
// ====================================================================

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useModules } from '@/context/ModuleContext'

const SECTION_TO_MODULE = {
  dashboard: 'Dashboard',
  students: 'Students',
  academics: 'Academics',
  attendance: 'Attendance',
  examinations: 'Examinations',
  fees: 'Fees',
  hr: 'HR',
  library: 'Library',
  transport: 'Transport',
  hostel: 'Hostel',
  inventory: 'Inventory',
  'front-office': 'Front Office',
  certificate: 'Certificate',
  'front-cms': 'Front CMS',
  'settings-module': 'Settings',
  users: 'Users',
  schools: 'Schools',
  domains: 'Domains',
}

export function ProtectedRoute({ children, moduleId }) {
  const { isAuthenticated } = useAuth()
  const { isModuleEnabled, hasPermission, isLoading } = useModules()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // While modules are loading, allow access to avoid flicker.
  if (isLoading) return children

  // Block access to disabled modules.
  if (moduleId && !isModuleEnabled(moduleId)) {
    return <Navigate to="/dashboard" replace />
  }

  // Block access if role permissions deny it.
  if (moduleId && !hasPermission(moduleId, 'view')) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
