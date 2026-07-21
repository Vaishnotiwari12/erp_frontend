// Dev-only mock helpers aligned with School_erp-b-main model field names.
// INTEGRATION: delete this file once real endpoints are wired in the services.

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

// Matches centralModels.js schoolSchema: school_name, domain, mongo_uri, status.
export const schools = [
  { _id: 'sch-001', school_name: 'Lincoln High School', domain: 'lincoln.edu', mongo_uri: 'mongodb://localhost:27017/lincolnhighschool_db', status: 'active', createdAt: '2025-01-12T09:00:00Z' },
  { _id: 'sch-002', school_name: 'Riverside Academy', domain: 'riverside.edu', mongo_uri: 'mongodb://localhost:27017/riversideacademy_db', status: 'active', createdAt: '2025-02-03T10:30:00Z' },
  { _id: 'sch-003', school_name: 'Greenwood Public', domain: 'greenwood.edu', mongo_uri: 'mongodb://localhost:27017/greenwoodpublic_db', status: 'active', createdAt: '2024-11-20T14:00:00Z' },
  { _id: 'sch-004', school_name: 'St. Mary’s Convent', domain: 'stmarys.edu', mongo_uri: 'mongodb://localhost:27017/stmarysconvent_db', status: 'inactive', createdAt: '2025-03-08T08:15:00Z' },
  { _id: 'sch-005', school_name: 'Oakridge International', domain: 'oakridge.edu', mongo_uri: 'mongodb://localhost:27017/oakridgeinternational_db', status: 'active', createdAt: '2025-01-30T11:45:00Z' },
  { _id: 'sch-006', school_name: 'Sunrise Valley School', domain: 'sunrise.edu', mongo_uri: 'mongodb://localhost:27017/sunrisevalleyschool_db', status: 'suspended', createdAt: '2025-04-15T16:20:00Z' },
]

// Matches college.controller.js collegeSchema: college_name, college_code, type, status, address, phone, email.
export const colleges = [
  { _id: 'col-001', college_name: 'Westfield College', college_code: 'WFC-101', type: 'Degree', status: 'active', address: 'San Jose, CA', phone: '+1 555-0101', email: 'info@westfield.edu', createdAt: '2024-09-14T09:00:00Z' },
  { _id: 'col-002', college_name: 'Northgate University College', college_code: 'NGU-202', type: 'University', status: 'active', address: 'New York, NY', phone: '+1 555-0102', email: 'info@northgate.edu', createdAt: '2024-08-02T12:00:00Z' },
  { _id: 'col-003', college_name: 'Pinnacle College of Arts', college_code: 'PCA-303', type: 'Diploma', status: 'inactive', address: 'Portland, OR', phone: '+1 555-0103', email: 'info@pinnacle.edu', createdAt: '2025-02-22T15:30:00Z' },
  { _id: 'col-004', college_name: 'Heritage College of Science', college_code: 'HCS-404', type: 'Degree', status: 'active', address: 'Dallas, TX', phone: '+1 555-0104', email: 'info@heritage.edu', createdAt: '2025-01-05T08:00:00Z' },
]

// Domains mirror the School model (domain-based tenant resolution).
export const domains = [
  { _id: 'dom-001', domain: 'lincoln.edu', school_name: 'Lincoln High School', status: 'active', verified: true, ssl: 'Active', createdAt: '2025-01-12T09:00:00Z' },
  { _id: 'dom-002', domain: 'riverside.edu', school_name: 'Riverside Academy', status: 'active', verified: true, ssl: 'Active', createdAt: '2025-02-03T10:30:00Z' },
  { _id: 'dom-003', domain: 'westfield.edu', school_name: 'Westfield College', status: 'active', verified: true, ssl: 'Active', createdAt: '2024-09-14T09:00:00Z' },
  { _id: 'dom-004', domain: 'pinnacle.edu', school_name: 'Pinnacle College of Arts', status: 'inactive', verified: false, ssl: 'Pending', createdAt: '2025-02-22T15:30:00Z' },
  { _id: 'dom-005', domain: 'stmarys.edu', school_name: 'St. Mary’s Convent', status: 'inactive', verified: false, ssl: 'Inactive', createdAt: '2025-03-08T08:15:00Z' },
]

