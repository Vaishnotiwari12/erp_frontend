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
import { mockResponse, colleges as mockColleges } from './mockData'

export const collegeService = {
  // TODO(BACKEND)
  // Replace with GET /college/colleges
  async list(params = {}) {
    return mockResponse(mockColleges)
  },

  // TODO(BACKEND)
  // Replace with GET /college/colleges/:id
  async get(id) {
    const found = mockColleges.find((c) => c._id === id)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'College not found' })
  },

  // TODO(BACKEND)
  // Replace with GET /college/colleges/code/:code
  async getByCode(code) {
    const found = mockColleges.find((c) => c.college_code === code)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'College not found' })
  },

  // TODO(BACKEND)
  // Replace with POST /college/colleges
  async create(payload) {
    return mockResponse({ _id: `col-${Date.now()}`, ...payload, status: 'active' })
  },

  // TODO(BACKEND)
  // Replace with PUT /college/colleges/:id
  async update(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /college/colleges/:id
  async remove(id) {
    return mockResponse({ message: 'College deleted successfully' })
  },
}

export default collegeService
