// ====================================================================
// Centralized Axios instance aligned with the School_erp-b-main backend.
//
// Purpose:
// - Handles all API requests
// - Automatically attaches JWT token
// - Sends httpOnly cookies
// - Unwraps backend response
// - Handles authentication errors globally
//
// Backend Response Format:
// {
//   success: true,
//   message: "...",
//   data: {...}
// }
// ====================================================================

import axios from 'axios'
import { STORAGE_KEYS } from '../constants/navigation'

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// ====================================================================
// Request Interceptor
// Attach JWT token from localStorage (fallback to cookies)
// ====================================================================

apiClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH)

    if (raw) {
      try {
        const { token } = JSON.parse(raw)

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (err) {
        console.error('Invalid auth data in localStorage:', err)
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

// ====================================================================
// Response Interceptor
// Unwrap backend response:
// {
//    success,
//    message,
//    data
// }
// ====================================================================

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data

    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (!payload.success) {
        return Promise.reject({
          message: payload.message || 'Request failed',
          status: response.status,
          data: payload,
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

    // Clear session if backend says Unauthorized
    if (normalized.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH)
      localStorage.removeItem(STORAGE_KEYS.TENANT)
    }

    return Promise.reject(normalized)
  },
)

export default apiClient