// Matches studentInformationModels studentModel: name { first, last }, email, mobile, class, section, admission_no, status.
export const students = [
  { _id: 'stu-001', name: { first: 'Aarav', last: 'Sharma' }, email: 'aarav@lincoln.edu', mobile: '+1 555-0201', admission_no: 'ADM-1001', class: '10-A', section: 'A', school_name: 'Lincoln High School', status: 'active', guardian_name: 'Rohit Sharma', admission_date: '2024-08-15T00:00:00Z', gender: 'male', dob: '2008-04-12', address: '1204 Cedar Lane, Austin, TX', category: 'General', house: 'Red House', blood_group: 'O+', nationality: 'American' },
  { _id: 'stu-002', name: { first: 'Emma', last: 'Wilson' }, email: 'emma@lincoln.edu', mobile: '+1 555-0202', admission_no: 'ADM-1002', class: '9-B', section: 'B', school_name: 'Lincoln High School', status: 'active', guardian_name: 'James Wilson', admission_date: '2024-08-16T00:00:00Z', gender: 'female', dob: '2009-06-22', address: '88 Hillcrest Ave, Austin, TX', category: 'OBC', house: 'Blue House', blood_group: 'A+', nationality: 'American' },
  { _id: 'stu-003', name: { first: 'Liam', last: 'Chen' }, email: 'liam@riverside.edu', mobile: '+1 555-0203', admission_no: 'ADM-1003', class: '11-A', section: 'A', school_name: 'Riverside Academy', status: 'active', guardian_name: 'Wei Chen', admission_date: '2024-08-20T00:00:00Z', gender: 'male', dob: '2007-01-30', address: '55 Park Street, Portland, OR', category: 'General', house: 'Green House', blood_group: 'B+', nationality: 'American' },
  { _id: 'stu-004', name: { first: 'Sofia', last: 'Garcia' }, email: 'sofia@oakridge.edu', mobile: '+1 555-0204', admission_no: 'ADM-1004', class: '8-C', section: 'C', school_name: 'Oakridge International', status: 'inactive', guardian_name: 'Maria Garcia', admission_date: '2025-03-01T00:00:00Z', gender: 'female', dob: '2010-09-14', address: '9 Maple Court, Dallas, TX', category: 'SC', house: 'Yellow House', blood_group: 'AB+', nationality: 'American' },
  { _id: 'stu-005', name: { first: 'Noah', last: 'Brown' }, email: 'noah@westfield.edu', mobile: '+1 555-0205', admission_no: 'ADM-1005', class: 'Year-1', section: 'A', school_name: 'Westfield College', status: 'active', guardian_name: 'David Brown', admission_date: '2024-09-05T00:00:00Z', gender: 'male', dob: '2006-11-03', address: '210 University Blvd, San Jose, CA', category: 'General', house: 'Red House', blood_group: 'O-', nationality: 'American' },
  { _id: 'stu-006', name: { first: 'Olivia', last: 'Davis' }, email: 'olivia@greenwood.edu', mobile: '+1 555-0206', admission_no: 'ADM-1006', class: '12-A', section: 'A', school_name: 'Greenwood Public', status: 'suspended', guardian_name: 'Sarah Davis', admission_date: '2023-07-10T00:00:00Z', gender: 'female', dob: '2005-12-08', address: '742 Oakwood Dr, Portland, OR', category: 'OBC', house: 'Blue House', blood_group: 'A-', nationality: 'American' },
  { _id: 'stu-007', name: { first: 'Ethan', last: 'Lee' }, email: 'ethan@northgate.edu', mobile: '+1 555-0207', admission_no: 'ADM-1007', class: 'Year-2', section: 'B', school_name: 'Northgate University College', status: 'active', guardian_name: 'Min Lee', admission_date: '2024-09-01T00:00:00Z', gender: 'male', dob: '2005-03-25', address: '18 College Rd, New York, NY', category: 'General', house: 'Green House', blood_group: 'B-', nationality: 'American' },
  { _id: 'stu-008', name: { first: 'Ava', last: 'Martinez' }, email: 'ava@lincoln.edu', mobile: '+1 555-0208', admission_no: 'ADM-1008', class: '10-B', section: 'B', school_name: 'Lincoln High School', status: 'active', guardian_name: 'Carlos Martinez', admission_date: '2024-08-18T00:00:00Z', gender: 'female', dob: '2008-07-19', address: '330 River Rd, Austin, TX', category: 'SC', house: 'Yellow House', blood_group: 'O+', nationality: 'American' },
  { _id: 'stu-009', name: { first: 'Lucas', last: 'Anderson' }, email: 'lucas@riverside.edu', mobile: '+1 555-0209', admission_no: 'ADM-1009', class: '11-B', section: 'B', school_name: 'Riverside Academy', status: 'active', guardian_name: 'Sophia Anderson', admission_date: '2024-08-22T00:00:00Z', gender: 'male', dob: '2007-02-14', address: '12 Brookside Ln, Portland, OR', category: 'General', house: 'Red House', blood_group: 'A+', nationality: 'American' },
  { _id: 'stu-010', name: { first: 'Mia', last: 'Thompson' }, email: 'mia@oakridge.edu', mobile: '+1 555-0210', admission_no: 'ADM-1010', class: '9-A', section: 'A', school_name: 'Oakridge International', status: 'active', guardian_name: 'Robert Thompson', admission_date: '2024-08-25T00:00:00Z', gender: 'female', dob: '2009-10-05', address: '456 Elm St, Dallas, TX', category: 'OBC', house: 'Blue House', blood_group: 'B+', nationality: 'American' },
  { _id: 'stu-011', name: { first: 'Daniel', last: 'Kim' }, email: 'daniel@greenwood.edu', mobile: '+1 555-0211', admission_no: 'ADM-1011', class: '12-B', section: 'B', school_name: 'Greenwood Public', status: 'disabled', guardian_name: 'Helen Kim', admission_date: '2023-07-15T00:00:00Z', gender: 'male', dob: '2005-05-21', address: '89 Pine St, Portland, OR', category: 'General', house: 'Green House', blood_group: 'AB-', nationality: 'American' },
  { _id: 'stu-012', name: { first: 'Isabella', last: 'Rossi' }, email: 'isabella@westfield.edu', mobile: '+1 555-0212', admission_no: 'ADM-1012', class: 'Year-1', section: 'B', school_name: 'Westfield College', status: 'disabled', guardian_name: 'Gianni Rossi', admission_date: '2024-09-10T00:00:00Z', gender: 'female', dob: '2006-08-17', address: '67 Campus Way, San Jose, CA', category: 'SC', house: 'Yellow House', blood_group: 'O-', nationality: 'American' },
  { _id: 'stu-013', name: { first: 'Henry', last: 'Walker' }, email: 'henry@northgate.edu', mobile: '+1 555-0213', admission_no: 'ADM-1013', class: 'Year-3', section: 'A', school_name: 'Northgate University College', status: 'active', guardian_name: 'Grace Walker', admission_date: '2024-09-03T00:00:00Z', gender: 'male', dob: '2004-12-01', address: '34 Scholar Dr, New York, NY', category: 'General', house: 'Red House', blood_group: 'A+', nationality: 'American' },
  { _id: 'stu-014', name: { first: 'Charlotte', last: 'Brooks' }, email: 'charlotte@lincoln.edu', mobile: '+1 555-0214', admission_no: 'ADM-1014', class: '8-A', section: 'A', school_name: 'Lincoln High School', status: 'active', guardian_name: 'Oliver Brooks', admission_date: '2025-01-12T00:00:00Z', gender: 'female', dob: '2010-03-30', address: '901 Willow Ct, Austin, TX', category: 'OBC', house: 'Blue House', blood_group: 'B-', nationality: 'American' },
]

