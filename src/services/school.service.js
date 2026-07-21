// Schools service aligned with School_erp-b-main school.routes.js + school.controller.js.
// Backend endpoints (mounted at /api, require superadmin):
//   GET    /api/schools            -> { success, count, data: School[] }
//   GET    /api/schools/:id        -> { success, data: School }
//   GET    /api/schools/:id/stats  -> { success, data: { school_name, domain, status, total_students, total_staff } }
//   POST   /api/schools            -> { success, data: School }  (body: school_name, domain[, db_name])
//   PUT    /api/schools/:id        -> { success, data: School }
//   DELETE /api/schools/:id        -> { success, message }
// Model fields: school_name, domain, mongo_uri, status, createdAt, updatedAt.

import apiClient from './api'
import { mockResponse, schools as mockSchools } from './mockData'

export const schoolService = {
  async list(params = {}) {
    // INTEGRATION: return apiClient.get('/schools', { params })
    return mockResponse(mockSchools)
  },

  async get(id) {
    // INTEGRATION: return apiClient.get(`/schools/${id}`)
    const found = mockSchools.find((s) => s._id === id)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'School not found' })
  },

  async getStats(id) {
    // INTEGRATION: return apiClient.get(`/schools/${id}/stats`)
    const found = mockSchools.find((s) => s._id === id) || mockSchools[0]
    return mockResponse({
      school_name: found.school_name,
      domain: found.domain,
      status: found.status,
      total_students: 1240,
      total_staff: 86,
    })
  },

  async create(payload) {
    // INTEGRATION: return apiClient.post('/schools', payload)
    return mockResponse({ _id: `sch-${Date.now()}`, ...payload, status: 'active' })
  },

  async update(id, payload) {
    // INTEGRATION: return apiClient.put(`/schools/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async remove(id) {
    // INTEGRATION: return apiClient.delete(`/schools/${id}`)
    return mockResponse({ message: 'School deleted successfully' })
  },
}

export default schoolService
