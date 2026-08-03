// // ─── HR Module Mock Data ──────────────────────────────────────────────────────
// // All data structures mirror the backend hrModel.js field names.
// // INTEGRATION: delete this file once real endpoints are wired in hr.service.js.

// // ─── Departments ──────────────────────────────────────────────────────────────
// export const departments = [
//   { _id: 'dept-001', name: 'Mathematics', code: 'MATH', description: 'Mathematics and Statistics department', head: 'Hannah Kim', head_id: 'tch-001', staff_count: 8, status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//   { _id: 'dept-002', name: 'Science', code: 'SCI', description: 'Physics, Chemistry and Biology', head: 'Priya Patel', head_id: 'tch-003', staff_count: 12, status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//   { _id: 'dept-003', name: 'English', code: 'ENG', description: 'English Language and Literature', head: 'Marcus Johnson', head_id: 'tch-002', staff_count: 6, status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//   { _id: 'dept-004', name: 'History & Social Studies', code: 'HIST', description: 'History, Geography and Civics', head: 'Diego Ramirez', head_id: 'tch-004', staff_count: 5, status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//   { _id: 'dept-005', name: 'Computer Science', code: 'CS', description: 'Information Technology and Computer Applications', head: 'Yuki Tanaka', head_id: 'tch-005', staff_count: 4, status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   { _id: 'dept-006', name: 'Commerce', code: 'COM', description: 'Accountancy, Business Studies and Economics', head: 'Olivia Brooks', head_id: 'tch-006', staff_count: 5, status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   { _id: 'dept-007', name: 'Physical Education', code: 'PE', description: 'Sports and Physical Training', head: 'Sam Torres', head_id: 'stf-007', staff_count: 3, status: 'active', createdAt: '2024-01-13T00:00:00Z' },
//   { _id: 'dept-008', name: 'Arts & Music', code: 'ARTS', description: 'Fine Arts, Music and Performing Arts', head: 'Aisha Patel', head_id: 'stf-008', staff_count: 4, status: 'active', createdAt: '2024-01-13T00:00:00Z' },
//   { _id: 'dept-009', name: 'Administration', code: 'ADMIN', description: 'Administrative and support staff', head: 'Carlos Mendez', head_id: 'stf-009', staff_count: 10, status: 'active', createdAt: '2024-01-14T00:00:00Z' },
//   { _id: 'dept-010', name: 'Library', code: 'LIB', description: 'Library and information services', head: 'Rachel Green', head_id: 'stf-010', staff_count: 2, status: 'inactive', createdAt: '2024-01-15T00:00:00Z' },
// ]

// // ─── Designations ─────────────────────────────────────────────────────────────
// export const designations = [
//   { _id: 'desig-001', name: 'Principal', code: 'PRIN', department: 'Administration', level: 1, description: 'Head of the institution', staff_count: 1, status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//   { _id: 'desig-002', name: 'Vice Principal', code: 'VPRIN', department: 'Administration', level: 2, description: 'Deputy head of institution', staff_count: 2, status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//   { _id: 'desig-003', name: 'Head of Department', code: 'HOD', department: 'All', level: 3, description: 'Leads an academic department', staff_count: 9, status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//   { _id: 'desig-004', name: 'Senior Teacher', code: 'SR-TCH', department: 'All', level: 4, description: 'Experienced teaching staff', staff_count: 18, status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//   { _id: 'desig-005', name: 'Teacher', code: 'TCH', department: 'All', level: 5, description: 'Regular teaching staff', staff_count: 32, status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   { _id: 'desig-006', name: 'Assistant Teacher', code: 'ASST-TCH', department: 'All', level: 6, description: 'Junior teaching support', staff_count: 14, status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   { _id: 'desig-007', name: 'Lab Assistant', code: 'LAB-ASST', department: 'Science', level: 6, description: 'Laboratory support and maintenance', staff_count: 4, status: 'active', createdAt: '2024-01-13T00:00:00Z' },
//   { _id: 'desig-008', name: 'Administrative Officer', code: 'AO', department: 'Administration', level: 4, description: 'Administrative operations', staff_count: 3, status: 'active', createdAt: '2024-01-13T00:00:00Z' },
//   { _id: 'desig-009', name: 'Accountant', code: 'ACCT', department: 'Administration', level: 5, description: 'Financial and accounting operations', staff_count: 2, status: 'active', createdAt: '2024-01-14T00:00:00Z' },
//   { _id: 'desig-010', name: 'Librarian', code: 'LIB', department: 'Library', level: 5, description: 'Library management and services', staff_count: 2, status: 'inactive', createdAt: '2024-01-15T00:00:00Z' },
//   { _id: 'desig-011', name: 'Counselor', code: 'CNSL', department: 'Administration', level: 4, description: 'Student and staff counseling', staff_count: 2, status: 'active', createdAt: '2024-01-15T00:00:00Z' },
//   { _id: 'desig-012', name: 'Sports Coach', code: 'COACH', department: 'Physical Education', level: 5, description: 'Sports and fitness training', staff_count: 3, status: 'active', createdAt: '2024-01-16T00:00:00Z' },
// ]

