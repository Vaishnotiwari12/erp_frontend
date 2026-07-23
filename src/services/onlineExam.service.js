// ====================================================================
// Online Exam Service
//
// Service layer isolates all backend communication for the Online Exam module.
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
  examCategories,
  onlineExams,
  questionBank,
  studentAttempts,
  onlineExamStats,
} from '@/data/onlineExam.mock'

export const onlineExamService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Online Exam Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /online-exam/stats
    // ====================================================================
    return mockResponse(onlineExamStats)
  },

  // ─── Exam Categories ──────────────────────────────────────────────────────────

  // Fetch Exam Categories
  // TODO(BACKEND):
  // Replace mock data with GET /online-exam/categories
  async getExamCategories() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /online-exam/categories
    // ====================================================================
    return mockResponse(examCategories)
  },

  // Create Exam Category
  // TODO(BACKEND):
  // Replace with POST /online-exam/categories
  async createExamCategory(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /online-exam/categories
    // ====================================================================
    return mockResponse({ _id: `ec-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Exam Category
  // TODO(BACKEND):
  // Replace with PUT /online-exam/categories/:id
  async updateExamCategory(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /online-exam/categories/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Exam Category
  // TODO(BACKEND):
  // Replace with DELETE /online-exam/categories/:id
  async deleteExamCategory(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /online-exam/categories/:id
    // ====================================================================
    return mockResponse({ message: 'Exam category deleted successfully' })
  },

  // ─── Online Exams ────────────────────────────────────────────────────────────

  // Fetch Online Exams
  // TODO(BACKEND):
  // Replace mock data with GET /online-exam
  async getExams() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /online-exam
    // ====================================================================
    return mockResponse(onlineExams)
  },

  // Create Online Exam
  // TODO(BACKEND):
  // Replace with POST /online-exam
  async createExam(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /online-exam
    // ====================================================================
    return mockResponse({ _id: `oe-${Date.now()}`, status: 'scheduled', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Online Exam
  // TODO(BACKEND):
  // Replace with PUT /online-exam/:id
  async updateExam(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /online-exam/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Online Exam
  // TODO(BACKEND):
  // Replace with DELETE /online-exam/:id
  async deleteExam(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /online-exam/:id
    // ====================================================================
    return mockResponse({ message: 'Online exam deleted successfully' })
  },

  // ─── Question Bank ──────────────────────────────────────────────────────────────

  // Fetch Questions
  // TODO(BACKEND):
  // Replace mock data with GET /online-exam/questions
  async getQuestions() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /online-exam/questions
    // ====================================================================
    return mockResponse(questionBank)
  },

  // Create Question
  // TODO(BACKEND):
  // Replace with POST /online-exam/questions
  async createQuestion(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /online-exam/questions
    // ====================================================================
    return mockResponse({ _id: `q-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Question
  // TODO(BACKEND):
  // Replace with PUT /online-exam/questions/:id
  async updateQuestion(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /online-exam/questions/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Question
  // TODO(BACKEND):
  // Replace with DELETE /online-exam/questions/:id
  async deleteQuestion(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /online-exam/questions/:id
    // ====================================================================
    return mockResponse({ message: 'Question deleted successfully' })
  },

  // ─── Student Attempts ─────────────────────────────────────────────────────────

  // Fetch Student Attempts
  // TODO(BACKEND):
  // Replace mock data with GET /online-exam/attempts
  async getAttempts() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /online-exam/attempts
    // ====================================================================
    return mockResponse(studentAttempts)
  },

  // Fetch Attempt Detail
  // TODO(BACKEND):
  // Replace with GET /online-exam/attempts/:id
  async getAttemptDetail(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /online-exam/attempts/:id
    // ====================================================================
    const attempt = studentAttempts.find((a) => a._id === id)
    return mockResponse(attempt || null)
  },

  // ─── Results ────────────────────────────────────────────────────────────────────

  // Fetch Results
  // TODO(BACKEND):
  // Replace with GET /online-exam/results
  async getResults() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /online-exam/results
    // ====================================================================
    return mockResponse(studentAttempts.filter((a) => a.status === 'completed'))
  },

  // ─── Reports ──────────────────────────────────────────────────────────────────

  // Fetch Reports
  // TODO(BACKEND):
  // Replace with GET /online-exam/reports
  async getReports() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /online-exam/reports
    // ====================================================================
    return mockResponse(onlineExams)
  },
}

export default onlineExamService
