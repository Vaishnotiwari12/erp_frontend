import { mockResponse } from './mockData'
import {
  studentAttendance,
  getAttendanceByDate,
  leaveApplications,
} from './mockData'

export const attendanceService = {
  async list() {
    return mockResponse(studentAttendance)
  },
  async byDate(date) {
    return mockResponse(getAttendanceByDate(date))
  },
  async leaves() {
    return mockResponse(leaveApplications)
  },
  async markAttendance(id, status) {
    return mockResponse({ _id: id, status, message: 'Attendance updated' })
  },
  async bulkMark(ids, status) {
    return mockResponse({ message: `${ids.length} students marked ${status}` })
  },
  async updateLeave(id, status) {
    return mockResponse({ _id: id, status, message: `Leave ${status}` })
  },
}

export default attendanceService
