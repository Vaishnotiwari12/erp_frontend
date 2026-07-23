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
  studentAttendance,
  getAttendanceByDate,
  leaveApplications,
} from '@/data/attendance.mock'

export const attendanceService = {
  // TODO(BACKEND)
  // Replace with GET /attendance
  async list() {
    return mockResponse(studentAttendance)
  },
  // TODO(BACKEND)
  // Replace with GET /attendance/by-date
  async byDate(date) {
    return mockResponse(getAttendanceByDate(date))
  },
  // TODO(BACKEND)
  // Replace with GET /attendance/leaves
  async leaves() {
    return mockResponse(leaveApplications)
  },
  // TODO(BACKEND)
  // Replace with PATCH /attendance/:id
  async markAttendance(id, status) {
    return mockResponse({ _id: id, status, message: 'Attendance updated' })
  },
  // TODO(BACKEND)
  // Replace with POST /attendance/bulk-mark
  async bulkMark(ids, status) {
    return mockResponse({ message: `${ids.length} students marked ${status}` })
  },
  // TODO(BACKEND)
  // Replace with PATCH /attendance/leaves/:id
  async updateLeave(id, status) {
    return mockResponse({ _id: id, status, message: `Leave ${status}` })
  },
}

export default attendanceService
