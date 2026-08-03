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






//mock data

// export const authService = {
//   async login({ email, password }) {
//     if (!email || !password) {
//       return Promise.reject({ message: 'Email and password are required.' })
//     }
//     // Mock response - replace with actual API call later
//     return Promise.resolve({
//       success: true,
//       data: {
//         id: '64dcb488ec4e893925e16752',
//         name: 'Super Admin',
//         email: 'superadmin@erp.com',
//         role: 'superadmin',
//         token: 'dummy-jwt-token'
//       }
//     })
//   },

//   async signup({ name, email, password }) {
//     if (!name || !email || !password) {
//       return Promise.reject({ message: 'Name, email and password are required.' })
//     }
//     // Mock response - replace with actual API call later
//     return Promise.resolve({
//       success: true,
//       data: {
//         id: '64dcb488ec4e893925e16753',
//         name,
//         email,
//         role: 'superadmin',
//         token: 'dummy-jwt-token'
//       }
//     })
//   },

//   async logout() {
//     // Mock response - replace with actual API call later
//     return Promise.resolve({
//       success: true,
//       message: 'Logged out successfully'
//     })
//   },
// }

// export default authService