// // ─── Staff Directory ──────────────────────────────────────────────────────────
// export const staff = [
//   { _id: 'stf-001', employee_id: 'EMP-001', name: 'Hannah Kim', email: 'hannah@lincoln.edu', phone: '+1 555-1001', department: 'Mathematics', department_id: 'dept-001', designation: 'Head of Department', designation_id: 'desig-003', gender: 'female', dob: '1985-03-15', joining_date: '2018-06-01', salary: 72000, blood_group: 'A+', address: '12 Maple St, Austin, TX', qualification: 'M.Sc Mathematics', experience: '7 years', school_name: 'Lincoln High School', status: 'active', createdAt: '2024-01-15T00:00:00Z' },
//   { _id: 'stf-002', employee_id: 'EMP-002', name: 'Marcus Johnson', email: 'marcus@lincoln.edu', phone: '+1 555-1002', department: 'English', department_id: 'dept-003', designation: 'Teacher', designation_id: 'desig-005', gender: 'male', dob: '1990-07-22', joining_date: '2020-08-01', salary: 58000, blood_group: 'O+', address: '45 Oak Ave, Austin, TX', qualification: 'M.A English Literature', experience: '4 years', school_name: 'Lincoln High School', status: 'active', createdAt: '2024-01-15T00:00:00Z' },
//   { _id: 'stf-003', employee_id: 'EMP-003', name: 'Priya Patel', email: 'priya@riverside.edu', phone: '+1 555-1003', department: 'Science', department_id: 'dept-002', designation: 'Head of Department', designation_id: 'desig-003', gender: 'female', dob: '1982-11-08', joining_date: '2016-07-15', salary: 78000, blood_group: 'B+', address: '88 Science Blvd, Portland, OR', qualification: 'Ph.D Physics', experience: '9 years', school_name: 'Riverside Academy', status: 'active', createdAt: '2024-01-16T00:00:00Z' },
//   { _id: 'stf-004', employee_id: 'EMP-004', name: 'Diego Ramirez', email: 'diego@oakridge.edu', phone: '+1 555-1004', department: 'History & Social Studies', department_id: 'dept-004', designation: 'Senior Teacher', designation_id: 'desig-004', gender: 'male', dob: '1987-05-30', joining_date: '2019-08-01', salary: 65000, blood_group: 'AB+', address: '23 Heritage Lane, Dallas, TX', qualification: 'M.A History', experience: '6 years', school_name: 'Oakridge International', status: 'active', createdAt: '2024-01-16T00:00:00Z' },
//   { _id: 'stf-005', employee_id: 'EMP-005', name: 'Yuki Tanaka', email: 'yuki@greenwood.edu', phone: '+1 555-1005', department: 'Computer Science', department_id: 'dept-005', designation: 'Teacher', designation_id: 'desig-005', gender: 'female', dob: '1992-09-14', joining_date: '2021-01-10', salary: 62000, blood_group: 'O-', address: '66 Tech Park Rd, Portland, OR', qualification: 'B.Tech Computer Science', experience: '3 years', school_name: 'Greenwood Public', status: 'active', createdAt: '2024-01-17T00:00:00Z' },
//   { _id: 'stf-006', employee_id: 'EMP-006', name: 'Olivia Brooks', email: 'olivia@lincoln.edu', phone: '+1 555-1006', department: 'Commerce', department_id: 'dept-006', designation: 'Teacher', designation_id: 'desig-005', gender: 'female', dob: '1988-12-20', joining_date: '2019-06-01', salary: 60000, blood_group: 'A-', address: '102 Commerce St, Austin, TX', qualification: 'M.Com Accountancy', experience: '5 years', school_name: 'Lincoln High School', status: 'inactive', createdAt: '2024-01-17T00:00:00Z' },
//   { _id: 'stf-007', employee_id: 'EMP-007', name: 'Sam Torres', email: 'sam@lincoln.edu', phone: '+1 555-1007', department: 'Physical Education', department_id: 'dept-007', designation: 'Sports Coach', designation_id: 'desig-012', gender: 'male', dob: '1986-04-18', joining_date: '2017-07-01', salary: 52000, blood_group: 'B-', address: '5 Sports Complex Dr, Austin, TX', qualification: 'B.P.Ed Sports Science', experience: '8 years', school_name: 'Lincoln High School', status: 'active', createdAt: '2024-01-18T00:00:00Z' },
//   { _id: 'stf-008', employee_id: 'EMP-008', name: 'Aisha Patel', email: 'aisha@riverside.edu', phone: '+1 555-1008', department: 'Arts & Music', department_id: 'dept-008', designation: 'Teacher', designation_id: 'desig-005', gender: 'female', dob: '1991-08-05', joining_date: '2022-01-15', salary: 56000, blood_group: 'O+', address: '77 Arts Blvd, Portland, OR', qualification: 'M.F.A Fine Arts', experience: '3 years', school_name: 'Riverside Academy', status: 'active', createdAt: '2024-01-18T00:00:00Z' },
//   { _id: 'stf-009', employee_id: 'EMP-009', name: 'Carlos Mendez', email: 'carlos@lincoln.edu', phone: '+1 555-1009', department: 'Administration', department_id: 'dept-009', designation: 'Administrative Officer', designation_id: 'desig-008', gender: 'male', dob: '1983-02-14', joining_date: '2015-03-01', salary: 55000, blood_group: 'A+', address: '33 Admin Block, Austin, TX', qualification: 'MBA Management', experience: '10 years', school_name: 'Lincoln High School', status: 'active', createdAt: '2024-01-19T00:00:00Z' },
//   { _id: 'stf-010', employee_id: 'EMP-010', name: 'Rachel Green', email: 'rachel@westfield.edu', phone: '+1 555-1010', department: 'Library', department_id: 'dept-010', designation: 'Librarian', designation_id: 'desig-010', gender: 'female', dob: '1989-06-25', joining_date: '2020-09-01', salary: 48000, blood_group: 'B+', address: '18 Book Lane, San Jose, CA', qualification: 'M.Lib Library Science', experience: '4 years', school_name: 'Westfield College', status: 'disabled', createdAt: '2024-01-19T00:00:00Z' },
//   { _id: 'stf-011', employee_id: 'EMP-011', name: 'Noah Carter', email: 'noah.c@lincoln.edu', phone: '+1 555-1011', department: 'Mathematics', department_id: 'dept-001', designation: 'Assistant Teacher', designation_id: 'desig-006', gender: 'male', dob: '1995-01-12', joining_date: '2023-07-01', salary: 45000, blood_group: 'O+', address: '99 Elm St, Austin, TX', qualification: 'B.Sc Mathematics', experience: '1 year', school_name: 'Lincoln High School', status: 'active', createdAt: '2024-01-20T00:00:00Z' },
//   { _id: 'stf-012', employee_id: 'EMP-012', name: 'Fatima Hassan', email: 'fatima@oakridge.edu', phone: '+1 555-1012', department: 'Science', department_id: 'dept-002', designation: 'Lab Assistant', designation_id: 'desig-007', gender: 'female', dob: '1994-10-08', joining_date: '2022-08-01', salary: 40000, blood_group: 'AB-', address: '55 Lab Complex, Dallas, TX', qualification: 'B.Sc Chemistry', experience: '2 years', school_name: 'Oakridge International', status: 'active', createdAt: '2024-01-20T00:00:00Z' },
//   { _id: 'stf-013', employee_id: 'EMP-013', name: 'James Okafor', email: 'james.o@riverside.edu', phone: '+1 555-1013', department: 'Administration', department_id: 'dept-009', designation: 'Accountant', designation_id: 'desig-009', gender: 'male', dob: '1987-03-22', joining_date: '2018-11-01', salary: 58000, blood_group: 'A+', address: '44 Finance Blvd, Portland, OR', qualification: 'B.Com Accounts', experience: '7 years', school_name: 'Riverside Academy', status: 'active', createdAt: '2024-01-21T00:00:00Z' },
//   { _id: 'stf-014', employee_id: 'EMP-014', name: 'Elena Voronova', email: 'elena@northgate.edu', phone: '+1 555-1014', department: 'Administration', department_id: 'dept-009', designation: 'Counselor', designation_id: 'desig-011', gender: 'female', dob: '1986-07-16', joining_date: '2019-04-01', salary: 62000, blood_group: 'B+', address: '20 Wellness Park, New York, NY', qualification: 'M.Sc Psychology', experience: '6 years', school_name: 'Northgate University College', status: 'active', createdAt: '2024-01-21T00:00:00Z' },
//   { _id: 'stf-015', employee_id: 'EMP-015', name: 'Thomas Wright', email: 'thomas@greenwood.edu', phone: '+1 555-1015', department: 'English', department_id: 'dept-003', designation: 'Senior Teacher', designation_id: 'desig-004', gender: 'male', dob: '1984-09-30', joining_date: '2017-01-01', salary: 68000, blood_group: 'O+', address: '7 Literary Lane, Portland, OR', qualification: 'M.A English', experience: '8 years', school_name: 'Greenwood Public', status: 'disabled', createdAt: '2024-01-22T00:00:00Z' },
// ]

