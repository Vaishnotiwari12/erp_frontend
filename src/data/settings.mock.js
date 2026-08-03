<<<<<<< HEAD
// ─── Settings Module Mock Data ──────────────────────────────────────────────────
// All structures mirror the backend settings model field names.
// INTEGRATION: delete this file once real endpoints are wired in
// settings.service.js. Only the service imports this file.

// ─── General Settings ────────────────────────────────────────────────────────
export const generalSettings = {
  school_name: 'Scholaria International School',
  school_code: 'SIS-2024',
  address: '123 Education Lane, Knowledge City, 110001',
  phone: '+91 98765 43210',
  email: 'info@scholaria.edu',
  website: 'https://scholaria.edu',
  logo_url: 'https://scholaria.edu/logo.png',
  favicon_url: 'https://scholaria.edu/favicon.ico',
  academic_year: '2024-2025',
  date_format: 'DD/MM/YYYY',
  timezone: 'Asia/Kolkata',
  language: 'en',
  currency: 'INR',
}

// ─── Session Settings ─────────────────────────────────────────────────────────
// `status`: active | inactive
export const sessionSettings = [
  { _id: 'ss-001', session_name: '2024-2025', start_date: '2024-04-01', end_date: '2025-03-31', is_current: true, status: 'active' },
  { _id: 'ss-002', session_name: '2023-2024', start_date: '2023-04-01', end_date: '2024-03-31', is_current: false, status: 'inactive' },
  { _id: 'ss-003', session_name: '2022-2023', start_date: '2022-04-01', end_date: '2023-03-31', is_current: false, status: 'inactive' },
  { _id: 'ss-004', session_name: '2025-2026', start_date: '2025-04-01', end_date: '2026-03-31', is_current: false, status: 'active' },
  { _id: 'ss-005', session_name: '2021-2022', start_date: '2021-04-01', end_date: '2022-03-31', is_current: false, status: 'inactive' },
]

// ─── Role Permissions ────────────────────────────────────────────────────────
// `permissions` is an object keyed by module name with boolean values.
export const rolePermissions = [
  {
    _id: 'rp-001',
    role_name: 'Admin',
    permissions: { Students: true, Academics: true, Attendance: true, Fees: true, HR: true, Library: true, Transport: true, Hostel: true, Inventory: true, Settings: true },
    description: 'Full system access across all modules',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    _id: 'rp-002',
    role_name: 'Teacher',
    permissions: { Students: true, Academics: true, Attendance: true, Fees: false, HR: false, Library: true, Transport: false, Hostel: false, Inventory: false, Settings: false },
    description: 'Manage students, academics, and attendance',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    _id: 'rp-003',
    role_name: 'Accountant',
    permissions: { Students: true, Academics: false, Attendance: false, Fees: true, HR: true, Library: false, Transport: false, Hostel: false, Inventory: false, Settings: false },
    description: 'Manage fees, payments, and HR payroll',
    status: 'active',
    createdAt: '2024-01-03T00:00:00Z',
  },
  {
    _id: 'rp-004',
    role_name: 'Librarian',
    permissions: { Students: true, Academics: false, Attendance: false, Fees: false, HR: false, Library: true, Transport: false, Hostel: false, Inventory: true, Settings: false },
    description: 'Manage library books and inventory',
    status: 'active',
    createdAt: '2024-01-04T00:00:00Z',
  },
  {
    _id: 'rp-005',
    role_name: 'Receptionist',
    permissions: { Students: true, Academics: false, Attendance: false, Fees: false, HR: false, Library: false, Transport: false, Hostel: false, Inventory: false, Settings: false },
    description: 'Front office and student inquiries',
    status: 'active',
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    _id: 'rp-006',
    role_name: 'Super Admin',
    permissions: { Students: true, Academics: true, Attendance: true, Fees: true, HR: true, Library: true, Transport: true, Hostel: true, Inventory: true, Settings: true },
    description: 'Unrestricted access including system settings',
    status: 'active',
    createdAt: '2024-01-06T00:00:00Z',
  },
]

