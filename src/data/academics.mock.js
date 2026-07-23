// Dev-only mock data for the Academics module.
// INTEGRATION: delete this file once real endpoints are wired in academics.service.js.

export const academicClasses = [
  { _id: 'cls-001', name: 'Class 8', numeric: 8, sections_count: 3, status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'cls-002', name: 'Class 9', numeric: 9, sections_count: 3, status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'cls-003', name: 'Class 10', numeric: 10, sections_count: 2, status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'cls-004', name: 'Class 11', numeric: 11, sections_count: 2, status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'cls-005', name: 'Class 12', numeric: 12, sections_count: 2, status: 'active', createdAt: '2024-06-05T00:00:00Z' },
  { _id: 'cls-006', name: 'Year 1', numeric: 1, sections_count: 2, status: 'active', createdAt: '2024-06-06T00:00:00Z' },
  { _id: 'cls-007', name: 'Year 2', numeric: 2, sections_count: 2, status: 'inactive', createdAt: '2024-06-07T00:00:00Z' },
]

export const academicSections = [
  { _id: 'sec-001', name: 'A', class: 'Class 8', room: '101', capacity: 40, status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'sec-002', name: 'B', class: 'Class 8', room: '102', capacity: 38, status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'sec-003', name: 'C', class: 'Class 8', room: '103', capacity: 35, status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'sec-004', name: 'A', class: 'Class 9', room: '201', capacity: 40, status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'sec-005', name: 'B', class: 'Class 9', room: '202', capacity: 36, status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'sec-006', name: 'A', class: 'Class 10', room: '301', capacity: 42, status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'sec-007', name: 'B', class: 'Class 10', room: '302', capacity: 30, status: 'inactive', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'sec-008', name: 'A', class: 'Class 11', room: '401', capacity: 35, status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'sec-009', name: 'B', class: 'Class 11', room: '402', capacity: 32, status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'sec-010', name: 'A', class: 'Class 12', room: '501', capacity: 30, status: 'active', createdAt: '2024-06-05T00:00:00Z' },
  { _id: 'sec-011', name: 'A', class: 'Year 1', room: '601', capacity: 50, status: 'active', createdAt: '2024-06-06T00:00:00Z' },
  { _id: 'sec-012', name: 'B', class: 'Year 1', room: '602', capacity: 48, status: 'active', createdAt: '2024-06-06T00:00:00Z' },
]

export const subjectGroups = [
  { _id: 'grp-001', name: 'Science Group', code: 'SCI', description: 'Physics, Chemistry, Biology', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'grp-002', name: 'Commerce Group', code: 'COM', description: 'Accountancy, Business Studies, Economics', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'grp-003', name: 'Humanities Group', code: 'HUM', description: 'History, Geography, Political Science', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'grp-004', name: 'Mathematics Group', code: 'MTH', description: 'Algebra, Geometry, Calculus', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'grp-005', name: 'Languages Group', code: 'LANG', description: 'English, Spanish, French', status: 'inactive', createdAt: '2024-06-03T00:00:00Z' },
]

export const subjects = [
  { _id: 'sub-001', name: 'Mathematics', code: 'MATH', theory: 80, practical: 20, type: 'Core', group: 'Mathematics Group', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'sub-002', name: 'Physics', code: 'PHY', theory: 70, practical: 30, type: 'Elective', group: 'Science Group', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'sub-003', name: 'Chemistry', code: 'CHEM', theory: 70, practical: 30, type: 'Elective', group: 'Science Group', status: 'active', createdAt: '2024-06-01T00:00:00Z' },
  { _id: 'sub-004', name: 'Biology', code: 'BIO', theory: 60, practical: 40, type: 'Elective', group: 'Science Group', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'sub-005', name: 'English', code: 'ENG', theory: 100, practical: 0, type: 'Core', group: 'Languages Group', status: 'active', createdAt: '2024-06-02T00:00:00Z' },
  { _id: 'sub-006', name: 'History', code: 'HIST', theory: 100, practical: 0, type: 'Elective', group: 'Humanities Group', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'sub-007', name: 'Economics', code: 'ECON', theory: 80, practical: 20, type: 'Elective', group: 'Commerce Group', status: 'active', createdAt: '2024-06-03T00:00:00Z' },
  { _id: 'sub-008', name: 'Computer Science', code: 'CS', theory: 50, practical: 50, type: 'Elective', group: 'Science Group', status: 'active', createdAt: '2024-06-04T00:00:00Z' },
  { _id: 'sub-009', name: 'Geography', code: 'GEO', theory: 90, practical: 10, type: 'Elective', group: 'Humanities Group', status: 'inactive', createdAt: '2024-06-04T00:00:00Z' },
]

export const teachers = [
  { _id: 'tch-001', name: 'Hannah Kim', email: 'hannah@lincoln.edu', department: 'Mathematics', designation: 'Senior Teacher', status: 'active' },
  { _id: 'tch-002', name: 'Marcus Johnson', email: 'marcus@lincoln.edu', department: 'English', designation: 'Teacher', status: 'active' },
  { _id: 'tch-003', name: 'Priya Patel', email: 'priya@riverside.edu', department: 'Science', designation: 'Head of Department', status: 'active' },
  { _id: 'tch-004', name: 'Diego Ramirez', email: 'diego@oakridge.edu', department: 'History', designation: 'Teacher', status: 'active' },
  { _id: 'tch-005', name: 'Yuki Tanaka', email: 'yuki@greenwood.edu', department: 'Computer Science', designation: 'Teacher', status: 'active' },
  { _id: 'tch-006', name: 'Olivia Brooks', email: 'olivia@lincoln.edu', department: 'Commerce', designation: 'Teacher', status: 'inactive' },
]