// // ─── Leave Types ──────────────────────────────────────────────────────────────
// export const leaveTypes = [
//   { _id: 'lvt-001', name: 'Sick Leave', code: 'SL', max_days: 12, paid: true, carry_forward: false, description: 'Medical illness or injury leave', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//   { _id: 'lvt-002', name: 'Casual Leave', code: 'CL', max_days: 10, paid: true, carry_forward: false, description: 'Short personal or family leaves', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
//   { _id: 'lvt-003', name: 'Earned Leave', code: 'EL', max_days: 30, paid: true, carry_forward: true, description: 'Accrued based on service duration', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//   { _id: 'lvt-004', name: 'Maternity Leave', code: 'ML', max_days: 180, paid: true, carry_forward: false, description: 'Leave for maternity and childcare', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
//   { _id: 'lvt-005', name: 'Paternity Leave', code: 'PL', max_days: 15, paid: true, carry_forward: false, description: 'Leave for fathers on birth of child', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   { _id: 'lvt-006', name: 'Emergency Leave', code: 'EML', max_days: 5, paid: false, carry_forward: false, description: 'Unforeseen emergency situations', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
//   { _id: 'lvt-007', name: 'Study Leave', code: 'STL', max_days: 30, paid: false, carry_forward: false, description: 'For academic courses and examinations', status: 'active', createdAt: '2024-01-13T00:00:00Z' },
//   { _id: 'lvt-008', name: 'Sabbatical Leave', code: 'SABL', max_days: 365, paid: false, carry_forward: false, description: 'Extended leave for research or projects', status: 'inactive', createdAt: '2024-01-14T00:00:00Z' },
// ]

