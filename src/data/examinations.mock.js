// // Dev-only mock data for the Examinations module.
// // INTEGRATION: delete this file once real endpoints are wired in examination.service.js.

// // ─── Exam Groups ─────────────────────────────────────────────────────────────
// export const examGroups = [
//   { _id: 'eg-001', name: 'First Term Examination', session: '2024-2025', start_date: '2024-09-10', end_date: '2024-09-20', description: 'First term assessments for all classes.', status: 'completed', students_count: 1280, subjects_count: 9, createdAt: '2024-08-15T09:00:00Z' },
//   { _id: 'eg-002', name: 'Half Yearly Examination', session: '2024-2025', start_date: '2024-12-05', end_date: '2024-12-18', description: 'Mid-year comprehensive assessments.', status: 'completed', students_count: 1310, subjects_count: 9, createdAt: '2024-11-01T09:00:00Z' },
//   { _id: 'eg-003', name: 'Annual Examination', session: '2024-2025', start_date: '2025-03-01', end_date: '2025-03-20', description: 'Final annual examination for the academic session.', status: 'scheduled', students_count: 1340, subjects_count: 10, createdAt: '2025-01-10T09:00:00Z' },
//   { _id: 'eg-004', name: 'Unit Test 1', session: '2025-2026', start_date: '2025-07-15', end_date: '2025-07-20', description: 'First unit test of the new session.', status: 'active', students_count: 1420, subjects_count: 8, createdAt: '2025-06-20T09:00:00Z' },
//   { _id: 'eg-005', name: 'Pre-Board Examination', session: '2024-2025', start_date: '2025-02-05', end_date: '2025-02-15', description: 'Pre-board preparation for Class 10 and 12.', status: 'completed', students_count: 280, subjects_count: 10, createdAt: '2025-01-05T09:00:00Z' },
//   { _id: 'eg-006', name: 'Board Mock Test', session: '2024-2025', start_date: '2025-02-22', end_date: '2025-02-28', description: 'Mock board examination simulation.', status: 'scheduled', students_count: 280, subjects_count: 10, createdAt: '2025-01-20T09:00:00Z' },
// ]

// // ─── Exam Schedule ──────────────────────────────────────────────────────────
// export const examSchedule = [
//   { _id: 'es-001', exam_group: 'Annual Examination', class: 'Class 10', section: 'A', subject: 'Mathematics', date: '2025-03-01', time: '09:00 - 12:00', duration: '3 hrs', room: 'Hall A', invigilator: 'Hannah Kim', teacher: 'Hannah Kim' },
//   { _id: 'es-002', exam_group: 'Annual Examination', class: 'Class 10', section: 'A', subject: 'Physics', date: '2025-03-03', time: '09:00 - 12:00', duration: '3 hrs', room: 'Hall A', invigilator: 'Priya Patel', teacher: 'Priya Patel' },
//   { _id: 'es-003', exam_group: 'Annual Examination', class: 'Class 10', section: 'A', subject: 'Chemistry', date: '2025-03-05', time: '09:00 - 12:00', duration: '3 hrs', room: 'Hall A', invigilator: 'Priya Patel', teacher: 'Priya Patel' },
//   { _id: 'es-004', exam_group: 'Annual Examination', class: 'Class 10', section: 'B', subject: 'Mathematics', date: '2025-03-01', time: '09:00 - 12:00', duration: '3 hrs', room: 'Hall B', invigilator: 'Marcus Johnson', teacher: 'Marcus Johnson' },
//   { _id: 'es-005', exam_group: 'Annual Examination', class: 'Class 11', section: 'A', subject: 'Biology', date: '2025-03-04', time: '09:00 - 12:00', duration: '3 hrs', room: 'Lab 1', invigilator: 'Diego Ramirez', teacher: 'Diego Ramirez' },
//   { _id: 'es-006', exam_group: 'Annual Examination', class: 'Class 11', section: 'A', subject: 'English', date: '2025-03-06', time: '09:00 - 12:00', duration: '3 hrs', room: 'Hall C', invigilator: 'Marcus Johnson', teacher: 'Marcus Johnson' },
//   { _id: 'es-007', exam_group: 'Annual Examination', class: 'Class 12', section: 'A', subject: 'Computer Science', date: '2025-03-08', time: '14:00 - 17:00', duration: '3 hrs', room: 'Lab 2', invigilator: 'Yuki Tanaka', teacher: 'Yuki Tanaka' },
//   { _id: 'es-008', exam_group: 'Pre-Board Examination', class: 'Class 10', section: 'A', subject: 'Mathematics', date: '2025-02-05', time: '09:00 - 12:00', duration: '3 hrs', room: 'Hall A', invigilator: 'Hannah Kim', teacher: 'Hannah Kim' },
//   { _id: 'es-009', exam_group: 'Pre-Board Examination', class: 'Class 12', section: 'A', subject: 'Physics', date: '2025-02-07', time: '09:00 - 12:00', duration: '3 hrs', room: 'Hall C', invigilator: 'Priya Patel', teacher: 'Priya Patel' },
//   { _id: 'es-010', exam_group: 'Unit Test 1', class: 'Class 9', section: 'A', subject: 'History', date: '2025-07-15', time: '09:00 - 10:30', duration: '1.5 hrs', room: 'Room 201', invigilator: 'Diego Ramirez', teacher: 'Diego Ramirez' },
//   { _id: 'es-011', exam_group: 'Unit Test 1', class: 'Class 9', section: 'B', subject: 'Geography', date: '2025-07-16', time: '09:00 - 10:30', duration: '1.5 hrs', room: 'Room 202', invigilator: 'Diego Ramirez', teacher: 'Diego Ramirez' },
//   { _id: 'es-012', exam_group: 'Board Mock Test', class: 'Class 12', section: 'A', subject: 'Mathematics', date: '2025-02-22', time: '09:00 - 12:00', duration: '3 hrs', room: 'Hall A', invigilator: 'Hannah Kim', teacher: 'Hannah Kim' },
// ]

