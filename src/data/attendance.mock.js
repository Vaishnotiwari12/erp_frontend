// Dev-only mock data for the Attendance module.
// INTEGRATION: delete this file once real endpoints are wired in attendance.service.js.

import { students } from '@/data/students.mock'

export const ATTENDANCE_STATUS = {
  present: { label: 'Present', color: '#16a34a', bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
  absent: { label: 'Absent', color: '#dc2626', bg: 'bg-destructive/10', text: 'text-destructive', border: 'border-destructive/20' },
  leave: { label: 'Leave', color: '#ca8a04', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  late: { label: 'Late', color: '#2563eb', bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
}

export const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Vacation', 'Other']

const CHECKIN_TIMES = ['08:02', '08:05', '07:58', '08:10', '08:15', '08:01', '08:07', '08:12', '08:00', '08:20', '—', '08:04']
const REMARKS = [
  'On time', 'Late arrival', 'Approved leave', 'Medical leave', 'Family emergency',
  'Bus delay', '—', 'Early departure', 'Sports event', '',
]

function buildStudentAttendance(date = '2025-04-20') {
  const statuses = ['present', 'present', 'present', 'present', 'absent', 'present', 'leave', 'present', 'late', 'present', 'present', 'absent', 'present', 'late']
  return students.map((s, i) => ({
    _id: `att-${s._id}`,
    student_id: s._id,
    name: s.name,
    admission_no: s.admission_no,
    class: s.class,
    section: s.section,
    status: statuses[i % statuses.length],
    check_in: CHECKIN_TIMES[i % CHECKIN_TIMES.length],
    remarks: REMARKS[i % REMARKS.length],
    date,
    marked_by: 'Hannah Kim',
    marked_at: `${date}T08:30:00Z`,
  }))
}

export const studentAttendance = buildStudentAttendance()

export function getAttendanceByDate(date) {
  return buildStudentAttendance(date)
}

export const leaveApplications = [
  { _id: 'lv-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', section: 'A', leave_type: 'Sick Leave', from: '2025-04-22', to: '2025-04-23', reason: 'Fever and cold, advised rest by doctor.', applied_on: '2025-04-21T09:00:00Z', status: 'pending', guardian: 'Rohit Sharma', attachment: 'medical-cert.pdf' },
  { _id: 'lv-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', section: 'B', leave_type: 'Casual Leave', from: '2025-04-18', to: '2025-04-18', reason: 'Family function attendance.', applied_on: '2025-04-16T14:00:00Z', status: 'pending', guardian: 'James Wilson', attachment: null },
  { _id: 'lv-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', section: 'A', leave_type: 'Emergency Leave', from: '2025-04-15', to: '2025-04-17', reason: 'Family emergency — out of town.', applied_on: '2025-04-14T20:00:00Z', status: 'approved', guardian: 'Wei Chen', attachment: null },
  { _id: 'lv-004', student_name: 'Sofia Garcia', admission_no: 'ADM-1004', class: '8-C', section: 'C', leave_type: 'Vacation', from: '2025-04-10', to: '2025-04-14', reason: 'Family vacation pre-planned.', applied_on: '2025-04-05T10:00:00Z', status: 'approved', guardian: 'Maria Garcia', attachment: 'travel-itinerary.pdf' },
  { _id: 'lv-005', student_name: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', section: 'A', leave_type: 'Sick Leave', from: '2025-04-19', to: '2025-04-19', reason: 'Migraine, unable to attend.', applied_on: '2025-04-19T07:00:00Z', status: 'pending', guardian: 'David Brown', attachment: null },
  { _id: 'lv-006', student_name: 'Olivia Davis', admission_no: 'ADM-1006', class: '12-A', section: 'A', leave_type: 'Casual Leave', from: '2025-04-08', to: '2025-04-09', reason: 'College visit for admission.', applied_on: '2025-04-07T11:00:00Z', status: 'rejected', guardian: 'Sarah Davis', attachment: null },
  { _id: 'lv-007', student_name: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', section: 'B', leave_type: 'Emergency Leave', from: '2025-04-21', to: '2025-04-22', reason: 'Urgent family matter.', applied_on: '2025-04-20T18:00:00Z', status: 'pending', guardian: 'Min Lee', attachment: null },
  { _id: 'lv-008', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', section: 'B', leave_type: 'Sick Leave', from: '2025-04-12', to: '2025-04-13', reason: 'Stomach infection.', applied_on: '2025-04-12T06:30:00Z', status: 'approved', guardian: 'Carlos Martinez', attachment: 'prescription.pdf' },
  { _id: 'lv-009', student_name: 'Lucas Anderson', admission_no: 'ADM-1009', class: '11-B', section: 'B', leave_type: 'Other', from: '2025-04-25', to: '2025-04-26', reason: 'Inter-college competition participation.', applied_on: '2025-04-20T09:00:00Z', status: 'pending', guardian: 'Sophia Anderson', attachment: 'invitation.pdf' },
  { _id: 'lv-010', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class: '9-A', section: 'A', leave_type: 'Casual Leave', from: '2025-04-03', to: '2025-04-04', reason: 'Religious festival at home.', applied_on: '2025-04-02T15:00:00Z', status: 'rejected', guardian: 'Robert Thompson', attachment: null },
]
