// Authentication service aligned with School_erp-b-main authController.js.
// Backend endpoints (mounted at /api/auth):
//   POST /api/auth/signup  -> { id, name, email, role: 'superadmin', token }
//   POST /api/auth/login   -> { id, name, email, role: 'superadmin', token }
//   POST /api/auth/logout  -> { message: 'Logged out' }
// The backend also sets an httpOnly cookie; the token in the body is a fallback.
// Users controller (/users) exposes admin/staff/student/parent signup+login.

import apiClient from './api'
import { mockResponse } from './mockData'

const DEMO_USER = {
  id: 'usr-001',
  name: 'Alex Morgan',
  email: 'alex@scholaria.io',
  role: 'superadmin',
  avatar: null,
  school_name: 'Scholaria Platform',
}

export const authService = {
  // Dev login accepts any credentials and returns a demo session.
  // INTEGRATION: return apiClient.post('/auth/login', { email, password })
  async login({ email, password }) {
    if (!email || !password) {
      return Promise.reject({ message: 'Email and password are required.' })
    }
    const user = { ...DEMO_USER, email: email || DEMO_USER.email }
    const token = `dev.${btoa(user.email)}.${Date.now()}`
    return mockResponse({ id: user.id, name: user.name, email: user.email, role: user.role, token })
  },

  // INTEGRATION: return apiClient.post('/auth/signup', { name, email, password })
  async signup({ name, email, password }) {
    if (!name || !email || !password) {
      return Promise.reject({ message: 'Name, email and password are required.' })
    }
    const user = { ...DEMO_USER, name, email }
    const token = `dev.${btoa(user.email)}.${Date.now()}`
    return mockResponse({ id: user.id, name: user.name, email: user.email, role: user.role, token })
  },

  // INTEGRATION: return apiClient.post('/auth/logout')
  async logout() {
    return mockResponse({ message: 'Logged out' })
  },
}

export default authService
