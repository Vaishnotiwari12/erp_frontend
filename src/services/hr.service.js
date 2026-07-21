// ─── HR Service ───────────────────────────────────────────────────────────────
// Service layer keeps all HR API logic separate from UI components.
// Currently uses mock data. When backend is ready, only replace the
// mockResponse() calls with apiClient.get/post/put/delete calls here.
// UI pages never need to change.

import { mockResponse } from './mockData'
import {
  staff,
  departments,
  designations,
  leaveTypes,
  staffLeaves,
  staffAttendance,
  getStaffAttendanceByDate,
  payroll,
  teachersRating,
  leaveBalance,
  hrStats,
} from '@/data/hr.mock'

export const hrService = {
  // ─── Staff ─────────────────────────────────────────────────────────────────

  // Get all active staff
  async getStaff() {
    // INTEGRATION: return apiClient.get('/hr/staff')
    return mockResponse(staff.filter((s) => s.status !== 'disabled'))
  },

  // Get all disabled / inactive staff
  async getDisabledStaff() {
    // INTEGRATION: return apiClient.get('/hr/staff/disabled')
    return mockResponse(staff.filter((s) => s.status === 'disabled' || s.status === 'inactive'))
  },

  // Create new staff member
  async createStaff(payload) {
    // INTEGRATION: return apiClient.post('/hr/staff', payload)
    return mockResponse({ _id: `stf-${Date.now()}`, employee_id: `EMP-${Date.now()}`, ...payload, createdAt: new Date().toISOString() })
  },

  // Update existing staff
  async updateStaff(id, payload) {
    // INTEGRATION: return apiClient.put(`/hr/staff/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  // Soft delete / disable a staff member
  async disableStaff(id) {
    // INTEGRATION: return apiClient.patch(`/hr/staff/${id}/disable`)
    return mockResponse({ _id: id, status: 'disabled', message: 'Staff disabled successfully' })
  },

  // Restore a disabled staff member
  async restoreStaff(id) {
    // INTEGRATION: return apiClient.patch(`/hr/staff/${id}/restore`)
    return mockResponse({ _id: id, status: 'active', message: 'Staff restored successfully' })
  },

  // Permanently delete a staff record
  async deleteStaff(id) {
    // INTEGRATION: return apiClient.delete(`/hr/staff/${id}`)
    return mockResponse({ message: 'Staff deleted permanently' })
  },

  // ─── Departments ───────────────────────────────────────────────────────────

  async getDepartments() {
    // INTEGRATION: return apiClient.get('/hr/departments')
    return mockResponse(departments)
  },

  async createDepartment(payload) {
    // INTEGRATION: return apiClient.post('/hr/departments', payload)
    return mockResponse({ _id: `dept-${Date.now()}`, staff_count: 0, createdAt: new Date().toISOString(), ...payload })
  },

  async updateDepartment(id, payload) {
    // INTEGRATION: return apiClient.put(`/hr/departments/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteDepartment(id) {
    // INTEGRATION: return apiClient.delete(`/hr/departments/${id}`)
    return mockResponse({ message: 'Department deleted' })
  },

  // ─── Designations ──────────────────────────────────────────────────────────

  async getDesignations() {
    // INTEGRATION: return apiClient.get('/hr/designations')
    return mockResponse(designations)
  },

  async createDesignation(payload) {
    // INTEGRATION: return apiClient.post('/hr/designations', payload)
    return mockResponse({ _id: `desig-${Date.now()}`, staff_count: 0, createdAt: new Date().toISOString(), ...payload })
  },

  async updateDesignation(id, payload) {
    // INTEGRATION: return apiClient.put(`/hr/designations/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteDesignation(id) {
    // INTEGRATION: return apiClient.delete(`/hr/designations/${id}`)
    return mockResponse({ message: 'Designation deleted' })
  },

  // ─── Leave Types ───────────────────────────────────────────────────────────

  async getLeaveTypes() {
    // INTEGRATION: return apiClient.get('/hr/leave-types')
    return mockResponse(leaveTypes)
  },

  async createLeaveType(payload) {
    // INTEGRATION: return apiClient.post('/hr/leave-types', payload)
    return mockResponse({ _id: `lvt-${Date.now()}`, createdAt: new Date().toISOString(), ...payload })
  },

  async updateLeaveType(id, payload) {
    // INTEGRATION: return apiClient.put(`/hr/leave-types/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  async deleteLeaveType(id) {
    // INTEGRATION: return apiClient.delete(`/hr/leave-types/${id}`)
    return mockResponse({ message: 'Leave type deleted' })
  },

  // ─── Leave Applications ────────────────────────────────────────────────────

  async getLeaves() {
    // INTEGRATION: return apiClient.get('/hr/leaves')
    return mockResponse(staffLeaves)
  },

  async applyLeave(payload) {
    // INTEGRATION: return apiClient.post('/hr/leaves', payload)
    return mockResponse({ _id: `slv-${Date.now()}`, status: 'pending', applied_on: new Date().toISOString(), ...payload })
  },

  async approveLeave(id) {
    // INTEGRATION: return apiClient.patch(`/hr/leaves/${id}/approve`)
    return mockResponse({ _id: id, status: 'approved', approved_by: 'Carlos Mendez' })
  },

  async rejectLeave(id) {
    // INTEGRATION: return apiClient.patch(`/hr/leaves/${id}/reject`)
    return mockResponse({ _id: id, status: 'rejected', approved_by: 'Carlos Mendez' })
  },

  async getLeaveBalance() {
    // INTEGRATION: return apiClient.get('/hr/leaves/balance')
    return mockResponse(leaveBalance)
  },

  // ─── Staff Attendance ──────────────────────────────────────────────────────

  async getAttendance() {
    // INTEGRATION: return apiClient.get('/hr/attendance')
    return mockResponse(staffAttendance)
  },

  async getAttendanceByDate(date) {
    // INTEGRATION: return apiClient.get(`/hr/attendance?date=${date}`)
    return mockResponse(getStaffAttendanceByDate(date))
  },

  async markAttendance(id, status) {
    // INTEGRATION: return apiClient.patch(`/hr/attendance/${id}`, { status })
    return mockResponse({ _id: id, status, message: 'Attendance marked' })
  },

  async bulkMarkAttendance(ids, status) {
    // INTEGRATION: return apiClient.post('/hr/attendance/bulk-mark', { ids, status })
    return mockResponse({ message: `${ids.length} records marked ${status}` })
  },

  // ─── Payroll ───────────────────────────────────────────────────────────────

  async getPayroll(month) {
    // INTEGRATION: return apiClient.get(`/hr/payroll?month=${month}`)
    return mockResponse(payroll)
  },

  async generatePayroll(month) {
    // INTEGRATION: return apiClient.post('/hr/payroll/generate', { month })
    return mockResponse({ message: `Payroll for ${month} generated successfully` })
  },

  async processPayment(id) {
    // INTEGRATION: return apiClient.patch(`/hr/payroll/${id}/process`)
    return mockResponse({ _id: id, status: 'paid', payment_date: new Date().toISOString().slice(0, 10) })
  },

  async bulkProcessPayment(ids) {
    // INTEGRATION: return apiClient.post('/hr/payroll/bulk-process', { ids })
    return mockResponse({ message: `${ids.length} salaries processed` })
  },

  // ─── Teachers Rating ───────────────────────────────────────────────────────

  async getTeachersRating() {
    // INTEGRATION: return apiClient.get('/hr/teachers-rating')
    return mockResponse(teachersRating)
  },

  async submitRating(payload) {
    // INTEGRATION: return apiClient.post('/hr/teachers-rating', payload)
    return mockResponse({ _id: `tr-${Date.now()}`, ...payload, status: 'rated' })
  },

  async updateRating(id, payload) {
    // INTEGRATION: return apiClient.put(`/hr/teachers-rating/${id}`, payload)
    return mockResponse({ _id: id, ...payload })
  },

  // ─── Dashboard stats ────────────────────────────────────────────────────────

  async getHrStats() {
    // INTEGRATION: return apiClient.get('/hr/stats')
    return mockResponse(hrStats)
  },
}

export default hrService
