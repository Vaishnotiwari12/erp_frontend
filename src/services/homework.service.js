// ====================================================================
// Homework Service
//
// Service layer isolates all backend communication for the Homework module.
// Pages never call APIs directly — they call these methods, which return
// the standard envelope: { success, message, data }.
//
// Currently uses mock data. When the backend is ready, replace each
// mockResponse() call with the corresponding Axios API call. The UI
// does not need to change because the return shape stays the same.
// ====================================================================
// BACKEND INTEGRATION
// Replace this mock implementation with Axios API call.
// UI components should never call APIs directly.
// Only modify this service when backend APIs become available.
// ====================================================================

import { mockResponse } from './mockData'
import {
  homeworks,
  dailyAssignments,
  homeworkStats,
  academicClasses,
  subjects,
  teachers,
} from '@/data/homework.mock'

export const homeworkService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Homework Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /homework/stats
    // ====================================================================
    return mockResponse(homeworkStats)
  },

  // ─── Homework ────────────────────────────────────────────────────────────────

  // Fetch Homework List
  // TODO(BACKEND):
  // Replace mock data with GET /homework
  async getHomeworks() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /homework
    // ====================================================================
    return mockResponse(homeworks)
  },

  // Create Homework
  // TODO(BACKEND):
  // Replace with POST /homework
  async createHomework(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /homework
    // ====================================================================
    return mockResponse({ _id: `hw-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Homework
  // TODO(BACKEND):
  // Replace with PUT /homework/:id
  async updateHomework(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /homework/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Homework
  // TODO(BACKEND):
  // Replace with DELETE /homework/:id
  async deleteHomework(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /homework/:id
    // ====================================================================
    return mockResponse({ message: 'Homework deleted successfully' })
  },

  // ─── Daily Assignments ───────────────────────────────────────────────────────

  // Fetch Daily Assignments
  // TODO(BACKEND):
  // Replace mock data with GET /homework/daily-assignments
  async getDailyAssignments() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /homework/daily-assignments
    // ====================================================================
    return mockResponse(dailyAssignments)
  },

  // Create Daily Assignment
  // TODO(BACKEND):
  // Replace with POST /homework/daily-assignments
  async createDailyAssignment(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /homework/daily-assignments
    // ====================================================================
    return mockResponse({ _id: `da-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Daily Assignment
  // TODO(BACKEND):
  // Replace with PUT /homework/daily-assignments/:id
  async updateDailyAssignment(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /homework/daily-assignments/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Daily Assignment
  // TODO(BACKEND):
  // Replace with DELETE /homework/daily-assignments/:id
  async deleteDailyAssignment(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /homework/daily-assignments/:id
    // ====================================================================
    return mockResponse({ message: 'Daily assignment deleted successfully' })
  },

  // ─── Reference Data (dropdown options) ──────────────────────────────────────

  // Fetch Classes for dropdowns
  // TODO(BACKEND):
  // Replace with GET /academics/classes
  async getClasses() {
    return mockResponse(academicClasses)
  },

  // Fetch Subjects for dropdowns
  // TODO(BACKEND):
  // Replace with GET /academics/subjects
  async getSubjects() {
    return mockResponse(subjects)
  },

  // Fetch Teachers for dropdowns
  // TODO(BACKEND):
  // Replace with GET /hr/staff
  async getTeachers() {
    return mockResponse(teachers)
  },
}

export default homeworkService
