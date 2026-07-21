// Navigation + domain constants aligned with School_erp-b-main backend modules.

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', to: '/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    label: 'Institution Management',
    items: [
      { title: 'Schools', to: '/schools', icon: 'School' },
      { title: 'Colleges', to: '/colleges', icon: 'Building2' },
      { title: 'Domains', to: '/domains', icon: 'Globe' },
    ],
  },
  {
    label: 'Student Management',
    items: [
      { title: 'Students', to: '/students', icon: 'GraduationCap' },
      { title: 'Student Profile', to: '/students/profile', icon: 'UserSquare' },
      { title: 'Admissions', to: '/students/admissions', icon: 'ClipboardList' },
    ],
  },
  {
    label: 'Academics',
    items: [
      { title: 'Classes', to: '/academics/classes', icon: 'BookOpen' },
      { title: 'Sections', to: '/academics/sections', icon: 'Layers' },
      { title: 'Subjects', to: '/academics/subjects', icon: 'Library' },
      { title: 'Timetable', to: '/academics/timetable', icon: 'CalendarClock' },
    ],
  },
  {
    label: 'Attendance',
    items: [
      { title: 'Student Attendance', to: '/attendance', icon: 'ClipboardCheck' },
      { title: 'Approve Leave', to: '/attendance/approve-leave', icon: 'CalendarCheck' },
      { title: 'Attendance By Date', to: '/attendance/by-date', icon: 'CalendarDays' },
    ],
  },
  {
    label: 'User Management',
    items: [
      { title: 'Users', to: '/users', icon: 'Users' },
      { title: 'Roles', to: '/users/roles', icon: 'ShieldCheck' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { title: 'Super Admin', to: '/super-admin', icon: 'Crown' },
      { title: 'Settings', to: '/settings', icon: 'Settings' },
    ],
  },
  {
    label: 'Front Office',
    items: [
      { title: 'Admission Enquiry', to: '/front-office/enquiry', icon: 'ClipboardList' },
      { title: 'Visitor Book', to: '/front-office/visitor-book', icon: 'DoorOpen' },
      { title: 'Phone Call Log', to: '/front-office/call-log', icon: 'PhoneCall' },
      { title: 'Postal Dispatch', to: '/front-office/dispatch', icon: 'Send' },
      { title: 'Postal Receive', to: '/front-office/receive', icon: 'Inbox' },
      { title: 'Complaint', to: '/front-office/complaint', icon: 'MessageSquare' },
      { title: 'Setup Front Office', to: '/front-office/setup', icon: 'Settings' },
    ],
  },
]

export const APP_NAME = 'Scholaria ERP'
export const APP_VERSION = '1.0.0'

export const STORAGE_KEYS = {
  AUTH: 'scholaria.auth',
  THEME: 'scholaria.theme',
}

// Roles as defined in the backend (centralModels.js + users.controller.js).
export const USER_ROLES = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  STAFF: 'staff',
  STUDENT: 'student',
  PARENT: 'parent',
}

export const ROLE_LABELS = {
  superadmin: 'Super Admin',
  admin: 'Administrator',
  staff: 'Staff',
  student: 'Student',
  parent: 'Parent',
}

// Status enum matches centralModels.js / hrModel.js.
export const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

export const STATUS_STYLES = {
  active: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-border',
  pending: 'bg-warning/10 text-warning border-warning/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
}

// Leave request status (hrModel.js applyLeaveSchema).
export const LEAVE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]