export const classTeachers = [
  { _id: 'ct-001', teacher: 'Hannah Kim', teacher_id: 'tch-001', class: 'Class 10', section: 'A', academic_year: '2024-2025', status: 'active', createdAt: '2024-06-10T00:00:00Z' },
  { _id: 'ct-002', teacher: 'Marcus Johnson', teacher_id: 'tch-002', class: 'Class 9', section: 'B', academic_year: '2024-2025', status: 'active', createdAt: '2024-06-10T00:00:00Z' },
  { _id: 'ct-003', teacher: 'Priya Patel', teacher_id: 'tch-003', class: 'Class 11', section: 'A', academic_year: '2024-2025', status: 'active', createdAt: '2024-06-11T00:00:00Z' },
  { _id: 'ct-004', teacher: 'Diego Ramirez', teacher_id: 'tch-004', class: 'Class 8', section: 'C', academic_year: '2024-2025', status: 'active', createdAt: '2024-06-11T00:00:00Z' },
  { _id: 'ct-005', teacher: 'Yuki Tanaka', teacher_id: 'tch-005', class: 'Year 1', section: 'A', academic_year: '2024-2025', status: 'inactive', createdAt: '2024-06-12T00:00:00Z' },
  { _id: 'ct-006', teacher: 'Olivia Brooks', teacher_id: 'tch-006', class: 'Class 12', section: 'A', academic_year: '2024-2025', status: 'active', createdAt: '2024-06-12T00:00:00Z' },
]

export const TIME_SLOTS = [
  { id: 'p1', start: '08:00', end: '09:00', label: 'Period 1' },
  { id: 'p2', start: '09:00', end: '10:00', label: 'Period 2' },
  { id: 'p3', start: '10:00', end: '11:00', label: 'Period 3' },
  { id: 'p4', start: '11:00', end: '12:00', label: 'Period 4' },
  { id: 'p5', start: '12:00', end: '13:00', label: 'Period 5' },
  { id: 'p6', start: '13:00', end: '14:00', label: 'Period 6' },
  { id: 'p7', start: '14:00', end: '15:00', label: 'Period 7' },
  { id: 'p8', start: '15:00', end: '16:00', label: 'Period 8' },
]

export const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const SUBJECT_COLORS = {
  Mathematics: '#2563eb',
  Physics: '#9333ea',
  Chemistry: '#16a34a',
  Biology: '#ca8a04',
  English: '#dc2626',
  History: '#0891b2',
  Economics: '#c2410c',
  'Computer Science': '#7c3aed',
  Geography: '#0d9488',
}

function buildTimetable() {
  const grid = {}
  const subjectNames = Object.keys(SUBJECT_COLORS)
  const teachersBySubject = {
    Mathematics: 'Hannah Kim',
    Physics: 'Priya Patel',
    Chemistry: 'Priya Patel',
    Biology: 'Diego Ramirez',
    English: 'Marcus Johnson',
    History: 'Diego Ramirez',
    Economics: 'Olivia Brooks',
    'Computer Science': 'Yuki Tanaka',
    Geography: 'Diego Ramirez',
  }
  const rooms = ['101', '102', '201', '202', '301', '401', 'Lab A', 'Lab B']
  WEEK_DAYS.forEach((day, di) => {
    TIME_SLOTS.forEach((slot, pi) => {
      const isBreak = pi === 4
      const key = `${day}-${slot.id}`
      if (isBreak) {
        grid[key] = { day, slot, subject: 'Break', teacher: '—', room: '—', isBreak: true }
        return
      }
      const subj = subjectNames[(di + pi) % subjectNames.length]
      grid[key] = {
        day,
        slot,
        subject: subj,
        teacher: teachersBySubject[subj] || 'TBD',
        room: rooms[(pi + di) % rooms.length],
        color: SUBJECT_COLORS[subj],
      }
    })
  })
  return grid
}

export const classTimetable = buildTimetable()

export function getTeacherTimetable(teacherName) {
  const grid = {}
  WEEK_DAYS.forEach((day, di) => {
    TIME_SLOTS.forEach((slot, pi) => {
      const key = `${day}-${slot.id}`
      const isBreak = pi === 4
      if (isBreak) {
        grid[key] = { day, slot, subject: 'Break', teacher: teacherName, room: '—', isBreak: true }
        return
      }
      const entry = Object.values(classTimetable).find(
        (e) => !e.isBreak && e.day === day && e.slot.id === slot.id && e.teacher === teacherName,
      )
      grid[key] = entry || { day, slot, subject: 'Free', teacher: teacherName, room: '—', isFree: true, color: 'transparent' }
    })
  })
  return grid
}

export const ACADEMIC_YEARS = ['2024-2025', '2023-2024', '2025-2026']
export const PROMOTION_SESSIONS = ['2024-2025', '2025-2026', '2026-2027']
