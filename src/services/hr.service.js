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
  // TODO(BACKEND)
  // Replace with GET /hr/staff
  async getStaff() {
    return mockResponse(staff.filter((s) => s.status !== 'disabled'))
  },

  // Get all disabled / inactive staff
  // TODO(BACKEND)
  // Replace with GET /hr/staff/disabled
  async getDisabledStaff() {
    return mockResponse(staff.filter((s) => s.status === 'disabled' || s.status === 'inactive'))
  },

  // Create new staff member
  // TODO(BACKEND)
  // Replace with POST /hr/staff
  async createStaff(payload) {
    return mockResponse({ _id: `stf-${Date.now()}`, employee_id: `EMP-${Date.now()}`, ...payload, createdAt: new Date().toISOString() })
  },

  // Update existing staff
  // TODO(BACKEND)
  // Replace with PUT /hr/staff/:id
  async updateStaff(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // Soft delete / disable a staff member
  // TODO(BACKEND)
  // Replace with PATCH /hr/staff/:id/disable
  async disableStaff(id) {
    return mockResponse({ _id: id, status: 'disabled', message: 'Staff disabled successfully' })
  },

  // Restore a disabled staff member
  // TODO(BACKEND)
  // Replace with PATCH /hr/staff/:id/restore
  async restoreStaff(id) {
    return mockResponse({ _id: id, status: 'active', message: 'Staff restored successfully' })
  },

  // Permanently delete a staff record
  // TODO(BACKEND)
  // Replace with DELETE /hr/staff/:id
  async deleteStaff(id) {
    return mockResponse({ message: 'Staff deleted permanently' })
  },

  // ─── Departments ───────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /hr/departments
  async getDepartments() {
    return mockResponse(departments)
  },

  // TODO(BACKEND)
  // Replace with POST /hr/departments
  async createDepartment(payload) {
    return mockResponse({ _id: `dept-${Date.now()}`, staff_count: 0, createdAt: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /hr/departments/:id
  async updateDepartment(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /hr/departments/:id
  async deleteDepartment(id) {
    return mockResponse({ message: 'Department deleted' })
  },

  // ─── Designations ──────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /hr/designations
  async getDesignations() {
    return mockResponse(designations)
  },

  // TODO(BACKEND)
  // Replace with POST /hr/designations
  async createDesignation(payload) {
    return mockResponse({ _id: `desig-${Date.now()}`, staff_count: 0, createdAt: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /hr/designations/:id
  async updateDesignation(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /hr/designations/:id
  async deleteDesignation(id) {
    return mockResponse({ message: 'Designation deleted' })
  },

  // ─── Leave Types ───────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /hr/leave-types
  async getLeaveTypes() {
    return mockResponse(leaveTypes)
  },

  // TODO(BACKEND)
  // Replace with POST /hr/leave-types
  async createLeaveType(payload) {
    return mockResponse({ _id: `lvt-${Date.now()}`, createdAt: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PUT /hr/leave-types/:id
  async updateLeaveType(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // TODO(BACKEND)
  // Replace with DELETE /hr/leave-types/:id
  async deleteLeaveType(id) {
    return mockResponse({ message: 'Leave type deleted' })
  },

  // ─── Leave Applications ────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /hr/leaves
  async getLeaves() {
    return mockResponse(staffLeaves)
  },

  // TODO(BACKEND)
  // Replace with POST /hr/leaves
  async applyLeave(payload) {
    return mockResponse({ _id: `slv-${Date.now()}`, status: 'pending', applied_on: new Date().toISOString(), ...payload })
  },

  // TODO(BACKEND)
  // Replace with PATCH /hr/leaves/:id/approve
  async approveLeave(id) {
    return mockResponse({ _id: id, status: 'approved', approved_by: 'Carlos Mendez' })
  },

  // TODO(BACKEND)
  // Replace with PATCH /hr/leaves/:id/reject
  async rejectLeave(id) {
    return mockResponse({ _id: id, status: 'rejected', approved_by: 'Carlos Mendez' })
  },

  // TODO(BACKEND)
  // Replace with GET /hr/leaves/balance
  async getLeaveBalance() {
    return mockResponse(leaveBalance)
  },

  // ─── Staff Attendance ──────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /hr/attendance
  async getAttendance() {
    return mockResponse(staffAttendance)
  },

  // TODO(BACKEND)
  // Replace with GET /hr/attendance?date=:date
  async getAttendanceByDate(date) {
    return mockResponse(getStaffAttendanceByDate(date))
  },

  // TODO(BACKEND)
  // Replace with PATCH /hr/attendance/:id
  async markAttendance(id, status) {
    return mockResponse({ _id: id, status, message: 'Attendance marked' })
  },

  // TODO(BACKEND)
  // Replace with POST /hr/attendance/bulk-mark
  async bulkMarkAttendance(ids, status) {
    return mockResponse({ message: `${ids.length} records marked ${status}` })
  },

  // ─── Payroll ───────────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /hr/payroll?month=:month
  async getPayroll(month) {
    return mockResponse(payroll)
  },

  // TODO(BACKEND)
  // Replace with POST /hr/payroll/generate
  async generatePayroll(month) {
    return mockResponse({ message: `Payroll for ${month} generated successfully` })
  },

  // TODO(BACKEND)
  // Replace with PATCH /hr/payroll/:id/process
  async processPayment(id) {
    return mockResponse({ _id: id, status: 'paid', payment_date: new Date().toISOString().slice(0, 10) })
  },

  // TODO(BACKEND)
  // Replace with POST /hr/payroll/bulk-process
  async bulkProcessPayment(ids) {
    return mockResponse({ message: `${ids.length} salaries processed` })
  },

  // ─── Teachers Rating ───────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /hr/teachers-rating
  async getTeachersRating() {
    return mockResponse(teachersRating)
  },

  // TODO(BACKEND)
  // Replace with POST /hr/teachers-rating
  async submitRating(payload) {
    return mockResponse({ _id: `tr-${Date.now()}`, ...payload, status: 'rated' })
  },

  // TODO(BACKEND)
  // Replace with PUT /hr/teachers-rating/:id
  async updateRating(id, payload) {
    return mockResponse({ _id: id, ...payload })
  },

  // ─── Dashboard stats ────────────────────────────────────────────────────────

  // TODO(BACKEND)
  // Replace with GET /hr/stats
  async getHrStats() {
    return mockResponse(hrStats)
  },
}

export default hrService
