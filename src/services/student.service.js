// Students service aligned with School_erp-b-main student.routes.js + studentInformationRoutes.
// Backend endpoints (mounted at /api, tenant-resolved):
//   GET    /api/student/details          -> { success, data: Student[] }  (studentInformationRoutes/studentRoutes)
//   GET    /api/student/details/:id      -> { success, data: Student }
//   POST   /api/student/details          -> { success, data: Student }
//   PUT    /api/student/details/:id      -> { success, data: Student }
//   DELETE /api/student/details/:id      -> { success, message }
//   POST   /api/student/bulk-delete      -> bulk delete
//   GET    /api/student/disabled         -> disabled students
//   GET    /api/student/online-admission -> online admission applications
//   GET    /api/student/category        -> student categories
//   GET    /api/student/house           -> student houses
// Model fields (studentInformationModels): name { first, last }, email, mobile, admission_no, class, section, status, guardian_name, admission_date.

import apiClient from './api'
import { mockResponse, students as mockStudents, admissions as mockAdmissions, studentCategories, studentHouses } from './mockData'

export const studentService = {
  async list(params = {}) {
    // INTEGRATION: return apiClient.get('/student/details', { params })
    return mockResponse(mockStudents)
  },

  async get(id) {
    // INTEGRATION: return apiClient.get(`/student/details/${id}`)
    const found = mockStudents.find((s) => s._id === id)
    return found
      ? mockResponse(found)
      : Promise.reject({ message: 'Student not found' })
  },

  async create(payload) {
    // INTEGRATION: return apiClient.post('/student/details', payload)
    return mockResponse({ _id: `stu-${Date.now()}`, ...payload, status: 'active' })
  },

  async update(id, payload) {
    // INTEGRATION: return apiClient.put(`/student/details/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async remove(id) {
    // INTEGRATION: return apiClient.delete(`/student/details/${id}`)
    return mockResponse({ message: 'Student deleted successfully' })
  },

  async bulkDelete(ids) {
    // INTEGRATION: return apiClient.post('/student/bulk-delete', { ids })
    return mockResponse({ message: `${ids.length} students deleted` })
  },

  async disabled(params = {}) {
    // INTEGRATION: return apiClient.get('/student/disabled', { params })
    return mockResponse(mockStudents.filter((s) => s.status === 'disabled' || s.status === 'inactive'))
  },

  async admissions(params = {}) {
    // INTEGRATION: return apiClient.get('/student/online-admission', { params })
    return mockResponse(mockAdmissions)
  },

  async categories(params = {}) {
    // INTEGRATION: return apiClient.get('/student/category', { params })
    return mockResponse(studentCategories)
  },

  async houses(params = {}) {
    // INTEGRATION: return apiClient.get('/student/house', { params })
    return mockResponse(studentHouses)
  },
}

export default studentService
