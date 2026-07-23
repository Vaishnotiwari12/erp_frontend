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
import { mockResponse, users as mockUsers, roles as mockRoles } from './mockData'

export const usersService = {
  // TODO(BACKEND)
  // Replace with GET /users
  async list(params = {}) {
    return mockResponse(mockUsers)
  },

  // TODO(BACKEND)
  // Replace with GET /users/:id
  async get(id) {
    const found = mockUsers.find((u) => u._id === id)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'User not found' })
  },

  // TODO(BACKEND)
  // Replace with POST /users/admin/signup
  async create(payload) {
    return mockResponse({ _id: `usr-${Date.now()}`, ...payload, status: 'active' })
  },

  // TODO(BACKEND)
  // Replace with PUT /users/:id
  async update(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /users/:id
  async remove(id) {
    return mockResponse({ message: 'User deleted successfully' })
  },

  // Roles via /api/role-permission
  // TODO(BACKEND)
  // Replace with GET /role-permission
  async roles(params = {}) {
    return mockResponse(mockRoles)
  },

  // TODO(BACKEND)
  // Replace with PUT /role-permission/:id
  async updateRole(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },
}

export default usersService