// ─── User Settings ────────────────────────────────────────────────────────────
// `status`: active | inactive
export const userSettings = [
  { _id: 'us-001', name: 'Aarav Sharma', email: 'aarav.sharma@scholaria.edu', role: 'Admin', status: 'active', last_login: '2025-01-15T10:30:00Z', created_at: '2024-01-01T00:00:00Z' },
  { _id: 'us-002', name: 'Emma Wilson', email: 'emma.wilson@scholaria.edu', role: 'Teacher', status: 'active', last_login: '2025-01-14T08:15:00Z', created_at: '2024-01-02T00:00:00Z' },
  { _id: 'us-003', name: 'Liam Chen', email: 'liam.chen@scholaria.edu', role: 'Accountant', status: 'active', last_login: '2025-01-13T14:45:00Z', created_at: '2024-01-03T00:00:00Z' },
  { _id: 'us-004', name: 'Sophia Garcia', email: 'sophia.garcia@scholaria.edu', role: 'Librarian', status: 'active', last_login: '2025-01-12T11:20:00Z', created_at: '2024-01-04T00:00:00Z' },
  { _id: 'us-005', name: 'Noah Brown', email: 'noah.brown@scholaria.edu', role: 'Receptionist', status: 'inactive', last_login: '2024-12-20T09:00:00Z', created_at: '2024-01-05T00:00:00Z' },
  { _id: 'us-006', name: 'Olivia Davis', email: 'olivia.davis@scholaria.edu', role: 'Teacher', status: 'active', last_login: '2025-01-15T07:30:00Z', created_at: '2024-01-06T00:00:00Z' },
  { _id: 'us-007', name: 'Ethan Lee', email: 'ethan.lee@scholaria.edu', role: 'Super Admin', status: 'active', last_login: '2025-01-15T16:10:00Z', created_at: '2024-01-07T00:00:00Z' },
  { _id: 'us-008', name: 'Ava Martinez', email: 'ava.martinez@scholaria.edu', role: 'Teacher', status: 'active', last_login: '2025-01-14T13:00:00Z', created_at: '2024-01-08T00:00:00Z' },
]

// ─── Notification Settings ────────────────────────────────────────────────────
export const notificationSettings = {
  email_notifications: true,
  sms_notifications: false,
  push_notifications: true,
  admission_alerts: true,
  fee_payment_alerts: true,
  attendance_alerts: true,
  exam_result_alerts: true,
  library_alerts: false,
}

// ─── SMS Settings ─────────────────────────────────────────────────────────────
export const smsSettings = {
  sms_gateway: 'Twilio',
  api_key: 'SK1234567890abcdef',
  sender_id: 'SCHLR',
  sms_enabled: true,
  balance: 1250,
  sms_template: 'Dear {parent_name}, your child {student_name} was absent on {date}.',
}

// ─── Payment Settings ─────────────────────────────────────────────────────────
export const paymentSettings = {
  payment_gateway: 'Stripe',
  api_key: 'pk_test_1234567890',
  secret_key: 'sk_test_1234567890',
  sandbox_mode: true,
  currency: 'INR',
  payment_enabled: true,
}

// ─── Currency Settings ────────────────────────────────────────────────────────
// `status`: active | inactive
export const currencySettings = [
  { _id: 'cr-001', currency_code: 'USD', currency_name: 'US Dollar', symbol: '$', exchange_rate: 1, is_default: false, status: 'active' },
  { _id: 'cr-002', currency_code: 'EUR', currency_name: 'Euro', symbol: '€', exchange_rate: 0.92, is_default: false, status: 'active' },
  { _id: 'cr-003', currency_code: 'GBP', currency_name: 'British Pound', symbol: '£', exchange_rate: 0.79, is_default: false, status: 'active' },
  { _id: 'cr-004', currency_code: 'INR', currency_name: 'Indian Rupee', symbol: '₹', exchange_rate: 83.2, is_default: true, status: 'active' },
  { _id: 'cr-005', currency_code: 'JPY', currency_name: 'Japanese Yen', symbol: '¥', exchange_rate: 149.5, is_default: false, status: 'inactive' },
]

