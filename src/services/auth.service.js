// ====================================================================
// Service Layer
//
// Purpose:
// Handles all backend communication for this module.
//
// Current State:
// Uses mock data.
//
// TODO(BACKEND):
// Replace mock implementation with Axios API calls.
//
// Expected Response:
// { success, message, data }
// ====================================================================

import apiClient from './api'
import { mockResponse } from './mockData'
import { DEMO_USER } from '@/data/auth.mock'

export const authService = {
  // Dev login accepts any credentials and returns a demo session.
  // TODO(BACKEND)
  // Replace with POST /auth/login
  async login({ email, password }) {
    if (!email || !password) {
      return Promise.reject({ message: 'Email and password are required.' })
    }
    const user = { ...DEMO_USER, email: email || DEMO_USER.email }
    const token = `dev.${btoa(user.email)}.${Date.now()}`
    return mockResponse({ id: user.id, name: user.name, email: user.email, role: user.role, token })
  },

  // TODO(BACKEND)
  // Replace with POST /auth/signup
  async signup({ name, email, password }) {
    if (!name || !email || !password) {
      return Promise.reject({ message: 'Name, email and password are required.' })
    }
    const user = { ...DEMO_USER, name, email }
    const token = `dev.${btoa(user.email)}.${Date.now()}`
    return mockResponse({ id: user.id, name: user.name, email: user.email, role: user.role, token })
  },

  // TODO(BACKEND)
  // Replace with POST /auth/logout
  async logout() {
    return mockResponse({ message: 'Logged out' })
  },
}

export default authService