// // ─── Staff Leave Applications ─────────────────────────────────────────────────
// export const staffLeaves = [
//   { _id: 'slv-001', employee_id: 'stf-001', employee_name: 'Hannah Kim', department: 'Mathematics', designation: 'Head of Department', leave_type: 'Sick Leave', leave_type_id: 'lvt-001', from: '2025-04-22', to: '2025-04-23', days: 2, reason: 'Viral fever, doctor advised rest.', applied_on: '2025-04-21T09:00:00Z', status: 'pending', approved_by: null, attachment: 'medical-cert.pdf' },
//   { _id: 'slv-002', employee_id: 'stf-002', employee_name: 'Marcus Johnson', department: 'English', designation: 'Teacher', leave_type: 'Casual Leave', leave_type_id: 'lvt-002', from: '2025-04-18', to: '2025-04-19', days: 2, reason: 'Personal family function.', applied_on: '2025-04-16T14:00:00Z', status: 'approved', approved_by: 'Carlos Mendez', attachment: null },
//   { _id: 'slv-003', employee_id: 'stf-003', employee_name: 'Priya Patel', department: 'Science', designation: 'Head of Department', leave_type: 'Earned Leave', leave_type_id: 'lvt-003', from: '2025-04-28', to: '2025-05-02', days: 5, reason: 'Annual vacation with family.', applied_on: '2025-04-14T10:00:00Z', status: 'approved', approved_by: 'Carlos Mendez', attachment: null },
//   { _id: 'slv-004', employee_id: 'stf-004', employee_name: 'Diego Ramirez', department: 'History & Social Studies', designation: 'Senior Teacher', leave_type: 'Emergency Leave', leave_type_id: 'lvt-006', from: '2025-04-15', to: '2025-04-16', days: 2, reason: 'Family emergency.', applied_on: '2025-04-15T06:30:00Z', status: 'rejected', approved_by: 'Carlos Mendez', attachment: null },
//   { _id: 'slv-005', employee_id: 'stf-007', employee_name: 'Sam Torres', department: 'Physical Education', designation: 'Sports Coach', leave_type: 'Sick Leave', leave_type_id: 'lvt-001', from: '2025-04-24', to: '2025-04-24', days: 1, reason: 'Back injury during practice.', applied_on: '2025-04-23T18:00:00Z', status: 'pending', approved_by: null, attachment: 'x-ray.pdf' },
//   { _id: 'slv-006', employee_id: 'stf-008', employee_name: 'Aisha Patel', department: 'Arts & Music', designation: 'Teacher', leave_type: 'Casual Leave', leave_type_id: 'lvt-002', from: '2025-04-25', to: '2025-04-25', days: 1, reason: 'Bank work and personal tasks.', applied_on: '2025-04-22T11:00:00Z', status: 'pending', approved_by: null, attachment: null },
//   { _id: 'slv-007', employee_id: 'stf-013', employee_name: 'James Okafor', department: 'Administration', designation: 'Accountant', leave_type: 'Study Leave', leave_type_id: 'lvt-007', from: '2025-05-10', to: '2025-05-12', days: 3, reason: 'CPA certification exam.', applied_on: '2025-04-20T09:00:00Z', status: 'approved', approved_by: 'Carlos Mendez', attachment: 'exam-schedule.pdf' },
//   { _id: 'slv-008', employee_id: 'stf-014', employee_name: 'Elena Voronova', department: 'Administration', designation: 'Counselor', leave_type: 'Casual Leave', leave_type_id: 'lvt-002', from: '2025-04-26', to: '2025-04-27', days: 2, reason: 'Attending a wellness conference.', applied_on: '2025-04-21T15:00:00Z', status: 'pending', approved_by: null, attachment: 'conference-invite.pdf' },
//   { _id: 'slv-009', employee_id: 'stf-005', employee_name: 'Yuki Tanaka', department: 'Computer Science', designation: 'Teacher', leave_type: 'Earned Leave', leave_type_id: 'lvt-003', from: '2025-05-05', to: '2025-05-09', days: 5, reason: 'Planned vacation.', applied_on: '2025-04-18T10:00:00Z', status: 'approved', approved_by: 'Carlos Mendez', attachment: null },
//   { _id: 'slv-010', employee_id: 'stf-011', employee_name: 'Noah Carter', department: 'Mathematics', designation: 'Assistant Teacher', leave_type: 'Sick Leave', leave_type_id: 'lvt-001', from: '2025-04-20', to: '2025-04-21', days: 2, reason: 'Severe cold and fever.', applied_on: '2025-04-20T07:00:00Z', status: 'rejected', approved_by: 'Carlos Mendez', attachment: null },
// ]