// ─── Language Settings ────────────────────────────────────────────────────────
// `status`: active | inactive
export const languageSettings = [
  { _id: 'lg-001', language_name: 'English', language_code: 'en', is_default: true, status: 'active' },
  { _id: 'lg-002', language_name: 'Spanish', language_code: 'es', is_default: false, status: 'active' },
  { _id: 'lg-003', language_name: 'French', language_code: 'fr', is_default: false, status: 'active' },
  { _id: 'lg-004', language_name: 'Hindi', language_code: 'hi', is_default: false, status: 'active' },
  { _id: 'lg-005', language_name: 'Arabic', language_code: 'ar', is_default: false, status: 'inactive' },
]

// ─── Captcha Settings ─────────────────────────────────────────────────────────
export const captchaSettings = {
  captcha_provider: 'Google reCAPTCHA',
  site_key: '6Lc1234567890abcdef',
  secret_key: '6Lc_secret_1234567890',
  captcha_enabled: true,
  theme: 'light',
}

// ─── Modules ──────────────────────────────────────────────────────────────────
export const modules = [
  { _id: 'mod-001', module_name: 'Students', display_name: 'Students', is_enabled: true, display_order: 1, icon: 'GraduationCap', description: 'Manage student admissions and records' },
  { _id: 'mod-002', module_name: 'Academics', display_name: 'Academics', is_enabled: true, display_order: 2, icon: 'BookOpen', description: 'Classes, sections, subjects, timetable' },
  { _id: 'mod-003', module_name: 'Attendance', display_name: 'Attendance', is_enabled: true, display_order: 3, icon: 'CalendarCheck', description: 'Student and staff attendance' },
  { _id: 'mod-004', module_name: 'Fees', display_name: 'Fees', is_enabled: true, display_order: 4, icon: 'DollarSign', description: 'Fee collection and invoices' },
  { _id: 'mod-005', module_name: 'HR', display_name: 'HR', display_name_full: 'Human Resources', is_enabled: true, display_order: 5, icon: 'Users', description: 'Staff management and payroll' },
  { _id: 'mod-006', module_name: 'Library', display_name: 'Library', is_enabled: true, display_order: 6, icon: 'Library', description: 'Books, issues, and returns' },
  { _id: 'mod-007', module_name: 'Transport', display_name: 'Transport', is_enabled: true, display_order: 7, icon: 'Bus', description: 'Routes, vehicles, and drivers' },
  { _id: 'mod-008', module_name: 'Hostel', display_name: 'Hostel', is_enabled: true, display_order: 8, icon: 'BedDouble', description: 'Rooms, allocations, and fees' },
  { _id: 'mod-009', module_name: 'Inventory', display_name: 'Inventory', is_enabled: false, display_order: 9, icon: 'Boxes', description: 'Stock and asset management' },
  { _id: 'mod-010', module_name: 'Front Office', display_name: 'Front Office', is_enabled: true, display_order: 10, icon: 'ConciergeBell', description: 'Visitors and inquiries' },
]

// ─── Front CMS Settings ───────────────────────────────────────────────────────
export const frontCmsSettings = {
  site_title: 'Scholaria International School',
  tagline: 'Empowering minds, shaping futures',
  footer_text: '© 2025 Scholaria International School. All rights reserved.',
  social_facebook: 'https://facebook.com/scholaria',
  social_twitter: 'https://twitter.com/scholaria',
  social_instagram: 'https://instagram.com/scholaria',
  social_youtube: 'https://youtube.com/scholaria',
  contact_email: 'contact@scholaria.edu',
  contact_phone: '+91 98765 43210',
  maintenance_mode: false,
}

