// Dev-only mock data for the Users / Roles module.
// INTEGRATION: delete this file once real endpoints are wired in users.service.js.

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
