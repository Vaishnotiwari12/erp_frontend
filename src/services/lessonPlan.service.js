// ====================================================================
// Lesson Plan Service
//
// Service layer isolates all backend communication for the Lesson Plan module.
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
  lessonPlans,
  lessonPlanStats,
} from '@/data/lessonPlan.mock'
import { academicClasses, subjects } from '@/data/academics.mock'

export const lessonPlanService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Lesson Plan Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /lesson-plan/stats
    // ====================================================================
    return mockResponse(lessonPlanStats)
  },

  // ─── Lesson Plans ────────────────────────────────────────────────────────────

  // Fetch Lesson Plans
  // TODO(BACKEND):
  // Replace mock data with GET /lesson-plan
  async getLessonPlans() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /lesson-plan
    // ====================================================================
    return mockResponse(lessonPlans)
  },

  // Create Lesson Plan
  // TODO(BACKEND):
  // Replace with POST /lesson-plan
  async createLessonPlan(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /lesson-plan
    // ====================================================================
    return mockResponse({ _id: `lp-${Date.now()}`, status: 'pending', created_at: new Date().toISOString(), ...payload })
  },

  // Update Lesson Plan
  // TODO(BACKEND):
  // Replace with PUT /lesson-plan/:id
  async updateLessonPlan(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /lesson-plan/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Lesson Plan
  // TODO(BACKEND):
  // Replace with DELETE /lesson-plan/:id
  async deleteLessonPlan(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /lesson-plan/:id
    // ====================================================================
    return mockResponse({ message: 'Lesson plan deleted successfully' })
  },

  // Copy Lesson
  // TODO(BACKEND):
  // Replace with POST /lesson-plan/copy
  async copyLesson(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /lesson-plan/copy
    // ====================================================================
    return mockResponse({ _id: `lp-${Date.now()}`, ...payload, copied_from: id, created_at: new Date().toISOString() })
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
}

export default lessonPlanService
