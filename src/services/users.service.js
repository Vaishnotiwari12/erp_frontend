// Users & roles service aligned with School_erp-b-main users.routes.js + users.controller.js.
// Backend endpoints:
//   POST /users/admin/signup   -> admin signup
//   POST /users/admin/login    -> admin login
//   POST /users/staff/signup   -> staff signup (tenant DB)
//   POST /users/staff/login     -> staff login (tenant DB)
//   POST /users/student/signup -> student signup (tenant DB)
//   POST /users/student/login   -> student login (tenant DB)
//   POST /users/parent/signup  -> parent signup (placeholder)
//   POST /users/parent/login   -> parent login (placeholder)
// Roles/permissions: /api/role-permission (settingRoutes/rolePermissionRoutes).
// Staff model (hrModel.js): employee_id, name, email, phone, department_id, designation_id, role, status.

import apiClient from './api'
import { mockResponse, users as mockUsers, roles as mockRoles } from './mockData'

export const usersService = {
  async list(params = {}) {
    // INTEGRATION: return apiClient.get('/users', { params }) — or aggregate admin + staff
    return mockResponse(mockUsers)
  },

  async get(id) {
    // INTEGRATION: return apiClient.get(`/users/${id}`)
    const found = mockUsers.find((u) => u._id === id)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'User not found' })
  },

  async create(payload) {
    // INTEGRATION: return apiClient.post('/users/admin/signup', payload)
    return mockResponse({ _id: `usr-${Date.now()}`, ...payload, status: 'active' })
  },

  async update(id, payload) {
    // INTEGRATION: return apiClient.put(`/users/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async remove(id) {
    // INTEGRATION: return apiClient.delete(`/users/${id}`)
    return mockResponse({ message: 'User deleted successfully' })
  },

  // Roles via /api/role-permission
  async roles(params = {}) {
    // INTEGRATION: return apiClient.get('/role-permission', { params })
    return mockResponse(mockRoles)
  },

  async updateRole(id, payload) {
    // INTEGRATION: return apiClient.put(`/role-permission/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },
}

export default usersService
