// ====================================================================
// Attendance Service
//
// Handles all backend communication for Attendance Module.
//
// Backend Endpoints:
//   /api/attendance/student
//   /api/attendance/by-date
//   /api/attendance/approve-leave
//
// Response Format:
// {
//   success,
//   message,
//   data,
//   pagination
// }
// ====================================================================

import apiClient from './api'

export const attendanceService = {
  // ==========================================================
  // Student Attendance
  // ==========================================================

  async list(params = {}) {
    return apiClient.get('/attendance/student', {
      params,
    })
  },

  async get(id) {
    return apiClient.get(`/attendance/student/${id}`)
  },

  async create(payload) {
    return apiClient.post('/attendance/student', payload)
  },

  async update(id, payload) {
    return apiClient.put(`/attendance/student/${id}`, payload)
  },

  async remove(id) {
    return apiClient.delete(`/attendance/student/${id}`)
  },

  // ==========================================================
  // Attendance By Date
  // Backend expects:
  // {
  //   attendanceDate: "2026-07-28"
  // }
  //
  // Optional Query Params:
  // page
  // limit
  // ==========================================================

  async byDate(payload, params = {}) {
    return apiClient.post('/attendance/by-date', payload, {
      params,
    })
  },

  // ==========================================================
  // Leave Approval
  // ==========================================================

  async getLeaves(params = {}) {
    return apiClient.get('/attendance/approve-leave', {
      params,
    })
  },

  async getLeave(id) {
    return apiClient.get(`/attendance/approve-leave/${id}`)
  },

  async createLeave(payload) {
    return apiClient.post('/attendance/approve-leave', payload)
  },

  async updateLeave(id, payload) {
    return apiClient.put(`/attendance/approve-leave/${id}`, payload)
  },

  async deleteLeave(id) {
    return apiClient.delete(`/attendance/approve-leave/${id}`)
  },
}

export default attendanceService