// ─── Custom Fields ────────────────────────────────────────────────────────────
// `field_type`: text | textarea | number | date | select
// `module`: Student | Staff | Library | Transport
export const customFields = [
  { _id: 'cf-001', field_name: 'blood_group', field_label: 'Blood Group', field_type: 'select', module: 'Student', is_required: false, options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], status: 'active', createdAt: '2024-02-01T00:00:00Z' },
  { _id: 'cf-002', field_name: 'father_occupation', field_label: 'Father Occupation', field_type: 'text', module: 'Student', is_required: true, options: [], status: 'active', createdAt: '2024-02-02T00:00:00Z' },
  { _id: 'cf-003', field_name: 'previous_school', field_label: 'Previous School', field_type: 'textarea', module: 'Student', is_required: false, options: [], status: 'active', createdAt: '2024-02-03T00:00:00Z' },
  { _id: 'cf-004', field_name: 'employee_id', field_label: 'Employee ID', field_type: 'text', module: 'Staff', is_required: true, options: [], status: 'active', createdAt: '2024-02-04T00:00:00Z' },
  { _id: 'cf-005', field_name: 'isbn', field_label: 'ISBN', field_type: 'text', module: 'Library', is_required: true, options: [], status: 'active', createdAt: '2024-02-05T00:00:00Z' },
  { _id: 'cf-006', field_name: 'route_number', field_label: 'Route Number', field_type: 'select', module: 'Transport', is_required: true, options: ['Route 1', 'Route 2', 'Route 3'], status: 'inactive', createdAt: '2024-02-06T00:00:00Z' },
]

// ─── System Fields ────────────────────────────────────────────────────────────
export const systemFields = [
  { _id: 'sf-001', field_name: 'admission_no', field_label: 'Admission Number', module: 'Student', is_required: true, is_visible: true, display_order: 1, status: 'active' },
  { _id: 'sf-002', field_name: 'roll_no', field_label: 'Roll Number', module: 'Student', is_required: true, is_visible: true, display_order: 2, status: 'active' },
  { _id: 'sf-003', field_name: 'class', field_label: 'Class', module: 'Student', is_required: true, is_visible: true, display_order: 3, status: 'active' },
  { _id: 'sf-004', field_name: 'section', field_label: 'Section', module: 'Student', is_required: false, is_visible: true, display_order: 4, status: 'active' },
  { _id: 'sf-005', field_name: 'dob', field_label: 'Date of Birth', module: 'Student', is_required: true, is_visible: true, display_order: 5, status: 'active' },
  { _id: 'sf-006', field_name: 'gender', field_label: 'Gender', module: 'Student', is_required: false, is_visible: false, display_order: 6, status: 'inactive' },
]