// // ─── Exam Results ───────────────────────────────────────────────────────────
// export const examResults = [
//   { _id: 'er-001', student: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', section: 'A', exam: 'Annual Examination', marks: { Mathematics: 92, Physics: 88, Chemistry: 90, English: 85, Biology: 82 }, total: 437, max_total: 500, percentage: 87.4, grade: 'A', division: 'First', rank: 3, attendance: 96, remarks: 'Excellent performance.' },
//   { _id: 'er-002', student: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', section: 'B', exam: 'Annual Examination', marks: { Mathematics: 78, Physics: 80, Chemistry: 75, English: 88, Biology: 84 }, total: 405, max_total: 500, percentage: 81.0, grade: 'A', division: 'First', rank: 8, attendance: 94, remarks: 'Very good.' },
//   { _id: 'er-003', student: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', section: 'A', exam: 'Annual Examination', marks: { Mathematics: 95, Physics: 92, Chemistry: 94, English: 80, Biology: 90 }, total: 451, max_total: 500, percentage: 90.2, grade: 'A+', division: 'First', rank: 1, attendance: 98, remarks: 'Outstanding.' },
//   { _id: 'er-004', student: 'Sofia Garcia', admission_no: 'ADM-1004', class: '8-C', section: 'C', exam: 'Annual Examination', marks: { Mathematics: 65, Physics: 70, Chemistry: 68, English: 75, Biology: 72 }, total: 350, max_total: 500, percentage: 70.0, grade: 'B+', division: 'First', rank: 22, attendance: 91, remarks: 'Good, can improve.' },
//   { _id: 'er-005', student: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', section: 'A', exam: 'Annual Examination', marks: { Mathematics: 88, Physics: 85, Chemistry: 82, English: 78, Biology: 80 }, total: 413, max_total: 500, percentage: 82.6, grade: 'A', division: 'First', rank: 6, attendance: 95, remarks: 'Consistent.' },
//   { _id: 'er-006', student: 'Olivia Davis', admission_no: 'ADM-1006', class: '12-A', section: 'A', exam: 'Annual Examination', marks: { Mathematics: 72, Physics: 68, Chemistry: 70, English: 82, Biology: 74 }, total: 366, max_total: 500, percentage: 73.2, grade: 'B+', division: 'First', rank: 15, attendance: 89, remarks: 'Satisfactory.' },
//   { _id: 'er-007', student: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', section: 'B', exam: 'Annual Examination', marks: { Mathematics: 90, Physics: 87, Chemistry: 85, English: 84, Biology: 88 }, total: 434, max_total: 500, percentage: 86.8, grade: 'A', division: 'First', rank: 4, attendance: 97, remarks: 'Excellent.' },
//   { _id: 'er-008', student: 'Ava Martinez', admission_no: 'ADM-1008', class: '10-B', section: 'B', exam: 'Annual Examination', marks: { Mathematics: 55, Physics: 60, Chemistry: 58, English: 72, Biology: 65 }, total: 310, max_total: 500, percentage: 62.0, grade: 'B', division: 'Second', rank: 35, attendance: 86, remarks: 'Needs improvement.' },
//   { _id: 'er-009', student: 'Lucas Anderson', admission_no: 'ADM-1009', class: '11-B', section: 'B', exam: 'Annual Examination', marks: { Mathematics: 84, Physics: 80, Chemistry: 78, English: 86, Biology: 82 }, total: 410, max_total: 500, percentage: 82.0, grade: 'A', division: 'First', rank: 7, attendance: 93, remarks: 'Very good.' },
//   { _id: 'er-010', student: 'Mia Thompson', admission_no: 'ADM-1010', class: '9-A', section: 'A', exam: 'Annual Examination', marks: { Mathematics: 80, Physics: 76, Chemistry: 78, English: 90, Biology: 85 }, total: 409, max_total: 500, percentage: 81.8, grade: 'A', division: 'First', rank: 9, attendance: 96, remarks: 'Good performance.' },
// ]

