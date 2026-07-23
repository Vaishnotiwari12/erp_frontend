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
import { mockResponse, domains as mockDomains } from './mockData'

export const domainService = {
  // TODO(BACKEND)
  // Replace with GET /schools
  async list(params = {}) {
    return mockResponse(mockDomains)
  },

  // TODO(BACKEND)
  // Replace with POST /schools
  async create(payload) {
    return mockResponse({ _id: `dom-${Date.now()}`, ...payload, status: 'active', verified: false, ssl: 'Pending' })
  },

  // TODO(BACKEND)
  // Replace with PATCH /domains/:id/verify
  async verify(id) {
    return mockResponse({ _id: id, verified: true, ssl: 'Active', status: 'active' })
  },

  // TODO(BACKEND)
  // Replace with DELETE /schools/:id
  async remove(id) {
    return mockResponse({ message: 'Domain removed successfully' })
  },
}

export default domainService
