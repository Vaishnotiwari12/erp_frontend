import { Outlet } from 'react-router-dom'

// Minimal layout for public/unauthenticated routes (placeholder).
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}

export default PublicLayout