// // ─── Marks Grades ────────────────────────────────────────────────────────────
// export const marksGrades = [
//   { _id: 'mg-001', grade: 'A+', min_marks: 90, max_marks: 100, grade_point: 10, remarks: 'Outstanding' },
//   { _id: 'mg-002', grade: 'A', min_marks: 80, max_marks: 89, grade_point: 9, remarks: 'Excellent' },
//   { _id: 'mg-003', grade: 'B+', min_marks: 70, max_marks: 79, grade_point: 8, remarks: 'Very Good' },
//   { _id: 'mg-004', grade: 'B', min_marks: 60, max_marks: 69, grade_point: 7, remarks: 'Good' },
//   { _id: 'mg-005', grade: 'C+', min_marks: 50, max_marks: 59, grade_point: 6, remarks: 'Satisfactory' },
//   { _id: 'mg-006', grade: 'C', min_marks: 40, max_marks: 49, grade_point: 5, remarks: 'Average' },
//   { _id: 'mg-007', grade: 'D', min_marks: 33, max_marks: 39, grade_point: 4, remarks: 'Pass' },
//   { _id: 'mg-008', grade: 'F', min_marks: 0, max_marks: 32, grade_point: 0, remarks: 'Fail' },
// ]

// // ─── Marks Divisions ─────────────────────────────────────────────────────────
// export const marksDivisions = [
//   { _id: 'md-001', division: 'First', min_percentage: 60, max_percentage: 100, description: 'First division with distinction' },
//   { _id: 'md-002', division: 'Second', min_percentage: 45, max_percentage: 59, description: 'Second division' },
//   { _id: 'md-003', division: 'Third', min_percentage: 33, max_percentage: 44, description: 'Third division' },
//   { _id: 'md-004', division: 'Fail', min_percentage: 0, max_percentage: 32, description: 'Failed — re-examination required' },
// ]

// // ─── Admit Cards (for print) ─────────────────────────────────────────────────
// export const admitCards = [
//   { _id: 'ac-001', student: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', section: 'A', exam_group: 'Annual Examination', center: 'Main Hall, Lincoln High School', roll_no: 'R-1001', subjects: 5, status: 'generated' },
//   { _id: 'ac-002', student: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', section: 'B', exam_group: 'Annual Examination', center: 'Main Hall, Lincoln High School', roll_no: 'R-1002', subjects: 5, status: 'generated' },
//   { _id: 'ac-003', student: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', section: 'A', exam_group: 'Annual Examination', center: 'Science Block, Riverside Academy', roll_no: 'R-1003', subjects: 5, status: 'generated' },
//   { _id: 'ac-004', student: 'Sofia Garcia', admission_no: 'ADM-1004', class: '8-C', section: 'C', exam_group: 'Annual Examination', center: 'Main Hall, Oakridge International', roll_no: 'R-1004', subjects: 5, status: 'pending' },
//   { _id: 'ac-005', student: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', section: 'A', exam_group: 'Annual Examination', center: 'Westfield College Campus', roll_no: 'R-1005', subjects: 5, status: 'generated' },
//   { _id: 'ac-006', student: 'Olivia Davis', admission_no: 'ADM-1006', class: '12-A', section: 'A', exam_group: 'Annual Examination', center: 'Greenwood Public Auditorium', roll_no: 'R-1006', subjects: 5, status: 'generated' },
//   { _id: 'ac-007', student: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', section: 'B', exam_group: 'Annual Examination', center: 'Northgate University Hall', roll_no: 'R-1007', subjects: 5, status: 'pending' },
// ]