// Student categories (studentInformationRoutes/studentCategoryRoutes).
export const studentCategories = [
  { _id: 'cat-001', name: 'General', description: 'Open category students', code: 'GEN', students_count: 184, status: 'active', createdAt: '2024-01-10T00:00:00Z' },
  { _id: 'cat-002', name: 'OBC', description: 'Other Backward Classes', code: 'OBC', students_count: 96, status: 'active', createdAt: '2024-01-11T00:00:00Z' },
  { _id: 'cat-003', name: 'SC', description: 'Scheduled Caste', code: 'SC', students_count: 54, status: 'active', createdAt: '2024-01-12T00:00:00Z' },
  { _id: 'cat-004', name: 'ST', description: 'Scheduled Tribe', code: 'ST', students_count: 32, status: 'active', createdAt: '2024-01-13T00:00:00Z' },
  { _id: 'cat-005', name: 'EWS', description: 'Economically Weaker Section', code: 'EWS', students_count: 21, status: 'inactive', createdAt: '2024-02-01T00:00:00Z' },
]

// Student houses (studentInformationRoutes/studentHouseRoutes).
export const studentHouses = [
  { _id: 'hse-001', name: 'Red House', color: '#dc2626', motto: 'Courage and Strength', students_count: 64, captain: 'Aarav Sharma', status: 'active', createdAt: '2024-01-10T00:00:00Z' },
  { _id: 'hse-002', name: 'Blue House', color: '#2563eb', motto: 'Wisdom and Unity', students_count: 58, captain: 'Emma Wilson', status: 'active', createdAt: '2024-01-11T00:00:00Z' },
  { _id: 'hse-003', name: 'Green House', color: '#16a34a', motto: 'Growth and Harmony', students_count: 52, captain: 'Liam Chen', status: 'active', createdAt: '2024-01-12T00:00:00Z' },
  { _id: 'hse-004', name: 'Yellow House', color: '#ca8a04', motto: 'Energy and Excellence', students_count: 49, captain: 'Sofia Garcia', status: 'active', createdAt: '2024-01-13T00:00:00Z' },
  { _id: 'hse-005', name: 'Purple House', color: '#9333ea', motto: 'Creativity and Pride', students_count: 0, captain: '—', status: 'inactive', createdAt: '2024-03-01T00:00:00Z' },
]

