// ─── Certificate Module Mock Data ──────────────────────────────────────────────
// All structures mirror the backend certificate model field names.
// INTEGRATION: delete this file once real endpoints are wired in
// certificate.service.js. Only the service imports this file.

// ─── Student Certificates ──────────────────────────────────────────────────────
// `certificate_type`: Character Certificate, Transfer Certificate,
// Migration Certificate, Bonafide Certificate.
// `status`: issued, pending, draft.
export const studentCertificates = [
  { _id: 'sc-001', certificate_name: 'Character Certificate - Aarav', certificate_type: 'Character Certificate', student_id: 'stu-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class_name: '10-A', status: 'issued', issue_date: '2024-09-15', created_by: 'Admin Office', createdAt: '2024-09-15T10:00:00Z' },
  { _id: 'sc-002', certificate_name: 'Transfer Certificate - Emma', certificate_type: 'Transfer Certificate', student_id: 'stu-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class_name: '9-B', status: 'issued', issue_date: '2024-09-18', created_by: 'Admin Office', createdAt: '2024-09-18T11:30:00Z' },
  { _id: 'sc-003', certificate_name: 'Migration Certificate - Liam', certificate_type: 'Migration Certificate', student_id: 'stu-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', class_name: '11-A', status: 'pending', issue_date: null, created_by: 'Principal', createdAt: '2024-09-20T09:15:00Z' },
  { _id: 'sc-004', certificate_name: 'Bonafide Certificate - Noah', certificate_type: 'Bonafide Certificate', student_id: 'stu-005', student_name: 'Noah Brown', admission_no: 'ADM-1005', class_name: 'Year-1', status: 'issued', issue_date: '2024-09-22', created_by: 'Admin Office', createdAt: '2024-09-22T14:00:00Z' },
  { _id: 'sc-005', certificate_name: 'Character Certificate - Ava', certificate_type: 'Character Certificate', student_id: 'stu-008', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class_name: '10-B', status: 'draft', issue_date: null, created_by: 'Class Teacher', createdAt: '2024-09-25T08:45:00Z' },
  { _id: 'sc-006', certificate_name: 'Transfer Certificate - Ethan', certificate_type: 'Transfer Certificate', student_id: 'stu-007', student_name: 'Ethan Lee', admission_no: 'ADM-1007', class_name: 'Year-2', status: 'pending', issue_date: null, created_by: 'Principal', createdAt: '2024-09-26T13:20:00Z' },
  { _id: 'sc-007', certificate_name: 'Bonafide Certificate - Mia', certificate_type: 'Bonafide Certificate', student_id: 'stu-010', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class_name: '9-A', status: 'issued', issue_date: '2024-09-28', created_by: 'Admin Office', createdAt: '2024-09-28T10:10:00Z' },
  { _id: 'sc-008', certificate_name: 'Character Certificate - Lucas', certificate_type: 'Character Certificate', student_id: 'stu-009', student_name: 'Lucas Anderson', admission_no: 'ADM-1009', class_name: '11-B', status: 'issued', issue_date: '2024-09-30', created_by: 'Class Teacher', createdAt: '2024-09-30T15:30:00Z' },
  { _id: 'sc-009', certificate_name: 'Migration Certificate - Olivia', certificate_type: 'Migration Certificate', student_id: 'stu-006', student_name: 'Olivia Davis', admission_no: 'ADM-1006', class_name: '12-A', status: 'draft', issue_date: null, created_by: 'Principal', createdAt: '2024-10-01T09:00:00Z' },
  { _id: 'sc-010', certificate_name: 'Bonafide Certificate - Charlotte', certificate_type: 'Bonafide Certificate', student_id: 'stu-014', student_name: 'Charlotte Brooks', admission_no: 'ADM-1014', class_name: '8-A', status: 'pending', issue_date: null, created_by: 'Admin Office', createdAt: '2024-10-02T12:00:00Z' },
]

// ─── Generated Certificates ────────────────────────────────────────────────────
// `status`: generated, printed, downloaded.
export const generatedCertificates = [
  { _id: 'gc-001', certificate_id: 'sc-001', certificate_name: 'Character Certificate - Aarav', certificate_type: 'Character Certificate', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class_name: '10-A', template_name: 'Standard Character Template', status: 'printed', generated_at: '2024-09-15T10:30:00Z', download_url: '/downloads/gc-001.pdf', createdAt: '2024-09-15T10:30:00Z' },
  { _id: 'gc-002', certificate_id: 'sc-002', certificate_name: 'Transfer Certificate - Emma', certificate_type: 'Transfer Certificate', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class_name: '9-B', template_name: 'Transfer Certificate Template', status: 'downloaded', generated_at: '2024-09-18T12:00:00Z', download_url: '/downloads/gc-002.pdf', createdAt: '2024-09-18T12:00:00Z' },
  { _id: 'gc-003', certificate_id: 'sc-004', certificate_name: 'Bonafide Certificate - Noah', certificate_type: 'Bonafide Certificate', student_name: 'Noah Brown', admission_no: 'ADM-1005', class_name: 'Year-1', template_name: 'Bonafide Template A', status: 'generated', generated_at: '2024-09-22T14:30:00Z', download_url: '/downloads/gc-003.pdf', createdAt: '2024-09-22T14:30:00Z' },
  { _id: 'gc-004', certificate_id: 'sc-007', certificate_name: 'Bonafide Certificate - Mia', certificate_type: 'Bonafide Certificate', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class_name: '9-A', template_name: 'Bonafide Template A', status: 'printed', generated_at: '2024-09-28T10:45:00Z', download_url: '/downloads/gc-004.pdf', createdAt: '2024-09-28T10:45:00Z' },
  { _id: 'gc-005', certificate_id: 'sc-008', certificate_name: 'Character Certificate - Lucas', certificate_type: 'Character Certificate', student_name: 'Lucas Anderson', admission_no: 'ADM-1009', class_name: '11-B', template_name: 'Standard Character Template', status: 'downloaded', generated_at: '2024-09-30T16:00:00Z', download_url: '/downloads/gc-005.pdf', createdAt: '2024-09-30T16:00:00Z' },
  { _id: 'gc-006', certificate_id: 'sc-001', certificate_name: 'Character Certificate - Aarav (Duplicate)', certificate_type: 'Character Certificate', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class_name: '10-A', template_name: 'Standard Character Template', status: 'generated', generated_at: '2024-10-03T09:30:00Z', download_url: '/downloads/gc-006.pdf', createdAt: '2024-10-03T09:30:00Z' },
  { _id: 'gc-007', certificate_id: 'sc-002', certificate_name: 'Transfer Certificate - Emma (Copy)', certificate_type: 'Transfer Certificate', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class_name: '9-B', template_name: 'Transfer Certificate Template', status: 'generated', generated_at: '2024-10-04T11:15:00Z', download_url: '/downloads/gc-007.pdf', createdAt: '2024-10-04T11:15:00Z' },
  { _id: 'gc-008', certificate_id: 'sc-004', certificate_name: 'Bonafide Certificate - Noah (Copy)', certificate_type: 'Bonafide Certificate', student_name: 'Noah Brown', admission_no: 'ADM-1005', class_name: 'Year-1', template_name: 'Bonafide Template A', status: 'printed', generated_at: '2024-10-05T13:45:00Z', download_url: '/downloads/gc-008.pdf', createdAt: '2024-10-05T13:45:00Z' },
]

// ─── Student ID Cards ──────────────────────────────────────────────────────────
// `status`: active, inactive.
export const studentIdCards = [
  { _id: 'sid-001', card_name: 'Student ID - Aarav Sharma', student_id: 'stu-001', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class_name: '10-A', section: 'A', father_name: 'Rajesh Sharma', mother_name: 'Sunita Sharma', dob: '2008-05-14', address: '12 MG Road, Pune', phone: '9876543210', blood_group: 'B+', photo_url: '/photos/stu-001.jpg', status: 'active', validity: '2025-06-30', createdAt: '2024-07-01T09:00:00Z' },
  { _id: 'sid-002', card_name: 'Student ID - Emma Wilson', student_id: 'stu-002', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class_name: '9-B', section: 'B', father_name: 'David Wilson', mother_name: 'Sarah Wilson', dob: '2009-03-22', address: '45 Lake View, Mumbai', phone: '9876543211', blood_group: 'O+', photo_url: '/photos/stu-002.jpg', status: 'active', validity: '2025-06-30', createdAt: '2024-07-01T09:05:00Z' },
  { _id: 'sid-003', card_name: 'Student ID - Liam Chen', student_id: 'stu-003', student_name: 'Liam Chen', admission_no: 'ADM-1003', class_name: '11-A', section: 'A', father_name: 'Wei Chen', mother_name: 'Mei Chen', dob: '2007-11-08', address: '78 Hill Street, Delhi', phone: '9876543212', blood_group: 'A+', photo_url: '/photos/stu-003.jpg', status: 'active', validity: '2025-06-30', createdAt: '2024-07-01T09:10:00Z' },
  { _id: 'sid-004', card_name: 'Student ID - Noah Brown', student_id: 'stu-005', student_name: 'Noah Brown', admission_no: 'ADM-1005', class_name: 'Year-1', section: 'C', father_name: 'Michael Brown', mother_name: 'Jennifer Brown', dob: '2006-07-19', address: '23 Park Lane, Bangalore', phone: '9876543213', blood_group: 'AB+', photo_url: '/photos/stu-005.jpg', status: 'active', validity: '2025-06-30', createdAt: '2024-07-02T10:00:00Z' },
  { _id: 'sid-005', card_name: 'Student ID - Ava Martinez', student_id: 'stu-008', student_name: 'Ava Martinez', admission_no: 'ADM-1008', class_name: '10-B', section: 'B', father_name: 'Carlos Martinez', mother_name: 'Elena Martinez', dob: '2008-01-30', address: '56 Garden Road, Chennai', phone: '9876543214', blood_group: 'O-', photo_url: '/photos/stu-008.jpg', status: 'inactive', validity: '2025-06-30', createdAt: '2024-07-02T10:15:00Z' },
  { _id: 'sid-006', card_name: 'Student ID - Mia Thompson', student_id: 'stu-010', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class_name: '9-A', section: 'A', father_name: 'James Thompson', mother_name: 'Linda Thompson', dob: '2009-09-12', address: '89 River Side, Hyderabad', phone: '9876543215', blood_group: 'B-', photo_url: '/photos/stu-010.jpg', status: 'active', validity: '2025-06-30', createdAt: '2024-07-03T11:30:00Z' },
  { _id: 'sid-007', card_name: 'Student ID - Lucas Anderson', student_id: 'stu-009', student_name: 'Lucas Anderson', admission_no: 'ADM-1009', class_name: '11-B', section: 'B', father_name: 'Robert Anderson', mother_name: 'Patricia Anderson', dob: '2007-04-25', address: '34 College Road, Kolkata', phone: '9876543216', blood_group: 'A-', photo_url: '/photos/stu-009.jpg', status: 'active', validity: '2025-06-30', createdAt: '2024-07-03T11:45:00Z' },
  { _id: 'sid-008', card_name: 'Student ID - Charlotte Brooks', student_id: 'stu-014', student_name: 'Charlotte Brooks', admission_no: 'ADM-1014', class_name: '8-A', section: 'A', father_name: 'Thomas Brooks', mother_name: 'Nancy Brooks', dob: '2010-12-03', address: '67 School Lane, Jaipur', phone: '9876543217', blood_group: 'AB-', photo_url: '/photos/stu-014.jpg', status: 'inactive', validity: '2025-06-30', createdAt: '2024-07-04T14:00:00Z' },
]

// ─── Generated Student ID Cards ────────────────────────────────────────────────
// `status`: generated, printed.
export const generatedStudentIdCards = [
  { _id: 'gsid-001', card_id: 'sid-001', card_name: 'Student ID - Aarav Sharma', student_name: 'Aarav Sharma', admission_no: 'ADM-1001', class_name: '10-A', template_name: 'Standard Student ID Template', status: 'printed', generated_at: '2024-07-01T09:30:00Z', createdAt: '2024-07-01T09:30:00Z' },
  { _id: 'gsid-002', card_id: 'sid-002', card_name: 'Student ID - Emma Wilson', student_name: 'Emma Wilson', admission_no: 'ADM-1002', class_name: '9-B', template_name: 'Standard Student ID Template', status: 'generated', generated_at: '2024-07-01T09:35:00Z', createdAt: '2024-07-01T09:35:00Z' },
  { _id: 'gsid-003', card_id: 'sid-003', card_name: 'Student ID - Liam Chen', student_name: 'Liam Chen', admission_no: 'ADM-1003', class_name: '11-A', template_name: 'Premium ID Template', status: 'printed', generated_at: '2024-07-01T09:40:00Z', createdAt: '2024-07-01T09:40:00Z' },
  { _id: 'gsid-004', card_id: 'sid-004', card_name: 'Student ID - Noah Brown', student_name: 'Noah Brown', admission_no: 'ADM-1005', class_name: 'Year-1', template_name: 'Standard Student ID Template', status: 'generated', generated_at: '2024-07-02T10:30:00Z', createdAt: '2024-07-02T10:30:00Z' },
  { _id: 'gsid-005', card_id: 'sid-006', card_name: 'Student ID - Mia Thompson', student_name: 'Mia Thompson', admission_no: 'ADM-1010', class_name: '9-A', template_name: 'Premium ID Template', status: 'printed', generated_at: '2024-07-03T12:00:00Z', createdAt: '2024-07-03T12:00:00Z' },
  { _id: 'gsid-006', card_id: 'sid-007', card_name: 'Student ID - Lucas Anderson', student_name: 'Lucas Anderson', admission_no: 'ADM-1009', class_name: '11-B', template_name: 'Standard Student ID Template', status: 'generated', generated_at: '2024-07-03T12:15:00Z', createdAt: '2024-07-03T12:15:00Z' },
]

// ─── Staff ID Cards ────────────────────────────────────────────────────────────
// `status`: active, inactive.
export const staffIdCards = [
  { _id: 'stid-001', card_name: 'Staff ID - Dr. Priya Nair', staff_id: 'stf-001', staff_name: 'Dr. Priya Nair', designation: 'Principal', department: 'Administration', father_name: 'Ramesh Nair', dob: '1975-06-12', address: '101 Staff Quarters, Campus', phone: '9123456701', blood_group: 'O+', photo_url: '/photos/stf-001.jpg', status: 'active', validity: '2025-12-31', createdAt: '2024-06-15T08:00:00Z' },
  { _id: 'stid-002', card_name: 'Staff ID - Mr. Anil Verma', staff_id: 'stf-002', staff_name: 'Mr. Anil Verma', designation: 'Senior Teacher', department: 'Mathematics', father_name: 'Suresh Verma', dob: '1980-03-18', address: '22 Teacher Colony, Pune', phone: '9123456702', blood_group: 'B+', photo_url: '/photos/stf-002.jpg', status: 'active', validity: '2025-12-31', createdAt: '2024-06-15T08:15:00Z' },
  { _id: 'stid-003', card_name: 'Staff ID - Mrs. Kavita Rao', staff_id: 'stf-003', staff_name: 'Mrs. Kavita Rao', designation: 'Teacher', department: 'English', father_name: 'Mohan Rao', dob: '1982-09-25', address: '34 Lake Road, Mumbai', phone: '9123456703', blood_group: 'A+', photo_url: '/photos/stf-003.jpg', status: 'active', validity: '2025-12-31', createdAt: '2024-06-15T08:30:00Z' },
  { _id: 'stid-004', card_name: 'Staff ID - Mr. Sanjay Gupta', staff_id: 'stf-004', staff_name: 'Mr. Sanjay Gupta', designation: 'Lab Assistant', department: 'Science', father_name: 'Dinesh Gupta', dob: '1985-12-10', address: '45 Lab Staff Housing, Delhi', phone: '9123456704', blood_group: 'AB+', photo_url: '/photos/stf-004.jpg', status: 'inactive', validity: '2025-12-31', createdAt: '2024-06-16T09:00:00Z' },
  { _id: 'stid-005', card_name: 'Staff ID - Ms. Ritu Singh', staff_id: 'stf-005', staff_name: 'Ms. Ritu Singh', designation: 'Librarian', department: 'Library', father_name: 'Harish Singh', dob: '1988-02-14', address: '67 Library Quarters, Bangalore', phone: '9123456705', blood_group: 'O-', photo_url: '/photos/stf-005.jpg', status: 'active', validity: '2025-12-31', createdAt: '2024-06-16T09:30:00Z' },
  { _id: 'stid-006', card_name: 'Staff ID - Mr. Deepak Joshi', staff_id: 'stf-006', staff_name: 'Mr. Deepak Joshi', designation: 'Accountant', department: 'Finance', father_name: 'Vijay Joshi', dob: '1979-08-20', address: '12 Accounts Block, Chennai', phone: '9123456706', blood_group: 'A-', photo_url: '/photos/stf-006.jpg', status: 'active', validity: '2025-12-31', createdAt: '2024-06-17T10:00:00Z' },
]

// ─── Generated Staff ID Cards ──────────────────────────────────────────────────
// `status`: generated, printed.
export const generatedStaffIdCards = [
  { _id: 'gstid-001', card_id: 'stid-001', card_name: 'Staff ID - Dr. Priya Nair', staff_name: 'Dr. Priya Nair', designation: 'Principal', template_name: 'Staff ID Premium Template', status: 'printed', generated_at: '2024-06-15T08:45:00Z', createdAt: '2024-06-15T08:45:00Z' },
  { _id: 'gstid-002', card_id: 'stid-002', card_name: 'Staff ID - Mr. Anil Verma', staff_name: 'Mr. Anil Verma', designation: 'Senior Teacher', template_name: 'Standard Staff ID Template', status: 'generated', generated_at: '2024-06-15T09:00:00Z', createdAt: '2024-06-15T09:00:00Z' },
  { _id: 'gstid-003', card_id: 'stid-003', card_name: 'Staff ID - Mrs. Kavita Rao', staff_name: 'Mrs. Kavita Rao', designation: 'Teacher', template_name: 'Standard Staff ID Template', status: 'printed', generated_at: '2024-06-15T09:15:00Z', createdAt: '2024-06-15T09:15:00Z' },
  { _id: 'gstid-004', card_id: 'stid-005', card_name: 'Staff ID - Ms. Ritu Singh', staff_name: 'Ms. Ritu Singh', designation: 'Librarian', template_name: 'Staff ID Premium Template', status: 'generated', generated_at: '2024-06-16T10:00:00Z', createdAt: '2024-06-16T10:00:00Z' },
  { _id: 'gstid-005', card_id: 'stid-006', card_name: 'Staff ID - Mr. Deepak Joshi', staff_name: 'Mr. Deepak Joshi', designation: 'Accountant', template_name: 'Standard Staff ID Template', status: 'printed', generated_at: '2024-06-17T10:30:00Z', createdAt: '2024-06-17T10:30:00Z' },
]

// ─── Certificate Dashboard Stats ──────────────────────────────────────────────
export const certificateStats = {
  total_student_certificates: studentCertificates.length,
  total_generated_certificates: generatedCertificates.length,
  total_student_id_cards: studentIdCards.length,
  total_generated_student_id_cards: generatedStudentIdCards.length,
  total_staff_id_cards: staffIdCards.length,
  total_generated_staff_id_cards: generatedStaffIdCards.length,
  recent_activities: [
    { type: 'certificate', title: 'Character Certificate issued for Aarav Sharma', time: '2024-10-05T14:30:00Z' },
    { type: 'id_card', title: 'Student ID Card generated for Mia Thompson', time: '2024-10-05T12:00:00Z' },
    { type: 'certificate', title: 'Transfer Certificate downloaded for Emma Wilson', time: '2024-10-04T11:15:00Z' },
    { type: 'staff_id_card', title: 'Staff ID Card printed for Dr. Priya Nair', time: '2024-10-03T15:45:00Z' },
    { type: 'certificate', title: 'Bonafide Certificate created for Charlotte Brooks', time: '2024-10-02T12:00:00Z' },
  ],
}
