// ====================================================================
// Student Service
//
// Backend Integrated
//
// All Student Information APIs are centralized here.
// Components should never call Axios directly.
// ====================================================================

import apiClient from './api'

export const studentService = {
  // ==========================================================
  // Student Details
  // ==========================================================

  async list(params = {}) {
    return apiClient.get('/student/details', {
      params,
    })
  },

  async get(id) {
    return apiClient.get(`/student/details/${id}`)
  },

  async create(payload) {
    return apiClient.post('/student/details', payload)
  },

  async update(id, payload) {
    return apiClient.put(`/student/details/${id}`, payload)
  },

  async remove(id) {
    return apiClient.delete(`/student/details/${id}`)
  },

  // ==========================================================
  // Bulk Delete
  // ==========================================================

  async bulkDelete(ids) {
    return apiClient.post('/student/bulk-delete/students', {
      ids,
    })
  },

  // ==========================================================
  // Disabled Students
  // ==========================================================

  async disabled(params = {}) {
    return apiClient.get('/student/disabled', {
      params,
    })
  },

  // ==========================================================
  // Online Admissions
  // ==========================================================

  async admissions(params = {}) {
    return apiClient.get('/student/online-admission/all', {
      params,
    })
  },

  async getAdmission(id) {
    return apiClient.get(`/student/online-admission/${id}`)
  },

  async createAdmission(payload) {
    return apiClient.post('/student/online-admission/add', payload)
  },

  async updateAdmission(id, payload) {
    return apiClient.put(`/student/online-admission/${id}`, payload)
  },

  async deleteAdmission(id) {
    return apiClient.delete(`/student/online-admission/${id}`)
  },

  // ==========================================================
  // Student Categories
  // ==========================================================

  async categories(params = {}) {
    return apiClient.get('/student/category', {
      params,
    })
  },

  async getCategory(id) {
    return apiClient.get(`/student/category/${id}`)
  },

  async createCategory(payload) {
    return apiClient.post('/student/category', payload)
  },

  async updateCategory(id, payload) {
    return apiClient.put(`/student/category/${id}`, payload)
  },

  async deleteCategory(id) {
    return apiClient.delete(`/student/category/${id}`)
  },

  // ==========================================================
  // Student Houses
  // ==========================================================

  async houses(params = {}) {
    return apiClient.get('/student/house', {
      params,
    })
  },

  async getHouse(id) {
    return apiClient.get(`/student/house/${id}`)
  },

  async createHouse(payload) {
    return apiClient.post('/student/house', payload)
  },

  async updateHouse(id, payload) {
    return apiClient.put(`/student/house/${id}`, payload)
  },

  async deleteHouse(id) {
    return apiClient.delete(`/student/house/${id}`)
  },

  // ==========================================================
  // Disable Reasons
  // ==========================================================

  async disableReasons(params = {}) {
    return apiClient.get('/student/disable-reason', {
      params,
    })
  },

  async getDisableReason(id) {
    return apiClient.get(`/student/disable-reason/${id}`)
  },

  async createDisableReason(payload) {
    return apiClient.post('/student/disable-reason', payload)
  },

  async updateDisableReason(id, payload) {
    return apiClient.put(`/student/disable-reason/${id}`, payload)
  },

  async deleteDisableReason(id) {
    return apiClient.delete(`/student/disable-reason/${id}`)
  },

  // ==========================================================
  // Multi Class Students
  // ==========================================================

  async multiClassStudents(params = {}) {
    return apiClient.get('/student/multi-class', {
      params,
    })
  },

  async getMultiClassStudent(id) {
    return apiClient.get(`/student/multi-class/${id}`)
  },

  async createMultiClassStudent(payload) {
    return apiClient.post('/student/multi-class', payload)
  },

  async updateMultiClassStudent(id, payload) {
    return apiClient.put(`/student/multi-class/${id}`, payload)
  },

  async deleteMultiClassStudent(id) {
    return apiClient.delete(`/student/multi-class/${id}`)
  },
}

export default studentService