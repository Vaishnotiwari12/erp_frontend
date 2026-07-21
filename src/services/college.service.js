// Colleges service aligned with School_erp-b-main college.routes.js + college.controller.js.
// Backend endpoints (mounted at /api/college, tenant-resolved):
//   GET    /api/college/colleges          -> { success, data: College[] }
//   GET    /api/college/colleges/:id      -> { success, data: College }
//   GET    /api/college/colleges/code/:code -> { success, data: College }
//   POST   /api/college/colleges          -> { success, data: College }
//   PUT    /api/college/colleges/:id      -> { success, data: College }
//   DELETE /api/college/colleges/:id      -> { success, message }
// Model fields: college_name, college_code, type, status, address, phone, email, createdAt.

import apiClient from './api'
import { mockResponse, colleges as mockColleges } from './mockData'

export const collegeService = {
  async list(params = {}) {
    // INTEGRATION: return apiClient.get('/college/colleges', { params })
    return mockResponse(mockColleges)
  },

  async get(id) {
    // INTEGRATION: return apiClient.get(`/college/colleges/${id}`)
    const found = mockColleges.find((c) => c._id === id)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'College not found' })
  },

  async getByCode(code) {
    // INTEGRATION: return apiClient.get(`/college/colleges/code/${code}`)
    const found = mockColleges.find((c) => c.college_code === code)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'College not found' })
  },

  async create(payload) {
    // INTEGRATION: return apiClient.post('/college/colleges', payload)
    return mockResponse({ _id: `col-${Date.now()}`, ...payload, status: 'active' })
  },

  async update(id, payload) {
    // INTEGRATION: return apiClient.put(`/college/colleges/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async remove(id) {
    // INTEGRATION: return apiClient.delete(`/college/colleges/${id}`)
    return mockResponse({ message: 'College deleted successfully' })
  },
}

export default collegeService
