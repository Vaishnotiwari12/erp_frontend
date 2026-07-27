// ====================================================================
// Auth Service
//
// Handles all backend communication for authentication.
//
// Backend routes (mounted under /api/auth):
//   POST /api/auth/signup  — Superadmin registration
//   POST /api/auth/login   — Superadmin login (returns JWT + user)
//   POST /api/auth/logout  — Invalidates session (requires auth)
//
// Response: { success, data: { id, name, email, role, token }, message }
// The apiClient interceptor unwraps `.data` so methods receive it directly.
// ====================================================================

import apiClient from './api'

export const authService = {
  async login({ email, password }) {
    if (!email || !password) {
      return Promise.reject({ message: 'Email and password are required.' })
    }
    return apiClient.post('/auth/login', { email, password })
  },

  async signup({ name, email, password }) {
    if (!name || !email || !password) {
      return Promise.reject({ message: 'Name, email and password are required.' })
    }
    return apiClient.post('/auth/signup', { name, email, password })
  },

  async logout() {
    return apiClient.post('/auth/logout')
  },
}

export default authService