// Matches hrModel.js staffSchema: employee_id, name, email, phone, department_id, designation_id, role, status.
export const users = [
  { _id: 'usr-001', name: 'Alex Morgan', email: 'alex@scholaria.io', role: 'superadmin', school_name: 'Platform', status: 'active', lastActive: '2025-04-20T10:00:00Z' },
  { _id: 'usr-002', name: 'Priya Patel', email: 'priya@lincoln.edu', role: 'admin', school_name: 'Lincoln High School', status: 'active', lastActive: '2025-04-19T14:30:00Z' },
  { _id: 'usr-003', name: 'Marcus Johnson', email: 'marcus@riverside.edu', role: 'admin', school_name: 'Riverside Academy', status: 'active', lastActive: '2025-04-18T09:15:00Z' },
  { _id: 'usr-004', name: 'Hannah Kim', email: 'hannah@westfield.edu', role: 'staff', school_name: 'Westfield College', status: 'active', lastActive: '2025-04-20T08:00:00Z' },
  { _id: 'usr-005', name: 'Diego Ramirez', email: 'diego@oakridge.edu', role: 'staff', school_name: 'Oakridge International', status: 'inactive', lastActive: '2025-04-10T16:45:00Z' },
  { _id: 'usr-006', name: 'Yuki Tanaka', email: 'yuki@greenwood.edu', role: 'staff', school_name: 'Greenwood Public', status: 'active', lastActive: '2025-03-28T11:20:00Z' },
]

