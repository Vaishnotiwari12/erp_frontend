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
import { mockResponse, schools as mockSchools } from './mockData'

export const schoolService = {
  // TODO(BACKEND)
  // Replace with GET /schools
  async list(params = {}) {
    return mockResponse(mockSchools)
  },

  // TODO(BACKEND)
  // Replace with GET /schools/:id
  async get(id) {
    const found = mockSchools.find((s) => s._id === id)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'School not found' })
  },

  // TODO(BACKEND)
  // Replace with GET /schools/:id/stats
  async getStats(id) {
    const found = mockSchools.find((s) => s._id === id) || mockSchools[0]
    return mockResponse({
      school_name: found.school_name,
      domain: found.domain,
      status: found.status,
      total_students: 1240,
      total_staff: 86,
    })
  },

  // TODO(BACKEND)
  // Replace with POST /schools
  async create(payload) {
    return mockResponse({ _id: `sch-${Date.now()}`, ...payload, status: 'active' })
  },

  // TODO(BACKEND)
  // Replace with PUT /schools/:id
  async update(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /schools/:id
  async remove(id) {
    return mockResponse({ message: 'School deleted successfully' })
  },
}

export default schoolService
