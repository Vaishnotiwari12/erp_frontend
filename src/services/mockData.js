// Dev-only mock helpers aligned with School_erp-b-main model field names.
// INTEGRATION: delete this file once real endpoints are wired in the services.
//
// Mock data arrays/objects now live in dedicated files under src/data/.
// This module re-exports them so existing imports from '@/services/mockData'
// continue to work unchanged.

import { SIMULATED_LATENCY } from '@/constants/app'

// Consistent response envelope matching the future Express backend shape:
//   { success: boolean, data: T, message: string }
// Services return this envelope; useAsyncData unwraps `.data` for pages.
// When Axios is wired in, apiClient will normalize responses to this same shape,
// so no React page or hook will need to change.
export function mockResponse(data, latency = SIMULATED_LATENCY) {
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ success: true, data, message: 'Fetched successfully' }),
      latency,
    ),
  )
}

// ─── Re-exports from dedicated mock data files ──────────────────────────────
export { schools } from '@/data/schools.mock'
export { colleges } from '@/data/colleges.mock'
export { domains } from '@/data/domains.mock'

export {
  students,
  studentCategories,
  studentHouses,
  admissions,
} from '@/data/students.mock'

export {
  academicClasses,
  academicSections,
  subjectGroups,
  subjects,
  teachers,
  classTeachers,
  TIME_SLOTS,
  WEEK_DAYS,
  SUBJECT_COLORS,
  classTimetable,
  getTeacherTimetable,
  ACADEMIC_YEARS,
  PROMOTION_SESSIONS,
} from '@/data/academics.mock'

export {
  ATTENDANCE_STATUS,
  LEAVE_TYPES,
  studentAttendance,
  getAttendanceByDate,
  leaveApplications,
} from '@/data/attendance.mock'

export { users, roles, activities } from '@/data/users.mock'