export const roles = [
  { _id: 'role-001', name: 'Super Admin', key: 'superadmin', users: 1, permissions: 48, description: 'Full platform access across all tenants' },
  { _id: 'role-002', name: 'Administrator', key: 'admin', users: 12, permissions: 32, description: 'Manage a single institution and its users' },
  { _id: 'role-003', name: 'Staff', key: 'staff', users: 86, permissions: 18, description: 'Teachers and institutional staff access' },
  { _id: 'role-004', name: 'Student', key: 'student', users: 48230, permissions: 6, description: 'Student portal access' },
  { _id: 'role-005', name: 'Parent', key: 'parent', users: 31200, permissions: 6, description: 'Parent portal access' },
]

export const activities = [
  { id: 'act-1', type: 'student', title: 'New admission: Sofia Garcia', meta: 'Oakridge International', time: '2025-04-20T09:30:00Z' },
  { id: 'act-2', type: 'school', title: 'School onboarded: St. Mary’s Convent', meta: 'Chicago, USA', time: '2025-04-19T15:00:00Z' },
  { id: 'act-3', type: 'user', title: 'Admin login: Priya Patel', meta: 'Lincoln High School', time: '2025-04-19T14:30:00Z' },
  { id: 'act-4', type: 'domain', title: 'Domain verified: westfield.edu', meta: 'Westfield College', time: '2025-04-18T11:10:00Z' },
  { id: 'act-5', type: 'college', title: 'College created: Northgate', meta: 'University type', time: '2025-04-17T08:45:00Z' },
]

// Online admissions (studentInformationRoutes/onlineAdmissionRoutes).
export const admissions = [
  { _id: 'adm-001', first_name: 'Sofia', last_name: 'Garcia', email: 'sofia@oakridge.edu', mobile: '+1 555-0301', school_name: 'Oakridge International', class: '8-C', status: 'pending', created_at: '2025-03-01T00:00:00Z', guardian_name: 'Maria Garcia', notes: 'Transferring from another district.' },
  { _id: 'adm-002', first_name: 'James', last_name: 'Okoro', email: 'james@westfield.edu', mobile: '+1 555-0302', school_name: 'Westfield College', class: 'BSc CS', status: 'pending', created_at: '2025-03-12T00:00:00Z', guardian_name: 'Chidi Okoro', notes: 'First-generation college applicant.' },
  { _id: 'adm-003', first_name: 'Mia', last_name: 'Thompson', email: 'mia@lincoln.edu', mobile: '+1 555-0303', school_name: 'Lincoln High School', class: '10-A', status: 'approved', created_at: '2025-02-25T00:00:00Z', guardian_name: 'Robert Thompson', notes: 'Excellent prior academic record.' },
  { _id: 'adm-004', first_name: 'Arjun', last_name: 'Nair', email: 'arjun@northgate.edu', mobile: '+1 555-0304', school_name: 'Northgate University College', class: 'BBA', status: 'pending', created_at: '2025-04-02T00:00:00Z', guardian_name: 'Vijay Nair', notes: 'Requires scholarship consideration.' },
  { _id: 'adm-005', first_name: 'Grace', last_name: 'Park', email: 'grace@oakridge.edu', mobile: '+1 555-0305', school_name: 'Oakridge International', class: '9-A', status: 'rejected', created_at: '2025-04-10T00:00:00Z', guardian_name: 'Helen Park', notes: 'Incomplete documentation submitted.' },
  { _id: 'adm-006', first_name: 'Daniel', last_name: 'Brooks', email: 'daniel@lincoln.edu', mobile: '+1 555-0306', school_name: 'Lincoln High School', class: '11-B', status: 'approved', created_at: '2025-04-15T00:00:00Z', guardian_name: 'Oliver Brooks', notes: 'Honors program eligibility.' },
  { _id: 'adm-007', first_name: 'Yuki', last_name: 'Tanaka', email: 'yuki@riverside.edu', mobile: '+1 555-0307', school_name: 'Riverside Academy', class: '10-C', status: 'pending', created_at: '2025-04-20T00:00:00Z', guardian_name: 'Kenji Tanaka', notes: 'International transfer student.' },
]

// ─── Academics module ───────────────────────────────────────────────────────

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

// ─── Attendance module ──────────────────────────────────────────────────────

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


