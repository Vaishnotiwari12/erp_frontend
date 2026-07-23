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
import { students as mockStudents, admissions as mockAdmissions, studentCategories, studentHouses } from '@/data/students.mock'

export const studentService = {
  // TODO(BACKEND)
  // Replace with GET /student/details
  async list(params = {}) {
    return mockResponse(mockStudents)
  },

  // TODO(BACKEND)
  // Replace with GET /student/details/:id
  async get(id) {
    const found = mockStudents.find((s) => s._id === id)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'Student not found' })
  },

  // TODO(BACKEND)
  // Replace with POST /student/details
  async create(payload) {
    return mockResponse({ _id: `stu-${Date.now()}`, ...payload, status: 'active' })
  },

  // TODO(BACKEND)
  // Replace with PUT /student/details/:id
  async update(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /student/details/:id
  async remove(id) {
    return mockResponse({ message: 'Student deleted successfully' })
  },

  // TODO(BACKEND)
  // Replace with POST /student/bulk-delete
  async bulkDelete(ids) {
    return mockResponse({ message: `${ids.length} students deleted` })
  },

  // TODO(BACKEND)
  // Replace with GET /student/disabled
  async disabled(params = {}) {
    return mockResponse(mockStudents.filter((s) => s.status === 'disabled' || s.status === 'inactive'))
  },

  // TODO(BACKEND)
  // Replace with GET /student/online-admission
  async admissions(params = {}) {
    return mockResponse(mockAdmissions)
  },

  // TODO(BACKEND)
  // Replace with GET /student/category
  async categories(params = {}) {
    return mockResponse(studentCategories)
  },

  // TODO(BACKEND)
  // Replace with GET /student/house
  async houses(params = {}) {
    return mockResponse(studentHouses)
  },
}

export default studentService
