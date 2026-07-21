// Centralized Axios instance aligned with the School_erp-b-main backend.
// INTEGRATION: set VITE_API_BASE_URL in .env to point at the Express backend.
// The backend mounts everything under /api and uses httpOnly cookie + JWT.

import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send httpOnly auth cookies
})

// Request interceptor — attach JWT from localStorage as fallback to cookies.
apiClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('scholaria.auth')
    if (raw) {
      try {
        const { token } = JSON.parse(raw)
        if (token) config.headers.Authorization = `Bearer ${token}`
      } catch {
        /* ignore malformed storage */
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor — unwrap { success, data, message } envelope.
apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data
    // Backend returns { success, data, message?, count? }. Unwrap data on success.
    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (!payload.success) {
        return Promise.reject({
          message: payload.message || 'Request failed',
          status: response.status,
        })
      }
      return payload.data !== undefined ? payload.data : payload
    }
    return payload
  },
  (error) => {
    const normalized = {
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Unexpected error occurred',
      status: error?.response?.status || 0,
      data: error?.response?.data || null,
    }
    // Auto-clear session on auth rejection.
    if (normalized.status === 401) {
      localStorage.removeItem('scholaria.auth')
    }
    return Promise.reject(normalized)
  },
)

export default apiClient