// // ─── Marksheets (for print) ──────────────────────────────────────────────────
// export const marksheets = [
//   { _id: 'mk-001', student: 'Aarav Sharma', admission_no: 'ADM-1001', class: '10-A', section: 'A', exam_group: 'Annual Examination', percentage: 87.4, grade: 'A', division: 'First', rank: 3, status: 'generated' },
//   { _id: 'mk-002', student: 'Emma Wilson', admission_no: 'ADM-1002', class: '9-B', section: 'B', exam_group: 'Annual Examination', percentage: 81.0, grade: 'A', division: 'First', rank: 8, status: 'generated' },
//   { _id: 'mk-003', student: 'Liam Chen', admission_no: 'ADM-1003', class: '11-A', section: 'A', exam_group: 'Annual Examination', percentage: 90.2, grade: 'A+', division: 'First', rank: 1, status: 'generated' },
//   { _id: 'mk-004', student: 'Sofia Garcia', admission_no: 'ADM-1004', class: '8-C', section: 'C', exam_group: 'Annual Examination', percentage: 70.0, grade: 'B+', division: 'First', rank: 22, status: 'pending' },
//   { _id: 'mk-005', student: 'Noah Brown', admission_no: 'ADM-1005', class: 'Year-1', section: 'A', exam_group: 'Annual Examination', percentage: 82.6, grade: 'A', division: 'First', rank: 6, status: 'generated' },
//   { _id: 'mk-006', student: 'Olivia Davis', admission_no: 'ADM-1006', class: '12-A', section: 'A', exam_group: 'Annual Examination', percentage: 73.2, grade: 'B+', division: 'First', rank: 15, status: 'generated' },
//   { _id: 'mk-007', student: 'Ethan Lee', admission_no: 'ADM-1007', class: 'Year-2', section: 'B', exam_group: 'Annual Examination', percentage: 86.8, grade: 'A', division: 'First', rank: 4, status: 'generated' },
// ]

// // ─── Admit Card / Marksheet Design Templates ────────────────────────────────
// export const admitCardTemplate = {
//   show_logo: true,
//   header_text: 'Scholaria ERP - Admit Card',
//   show_qr: true,
//   show_barcode: true,
//   watermark: 'SCHOLARIA',
//   show_principal_signature: true,
//   show_controller_signature: true,
//   fields: ['Student Name', 'Admission No', 'Class', 'Section', 'Roll No', 'Exam Center', 'Subjects', 'Dates'],
//   paper_size: 'A4',
//   orientation: 'portrait',
// }

// export const marksheetTemplate = {
//   show_logo: true,
//   header_text: 'Scholaria ERP - Marksheet',
//   show_grades: true,
//   show_attendance: true,
//   show_remarks: true,
//   show_teacher_signature: true,
//   show_principal_signature: true,
//   fields: ['Student Name', 'Admission No', 'Class', 'Subjects', 'Marks', 'Total', 'Percentage', 'Grade', 'Division', 'Rank'],
//   paper_size: 'A4',
//   orientation: 'landscape',
// }

// // ─── Consolidated Marksheet (per student) ────────────────────────────────────
// export const consolidatedMarksheets = examResults.map((r) => ({
//   _id: `cm-${r._id}`,
//   student: r.student,
//   admission_no: r.admission_no,
//   class: r.class,
//   section: r.section,
//   exam: r.exam,
//   gpa: (r.percentage / 9.5).toFixed(2),
//   percentage: r.percentage,
//   grade: r.grade,
//   rank: r.rank,
//   division: r.division,
//   attendance: r.attendance,
//   marks: r.marks,
//   total: r.total,
//   max_total: r.max_total,
//   performance: [
//     { subject: 'Mathematics', marks: r.marks.Mathematics },
//     { subject: 'Physics', marks: r.marks.Physics },
//     { subject: 'Chemistry', marks: r.marks.Chemistry },
//     { subject: 'English', marks: r.marks.English },
//     { subject: 'Biology', marks: r.marks.Biology },
//   ],
// }))