// ─── File Types ───────────────────────────────────────────────────────────────
// `category`: image | document | video
export const fileTypes = [
  { _id: 'ft-001', extension: '.jpg', mime_type: 'image/jpeg', max_size: 5, is_allowed: true, category: 'image', status: 'active' },
  { _id: 'ft-002', extension: '.png', mime_type: 'image/png', max_size: 5, is_allowed: true, category: 'image', status: 'active' },
  { _id: 'ft-003', extension: '.pdf', mime_type: 'application/pdf', max_size: 10, is_allowed: true, category: 'document', status: 'active' },
  { _id: 'ft-004', extension: '.docx', mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', max_size: 10, is_allowed: true, category: 'document', status: 'active' },
  { _id: 'ft-005', extension: '.xlsx', mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', max_size: 10, is_allowed: true, category: 'document', status: 'active' },
  { _id: 'ft-006', extension: '.mp4', mime_type: 'video/mp4', max_size: 100, is_allowed: false, category: 'video', status: 'inactive' },
]

// ─── Settings Dashboard Stats ────────────────────────────────────────────────
export const settingsStats = {
  total_sessions: sessionSettings.length,
  active_sessions: sessionSettings.filter((s) => s.status === 'active').length,
  total_roles: rolePermissions.length,
  total_users: userSettings.length,
  active_users: userSettings.filter((u) => u.status === 'active').length,
  total_currencies: currencySettings.length,
  total_languages: languageSettings.length,
  enabled_modules: modules.filter((m) => m.is_enabled).length,
  total_custom_fields: customFields.length,
  total_system_fields: systemFields.length,
}
=======
// // ─── Settings Module Mock Data ──────────────────────────────────────────────────
// // All structures mirror the backend settings model field names.
// // INTEGRATION: delete this file once real endpoints are wired in
// // settings.service.js. Only the service imports this file.

// // ─── General Settings ────────────────────────────────────────────────────────
// export const generalSettings = {
//   school_name: 'Scholaria International School',
//   school_code: 'SIS-2024',
//   address: '123 Education Lane, Knowledge City, 110001',
//   phone: '+91 98765 43210',
//   email: 'info@scholaria.edu',
//   website: 'https://scholaria.edu',
//   logo_url: 'https://scholaria.edu/logo.png',
//   favicon_url: 'https://scholaria.edu/favicon.ico',
//   academic_year: '2024-2025',
//   date_format: 'DD/MM/YYYY',
//   timezone: 'Asia/Kolkata',
//   language: 'en',
//   currency: 'INR',
// }

// // ─── Session Settings ─────────────────────────────────────────────────────────
// // `status`: active | inactive
// export const sessionSettings = [
//   { _id: 'ss-001', session_name: '2024-2025', start_date: '2024-04-01', end_date: '2025-03-31', is_current: true, status: 'active' },
//   { _id: 'ss-002', session_name: '2023-2024', start_date: '2023-04-01', end_date: '2024-03-31', is_current: false, status: 'inactive' },
//   { _id: 'ss-003', session_name: '2022-2023', start_date: '2022-04-01', end_date: '2023-03-31', is_current: false, status: 'inactive' },
//   { _id: 'ss-004', session_name: '2025-2026', start_date: '2025-04-01', end_date: '2026-03-31', is_current: false, status: 'active' },
//   { _id: 'ss-005', session_name: '2021-2022', start_date: '2021-04-01', end_date: '2022-03-31', is_current: false, status: 'inactive' },
// ]

// // ─── Role Permissions ────────────────────────────────────────────────────────
// // `permissions` is an object keyed by module name with boolean values.
// export const rolePermissions = [
//   {
//     _id: 'rp-001',
//     role_name: 'Admin',
//     permissions: { Students: true, Academics: true, Attendance: true, Fees: true, HR: true, Library: true, Transport: true, Hostel: true, Inventory: true, Settings: true },
//     description: 'Full system access across all modules',
//     status: 'active',
//     createdAt: '2024-01-01T00:00:00Z',
//   },
//   {
//     _id: 'rp-002',
//     role_name: 'Teacher',
//     permissions: { Students: true, Academics: true, Attendance: true, Fees: false, HR: false, Library: true, Transport: false, Hostel: false, Inventory: false, Settings: false },
//     description: 'Manage students, academics, and attendance',
//     status: 'active',
//     createdAt: '2024-01-02T00:00:00Z',
//   },
//   {
//     _id: 'rp-003',
//     role_name: 'Accountant',
//     permissions: { Students: true, Academics: false, Attendance: false, Fees: true, HR: true, Library: false, Transport: false, Hostel: false, Inventory: false, Settings: false },
//     description: 'Manage fees, payments, and HR payroll',
//     status: 'active',
//     createdAt: '2024-01-03T00:00:00Z',
//   },
//   {
//     _id: 'rp-004',
//     role_name: 'Librarian',
//     permissions: { Students: true, Academics: false, Attendance: false, Fees: false, HR: false, Library: true, Transport: false, Hostel: false, Inventory: true, Settings: false },
//     description: 'Manage library books and inventory',
//     status: 'active',
//     createdAt: '2024-01-04T00:00:00Z',
//   },
//   {
//     _id: 'rp-005',
//     role_name: 'Receptionist',
//     permissions: { Students: true, Academics: false, Attendance: false, Fees: false, HR: false, Library: false, Transport: false, Hostel: false, Inventory: false, Settings: false },
//     description: 'Front office and student inquiries',
//     status: 'active',
//     createdAt: '2024-01-05T00:00:00Z',
//   },
//   {
//     _id: 'rp-006',
//     role_name: 'Super Admin',
//     permissions: { Students: true, Academics: true, Attendance: true, Fees: true, HR: true, Library: true, Transport: true, Hostel: true, Inventory: true, Settings: true },
//     description: 'Unrestricted access including system settings',
//     status: 'active',
//     createdAt: '2024-01-06T00:00:00Z',
//   },
// ]

// // ─── User Settings ────────────────────────────────────────────────────────────
// // `status`: active | inactive
// export const userSettings = [
//   { _id: 'us-001', name: 'Aarav Sharma', email: 'aarav.sharma@scholaria.edu', role: 'Admin', status: 'active', last_login: '2025-01-15T10:30:00Z', created_at: '2024-01-01T00:00:00Z' },
//   { _id: 'us-002', name: 'Emma Wilson', email: 'emma.wilson@scholaria.edu', role: 'Teacher', status: 'active', last_login: '2025-01-14T08:15:00Z', created_at: '2024-01-02T00:00:00Z' },
//   { _id: 'us-003', name: 'Liam Chen', email: 'liam.chen@scholaria.edu', role: 'Accountant', status: 'active', last_login: '2025-01-13T14:45:00Z', created_at: '2024-01-03T00:00:00Z' },
//   { _id: 'us-004', name: 'Sophia Garcia', email: 'sophia.garcia@scholaria.edu', role: 'Librarian', status: 'active', last_login: '2025-01-12T11:20:00Z', created_at: '2024-01-04T00:00:00Z' },
//   { _id: 'us-005', name: 'Noah Brown', email: 'noah.brown@scholaria.edu', role: 'Receptionist', status: 'inactive', last_login: '2024-12-20T09:00:00Z', created_at: '2024-01-05T00:00:00Z' },
//   { _id: 'us-006', name: 'Olivia Davis', email: 'olivia.davis@scholaria.edu', role: 'Teacher', status: 'active', last_login: '2025-01-15T07:30:00Z', created_at: '2024-01-06T00:00:00Z' },
//   { _id: 'us-007', name: 'Ethan Lee', email: 'ethan.lee@scholaria.edu', role: 'Super Admin', status: 'active', last_login: '2025-01-15T16:10:00Z', created_at: '2024-01-07T00:00:00Z' },
//   { _id: 'us-008', name: 'Ava Martinez', email: 'ava.martinez@scholaria.edu', role: 'Teacher', status: 'active', last_login: '2025-01-14T13:00:00Z', created_at: '2024-01-08T00:00:00Z' },
// ]

// // ─── Notification Settings ────────────────────────────────────────────────────
// export const notificationSettings = {
//   email_notifications: true,
//   sms_notifications: false,
//   push_notifications: true,
//   admission_alerts: true,
//   fee_payment_alerts: true,
//   attendance_alerts: true,
//   exam_result_alerts: true,
//   library_alerts: false,
// }

// // ─── SMS Settings ─────────────────────────────────────────────────────────────
// export const smsSettings = {
//   sms_gateway: 'Twilio',
//   api_key: 'SK1234567890abcdef',
//   sender_id: 'SCHLR',
//   sms_enabled: true,
//   balance: 1250,
//   sms_template: 'Dear {parent_name}, your child {student_name} was absent on {date}.',
// }

// // ─── Payment Settings ─────────────────────────────────────────────────────────
// export const paymentSettings = {
//   payment_gateway: 'Stripe',
//   api_key: 'pk_test_1234567890',
//   secret_key: 'sk_test_1234567890',
//   sandbox_mode: true,
//   currency: 'INR',
//   payment_enabled: true,
// }

// // ─── Currency Settings ────────────────────────────────────────────────────────
// // `status`: active | inactive
// export const currencySettings = [
//   { _id: 'cr-001', currency_code: 'USD', currency_name: 'US Dollar', symbol: '$', exchange_rate: 1, is_default: false, status: 'active' },
//   { _id: 'cr-002', currency_code: 'EUR', currency_name: 'Euro', symbol: '€', exchange_rate: 0.92, is_default: false, status: 'active' },
//   { _id: 'cr-003', currency_code: 'GBP', currency_name: 'British Pound', symbol: '£', exchange_rate: 0.79, is_default: false, status: 'active' },
//   { _id: 'cr-004', currency_code: 'INR', currency_name: 'Indian Rupee', symbol: '₹', exchange_rate: 83.2, is_default: true, status: 'active' },
//   { _id: 'cr-005', currency_code: 'JPY', currency_name: 'Japanese Yen', symbol: '¥', exchange_rate: 149.5, is_default: false, status: 'inactive' },
// ]

// // ─── Language Settings ────────────────────────────────────────────────────────
// // `status`: active | inactive
// export const languageSettings = [
//   { _id: 'lg-001', language_name: 'English', language_code: 'en', is_default: true, status: 'active' },
//   { _id: 'lg-002', language_name: 'Spanish', language_code: 'es', is_default: false, status: 'active' },
//   { _id: 'lg-003', language_name: 'French', language_code: 'fr', is_default: false, status: 'active' },
//   { _id: 'lg-004', language_name: 'Hindi', language_code: 'hi', is_default: false, status: 'active' },
//   { _id: 'lg-005', language_name: 'Arabic', language_code: 'ar', is_default: false, status: 'inactive' },
// ]

// // ─── Captcha Settings ─────────────────────────────────────────────────────────
// export const captchaSettings = {
//   captcha_provider: 'Google reCAPTCHA',
//   site_key: '6Lc1234567890abcdef',
//   secret_key: '6Lc_secret_1234567890',
//   captcha_enabled: true,
//   theme: 'light',
// }

// // ─── Modules ──────────────────────────────────────────────────────────────────
// export const modules = [
//   { _id: 'mod-001', module_name: 'Students', display_name: 'Students', is_enabled: true, display_order: 1, icon: 'GraduationCap', description: 'Manage student admissions and records' },
//   { _id: 'mod-002', module_name: 'Academics', display_name: 'Academics', is_enabled: true, display_order: 2, icon: 'BookOpen', description: 'Classes, sections, subjects, timetable' },
//   { _id: 'mod-003', module_name: 'Attendance', display_name: 'Attendance', is_enabled: true, display_order: 3, icon: 'CalendarCheck', description: 'Student and staff attendance' },
//   { _id: 'mod-004', module_name: 'Fees', display_name: 'Fees', is_enabled: true, display_order: 4, icon: 'DollarSign', description: 'Fee collection and invoices' },
//   { _id: 'mod-005', module_name: 'HR', display_name: 'HR', display_name_full: 'Human Resources', is_enabled: true, display_order: 5, icon: 'Users', description: 'Staff management and payroll' },
//   { _id: 'mod-006', module_name: 'Library', display_name: 'Library', is_enabled: true, display_order: 6, icon: 'Library', description: 'Books, issues, and returns' },
//   { _id: 'mod-007', module_name: 'Transport', display_name: 'Transport', is_enabled: true, display_order: 7, icon: 'Bus', description: 'Routes, vehicles, and drivers' },
//   { _id: 'mod-008', module_name: 'Hostel', display_name: 'Hostel', is_enabled: true, display_order: 8, icon: 'BedDouble', description: 'Rooms, allocations, and fees' },
//   { _id: 'mod-009', module_name: 'Inventory', display_name: 'Inventory', is_enabled: false, display_order: 9, icon: 'Boxes', description: 'Stock and asset management' },
//   { _id: 'mod-010', module_name: 'Front Office', display_name: 'Front Office', is_enabled: true, display_order: 10, icon: 'ConciergeBell', description: 'Visitors and inquiries' },
// ]

// // ─── Front CMS Settings ───────────────────────────────────────────────────────
// export const frontCmsSettings = {
//   site_title: 'Scholaria International School',
//   tagline: 'Empowering minds, shaping futures',
//   footer_text: '© 2025 Scholaria International School. All rights reserved.',
//   social_facebook: 'https://facebook.com/scholaria',
//   social_twitter: 'https://twitter.com/scholaria',
//   social_instagram: 'https://instagram.com/scholaria',
//   social_youtube: 'https://youtube.com/scholaria',
//   contact_email: 'contact@scholaria.edu',
//   contact_phone: '+91 98765 43210',
//   maintenance_mode: false,
// }

// // ─── Custom Fields ────────────────────────────────────────────────────────────
// // `field_type`: text | textarea | number | date | select
// // `module`: Student | Staff | Library | Transport
// export const customFields = [
//   { _id: 'cf-001', field_name: 'blood_group', field_label: 'Blood Group', field_type: 'select', module: 'Student', is_required: false, options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'], status: 'active', createdAt: '2024-02-01T00:00:00Z' },
//   { _id: 'cf-002', field_name: 'father_occupation', field_label: 'Father Occupation', field_type: 'text', module: 'Student', is_required: true, options: [], status: 'active', createdAt: '2024-02-02T00:00:00Z' },
//   { _id: 'cf-003', field_name: 'previous_school', field_label: 'Previous School', field_type: 'textarea', module: 'Student', is_required: false, options: [], status: 'active', createdAt: '2024-02-03T00:00:00Z' },
//   { _id: 'cf-004', field_name: 'employee_id', field_label: 'Employee ID', field_type: 'text', module: 'Staff', is_required: true, options: [], status: 'active', createdAt: '2024-02-04T00:00:00Z' },
//   { _id: 'cf-005', field_name: 'isbn', field_label: 'ISBN', field_type: 'text', module: 'Library', is_required: true, options: [], status: 'active', createdAt: '2024-02-05T00:00:00Z' },
//   { _id: 'cf-006', field_name: 'route_number', field_label: 'Route Number', field_type: 'select', module: 'Transport', is_required: true, options: ['Route 1', 'Route 2', 'Route 3'], status: 'inactive', createdAt: '2024-02-06T00:00:00Z' },
// ]

// // ─── System Fields ────────────────────────────────────────────────────────────
// export const systemFields = [
//   { _id: 'sf-001', field_name: 'admission_no', field_label: 'Admission Number', module: 'Student', is_required: true, is_visible: true, display_order: 1, status: 'active' },
//   { _id: 'sf-002', field_name: 'roll_no', field_label: 'Roll Number', module: 'Student', is_required: true, is_visible: true, display_order: 2, status: 'active' },
//   { _id: 'sf-003', field_name: 'class', field_label: 'Class', module: 'Student', is_required: true, is_visible: true, display_order: 3, status: 'active' },
//   { _id: 'sf-004', field_name: 'section', field_label: 'Section', module: 'Student', is_required: false, is_visible: true, display_order: 4, status: 'active' },
//   { _id: 'sf-005', field_name: 'dob', field_label: 'Date of Birth', module: 'Student', is_required: true, is_visible: true, display_order: 5, status: 'active' },
//   { _id: 'sf-006', field_name: 'gender', field_label: 'Gender', module: 'Student', is_required: false, is_visible: false, display_order: 6, status: 'inactive' },
// ]

// // ─── File Types ───────────────────────────────────────────────────────────────
// // `category`: image | document | video
// export const fileTypes = [
//   { _id: 'ft-001', extension: '.jpg', mime_type: 'image/jpeg', max_size: 5, is_allowed: true, category: 'image', status: 'active' },
//   { _id: 'ft-002', extension: '.png', mime_type: 'image/png', max_size: 5, is_allowed: true, category: 'image', status: 'active' },
//   { _id: 'ft-003', extension: '.pdf', mime_type: 'application/pdf', max_size: 10, is_allowed: true, category: 'document', status: 'active' },
//   { _id: 'ft-004', extension: '.docx', mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', max_size: 10, is_allowed: true, category: 'document', status: 'active' },
//   { _id: 'ft-005', extension: '.xlsx', mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', max_size: 10, is_allowed: true, category: 'document', status: 'active' },
//   { _id: 'ft-006', extension: '.mp4', mime_type: 'video/mp4', max_size: 100, is_allowed: false, category: 'video', status: 'inactive' },
// ]

// // ─── Settings Dashboard Stats ────────────────────────────────────────────────
// export const settingsStats = {
//   total_sessions: sessionSettings.length,
//   active_sessions: sessionSettings.filter((s) => s.status === 'active').length,
//   total_roles: rolePermissions.length,
//   total_users: userSettings.length,
//   active_users: userSettings.filter((u) => u.status === 'active').length,
//   total_currencies: currencySettings.length,
//   total_languages: languageSettings.length,
//   enabled_modules: modules.filter((m) => m.is_enabled).length,
//   total_custom_fields: customFields.length,
//   total_system_fields: systemFields.length,
// }
>>>>>>> e863ed6 (Updated  files)