// // ─── Staff Attendance ──────────────────────────────────────────────────────────
// const ATTENDANCE_STATUSES = ['present', 'present', 'present', 'absent', 'present', 'present', 'leave', 'present', 'late', 'present', 'present', 'present', 'late', 'absent', 'present']

// function buildStaffAttendance(date = '2025-04-21') {
//   return staff
//     .filter((s) => s.status === 'active')
//     .map((s, i) => ({
//       _id: `sa-${s._id}-${date}`,
//       employee_id: s._id,
//       employee_code: s.employee_id,
//       name: s.name,
//       department: s.department,
//       designation: s.designation,
//       status: ATTENDANCE_STATUSES[i % ATTENDANCE_STATUSES.length],
//       check_in: i % 3 === 0 ? '08:30' : i % 4 === 0 ? '09:05' : '08:02',
//       check_out: i % 5 === 0 ? '16:45' : '17:00',
//       date,
//       working_hours: i % 3 === 0 ? '8h 15m' : '8h 58m',
//       remarks: '',
//     }))
// }

// export const staffAttendance = buildStaffAttendance()

// export function getStaffAttendanceByDate(date) {
//   return buildStaffAttendance(date)
// }

// // ─── Payroll ──────────────────────────────────────────────────────────────────
// export const payrollMonths = ['April 2025', 'March 2025', 'February 2025', 'January 2025', 'December 2024']

