// ====================================================================
// Certificate Service
//
// Service layer isolates all backend communication for the Certificate
// module. Pages never call APIs directly — they call these methods,
// which return the standard envelope: { success, message, data }.
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
  studentCertificates,
  generatedCertificates,
  studentIdCards,
  generatedStudentIdCards,
  staffIdCards,
  generatedStaffIdCards,
  certificateStats,
} from '@/data/certificate.mock'

export const certificateService = {
  // ─── Dashboard ──────────────────────────────────────────────────────────────

  // Fetch Certificate Dashboard Stats
  // TODO(BACKEND):
  // Replace mock service with backend API.
  // Expected Response: { success, message, data }
  async getStats() {
    // ====================================================================
    // BACKEND INTEGRATION
    // Replace this mock implementation with Axios API call.
    // GET /api/certificate/stats (derived)
    // ====================================================================
    return mockResponse(certificateStats)
  },

  // ─── Student Certificates ────────────────────────────────────────────────────

  // Fetch Student Certificates
  // TODO(BACKEND):
  // Replace mock data with GET /api/certificate/student-certificate
  async getStudentCertificates() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/certificate/student-certificate
    // ====================================================================
    return mockResponse(studentCertificates)
  },

  // Create Student Certificate
  // TODO(BACKEND):
  // Replace with POST /api/certificate/student-certificate
  async createStudentCertificate(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/certificate/student-certificate
    // ====================================================================
    return mockResponse({ _id: `sc-${Date.now()}`, createdAt: new Date().toISOString(), ...payload })
  },

  // Update Student Certificate
  // TODO(BACKEND):
  // Replace with PUT /api/certificate/student-certificate/:id
  async updateStudentCertificate(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/certificate/student-certificate/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Student Certificate
  // TODO(BACKEND):
  // Replace with DELETE /api/certificate/student-certificate/:id
  async deleteStudentCertificate(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/certificate/student-certificate/:id
    // ====================================================================
    return mockResponse({ message: 'Student certificate deleted successfully' })
  },

  // ─── Generated Certificates ──────────────────────────────────────────────────

  // Fetch Generated Certificates
  // TODO(BACKEND):
  // Replace mock data with GET /api/certificate/generate-certificate
  async getGeneratedCertificates() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/certificate/generate-certificate
    // ====================================================================
    return mockResponse(generatedCertificates)
  },

  // Create Generated Certificate
  // TODO(BACKEND):
  // Replace with POST /api/certificate/generate-certificate
  async createGeneratedCertificate(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/certificate/generate-certificate
    // ====================================================================
    return mockResponse({ _id: `gc-${Date.now()}`, status: 'generated', generated_at: new Date().toISOString(), createdAt: new Date().toISOString(), ...payload })
  },

  // Delete Generated Certificate
  // TODO(BACKEND):
  // Replace with DELETE /api/certificate/generate-certificate/:id
  async deleteGeneratedCertificate(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/certificate/generate-certificate/:id
    // ====================================================================
    return mockResponse({ message: 'Generated certificate deleted successfully' })
  },

  // ─── Student ID Cards ──────────────────────────────────────────────────────────

  // Fetch Student ID Cards
  // TODO(BACKEND):
  // Replace mock data with GET /api/certificate/student-id-card
  async getStudentIdCards() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/certificate/student-id-card
    // ====================================================================
    return mockResponse(studentIdCards)
  },

  // Create Student ID Card
  // TODO(BACKEND):
  // Replace with POST /api/certificate/student-id-card
  async createStudentIdCard(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/certificate/student-id-card
    // ====================================================================
    return mockResponse({ _id: `sid-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Student ID Card
  // TODO(BACKEND):
  // Replace with PUT /api/certificate/student-id-card/:id
  async updateStudentIdCard(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/certificate/student-id-card/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Student ID Card
  // TODO(BACKEND):
  // Replace with DELETE /api/certificate/student-id-card/:id
  async deleteStudentIdCard(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/certificate/student-id-card/:id
    // ====================================================================
    return mockResponse({ message: 'Student ID card deleted successfully' })
  },

  // ─── Generated Student ID Cards ──────────────────────────────────────────────

  // Fetch Generated Student ID Cards
  // TODO(BACKEND):
  // Replace mock data with GET /api/certificate/generate-id-card
  async getGeneratedStudentIdCards() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/certificate/generate-id-card
    // ====================================================================
    return mockResponse(generatedStudentIdCards)
  },

  // Create Generated Student ID Card
  // TODO(BACKEND):
  // Replace with POST /api/certificate/generate-id-card
  async createGeneratedStudentIdCard(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/certificate/generate-id-card
    // ====================================================================
    return mockResponse({ _id: `gsid-${Date.now()}`, status: 'generated', generated_at: new Date().toISOString(), createdAt: new Date().toISOString(), ...payload })
  },

  // Delete Generated Student ID Card
  // TODO(BACKEND):
  // Replace with DELETE /api/certificate/generate-id-card/:id
  async deleteGeneratedStudentIdCard(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/certificate/generate-id-card/:id
    // ====================================================================
    return mockResponse({ message: 'Generated student ID card deleted successfully' })
  },

  // ─── Staff ID Cards ────────────────────────────────────────────────────────────

  // Fetch Staff ID Cards
  // TODO(BACKEND):
  // Replace mock data with GET /api/certificate/staff-id-card
  async getStaffIdCards() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/certificate/staff-id-card
    // ====================================================================
    return mockResponse(staffIdCards)
  },

  // Create Staff ID Card
  // TODO(BACKEND):
  // Replace with POST /api/certificate/staff-id-card
  async createStaffIdCard(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/certificate/staff-id-card
    // ====================================================================
    return mockResponse({ _id: `stid-${Date.now()}`, status: 'active', createdAt: new Date().toISOString(), ...payload })
  },

  // Update Staff ID Card
  // TODO(BACKEND):
  // Replace with PUT /api/certificate/staff-id-card/:id
  async updateStaffIdCard(id, payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // PUT /api/certificate/staff-id-card/:id
    // ====================================================================
    return mockResponse({ _id: id, ...payload })
  },

  // Delete Staff ID Card
  // TODO(BACKEND):
  // Replace with DELETE /api/certificate/staff-id-card/:id
  async deleteStaffIdCard(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/certificate/staff-id-card/:id
    // ====================================================================
    return mockResponse({ message: 'Staff ID card deleted successfully' })
  },

  // ─── Generated Staff ID Cards ────────────────────────────────────────────────

  // Fetch Generated Staff ID Cards
  // TODO(BACKEND):
  // Replace mock data with GET /api/certificate/generate-staff-id-card
  async getGeneratedStaffIdCards() {
    // ====================================================================
    // BACKEND INTEGRATION
    // GET /api/certificate/generate-staff-id-card
    // ====================================================================
    return mockResponse(generatedStaffIdCards)
  },

  // Create Generated Staff ID Card
  // TODO(BACKEND):
  // Replace with POST /api/certificate/generate-staff-id-card
  async createGeneratedStaffIdCard(payload) {
    // ====================================================================
    // BACKEND INTEGRATION
    // POST /api/certificate/generate-staff-id-card
    // ====================================================================
    return mockResponse({ _id: `gstid-${Date.now()}`, status: 'generated', generated_at: new Date().toISOString(), createdAt: new Date().toISOString(), ...payload })
  },

  // Delete Generated Staff ID Card
  // TODO(BACKEND):
  // Replace with DELETE /api/certificate/generate-staff-id-card/:id
  async deleteGeneratedStaffIdCard(id) {
    // ====================================================================
    // BACKEND INTEGRATION
    // DELETE /api/certificate/generate-staff-id-card/:id
    // ====================================================================
    return mockResponse({ message: 'Generated staff ID card deleted successfully' })
  },
}

export default certificateService
