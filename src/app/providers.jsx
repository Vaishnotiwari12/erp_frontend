// ====================================================================
// Providers — Global Context Composition
//
// Purpose:
// Wraps the entire app in all required Context providers in the correct
// nesting order so every component has access to shared state.
//
// Provider order matters:
//   ThemeProvider (outermost) — must be available to AuthProvider UI and
//   every downstream component.
//   AuthProvider (inner) — depends on theme for its login form styling.
//
// Adding a new global provider (e.g. QueryClientProvider) belongs here so
// the rest of the app stays unaware of the provider tree.
// ====================================================================

import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  )
}

export default Providers
