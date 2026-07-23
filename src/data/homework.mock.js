// ─── Homework Module Mock Data ─────────────────────────────────────────────────
// All structures mirror the backend homeworkModel.js field names.
// INTEGRATION: delete this file once real endpoints are wired in
// homework.service.js. Only the service imports this file.

import { academicClasses, subjects, teachers } from './academics.mock'

export const homeworks = [
  { _id: 'hw-001', class_id: 'cls-001', class_name: 'Class 8', subject_id: 'sub-001', subject_name: 'Mathematics', teacher_id: 'tch-001', teacher_name: 'Hannah Kim', homework_date: '2024-09-01', submission_date: '2024-09-05', description: 'Complete exercises 3.1 to 3.4 from chapter 3', attachment: 'math-ch3.pdf', status: 'active', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'hw-002', class_id: 'cls-002', class_name: 'Class 9', subject_id: 'sub-002', subject_name: 'Physics', teacher_id: 'tch-003', teacher_name: 'Priya Patel', homework_date: '2024-09-02', submission_date: '2024-09-06', description: 'Solve numerical problems on motion and force', attachment: null, status: 'active', createdAt: '2024-09-02T00:00:00Z' },
  { _id: 'hw-003', class_id: 'cls-003', class_name: 'Class 10', subject_id: 'sub-005', subject_name: 'English', teacher_id: 'tch-002', teacher_name: 'Marcus Johnson', homework_date: '2024-09-03', submission_date: '2024-09-07', description: 'Write an essay on "The Impact of Technology on Education"', attachment: 'essay-guidelines.pdf', status: 'active', createdAt: '2024-09-03T00:00:00Z' },
  { _id: 'hw-004', class_id: 'cls-001', class_name: 'Class 8', subject_id: 'sub-003', subject_name: 'Chemistry', teacher_id: 'tch-003', teacher_name: 'Priya Patel', homework_date: '2024-09-04', submission_date: '2024-09-08', description: 'Prepare for lab experiment on chemical reactions', attachment: 'lab-safety.pdf', status: 'active', createdAt: '2024-09-04T00:00:00Z' },
  { _id: 'hw-005', class_id: 'cls-004', class_name: 'Class 11', subject_id: 'sub-008', subject_name: 'Computer Science', teacher_id: 'tch-005', teacher_name: 'Yuki Tanaka', homework_date: '2024-09-05', submission_date: '2024-09-10', description: 'Complete the Python programming assignment on loops', attachment: 'python-loops.pdf', status: 'active', createdAt: '2024-09-05T00:00:00Z' },
  { _id: 'hw-006', class_id: 'cls-005', class_name: 'Class 12', subject_id: 'sub-007', subject_name: 'Economics', teacher_id: 'tch-006', teacher_name: 'Olivia Brooks', homework_date: '2024-09-06', submission_date: '2024-09-11', description: 'Analyze the impact of inflation on the economy', attachment: null, status: 'active', createdAt: '2024-09-06T00:00:00Z' },
  { _id: 'hw-007', class_id: 'cls-002', class_name: 'Class 9', subject_id: 'sub-001', subject_name: 'Mathematics', teacher_id: 'tch-001', teacher_name: 'Hannah Kim', homework_date: '2024-09-08', submission_date: '2024-09-12', description: 'Practice problems on quadratic equations', attachment: 'quadratic.pdf', status: 'inactive', createdAt: '2024-09-08T00:00:00Z' },
  { _id: 'hw-008', class_id: 'cls-003', class_name: 'Class 10', subject_id: 'sub-002', subject_name: 'Physics', teacher_id: 'tch-003', teacher_name: 'Priya Patel', homework_date: '2024-09-09', submission_date: '2024-09-13', description: 'Read chapter 5 and prepare notes on electricity', attachment: null, status: 'active', createdAt: '2024-09-09T00:00:00Z' },
]

export const dailyAssignments = [
  { _id: 'da-001', student_id: 'stu-001', student_name: 'Aarav Sharma', teacher_id: 'tch-001', teacher_name: 'Hannah Kim', class_name: 'Class 10', section: 'A', date: '2024-09-01', task: 'Complete algebra worksheet', status: 'pending', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'da-002', student_id: 'stu-002', student_name: 'Emma Wilson', teacher_id: 'tch-002', teacher_name: 'Marcus Johnson', class_name: 'Class 9', section: 'B', date: '2024-09-01', task: 'Read pages 45-60 and summarize', status: 'completed', createdAt: '2024-09-01T00:00:00Z' },
  { _id: 'da-003', student_id: 'stu-003', student_name: 'Liam Chen', teacher_id: 'tch-003', teacher_name: 'Priya Patel', class_name: 'Class 11', section: 'A', date: '2024-09-02', task: 'Lab report on chemical bonding', status: 'pending', createdAt: '2024-09-02T00:00:00Z' },
  { _id: 'da-004', student_id: 'stu-005', student_name: 'Noah Brown', teacher_id: 'tch-001', teacher_name: 'Hannah Kim', class_name: 'Year 1', section: 'A', date: '2024-09-02', task: 'Solve calculus problems set 4', status: 'overdue', createdAt: '2024-09-02T00:00:00Z' },
  { _id: 'da-005', student_id: 'stu-007', student_name: 'Ethan Lee', teacher_id: 'tch-005', teacher_name: 'Yuki Tanaka', class_name: 'Year 2', section: 'A', date: '2024-09-03', task: 'Write a Python script for data sorting', status: 'completed', createdAt: '2024-09-03T00:00:00Z' },
  { _id: 'da-006', student_id: 'stu-008', student_name: 'Ava Martinez', teacher_id: 'tch-002', teacher_name: 'Marcus Johnson', class_name: 'Class 10', section: 'B', date: '2024-09-03', task: 'Memorize poem for recitation', status: 'pending', createdAt: '2024-09-03T00:00:00Z' },
  { _id: 'da-007', student_id: 'stu-010', student_name: 'Mia Thompson', teacher_id: 'tch-004', teacher_name: 'Diego Ramirez', class_name: 'Class 9', section: 'A', date: '2024-09-04', task: 'Timeline of World War II events', status: 'completed', createdAt: '2024-09-04T00:00:00Z' },
  { _id: 'da-008', student_id: 'stu-013', student_name: 'Henry Walker', teacher_id: 'tch-003', teacher_name: 'Priya Patel', class_name: 'Year 3', section: 'A', date: '2024-09-04', task: 'Physics numerical set on optics', status: 'overdue', createdAt: '2024-09-04T00:00:00Z' },
]

export const homeworkStats = {
  total_homework: homeworks.length,
  active: homeworks.filter((h) => h.status === 'active').length,
  pending_assignments: dailyAssignments.filter((a) => a.status === 'pending').length,
  overdue_assignments: dailyAssignments.filter((a) => a.status === 'overdue').length,
  completed_assignments: dailyAssignments.filter((a) => a.status === 'completed').length,
  total_assignments: dailyAssignments.length,
}

// Re-export referenced academic collections so the service can offer
// class/subject/teacher dropdown options without a second import site.
export { academicClasses, subjects, teachers }