// export const payroll = staff
//   .filter((s) => s.status === 'active')
//   .map((s, i) => {
//     const basic = s.salary
//     const hra = Math.round(basic * 0.15)
//     const transport = 1200
//     const medical = 500
//     const totalAllowances = hra + transport + medical
//     const pf = Math.round(basic * 0.12)
//     const tax = Math.round(basic * 0.05)
//     const totalDeductions = pf + tax
//     const netSalary = basic + totalAllowances - totalDeductions
//     return {
//       _id: `pay-${s._id}`,
//       employee_id: s._id,
//       employee_code: s.employee_id,
//       name: s.name,
//       department: s.department,
//       designation: s.designation,
//       month: 'April 2025',
//       basic_salary: basic,
//       hra,
//       transport_allowance: transport,
//       medical_allowance: medical,
//       total_allowances: totalAllowances,
//       pf_deduction: pf,
//       tax_deduction: tax,
//       other_deductions: 0,
//       total_deductions: totalDeductions,
//       net_salary: netSalary,
//       bank_account: `****${1000 + i}`,
//       status: i % 5 === 0 ? 'pending' : 'paid',
//       payment_date: i % 5 === 0 ? null : '2025-04-30',
//       createdAt: '2025-04-25T00:00:00Z',
//     }
//   })

// // ─── Teachers Rating ──────────────────────────────────────────────────────────
// export const teachersRating = staff
//   .filter((s) => ['Mathematics', 'English', 'Science', 'History & Social Studies', 'Computer Science', 'Commerce', 'Arts & Music'].includes(s.department))
//   .map((s, i) => ({
//     _id: `tr-${s._id}`,
//     employee_id: s._id,
//     employee_code: s.employee_id,
//     name: s.name,
//     department: s.department,
//     designation: s.designation,
//     period: '2024-2025',
//     teaching_skills: 3.5 + (i % 3) * 0.5,
//     punctuality: 4.0 + (i % 2) * 0.5,
//     student_engagement: 3.8 + (i % 4) * 0.2,
//     classroom_management: 4.2 - (i % 3) * 0.2,
//     subject_knowledge: 4.5 - (i % 2) * 0.3,
//     overall_rating: parseFloat((4.0 + (i % 5) * 0.1 - (i % 3) * 0.05).toFixed(1)),
//     rated_by: 'Carlos Mendez',
//     rated_on: '2025-04-15T00:00:00Z',
//     comments: i % 3 === 0 ? 'Excellent performance across all parameters.' : i % 3 === 1 ? 'Good teacher, can improve student engagement.' : 'Meeting expectations consistently.',
//     status: 'rated',
//   }))

// // ─── Leave Balance ──────────────────────────────────────────────────────────────
// export const leaveBalance = {
//   sick_leave: { total: 12, used: 3, remaining: 9 },
//   casual_leave: { total: 10, used: 2, remaining: 8 },
//   earned_leave: { total: 30, used: 5, remaining: 25 },
//   emergency_leave: { total: 5, used: 0, remaining: 5 },
// }

// // ─── HR Stats ──────────────────────────────────────────────────────────────────
// export const hrStats = {
//   total_staff: staff.length,
//   active_staff: staff.filter((s) => s.status === 'active').length,
//   departments: departments.filter((d) => d.status === 'active').length,
//   designations: designations.filter((d) => d.status === 'active').length,
//   on_leave_today: 3,
//   pending_leaves: staffLeaves.filter((l) => l.status === 'pending').length,
//   payroll_pending: payroll.filter((p) => p.status === 'pending').length,
//   new_joinings_this_month: 2,
// }
